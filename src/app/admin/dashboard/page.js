// app/admin/dashboard/page.js
'use client';
import { withAdminAuth } from '@/components/WithAdminAuth';
import { useState } from 'react';
import {
  ChartBarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TagIcon,
  GlobeAltIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  FunnelIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  UsersIcon,
  MegaphoneIcon,
  BuildingStorefrontIcon,
  ChartPieIcon,
  BanknotesIcon,
  TruckIcon,
  ShoppingBagIcon,
  CubeTransparentIcon,
  ArrowsRightLeftIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

// کامپوننت‌های مختلف برای هر تب
import OverviewTab from './components/OverviewTab';
import FinancialTab from './components/FinancialTab';
import SalesTab from './components/SalesTab';
import CustomersTab from './components/CustomersTab';
import MarketingTab from './components/MarketingTab';
import InventoryTab from './components/InventoryTab';

const DashboardPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // تابع برای رندر محتوای تب فعال
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab dateRange={dateRange} />;
      case 'financial':
        return <FinancialTab dateRange={dateRange} />;
      case 'sales':
        return <SalesTab dateRange={dateRange} />;
      case 'customers':
        return <CustomersTab dateRange={dateRange} />;
      case 'marketing':
        return <MarketingTab dateRange={dateRange} />;
      case 'inventory':
        return <InventoryTab dateRange={dateRange} />;
      default:
        return <OverviewTab dateRange={dateRange} />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">داشبورد مدیریتی</h1>
        
        <div className="flex items-center gap-3">
          {/* انتخاب بازه زمانی */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm"
            >
              <option value="day">امروز</option>
              <option value="week">هفته جاری</option>
              <option value="month">ماه جاری</option>
              <option value="year">سال جاری</option>
            </select>
          </div>
          
          {/* دکمه فیلتر */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-sm">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            فیلتر
          </button>

          {/* دکمه خروجی گزارش */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <DocumentChartBarIcon className="w-5 h-5" />
            خروجی گزارش
          </button>
        </div>
      </div>

      {/* تب‌های اصلی */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <ChartBarIcon className="w-5 h-5" />
          نمای کلی
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'financial' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <BanknotesIcon className="w-5 h-5" />
          گزارشات مالی
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'sales' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <ShoppingBagIcon className="w-5 h-5" />
          گزارشات فروش
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'customers' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <UsersIcon className="w-5 h-5" />
          گزارشات مشتریان
        </button>
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'marketing' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <MegaphoneIcon className="w-5 h-5" />
          گزارشات بازاریابی
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'inventory' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <CubeTransparentIcon className="w-5 h-5" />
          گزارشات انبار
        </button>
      </div>

      {/* محتوای تب فعال */}
      {renderActiveTab()}
    </div>
  );
};

export default withAdminAuth(DashboardPage);