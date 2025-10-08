// src/app/products/ProductsPageContent.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/home/ProductCard';
import { userApiService } from '../../services/api';

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('category');
  const label = searchParams.get('label');
  const searchQuery = searchParams.get('q');
  const pageParam = searchParams.get('page');
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [priceRange, setPriceRange] = useState([0, 50000000]);

  const toggleFilters = () => setFiltersOpen(!filtersOpen);

  // دریافت دسته‌بندی‌ها
  const fetchCategories = async () => {
    try {
      const response = await userApiService.getCategories();
      
      // پردازش پاسخ‌های مختلف
      if (response.success) {
        setCategories(response.data || response.categories || []);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  // دریافت اطلاعات دسته‌بندی جاری
  const fetchCurrentCategory = async () => {
    if (!categoryId) {
      setCurrentCategory(null);
      return;
    }

    try {
      // استفاده از سرویس موجود برای دریافت اطلاعات دسته‌بندی
      const categories = await userApiService.getCategories();
      const category = Array.isArray(categories) 
        ? categories.find(cat => cat.id === categoryId || cat._id === categoryId)
        : (categories.data || categories.categories || []).find(cat => cat.id === categoryId || cat._id === categoryId);
      
      setCurrentCategory(category || null);
    } catch (err) {
      console.error('Error fetching current category:', err);
      setCurrentCategory(null);
    }
  };

  // دریافت محصولات با استفاده از سرویس API شما
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (searchQuery) {
        response = await userApiService.searchProducts(searchQuery, currentPage, 12);
      } else if (label) {
        response = await userApiService.getProductsByLabel(label, currentPage, 12);
      } else if (categoryId) {
        response = await userApiService.getProductsByCategory(categoryId, currentPage, 12);
      } else {
        response = await userApiService.getAllProducts(currentPage, 12);
      }
      
      // پردازش پاسخ با فرمت سرویس شما
      let productsData = [];
      let paginationInfo = {
        totalPages: 1,
        total: 0,
        currentPage: currentPage
      };

      // بررسی ساختار پاسخ
      if (response.success) {
        // اگر پاسخ دارای success باشد
        productsData = response.data?.products || response.data || response.products || [];
        paginationInfo = {
          totalPages: response.data?.totalPages || response.totalPages || response.data?.pagination?.totalPages || 1,
          total: response.data?.total || response.total || response.data?.pagination?.total || productsData.length,
          currentPage: response.data?.currentPage || response.currentPage || response.data?.pagination?.page || currentPage
        };
      } else if (Array.isArray(response)) {
        // اگر پاسخ مستقیم آرایه باشد
        productsData = response;
        paginationInfo = {
          totalPages: 1,
          total: response.length,
          currentPage: currentPage
        };
      } else {
        // سایر فرمت‌ها
        productsData = response.products || response.data || [];
        paginationInfo = {
          totalPages: response.totalPages || response.pagination?.totalPages || 1,
          total: response.total || response.pagination?.total || productsData.length,
          currentPage: response.currentPage || response.pagination?.page || currentPage
        };
      }
      
      // پردازش محصولات برای نمایش
      const processedProducts = productsData.map(product => {
        // محاسبه قیمت اصلی و تخفیف
        let originalPrice = product.price || 0;
        let finalPrice = product.price || 0;
        let discountPercent = 0;
        let hasDiscount = false;
        
        // اگر تخفیف وجود دارد
        if (product.discount && product.discount > 0) {
          hasDiscount = true;
          if (product.discountType === 'percent') {
            // تخفیف درصدی
            discountPercent = product.discount;
            finalPrice = originalPrice - (originalPrice * product.discount / 100);
          } else if (product.discountType === 'amount') {
            // تخفیف مبلغی - تبدیل به درصد
            discountPercent = Math.round((product.discount / originalPrice) * 100);
            finalPrice = originalPrice - product.discount;
          }
        }
        
        // پیدا کردن تصویر اصلی
        let mainImage = "https://placehold.co/300x300/f3f4f6/000?text=Product+Image";
        if (product.image) {
          mainImage = product.image;
        } else if (product.images && product.images.length > 0) {
          // پیدا کردن تصویر اصلی یا اولین تصویر
          const mainImg = product.images.find(img => img.isMain === true);
          if (mainImg) {
            mainImage = typeof mainImg === 'string' ? mainImg : mainImg.url;
          } else {
            mainImage = typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
          }
        }
        
        return {
          id: product.id || product._id,
          title: product.name || product.title,
          price: finalPrice, // قیمت نهایی بعد از تخفیف
          originalPrice: originalPrice, // قیمت اصلی قبل از تخفیف
          image: mainImage,
          isNew: product.isNew || 
                 (product.createdAt && (new Date() - new Date(product.createdAt)) < (30 * 24 * 60 * 60 * 1000)),
          isBestseller: product.isBestseller || false,
          isFastDelivery: product.isFastDelivery || false,
          discount: discountPercent, // همیشه درصد تخفیف
          hasDiscount: hasDiscount,
          discountType: product.discountType,
          originalDiscount: product.discount
        };
      });
      
      setProducts(processedProducts);
      setTotalPages(paginationInfo.totalPages);
      setTotalProducts(paginationInfo.total);
      setCurrentPage(paginationInfo.currentPage);
    } catch (err) {
      setError(err.message || 'خطا در دریافت محصولات');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // اعمال فیلترها و به روزرسانی URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory) params.set('category', selectedCategory);
    if (label) params.set('label', label);
    if (searchQuery) params.set('q', searchQuery);
    
    params.set('page', '1');
    
    router.push(`/products?${params.toString()}`);
    setFiltersOpen(false);
  };

  // تغییر صفحه
  const handlePageChange = (page) => {
    const params = new URLSearchParams();
    
    if (categoryId) params.set('category', categoryId);
    if (label) params.set('label', label);
    if (searchQuery) params.set('q', searchQuery);
    
    params.set('page', page.toString());
    
    router.push(`/products?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  // پیدا کردن نام دسته‌بندی بر اساس ID
  const getCategoryName = (catId) => {
    const category = categories.find(cat => 
      cat.id === catId || 
      cat._id === catId ||
      (cat.id && cat.id.toString() === catId.toString()) ||
      (cat._id && cat._id.toString() === catId.toString())
    );
    return category ? category.name : `دسته‌بندی ${catId}`;
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchCurrentCategory();
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, label, searchQuery, currentPage]);

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        <i className="fas fa-chevron-right" />
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded border ${currentPage === i ? 'bg-blue-600 text-white' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        <i className="fas fa-chevron-left" />
      </button>
    );
    
    return pages;
  };

  if (error) {
    return (
      <Layout>
        <div className="container py-10 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-2xl mx-auto">
            <p className="font-bold">خطا</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => {
              fetchCategories();
              fetchCurrentCategory();
              fetchProducts();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <main className="container py-6 flex flex-col md:flex-row gap-6">
          {/* فیلترها */}
          <aside
            className={`filter-section w-full md:w-1/4 bg-white rounded-lg shadow p-4 ${
              filtersOpen ? "fixed top-0 right-0 h-full z-50 w-3/4 overflow-y-auto" : "hidden md:block"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">فیلترها</h2>
              <div className="flex items-center">
                <button
                  className="text-blue-600 text-sm ml-4"
                  onClick={() => {
                    setSelectedCategory('');
                    setPriceRange([0, 50000000]);
                  }}
                >
                  حذف فیلترها
                </button>
                <button 
                  className="md:hidden text-gray-500 ml-2"
                  onClick={() => setFiltersOpen(false)}
                >
                  <i className="fas fa-times text-lg" />
                </button>
              </div>
            </div>

            {/* فیلتر دسته‌بندی */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">دسته‌بندی‌ها</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="ml-2"
                  />
                  <span>همه دسته‌بندی‌ها</span>
                </label>
                {categories.map((category) => (
                  <label key={category.id || category._id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.id || category._id}
                      checked={selectedCategory === (category.id || category._id).toString()}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="ml-2"
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* قیمت */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">محدوده قیمت</h3>
              <input 
                type="range" 
                min="0" 
                max="50000000" 
                value={priceRange[1]} 
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full" 
              />
              <div className="flex justify-between text-sm mt-2">
                <span>0 تومان</span>
                <span>{priceRange[1].toLocaleString()} تومان</span>
              </div>
            </div>

            <button 
              className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={applyFilters}
            >
              اعمال فیلترها
            </button>
          </aside>

          {/* محصولات */}
          <section className="w-full md:w-3/4">
            {/* بنر دسته‌بندی */}
            {currentCategory && (
              <div className="bg-gradient-to-l from-blue-500 to-blue-700 rounded-lg text-white p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">{currentCategory.name}</h2>
                <p className="mb-4">
                  {currentCategory.description || `بهترین و باکیفیت‌ترین محصولات ${currentCategory.name} را از ما بخواهید`}
                </p>
                <button 
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100"
                  onClick={() => router.push('/products')}
                >
                  مشاهده همه محصولات
                </button>
              </div>
            )}

            {/* بنر تخفیف */}
            {label === 'sale' && (
              <div className="bg-gradient-to-l from-red-500 to-red-700 rounded-lg text-white p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">تخفیف‌های ویژه</h2>
                <p className="mb-4">فرصت استثنایی برای خرید محصولات با تخفیف‌های ویژه</p>
                <button 
                  className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-100"
                  onClick={() => router.push('/products')}
                >
                  مشاهده همه تخفیف‌ها
                </button>
              </div>
            )}

            {/* اطلاعات فیلتر */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-4 md:mb-0">
                <button
                  className="filter-toggle flex items-center px-4 py-2 border border-gray-300 rounded-lg md:hidden"
                  onClick={toggleFilters}
                >
                  <i className="fas fa-filter ml-2" />
                  فیلترها
                </button>
                <p className="text-gray-600 mr-4">
                  {loading ? 'درحال دریافت...' : `${totalProducts} محصول یافت شد`}
                </p>
              </div>
              
              {(categoryId || label || searchQuery) && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-gray-600">فیلترهای فعال:</span>
                  {categoryId && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      دسته‌بندی: {getCategoryName(categoryId)}
                    </span>
                  )}
                  {label && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      برچسب: {label}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                      جستجو: {searchQuery}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* لیست محصولات */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                    <div className="bg-gray-200 h-60 w-full"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="flex justify-between mt-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-xl font-semibold">محصولی یافت نشد</h3>
                <p className="text-gray-600 mt-2">با تغییر فیلترها مجدد امتحان کنید</p>
                <button 
                  onClick={() => router.push('/products')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  حذف همه فیلترها
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* صفحه‌بندی */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-10">
                    <nav className="flex items-center gap-2">
                      {renderPagination()}
                    </nav>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </Layout>
  );
}