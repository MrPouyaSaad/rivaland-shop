import React, { useState } from "react";
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { userApiService } from '@/services/api';

const CartItemCard = ({ item, onUpdate }) => {
  const { updateCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionType, setActionType] = useState(null);

  // محاسبه قیمت‌ها بر اساس اطلاعات فعلی محصول - اصلاح شده
  const calculatePrices = () => {
    // قیمت پایه از واریانت یا محصول
    const basePrice = item.variant?.price || item.product?.price || 0;
    
    // محاسبه تخفیف فعلی محصول
    let finalPrice = basePrice;
    let discountAmount = 0;
    let discountPercentage = 0;

    if (item.product?.discount && item.product.discount > 0) {
      if (item.product.discountType === 'percentage' || item.product.discountType === 'percent') {
        discountPercentage = item.product.discount;
        discountAmount = (basePrice * discountPercentage) / 100;
        finalPrice = basePrice - discountAmount;
      } else {
        // تخفیف مبلغی
        discountAmount = item.product.discount;
        finalPrice = basePrice - discountAmount;
        discountPercentage = basePrice > 0 ? Math.round((discountAmount / basePrice) * 100) : 0;
      }
      
      // قیمت نمی‌تواند منفی باشد
      finalPrice = Math.max(0, finalPrice);
    }

    const totalPrice = finalPrice * item.quantity;

    return {
      basePrice,
      finalPrice: Math.round(finalPrice),
      originalPrice: basePrice,
      hasDiscount: discountAmount > 0,
      discountAmount: Math.round(discountAmount),
      discountPercentage,
      totalPrice: Math.round(totalPrice)
    };
  };

  const prices = calculatePrices();

  const handleQuantityChange = async (type) => {
    const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
    
    if (newQty <= 0) {
      await handleRemove();
      return;
    }

    setLoading(true);
    setActionType(type === "inc" ? "increase" : "decrease");
    setError(null);

    try {
      const response = await userApiService.updateCartItem(item.id, newQty);
      
      if (response.success) {
        await updateCart();
        window.dispatchEvent(new Event('cartUpdate'));
        if (onUpdate) onUpdate();
      } else {
        throw new Error(response.message || 'خطا در به‌روزرسانی سبد خرید');
      }
    } catch (err) {
      setError(err.message || 'خطا در ارتباط با سرور');
      console.error('Error updating cart item:', err);
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setActionType("remove");
    setError(null);

    try {
      const response = await userApiService.removeFromCart(item.id);
      
      if (response.success) {
        await updateCart();
        window.dispatchEvent(new Event('cartUpdate'));
        if (onUpdate) onUpdate();
      } else {
        throw new Error(response.message || 'خطا در حذف از سبد خرید');
      }
    } catch (err) {
      setError(err.message || 'خطا در ارتباط با سرور');
      console.error('Error removing cart item:', err);
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  // تصویر اصلی محصول
  const getProductImage = () => {
    const mainImage = item.product?.images?.find(img => img.isMain)?.url || 
                     item.product?.images?.[0]?.url;
    
    if (mainImage) return mainImage;
    
    const variantImage = item.variant?.images?.[0]?.url;
    if (variantImage) return variantImage;
    
    return "/images/placeholder.png";
  };

  // اطلاعات واریانت برای نمایش
  const getVariantInfo = () => {
    if (!item.variant) return null;
    
    const attributes = item.variant.attributes || {};
    const variantText = Object.values(attributes).join(' - ');
    
    return {
      text: variantText,
      sku: item.variant.sku,
      stock: item.variant.stock
    };
  };

  const variantInfo = getVariantInfo();
  const mainImage = getProductImage();
  const showTotalPrice = item.quantity > 1;

  return (
    <div className="group bg-white rounded-2xl p-4 md:p-6 transition-all duration-500 hover:shadow-xl border border-gray-100 hover:border-blue-100 relative">
      
      {/* نمایش خطا */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Overlay لودینگ */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 rounded-2xl flex items-center justify-center z-10">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">
              {actionType === "remove" ? "در حال حذف..." : 
               actionType === "increase" ? "در حال افزایش..." : 
               "در حال کاهش..."}
            </span>
          </div>
        </div>
      )}

      {/* Layout اصلی */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        
        {/* بخش تصویر و اطلاعات محصول */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          
          {/* تصویر محصول */}
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={mainImage}
                alt={item.product?.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            {/* نشانگر تعداد */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {item.quantity}
            </div>

            {/* نشانگر تخفیف */}
            {prices.hasDiscount && (
              <div className="absolute -top-2 -left-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                %{prices.discountPercentage}
              </div>
            )}
          </div>

          {/* اطلاعات محصول */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight mb-2">
              {item.product?.name}
            </h3>
            
            {/* نمایش اطلاعات واریانت */}
            {variantInfo && (
              <div className="mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {variantInfo.text}
                  </span>
                  {variantInfo.sku && (
                    <span className="text-xs text-gray-500">
                      کد: {variantInfo.sku}
                    </span>
                  )}
                </div>
                
                {/* وضعیت موجودی واریانت */}
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    variantInfo.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-xs text-gray-600">
                    {variantInfo.stock > 0 ? 
                      `موجود (${variantInfo.stock} عدد)` : 
                      'ناموجود'
                    }
                  </span>
                </div>
              </div>
            )}
            
            {/* قیمت‌ها */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-lg md:text-xl font-bold text-blue-600">
                {prices.finalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">تومان</span>
              
              {/* قیمت اصلی با خط خورده */}
              {prices.hasDiscount && (
                <div className="flex items-center gap-1 mr-2">
                  <span className="text-sm text-gray-400 line-through">
                    {prices.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-red-500 font-medium">
                    (%{prices.discountPercentage})
                  </span>
                </div>
              )}
            </div>

            {/* اطلاعات قیمت قفل شده - حذف شده */}
            {/* {item.lockedPrice && (
              <div className="mb-2">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  قیمت ثابت در زمان افزودن به سبد
                </span>
              </div>
            )} */}

            {/* قیمت کل و صرفه‌جویی */}
            {showTotalPrice && (
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600">جمع:</span>
                  <span className="font-bold text-gray-900 text-base">
                    {prices.totalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">تومان</span>
                </div>
                
                {/* صرفه‌جویی */}
                {prices.hasDiscount && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                      صرفه‌جویی: {(prices.discountAmount * item.quantity).toLocaleString()} تومان
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* وضعیت موجودی محصول (اگر واریانت نداریم) */}
            {!variantInfo && item.product && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  item.product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-600">
                  {item.product.stock > 0 ? 
                    `موجود در انبار (${item.product.stock} عدد)` : 
                    'ناموجود'
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        {/* بخش کنترل‌ها */}
        <div className="flex items-center justify-end gap-3">
          
          {/* کنترل مقدار */}
          <div className="flex items-center bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
            <button
              className={`p-2 rounded-r-xl transition-all duration-300 ${
                loading && actionType === "decrease" 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => handleQuantityChange("dec")}
              disabled={loading && actionType === "decrease"}
              aria-label="کاهش تعداد"
            >
              {loading && actionType === "decrease" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Minus size={16} />
              )}
            </button>
            
            <span className="px-3 py-2 min-w-8 text-center text-gray-900 font-bold text-sm bg-white mx-1 rounded-lg">
              {item.quantity}
            </span>
            
            <button
              className={`p-2 rounded-l-xl transition-all duration-300 ${
                loading && actionType === "increase" 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => handleQuantityChange("inc")}
              disabled={loading && actionType === "increase"}
              aria-label="افزایش تعداد"
            >
              {loading && actionType === "increase" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
            </button>
          </div>

          {/* دکمه حذف */}
          <button 
            onClick={handleRemove}
            disabled={loading && actionType === "remove"}
            className={`p-2 rounded-xl transition-all duration-300 border ${
              loading && actionType === "remove"
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50 border-transparent hover:border-red-200"
            }`}
            aria-label="حذف از سبد خرید"
          >
            {loading && actionType === "remove" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;