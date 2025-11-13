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
  UserCircleIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  CubeIcon,
  DevicePhoneMobileIcon
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
  const { updateCart, cartCount } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addToCartError, setAddToCartError] = useState('');
  const [isInCart, setIsInCart] = useState(false);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  
  const imageContainerRef = useRef(null);

  const getStockStatus = (stock) => {
    if (stock <= 0) {
      return {
        text: 'ناموجود',
        class: 'bg-gray-100 text-gray-600 border-gray-200',
        urgency: 'none',
        message: 'این محصول در حال حاضر موجود نیست'
      };
    } else if (stock <= 3) {
      return {
        text: `فقط ${stock} عدد`,
        class: 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200',
        urgency: 'high',
        message: 'آخرین فرصت خرید'
      };
    } else if (stock <= 10) {
      return {
        text: `موجودی محدود`,
        class: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200',
        urgency: 'medium',
        message: 'موجودی محدود'
      };
    } else {
      return {
        text: '',
        class: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200',
        urgency: 'normal',
        message: ''
      };
    }
  };

  const checkCartStatus = async (productId) => {
    try {
      if (!isAuthenticated) {
        setIsInCart(false);
        setCurrentCartQuantity(0);
        setQuantity(1);
        return;
      }

      const cartResponse = await userApiService.getCart();
      
      if (cartResponse.success && cartResponse.data) {
        const items = Array.isArray(cartResponse.data.items) ? cartResponse.data.items : [];
        
        const cartItem = items.find(item => {
          if (!item) return false;
          
          if (item.productId === parseInt(productId)) {
            if (selectedVariant && item.variantId) {
              return item.variantId === selectedVariant.id;
            }
            return true;
          }
          return false;
        });
        
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
  }, [productId, isAuthenticated, selectedVariant]);

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

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await userApiService.getProductById(productId);
      
      if (response.success) {
        const productData = response.data;
        setProduct(productData);
        
        if (productData.variants && productData.variants.length > 0) {
          const availableVariant = productData.variants.find(v => v.stock > 0) || productData.variants[0];
          setSelectedVariant(availableVariant);
        }
        
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

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (productId) {
      setTimeout(() => checkCartStatus(productId), 100);
    }
  };

  const getCurrentProductPrice = () => {
    if (!product) return 0;
    
    const basePrice = selectedVariant ? selectedVariant.price : product.price;
    const variantDiscount = selectedVariant?.discount || 0;
    const productDiscount = product.discount || 0;
    
    const totalDiscount = Math.max(variantDiscount, productDiscount);
    
    return totalDiscount > 0 
      ? basePrice * (1 - totalDiscount / 100)
      : basePrice;
  };

  const getCurrentProductStock = () => {
    if (!product) return 0;
    
    if (selectedVariant) {
      return selectedVariant.stock;
    }
    return product.stock;
  };

  const getCurrentDiscount = () => {
    if (!product) return 0;
    
    const variantDiscount = selectedVariant?.discount || 0;
    const productDiscount = product.discount || 0;
    return Math.max(variantDiscount, productDiscount);
  };

  const getBasePrice = () => {
    if (!product) return 0;
    
    return selectedVariant ? selectedVariant.price : product.price;
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const currentStock = getCurrentProductStock();
    if (currentStock === 0) return;
    
    if (!isAuthenticated) {
      router.push('/sign-in?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    setAddingToCart(true);
    setAddToCartError('');
    
    try {
      const cartData = {
        productId: product.id,
        quantity: quantity,
        variantId: selectedVariant?.id || null
      };

      const response = await userApiService.addToCart(cartData);
      
      if (response.success) {
        setIsInCart(true);
        setCurrentCartQuantity(quantity);
        
        await updateCart();
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
    if (!product) return;
    
    const currentStock = getCurrentProductStock();
    if (newQuantity < 1 || newQuantity > currentStock) return;
    
    if (!isAuthenticated) {
      router.push('/sign-in?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    setQuantity(newQuantity);
    
    try {
      const cartResponse = await userApiService.getCart();
      
      if (cartResponse.success && cartResponse.data) {
        const items = Array.isArray(cartResponse.data.items) ? cartResponse.data.items : [];
        
        const cartItem = items.find(item => {
          if (!item) return false;
          
          if (item.productId === parseInt(productId)) {
            if (selectedVariant && item.variantId) {
              return item.variantId === selectedVariant.id;
            }
            return true;
          }
          return false;
        });
        
        if (cartItem && cartItem.id) {
          const response = await userApiService.updateCartItem(cartItem.id, newQuantity);
          
          if (response.success) {
            setCurrentCartQuantity(newQuantity);
            await updateCart();
            window.dispatchEvent(new Event('cartUpdate'));
          } else {
            setQuantity(currentCartQuantity);
            setAddToCartError(response.message || 'خطا در به‌روزرسانی سبد خرید');
          }
        } else {
          setQuantity(currentCartQuantity);
          setAddToCartError('آیتم در سبد خرید یافت نشد');
        }
      } else {
        setQuantity(currentCartQuantity);
        setAddToCartError('خطا در دریافت سبد خرید');
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      setQuantity(currentCartQuantity);
      setAddToCartError('خطا در ارتباط با سرور');
    }
  };

  const AuthRequiredButton = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
      <div className={`text-center ${isMobile ? 'bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200'}`}>
        <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
          <UserCircleIcon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
          <span className={`font-medium text-blue-700 ${isMobile ? 'text-sm' : 'text-base'}`}>
            برای افزودن به سبد خرید نیاز به ورود دارید
          </span>
        </div>
      </div>

      <div className={`flex space-x-3 space-x-reverse ${isMobile ? '' : 'space-y-3 flex-col'}`}>
        <Link
          href={`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`}
          className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] hover:shadow-md font-medium flex items-center justify-center space-x-2 space-x-reverse ${
            isMobile ? 'text-sm py-2.5' : 'text-base'
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
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR', {
      maximumFractionDigits: 0
    }).format(price);
  };

  const ProductSkeleton = () => (
    <Layout minimalHeader={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="w-full px-4 py-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-gray-200/50">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 p-6">
              
              <div className="xl:col-span-5">
                <div className="space-y-4">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-blue-200 rounded-xl animate-pulse"></div>
                  <div className="flex space-x-2 space-x-reverse">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-16 h-16 bg-gradient-to-br from-gray-200 to-blue-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4">
                <div className="space-y-4">
                  <div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-blue-200 rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-blue-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-blue-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-10 bg-gradient-to-r from-gray-100 to-blue-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="xl:col-span-3">
                <div className="space-y-4">
                  <div className="h-20 bg-gradient-to-r from-gray-100 to-blue-100 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gradient-to-r from-gray-100 to-blue-100 rounded-lg animate-pulse"></div>
                  <div className="h-14 bg-gradient-to-r from-gray-100 to-blue-100 rounded-lg animate-pulse"></div>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{error || 'محصول یافت نشد'}</h2>
            <p className="text-gray-600 mb-5 text-sm">متأسفانه محصول مورد نظر شما در دسترس نیست.</p>
            <Link 
              href="/" 
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4 ml-1.5" />
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const currentPrice = getCurrentProductPrice();
  const basePrice = getBasePrice();
  const currentDiscount = getCurrentDiscount();
  const currentStock = getCurrentProductStock();
  const hasDiscount = currentDiscount > 0;
  const stockStatus = getStockStatus(currentStock);
  const hasMultipleVariants = product.variants && product.variants.length > 1;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images?.map(img => img.url) || [],
            "sku": product.id,
            "mpn": product.id,
            "brand": {
              "@type": "Brand",
              "name": "سایرون"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://saironstore.ir/products/${product.id}`,
              "priceCurrency": "IRR",
              "price": currentPrice,
              "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "availability": currentStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating || 4.5,
              "reviewCount": product.reviewCount || 124
            }
          })
        }}
      />

      <Layout minimalHeader={true} cartItemsCount={cartCount}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

          <div className="xl:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <Link 
                href="/"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="بازگشت به صفحه اصلی"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
              </Link>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="اشتراک گذاری محصول">
                  <ShareIcon className="w-5 h-5 text-gray-700" />
                </button>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label={isLiked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                >
                  {isLiked ? (
                    <HeartSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full px-4 xl:px-32 py-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-gray-200/50">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 p-6">
                
                <div className="xl:col-span-4">
                  <div className="space-y-4">
                    <div 
                      ref={imageContainerRef}
                      className="relative w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl overflow-hidden group"
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      {product.images && product.images.length > 0 ? (
                        <div className="w-full h-full relative flex items-center justify-center">
                          <Image
                            src={product.images[selectedImage]?.url || '/images/placeholder.png'}
                            alt={`تصویر ${product.name} - فروشگاه اینترنتی سایرون`}
                            width={600}
                            height={600}
                            unoptimized={true}
                            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                            priority
                            sizes="(max-width: 1280px) 100vw, 50vw"
                            style={{ 
                              objectFit: 'contain',
                              padding: '12px'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                              <DevicePhoneMobileIcon className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">تصویری موجود نیست</p>
                          </div>
                        </div>
                      )}
                      
                      {product.images && product.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-700 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                            aria-label="تصویر قبلی"
                          >
                            <ChevronLeftIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-700 p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                            aria-label="تصویر بعدی"
                          >
                            <ChevronRightIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                          {selectedImage + 1} / {product.images.length}
                        </div>
                      )}

                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                          {currentDiscount}% تخفیف
                        </div>
                      )}
                    </div>

                    {product.images && product.images.length > 1 && (
                      <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all duration-300 bg-white ${
                              selectedImage === index 
                                ? 'border-blue-500 shadow-sm' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            aria-label={`نمایش تصویر ${index + 1} از ${product.name}`}
                          >
                            <div className="w-full h-full relative flex items-center justify-center">
                              <Image
                                src={image.url}
                                alt={`تصویر ${index + 1} از ${product.name} - سایرون`}
                                width={64}
                                height={64}
                                unoptimized={true}
                                className="object-contain w-full h-full"
                                sizes="64px"
                                style={{ 
                                  objectFit: 'contain',
                                  padding: '2px'
                                }}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="xl:col-span-5">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <TagIcon className="w-3 h-3 ml-1" />
                        <Link 
                          href={`/categories/${product.category?.id}`} 
                          className="hover:text-blue-600 transition-colors"
                          title={`دسته‌بندی ${product.category?.name} در سایرون`}
                        >
                          {product.category?.name || 'دسته‌بندی'}
                        </Link>
                      </div>
                      
                      <h1 className="text-xl font-bold text-gray-900 leading-relaxed" itemProp="name">
                        {product.name}
                      </h1>
                      
                      <div className="flex items-center space-x-4 space-x-reverse text-sm">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <div className="flex items-center">
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
                          <span className="font-medium text-gray-700">{product.rating || 4.5}</span>
                          <span className="text-gray-500">({product.reviewCount || 124})</span>
                        </div>
                        
                        <div className="flex items-center text-gray-500">
                          <ShoppingCartIcon className="w-3 h-3 ml-1" />
                          {product.salesCount || 1250} فروش
                        </div>
                      </div>
                    </div>

                    <div className="xl:hidden bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-2xl font-black text-gray-900 block tracking-tight">
                            {formatPrice(currentPrice)} <span className="text-lg font-bold">تومان</span>
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through font-medium">
                              {formatPrice(basePrice)} تومان
                            </span>
                          )}
                        </div>
                        
                        {stockStatus.text && (
                          <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${stockStatus.class}`}>
                            {stockStatus.text}
                          </div>
                        )}
                      </div>
                    </div>

                    {product.variants && product.variants.length > 0 && (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-700">
                          {hasMultipleVariants 
                            ? "یکی از گزینه‌های زیر را انتخاب کنید:" 
                            : "گزینه انتخابی:"}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {product.variants.map((variant) => {
                            const isSelected = selectedVariant?.id === variant.id;
                            const isAvailable = variant.stock > 0;
                            const variantTitle = Object.values(variant.attributes || {}).join(' - ');
                            
                            return (
                              <button
                                key={variant.id}
                                onClick={() => handleVariantSelect(variant)}
                                disabled={!isAvailable}
                                className={`p-3 rounded-xl border transition-all duration-300 text-right hover:shadow-sm flex-shrink-0 min-w-[50px] ${
                                  isSelected
                                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 ring-2 ring-blue-500/30'
                                    : !isAvailable
                                    ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                                    : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50/50'
                                }`}
                                aria-label={`انتخاب ${variantTitle} ${!isAvailable ? '- ناموجود' : ''}`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1 text-right">
                                      <div className="font-bold text-gray-900 text-sm">
                                        {variantTitle}
                                      </div>
                                    </div>
                                    
                                    {isSelected && (
                                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-1 rounded-full mr-2 lg:mr-3">
                                        <CheckIcon className="w-3 h-3" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {product.attributes && product.attributes.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                          <CubeIcon className="w-4 h-4 ml-1" />
                          مشخصات فنی
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {product.attributes.map((attribute, index) => (
                            <div 
                              key={attribute.id}
                              className="flex flex-col p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-sm min-h-[80px]"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500 font-medium">{attribute.name}</span>
                              </div>
                              <span className="font-semibold text-gray-900 text-sm text-right leading-relaxed break-words">
                                {attribute.value || '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="xl:col-span-3">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-gray-900 tracking-tight" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                            <span itemProp="price">{formatPrice(currentPrice)}</span> <span className="text-lg font-bold">تومان</span>
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through font-medium">
                              {formatPrice(basePrice)} تومان
                            </span>
                          )}
                        </div>
                        
                        {stockStatus.text && (
                          <div className={`px-3 py-1.5 rounded-full text-center text-sm font-medium border ${stockStatus.class}`}>
                            {stockStatus.text}
                          </div>
                        )}
                      </div>

                      {!isAuthenticated ? (
                        <AuthRequiredButton />
                      ) : !isInCart ? (
                        <button
                          onClick={handleAddToCart}
                          disabled={currentStock === 0 || addingToCart}
                          data-add-to-cart
                          className={`w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse shadow font-medium text-sm ${
                            currentStock > 0 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] hover:shadow-lg' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          } ${addingToCart ? 'opacity-70' : ''}`}
                          aria-label={currentStock > 0 ? `افزودن ${product.name} به سبد خرید` : 'محصول ناموجود'}
                        >
                          {addingToCart ? (
                            <>
                              <ArrowPathIcon className="w-4 h-4 animate-spin" />
                              <span>در حال افزودن...</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBagIcon className="w-4 h-4" />
                              <span>{currentStock > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-center py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl space-y-3">
                          <div className="flex items-center justify-center space-x-2 space-x-reverse text-green-700 text-sm">
                            <CheckIcon className="w-4 h-4" />
                            <span className="font-medium">در سبد خرید موجود است</span>
                          </div>
                          <div className="flex items-center justify-center space-x-3 space-x-reverse">
                            <button
                              onClick={() => handleUpdateCart(currentCartQuantity - 1)}
                              disabled={currentCartQuantity <= 1}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm"
                              aria-label="کاهش تعداد"
                            >
                              -
                            </button>
                            <span className="px-4 py-1.5 bg-white border border-gray-300 rounded-lg font-bold min-w-[50px] text-center">
                              {currentCartQuantity}
                            </span>
                            <button
                              onClick={() => handleUpdateCart(currentCartQuantity + 1)}
                              disabled={currentCartQuantity >= currentStock}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm"
                              aria-label="افزایش تعداد"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {addToCartError && (
                        <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2 space-x-reverse text-red-700 text-xs">
                            <ExclamationTriangleIcon className="w-3 h-3 flex-shrink-0" />
                            <span className="font-medium">{addToCartError}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 space-x-reverse p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 text-sm">
                        <div className="bg-white p-2 rounded-lg border border-gray-200">
                          <TruckIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">ارسال رایگان</div>
                          <div className="text-gray-500 text-xs">خرید بالای ۲ میلیون تومان</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 space-x-reverse p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 text-sm">
                        <div className="bg-white p-2 rounded-lg border border-gray-200">
                          <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">ضمانت اصالت و سلامت فیزیکی کالا</div>
                          <div className="text-gray-500 text-xs">بازگشت ۷ روزه وجه</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200/50 mt-6">
                <div className="flex overflow-x-auto text-sm space-x-6 space-x-reverse px-6 py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`flex-shrink-0 px-4 py-2 font-medium border-b-2 transition-all duration-300 ${
                      activeTab === 'description'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 hover:text-blue-500 border-transparent'
                    }`}
                    aria-label="مشاهده توضیحات محصول"
                  >
                    توضیحات محصول
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-shrink-0 px-4 py-2 font-medium border-b-2 transition-all duration-300 ${
                      activeTab === 'reviews'
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 hover:text-blue-500 border-transparent'
                    }`}
                    aria-label="مشاهده نظرات کاربران"
                  >
                    نظرات ({product.reviewCount || 124})
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'description' && (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-justify text-sm" itemProp="description">
                        {product.description || 'توضیحاتی برای این محصول ثبت نشده است.'}
                      </p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6 lg:space-x-reverse">
                        <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                          <div className="text-2xl font-bold text-gray-900">{product.rating || 4.5}</div>
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
                          <div className="text-sm text-gray-600 mt-2">
                            از {product.reviewCount || 124} نظر
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-2 w-full max-w-sm">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center space-x-2 space-x-reverse text-sm">
                              <span className="text-gray-600 w-12 flex items-center">
                                {star} <StarSolid className="w-3 h-3 text-yellow-400 ml-1" />
                              </span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000 ease-out"
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

            {recommendedProducts.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    محصولات مشابه
                  </h2>
                  <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium flex items-center" title="مشاهده همه محصولات سایرون">
                    مشاهده همه
                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  </Link>
                </div>
                
                {recommendedLoading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gradient-to-br from-gray-200 to-blue-200"></div>
                        <div className="p-3 space-y-2">
                          <div className="h-3 bg-gradient-to-r from-gray-200 to-blue-200 rounded"></div>
                          <div className="h-3 bg-gradient-to-r from-gray-200 to-blue-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gradient-to-r from-gray-200 to-blue-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {recommendedProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.id}`}
                        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105"
                        title={`مشاهده ${product.name} در سایرون`}
                      >
                        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
                          {product.image ? (
                            <div className="w-full h-full relative flex items-center justify-center">
                              <Image
                                src={product.image}
                                alt={`تصویر ${product.name} - فروشگاه اینترنتی سایرون`}
                                width={200}
                                height={200}
                                unoptimized={true}
                                className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 1280px) 20vw, 16vw"
                                style={{ 
                                  objectFit: 'contain',
                                  padding: '8px'
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-blue-200 rounded-full flex items-center justify-center">
                                <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          )}
                          {product.discount > 0 && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              {product.discount}% 
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 text-sm leading-relaxed group-hover:text-blue-600 transition-colors">{product.name}</h3>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 space-x-reverse">
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

          <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg p-4 z-50">
            {!isAuthenticated ? (
              <AuthRequiredButton isMobile={true} />
            ) : isInCart ? (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-green-600 text-sm font-medium mb-2">در سبد خرید موجود است</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">تعداد: {currentCartQuantity}</div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleUpdateCart(currentCartQuantity - 1)}
                        disabled={currentCartQuantity <= 1}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm"
                        aria-label="کاهش تعداد"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg font-bold text-sm min-w-[40px] text-center">
                        {currentCartQuantity}
                      </span>
                      <button
                        onClick={() => handleUpdateCart(currentCartQuantity + 1)}
                        disabled={currentCartQuantity >= currentStock}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm"
                        aria-label="افزایش تعداد"
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
                    <span className="text-xl font-black text-gray-900 tracking-tight">
                      {formatPrice(currentPrice)} <span className="text-base font-bold">تومان</span>
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-500 line-through font-medium">
                        {formatPrice(basePrice)} تومان
                      </span>
                    )}
                  </div>
                  
                  {stockStatus.text && (
                    <div className={`text-xs font-medium ${stockStatus.class}`}>
                      {stockStatus.text}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0 || addingToCart}
                  data-add-to-cart-mobile
                  className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 space-x-reverse shadow font-medium text-sm min-w-[130px] justify-center ${
                    currentStock > 0 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } ${addingToCart ? 'opacity-70' : ''}`}
                  aria-label={currentStock > 0 ? `افزودن ${product.name} به سبد خرید` : 'محصول ناموجود'}
                >
                  {addingToCart ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      <span>در حال افزودن...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBagIcon className="w-4 h-4" />
                      <span>{currentStock > 0 ? 'افزودن به سبد' : 'ناموجود'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {addToCartError && (
              <div className="mt-2 p-2 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse text-red-700 text-xs">
                  <ExclamationTriangleIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="font-medium">{addToCartError}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProductDetailPage;