// app/admin/users/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  ShoppingBagIcon, 
  ClockIcon, 
  ChartBarIcon, 
  EnvelopeIcon, 
  DevicePhoneMobileIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const UsersPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // داده‌های نمونه برای کاربران
  const users = [
    {
      id: 1,
      name: 'علی محمدی',
      email: 'ali.mohammadi@example.com',
      phone: '09123456789',
      registrationDate: '1402/04/15',
      lastLogin: '1402/05/18',
      orders: 5,
      totalSpent: '۱۲,۵۰۰,۰۰۰ تومان',
      status: 'active',
      location: 'تهران',
      device: 'موبایل (iOS)'
    },
    {
      id: 2,
      name: 'فاطمه احمدی',
      email: 'fateme.ahmadi@example.com',
      phone: '09129876543',
      registrationDate: '1402/04/20',
      lastLogin: '1402/05/17',
      orders: 3,
      totalSpent: '۷,۸۰۰,۰۰۰ تومان',
      status: 'active',
      location: 'مشهد',
      device: 'دسکتاپ'
    },
    {
      id: 3,
      name: 'محمد رضایی',
      email: 'mohammad.rezaei@example.com',
      phone: '09121234567',
      registrationDate: '1402/05/01',
      lastLogin: '1402/05/16',
      orders: 0,
      totalSpent: '۰ تومان',
      status: 'pending',
      location: 'اصفهان',
      device: 'موبایل (Android)'
    },
    {
      id: 4,
      name: 'زهرا حسینی',
      email: 'zahra.hosseini@example.com',
      phone: '09127654321',
      registrationDate: '1402/03/10',
      lastLogin: '1402/05/15',
      orders: 12,
      totalSpent: '۲۵,۳۰۰,۰۰۰ تومان',
      status: 'active',
      location: 'تبریز',
      device: 'موبایل (iOS)'
    },
    {
      id: 5,
      name: 'امیر کریمی',
      email: 'amir.karimi@example.com',
      phone: '09158765432',
      registrationDate: '1402/05/05',
      lastLogin: '1402/05/14',
      orders: 1,
      totalSpent: '۴,۵۰۰,۰۰۰ تومان',
      status: 'inactive',
      location: 'شیراز',
      device: 'تبلت'
    },
  ];

  // فیلتر کردن کاربران بر اساس تب فعال
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && user.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && user.status === 'inactive';
    if (activeTab === 'pending') return matchesSearch && user.status === 'pending';
    if (activeTab === 'withOrders') return matchesSearch && user.orders > 0;
    if (activeTab === 'withoutOrders') return matchesSearch && user.orders === 0;
    
    return matchesSearch;
  });

  // آمار کلی
  const stats = {
    totalUsers: 1245,
    activeUsers: 892,
    usersWithOrders: 674,
    pendingUsers: 35,
    newUsersToday: 12,
    newUsersThisWeek: 84,
    avgOrderValue: '۱,۲۵۰,۰۰۰ تومان',
    topLocation: 'تهران (32%)'
  };

  // نمودار کاربران جدید (داده‌های نمونه)
  const newUsersData = [
    { day: 'شنبه', count: 18 },
    { day: 'یکشنبه', count: 24 },
    { day: 'دوشنبه', count: 16 },
    { day: 'سه شنبه', count: 22 },
    { day: 'چهارشنبه', count: 19 },
    { day: 'پنجشنبه', count: 15 },
    { day: 'جمعه', count: 12 },
  ];

  // مشاهده جزئیات کاربر
  const viewUserDetails = (userId) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <div className="p-6">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
        
        <div className="flex items-center gap-3">
          {/* جستجو */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجوی کاربر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* دکمه فیلتر */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            فیلتر
          </button>
        </div>
      </div>

      {/* کارت آمار کلی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">کل کاربران</div>
              <div className="text-xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+۱۲٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBagIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">کاربران خرید کرده</div>
              <div className="text-xl font-bold">{stats.usersWithOrders.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span>۵۴٪ از کل کاربران</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">منتظر پرداخت</div>
              <div className="text-xl font-bold">{stats.pendingUsers}</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span>۳ سبد خرید فعال</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">میانگین ارزش سفارش</div>
              <div className="text-xl font-bold">{stats.avgOrderValue}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+۷٪ نسبت به ماه گذشته</span>
          </div>
        </div>
      </div>

      {/* تب‌های دسته‌بندی */}
      <div className="bg-white rounded-2xl shadow-lg mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            همه کاربران
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            کاربران فعال
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'inactive' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            غیرفعال
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            منتظر پرداخت
          </button>
          <button
            onClick={() => setActiveTab('withOrders')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'withOrders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            خرید کرده
          </button>
          <button
            onClick={() => setActiveTab('withoutOrders')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'withoutOrders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            بدون خرید
          </button>
        </div>

        {/* جدول کاربران */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کاربر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ثبت‌نام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آخرین بازدید</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد سفارشات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مجموع خرید</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موقعیت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دستگاه</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.registrationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.lastLogin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.orders}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.totalSpent}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPinIcon className="w-4 h-4 ml-1 text-gray-400" />
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <DevicePhoneMobileIcon className="w-4 h-4 ml-1 text-gray-400" />
                        {user.device}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                          'bg-amber-100 text-amber-800'}`}>
                        {user.status === 'active' ? 'فعال' : 
                         user.status === 'inactive' ? 'غیرفعال' : 'منتظر پرداخت'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewUserDetails(user.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <EyeIcon className="w-4 h-4" />
                          مشاهده
                        </button>
                        <button className="text-red-600 hover:text-red-900 flex items-center gap-1">
                          <TrashIcon className="w-4 h-4" />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                    هیچ کاربری یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* بخش تحلیل‌های کاربران */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* نمودار کاربران جدید */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" />
            کاربران جدید در هفته گذشته
          </h2>
          <div className="h-64 flex items-end justify-between pt-4">
            {newUsersData.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-2">{data.day}</div>
                <div
                  className="bg-blue-500 rounded-t w-8 transition-all hover:bg-blue-600"
                  style={{ height: `${data.count * 5}px` }}
                  title={`${data.count} کاربر`}
                ></div>
                <div className="text-xs mt-1">{data.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* اطلاعات بازاریابی */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5" />
            اقدامات بازاریابی
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium">ارسال خبرنامه</div>
                <div className="text-sm text-gray-500">برای کاربران بدون خرید در ماه گذشته</div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                ارسال
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <div>
                <div className="font-medium">تخفیف ویژه</div>
                <div className="text-sm text-gray-500">برای کاربرانی که سبد خرید رها کرده‌اند</div>
              </div>
              <button className="px-3 py-1 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">
                ارسال
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">پیشنهادات شخصی‌سازی شده</div>
                <div className="text-sm text-gray-500">بر اساس تاریخچه خرید کاربران</div>
              </div>
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                ایجاد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* کارت گزارش‌ها */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">گزارش‌های کاربران</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="p-2 bg-blue-100 rounded-lg mb-2">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium">گزارش کاربران جدید</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="p-2 bg-green-100 rounded-lg mb-2">
              <ShoppingBagIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium">گزارش خریدها</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="p-2 bg-purple-100 rounded-lg mb-2">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium">تحلیل رفتار کاربران</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;