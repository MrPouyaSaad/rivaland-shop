// app/admin/dashboard/components/InventoryTab.jsx
'use client';

import {
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const InventoryTab = ({ dateRange }) => {
  // داده‌های نمونه
  const inventoryStats = {
    totalProducts: 1245,
    totalValue: '۴۵۸,۷۰۰,۰۰۰',
    lowStock: 23,
    outOfStock: 7,
    growth: {
      value: 8,
      products: 12,
      alerts: -5
    }
  };

  const inventoryAlerts = [
    { product: 'مانیتور السی ۲۴ اینچ', stock: 3, status: 'critical', sku: 'MON-LC-24', category: 'مانیتور' },
    { product: 'ماوس لاجیتک MX3', stock: 5, status: 'low', sku: 'MOU-LG-MX3', category: 'ماوس' },
    { product: 'کیبورد مکانیکی رازر', stock: 7, status: 'low', sku: 'KEY-RZ-MEC', category: 'کیبورد' },
    { product: 'هارد اکسترنال سیگیت ۲TB', stock: 15, status: 'medium', sku: 'HD-SG-2TB', category: 'ذخیره‌سازی' },
    { product: 'کارت گرافیک RTX 4080', stock: 2, status: 'critical', sku: 'GPU-NV-4080', category: 'کارت گرافیک' }
  ];

  const stockMovements = [
    { product: 'گوشی سامسونگ گلکسی S23', type: 'ورود', quantity: 50, date: '۱۴۰۲/۰۶/۱۵', source: 'تامین کننده اصلی' },
    { product: 'لپ‌تاپ اپل مک‌بوک پرو', type: 'خروج', quantity: 25, date: '۱۴۰۲/۰۶/۱۴', source: 'سفارش آنلاین' },
    { product: 'هدفون سونی WH-1000XM5', type: 'ورود', quantity: 100, date: '۱۴۰۲/۰۶/۱۲', source: 'تامین کننده جدید' },
    { product: 'کنسول پلی‌استیشن 5', type: 'خروج', quantity: 18, date: '۱۴۰۲/۰۶/۱۰', source: 'فروشگاه فیزیکی' },
    { product: 'ساعت هوشمند اپل واچ', type: 'ورود', quantity: 40, date: '۱۴۰۲/۰۶/۰۸', source: 'تامین کننده اصلی' }
  ];

  const categoryInventory = [
    { category: 'لپ‌تاپ', count: 125, value: '۱۲۵,۰۰۰,۰۰۰', growth: 8 },
    { category: 'گوشی موبایل', count: 245, value: '۹۸,۵۰۰,۰۰۰', growth: 12 },
    { category: 'لوازم جانبی', count: 567, value: '۴۵,۳۰۰,۰۰۰', growth: 5 },
    { category: 'مانیتور', count: 89, value: '۳۵,۶۰۰,۰۰۰', growth: -3 },
    { category: 'قطعات کامپیوتر', count: 198, value: '۷۸,۹۰۰,۰۰۰', growth: 15 }
  ];

  return (
    <div className="space-y-6">
      {/* آمار کلی انبار */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <CubeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">کل محصولات</div>
              <div className="text-xl font-bold">{inventoryStats.totalProducts.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {inventoryStats.growth.products > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{inventoryStats.growth.products}٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ClipboardDocumentListIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">ارزش کل موجودی</div>
              <div className="text-xl font-bold">{inventoryStats.totalValue} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {inventoryStats.growth.value > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{inventoryStats.growth.value}٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">موجودی کم</div>
              <div className="text-xl font-bold">{inventoryStats.lowStock}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {inventoryStats.growth.alerts > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{inventoryStats.growth.alerts}٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">ناموجود</div>
              <div className="text-xl font-bold">{inventoryStats.outOfStock}</div>
            </div>
          </div>
          <div className="mt-2 text-xs">نیاز به اقدام فوری</div>
        </div>
      </div>

      {/* هشدارهای موجودی */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">هشدارهای موجودی</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4">محصول</th>
                <th className="text-right py-3 px-4">دسته‌بندی</th>
                <th className="text-right py-3 px-4">SKU</th>
                <th className="text-right py-3 px-4">موجودی</th>
                <th className="text-right py-3 px-4">وضعیت</th>
                <th className="text-right py-3 px-4">اقدام</th>
              </tr>
            </thead>
            <tbody>
              {inventoryAlerts.map((alert, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{alert.product}</td>
                  <td className="py-3 px-4">{alert.category}</td>
                  <td className="py-3 px-4 text-gray-500">{alert.sku}</td>
                  <td className="py-3 px-4">{alert.stock} عدد</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alert.status === 'critical' 
                        ? 'bg-red-100 text-red-800' 
                        : alert.status === 'low' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.status === 'critical' ? 'بحرانی' : 
                       alert.status === 'low' ? 'کم' : 'متوسط'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 text-sm hover:text-blue-800">
                      سفارش
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* حرکت‌های انبار */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">آخرین حرکت‌های انبار</h2>
          <div className="space-y-4">
            {stockMovements.map((movement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{movement.product}</div>
                  <div className="text-sm text-gray-500">{movement.date} - {movement.source}</div>
                </div>
                <div className="text-left">
                  <div className={`font-bold ${movement.type === 'ورود' ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.type === 'ورود' ? '+' : '-'}{movement.quantity}
                  </div>
                  <div className="text-xs text-gray-500">{movement.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* موجودی بر اساس دسته‌بندی */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">موجودی بر اساس دسته‌بندی</h2>
          <div className="space-y-4">
            {categoryInventory.map((category, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{category.category}</span>
                  <span className="text-sm text-gray-500">{category.count} قلم</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${(category.count / 1000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{category.value} تومان</span>
                  <span className={`text-xs flex items-center ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {category.growth > 0 ? (
                      <ArrowTrendingUpIcon className="w-3 h-3 ml-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3 ml-1" />
                    )}
                    {category.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* پیش‌بینی موجودی */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">پیش‌بینی موجودی</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600">موجودی فعلی</div>
            <div className="font-bold text-lg">۱,۲۴۵ قلم</div>
            <div className="text-xs text-blue-600">ارزش: ۴۵۸,۷۰۰,۰۰۰ تومان</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-sm text-amber-600">پیش‌بینی مصرف ۳۰ روزه</div>
            <div className="font-bold text-lg">۳۸۰ قلم</div>
            <div className="text-xs text-amber-600">ماهیانه ~۱۲.۷ قلم در روز</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm text-green-600">موجودی تا</div>
            <div className="font-bold text-lg">۹۸ روز</div>
            <div className="text-xs text-green-600">تا ۱۴۰۲/۰۹/۲۵</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTab;