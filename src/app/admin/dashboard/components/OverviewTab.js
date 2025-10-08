// app/admin/dashboard/components/OverviewTab.jsx
'use client';

import {
  ChartBarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { useEffect, useState } from 'react';
import { adminApiService } from '../../../../services/api';

const OverviewTab = ({ dateRange }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await adminApiService.getDashboardOverview();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('خطا در دریافت اطلاعات داشبورد');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // تبدیل داده‌های هفتگی از API به فرمت مناسب برای نمودار
  const weeklyChartData = dashboardData?.data?.weeklyChart?.map(item => ({
    day: getPersianDayName(item.day),
    revenue: item.revenue,
    orders: item.orders,
  })) || [];

  // تبدیل داده‌های ماهانه از API به فرمت مناسب برای نمودار
  const monthlyChartData = dashboardData?.data?.monthlyChart?.map(item => ({
    month: getPersianMonthName(item.month),
    revenue: item.revenue,
    orders: item.orders,
  })) || [];

  // تابع برای تبدیل شماره روز به نام روز فارسی
  function getPersianDayName(dayNumber) {
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    return days[dayNumber] || dayNumber;
  }

  // تابع برای تبدیل شماره ماه به نام ماه فارسی
  function getPersianMonthName(monthNumber) {
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return months[monthNumber - 1] || monthNumber;
  }

  // فرمت کردن اعداد به صورت فارسی با جداکننده هزارگان
  const formatNumber = (num) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  // محاسبه درصد رشد به صورت فرمت شده
  const formatGrowth = (growth) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">در حال دریافت اطلاعات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">داده‌ای برای نمایش وجود ندارد</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* کارت آمار کلی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* کارت درآمد کل */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">درآمد کل</div>
              <div className="text-xl font-bold">{formatNumber(dashboardData.data.revenue.value)} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {dashboardData.data.revenue.growth >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{formatGrowth(dashboardData.data.revenue.growth)} نسبت به ماه گذشته</span>
          </div>
        </div>
        
        {/* کارت سفارشات */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ShoppingCartIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">سفارشات</div>
              <div className="text-xl font-bold">{formatNumber(dashboardData.data.orders.value)}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {dashboardData.data.orders.growth >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{formatGrowth(dashboardData.data.orders.growth)} نسبت به ماه گذشته</span>
          </div>
        </div>
        
        {/* کارت مشتریان */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">مشتریان</div>
              <div className="text-xl font-bold">{formatNumber(dashboardData.data.customers.value)}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {dashboardData.data.customers.growth >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{formatGrowth(dashboardData.data.customers.growth)} نسبت به ماه گذشته</span>
          </div>
        </div>
        
        {/* کارت میانگین سبد خرید */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">میانگین سبد خرید</div>
              <div className="text-xl font-bold">{formatNumber(dashboardData.data.avgBasket.value)} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {dashboardData.data.avgBasket.growth >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{formatGrowth(dashboardData.data.avgBasket.growth)} نسبت به ماه گذشته</span>
          </div>
        </div>
      </div>

      {/* انتخاب بازه زمانی */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">عملکرد فروش</h2>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button className={`px-3 py-1 rounded-md text-sm ${dateRange === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'}`}>
              هفتگی
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${dateRange === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'}`}>
              ماهانه
            </button>
          </div>
        </div>

        {/* نمودار فروش هفتگی/ماهانه */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {dateRange === 'week' ? (
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`${formatNumber(value)} تومان`, 'فروش'];
                    if (name === 'orders') return [value, 'سفارشات'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="فروش (تومان)" fill="#3b82f6" />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="تعداد سفارشات" stroke="#10b981" strokeWidth={2} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${formatNumber(value)} تومان`, '']}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="درآمد" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="orders" name="سفارشات" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* بخش محصولات پرفروش و کم‌فروش */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* محصولات پرفروش */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">پرفروش‌ترین محصولات</h2>
          <div className="space-y-4">
            {dashboardData.data.topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatNumber(product.sold)} فروش | موجودی: {formatNumber(product.stock)}
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-bold">{formatNumber(product.price)} تومان</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* محصولات کم‌فروش */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">محصولات کم‌فروش</h2>
          <div className="space-y-4">
            {dashboardData.data.lowProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatNumber(product.sold)} فروش | موجودی: {formatNumber(product.stock)}
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-bold">{formatNumber(product.price)} تومان</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;