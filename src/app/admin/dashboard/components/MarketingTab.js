// app/admin/dashboard/components/MarketingTab.jsx
'use client';

import {
  MegaphoneIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TagIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const MarketingTab = ({ dateRange }) => {
  // داده‌های نمونه
  const marketingStats = {
    roi: 327,
    conversionRate: 4.8,
    customerAcquisitionCost: '۱۸۵,۰۰۰',
    growth: {
      roi: 12,
      conversion: 0.6,
      cost: -8
    }
  };

  const campaigns = [
    { name: 'تابستانه ۱۴۰۲', budget: '۱۵,۰۰۰,۰۰۰', revenue: '۴۸,۵۰۰,۰۰۰', roi: 223, status: 'active' },
    { name: 'تخفیف ویژه', budget: '۸,۵۰۰,۰۰۰', revenue: '۲۵,۲۰۰,۰۰۰', roi: 196, status: 'completed' },
    { name: 'جشنواره بهاره', budget: '۱۲,۰۰۰,۰۰۰', revenue: '۳۸,۷۰۰,۰۰۰', roi: 222, status: 'completed' },
    { name: 'فصل مدرسه', budget: '۶,۸۰۰,۰۰۰', revenue: '۱۸,۹۰۰,۰۰۰', roi: 178, status: 'active' }
  ];

  const trafficSources = [
    { source: 'گوگل', visitors: 12450, conversion: 4.2, cost: '۲,۵۰۰,۰۰۰', revenue: '۱۸,۷۰۰,۰۰۰' },
    { source: 'اینستاگرام', visitors: 8650, conversion: 5.8, cost: '۱,۸۰۰,۰۰۰', revenue: '۱۵,۲۰۰,۰۰۰' },
    { source: 'فیس‌بوک', visitors: 6420, conversion: 3.5, cost: '۱,۲۰۰,۰۰۰', revenue: '۹,۸۰۰,۰۰۰' },
    { source: 'تبلیغات بنری', visitors: 3250, conversion: 2.1, cost: '۸۰۰,۰۰۰', revenue: '۴,۵۰۰,۰۰۰' },
    { source: 'Direct', visitors: 7560, conversion: 6.3, cost: '۰', revenue: '۲۲,۱۰۰,۰۰۰' },
    { source: 'ایمیل', visitors: 2980, conversion: 7.8, cost: '۴۰۰,۰۰۰', revenue: '۸,۹۰۰,۰۰۰' }
  ];

  const couponsPerformance = [
    { code: 'SUMMER2023', usage: 124, discount: '۱۲,۴۰۰,۰۰۰', revenue: '۴۵,۶۰۰,۰۰۰' },
    { code: 'WELCOME10', usage: 89, discount: '۴,۴۵۰,۰۰۰', revenue: '۲۲,۲۵۰,۰۰۰' },
    { code: 'BLACKFRIDAY', usage: 203, discount: '۳۰,۴۵۰,۰۰۰', revenue: '۱۲۵,۷۰۰,۰۰۰' },
    { code: 'FREE_SHIPPING', usage: 156, discount: '۷,۸۰۰,۰۰۰', revenue: '۶۲,۴۰۰,۰۰۰' }
  ];

  return (
    <div className="space-y-6">
      {/* آمار کلی بازاریابی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">بازدهی سرمایه (ROI)</div>
              <div className="text-xl font-bold">{marketingStats.roi}%</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {marketingStats.growth.roi > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{marketingStats.growth.roi}٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <MegaphoneIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">نرخ تبدیل</div>
              <div className="text-xl font-bold">{marketingStats.conversionRate}%</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowTrendingUpIcon className="w-4 h-4" />
            <span>+{marketingStats.growth.conversion}% از ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <TagIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">هزینه جذب مشتری</div>
              <div className="text-xl font-bold">{marketingStats.customerAcquisitionCost} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {marketingStats.growth.cost > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{marketingStats.growth.cost}% نسبت به ماه گذشته</span>
          </div>
        </div>
      </div>

      {/* کمپین‌های بازاریابی */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">کمپین‌های بازاریابی</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4">نام کمپین</th>
                <th className="text-right py-3 px-4">بودجه</th>
                <th className="text-right py-3 px-4">درآمد</th>
                <th className="text-right py-3 px-4">ROI</th>
                <th className="text-right py-3 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{campaign.name}</td>
                  <td className="py-3 px-4">{campaign.budget} تومان</td>
                  <td className="py-3 px-4 font-medium text-green-600">{campaign.revenue} تومان</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {campaign.roi}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'active' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status === 'active' ? 'فعال' : 'پایان یافته'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* منابع ترافیک */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">منابع ترافیک و عملکرد</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4">منبع</th>
                <th className="text-right py-3 px-4">بازدیدکنندگان</th>
                <th className="text-right py-3 px-4">نرخ تبدیل</th>
                <th className="text-right py-3 px-4">هزینه</th>
                <th className="text-right py-3 px-4">درآمد</th>
                <th className="text-right py-3 px-4">ROI</th>
              </tr>
            </thead>
            <tbody>
              {trafficSources.map((source, index) => {
                const roi = source.cost === '۰' ? '∞' : 
                  Math.round((parseInt(source.revenue.replace(/,/g, '')) - parseInt(source.cost.replace(/,/g, ''))) / 
                  parseInt(source.cost.replace(/,/g, '')) * 100);
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{source.source}</td>
                    <td className="py-3 px-4">{source.visitors.toLocaleString()}</td>
                    <td className="py-3 px-4">{source.conversion}%</td>
                    <td className="py-3 px-4">{source.cost} تومان</td>
                    <td className="py-3 px-4 font-medium text-green-600">{source.revenue} تومان</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        roi === '∞' || roi > 100 ? 'bg-green-100 text-green-800' : 
                        roi > 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {roi === '∞' ? '∞' : `${roi}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* عملکرد کوپن‌ها */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">عملکرد کوپن‌های تخفیف</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {couponsPerformance.map((coupon, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="flex justify-between items-center mb-3">
                <div className="font-medium text-blue-800">{coupon.code}</div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {coupon.usage} استفاده
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-blue-600">تخفیف داده شده</div>
                  <div className="font-medium">{coupon.discount} تومان</div>
                </div>
                <div>
                  <div className="text-sm text-blue-600">درآمد ایجاد شده</div>
                  <div className="font-medium">{coupon.revenue} تومان</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-xs text-blue-600">
                  بازدهی: {Math.round(parseInt(coupon.revenue.replace(/,/g, '')) / parseInt(coupon.discount.replace(/,/g, '')))}x
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingTab;