// app/admin/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  EyeIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { adminApiService } from '@/services/api';

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [error, setError] = useState('');

  // دریافت لیست سفارشات
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const filters = {
        page,
        limit: pagination.limit
      };
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      const response = await adminApiService.getAdminOrders(filters);
      
      if (response.success) {
        setOrders(response.data.orders || []);
        setPagination(prev => ({
          ...prev,
          page,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0
        }));
      } else {
        throw new Error(response.message || 'خطا در دریافت سفارشات');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('خطا در دریافت سفارشات');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // دریافت آمار سفارشات
  const fetchOrderStats = async () => {
    try {
      const response = await adminApiService.getAdminOrderStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  useEffect(() => {
    fetchOrders(1);
    fetchOrderStats();
  }, [statusFilter]);

  // جستجو با تاخیر
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '' || statusFilter !== 'all') {
        fetchOrders(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  // فیلتر کردن سفارشات
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.includes(searchTerm);
    
    return matchesSearch;
  });

  // تابع برای دریافت کلاس وضعیت سفارش
  const getStatusClass = (status) => {
    const statusMap = {
      pending_payment: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      preparing: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  // تابع برای دریافت متن وضعیت سفارش
  const getStatusText = (status) => {
    const statusMap = {
      pending_payment: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      processing: 'در حال پردازش',
      preparing: 'در حال آماده‌سازی',
      shipped: 'ارسال شده',
      delivered: 'تحویل شده',
      cancelled: 'لغو شده'
    };
    return statusMap[status] || status;
  };

  // مشاهده جزئیات سفارش
  const viewOrderDetails = (orderId) => {
    router.push(`/admin/orders/${orderId}`);
  };

  // تغییر صفحه
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage);
    }
  };

  // فرمت تاریخ
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  // فرمت قیمت
  const formatPrice = (price) => {
    return price ? price.toLocaleString('fa-IR') + ' تومان' : '۰ تومان';
  };

  return (
    <div className="p-6">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت سفارشات</h1>
          <p className="text-gray-600 mt-1">مدیریت و پیگیری کلیه سفارشات مشتریان</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* جستجو */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجوی شماره سفارش، نام یا تلفن مشتری..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* دکمه فیلتر */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            فیلتر
          </button>
        </div>
      </div>
      
      {/* بخش فیلترها */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت سفارش</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending_payment">در انتظار پرداخت</option>
                <option value="paid">پرداخت شده</option>
                <option value="processing">در حال پردازش</option>
                <option value="preparing">در حال آماده‌سازی</option>
                <option value="shipped">ارسال شده</option>
                <option value="delivered">تحویل شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">همه تاریخ‌ها</option>
                <option value="today">امروز</option>
                <option value="week">هفته جاری</option>
                <option value="month">ماه جاری</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                حذف فیلترها
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* نمایش خطا */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 ml-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => fetchOrders(1)}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      )}
      
      {/* کارت آمار */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">کل سفارشات</div>
          <div className="text-2xl font-bold">{stats.total || 0}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">در انتظار پرداخت</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending_payment || 0}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">در حال انجام</div>
          <div className="text-2xl font-bold text-blue-600">
            {(stats.paid || 0) + (stats.processing || 0) + (stats.preparing || 0) + (stats.shipped || 0)}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">ارسال شده</div>
          <div className="text-2xl font-bold text-orange-600">{stats.shipped || 0}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">تحویل شده</div>
          <div className="text-2xl font-bold text-green-600">{stats.delivered || 0}</div>
        </div>
      </div>
      
      {/* جدول سفارشات */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">در حال دریافت سفارشات...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره سفارش</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مشتری</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          <div className="text-xs text-gray-500">{order.items?.length || 0} کالا</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customerName || 'نامشخص'}</div>
                          <div className="text-xs text-gray-500">{order.customerPhone || 'شماره نامشخص'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatPrice(order.total)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => viewOrderDetails(order.id)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="w-4 h-4" />
                            مشاهده
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="text-gray-500">
                          <EyeIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>هیچ سفارشی یافت نشد.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-700">
                      نمایش <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> تا{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span> از{' '}
                      <span className="font-medium">{pagination.total}</span> نتیجه
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronDownIcon className="h-4 w-4 rotate-90" />
                      قبلی
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      بعدی
                      <ChevronDownIcon className="h-4 w-4 -rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;