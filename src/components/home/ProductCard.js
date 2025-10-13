// components/home/ProductCard.js
import Link from "next/link";
import Image from "next/image";

const ProductCard = ({ product }) => {
  // --- قیمت‌ها (با فرض اینکه processedProducts طبق پیشنهاد شماست:
  // product.price = قیمت نهایی بعد از تخفیف
  // product.originalPrice = قیمت اصلی قبل از تخفیف)
  const finalPrice = typeof product.price === "number" ? product.price : Number(product.price) || 0;
  const originalPrice =
    typeof product.originalPrice === "number"
      ? product.originalPrice
      : Number(product.originalPrice) || 0;

  // درصد تخفیف (اگر از سرور نیومده محاسبه کن)
  const discountPercent =
    typeof product.discount === "number" && product.discount > 0
      ? product.discount
      : originalPrice > 0
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0;

  const hasDiscount = discountPercent > 0 && originalPrice > finalPrice;

  // تصویر اصلی — اول سعی کن product.image باشه، بعد product.images، در نهایت placeholder
  const imageUrl =
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0
      ? (product.images.find((i) => i.isMain)?.url || product.images[0]?.url)
      : null) ||
    "/images/placeholdesairon-logo.png";

  // لیبل‌ها
  const labels = product.labels || [];

  const hasBestsellerLabel = labels.some(
    (l) => l?.label?.name === "bestseller" || l?.label?.title === "پرفروش"
  );
  const hasRecommendedLabel = labels.some(
    (l) => l?.label?.name === "recommended" || l?.label?.title === "پیشنهادی"
  );

  const renderBadge = () => {
    if (hasBestsellerLabel) {
      return (
        <span className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          پرفروش
        </span>
      );
    }
    if (hasRecommendedLabel) {
      return (
        <span className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          پیشنهادی
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group border border-gray-100 flex flex-col h-full">
<div className="relative w-full aspect-square p-4 bg-white">
  {renderBadge()}

  {hasDiscount && (
    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
      {discountPercent}%
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
        className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
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

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {/* قیمت نهایی (قابل مشاهده) */}
              <p className="text-lg font-bold text-gray-900">
                {finalPrice.toLocaleString()} تومان
              </p>

              {/* قیمت اصلی (خط‌خورده) — فقط وقتی تخفیف واقعی وجود دارد */}
              {hasDiscount && originalPrice > 0 && (
                <p className="text-sm text-gray-400 line-through mt-1">
                  {originalPrice.toLocaleString()} تومان
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 pt-0">
        <Link
          href={`/products/${product.id}`}
          className="block w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm"
        >
          جزئیات محصول
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
