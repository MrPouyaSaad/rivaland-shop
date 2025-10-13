// app/admin/layout.js
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ChartBarIcon,
  ShoppingCartIcon,
  UsersIcon,
  PhotoIcon,
  Cog6ToothIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { adminApiService } from '../../services/api';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        const response = await adminApiService.getDashboardSummary();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setError('خطا در دریافت آمار کلی');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);

  const navigation = [
    { id: 'dashboard', label: 'داشبورد', icon: ChartBarIcon, href: '/admin/dashboard' },
    { id: 'products', label: 'مدیریت محصولات', icon: ShoppingCartIcon, href: '/admin/products' },
    { id: 'orders', label: 'مدیریت سفارشات', icon: DocumentTextIcon, href: '/admin/orders' },
    { id: 'users', label: 'مدیریت کاربران', icon: UsersIcon, href: '/admin/users' },
    { id: 'content', label: 'مدیریت محتوا', icon: PhotoIcon, href: '/admin/content' },
    { id: 'settings', label: 'تنظیمات', icon: Cog6ToothIcon, href: '/admin/settings' }
  ];

  // تابع برای فرمت کردن اعداد با جداکننده هزارگان
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">پنل مدیریت ســایـرون</h1>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                onClick={() => adminApiService.logout()}
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
          <nav className="p-4 space-y-2">
            {/* آمار کلی */}
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 text-sm">آمار کلی</h3>
              {loading ? (
                <div className="mt-2 space-y-1 text-xs text-blue-600">
                  <div>در حال بارگذاری...</div>
                </div>
              ) : error ? (
                <div className="mt-2 space-y-1 text-xs text-red-600">
                  <div>{error}</div>
                </div>
              ) : (
                <div className="mt-2 space-y-1 text-xs text-blue-600">
                  <div className="flex justify-between">
                    <span>فروش:</span>
                    <span className="font-medium">{formatNumber(stats.revenue)} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span>سفارشات:</span>
                    <span className="font-medium">{formatNumber(stats.orders)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>کاربران:</span>
                    <span className="font-medium">{formatNumber(stats.users)}</span>
                  </div>
                </div>
              )}
            </div>

            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}