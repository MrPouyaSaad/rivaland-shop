// app/admin/orders/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CreditCardIcon, 
  UserIcon, 
  PhoneIcon, 
  MapPinIcon, 
  EnvelopeIcon,
  PrinterIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { adminApiService } from '@/services/api';

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // دریافت جزئیات سفارش
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminApiService.getAdminOrderDetails(orderId);
      
      if (response.success) {
        setOrder(response.data);
        setSelectedStatus(response.data.status);
      } else {
        throw new Error(response.message || 'خطا در دریافت اطلاعات سفارش');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('خطا در دریافت اطلاعات سفارش');
    } finally {
      setLoading(false);
    }
  };

  // به‌روزرسانی وضعیت سفارش
  const updateOrderStatus = async () => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      
      const response = await adminApiService.updateOrderStatus(orderId, selectedStatus);
      
      if (response.success) {
        setOrder(prev => ({ ...prev, status: selectedStatus }));
        setSuccess('وضعیت سفارش با موفقیت به‌روزرسانی شد');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(response.message || 'خطا در به‌روزرسانی وضعیت');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('خطا در به‌روزرسانی وضعیت سفارش');
    } finally {
      setUpdating(false);
    }
  };

  // چاپ فاکتور
  const handlePrintInvoice = async () => {
    try {
      const response = await adminApiService.printOrderInvoice(orderId);
      if (response.success && response.data?.pdfUrl) {
        window.open(response.data.pdfUrl, '_blank');
      } else {
        throw new Error('خطا در تولید فاکتور');
      }
    } catch (error) {
      console.error('Error printing invoice:', error);
      setError('خطا در چاپ فاکتور');
    }
  };

  // لغو سفارش
  const handleCancelOrder = async () => {
    if (!confirm('آیا از لغو این سفارش مطمئن هستید؟')) return;
    
    try {
      setUpdating(true);
      setError('');
      
      const response = await adminApiService.cancelAdminOrder(orderId);
      
      if (response.success) {
        setOrder(prev => ({ ...prev, status: 'cancelled' }));
        setSelectedStatus('cancelled');
        setSuccess('سفارش با موفقیت لغو شد');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(response.message || 'خطا در لغو سفارش');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('خطا در لغو سفارش');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const statusOptions = [
    { value: 'pending_payment', label: 'در انتظار پرداخت', color: 'text-yellow-600' },
    { value: 'paid', label: 'پرداخت شده', color: 'text-blue-600' },
    { value: 'processing', label: 'در حال پردازش', color: 'text-purple-600' },
    { value: 'preparing', label: 'در حال آماده‌سازی', color: 'text-indigo-600' },
    { value: 'shipped', label: 'ارسال شده', color: 'text-orange-600' },
    { value: 'delivered', label: 'تحویل شده', color: 'text-green-600' },
    { value: 'cancelled', label: 'لغو شده', color: 'text-red-600' }
  ];

  const getStatusColor = (status) => {
    const statusMap = {
      pending_payment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      preparing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      shipped: 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircleIcon className="w-5 h-5" />;
      case 'shipped': return <TruckIcon className="w-5 h-5" />;
      case 'cancelled': return <XCircleIcon className="w-5 h-5" />;
      default: return <CheckCircleIcon className="w-5 h-5" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending_payment: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      processing: 'در حال پردازش',
      preparing: 'در حال آماده‌سازی',
      shipped: 'ارسال شده',
      delivered: 'تحویل شده',
      cancelled: 'لغو شده'
    };
    return statusMap[status] || status;
  };

  // فرمت تاریخ
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // فرمت قیمت
  const formatPrice = (price) => {
    return price ? price.toLocaleString('fa-IR') + ' تومان' : '۰ تومان';
  };

  // تاریخچه سفارش
  const getOrderHistory = (order) => {
    const history = [];
    
    if (order.createdAt) {
      history.push({
        status: 'ordered',
        text: 'سفارش ثبت شد',
        date: order.createdAt
      });
    }
    
    if (order.paidAt) {
      history.push({
        status: 'paid',
        text: 'پرداخت انجام شد',
        date: order.paidAt
      });
    }
    
    if (order.shippedAt) {
      history.push({
        status: 'shipped',
        text: 'سفارش ارسال شد',
        date: order.shippedAt
      });
    }
    
    if (order.deliveredAt) {
      history.push({
        status: 'delivered',
        text: 'سفارش تحویل داده شد',
        date: order.deliveredAt
      });
    }
    
    if (order.status === 'cancelled' && order.cancelledAt) {
      history.push({
        status: 'cancelled',
        text: 'سفارش لغو شد',
        date: order.cancelledAt
      });
    }
    
    return history.reverse();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center text-gray-600 mt-4">در حال دریافت اطلاعات سفارش...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-600 mx-auto mb-2" />
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={fetchOrderDetails}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">
          <p>سفارش مورد نظر یافت نشد.</p>
        </div>
      </div>
    );
  }

  const orderHistory = getOrderHistory(order);

  return (
    <div className="p-6">
      {/* هدر صفحه */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/orders"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">جزئیات سفارش</h1>
          <p className="text-gray-500">شماره سفارش: #{order.id}</p>
        </div>
      </div>

      {/* نمایش پیام‌ها */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 ml-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 ml-2" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ستون سمت چپ - اطلاعات اصلی */}
        <div className="lg:col-span-2 space-y-6">
          {/* کارت وضعیت سفارش */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-gray-800">وضعیت سفارش</h2>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={updating}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button
                  onClick={updateOrderStatus}
                  disabled={updating || selectedStatus === order.status}
                  className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? '...' : 'به‌روزرسانی'}
                </button>
              </div>
            </div>

            {/* timeline وضعیت سفارش */}
            <div className="relative">
              {orderHistory.length > 0 ? (
                orderHistory.map((history, index) => (
                  <div key={index} className="flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        history.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                      } z-10`}></div>
                      {index !== orderHistory.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{history.text}</p>
                      <p className="text-sm text-gray-500">{formatDate(history.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">تاریخچه‌ای برای این سفارش ثبت نشده است.</p>
              )}
            </div>
          </div>

          {/* کارت محصولات */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">محصولات سفارش</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  {item.product?.image && (
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-16 h-16 object-cover rounded-lg" 
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.product?.name || 'محصول'}</h3>
                    <p className="text-sm text-gray-500">تعداد: {item.quantity}</p>
                    {item.product?.fields && Object.keys(item.product.fields).length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {Object.entries(item.product.fields).map(([key, value]) => (
                          <span key={key} className="ml-2">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </p>
                    {item.price !== item.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice((item.originalPrice || 0) * (item.quantity || 1))}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* جمع کل */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">جمع محصولات:</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-gray-600">تخفیف:</span>
                  <span className="font-medium">-{formatPrice(order.discount)}</span>
                </div>
              )}
              {order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">هزینه ارسال:</span>
                  <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-blue-600">{formatPrice(order.total)}</span>
              </div>
              {order.paidAt && (
                <div className="text-xs text-gray-500 text-left mt-2">
                  پرداخت شده در: {formatDate(order.paidAt)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ستون سمت راست - اطلاعات جانبی */}
        <div className="space-y-6">
          {/* کارت اطلاعات مشتری */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              اطلاعات مشتری
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-800">{order.customerName || 'نامشخص'}</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-800">{order.customerEmail || 'نامشخص'}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-800">{order.customerPhone || 'نامشخص'}</span>
              </div>
              {order.shippingAddress && (
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <span className="text-gray-800">
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.province}
                  </span>
                </div>
              )}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              مشاهده پروفایل مشتری
            </button>
          </div>

          {/* کارت اطلاعات پرداخت */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              اطلاعات پرداخت
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">روش پرداخت:</span>
                <span className="font-medium">درگاه پرداخت آنلاین</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">وضعیت پرداخت:</span>
                <span className={`font-medium ${
                  order.paidAt ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {order.paidAt ? 'پرداخت شده' : 'در انتظار پرداخت'}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">تاریخ پرداخت:</span>
                  <span className="font-medium">{formatDate(order.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* کارت اطلاعات ارسال */}
          {order.trackingCode && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TruckIcon className="w-5 h-5" />
                اطلاعات ارسال
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">کد رهگیری:</span>
                  <span className="font-medium font-mono">{order.trackingCode}</span>
                </div>
                {order.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاریخ ارسال:</span>
                    <span className="font-medium">{formatDate(order.shippedAt)}</span>
                  </div>
                )}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                رهگیری مرسوله
              </button>
            </div>
          )}

          {/* کارت اقدامات سریع */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">اقدامات سریع</h2>
            <div className="space-y-3">
              <button 
                onClick={handlePrintInvoice}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <PrinterIcon className="w-5 h-5" />
                چاپ فاکتور
              </button>
              <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                ارسال پیام به مشتری
              </button>
              {!['cancelled', 'delivered'].includes(order.status) && (
                <button 
                  onClick={handleCancelOrder}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircleIcon className="w-5 h-5" />
                  {updating ? '...' : 'لغو سفارش'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;