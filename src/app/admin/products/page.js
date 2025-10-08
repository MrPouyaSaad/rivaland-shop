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
  const categories = ['همه', 'کابل شارژ']; // بر اساس داده‌های واقعی

  // دریافت محصولات از API - نسخه اصلاح شده
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await adminApiService.getAdminProducts();
        
        console.log('📦 API Response:', response);
        
        if (response.success) {
          let productsData = [];
          
          // بررسی ساختارهای مختلف پاسخ API
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // ساختار: {success: true, data: {data: [...]}}
            productsData = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            // ساختار: {success: true, data: [...]}
            productsData = response.data;
          } else if (Array.isArray(response.data)) {
            // ساختار: {data: [...]}
            productsData = response.data;
          } else if (response.products && Array.isArray(response.products)) {
            // ساختار: {products: [...]}
            productsData = response.products;
          } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
            // ساختار: {data: {products: [...]}}
            productsData = response.data.products;
          }
          
          console.log('✅ Extracted products:', productsData);
          setProducts(productsData || []);
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
    
    // فیلتر دسته‌بندی - استفاده از categoryId یا category
    const productCategoryId = product.categoryId || (product.category && product.category.id);
    const productCategoryName = product.category?.name || '';
    
    const matchesCategory = selectedCategory === 'all' || 
                           productCategoryName === selectedCategory ||
                           productCategoryId?.toString() === selectedCategory;
    
    // فیلتر وضعیت - نسخه اصلاح شده
    const isProductActive = product.isActive === true || product.isActive === 'true';
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
    const isActive = product.isActive === true || product.isActive === 'true';
    const isOutOfStock = (product.stock || 0) === 0;
    
    if (isOutOfStock) {
      return { text: 'ناموجود', class: 'bg-red-100 text-red-800' };
    } else if (isActive) {
      return { text: 'فعال', class: 'bg-green-100 text-green-800' };
    } else {
      return { text: 'غیرفعال', class: 'bg-gray-100 text-gray-800' };
    }
  };

  // تابع برای دریافت URL عکس محصول
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

  // کامپوننت نمایش وضعیت لودینگ
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">در حال دریافت محصولات...</div>
      </div>
    );
  }

  // کامپوننت نمایش خطا
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* هدر و دکمه‌ها */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/admin/categories"
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <TagIcon className="w-5 h-5" />
            مدیریت دسته‌بندی‌ها
          </Link>
          <Link 
            href="/admin/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            افزودن محصول جدید
          </Link>
        </div>
      </div>

      {/* فیلترها و جستجو */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">جستجوی محصول</label>
            <input
              type="text"
              placeholder="نام محصول..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">همه</option>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
              <option value="out-of-stock">ناموجود</option>
            </select>
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
            {safeProducts.filter(p => p.isActive === true || p.isActive === 'true').length}
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
          <div className="text-2xl font-bold text-gray-600">
            {filteredProducts.length}
          </div>
          <div className="text-sm text-gray-600">نتایج جستجو</div>
        </div>
      </div>

      {/* جدول محصولات */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th 
                  className="px-6 py-3 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    محصول
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-1">
                    قیمت
                    <SortIcon field="price" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center gap-1">
                    موجودی
                    <SortIcon field="stock" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">دسته‌بندی</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">وضعیت</th>
                <th 
                  className="px-6 py-3 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    تاریخ ایجاد
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  const statusInfo = getStatusInfo(product);
                  const productImage = getProductImage(product);
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            {productImage ? (
                              <img 
                                src={productImage} 
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <ShoppingCartIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name || 'بدون نام'}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{formatPrice(product.price)} تومان</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                          (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock || 0} عدد
                        </span>
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
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="ویرایش"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/products/${product.id}`}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="مشاهده"
                            target="_blank"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="حذف"
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
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {safeProducts.length === 0 ? 'هنوز محصولی اضافه نشده است' : 'محصولی با این فیلترها یافت نشد'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-700">
                نمایش {startIndex + 1} تا {Math.min(startIndex + productsPerPage, sortedProducts.length)} از {sortedProducts.length} محصول
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  قبلی
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  بعدی
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;