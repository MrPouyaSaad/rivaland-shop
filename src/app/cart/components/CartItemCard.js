import React from "react";
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItemCard = ({ item }) => {
  const { updateCart } = useCart();

  const handleQuantityChange = (type) => {
    const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQty <= 0) return;
    updateCart(item.id, newQty);
  };

  const handleRemove = () => {
    updateCart(item.id, 0);
  };

  // تصویر اصلی محصول
  const mainImage = item.product?.images?.find(img => img.isMain)?.url || 
                   item.product?.images?.[0]?.url || 
                   "/images/placeholdesairon-logo.png";

  // قیمت‌ها
  const originalPrice = item.product?.price || 0;
  const finalPrice = item.product?.currentPrice || originalPrice;
  const hasDiscount = originalPrice > finalPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;
  const totalPrice = finalPrice * item.quantity;
  const showTotalPrice = item.quantity > 1;

  return (
    <div className="group bg-white rounded-2xl p-4 md:p-6 transition-all duration-500 hover:shadow-xl border border-gray-100 hover:border-blue-100">
      
      {/* Layout اصلی */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        
        {/* بخش تصویر و اطلاعات محصول */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          
          {/* تصویر محصول با افکت مدرن */}
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
            {hasDiscount && (
              <div className="absolute -top-2 -left-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                %{discountPercentage}
              </div>
            )}
          </div>

          {/* اطلاعات محصول */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight mb-2">
              {item.product?.name}
            </h3>
            
            {/* قیمت‌ها */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg md:text-xl font-bold text-blue-600">
                {finalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">تومان</span>
              
              {/* قیمت اصلی با خط خورده */}
              {hasDiscount && (
                <div className="flex items-center gap-1 mr-2">
                  <span className="text-sm text-gray-400 line-through">
                    {originalPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* قیمت کل و صرفه‌جویی - فقط وقتی تعداد بیشتر از 1 باشد */}
            {showTotalPrice && (
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600">جمع:</span>
                  <span className="font-bold text-gray-900 text-base">
                    {totalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">تومان</span>
                </div>
                
                {/* صرفه‌جویی */}
                {hasDiscount && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                      صرفه‌جویی: {((originalPrice - finalPrice) * item.quantity).toLocaleString()} تومان
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* وضعیت موجودی */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">موجود در انبار</span>
            </div>
          </div>
        </div>

        {/* بخش کنترل‌ها */}
        <div className="flex items-center justify-end gap-3">
          
          {/* کنترل مقدار مدرن */}
          <div className="flex items-center bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
            <button
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-r-xl transition-all duration-300"
              onClick={() => handleQuantityChange("dec")}
              aria-label="کاهش تعداد"
            >
              <Minus size={16} />
            </button>
            
            <span className="px-3 py-2 min-w-8 text-center text-gray-900 font-bold text-sm bg-white mx-1 rounded-lg">
              {item.quantity}
            </span>
            
            <button
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-l-xl transition-all duration-300"
              onClick={() => handleQuantityChange("inc")}
              aria-label="افزایش تعداد"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* دکمه حذف مدرن */}
          <button 
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-red-200"
            aria-label="حذف از سبد خرید"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;