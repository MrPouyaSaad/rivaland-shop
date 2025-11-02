import React, { useState, useEffect } from "react";
import CartItemCard from "../components/CartItemCard";
import OrderSummary from "../components/OrderSummary";
import { useCart } from '@/contexts/CartContext';
import Button from "@/components/ui/Button";
import { userApiService } from '@/services/api';

const CartStep = ({ onNext }) => {
  const { cartItems, cartTotal, cartCount, isLoading, updateCart } = useCart();
  const [cartData, setCartData] = useState({});
  const [loading, setLoading] = useState(false);

  // دریافت داده‌های کامل سبد خرید برای OrderSummary
  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await userApiService.getCart();
      if (response.success) {
        setCartData(response.data);
        console.log('📦 Cart data for summary:', response.data);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems?.length > 0) {
      fetchCartData();
    }
  }, [cartItems]);

  // وقتی آیتم‌های سبد خرید تغییر می‌کنند، داده‌ها را به‌روزرسانی کن
  useEffect(() => {
    const handleCartUpdate = () => {
      if (cartItems?.length > 0) {
        fetchCartData();
      }
    };

    window.addEventListener('cartUpdate', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, [cartItems]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری سبد خرید...</p>
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m5.5-5.5h5.5m-5.5 0V19a2 2 0 104 0v-1.5m-4-4.5h4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">سبد خرید شما خالی است</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          می‌توانید با مراجعه به صفحه محصولات، کالاهای مورد نظر خود را به سبد خرید اضافه کنید.
        </p>
        <Button 
          onClick={() => (window.location.href = "/products")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          مشاهده محصولات
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر سبد خرید */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <h1 className="text-2xl font-bold text-gray-900">سبد خرید</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {cartCount} کالا
            </span>
          </div>
          <button 
            onClick={() => (window.location.href = "/products")}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            + افزودن کالای دیگر
          </button>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* لیست آیتم‌های سبد خرید */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItemCard 
              key={item.id} 
              item={item}
              onUpdate={() => {
                // وقتی آیتم آپدیت شد، داده‌های سبد خرید را refresh کن
                setTimeout(() => {
                  updateCart();
                  fetchCartData();
                }, 500);
              }}
            />
          ))}

     
        </div>

        {/* خلاصه سفارش */}
        <div className="lg:col-span-1">
          <OrderSummary 
            cartData={cartData}
            onNext={onNext}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CartStep;