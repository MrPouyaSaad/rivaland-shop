// app/products/[id]/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useParams, useRouter } from 'next/navigation';
import { 
  StarIcon, 
  HeartIcon, 
  ShareIcon, 
  TruckIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import { userApiService } from '../../../services/api';
import { useUserAuth } from '../../../hooks/useUserAuth';
import Layout from '../../../components/layout/Layout';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  
  const { isAuthenticated, loading: authLoading } = useUserAuth();
  const { updateCart, cartCount } = useCart(); // استفاده از Cart Context
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [animatedTextIndex, setAnimatedTextIndex] = useState(0);
  const [addToCartError, setAddToCartError] = useState('');
  const [isInCart, setIsInCart] = useState(false);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  
  const imageContainerRef = useRef(null);
  
  const animatedTexts = [
    '👥 ۴۰ نفر در سبد خرید',
    '👀 ۵۰ نفر در حال مشاهده',
    '🚀 ۱۰۰۰+ فروش در ماه',
    '⚡ موجودی محدود',
    '🏆 پرفروش ترین محصول'
  ];

  // تابع checkCartStatus اصلاح شده
// تابع checkCartStatus اصلاح شده
const checkCartStatus = async (productId) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setIsInCart(false);
      setCurrentCartQuantity(0);
      setQuantity(1);
      return;
    }

    const cartResponse = await userApiService.getCart();
    
    // مشکل: ساختار داده‌های سرور تغییر کرده
    if (cartResponse.success && cartResponse.data) {
      // ساختار جدید: response.data.items آرایه آیتم‌هاست
      const items = Array.isArray(cartResponse.data.items) ? cartResponse.data.items : [];
      
      const cartItem = items.find(item => item && item.productId === parseInt(productId));
      
      if (cartItem) {
        setIsInCart(true);
        setCurrentCartQuantity(cartItem.quantity);
        setQuantity(cartItem.quantity);
      } else {
        setIsInCart(false);
        setCurrentCartQuantity(0);
        setQuantity(1);
      }
    } else {
      setIsInCart(false);
      setCurrentCartQuantity(0);
      setQuantity(1);
    }
  } catch (err) {
    console.error('Error checking cart status:', err);
    setIsInCart(false);
    setCurrentCartQuantity(0);
    setQuantity(1);
  }
};
// اضافه کردن این useEffect برای سینک وضعیت سبد خرید
useEffect(() => {
  const handleCartUpdate = () => {
    if (productId) {
      checkCartStatus(productId);
    }
  };

  window.addEventListener('cartUpdate', handleCartUpdate);
  
  return () => {
    window.removeEventListener('cartUpdate', handleCartUpdate);
  };
}, [productId]);
  // تابع fetchRecommendedProducts
  const fetchRecommendedProducts = async (productId) => {
    try {
      setRecommendedLoading(true);
      const response = await userApiService.request(`/api/products/${productId}/recommended`);
      if (response.success && response.data && response.data.length > 0) {
        setRecommendedProducts(response.data);
      } else {
        setRecommendedProducts([]);
      }
    } catch (err) {
      console.error('Error fetching recommended products:', err);
      setRecommendedProducts([]);
    } finally {
      setRecommendedLoading(false);
    }
  };

  // تابع fetchProduct
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await userApiService.getProductById(productId);
      
      if (response.success) {
        const productData = response.data;
        setProduct(productData);
        
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].value);
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].value);
        }
        
        // بررسی وضعیت سبد خرید - حتی اگر کاربر لاگین نباشد
        await checkCartStatus(productData.id);
        await fetchRecommendedProducts(productData.id);
      } else {
        setError('محصول یافت نشد');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('خطا در دریافت اطلاعات محصول');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [animatedTexts.length]);

 const handleAddToCart = async () => {
  if (!product || product.stock === 0) return;
  
  if (!isAuthenticated) {
    router.push('/sign-in?redirect=' + encodeURIComponent(window.location.pathname));
    return;
  }
  
  setAddingToCart(true);
  setAddToCartError('');
  
  try {
    const response = await userApiService.addToCart(product.id, quantity);
    
    if (response.success) {
      setIsInCart(true);
      setCurrentCartQuantity(quantity);
      
      // آپدیت سبد خرید در context
      await updateCart();
      
      // اطلاع‌رسانی به دیگر کامپوننت‌ها
      window.dispatchEvent(new Event('cartUpdate'));
      
      showSuccessAnimation();
    } else {
      setAddToCartError(response.message || 'خطا در افزودن به سبد خرید');
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
    setAddToCartError('خطا در ارتباط با سرور');
  } finally {
    setAddingToCart(false);
  }
};

  const handleUpdateCart = async (newQuantity) => {
  if (!product || newQuantity < 1) return;
  
  if (!isAuthenticated) {
    router.push('/sign-in?redirect=' + encodeURIComponent(window.location.pathname));
    return;
  }
  
  setQuantity(newQuantity);
  
  try {
    const response = await userApiService.updateCartItem(product.id, newQuantity);
    
    if (response.success) {
      setCurrentCartQuantity(newQuantity);
      
      // آپدیت سبد خرید در context
      await updateCart();
      
      // اطلاع‌رسانی به دیگر کامپوننت‌ها
      window.dispatchEvent(new Event('cartUpdate'));
    } else {
      setQuantity(currentCartQuantity);
      setAddToCartError(response.message || 'خطا در به‌روزرسانی سبد خرید');
    }
  } catch (err) {
    console.error('Error updating cart:', err);
    setQuantity(currentCartQuantity);
    setAddToCartError('خطا در ارتباط با سرور');
  }
};

  const AuthRequiredButton = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
      {/* توضیح بالای دکمه */}
      <div className={`text-center ${isMobile ? 'bg-orange-50 p-3 rounded-lg border border-orange-200' : 'bg-orange-50 p-4 rounded-lg border border-orange-200'}`}>
        <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
          <UserCircleIcon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-orange-600`} />
          <span className={`font-medium text-orange-700 ${isMobile ? 'text-sm' : ''}`}>
            برای افزودن به سبد خرید نیاز به ورود دارید
          </span>
        </div>
        <p className={`text-orange-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          با ورود به حساب کاربری، می‌توانید محصولات را به سبد خرید اضافه کنید
        </p>
      </div>

      {/* دکمه‌های ورود و ثبت‌نام */}
      <div className={`flex space-x-3 space-x-reverse ${isMobile ? '' : 'space-y-3 flex-col'}`}>
        <Link
          href={`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`}
          className={`flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white text-center py-3 rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-600 transform hover:scale-[1.02] hover:shadow-md font-medium flex items-center justify-center space-x-2 space-x-reverse ${
            isMobile ? 'text-sm py-2.5' : ''
          }`}
        >
          <UserCircleIcon className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          <span>ورود به حساب کاربری</span>
        </Link>
      </div>
    </div>
  );

  const showSuccessAnimation = () => {
    const addToCartBtn = document.querySelector('[data-add-to-cart]');
    if (addToCartBtn) {
      addToCartBtn.innerHTML = `
        <div class="flex items-center space-x-2 space-x-reverse">
          <svg class="w-5 h-5 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>افزوده شد!</span>
        </div>
      `;
      
      setTimeout(() => {
        if (addToCartBtn) {
          addToCartBtn.style.display = 'none';
        }
      }, 2000);
    }
    
    const mobileAddToCartBtn = document.querySelector('[data-add-to-cart-mobile]');
    if (mobileAddToCartBtn) {
      mobileAddToCartBtn.innerHTML = `
        <div class="flex items-center space-x-2 space-x-reverse">
          <svg class="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="text-sm">افزوده شد!</span>
        </div>
      `;
      
      setTimeout(() => {
        if (mobileAddToCartBtn) {
          mobileAddToCartBtn.style.display = 'none';
        }
      }, 2000);
    }
  };

  const nextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const calculateDiscountPrice = () => {
    if (!product) return 0;
    
    if (product.discount && product.discount > 0) {
      if (product.discountType === 'percent') {
        return product.price * (1 - product.discount / 100);
      } else {
        return product.price - product.discount;
      }
    }
    return product.price;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR', {
      maximumFractionDigits: 0
    }).format(price);
  };

  const ProductSkeleton = () => (
    <Layout minimalHeader={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 lg:p-6">
              
              <div className="lg:col-span-5">
                <div className="space-y-4">
                  <div className="relative aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex space-x-2 space-x-reverse">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8">
                <div className="space-y-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 lg:border-l lg:border-gray-200 lg:pl-8 hidden lg:block">
                <div className="space-y-4">
                  <div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="h-14 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return (
      <Layout minimalHeader={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            <div className="text-5xl mb-3">😔</div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">{error || 'محصول یافت نشد'}</h2>
            <p className="text-gray-600 mb-5 text-sm">متأسفانه محصول مورد نظر شما در دسترس نیست.</p>
            <Link 
              href="/" 
              className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4 ml-1.5" />
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const discountPrice = calculateDiscountPrice();
  const hasDiscount = product.discount && product.discount > 0;

  const colorOptions = product.colors || [];
  const sizeOptions = product.sizes || [];

  return (
    <Layout minimalHeader={true} cartItemsCount={cartCount}> {/* استفاده از cartCount از context */}
      <div className="min-h-screen bg-gray-50">

        {/* هدر موبایل */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <Link 
              href="/"
              className="p-2 rounded-lg bg-white shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <ArrowLeftIcon className="w-4 h-4 text-gray-700" />
            </Link>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <button className="p-2 rounded-lg bg-white shadow border border-gray-200 hover:shadow-md transition-shadow">
                <ShareIcon className="w-4 h-4 text-gray-700" />
              </button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-lg bg-white shadow border border-gray-200 hover:shadow-md transition-shadow"
              >
                {isLiked ? (
                  <HeartSolid className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* محتوای اصلی */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-4 lg:py-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 lg:p-6">
              
              {/* بخش تصاویر - کاملاً ریسپانسیو */}
              <div className="lg:col-span-5">
                <div className="space-y-4">
                  {/* تصویر اصلی */}
                  <div 
                    ref={imageContainerRef}
                    className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden group"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    {product.images && product.images.length > 0 ? (
                      <div className="w-full h-full relative">
                        <Image
                          src={product.images[selectedImage]?.url || '/images/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 35vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-sm">تصویری موجود نیست</p>
                        </div>
                      </div>
                    )}
                    
                    {/* دکمه‌های تغییر تصویر */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:bg-black/90"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 hover:bg-black/90"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* متن متحرک با ایموجی */}
                    <div className="absolute top-2 left-2">
                      <div className="bg-gradient-to-r from-black/80 to-black/60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm transition-all duration-500 ease-in-out transform animate-pulse shadow">
                        {animatedTexts[animatedTextIndex]}
                      </div>
                    </div>

                    {/* شماره تصویر */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                        {selectedImage + 1} / {product.images.length}
                      </div>
                    )}

                    {/* تگ تخفیف */}
                    {hasDiscount && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        {product.discountType === 'percent' 
                          ? `${product.discount}% تخفیف` 
                          : `${formatPrice(product.discount)} تومان تخفیف`}
                      </div>
                    )}
                  </div>

                  {/* گالری تصاویر */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            selectedImage === index 
                              ? 'border-blue-500 shadow-md scale-105' 
                              : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-full h-full relative">
                            <Image
                              src={image.url}
                              alt={`${product.name} - تصویر ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* اطلاعات محصول */}
              <div className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8">
                <div className="space-y-4">
                  {/* عنوان و دسته‌بندی */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      <Link 
                        href={`/categories/${product.category?.id}`} 
                        className="hover:text-blue-600 transition-colors inline-flex items-center"
                      >
                        <span>🏷️</span>
                        <span className="mr-1">{product.category?.name || 'دسته‌بندی'}</span>
                      </Link>
                    </div>
                    <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-relaxed">
                      {product.name}
                    </h1>
                    
                    {/* امتیاز و فروش */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <StarSolid className="w-3 h-3 text-yellow-400 ml-0.5" />
                          <span className="text-xs font-bold text-gray-700">{product.rating || 4.5}</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          ({product.reviewCount || 124} نظر)
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        📦 {product.salesCount || 1250} فروش
                      </div>
                    </div>
                  </div>

                  {/* قیمت - فقط در موبایل */}
                  <div className="lg:hidden bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(discountPrice)} تومان
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-500 line-through block mt-1">
                            {formatPrice(product.price)} تومان
                          </span>
                        )}
                      </div>
                      
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock > 0 ? `${product.stock} عدد موجود` : 'ناموجود'}
                      </div>
                    </div>
                  </div>

                  {/* انتخاب رنگ */}
                  {colorOptions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          <span className="ml-1">🎨</span>
                          رنگ:
                        </span>
                        <span className="text-xs text-gray-500">
                          {colorOptions.find(c => c.value === selectedColor)?.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`relative p-0.5 rounded-full border-2 transition-all duration-300 transform ${
                              selectedColor === color.value
                                ? 'border-blue-500 scale-110 shadow'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div 
                              className={`w-6 h-6 rounded-full ${color.class || 'bg-gray-400'}`}
                              style={color.hex ? { backgroundColor: color.hex } : {}}
                            ></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* انتخاب سایز */}
                  {sizeOptions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          <span className="ml-1">📏</span>
                          سایز:
                        </span>
                        <span className="text-xs text-gray-500">
                          {sizeOptions.find(s => s.value === selectedSize)?.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {sizeOptions.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => setSelectedSize(size.value)}
                            className={`px-3 py-2 rounded-lg border transition-all duration-300 text-sm font-medium text-center ${
                              selectedSize === size.value
                                ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm transform scale-105'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* بخش قیمت و اقدامات - فقط در دسکتاپ */}
              <div className="lg:col-span-3 lg:border-l lg:border-gray-200 lg:pl-8 hidden lg:block">
                <div className="sticky top-24 space-y-4">
                  {/* قیمت */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(discountPrice)} تومان
                      </span>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock > 0 ? `${product.stock} عدد موجود` : 'ناموجود'}
                      </div>
                    </div>
                    
                    {hasDiscount && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)} تومان
                        </span>
                        <span className="text-xs text-blue-600 font-medium">
                          {product.discountType === 'percent' 
                            ? `${product.discount}% ذخیره کنید` 
                            : `${formatPrice(product.discount)} تومان صرفه‌جویی`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* انتخاب تعداد - فقط زمانی که محصول در سبد است */}
                  {isInCart && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 text-sm font-medium">تعداد در سبد:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                          <button
                            onClick={() => handleUpdateCart(currentCartQuantity - 1)}
                            disabled={currentCartQuantity <= 1}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 min-w-[40px] text-center font-bold text-gray-900 border-x border-gray-200">
                            {currentCartQuantity}
                          </span>
                          <button
                            onClick={() => handleUpdateCart(currentCartQuantity + 1)}
                            disabled={currentCartQuantity >= product.stock}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* دکمه اقدام اصلی */}
                  {!isAuthenticated ? (
                    <AuthRequiredButton />
                  ) : !isInCart ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || addingToCart}
                      data-add-to-cart
                      className={`w-full py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse shadow font-medium text-sm ${
                        product.stock > 0 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transform hover:scale-[1.02] hover:shadow-md' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      } ${addingToCart ? 'opacity-70' : ''}`}
                    >
                      {addingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>در حال افزودن...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBagIcon className="w-5 h-5" />
                          <span className="text-base">{product.stock > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-center py-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 space-x-reverse text-green-700">
                        <CheckIcon className="w-5 h-5" />
                        <span className="font-medium">در سبد خرید موجود است</span>
                      </div>
                    </div>
                  )}

                  {/* نمایش خطا */}
                  {addToCartError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 space-x-reverse text-red-700 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{addToCartError}</span>
                      </div>
                    </div>
                  )}

                  {/* خدمات */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="bg-green-100 p-1.5 rounded-lg">
                        <TruckIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-700 text-sm">ارسال رایگان</div>
                        <div className="text-gray-500 text-xs">خرید بالای ۲ میلیون تومان</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="bg-blue-100 p-1.5 rounded-lg">
                        <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-700 text-sm">گارانتی ۱۸ ماهه</div>
                        <div className="text-gray-500 text-xs">بازگشت ۷ روزه وجه</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* تب‌های اطلاعات بیشتر */}
            <div className="border-t border-gray-200 mt-4">
              <div className="flex overflow-x-auto text-sm space-x-4 space-x-reverse px-4 py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-gray-50">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-shrink-0 px-4 py-2 font-medium border-b-2 transition-all duration-300 flex items-center ${
                    activeTab === 'description'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  }`}
                >
                  <span className="ml-1">📝</span>
                  توضیحات محصول
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-shrink-0 px-4 py-2 font-medium border-b-2 transition-all duration-300 flex items-center ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  }`}
                >
                  <span className="ml-1">💬</span>
                  نظرات ({product.reviewCount || 124})
                </button>
              </div>

              <div className="p-4">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-justify">
                      {product.description || 'توضیحاتی برای این محصول ثبت نشده است.'}
                    </p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-6 lg:space-x-reverse">
                      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{product.rating || 4.5}</div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarSolid
                              key={star}
                              className={`w-4 h-4 mx-0.5 ${
                                star <= (product.rating || 4.5) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          از {product.reviewCount || 124} نظر
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2 w-full max-w-xs">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center space-x-2 space-x-reverse text-sm">
                            <span className="text-gray-600 w-10 flex items-center">
                              {star} <StarSolid className="w-3 h-3 text-yellow-400 ml-1" />
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(star / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 w-8 text-xs">
                              ({Math.round((star / 5) * (product.reviewCount || 124))})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* محصولات پیشنهادی */}
          {recommendedProducts.length > 0 && (
            <div className="mt-6 lg:mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                  <span className="ml-2 text-xl">🛍️</span>
                  محصولات مشابه
                </h2>
                <Link href="/products" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center">
                  مشاهده همه
                  <ChevronLeftIcon className="w-3 h-3 mr-1" />
                </Link>
              </div>
              
              {recommendedLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {recommendedProducts.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.id}`}
                      className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] overflow-hidden group"
                    >
                      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        {product.image ? (
                          <div className="w-full h-full relative">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-3xl transition-transform duration-500 group-hover:scale-110">📦</div>
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
                            {product.discount}% 
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm leading-relaxed group-hover:text-blue-600 transition-colors">{product.name}</h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 space-x-reverse bg-yellow-50 px-2 py-1 rounded-full">
                            <StarSolid className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-gray-700 font-medium">{product.rating}</span>
                          </div>
                          
                          <div className="text-left">
                            <div className="font-bold text-gray-900 text-sm">
                              {formatPrice(product.price * (1 - product.discount / 100))} تومان
                            </div>
                            {product.discount > 0 && (
                              <div className="text-xs text-gray-500 line-through">
                                {formatPrice(product.price)} تومان
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* دکمه افزودن به سبد در موبایل */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-3 z-50">
        {!isAuthenticated ? (
          <AuthRequiredButton isMobile={true} />
        ) : isInCart ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-green-600 text-sm font-medium mb-1">در سبد خرید موجود است</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">تعداد: {currentCartQuantity}</div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleUpdateCart(currentCartQuantity - 1)}
                    disabled={currentCartQuantity <= 1}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 bg-white border border-gray-300 rounded-lg font-bold">
                    {currentCartQuantity}
                  </span>
                  <button
                    onClick={() => handleUpdateCart(currentCartQuantity + 1)}
                    disabled={currentCartQuantity >= product.stock}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between space-x-3 space-x-reverse">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(discountPrice)} تومان
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(product.price)} تومان
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {product.stock > 0 ? `${product.stock} عدد موجود` : 'ناموجود'}
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              data-add-to-cart-mobile
              className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 space-x-reverse shadow font-medium text-sm min-w-[140px] justify-center ${
                product.stock > 0 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } ${addingToCart ? 'opacity-70' : ''}`}
            >
              {addingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>در حال افزودن...</span>
                </>
              ) : (
                <>
                  <ShoppingBagIcon className="w-4 h-4" />
                  <span>{product.stock > 0 ? 'افزودن به سبد' : 'ناموجود'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* نمایش خطا در موبایل */}
        {addToCartError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 space-x-reverse text-red-700 text-xs">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{addToCartError}</span>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #D1D5DB;
          border-radius: 10px;
        }
        
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #F3F4F6;
          border-radius: 10px;
        }
      `}</style>
    </Layout>
  );
};

export default ProductDetailPage;