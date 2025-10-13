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

      // دریافت توکن پرداخت
      const tokenResponse = await userApiService.getSamanToken(
        order.id,
        order.total,
        order.address?.phone || ''
      );

      if (tokenResponse.success && tokenResponse.data?.token) {
        // هدایت به درگاه پرداخت
        window.location.href = `https://sep.shaparak.ir/OnlinePG/OnlinePG?Token=${tokenResponse.data.token}`;
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
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        bgColor: 'bg-yellow-500',
        icon: '⏳'
      },
      paid: { 
        text: 'پرداخت شده', 
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        bgColor: 'bg-blue-500',
        icon: '✅'
      },
      processing: { 
        text: 'در حال پردازش', 
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        bgColor: 'bg-purple-500',
        icon: '⚙️'
      },
      preparing: { 
        text: 'در حال آماده‌سازی', 
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        bgColor: 'bg-indigo-500',
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
        date: null,
        targetStatus: 'processing'
      },
      { 
        name: 'آماده‌سازی', 
        key: 'preparing',
        status: 'pending',
        date: null,
        targetStatus: 'preparing'
      },
      { 
        name: 'تحویل به پست', 
        key: 'shipped',
        status: 'pending',
        date: null,
        targetStatus: 'shipped'
      },
      { 
        name: 'تحویل داده شد', 
        key: 'delivered',
        status: 'pending',
        date: null,
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
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
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
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-6xl mb-4">😔</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">سفارش یافت نشد</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/profile"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    بازگشت به پروفایل
                  </Link>
                  <Link 
                    href="/products"
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      سفارش #{order.id}
                    </h1>
                    <span className={`px-4 py-2 rounded-full border-2 ${statusInfo.color} flex items-center gap-2 text-sm font-semibold`}>
                      <span className="text-lg">{statusInfo.icon}</span>
                      {statusInfo.text}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="w-5">📅</span>
                      <span>تاریخ ثبت: {formatDate(order.createdAt)}</span>
                    </div>
                    {order.paidAt && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="w-5">💳</span>
                        <span>تاریخ پرداخت: {formatDate(order.paidAt)}</span>
                      </div>
                    )}
                    {order.trackingCode && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="w-5">🚚</span>
                        <span>کد رهگیری: <span className="font-mono font-bold text-blue-600 text-base">{order.trackingCode}</span></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* دکمه پرداخت برای سفارش‌های در انتظار پرداخت */}
                {isPendingPayment && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handlePayment}
                      disabled={processingPayment}
                      className={`bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-semibold text-lg flex items-center justify-center gap-3 min-w-48 ${
                        processingPayment ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingPayment ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>در حال اتصال...</span>
                        </>
                      ) : (
                        <>
                          <span>💳</span>
                          <span>پرداخت سفارش</span>
                        </>
                      )}
                    </button>
                    <p className="text-sm text-gray-600 text-center">
                      مبلغ: <span className="font-bold text-green-700">{formatPrice(order.total)}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* نمایش خطا */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <span>⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">روند سفارش</h2>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute right-0 left-0 top-6 h-2 bg-gray-200 rounded-full z-0"></div>
                <div 
                  className="absolute right-0 top-6 h-2 bg-green-500 rounded-full z-0 transition-all duration-500"
                  style={{
                    width: `${(steps.filter(step => step.status === 'completed').length / (steps.length - 1)) * 100}%`
                  }}
                ></div>

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 transition-all duration-300 ${
                        step.status === 'completed' 
                          ? 'bg-green-500 shadow-lg transform scale-110' 
                          : step.status === 'current'
                          ? 'bg-blue-500 shadow-lg transform scale-110'
                          : step.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-gray-300'
                      }`}>
                        {step.status === 'completed' ? '✓' : 
                         step.status === 'cancelled' ? '✕' : 
                         index + 1}
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold text-sm ${
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Main Content - 2/3 width */}
              <div className="xl:col-span-2 space-y-8">
                
                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">محصولات سفارش</h2>
                  <div className="space-y-6">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <img 
                            src={item.product?.image || '/images/placeholdesairon-logo.png'} 
                            alt={item.product?.name}
                            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.src = '/images/placeholdesairon-logo.png';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
                            {item.product?.name || 'محصول'}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>تعداد: {item.quantity}</span>
                            <span>قیمت واحد: {formatPrice(item.price)}</span>
                          </div>
                        </div>
                        
                        <div className="text-left min-w-32">
                          <p className="font-bold text-gray-900 text-lg">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-8">
                
                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">خلاصه سفارش</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">جمع کل:</span>
                      <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
                    </div>
                    
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">تخفیف:</span>
                        <span className="font-semibold text-green-600">-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    
                    {order.shippingCost > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">هزینه ارسال:</span>
                        <span className="font-semibold text-gray-900">{formatPrice(order.shippingCost)}</span>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span className="text-gray-900">مبلغ قابل پرداخت:</span>
                        <span className="text-blue-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">اطلاعات ارسال</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 text-sm">روش ارسال:</span>
                      <span className="font-semibold text-gray-900">
                        {order.shippingMethod === 'express' ? 'پست پیشتاز' : 
                         order.shippingMethod === 'regular' ? 'پست معمولی' : 
                         order.shippingMethod}
                      </span>
                    </div>
                    
                    {order.trackingCode && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 text-sm">کد رهگیری پست:</span>
                        <span className="font-mono font-bold text-blue-600 text-base">{order.trackingCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
                  {isPendingPayment ? (
                    <button
                      onClick={handlePayment}
                      disabled={processingPayment}
                      className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg text-center font-semibold text-lg flex items-center justify-center gap-3 ${
                        processingPayment ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingPayment ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                      href="/profile"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg text-center block font-semibold text-lg"
                    >
                      بازگشت به پروفایل
                    </Link>
                  )}
                  
                  <Link 
                    href="/products"
                    className="w-full border border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-colors text-center block font-semibold"
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