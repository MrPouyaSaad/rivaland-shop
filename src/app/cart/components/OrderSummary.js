import React from "react";
import Button from "@/components/ui/Button";

const OrderSummary = ({ total, onNext, itemsCount = 0, discount = 0, shipping = 0 }) => {
  const subtotal = total + discount; // قیمت قبل از تخفیف
  const finalTotal = subtotal - discount + shipping;

  return (
    <div className="card p-4 md:p-5 border border-gray-100 sticky top-4">
      <h3 className="font-bold text-gray-800 text-lg md:text-xl mb-4 pb-3 border-b border-gray-100">
        خلاصه سفارش
        {itemsCount > 0 && (
          <span className="text-sm font-normal text-gray-500 mr-2">
            ({itemsCount} کالا)
          </span>
        )}
      </h3>

      {/* جزئیات قیمت */}
      <div className="space-y-3 mb-5">
        {/* جمع کل سبد */}
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-600 text-sm">جمع کل سبد خرید</span>
          <span className="text-gray-800 font-medium text-sm">
            {subtotal.toLocaleString()} تومان
          </span>
        </div>

        {/* تخفیف */}
        {discount > 0 && (
          <div className="flex justify-between items-center py-1">
            <span className="text-green-600 text-sm">تخفیف</span>
            <span className="text-green-600 font-medium text-sm">
              -{discount.toLocaleString()} تومان
            </span>
          </div>
        )}

        {/* هزینه ارسال */}
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-600 text-sm">هزینه ارسال</span>
          <span className="text-gray-800 font-medium text-sm">
            {shipping === 0 ? (
              <span className="text-green-600">رایگان</span>
            ) : (
              `${shipping.toLocaleString()} تومان`
            )}
          </span>
        </div>

        {/* خط جداکننده */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* مبلغ قابل پرداخت */}
        <div className="flex justify-between items-center py-2 bg-blue-50 rounded-lg px-3">
          <span className="text-gray-800 font-semibold text-sm">مبلغ قابل پرداخت</span>
          <span className="text-gray-800 font-bold text-base">
            {finalTotal.toLocaleString()} تومان
          </span>
        </div>
      </div>

      {/* دکمه اقدام */}
      <Button 
        className="w-full btn-primary py-2.5 text-sm font-semibold"
        onClick={onNext}
        disabled={finalTotal <= 0}
      >
        ادامه به ثبت اطلاعات
      </Button>
    </div>
  );
};

export default OrderSummary;