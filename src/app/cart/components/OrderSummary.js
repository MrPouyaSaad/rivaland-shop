import React from "react";
import Button from "@/components/ui/Button";

const OrderSummary = ({ 
  cartData = {}, 
  onNext, 
  loading = false 
}) => {
  // استخراج داده‌ها از cartData با مقادیر پیش‌فرض
  const {
    subtotal = 0,
    shipping = 0,
    tax = 0,
    total = 0,
    totalQuantity = 0,
    discount = 0,
    shippingInfo = {}
  } = cartData;

  // محاسبه تخفیف کل (اگر در response نباشد)
  const totalDiscount = discount || 0;
  
  // قیمت قبل از تخفیف
  const priceBeforeDiscount = subtotal + totalDiscount;

  // محاسبه مبلغ باقیمانده تا ارسال رایگان
  const remainingAmount = 2000000 - subtotal;
  const progressPercentage = Math.min((subtotal / 2000000) * 100, 100);

  // پیام هزینه ارسال
  const getShippingMessage = () => {
    if (shipping === 0) {
      return <span className="text-green-600">رایگان</span>;
    }
    return `${shipping.toLocaleString()} تومان`;
  };

  // پیام تشویقی برای ارسال رایگان
  const getFreeShippingMessage = () => {
    if (shipping === 0) return null;
    
    if (remainingAmount > 0) {
      return (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3 mt-3">
          <div className="space-y-2">
            {/* نوار پیشرفت */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-orange-700 font-medium">
                {remainingAmount.toLocaleString()} تومان تا ارسال رایگان
              </span>
              <span className="text-orange-600 font-bold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            
            {/* نوار پیشرفت بصری */}
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex items-center text-orange-600 text-xs">
              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              با افزودن {remainingAmount.toLocaleString()} تومان دیگر، ارسال رایگان می‌شود
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-4 md:p-5 border border-gray-100 sticky top-4 bg-white shadow-sm">
      <h3 className="font-bold text-gray-800 text-lg md:text-xl mb-4 pb-3 border-b border-gray-100">
        خلاصه سفارش
        {totalQuantity > 0 && (
          <span className="text-sm font-normal text-gray-500 mr-2">
            ({totalQuantity} کالا)
          </span>
        )}
      </h3>

      {/* جزئیات قیمت */}
      <div className="space-y-3 mb-5">
        {/* جمع کل سبد قبل از تخفیف */}
        {totalDiscount > 0 && (
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 text-sm">جمع کل سبد خرید</span>
            <span className="text-gray-500 line-through text-xs">
              {priceBeforeDiscount.toLocaleString()} تومان
            </span>
          </div>
        )}

        {/* جمع کل سبد بعد از تخفیف */}
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-600 text-sm">
            {totalDiscount > 0 ? "جمع سبد بعد از تخفیف" : "جمع کل سبد خرید"}
          </span>
          <span className="text-gray-800 font-medium text-sm">
            {subtotal.toLocaleString()} تومان
          </span>
        </div>

        {/* تخفیف */}
        {totalDiscount > 0 && (
          <div className="flex justify-between items-center py-1">
            <span className="text-green-600 text-sm">تخفیف سبد خرید</span>
            <span className="text-green-600 font-medium text-sm">
              -{totalDiscount.toLocaleString()} تومان
            </span>
          </div>
        )}

        {/* هزینه ارسال */}
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-600 text-sm">هزینه ارسال</span>
          <span className="text-gray-800 font-medium text-sm">
            {getShippingMessage()}
          </span>
        </div>

        {/* اطلاعات روش ارسال */}
        {shippingInfo && (
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
            <div className="flex items-center justify-between mb-1">
              <span>روش ارسال:</span>
              <span className="font-medium">{shippingInfo.method || 'پست'}</span>
            </div>
            {shippingInfo.deliveryTime && (
              <div className="flex items-center justify-between">
                <span>زمان تحویل:</span>
                <span className="font-medium">{shippingInfo.deliveryTime}</span>
              </div>
            )}
          </div>
        )}

        {/* پیام تشویقی ارسال رایگان */}
        {getFreeShippingMessage()}

        {/* خط جداکننده */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* مبلغ قابل پرداخت */}
        <div className="flex justify-between items-center py-2 bg-gradient-to-l from-blue-50 to-indigo-50 rounded-lg px-3 border border-blue-100">
          <span className="text-gray-800 font-semibold text-sm">مبلغ قابل پرداخت</span>
          <span className="text-gray-800 font-bold text-base">
            {total.toLocaleString()} تومان
          </span>
        </div>

        {/* توضیح درباره مالیات (اختیاری) */}
        <div className="text-xs text-gray-500 text-center mt-2">
          مالیات بر ارزش افزوده در مرحله پرداخت محاسبه می‌شود
        </div>
      </div>

      {/* دکمه اقدام */}
      <Button 
        className="w-full btn-primary py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-lg"
        onClick={onNext}
        disabled={total <= 0 || loading}
        loading={loading}
      >
        {loading ? "در حال بارگذاری..." : "ادامه به ثبت اطلاعات"}
      </Button>

      {/* اطمینان و تضمین */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-3 h-3 text-green-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          تضمین بهترین قیمت
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-3 h-3 text-green-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          ارسال سریع سفارش
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;