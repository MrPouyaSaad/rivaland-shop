// app/admin/dashboard/components/FinancialTab.jsx
'use client';

import {
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const FinancialTab = ({ dateRange }) => {
  // داده‌های نمونه برای نمودارهای هفتگی
  const weeklyFinancialData = [
    { day: 'شنبه', revenue: 18500000, expense: 9200000, profit: 9300000 },
    { day: 'یکشنبه', revenue: 21000000, expense: 10500000, profit: 10500000 },
    { day: 'دوشنبه', revenue: 17500000, expense: 8800000, profit: 8700000 },
    { day: 'سه شنبه', revenue: 19200000, expense: 9600000, profit: 9600000 },
    { day: 'چهارشنبه', revenue: 20500000, expense: 10200000, profit: 10300000 },
    { day: 'پنجشنبه', revenue: 22500000, expense: 11200000, profit: 11300000 },
    { day: 'جمعه', revenue: 19800000, expense: 9900000, profit: 9900000 },
  ];

  // داده‌های نمونه برای نمودارهای ماهانه
  const monthlyFinancialData = [
    { month: 'فروردین', revenue: 12500000, expense: 8500000, profit: 4000000 },
    { month: 'اردیبهشت', revenue: 13200000, expense: 9200000, profit: 4000000 },
    { month: 'خرداد', revenue: 14500000, expense: 9800000, profit: 4700000 },
    { month: 'تیر', revenue: 15800000, expense: 10500000, profit: 5300000 },
    { month: 'مرداد', revenue: 16200000, expense: 10800000, profit: 5400000 },
    { month: 'شهریور', revenue: 17500000, expense: 11200000, profit: 6300000 },
  ];

  const expenseDistributionData = [
    { name: 'تولید', value: 35, color: '#3b82f6' },
    { name: 'بازاریابی', value: 24, color: '#ec4899' },
    { name: 'پرسنل', value: 20, color: '#eab308' },
    { name: 'تحقیق و توسعه', value: 13, color: '#10b981' },
    { name: 'سایر', value: 8, color: '#8b5cf6' },
  ];

  const cashFlowData = [
    { day: '۱', income: 4200000, outcome: 2800000 },
    { day: '۵', income: 3800000, outcome: 3200000 },
    { day: '۱۰', income: 5100000, outcome: 2900000 },
    { day: '۱۵', income: 4800000, outcome: 3500000 },
    { day: '۲۰', income: 5500000, outcome: 3800000 },
    { day: '۲۵', income: 5200000, outcome: 4200000 },
    { day: '۳۰', income: 5900000, outcome: 3900000 },
  ];

  // داده‌های نمونه
  const financialData = {
    revenue: {
      gross: '۱۵۸,۵۰۰,۰۰۰',
      net: '۱۴۲,۶۵۰,۰۰۰',
      tax: '۱۵,۸۵۰,۰۰۰'
    },
    expenses: {
      total: '۹۵,۱۰۰,۰۰۰',
      categories: [
        { name: 'تولید', amount: '۳۵,۰۰۰,۰۰۰', percentage: 37 },
        { name: 'بازاریابی', amount: '۲۲,۵۰۰,۰۰۰', percentage: 24 },
        { name: 'پرسنل', amount: '۱۸,۷۰۰,۰۰۰', percentage: 20 },
        { name: 'تحقیق و توسعه', amount: '۱۲,۳۰۰,۰۰۰', percentage: 13 },
        { name: 'سایر', amount: '۶,۶۰۰,۰۰۰', percentage: 6 }
      ]
    },
    transactions: {
      total: 1245,
      successful: 1180,
      failed: 45,
      refunded: 20
    },
    growth: {
      revenue: 12,
      profit: 8,
      expenses: -3
    }
  };

  return (
    <div className="space-y-6">
      {/* خلاصه مالی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">درآمد ناخالص</div>
              <div className="text-xl font-bold">{financialData.revenue.gross} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {financialData.growth.revenue > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{financialData.growth.revenue}٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <BanknotesIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">سود خالص</div>
              <div className="text-xl font-bold">{financialData.revenue.net} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {financialData.growth.profit > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{financialData.growth.profit}٪ نسبت به ماه گذشته</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <CreditCardIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm">هزینه‌ها</div>
              <div className="text-xl font-bold">{financialData.expenses.total} تومان</div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {financialData.growth.expenses > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4" />
            )}
            <span>{financialData.growth.expenses}٪ نسبت به ماه گذشته</span>
          </div>
        </div>
      </div>

      {/* انتخاب بازه زمانی */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">عملکرد مالی</h2>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button className={`px-3 py-1 rounded-md text-sm ${dateRange === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'}`}>
              هفتگی
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${dateRange === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'}`}>
              ماهانه
            </button>
          </div>
        </div>

        {/* نمودار مالی هفتگی/ماهانه */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {dateRange === 'week' ? (
              <BarChart data={weeklyFinancialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${(value / 1000000).toFixed(1)} میلیون`, '']}
                />
                <Legend />
                <Bar dataKey="revenue" name="درآمد" fill="#3b82f6" />
                <Bar dataKey="expense" name="هزینه" fill="#ef4444" />
                <Bar dataKey="profit" name="سود" fill="#10b981" />
              </BarChart>
            ) : (
              <AreaChart data={monthlyFinancialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${(value / 1000000).toFixed(1)} میلیون`, '']}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="درآمد" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="expense" name="هزینه" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Area type="monotone" dataKey="profit" name="سود" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* نمودارهای ترکیبی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نمودار توزیع هزینه‌ها */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">توزیع هزینه‌ها</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'سهم']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار جریان نقدینگی */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">جریان نقدینگی روزانه</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${(value / 1000000).toFixed(1)} میلیون`, '']}
                />
                <Legend />
                <Bar dataKey="income" name="ورودی" fill="#10b981" />
                <Bar dataKey="outcome" name="خروجی" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* دسته‌بندی هزینه‌ها */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">دسته‌بندی هزینه‌ها</h2>
        <div className="space-y-4">
          {financialData.expenses.categories.map((category, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-gray-500">{category.amount} تومان ({category.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialTab;