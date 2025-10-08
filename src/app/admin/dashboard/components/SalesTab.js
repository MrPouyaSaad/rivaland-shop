// app/admin/dashboard/components/SalesTab.jsx
'use client';

import {
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const SalesTab = ({ dateRange }) => {
  // داده‌های نمونه
  const salesData = {
    total: '۱۵۸,۵۰۰,۰۰۰',
    orders: 1245,
    averageOrder: '۱,۲۵۰,۰۰۰',
    growth: 8.5
  };

  const topProducts = [
    { id: 1, name: 'گوشی سامسونگ گلکسی S23', sales: 245, revenue: '۳۲,۵۰۰,۰۰۰', growth: 12 },
    { id: 2, name: 'لپ‌تاپ اپل مک‌بوک پرو', sales: 189, revenue: '۴۵,۲۰۰,۰۰۰', growth: 8 },
    { id: 3, name: 'هدفون سونی WH-1000XM5', sales: 312, revenue: '۱۸,۷۰۰,۰۰۰', growth: 23 },
    { id: 4, name: 'کنسول پلی‌استیشن 5', sales: 156, revenue: '۲۸,۱۰۰,۰۰۰', growth: -5 },
    { id: 5, name: 'ساعت هوشمند اپل واچ', sales: 278, revenue: '۲۲,۵۰۰,۰۰۰', growth: 18 }
  ];

  const salesChannels = [
    { channel: 'وبسایت', sales: '۸۵,۲۰۰,۰۰۰', percentage: 54, growth: 12 },
    { channel: 'اپلیکیشن موبایل', sales: '۴۲,۳۰۰,۰۰۰', percentage: 27, growth: 18 },
    { channel: 'فروشگاه فیزیکی', sales: '۲۳,۵۰۰,۰۰۰', percentage: 15, growth: -3 },
    { channel: 'تلفنی', sales: '۷,۵۰۰,۰۰۰', percentage: 4, growth: 5 }
  ];

  const regionalSales = [
    { region: 'تهران', sales: '۴۲,۵۰۰,۰۰۰', growth: 12 },
    { region: 'مشهد', sales: '۲۸,۷۰۰,۰۰۰', growth: 8 },
    { region: 'اصفهان', sales: '۱۸,۹۰۰,۰۰۰', growth: 15 },
    { region: 'شیراز', sales: '۱۵,۳۰۰,۰۰۰', growth: -3 },
    { region: 'تبریز', sales: '۱۲,۸۰۰,۰۰۰', growth: 7 }
  ];

  return (
    <div className="space-y-6">
      {/* آمار کلی فروش */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">فروش کل</div>
              <div className="text-xl font-bold">{salesData.total} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {salesData.growth > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{salesData.growth}٪ نسبت به ماه گذشته</span>
          </div>
        </div>

        
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">تعداد سفارشات</div>
              <div className="text-xl font-bold">{salesData.orders.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+۸٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <TagIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">میانگین سبد خرید</div>
              <div className="text-xl font-bold">{salesData.averageOrder} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+۵٪ نسبت به ماه گذشته</span>
          </div>
        </div>
      </div>

      {/* محصولات پرفروش */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">پرفروش‌ترین محصولات</h2>
        <div className="space-y-4">
          {topProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500">{product.sales} فروش</div>
              </div>
              <div className="text-left">
                <div className="font-bold">{product.revenue} تومان</div>
                <div className={`text-xs flex items-center ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.growth > 0 ? (
                    <ArrowTrendingUpIcon className="w-3 h-3 ml-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3 ml-1" />
                  )}
                  {product.growth}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* کانال‌های فروش */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">کانال‌های فروش</h2>
          <div className="space-y-4">
            {salesChannels.map((channel, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{channel.channel}</span>
                  <span className="text-sm text-gray-500">{channel.sales} ({channel.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${channel.percentage}%` }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 flex items-center ${channel.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {channel.growth > 0 ? (
                    <ArrowTrendingUpIcon className="w-3 h-3 ml-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3 ml-1" />
                  )}
                  {channel.growth}% رشد
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* فروش منطقه‌ای */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">فروش بر اساس منطقه</h2>
          <div className="space-y-4">
            {regionalSales.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{region.region}</div>
                <div className="text-left">
                  <div className="font-bold">{region.sales} تومان</div>
                  <div className={`text-xs flex items-center ${region.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {region.growth > 0 ? (
                      <ArrowTrendingUpIcon className="w-3 h-3 ml-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3 ml-1" />
                    )}
                    {region.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTab;