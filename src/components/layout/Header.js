'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { userApiService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);

  // استفاده از Cart Context
  const { cartItems, cartTotal, cartCount, updateCart, clearCart } = useCart();

  const menuRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const searchRef = useRef(null);
  const cartRef = useRef(null);

  // تابع برای بررسی اعتبار توکن
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }

    try {
      const response = await userApiService.getProfile();
      if (response.success) {
        setIsLoggedIn(true);
        return true;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('Token is invalid, clearing...');
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        // پاک کردن سبد خرید هنگام خروج
        clearCart();
      }
      return false;
    }
  }, [clearCart]);

  useEffect(() => {
    const checkAuth = async () => {
      await validateToken();
    };
    
    checkAuth();

    // گوش دادن به تغییرات localStorage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // گوش دادن به رویدادهای custom برای مدیریت وضعیت لاگین
    window.addEventListener('authChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, [validateToken]);

  // دریافت دسته‌بندی‌ها
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await userApiService.getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // مدیریت اسکرول
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // بستن منوها با کلیک خارج
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) setIsMenuOpen(false);
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target) && isCategoryMenuOpen) setIsCategoryMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target) && isSearchOpen) setIsSearchOpen(false);
      if (cartRef.current && !cartRef.current.contains(event.target) && isCartHovered) setIsCartHovered(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isCategoryMenuOpen, isSearchOpen, isCartHovered]);

  // بستن با ESC
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsCategoryMenuOpen(false);
        setIsSearchOpen(false);
        setIsCartHovered(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // غیرفعال کردن اسکرول پس‌زمینه وقتی منو یا جستجو باز است
  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isSearchOpen) ? 'hidden' : 'unset';
  }, [isMenuOpen, isSearchOpen]);

  const isScrolled = scrollPosition > 10;

  const popularSuggestions = ["گوشی موبایل سامسونگ", "لپ تاپ ایسر", "هدفون بلوتوث", "کفش نایک", "عطر مردانه", "لوازم آشپزخانه"];

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSearchOpen(false);
      }, 1000);
    }
  }, [searchQuery]);

  const clearSearch = useCallback(() => setSearchQuery(''), []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    
    // پخش event برای کامپوننت‌های دیگر
    window.dispatchEvent(new Event('authChange'));
    
    // ریست کردن سبد خرید
    clearCart();
  };

  // تابع برای نمایش آیکون/عکس دسته‌بندی
  const getCategoryIcon = (category) => {
    if (category.image) {
      return (
        <div className="relative w-8 h-8 md:w-10 md:h-10">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover rounded-full"
            onError={(e) => {
              e.target.src = '/category.png';
              e.target.onerror = null;
            }}
          />
        </div>
      );
    }
    
    return (
      <div className="relative w-4 h-4 md:w-4 md:h-4">
        <Image
          src="/category.png"
          alt="دسته‌بندی عمومی"
          fill
          className="object-cover rounded-full"
        />
      </div>
    );
  };

  // تابع برای فرمت کردن قیمت
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR',{
      maximumFractionDigits:0
    }).format(price) + ' تومان';
  };

  // تابع برای محاسبه قیمت اصلی هر آیتم (قبل از تخفیف)
  const calculateOriginalItemPrice = (item) => {
    if (!item.product) return 0;
    const basePrice = item.product.price || 0;
    return basePrice * (item.quantity || 1);
  };

  // تابع برای محاسبه قیمت نهایی هر آیتم (بعد از تخفیف)
  const calculateItemPrice = (item) => {
    return item.itemTotal || 0;
  };

  // بررسی آیا محصول تخفیف دارد
  const hasDiscount = (item) => {
    if (!item.product) return false;
    const basePrice = item.product.price || 0;
    const currentPrice = item.product.currentPrice || basePrice;
    return currentPrice < basePrice;
  };

  // محاسبه درصد تخفیف برای هر آیتم
  const calculateItemDiscountPercentage = (item) => {
    if (!item.product) return 0;
    const basePrice = item.product.price || 0;
    const currentPrice = item.product.currentPrice || basePrice;
    
    if (basePrice <= currentPrice) return 0;
    return Math.round(((basePrice - currentPrice) / basePrice) * 100);
  };

  // محاسبه جمع جزئی (قبل از تخفیف)
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + calculateOriginalItemPrice(item), 0);
  };

  // محاسبه مجموع تخفیف‌ها
  const calculateTotalDiscount = () => {
    return calculateSubtotal() - cartTotal;
  };

  // تابع برای گرفتن اولین عکس محصول
  const getProductImage = (item) => {
    if (!item.product) return '/placeholder-product.jpg';
    
    // اگر عکس اصلی وجود دارد
    if (item.product.image) {
      return item.product.image;
    }
    
    // اگر آرایه images وجود دارد و اولین عکس موجود است
    if (item.product.images && item.product.images.length > 0) {
      const mainImage = item.product.images.find(img => img.isMain);
      if (mainImage) return mainImage.url;
      return item.product.images[0].url;
    }
    
    return '/placeholder-product.jpg';
  };

  return (
    <>
      {/* بنر بالایی */}
      <div className="relative w-full py-3 md:py-6 lg:py-8 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="text-2xl md:text-5xl lg:text-7xl font-black text-white/5 tracking-widest scale-110">ریـوالنـد</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-lg md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent tracking-tight">
                Riva Land
              </h1>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -left-4 md:-top-8 md:-left-8 w-12 md:w-16 lg:w-24 h-12 md:h-16 lg:h-24 rounded-full bg-cyan-400/20 blur-xl animate-pulse"></div>
        <div className="absolute -bottom-5 -right-5 md:-bottom-10 md:-right-10 w-16 md:w-24 lg:w-32 h-16 md:h-24 lg:h-32 rounded-full bg-purple-400/20 blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-10 md:w-16 lg:w-20 h-10 md:h-16 lg:h-20 rounded-full bg-white/10 blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 md:w-12 lg:w-16 h-8 md:h-12 lg:h-16 rounded-full bg-cyan-300/10 blur-md animate-pulse delay-1500"></div>
      </div>

      {/* هدر اصلی */}
      <header className={`sticky top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xl' : 'bg-white/90 backdrop-blur-md border-b border-gray-100'}`}>
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 md:py-3">
            {/* لوگو */}
            <Link href="/" className="flex items-center space-x-2 space-x-reverse group flex-shrink-0">
              <div className="relative">
                <div className="w-7 h-7 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src="/r.png"
                      alt="Riva Land Logo"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                      <span className="text-white font-bold text-base md:text-xl tracking-tighter">R</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-1 md:-inset-1.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-500/20 rounded-xl blur-sm group-hover:blur transition-all duration-300 opacity-70 group-hover:opacity-100 -z-10"></div>
              </div>
              <span className="text-lg md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                ریـوالنـد
              </span>
            </Link>

            {/* منوی دسکتاپ */}
            <div className="hidden lg:flex items-center space-x-6 space-x-reverse">
              <div 
                className="relative group"
                ref={categoryMenuRef}
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button
                  aria-expanded={isCategoryMenuOpen}
                  aria-controls="category-menu"
                  className="flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                >
                  <span>دسته‌بندی‌ها</span>
                  <svg className={`w-4 h-4 transform transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {categories.length > 0 && (
                  <div 
                    id="category-menu" 
                    className={`absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-40 mt-1 p-2 w-80 max-h-[70vh] overflow-y-auto transition-all duration-300 ${isCategoryMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                  >
                    <div className="space-y-1 py-2">
                      {categories.map((category, index) => {
                        const gradientColors = [
                          'from-blue-500 to-purple-500',
                          'from-green-500 to-teal-500',
                          'from-red-500 to-pink-500',
                          'from-yellow-500 to-orange-500',
                          'from-indigo-500 to-blue-500',
                          'from-purple-500 to-pink-500',
                          'from-teal-500 to-cyan-500',
                          'from-orange-500 to-red-500'
                        ];
                        const gradient = gradientColors[index % gradientColors.length];
                        
                        return (
                          <Link 
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 group/category"
                            onClick={() => setIsCategoryMenuOpen(false)}
                          >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${gradient} text-white shadow-md group-hover/category:scale-110 transition-transform overflow-hidden`}>
                              {getCategoryIcon(category)}
                            </div>
                            <div className="mr-3 flex-1">
                              <h4 className="font-semibold text-gray-800 group-hover/category:text-blue-600 transition-colors">
                                {category.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">مشاهده همه محصولات</p>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 group-hover/category:text-blue-500 transform group-hover/category:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">خانه</Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">محصولات</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">درباره ما</Link>
            </div>

            {/* اقدامات سمت راست */}
            <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6 space-x-reverse">
              {/* جستجو */}
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="p-2 md:p-2.5 text-gray-700 hover:text-blue-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg mr-1 md:mr-2" 
                aria-label="جستجو"
              >
                <svg className="w-5 h-5 md:w-5.5 md:h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* سبد خرید با قابلیت هاور */}
              <div 
                ref={cartRef}
                className="relative"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <Link 
                  href="/cart" 
                  className="relative p-2 md:p-2.5 text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                  aria-label="سبد خرید"
                >
                  <svg className="w-5 h-5 md:w-5.5 md:h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  
                  {/* باجت تعداد محصولات */}
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs font-bold">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* پنل محتویات سبد خرید (هاور) */}
                {isCartHovered && (
                  <div className="absolute left-0 top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in-0 zoom-in-95">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">سبد خرید شما</h3>
                        <span className="text-sm text-gray-500">{cartCount} کالا</span>
                      </div>

                      {cartItems.length > 0 ? (
                        <>
                          <div className="max-h-64 overflow-y-auto space-y-3">
                            {cartItems.map((item) => {
                              const finalPrice = calculateItemPrice(item);
                              const originalPrice = calculateOriginalItemPrice(item);
                              const itemHasDiscount = hasDiscount(item);
                              const discountPercentage = calculateItemDiscountPercentage(item);
                              const productImage = getProductImage(item);
                              
                              return (
                                <div key={item.id} className="flex items-center space-x-3 space-x-reverse p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="relative w-12 h-12 flex-shrink-0">
                                    <Image
                                      src={productImage}
                                      alt={item.product?.name || 'محصول'}
                                      fill
                                      className="object-cover rounded-lg"
                                      onError={(e) => {
                                        e.target.src = '/placeholder-product.jpg';
                                        e.target.onerror = null;
                                      }}
                                    />
                                    {/* نمایش تگ تخفیف روی عکس */}
                                    {itemHasDiscount && discountPercentage > 0 && (
                                      <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                        %{discountPercentage}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-gray-800 truncate">
                                      {item.product?.name || 'محصول'}
                                    </h4>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-xs text-gray-500">تعداد: {item.quantity}</span>
                                      <div className="flex flex-col items-end">
                                        <span className="text-sm font-semibold text-blue-600">
                                          {formatPrice(finalPrice)}
                                        </span>
                                        {itemHasDiscount && originalPrice > finalPrice && (
                                          <span className="text-xs text-gray-400 line-through">
                                            {formatPrice(originalPrice)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* خلاصه سبد خرید */}
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="space-y-2">
                              {/* جمع جزئی */}
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">جمع جزئی:</span>
                                <span className="text-gray-700">
                                  {formatPrice(calculateSubtotal())}
                                </span>
                              </div>
                              
                              {/* تخفیف */}
                              {calculateTotalDiscount() > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-green-600">تخفیف:</span>
                                  <span className="text-green-600">
                                    -{formatPrice(calculateTotalDiscount())}
                                  </span>
                                </div>
                              )}
                              
                              {/* جمع کل */}
                              <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-200">
                                <span className="text-gray-800 font-medium">جمع کل:</span>
                                <span className="font-semibold text-lg text-blue-600">
                                  {formatPrice(cartTotal)}
                                </span>
                              </div>
                            </div>
                            
                            <Link 
                              href="/cart" 
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg text-center font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 block"
                              onClick={() => setIsCartHovered(false)}
                            >
                              مشاهده سبد خرید
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <p className="text-gray-500">سبد خرید شما خالی است</p>
                          <Link 
                            href="/products" 
                            className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            onClick={() => setIsCartHovered(false)}
                          >
                            شروع به خرید کنید
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* پروفایل یا دکمه ورود */}
              {isLoggedIn ? (
                <Link href="/profile" className="hidden md:block p-1.5 md:p-2 text-gray-600 hover:text-blue-600 transition-colors" aria-label="پروفایل کاربری">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              ) : (
                <Link href="/sign-in" className="hidden md:flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-blue-600 transition-colors text-sm md:text-base">
                  <span>ورود</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
              )}

              {/* منوی موبایل */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-1.5 md:p-2 text-gray-600 hover:text-blue-600 transition-colors" aria-expanded={isMenuOpen} aria-label="منوی موبایل">
                {isMenuOpen ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* منوی موبایل */}
        <div
          ref={menuRef}
          className={`lg:hidden fixed top-0 left-0 right-0 z-40 bg-white transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <div className="container mx-auto px-4 py-6 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">منو</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-blue-600">
                ✕
              </button>
            </div>
            <nav className="space-y-4">
              <Link href="/" className="block py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>خانه</Link>
              <Link href="/products" className="block py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>محصولات</Link>
              <Link href="/about" className="block py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>درباره ما</Link>

              {/* پروفایل یا ورود */}
              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="flex items-center py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
                    پروفایل کاربری
                  </Link>
                  <button onClick={handleLogout} className="flex items-center py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100 w-full text-right">
                    خروج از حساب
                  </button>
                </>
              ) : (
                <Link href="/sign-in" className="flex items-center py-3 text-gray-700 hover:text-blue-600 transition-colors font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
                  ورود به حساب کاربری
                </Link>
              )}

              {/* دسته‌بندی‌ها */}
              <div className="border-t border-gray-100 pt-4">
                <button className="flex items-center justify-between w-full py-3 text-gray-700 font-medium border-b border-gray-100" onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)} aria-expanded={isCategoryMenuOpen}>
                  <span>دسته‌بندی‌ها</span>
                  <svg className={`w-4 h-4 transform transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoryMenuOpen && categories.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-3 pr-4">
                    {categories.map((category, index) => {
                      const gradientColors = [
                        'from-blue-500 to-purple-500',
                        'from-green-500 to-teal-500',
                        'from-red-500 to-pink-500',
                        'from-yellow-500 to-orange-500'
                      ];
                      const gradient = gradientColors[index % gradientColors.length];
                      
                      return (
                        <Link 
                          key={category.id} 
                          href={`/products?category=${category.id}`} 
                          className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all" 
                          onClick={() => {
                            setIsCategoryMenuOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${gradient} overflow-hidden`}>
                            {getCategoryIcon(category)}
                          </div>
                          <span className="text-gray-700 font-medium">{category.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* overlay جستجو */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16 md:pt-20 px-3">
          <div ref={searchRef} className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-4 md:p-6">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input type="text" placeholder="چه چیزی نیاز دارید؟..." className="w-full px-10 md:px-12 py-3 md:py-4 border-0 text-base md:text-lg focus:outline-none focus:ring-0 rounded-lg bg-gray-50" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button type="submit" className="absolute right-3 md:right-4 top-3 md:top-4 text-gray-400 hover:text-gray-600" aria-label="جستجو">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  {searchQuery && (
                    <button type="button" onClick={clearSearch} className="absolute left-10 md:left-14 top-3 md:top-4 text-gray-400 hover:text-gray-600" aria-label="پاک کردن جستجو">
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute left-3 md:left-4 top-3 md:top-4 text-gray-400 hover:text-gray-600" aria-label="بستن جستجو">
                    ✕
                  </button>
                </div>
              </form>

              {isLoading ? (
                <div className="mt-4 md:mt-6 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="mt-4 md:mt-6">
                  <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">پیشنهادات پرطرفدار</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {popularSuggestions.map((suggestion, index) => (
                      <button key={index} onClick={() => { setSearchQuery(suggestion); handleSearch({ preventDefault: () => {} }); }} className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-right text-xs md:text-sm">{suggestion}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;