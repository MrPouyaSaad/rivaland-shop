// contexts/CartContext.js - اصلاح شده
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { userApiService } from '@/services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCartData = async () => {
    try {
      setIsLoading(true);
      const response = await userApiService.getCart();
      console.log('📦 Cart API Full Response:', response); // برای دیباگ
      
      // بررسی ساختار پاسخ - ممکن است داده‌ها در response.data.data باشند
      const cartData = response.data?.data || response.data;
      
      if (response.success && cartData) {
        const items = Array.isArray(cartData.items) ? cartData.items : [];
        
        // محاسبه تعداد کل آیتم‌ها
        const totalQuantity = items.reduce((total, item) => total + (item.quantity || 0), 0);
        
        // استفاده از total از پاسخ یا محاسبه دستی
        const total = cartData.subtotal || cartData.summary?.total || 0;
        
        setCartItems(items);
        setCartTotal(total);
        setCartCount(totalQuantity);
        
        console.log('🛒 Cart State Updated:', { 
          itemsCount: items.length,
          totalQuantity,
          total,
          items
        });
      } else {
        console.log('🛒 Cart Empty or Failed');
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCart = async () => {
    console.log('🔄 Manual cart update triggered');
    await fetchCartData();
  };

  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
    setCartCount(0);
  };

  // افزودن تابع برای افزودن آیتم به صورت محلی (اختیاری)
  const addItemToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => 
        i.productId === item.productId && 
        i.variantId === item.variantId
      );
      
      if (existingItem) {
        return prev.map(i =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        return [...prev, item];
      }
    });
    
    setCartCount(prev => prev + item.quantity);
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      console.log('🔐 User authenticated, fetching cart...');
      fetchCartData();
    } else {
      console.log('🔓 User not authenticated, clearing cart');
      clearCart();
    }
  }, []);

  // گوش دادن به تغییرات برای سینک وضعیت سبد خرید
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('userToken');
      console.log('💾 Storage changed, checking auth...');
      if (token) {
        fetchCartData();
      } else {
        clearCart();
      }
    };

    const handleCartUpdate = () => {
      console.log('🔄 Cart update event received');
      fetchCartData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdate', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      cartCount,
      isLoading,
      updateCart,
      clearCart,
      fetchCartData,
      addItemToCart
    }}>
      {children}
    </CartContext.Provider>
  );
};