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
      console.log('Cart API Response:', response); // برای دیباگ
      
      if (response.success && response.data) {
        const items = Array.isArray(response.data.items) ? response.data.items : [];
        const totalQuantity = response.data.totalQuantity || 0;
        const total = response.data.summary?.total || 0;
        
        setCartItems(items);
        setCartTotal(total);
        setCartCount(totalQuantity);
        
        console.log('Cart Updated:', { 
          items, 
          total, 
          totalQuantity,
          subtotal: response.data.subtotal,
          summary: response.data.summary
        });
      } else {
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCart = async () => {
    await fetchCartData();
  };

  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
    setCartCount(0);
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      fetchCartData();
    }
  }, []);

  // گوش دادن به تغییرات برای سینک وضعیت سبد خرید
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        fetchCartData();
      } else {
        clearCart();
      }
    };

    const handleCartUpdate = () => {
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
      fetchCartData
    }}>
      {children}
    </CartContext.Provider>
  );
};