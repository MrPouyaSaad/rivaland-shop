// app/admin/products/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ShoppingCartIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { adminApiService } from '../../../services/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const productsPerPage = 10;
  const [categories, setCategories] = useState([]);

  // دریافت محصولات از API - نسخه اصلاح شده
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await adminApiService.getAdminProducts();
        
        console.log('📦 API Response:', response);
        
        if (response.success) {
          // استخراج محصولات از ساختار پیچیده response
          let productsData = [];
          
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // ساختار: {success: true, data: {data: [...], pagination: {...}}}
            productsData = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            // ساختار: {success: true, data: [...]}
            productsData = response.data;
          } else if (Array.isArray(response)) {
            // ساختار: [...]
            productsData = response;
          }
          
          console.log('✅ Extracted products:', productsData);
          setProducts(productsData || []);
          
          // استخراج دسته‌بندی‌های منحصربه‌فرد
          const uniqueCategories = [...new Set(productsData
            .filter(product => product.category && product.category.name)
            .map(product => product.category.name)
          )];
          setCategories(['همه', ...uniqueCategories]);
          
        } else {
          setError('خطا در دریافت محصولات: پاسخ ناموفق از سرور');
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError('خطا در اتصال به سرور');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // اطمینان از اینکه products همیشه یک آرایه است
  const safeProducts = Array.isArray(products) ? products : [];

  // فیلتر کردن محصولات - نسخه اصلاح شده
  const filteredProducts = safeProducts.filter(product => {
    if (!product || typeof product !== 'object') return false;
    
    const productName = product.name || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // فیلتر دسته‌بندی
    const productCategoryName = product.category?.name || '';
    const matchesCategory = selectedCategory === 'all' || productCategoryName === selectedCategory;
    
    // فیلتر وضعیت
    const isProductActive = product.isActive === true;
    const isProductOutOfStock = (product.stock || 0) === 0;
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = isProductActive && !isProductOutOfStock;
    } else if (statusFilter === 'inactive') {
      matchesStatus = !isProductActive;
    } else if (statusFilter === 'out-of-stock') {
      matchesStatus = isProductOutOfStock;
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // مرتب‌سازی محصولات
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'name':
        aValue = (a.name || '').toLowerCase();
        bValue = (b.name || '').toLowerCase();
        break;
      case 'price':
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case 'stock':
        aValue = a.stock || 0;
        bValue = b.stock || 0;
        break;
      case 'createdAt':
        aValue = a.createdAt ? new Date(a.createdAt) : new Date(0);
        bValue = b.createdAt ? new Date(b.createdAt) : new Date(0);
        break;
      default:
        aValue = a[sortField] || '';
        bValue = b[sortField] || '';
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // تغییر مرتب‌سازی
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // حذف محصول
  const handleDeleteProduct = async (id) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      try {
        const response = await adminApiService.deleteProduct(id);
        if (response.success) {
          setProducts(safeProducts.filter(product => product.id !== id));
        } else {
          setError('خطا در حذف محصول');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('خطا در حذف محصول');
      }
    }
  };

  // محاسبه pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // نمایش آیکون مرتب‌سازی
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUpIcon className="w-4 h-4" /> : 
      <ArrowDownIcon className="w-4 h-4" />;
  };

  // فرمت کردن تاریخ
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  // فرمت کردن قیمت
  const formatPrice = (price) => {
    if (!price && price !== 0) return '۰';
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  // تابع کمکی برای دریافت نام وضعیت محصول
  const getStatusInfo = (product) => {
    const isActive = product.isActive === true;
    const isOutOfStock = (product.stock || 0) === 0;
    
    if (isOutOfStock) {
      return { text: 'ناموجود', class: 'bg-red-100 text-red-800' };
    } else if (isActive) {
      return { text: 'فعال', class: 'bg-green-100 text-green-800' };
    } else {
      return { text: 'غیرفعال', class: 'bg-gray-100 text-gray-800' };
    }
  };

  // تابع برای دریافت URL عکس محصول - نسخه اصلاح شده
  const getProductImage = (product) => {
    // اولویت با image اصلی است
    if (product.image) {
      return product.image;
    }
    // اگر image اصلی نبود، اولین عکس از آرایه images را برمی‌گرداند
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find(img => img.isMain);
      return mainImage ? mainImage.url : product.images[0].url;
    }
    // اگر هیچ عکسی نبود، null برمی‌گرداند
    return null;
  };

  // تابع برای نمایش واریانت‌ها
  const hasVariants = (product) => {
    return product.hasVariants && product.variants && product.variants.length > 0;
  };

  // تابع برای نمایش خلاصه واریانت‌ها
  const getVariantsSummary = (product) => {
    if (!hasVariants(product)) return null;
    
    const variantCount = product.variants.length;
    const totalVariantStock = product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    
    return `${variantCount} گزینه - ${totalVariantStock} عدد`;
  };

  // کامپوننت نمایش وضعیت لودینگ
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">در حال دریافت محصولات...</div>
        </div>
      </div>
    );
  }

  // کامپوننت نمایش خطا
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* هدر و دکمه‌ها */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
            <p className="text-sm text-gray-600 mt-1">
              مدیریت و مشاهده تمام محصولات فروشگاه
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/admin/categories"
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <TagIcon className="w-5 h-5" />
              مدیریت دسته‌بندی‌ها
            </Link>
            <Link 
              href="/admin/products/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              افزودن محصول جدید
            </Link>
          </div>
        </div>

        {/* فیلترها و جستجو */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">جستجوی محصول</label>
              <input
                type="text"
                placeholder="نام محصول..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="out-of-stock">ناموجود</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setStatusFilter('all');
                }}
                className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              >
                پاک کردن فیلترها
              </button>
            </div>
          </div>
        </div>

        {/* اطلاعات آماری */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{safeProducts.length}</div>
            <div className="text-sm text-gray-600">تعداد کل محصولات</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {safeProducts.filter(p => p.isActive === true).length}
            </div>
            <div className="text-sm text-gray-600">محصولات فعال</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="text-2xl font-bold text-red-600">
              {safeProducts.filter(p => (p.stock || 0) === 0).length}
            </div>
            <div className="text-sm text-gray-600">محصولات ناموجود</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {safeProducts.filter(p => p.hasVariants).length}
            </div>
            <div className="text-sm text-gray-600">دارای واریانت</div>
          </div>
        </div>

        {/* جدول محصولات */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">محصول</th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      قیمت
                      <SortIcon field="price" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center gap-1">
                      موجودی
                      <SortIcon field="stock" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">دسته‌بندی</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">وضعیت</th>
                  <th 
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      تاریخ ایجاد
                      <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => {
                    const statusInfo = getStatusInfo(product);
                    const productImage = getProductImage(product);
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              {productImage ? (
                                <img 
                                  src={productImage} 
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : (
                                <ShoppingCartIcon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate">{product.name || 'بدون نام'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-gray-500">ID: {product.id}</p>
                                {hasVariants(product) && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                    {getVariantsSummary(product)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className="font-medium text-gray-900">{formatPrice(product.price)} تومان</span>
                            {product.discount > 0 && (
                              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                {product.discount}% تخفیف
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                              (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.stock || 0} عدد
                            </span>
                            {hasVariants(product) && (
                              <div className="text-xs text-gray-500">
                                + {product.variants.length} گزینه
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {product.category?.name || 'بدون دسته‌بندی'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(product.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/admin/products/edit/${product.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="ویرایش محصول"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/products/${product.id}`}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="مشاهده در فروشگاه"
                              target="_blank"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="حذف محصول"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <ShoppingCartIcon className="w-12 h-12 text-gray-400" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {safeProducts.length === 0 ? 'هنوز محصولی اضافه نشده است' : 'محصولی با این فیلترها یافت نشد'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {safeProducts.length === 0 
                              ? 'برای شروع، اولین محصول خود را ایجاد کنید' 
                              : 'عبارت جستجو یا فیلترها را تغییر دهید'
                            }
                          </p>
                        </div>
                        {safeProducts.length === 0 && (
                          <Link
                            href="/admin/products/add"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mt-2"
                          >
                            <PlusIcon className="w-4 h-4" />
                            افزودن اولین محصول
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                  نمایش {startIndex + 1} تا {Math.min(startIndex + productsPerPage, sortedProducts.length)} از {sortedProducts.length} محصول
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    قبلی
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;