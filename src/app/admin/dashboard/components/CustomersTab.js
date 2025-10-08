// app/admin/dashboard/components/CustomersTab.jsx
'use client';

import {
  UsersIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const CustomersTab = ({ dateRange }) => {
  // داده‌های نمونه
  const customerStats = {
    total: 12450,
    new: 245,
    returning: 567,
    vip: 89,
    averageOrder: '۱,۲۵۰,۰۰۰',
    satisfaction: 4.7
  };

  const customerSegments = [
    { segment: 'مشتریان جدید', count: 245, percentage: 20, growth: 15 },
    { segment: 'مشتریان بازگشتی', count: 567, percentage: 45, growth: 8 },
    { segment: 'مشتریان VIP', count: 89, percentage: 7, growth: 12 },
    { segment: 'مشتریان غیرفعال', count: 358, percentage: 28, growth: -5 }
  ];

  const topCustomers = [
    { id: 1, name: 'محمد رضایی', purchases: 42, totalSpent: '۱۲,۵۰۰,۰۰۰', lastPurchase: '۱۴۰۲/۰۶/۱۵' },
    { id: 2, name: 'فاطمه محمدی', purchases: 38, totalSpent: '۹,۸۰۰,۰۰۰', lastPurchase: '۱۴۰۲/۰۶/۱۲' },
    { id: 3, name: 'علی حسینی', purchases: 35, totalSpent: '۸,۲۰۰,۰۰۰', lastPurchase: '۱۴۰۲/۰۶/۱۰' },
    { id: 4, name: 'زهرا کریمی', purchases: 31, totalSpent: '۷,۵۰۰,۰۰۰', lastPurchase: '۱۴۰۲/۰۶/۰۸' },
    { id: 5, name: 'رضا احمدی', purchases: 28, totalSpent: '۶,۹۰۰,۰۰۰', lastPurchase: '۱۴۰۲/۰۶/۰۵' }
  ];

  const satisfactionData = [
    { aspect: 'کیفیت محصول', rating: 4.8 },
    { aspect: 'پشتیبانی', rating: 4.5 },
    { aspect: 'زمان تحویل', rating: 4.2 },
    { aspect: 'قیمت', rating: 4.0 },
    { aspect: 'تنوع محصولات', rating: 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* آمار کلی مشتریان */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">کل مشتریان</div>
              <div className="text-xl font-bold">{customerStats.total.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+۱۵٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">مشتریان جدید</div>
              <div className="text-xl font-bold">{customerStats.new}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+۱۲٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">میانگین خرید</div>
              <div className="text-xl font-bold">{customerStats.averageOrder} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+۵٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <StarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">رضایت مشتریان</div>
              <div className="text-xl font-bold">{customerStats.satisfaction}/5</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+۰.۳ نسبت به ماه گذشته</span>
          </div>
        </div>
      </div>

      {/* بخش‌بندی مشتریان */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">بخش‌بندی مشتریان</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {customerSegments.map((segment, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{segment.segment}</span>
                  <span className="text-sm text-gray-500">{segment.count} ({segment.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 flex items-center ${segment.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {segment.growth > 0 ? (
                    <ArrowTrendingUpIcon className="w-3 h-3 ml-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3 ml-1" />
                  )}
                  {segment.growth}% رشد
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
            <div className="text-center">
              <div className="text-2xl font-bold">{customerStats.vip} مشتری VIP</div>
              <div className="text-sm mt-2">میانگین خرید ۵,۲۰۰,۰۰۰ تومان</div>
              <div className="flex items-center justify-center mt-4 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بهترین مشتریان */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">بهترین مشتریان</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4">نام مشتری</th>
                <th className="text-right py-3 px-4">تعداد خرید</th>
                <th className="text-right py-3 px-4">مجموع خرید</th>
                <th className="text-right py-3 px-4">آخرین خرید</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{customer.name}</td>
                  <td className="py-3 px-4">{customer.purchases}</td>
                  <td className="py-3 px-4 font-medium text-green-600">{customer.totalSpent} تومان</td>
                  <td className="py-3 px-4 text-gray-500">{customer.lastPurchase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* رضایت مشتریان */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">رضایت مشتریان</h2>
        <div className="space-y-4">
          {satisfactionData.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.aspect}</span>
                <span className="text-sm text-gray-500">{item.rating}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                  style={{ width: `${item.rating * 20}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomersTab;