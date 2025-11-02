// app/orders/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { withUserAuth } from '@/components/WithUserAuth';
import { userApiService } from '@/services/api';

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // دریافت جزئیات سفارش
  const fetchOrderDetails = async () => {
    try {
      setError(null);
      const response = await userApiService.getOrderDetails(orderId);
      
      if (response.success) {
        setOrder(response.data);
      } else {
        if (response.code === 'ORDER_NOT_FOUND') {
          setError('سفارش مورد نظر یافت نشد');
        } else {
          throw new Error(response.message || 'خطا در دریافت اطلاعات سفارش');
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      if (error.response?.status === 404) {
        setError('سفارش مورد نظر یافت نشد');
      } else if (error.response?.status === 401) {
        router.push('/sign-in');
        return;
      } else {
        setError(error.message || 'خطا در دریافت اطلاعات سفارش');
      }
    } finally {
      setLoading(false);
    }
  };

  // پرداخت سفارش
  const handlePayment = async () => {
    if (!order || processingPayment) return;

    try {
      setProcessingPayment(true);
      setError(null);

      // دریافت توکن پرداخت - اصلاح شده
      const tokenResponse = await userApiService.getSamanToken(
        order.id,
        order.total * 10, // تبدیل به ریال
        order.address?.phone || '' // اصلاح شده
      );

      if (tokenResponse.success && tokenResponse.data?.token) {
        // هدایت به درگاه پرداخت
        const form = document.createElement("form");
        form.method = "POST";
        form.action = tokenResponse.data.paymentUrl;

        const tokenInput = document.createElement("input");
        tokenInput.type = "hidden";
        tokenInput.name = "Token";
        tokenInput.value = tokenResponse.data.token;
        form.appendChild(tokenInput);

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error(tokenResponse.message || 'خطا در اتصال به درگاه پرداخت');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'خطا در انجام پرداخت');
    } finally {
      setProcessingPayment(false);
    }
  };

  // تبدیل تاریخ به فرمت فارسی
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // تبدیل وضعیت به فارسی و رنگ
  const getStatusInfo = (status) => {
    const statusMap = {
      pending_payment: { 
        text: 'در انتظار پرداخت', 
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        bgColor: 'bg-amber-500',
        icon: '⏳'
      },
      paid: { 
        text: 'پرداخت شده', 
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        bgColor: 'bg-emerald-500',
        icon: '✅'
      },
      processing: { 
        text: 'در حال پردازش', 
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        bgColor: 'bg-blue-500',
        icon: '⚙️'
      },
      preparing: { 
        text: 'در حال آماده‌سازی', 
        color: 'bg-violet-50 text-violet-700 border-violet-200',
        bgColor: 'bg-violet-500',
        icon: '📦'
      },
      shipped: { 
        text: 'تحویل به پست', 
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        bgColor: 'bg-orange-500',
        icon: '🚚'
      },
      delivered: { 
        text: 'تحویل داده شده', 
        color: 'bg-green-50 text-green-700 border-green-200',
        bgColor: 'bg-green-500',
        icon: '🎉'
      },
      cancelled: { 
        text: 'لغو شده', 
        color: 'bg-red-50 text-red-700 border-red-200',
        bgColor: 'bg-red-500',
        icon: '❌'
      }
    };
    return statusMap[status] || { 
      text: status, 
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      bgColor: 'bg-gray-500',
      icon: '❓'
    };
  };

  // فرمت قیمت
  const formatPrice = (price) => {
    return price ? new Intl.NumberFormat('fa-IR').format(price) + ' تومان' : '۰ تومان';
  };

  // ایجاد مراحل سفارش
  const getOrderSteps = (order) => {
    const steps = [
      { 
        name: 'پرداخت', 
        key: 'payment',
        status: 'pending',
        date: order.paidAt,
        targetStatus: 'paid'
      },
      { 
        name: 'در حال پردازش', 
        key: 'processing',
        status: 'pending',
        date: order.processingAt,
        targetStatus: 'processing'
      },
      { 
        name: 'آماده‌سازی', 
        key: 'preparing',
        status: 'pending',
        date: order.preparingAt,
        targetStatus: 'preparing'
      },
      { 
        name: 'تحویل به پست', 
        key: 'shipped',
        status: 'pending',
        date: order.shippedAt,
        targetStatus: 'shipped'
      },
      { 
        name: 'تحویل داده شد', 
        key: 'delivered',
        status: 'pending',
        date: order.deliveredAt,
        targetStatus: 'delivered'
      }
    ];

    const statusOrder = {
      pending_payment: 0,
      paid: 1,
      processing: 2,
      preparing: 3,
      shipped: 4,
      delivered: 5,
      cancelled: -1
    };

    const currentStatusIndex = statusOrder[order.status] || 0;

    if (order.status === 'cancelled') {
      steps.forEach(step => {
        step.status = 'cancelled';
      });
      return steps;
    }

    // تنظیم وضعیت مراحل بر اساس وضعیت فعلی
    steps.forEach((step, index) => {
      if (index < currentStatusIndex) {
        step.status = 'completed';
        // تنظیم تاریخ برای مراحل تکمیل شده
        if (index === 0 && order.paidAt) step.date = order.paidAt;
        if (index === 1 && order.processingAt) step.date = order.processingAt;
        if (index === 2 && order.preparingAt) step.date = order.preparingAt;
        if (index === 3 && order.shippedAt) step.date = order.shippedAt;
        if (index === 4 && order.deliveredAt) step.date = order.deliveredAt;
      } else if (index === currentStatusIndex) {
        step.status = 'current';
      } else {
        step.status = 'pending';
      }
    });

    return steps;
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // اسکلت لودینگ
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-pulse">
                <div className="h-7 bg-gray-300 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // صفحه خطا
  if (error && !order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-5xl mb-4">😔</div>
                <h1 className="text-xl font-bold text-gray-800 mb-3">سفارش یافت نشد</h1>
                <p className="text-gray-600 mb-5 text-sm">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/profile"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    بازگشت به پروفایل
                  </Link>
                  <Link 
                    href="/products"
                    className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    مشاهده محصولات
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) return null;

  const statusInfo = getStatusInfo(order.status);
  const steps = getOrderSteps(order);
  const isPendingPayment = order.status === 'pending_payment';
  const hasTrackingCode = order.trackingCode && (order.status === 'shipped' || order.status === 'delivered');

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-xl font-bold text-gray-900">
                      سفارش #{order.orderNumber || order.id}
                    </h1>
                    <span className={`px-3 py-1.5 rounded-full border ${statusInfo.color} flex items-center gap-1.5 text-xs font-semibold`}>
                      <span className="text-sm">{statusInfo.icon}</span>
                      {statusInfo.text}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="w-4">📅</span>
                      <span>تاریخ ثبت: {formatDate(order.createdAt)}</span>
                    </div>
                    {order.paidAt && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="w-4">💳</span>
                        <span>تاریخ پرداخت: {formatDate(order.paidAt)}</span>
                      </div>
                    )}
                    {hasTrackingCode && (
                      <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                        <span className="w-4">🚚</span>
                        <span>کد رهگیری: 
                          <span className="font-mono font-bold text-blue-600 text-sm mr-2">
                            {order.trackingCode}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* دکمه پرداخت برای سفارش‌های در انتظار پرداخت */}
                {isPendingPayment && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handlePayment}
                      disabled={processingPayment}
                      className={`bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-3 rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-md font-semibold text-sm flex items-center justify-center gap-2 min-w-40 ${
                        processingPayment ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>در حال اتصال...</span>
                        </>
                      ) : (
                        <>
                          <span>💳</span>
                          <span>پرداخت سفارش</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-600 text-center">
                      مبلغ: <span className="font-bold text-cyan-700">{formatPrice(order.total)}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* نمایش خطا */}
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 text-sm">
                    <span>⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">روند سفارش</h2>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute right-0 left-0 top-5 h-1.5 bg-gray-200 rounded-full z-0"></div>
                <div 
                  className="absolute right-0 top-5 h-1.5 bg-cyan-500 rounded-full z-0 transition-all duration-500"
                  style={{
                    width: `${(steps.filter(step => step.status === 'completed').length / (steps.length - 1)) * 100}%`
                  }}
                ></div>

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 transition-all duration-300 ${
                        step.status === 'completed' 
                          ? 'bg-cyan-500 shadow-md transform scale-105' 
                          : step.status === 'current'
                          ? 'bg-cyan-600 shadow-md transform scale-105'
                          : step.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}>
                        {step.status === 'completed' ? '✓' : 
                         step.status === 'cancelled' ? '✕' : 
                         index + 1}
                      </div>
                      <div className="text-center">
                        <p className={`font-medium text-xs ${
                          step.status === 'completed' || step.status === 'current'
                            ? 'text-gray-900'
                            : 'text-gray-500'
                        }`}>
                          {step.name}
                        </p>
                        {step.date && (
                          <p className="text-gray-400 text-xs mt-1">
                            {formatDate(step.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Main Content - 2/3 width */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">محصولات سفارش</h2>
                  <div className="space-y-4">
                    {order.items?.map((item, index) => {
                      // گرفتن اولین عکس از آرایه images
                    const productImages = item.product?.images || [];
    const productImage = productImages.length > 0 
      ? productImages.find(img => img.isMain)?.url || productImages[0]?.url
      : item.product?.image || '/images/placeholder.jpg';
                      
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0">
                            <img 
                              src={productImage}
                              alt={item.product?.name}
                              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {item.product?.name || 'محصول'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                              <span>تعداد: {item.quantity || 1}</span>
                              <span>قیمت واحد: {formatPrice(item.unitPrice || item.price)}</span>
                              {item.discount > 0 && (
                                <span className="text-green-600">
                                  تخفیف: {formatPrice(item.discount)}
                                </span>
                              )}
                            </div>
                            {item.discountType === 'percentage' && item.discount > 0 && (
                              <div className="mt-1 text-xs text-green-600">
                                ({Math.round((item.discount / item.originalPrice) * 100)}% تخفیف)
                              </div>
                            )}
                          </div>
                          
                          <div className="text-left min-w-28">
                            <p className="font-semibold text-gray-900 text-sm">
                              {formatPrice((item.unitPrice || item.price || 0) * (item.quantity || 1))}
                            </p>
                            {item.originalPrice > item.unitPrice && (
                              <p className="text-xs text-gray-500 line-through mt-1">
                                {formatPrice(item.originalPrice * (item.quantity || 1))}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.address && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">آدرس ارسال</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">تحویل‌گیرنده:</span>
                          <span className="font-medium text-gray-900">
                            {order.address.receiver}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">شماره تماس:</span>
                          <span className="font-medium text-gray-900">{order.address.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">آدرس:</span>
                          <span className="font-medium text-gray-900 text-left">
                            {order.address.province}، {order.address.city}
                            <br />
                            {order.address.address}
                          </span>
                        </div>
                        {order.address.postalCode && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">کد پستی:</span>
                            <span className="font-medium text-gray-900">{order.address.postalCode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">خلاصه سفارش</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">جمع کل:</span>
                      <span className="font-semibold text-gray-900 text-sm">{formatPrice(order.subtotal)}</span>
                    </div>
                    
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm">تخفیف:</span>
                        <span className="font-semibold text-green-600 text-sm">-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">هزینه ارسال:</span>
                      <span className={`font-semibold text-sm ${
                        order.shippingCost === 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {order.shippingCost === 0 ? 'رایگان' : formatPrice(order.shippingCost)}
                      </span>
                    </div>
                    
                    <div className="pt-3">
                      <div className="flex justify-between items-center text-base font-bold">
                        <span className="text-gray-900">مبلغ قابل پرداخت:</span>
                        <span className="text-cyan-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">اطلاعات ارسال</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600 text-sm">روش ارسال:</span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {order.shippingMethod === 'express' ? 'پست پیشتاز' : 
                         order.shippingMethod === 'regular' ? 'پست معمولی' : 
                         order.shippingMethod || 'استاندارد'}
                      </span>
                    </div>
                    
                    {hasTrackingCode && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600 text-sm">کد رهگیری:</span>
                        <span className="font-mono font-bold text-blue-600 text-sm">{order.trackingCode}</span>
                      </div>
                    )}

                    {order.shippingCost === 0 && (
                      <div className="bg-green-50 rounded-lg p-3 mt-2 border border-green-200">
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                          <span>🎁</span>
                          <span>ارسال رایگان - سود شما: ۶۹,۰۰۰ تومان</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                  {isPendingPayment ? (
                    <button
                      onClick={handlePayment}
                      disabled={processingPayment}
                      className={`w-full bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-md text-center font-semibold text-sm flex items-center justify-center gap-2 ${
                        processingPayment ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>در حال اتصال...</span>
                        </>
                      ) : (
                        <>
                          <span>💳</span>
                          <span>پرداخت سفارش</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link 
                      href="/profile/orders"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md text-center block font-semibold text-sm"
                    >
                      بازگشت به سفارشات
                    </Link>
                  )}
                  
                  <Link 
                    href="/products"
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center block font-semibold text-sm"
                  >
                    مشاهده محصولات
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withUserAuth(OrderDetailsPage);