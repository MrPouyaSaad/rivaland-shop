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
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { adminApiService } from '@/services/api';
import InvoicePDF from '@/components/InvoicePDF'; // کامپوننت فاکتور جدید

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showInvoice, setShowInvoice] = useState(false); // حالت نمایش فاکتور

  // دریافت جزئیات سفارش
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminApiService.getAdminOrderDetails(orderId);
      
      if (response.success) {
        setOrder(response.data);
        setSelectedStatus(response.data.status);
        setTrackingCode(response.data.trackingCode || '');
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
      
      const updateData = { status: selectedStatus };
      
      // اگر وضعیت به shipped تغییر کرد و کد رهگیری وجود دارد، آن را هم ارسال کن
      if (selectedStatus === 'shipped' && trackingCode) {
        updateData.trackingCode = trackingCode;
      }
      
      const response = await adminApiService.updateOrderStatus(orderId, updateData);
      
      if (response.success) {
        setOrder(prev => ({ 
          ...prev, 
          status: selectedStatus,
          trackingCode: trackingCode || prev.trackingCode
        }));
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

  // به‌روزرسانی کد رهگیری
  const updateTrackingCode = async () => {
    if (!trackingCode.trim()) {
      setError('لطفا کد رهگیری را وارد کنید');
      return;
    }

    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      
      const response = await adminApiService.updateOrderTracking(orderId, trackingCode);
      
      if (response.success) {
        setOrder(prev => ({ ...prev, trackingCode }));
        setSuccess('کد رهگیری با موفقیت به‌روزرسانی شد');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(response.message || 'خطا در به‌روزرسانی کد رهگیری');
      }
    } catch (error) {
      console.error('Error updating tracking code:', error);
      setError('خطا در به‌روزرسانی کد رهگیری');
    } finally {
      setUpdating(false);
    }
  };

  // نمایش فاکتور
  const handleShowInvoice = () => {
    setShowInvoice(true);
  };

  // چاپ فاکتور
  const handlePrintInvoice = () => {
    setShowInvoice(true);
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

  // نمایش نام مشتری
  const getCustomerName = () => {
    if (order.address?.receiver) {
      return order.address.receiver;
    }
    if (order.user?.firstName || order.user?.lastName) {
      return `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim();
    }
    if (order.user?.username) {
      return order.user.username;
    }
    return 'نامشخص';
  };

  // نمایش شماره تلفن مشتری
  const getCustomerPhone = () => {
    if (order.address?.phone) {
      return order.address.phone;
    }
    if (order.user?.phone) {
      return order.user.phone;
    }
    return 'شماره نامشخص';
  };

  // نمایش آدرس کامل
  const getFullAddress = () => {
    if (!order.address) return 'آدرسی ثبت نشده است';
    
    const { province, city, address, postalCode } = order.address;
    return `${province}، ${city}، ${address} ${postalCode ? ` - کد پستی: ${postalCode}` : ''}`;
  };

  // محاسبه تخفیف هر آیتم
  const calculateItemDiscount = (item) => {
    return (item.originalPrice - item.unitPrice) * item.quantity;
  };

  // تاریخچه سفارش
  const getOrderHistory = () => {
    const history = [];
    
    if (order.createdAt) {
      history.push({
        status: 'ordered',
        text: 'سفارش ثبت شد',
        date: order.createdAt,
        icon: <DocumentTextIcon className="w-4 h-4" />
      });
    }
    
    if (order.paidAt) {
      history.push({
        status: 'paid',
        text: 'پرداخت انجام شد',
        date: order.paidAt,
        icon: <CreditCardIcon className="w-4 h-4" />
      });
    }
    
    if (order.updatedAt && order.status !== 'pending_payment') {
      history.push({
        status: order.status,
        text: `وضعیت به "${getStatusText(order.status)}" تغییر کرد`,
        date: order.updatedAt,
        icon: getStatusIcon(order.status)
      });
    }
    
    return history.reverse();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">در حال دریافت اطلاعات سفارش...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={fetchOrderDetails}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              تلاش مجدد
            </button>
            <Link
              href="/admin/orders"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              بازگشت به لیست
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600 max-w-md mx-auto">
          <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-4">سفارش مورد نظر یافت نشد.</p>
          <Link
            href="/admin/orders"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            بازگشت به لیست سفارشات
          </Link>
        </div>
      </div>
    );
  }

  const orderHistory = getOrderHistory();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
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
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {getStatusText(order.status)}
          </span>
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
              <h2 className="text-lg font-bold text-gray-800">مدیریت وضعیت سفارش</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-48"
                  disabled={updating}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button
                  onClick={updateOrderStatus}
                  disabled={updating || selectedStatus === order.status}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {updating ? 'در حال به‌روزرسانی...' : 'تغییر وضعیت'}
                </button>
              </div>
            </div>

            {/* کد رهگیری */}
            {(selectedStatus === 'shipped' || order.status === 'shipped') && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کد رهگیری مرسوله
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="کد رهگیری پستی را وارد کنید"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={updateTrackingCode}
                    disabled={updating || !trackingCode.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {updating ? '...' : 'ثبت'}
                  </button>
                </div>
                {order.trackingCode && (
                  <p className="text-sm text-green-600 mt-2">
                    کد رهگیری ثبت شده: <strong>{order.trackingCode}</strong>
                  </p>
                )}
              </div>
            )}

            {/* timeline وضعیت سفارش */}
            <div className="border-t pt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-4">تاریخچه سفارش</h3>
              {orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((history, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          history.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                          history.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {history.icon}
                        </div>
                        {index !== orderHistory.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-gray-800">{history.text}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(history.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">تاریخچه‌ای برای این سفارش ثبت نشده است.</p>
              )}
            </div>
          </div>

          {/* کارت محصولات */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              محصولات سفارش ({order.items?.length || 0} کالا)
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => {
                const mainImage = item.product?.images?.find(img => img.isMain) || item.product?.images?.[0];
                const itemDiscount = calculateItemDiscount(item);
                
                return (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    {/* تصویر محصول */}
                    <div className="flex-shrink-0">
                      {mainImage ? (
                        <img 
                          src={mainImage.url} 
                          alt={item.product.name} 
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200" 
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <TagIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* اطلاعات محصول */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-lg mb-1">
                        {item.product?.name || 'محصول'}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span>تعداد:</span>
                          <span className="font-medium">{item.quantity} عدد</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span>قیمت واحد:</span>
                          <span className="font-medium">{formatPrice(item.unitPrice)}</span>
                        </div>
                        
                        {item.originalPrice > item.unitPrice && (
                          <>
                            <div className="flex items-center gap-1">
                              <span>قیمت اصلی:</span>
                              <span className="font-medium line-through text-gray-500">
                                {formatPrice(item.originalPrice)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-green-600">
                              <span>تخفیف:</span>
                              <span className="font-medium">{formatPrice(itemDiscount)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* دسته‌بندی محصول */}
                      {item.product?.category && (
                        <div className="mt-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {item.product.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* جمع قیمت */}
                    <div className="flex-shrink-0 text-left min-w-24">
                      <p className="font-bold text-gray-800 text-lg">
                        {formatPrice(item.total)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">
                          ({formatPrice(item.unitPrice)} × {item.quantity})
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* جمع کل */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">جمع محصولات:</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>تخفیف:</span>
                  <span className="font-medium">-{formatPrice(order.discount)}</span>
                </div>
              )}
              
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">مالیات:</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
              )}
              
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">هزینه ارسال:</span>
                  <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-blue-600">{formatPrice(order.total)}</span>
              </div>
              
              {order.paidAt && (
                <div className="text-xs text-gray-500 text-left mt-2">
                  <div className="flex items-center gap-1">
                    <CreditCardIcon className="w-4 h-4" />
                    پرداخت شده در: {formatDate(order.paidAt)}
                  </div>
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
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">نام و نام خانوادگی</p>
                  <p className="font-medium text-gray-800">{getCustomerName()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">شماره موبایل</p>
                  <p className="font-medium text-gray-800">{getCustomerPhone()}</p>
                </div>
              </div>
              
              {order.user?.email && (
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">ایمیل</p>
                    <p className="font-medium text-gray-800">{order.user.email}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">آدرس کامل</p>
                  <p className="font-medium text-gray-800 text-sm leading-relaxed">
                    {getFullAddress()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                پروفایل مشتری
              </button>
              <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center justify-center gap-1">
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                پیام
              </button>
            </div>
          </div>

          {/* کارت اطلاعات پرداخت */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              اطلاعات پرداخت
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">روش پرداخت:</span>
                <span className="font-medium">{order.paymentMethod === 'saman' ? 'درگاه سامان' : order.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">وضعیت پرداخت:</span>
                <span className={`font-medium ${
                  order.paidAt ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {order.paidAt ? 'پرداخت شده' : 'در انتظار پرداخت'}
                </span>
              </div>
              
              {order.paymentMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">درگاه پرداخت:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
              )}
              
              {order.paidAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاریخ پرداخت:</span>
                  <span className="font-medium text-sm">{formatDate(order.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* کارت اطلاعات ارسال */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TruckIcon className="w-5 h-5" />
              اطلاعات ارسال
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">روش ارسال:</span>
                <span className="font-medium">{order.shippingMethod || 'پست پیشتاز'}</span>
              </div>
              
              {order.trackingCode && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">کد رهگیری:</span>
                  <span className="font-medium font-mono text-sm">{order.trackingCode}</span>
                </div>
              )}
              
              {order.shippingCost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">هزینه ارسال:</span>
                  <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                </div>
              )}
            </div>
            
            {order.trackingCode && (
              <button className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                رهگیری مرسوله
              </button>
            )}
          </div>

          {/* کارت اقدامات سریع */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">اقدامات سریع</h2>
            <div className="space-y-3">
              <button 
                onClick={handleShowInvoice}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <PrinterIcon className="w-4 h-4" />
                مشاهده و چاپ فاکتور
              </button>
              
              <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 text-sm">
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                ارسال پیام به مشتری
              </button>
              
              {!['cancelled', 'delivered'].includes(order.status) && (
                <button 
                  onClick={handleCancelOrder}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  <XCircleIcon className="w-4 h-4" />
                  {updating ? 'در حال لغو...' : 'لغو سفارش'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* نمایش فاکتور */}
      {showInvoice && order && (
        <InvoicePDF 
          order={order}
          onClose={() => setShowInvoice(false)}
          onPrint={() => {
            setSuccess('فاکتور با موفقیت چاپ شد');
            setTimeout(() => setSuccess(''), 3000);
          }}
        />
      )}
    </div>
  );
};

export default OrderDetailPage;