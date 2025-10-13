import Link from 'next/link';
import OrderProgress from './OrderProgress';
import { useState } from 'react';

const OrderCard = ({ 
  order, 
  getStatusInfo, 
  getOrderSteps, 
  formatDate, 
  handleCancelOrder 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = getStatusInfo(order.status);
  const steps = getOrderSteps(order);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Order Header - قابل کلیک برای باز و بسته شدن */}
      <div 
        className="border-b border-gray-200 p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            {/* آیکون باز و بسته شدن */}
            <div className={`transform transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">سفارش #{order.id}</h3>
              <p className="text-gray-600 text-sm mt-1">
                تاریخ ثبت: {formatDate(order.createdAt)}
              </p>
              {order.paidAt && (
                <p className="text-gray-600 text-sm">
                  تاریخ پرداخت: {formatDate(order.paidAt)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`px-3 py-2 rounded-full text-sm font-medium ${statusInfo.color} flex items-center gap-2`}>
              <span>{statusInfo.icon}</span>
              {statusInfo.text}
            </span>
            {order.trackingCode && (
              <div className="text-left">
                <p className="text-sm text-gray-600">کد پیگیری:</p>
                <p className="font-mono text-sm font-bold text-blue-600">{order.trackingCode}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* محتوای قابل جمع شدن */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        
        {/* Order Progress */}
        <OrderProgress steps={steps} order={order} formatDate={formatDate} />

        {/* Order Items Summary */}
        <div className="p-6">
          <h4 className="font-semibold text-gray-800 mb-4">محصولات ({order.items?.length || 0})</h4>
          <div className="space-y-3">
            {order.items?.slice(0, 3).map((item, index) => {
              const hasDiscount = item.originalPrice > item.unitPrice;
              
              let discountText = '';
              if (hasDiscount && item.discount > 0) {
                if (item.product?.discountType === 'percentage') {
                  discountText = `${item.discount}% تخفیف`;
                } else {
                  discountText = `${item.discount.toLocaleString()} تومان تخفیف`;
                }
              }

              return (
                <div key={index} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3">
                    {item.product?.image && (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    )}
                    <div>
                      <span className="text-gray-700 font-medium block">
                        {item.product?.name || 'محصول'}
                      </span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">تعداد: {item.quantity}</span>
                        {hasDiscount && discountText && (
                          <span className="text-green-600 text-xs">
                            ({discountText})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    {hasDiscount && (
                      <div className="text-xs text-gray-500 line-through mb-1">
                        {(item.originalPrice * item.quantity).toLocaleString()} تومان
                      </div>
                    )}
                    <span className="text-gray-600 font-medium">
                      {(item.unitPrice * item.quantity).toLocaleString()} تومان
                    </span>
                  </div>
                </div>
              );
            })}
            
            {order.items && order.items.length > 3 && (
              <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-gray-500 text-sm">
                  و {order.items.length - 3} محصول دیگر...
                </p>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">جمع کل:</span>
              <span className="text-gray-800">{(order.subtotal || 0).toLocaleString()} تومان</span>
            </div>
            
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">تخفیف:</span>
                <span className="text-green-600">
                  -{order.discount.toLocaleString()} تومان
                </span>
              </div>
            )}
            
            {order.shippingCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">هزینه ارسال:</span>
                <span className="text-gray-800">{(order.shippingCost || 0).toLocaleString()} تومان</span>
              </div>
            )}
            
            <div className="flex justify-between items-center font-semibold border-t border-gray-200 pt-2">
              <span>مبلغ نهایی:</span>
              <span className="text-lg text-blue-600">
                {(order.total || 0).toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>

        {/* Order Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-wrap gap-3">
            <Link 
              href={`/orders/${order.id}`}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>📦</span>
              مشاهده جزئیات کامل
            </Link>
            
            {['paid', 'processing', 'preparing'].includes(order.status) && (
              <button 
                onClick={() => handleCancelOrder(order.id)}
                className="px-5 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <span>❌</span>
                لغو سفارش
              </button>
            )}
            
            <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
              <span>📞</span>
              پشتیبانی
            </button>
            
            {order.trackingCode && (
              <button className="px-5 py-2.5 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium flex items-center gap-2">
                <span>🚚</span>
                رهگیری
              </button>
            )}
          </div>
        </div>
      </div>

      {/* نمایش خلاصه وقتی بسته است */}
      {!isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>تعداد محصولات: {order.items?.length || 0}</span>
              <span>مبلغ کل: {(order.total || 0).toLocaleString()} تومان</span>
            </div>
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              مشاهده جزئیات
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;