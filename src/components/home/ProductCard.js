'use client';

import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  // محاسبه قیمت با تخفیف
  const calculateDiscountedPrice = () => {
    if (product.discount && product.discountType === 'percent' && product.discount > 0) {
      return Math.round(product.price - (product.price * product.discount / 100));
    }
    return product.price;
  };

  const discountedPrice = calculateDiscountedPrice();
  
  // تبدیل به boolean
  const hasDiscount = Boolean(product.discount && product.discount > 0 && discountedPrice < product.price);

  // پیدا کردن تصویر اصلی
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
  const imageUrl = mainImage?.url || '/images/placeholder.jpg';

  // بررسی لیبل‌های محصول
  const hasBestsellerLabel = product.labels?.some(label => 
    label.label?.name === 'bestseller' || label.label?.title === 'پرفروش'
  );
  
  const hasRecommendedLabel = product.labels?.some(label => 
    label.label?.name === 'recommended' || label.label?.title === 'پیشنهادی'
  );

  const renderBadge = () => {
    // اولویت: پرفروش -> پیشنهادی
    if (hasBestsellerLabel) {
      return (
        <span className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          <svg className="w-3 h-3 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          پرفروش
        </span>
      );
    }
    if (hasRecommendedLabel) {
      return (
        <span className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
          <svg className="w-3 h-3 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          پیشنهادی
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group border border-gray-100 flex flex-col h-full">
      {/* Image Container با padding برای badge ها */}
      <div className="relative w-full h-60 md:h-72 p-2">
        {renderBadge()}
        
        {/* Discount Badge - فقط زمانی نمایش داده شود که تخفیف معتبر وجود دارد */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
            <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 10l1.293-1.293zm4 0a1 1 0 010 1.414L11.586 10l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {product.discount}%
          </span>
        )}
        
        {/* عکس بدون تاثیر از badge ها */}
        <Link href={`/products/${product.id}`} className="block w-full h-full relative rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name || 'محصول'}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title - تک سطری با سه نقطه */}
        <Link href={`/products/${product.id}`} className="block flex-grow mb-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors leading-tight line-clamp-1 overflow-hidden text-ellipsis">
            {product.name}
          </h3>
        </Link>

        {/* Price Section - جایگشت شده */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {/* قیمت اصلی - همیشه نمایش داده می‌شود */}
              <p className="text-lg font-bold text-gray-900">
                {product.price.toLocaleString()} تومان
              </p>
              
              {/* قیمت با تخفیف - فقط زمانی که تخفیف معتبر وجود دارد */}
              {hasDiscount && (
                <p className="text-sm text-gray-400 line-through mt-1">
                  {discountedPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Button */}
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