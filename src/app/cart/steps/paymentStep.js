import React, { useState, useEffect } from "react";
import PaymentMethodCard from "../components/PaymentMethodCard";
import Button from "@/components/ui/Button";
import { userApiService } from "@/services/api";
import { useCart } from "@/contexts/CartContext";

const PaymentStep = ({ shippingInfo, onPrev }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(true);
  const [validatingCart, setValidatingCart] = useState(false);
  const [error, setError] = useState("");
  const [orderSummary, setOrderSummary] = useState(null);
  const [cartValidation, setCartValidation] = useState(null);

  const { cartItems, cartTotal, clearCart } = useCart();

  // اعتبارسنجی سبد خرید و محاسبه هزینه ارسال
  useEffect(() => {
    const validateAndCalculate = async () => {
      try {
        setValidatingCart(true);
        setCalculatingShipping(true);
        setError("");
        
        // 1. اعتبارسنجی سبد خرید
        const validationResponse = await userApiService.validateCartForOrder();
        
        if (!validationResponse.success || !validationResponse.data.isValid) {
          throw new Error(validationResponse.data?.message || "سبد خرید معتبر نیست");
        }

        setCartValidation(validationResponse.data);

        // 2. محاسبه هزینه ارسال
        const shippingResponse = await userApiService.calculateShippingCost({
          province: shippingInfo.province,
          city: shippingInfo.city,
          subtotal: validationResponse.data.priceSummary?.total || cartTotal || 0,
          shippingMethod: "standard"
        });

        if (shippingResponse.success) {
          const shippingCost = shippingResponse.data.shippingCost;
          const itemsTotal = validationResponse.data.priceSummary?.subtotal || cartTotal || 0;
          const finalTotal = itemsTotal + shippingCost;
          
          setOrderSummary({
            itemsTotal: itemsTotal,
            shippingCost: shippingCost,
            finalTotal: finalTotal,
            itemsCount: validationResponse.data.itemsCount || 0,
            productsCount: validationResponse.data.productsCount || 0,
            isFreeShipping: shippingResponse.data.isFree,
            estimatedDelivery: shippingResponse.data.estimatedDelivery
          });
        } else {
          throw new Error(shippingResponse.message || "خطا در محاسبه هزینه ارسال");
        }
      } catch (error) {
        console.error("Error in validation/calculation:", error);
        setError(error.message || "خطا در بررسی سبد خرید و محاسبه هزینه ارسال");
        
        // Fallback به مقادیر پیش‌فرض
        setOrderSummary({
          itemsTotal: cartTotal || 0,
          shippingCost: 69000,
          finalTotal: (cartTotal || 0) + 69000,
          itemsCount: cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0,
          productsCount: cartItems?.length || 0,
          isFreeShipping: false
        });
      } finally {
        setValidatingCart(false);
        setCalculatingShipping(false);
      }
    };

    if (cartItems && cartItems.length > 0 && shippingInfo.province) {
      validateAndCalculate();
    }
  }, [cartItems, cartTotal, shippingInfo]);

  const handlePayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    if (validatingCart || calculatingShipping) {
      setError("لطفاً منتظر بمانید تا اطلاعات نهایی محاسبه شود.");
      return;
    }

    if (cartValidation && !cartValidation.isValid) {
      setError(cartValidation.message || "سبد خرید معتبر نیست");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("📤 ایجاد سفارش با اطلاعات:", shippingInfo);

      // ثبت سفارش ساده‌شده - فقط آدرس ارسال
      const response = await userApiService.createOrder({
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        phone: shippingInfo.phone,
        province: shippingInfo.province,
        city: shippingInfo.city,
        address: shippingInfo.address,
        postalCode: shippingInfo.postalCode || "0000000000",
      });
      
      if (!response.success) {
        setError(response.message || "خطا در ثبت سفارش");
        return;
      }

      const order = response.data;
      
      console.log("✅ سفارش ثبت شد:", order);

      // استفاده از مقادیر واقعی از بک‌اند برای نمایش
      if (order.financialSummary) {
        setOrderSummary(prev => ({
          ...prev,
          itemsTotal: order.financialSummary.subtotal,
          shippingCost: order.financialSummary.shippingCost,
          finalTotal: order.financialSummary.total
        }));
      }

      // دریافت توکن سامان برای پرداخت
      const tokenResponse = await userApiService.getSamanToken(
        order.id, 
        order.total * 10, // تبدیل به ریال
        shippingInfo.phone
      );
      
      if (!tokenResponse?.token || !tokenResponse?.paymentUrl) {
        setError("خطا در دریافت توکن درگاه پرداخت. لطفاً دوباره تلاش کنید.");
        return;
      }

      console.log("🔗 هدایت به درگاه پرداخت");

      // پاک کردن سبد خرید پس از ثبت موفق سفارش
      clearCart();
      
      // هدایت به درگاه پرداخت
      const form = document.createElement("form");
      form.method = "POST";
      form.action = tokenResponse.paymentUrl;

      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "Token";
      tokenInput.value = tokenResponse.token;
      form.appendChild(tokenInput);

      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  // نمایش لودینگ هنگام اعتبارسنجی و محاسبه
  if (validatingCart || calculatingShipping) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {validatingCart ? "در حال بررسی سبد خرید..." : "در حال محاسبه هزینه ارسال..."}
            </p>
            <p className="text-sm text-gray-500 mt-2">لطفاً چند لحظه صبر کنید</p>
          </div>
        </div>
      </div>
    );
  }

  // نمایش خطا اگر سبد خرید معتبر نیست
  if (cartValidation && !cartValidation.isValid) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">سبد خرید معتبر نیست</h3>
          <p className="text-gray-600 mb-4">{cartValidation.message}</p>
          <Button 
            variant="outline" 
            onClick={onPrev}
            className="mx-auto"
          >
            بازگشت به سبد خرید
          </Button>
        </div>
      </div>
    );
  }

  const displayValues = {
    itemsTotal: orderSummary?.itemsTotal || 0,
    shippingCost: orderSummary?.shippingCost || 0,
    finalTotal: orderSummary?.finalTotal || 0,
    itemsCount: orderSummary?.itemsCount || 0,
    productsCount: orderSummary?.productsCount || 0,
    isFreeShipping: orderSummary?.isFreeShipping || false,
    estimatedDelivery: orderSummary?.estimatedDelivery
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">پرداخت سفارش</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center text-sm">
          <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* درگاه پرداخت */}
      <PaymentMethodCard
        method={{
          id: "saman",
          name: "پرداخت اینترنتی سامان",
          description: "پرداخت امن و سریع با درگاه سامان",
          logo: "/L O G O.png"
        }}
        selected={true}
        onSelect={() => {}}
      />

      {/* خلاصه اطلاعات ارسال */}
      <div className="bg-gray-50 rounded-lg p-5 my-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 text-base">خلاصه اطلاعات ارسال</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-gray-500 min-w-[100px]">نام تحویل‌گیرنده:</span>
            <span className="text-gray-900 font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-gray-500 min-w-[100px]">شماره تماس:</span>
            <span className="text-gray-900 font-medium">{shippingInfo.phone}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-gray-500 min-w-[100px]">استان و شهر:</span>
            <span className="text-gray-900 font-medium">{shippingInfo.province}، {shippingInfo.city}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-gray-500 min-w-[100px]">کد پستی:</span>
            <span className="text-gray-900 font-medium">{shippingInfo.postalCode || "ثبت نشده"}</span>
          </div>
          <div className="md:col-span-2 flex items-start space-x-2 space-x-reverse">
            <span className="text-gray-500 min-w-[100px] mt-1">آدرس کامل:</span>
            <span className="text-gray-900 font-medium text-sm leading-6">{shippingInfo.address}</span>
          </div>
        </div>
      </div>

      {/* خلاصه سفارش */}
      <div className="bg-blue-50 rounded-lg p-5 mb-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-5 text-base flex items-center">
          <svg className="w-4 h-4 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          خلاصه سفارش
        </h3>
        
        <div className="space-y-3">
          {/* اطلاعات تعداد */}
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm">تعداد محصولات</span>
            <span className="text-gray-900 font-medium text-sm">{displayValues.productsCount} عدد</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-300 pb-3">
            <span className="text-gray-600 text-sm">تعداد کل کالاها</span>
            <span className="text-gray-900 font-medium text-sm">{displayValues.itemsCount} عدد</span>
          </div>

          {/* جزئیات قیمت */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">جمع کل کالاها</span>
              <span className="text-gray-900 font-medium text-sm">{displayValues.itemsTotal.toLocaleString()} تومان</span>
            </div>
            
            <div className={`flex justify-between items-center py-1 ${displayValues.isFreeShipping ? 'text-green-600' : 'text-gray-600'}`}>
              <span className="text-sm">هزینه ارسال</span>
              <div className="flex items-center space-x-1 space-x-reverse">
                {displayValues.isFreeShipping ? (
                  <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-sm">رایگان</span>
                  </>
                ) : (
                  <span className="font-medium text-sm">+ {displayValues.shippingCost.toLocaleString()} تومان</span>
                )}
              </div>
            </div>

            {/* زمان تخمینی تحویل */}
            {displayValues.estimatedDelivery && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-gray-600 text-sm">زمان تخمینی تحویل</span>
                <span className="text-gray-900 font-medium text-sm">
                  {displayValues.estimatedDelivery.description}
                </span>
              </div>
            )}
          </div>

          {/* مبلغ نهایی */}
          <div className="border-t border-gray-400 pt-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">مبلغ قابل پرداخت</span>
              <span className="text-lg font-bold text-blue-600">
                {displayValues.finalTotal.toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* دکمه‌های اقدام */}
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={onPrev} 
          disabled={isLoading}
          className="flex-1 py-2.5 text-base"
        >
          بازگشت
        </Button>
        <Button 
          onClick={handlePayment} 
          disabled={isLoading || !cartValidation?.isValid}
          className="flex-1 bg-green-600 hover:bg-green-700 py-2.5 text-base font-semibold"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>در حال ثبت سفارش...</span>
            </div>
          ) : (
            "پرداخت و ثبت نهایی"
          )}
        </Button>
      </div>

      {/* اطلاعات اضافی */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <div className="text-xs text-blue-700">
            <p className="font-semibold text-blue-800 mb-2">نکات مهم:</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-1.5">
                <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>پس از پرداخت، سفارش شما به طور خودکار ثبت می‌شود</span>
              </li>
              <li className="flex items-start gap-1.5">
                <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>رسید پرداخت برای شما پیامک خواهد شد</span>
              </li>
              <li className="flex items-start gap-1.5">
                <svg className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>سبد خرید شما به طور خودکار بررسی و اعتبارسنجی شده است</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;