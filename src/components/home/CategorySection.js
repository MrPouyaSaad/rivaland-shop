'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userApiService   } from '@/services/api';

export default function CategorySection() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApiService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('در دریافت دسته‌بندی‌ها مشکلی پیش آمده است.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      const products = await userApiService.getProductsByCategory(categoryId, 1, 10);
      // در اینجا می‌توانید محصولات را به state منتقل کنید یا به صفحه محصولات هدایت شوید
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  // تابع برای تولید لوگو با حرف اول نام دسته‌بندی
  const generateLogo = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // آرایه از رنگ‌های پیش‌فرض برای دسته‌بندی‌ها
  const defaultColors = [
    'from-blue-400 to-blue-500',
    'from-green-400 to-green-500',
    'from-purple-400 to-purple-500',
    'from-red-400 to-red-500',
    'from-yellow-400 to-yellow-500',
    'from-pink-400 to-pink-500',
    'from-indigo-400 to-indigo-500',
    'from-teal-400 to-teal-500'
  ];

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">دسته‌بندی محصولات</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="p-5 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              دسته‌بندی محصولات
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6 text-center">{error}</p>
            <button
              onClick={fetchCategories}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              دسته‌بندی محصولات
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6 text-center">هیچ دسته‌بندی‌ای یافت نشد.</p>
            <button
              onClick={fetchCategories}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            دسته‌بندی محصولات
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            محصولات مورد نظر خود را در دسته‌بندی‌های مختلف پیدا کنید
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const colorIndex = index % defaultColors.length;
            const colorClass = defaultColors[colorIndex];
            
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}&page=1`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="p-6 text-center flex flex-col items-center">
                  {/* Icon with gradient background - بزرگتر شده */}
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-r ${colorClass} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg overflow-hidden`}>
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold flex items-center justify-center w-full h-full">
                        {generateLogo(category.name)}
                      </span>
                    )}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Explore Text */}
                  <p className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0">
                    مشاهده محصولات
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Grid - تغییر به گرید 3 تایی */}
        <div className="md:hidden">
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category, index) => {
              const colorIndex = index % defaultColors.length;
              const colorClass = defaultColors[colorIndex];
              
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}&page=1`}
                  className="bg-white rounded-xl border border-gray-100 p-3 text-center flex flex-col items-center justify-center transition-all duration-200 active:scale-95 active:bg-gray-50"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {/* Icon - بزرگتر شده */}
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center mb-2 overflow-hidden`}>
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {generateLogo(category.name)}
                      </span>
                    )}
                  </div>
                  
                  {/* Name */}
                  <span className="text-xs font-medium text-gray-700 line-clamp-2 leading-tight">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}