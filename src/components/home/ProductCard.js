// components/home/ProductCard.js
import Link from "next/link";
import Image from "next/image";

const ProductCard = ({ product }) => {
  // --- استخراج داده‌ها با اطمینان ---
  const basePrice = 
    typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const discount = 
    typeof product.discount === "number" ? product.discount : Number(product.discount) || 0;
  const discountType = product.discountType || null;
  
  // --- قیمت‌های واریانت‌ها ---
  const hasVariants = product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0;
  const variants = product.variants || [];
  
  // --- محاسبه کمترین قیمت از واریانت‌ها ---
  let minPrice = basePrice;
  
  if (hasVariants && variants.length > 0) {
    const variantPrices = variants.map(v => v.price).filter(price => price > 0);
    if (variantPrices.length > 0) {
      minPrice = Math.min(...variantPrices);
    }
  }

  // --- محاسبه تخفیف برای کمترین قیمت ---
  let finalPrice = minPrice;
  let discountPercent = 0;
  let hasDiscount = false;

  if (discountType === "percent" && discount > 0) {
    discountPercent = discount;
    finalPrice = Math.round(minPrice - (minPrice * discount) / 100);
    hasDiscount = true;
  } else if (discountType === "amount" && discount > 0) {
    finalPrice = Math.max(0, minPrice - discount);
    discountPercent = minPrice > 0 ? Math.round((discount / minPrice) * 100) : 0;
    hasDiscount = true;
  }

  // --- تصویر محصول ---
  const imageUrl =
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0
      ? (product.images.find((i) => i.isMain)?.url || product.images[0]?.url)
      : null) ||
    "/images/placeholdesairon-logo.png";

  // --- لیبل‌ها ---
  const labels = product.labels || [];
  const hasBestsellerLabel = labels.some(
    (l) => l?.label?.name === "bestseller" || l?.label?.title === "پرفروش"
  );
  const hasRecommendedLabel = labels.some(
    (l) => l?.label?.name === "recommended" || l?.label?.title === "پیشنهادی"
  );
  const hasDiscountedLabel = labels.some(
    (l) => l?.label?.name === "discounted" || l?.label?.title === "پر تخفیف"
  );

  // --- وضعیت موجودی ---
  const isOutOfStock = !product.isInStock;

  // --- نشان لیبل‌ها ---
  const renderBadge = () => {
    const badges = [];
    
    if (hasBestsellerLabel) {
      badges.push(
        <span key="bestseller" className="bg-gradient-to-r from-orange-500 to-amber-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          پرفروش
        </span>
      );
    }
    if (hasRecommendedLabel) {
      badges.push(
        <span key="recommended" className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          پیشنهادی
        </span>
      );
    }
    if (hasDiscountedLabel && hasDiscount) {
      badges.push(
        <span key="discounted" className="bg-gradient-to-r from-green-500 to-emerald-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          پر تخفیف
        </span>
      );
    }

    return (
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
        {badges}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group border border-gray-100 flex flex-col h-full">
      <div className="relative w-full aspect-square p-4 bg-white">
        {renderBadge()}

        {/* ✅ نشان تخفیف روی تصویر */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
            {discountType === "percent"
              ? `${discountPercent}%`
              : `-${discount.toLocaleString()} تومان`}
          </span>
        )}

        {/* ✅ نشان ناموجودی */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
            ناموجود
          </span>
        )}

        <Link
          href={`/products/${product.id}`}
          className="block w-full h-full relative rounded-xl overflow-hidden bg-gray-50"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name || product.title || "محصول"}
              fill
              unoptimized={true}
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-contain p-2 transition-transform duration-700 group-hover:scale-105 ${
                isOutOfStock ? 'opacity-60' : ''
              }`}
            />
          </div>
        </Link>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block flex-grow mb-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors leading-tight line-clamp-1 overflow-hidden text-ellipsis">
            {product.name || product.title || "بدون عنوان"}
          </h3>
        </Link>

        <div className="flex flex-col mt-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {/* ✅ قیمت نهایی (کمترین قیمت بعد از تخفیف) */}
              <div className="flex items-center gap-2">
                <p className={`text-lg font-bold ${
                  isOutOfStock ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  {finalPrice.toLocaleString()} تومان
                </p>
                
                {/* نشانگر "از" برای محصولات با واریانت */}
                {/* {hasVariants && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    از {finalPrice.toLocaleString()}
                  </span>
                )} */}
              </div>

              {/* ✅ قیمت اصلی (خط‌خورده) */}
              {hasDiscount && !isOutOfStock && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-400 line-through">
                    {minPrice.toLocaleString()} تومان
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 pt-0">
        <Link
          href={`/products/${product.id}`}
          className={`block w-full text-center py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm ${
            isOutOfStock 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:shadow-lg'
          }`}
          onClick={e => isOutOfStock && e.preventDefault()}
        >
          {isOutOfStock ? 'ناموجود' : 'جزئیات محصول'}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;