import React, { useState } from "react";
import PaymentMethodCard from "../components/PaymentMethodCard";
import Button from "@/components/ui/Button";
import { userApiService } from "@/services/api";
import { useCart } from "@/contexts/CartContext";

const PaymentStep = ({ shippingInfo, onPrev, onOrderSuccess }) => {
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // استفاده از useCart با ساختار جدید
  const { cartItems, cartTotal, clearCart } = useCart();

  console.log("Cart items from context:", cartItems);
  console.log("Cart total from context:", cartTotal);

  const handlePayment = async () => {
    if (!selectedGateway) {
      setError("لطفاً درگاه پرداخت را انتخاب کنید.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // ساخت داده‌های سفارش با ساختار صحیح
      const orderItems = cartItems.map(item => {
        console.log("Processing cart item:", item);
        
        const productId = item.productId || item.product?.id;
        const quantity = item.quantity || 1;
        const price = item.product?.currentPrice || item.product?.price || item.price || 0;

        if (!productId) {
          console.error("Invalid item structure - missing productId:", item);
          throw new Error("ساختار آیتم سبد خرید نامعتبر است");
        }

        return {
          productId,
          quantity,
          price
        };
      });

      console.log("Final order items:", orderItems);

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
          postalCode: shippingInfo.postalCode
        },
        paymentMethod: selectedGateway,
        shippingMethod: "standard"
      };

      console.log("Sending order data to API:", orderData);

      // ثبت سفارش از طریق API
      const response = await userApiService.createOrder(orderData);
      
      console.log("Order API response:", response);
      
      if (response.success) {
        // پاک کردن سبد خرید
        clearCart();
        
        // فراخوانی تابع موفقیت
        if (onOrderSuccess) {
          onOrderSuccess(response.data);
        } else {
          // نمایش پیام موفقیت
          const orderNumber = response.data?.orderNumber || response.data?.id || "نامشخص";
          alert(`سفارش شما با شماره ${orderNumber} ثبت شد!`);
          // ریدایرکت به صفحه سفارشات
          window.location.href = `/orders/${response.data.id}`;
        }
      } else {
        setError(response.message || "خطا در ثبت سفارش");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.message || "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const gateways = [
    { id: "zarinpal", name: "زرین‌پال", description: "پرداخت امن با زرین‌پال" },
    { id: "payping", name: "پی‌پینگ", description: "پرداخت با پی‌پینگ" },
    { id: "cash", name: "پرداخت در محل", description: "پرداخت هنگام تحویل" },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6">پرداخت سفارش</h2>

      {/* نمایش خطا */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-8">
        <h3 className="font-medium mb-3">روش پرداخت را انتخاب کنید:</h3>
        {gateways.map((g) => (
          <PaymentMethodCard
            key={g.id}
            method={g}
            selected={selectedGateway === g.id}
            onSelect={() => setSelectedGateway(g.id)}
          />
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold mb-2">خلاصه اطلاعات ارسال</h3>
        <p className="text-sm text-gray-600">
          {shippingInfo.firstName} {shippingInfo.lastName}
        </p>
        <p className="text-sm text-gray-600">{shippingInfo.phone}</p>
        {shippingInfo.email && (
          <p className="text-sm text-gray-600">{shippingInfo.email}</p>
        )}
        <p className="text-sm text-gray-600">
          {shippingInfo.province}، {shippingInfo.city}
        </p>
        <p className="text-sm text-gray-600">{shippingInfo.address}</p>
        <p className="text-sm text-gray-600">کد پستی: {shippingInfo.postalCode}</p>
      </div>

      {/* خلاصه سفارش */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold mb-2">خلاصه سفارش</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>تعداد آیتم‌ها:</span>
            <span>{cartItems?.length || 0} عدد</span>
          </div>
          <div className="flex justify-between">
            <span>تعداد کل کالاها:</span>
            <span>
              {cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0} عدد
            </span>
          </div>
          <div className="flex justify-between">
            <span>مبلغ کل:</span>
            <span>{(cartTotal || 0).toLocaleString()} تومان</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={onPrev}
          disabled={isLoading}
        >
          بازگشت
        </Button>
        <Button 
          onClick={handlePayment}
          disabled={isLoading || !cartItems || cartItems.length === 0}
          className="min-w-32"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              در حال ثبت...
            </div>
          ) : (
            "ثبت نهایی سفارش"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;