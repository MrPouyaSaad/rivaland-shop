// components/InvoicePDF.jsx
'use client';

import { useRef } from 'react';

const InvoicePDF = ({ order, onClose, onPrint }) => {
  const invoiceRef = useRef();

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '---';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '۰ تومان';
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getCustomerName = () => {
    if (order.address?.receiver) return order.address.receiver;
    if (order.user?.firstName || order.user?.lastName) {
      return `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim();
    }
    return order.user?.username || 'مشتری';
  };

  const getCustomerPhone = () => {
    return order.address?.phone || order.user?.phone || '---';
  };

  const getFullAddress = () => {
    if (!order.address) return '---';
    const { province, city, address, postalCode } = order.address;
    let fullAddress = '';
    if (province) fullAddress += province;
    if (city) fullAddress += `، ${city}`;
    if (address) fullAddress += `، ${address}`;
    if (postalCode) fullAddress += ` - کد پستی: ${postalCode}`;
    return fullAddress || '---';
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

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  return (
    <>
      {/* استایل مخصوص چاپ */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 10mm;
            size: A4;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
          }
          
          /* مخفی کردن همه چیز به جز فاکتور */
          body * {
            visibility: hidden;
          }
          
          #invoice-print, #invoice-print * {
            visibility: visible;
          }
          
          #invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
            background: white;
            box-shadow: none;
          }
          
          /* مخفی کردن دکمه‌ها در چاپ */
          .no-print {
            display: none !important;
          }
          
          /* استایل‌های مخصوص چاپ */
          .print-header {
            background: linear-gradient(to left, #2563eb, #1d4ed8) !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print-bg-blue {
            background: #dbeafe !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print-bg-gray {
            background: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div id="invoice-print" className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col print:max-h-none print:rounded-none print:shadow-none">
          {/* هدر */}
          <div className="print-header bg-gradient-to-l from-blue-600 to-blue-800 text-white p-6 print:p-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold print:text-xl">فاکتور فروشگاه سیرون</h1>
                <p className="text-blue-100 mt-1 print:text-sm print:mt-0">فاکتور رسمی و دارای اعتبار قانونی</p>
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold print:text-base">شماره فاکتور: {order.invoice?.invoiceNumber || `INV-${order.id}`}</p>
                <p className="text-blue-100 print:text-sm">تاریخ: {formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div ref={invoiceRef} className="p-6 overflow-auto flex-1 print:p-4 print:overflow-visible">
            {/* اطلاعات مشتری و فروشگاه */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2 print:gap-4 print:mb-6">
              <div className="print-bg-gray bg-gray-50 p-4 rounded-lg print:rounded-none print:border print:border-gray-300">
                <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 print:text-sm print:mb-2">فروشنده</h3>
                <p className="text-gray-700 font-semibold print:text-sm">فروشگاه اینترنتی سیرون</p>
                <p className="text-gray-600 text-sm mt-1 print:text-xs">شماره تماس: ۰۹۰۲۸۴۳۰۸۳۰</p>
                <p className="text-gray-600 text-sm print:text-xs">آدرس: فروشگاه آنلاین</p>
                <p className="text-gray-600 text-sm print:text-xs">ایمیل: saironstore.ir@gmail.com</p>
              </div>
              
              <div className="print-bg-gray bg-gray-50 p-4 rounded-lg print:rounded-none print:border print:border-gray-300">
                <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 print:text-sm print:mb-2">مشتری</h3>
                <p className="text-gray-700 font-semibold print:text-sm">{getCustomerName()}</p>
                <p className="text-gray-600 text-sm mt-1 print:text-xs">تلفن: {getCustomerPhone()}</p>
                <p className="text-gray-600 text-sm print:text-xs">آدرس: {getFullAddress()}</p>
              </div>
            </div>

            {/* جدول محصولات */}
            <div className="mb-8 print:mb-6">
              <h3 className="font-bold text-gray-800 mb-4 text-lg border-b pb-2 print:text-base print:mb-2">لیست کالاها</h3>
              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full border-collapse border border-gray-300 print:text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-right font-semibold text-sm print:p-2">ردیف</th>
                      <th className="border border-gray-300 p-3 text-right font-semibold text-sm print:p-2">نام کالا</th>
                      <th className="border border-gray-300 p-3 text-right font-semibold text-sm print:p-2">تعداد</th>
                      <th className="border border-gray-300 p-3 text-right font-semibold text-sm print:p-2">قیمت واحد</th>
                      <th className="border border-gray-300 p-3 text-right font-semibold text-sm print:p-2">تخفیف</th>
                      <th className="border border-gray-300 p-3 text-right font-semibold text-sm print:p-2">مبلغ کل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 even:bg-gray-50 print:even:bg-gray-100">
                        <td className="border border-gray-300 p-3 text-center text-sm print:p-2">{index + 1}</td>
                        <td className="border border-gray-300 p-3 text-sm print:p-2">
                          <div>
                            <p className="font-medium print:text-xs">{item.product?.name || 'محصول'}</p>
                            {item.product?.category && (
                              <p className="text-xs text-gray-500 mt-1 print:text-xs">دسته: {item.product.category.name}</p>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-3 text-center text-sm print:p-2">{item.quantity}</td>
                        <td className="border border-gray-300 p-3 text-left text-sm print:p-2">
                          {formatPrice(item.unitPrice)}
                        </td>
                        <td className="border border-gray-300 p-3 text-left text-sm text-green-600 print:p-2">
                          {item.discount > 0 ? `-${formatPrice(item.discount)}` : '---'}
                        </td>
                        <td className="border border-gray-300 p-3 text-left text-sm font-medium print:p-2">
                          {formatPrice(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* خلاصه مالی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
              <div className="print-bg-blue bg-blue-50 p-4 rounded-lg border border-blue-200 print:rounded-none print:border print:border-gray-300">
                <h3 className="font-bold text-blue-800 mb-3 print:text-sm">خلاصه فاکتور</h3>
                <div className="space-y-2 text-sm print:text-xs">
                  <div className="flex justify-between">
                    <span>جمع کل:</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>تخفیف:</span>
                      <span className="font-medium">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between">
                      <span>مالیات:</span>
                      <span className="font-medium">{formatPrice(order.tax)}</span>
                    </div>
                  )}
                  {order.shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span>هزینه ارسال:</span>
                      <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-blue-200 pt-2 mt-2 print:border-gray-300">
                    <span className="font-bold text-blue-800 print:text-sm">مبلغ قابل پرداخت:</span>
                    <span className="font-bold text-blue-800 text-lg print:text-base">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="print-bg-gray bg-gray-50 p-4 rounded-lg border border-gray-200 print:rounded-none print:border print:border-gray-300">
                <h3 className="font-bold text-gray-800 mb-3 print:text-sm">وضعیت سفارش</h3>
                <div className="space-y-2 text-sm print:text-xs">
                  <div className="flex justify-between">
                    <span>شماره سفارش:</span>
                    <span className="font-mono font-medium">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاریخ سفارش:</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>وضعیت پرداخت:</span>
                    <span className={`font-medium ${
                      order.paidAt ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.paidAt ? 'پرداخت شده' : 'در انتظار پرداخت'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>وضعیت سفارش:</span>
                    <span className="font-medium">{getStatusText(order.status)}</span>
                  </div>
                  {order.trackingCode && (
                    <div className="flex justify-between">
                      <span>کد رهگیری:</span>
                      <span className="font-mono font-medium text-xs">{order.trackingCode}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm print:mt-6 print:pt-4 print:text-xs">
              <p className="font-semibold">با تشکر از اعتماد شما به فروشگاه سیرون</p>
              <p className="mt-1">این فاکتور دارای اعتبار قانونی می‌باشد</p>
              <p className="mt-2">در صورت وجود هرگونه مشکل با پشتیبانی تماس بگیرید: ۰۹۰۲۸۴۳۰۸۳۰</p>
            </div>
          </div>

          {/* دکمه‌های اقدام - فقط در حالت عادی نمایش داده می‌شوند */}
          <div className="no-print border-t border-gray-200 p-4 bg-gray-50 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              بستن
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              🖨️ چاپ فاکتور
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePDF;