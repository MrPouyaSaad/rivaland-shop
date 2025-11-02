'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import ProductCard from './ProductCard';
import { userApiService } from '@/services/api';

export default function ProductSection({ title, label }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userApiService.getProductsByLabel(label, 1, 10);
        
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError('خطا در دریافت محصولات');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('خطا در ارتباط با سرور');
      } finally {
        setLoading(false);
      }
    };

    if (label) fetchProducts();
    else setLoading(false);
  }, [label]);

  // --- لودینگ ---
  if (loading) {
    return (
      <section className="py-6 md:py-10 bg-gradient-to-b from-gray-50 to-white flex justify-center">
        <div className="w-full max-w-[1228px] px-0 mx-auto">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="h-7 md:h-8 w-48 bg-gray-300 rounded-md mx-auto mb-2 md:mb-3 animate-pulse"></div>
            <div className="w-12 md:w-16 h-1 bg-gray-300 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pl-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-52 snap-start mr-3 last:mr-4">
                <div className="bg-gray-200 rounded-lg h-72 animate-pulse">
                  <div className="h-40 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- خطا ---
  if (error) {
    return (
      <section className="py-6 md:py-10 bg-gradient-to-b from-gray-50 to-white flex justify-center">
        <div className="w-full max-w-[1228px] px-0 mx-auto">
          <div className="text-center py-10 text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  // --- اگر محصولات کمتر از ۴ تا باشند ---
  if (products.length < 4) return null;

  const displayedProducts = products.slice(0, 4);

  // --- خروجی ---
  return (
    <section className="py-6 md:py-10 bg-gradient-to-b from-gray-50 to-white flex justify-center">
      <div className="w-full max-w-[1228px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 px-4 md:px-0">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
            {title}
          </h2>
          <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-4 md:px-0">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile Scrollable */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory pb-3 hide-scrollbar flex pl-4">
          {displayedProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex-none w-52 snap-start mr-3 last:mr-4"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* مشاهده همه */}
        {products.length > 4 && (
          <div className="text-center mt-6 md:mt-8 px-4 md:px-0">
            <Link href={`/products?label=${label}`}>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-1.5 md:px-6 md:py-2 text-xs md:text-sm rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1 md:gap-1.5 mx-auto">
                مشاهده همه محصولات
                <svg
                  className="w-3 h-3 md:w-3.5 md:h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>
        )}

        {/* مخفی کردن اسکرول‌بار */}
        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}