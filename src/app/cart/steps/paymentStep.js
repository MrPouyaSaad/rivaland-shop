import React, { useState } from "react";
import PaymentMethodCard from "../components/PaymentMethodCard";
import Button from "@/components/ui/Button";
import { userApiService } from "@/services/api";
import { useCart } from "@/contexts/CartContext";

const PaymentStep = ({ shippingInfo, onPrev }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { cartItems, cartTotal, clearCart } = useCart();

  const handlePayment = async () => {
  if (!cartItems || cartItems.length === 0) {
    setError("سبد خرید شما خالی است.");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    // آماده سازی سفارش
    const orderItems = cartItems.map(item => ({
      productId: item.productId || item.product?.id,
      quantity: item.quantity || 1,
      price: item.product?.currentPrice || item.product?.price || item.price || 0,
    }));

    const orderData = {
      items: orderItems,
      shippingAddress: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        phone: shippingInfo.phone,
        email: shippingInfo.email || "",
        province: shippingInfo.province,
        city: shippingInfo.city,
        address: shippingInfo.address,
        postalCode: shippingInfo.postalCode,
      },
      paymentMethod: "saman",
      shippingMethod: "standard",
    };

    // ثبت سفارش
    const response = await userApiService.createOrder(orderData);
    if (!response.success) {
      setError(response.message || "خطا در ثبت سفارش");
      return;
    }

    clearCart();
    const order = response.data;

    // دریافت توکن سامان
    // cartTotal بر حسب تومان → ضربدر 10 برای ریال
    const tokenResponse = await userApiService.getSamanToken(order.id, cartTotal * 10, shippingInfo.phone);
    if (!tokenResponse?.token || !tokenResponse?.paymentUrl) {
      setError("خطا در دریافت توکن درگاه پرداخت. لطفاً دوباره تلاش کنید.");
      return;
    }

    // ساخت فرم و ارسال خودکار
    const form = document.createElement("form");
    form.method = "POST";
    form.action = tokenResponse.paymentUrl;

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "Token";
    input.value = tokenResponse.token;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();

  } catch (err) {
    console.error("Payment error:", err);
    setError(err.message || "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6">پرداخت سفارش</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <PaymentMethodCard
  method={{
    id: "saman",
    name: "پرداخت اینترنتی سامان",
    description: "پرداخت امن و سریع با درگاه سامان",
    logo: "/L O G O.png" // مسیر عکس در public
  }}
  selected={true}
  onSelect={() => {}}
/>


      <div className="bg-gray-50 rounded-xl p-4 my-6">
        <h3 className="font-semibold mb-2">خلاصه اطلاعات ارسال</h3>
        <p className="text-sm text-gray-600">{shippingInfo.firstName} {shippingInfo.lastName}</p>
        <p className="text-sm text-gray-600">{shippingInfo.phone}</p>
        {shippingInfo.email && <p className="text-sm text-gray-600">{shippingInfo.email}</p>}
        <p className="text-sm text-gray-600">{shippingInfo.province}، {shippingInfo.city}</p>
        <p className="text-sm text-gray-600">{shippingInfo.address}</p>
        <p className="text-sm text-gray-600">کد پستی: {shippingInfo.postalCode}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold mb-2">خلاصه سفارش</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>تعداد آیتم‌ها:</span>
            <span>{cartItems?.length || 0} عدد</span>
          </div>
          <div className="flex justify-between">
            <span>تعداد کل کالاها:</span>
            <span>{cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0} عدد</span>
          </div>
          <div className="flex justify-between">
            <span>مبلغ کل:</span>
            <span>{(cartTotal || 0).toLocaleString()} تومان</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>بازگشت</Button>
        <Button onClick={handlePayment} disabled={isLoading || !cartItems || cartItems.length === 0}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              در حال ثبت...
            </div>
          ) : (
            "پرداخت و ثبت نهایی سفارش"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
