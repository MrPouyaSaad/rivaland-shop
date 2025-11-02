// components/CategoriesTable.jsx (نسخه کامل و اصلاح شده)
import { useState } from 'react';
import Image from 'next/image';
import { 
  PencilIcon, 
  TrashIcon, 
  TagIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import FieldsManager from './FieldsManager';

const CategoriesTable = ({
  categories,
  searchTerm,
  sortConfig,
  currentPage,
  itemsPerPage,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onAddField,
  onDeleteField,
  loading = false // اضافه کردن prop loading
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  // فیلتر کردن دسته‌بندی‌ها بر اساس جستجو
  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // مرتب‌سازی دسته‌بندی‌ها
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const aValue = a[sortConfig.field] || '';
    const bValue = b[sortConfig.field] || '';
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = sortedCategories.slice(startIndex, startIndex + itemsPerPage);

  const toggleRowExpand = (categoryId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const SortIcon = ({ field }) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4" /> : 
      <ChevronDownIcon className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* هدر جدول */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600">
          <div 
            className="col-span-4 cursor-pointer hover:text-gray-800 transition-colors duration-200"
            onClick={() => onSort('name')}
          >
            <div className="flex items-center gap-1">
              نام دسته‌بندی
              <SortIcon field="name" />
            </div>
          </div>
          <div className="col-span-2 text-center">تصویر</div>
          <div className="col-span-2 text-center">وضعیت فیلدها</div>
          <div 
            className="col-span-2 text-center cursor-pointer hover:text-gray-800 transition-colors duration-200"
            onClick={() => onSort('createdAt')}
          >
            <div className="flex items-center justify-center gap-1">
              تاریخ ایجاد
              <SortIcon field="createdAt" />
            </div>
          </div>
          <div className="col-span-2 text-center">عملیات</div>
        </div>
      </div>

      {/* بدنه جدول */}
      <div className="divide-y divide-gray-200">
        {currentCategories.length > 0 ? (
          currentCategories.map((category) => (
            <div key={category.id} className="bg-white">
              {/* ردیف اصلی */}
              <div className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="grid grid-cols-12 gap-4 items-center">
                  
                  {/* نام دسته‌بندی */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleRowExpand(category.id)}
                        disabled={loading}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {expandedRows.has(category.id) ? (
                          <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TagIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {category.description || 'بدون توضیحات'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* تصویر */}
                  <div className="col-span-2 flex justify-center">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <PhotoIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* وضعیت فیلدها */}
                  <div className="col-span-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          category.fields?.length > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {category.fields?.length || 0} فیلد
                        </span>
                      </div>
                      {category.fields?.some(f => f.required) && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          دارای فیلد اجباری
                        </span>
                      )}
                    </div>
                  </div>

                  {/* تاریخ ایجاد */}
                  <div className="col-span-2 text-center">
                    <div className="text-sm text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(category.createdAt).toLocaleTimeString('fa-IR')}
                    </div>
                  </div>

                  {/* عملیات */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(category)}
                        disabled={loading}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="ویرایش دسته‌بندی"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(category)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="حذف دسته‌بندی"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ردیف توسعه یافته - مدیریت فیلدها */}
              {expandedRows.has(category.id) && (
                <div className="bg-gray-50 border-t border-gray-200">
                  <div className="p-6">
                    <FieldsManager
                      category={category}
                      onAddField={(fieldData) => onAddField(category.id, fieldData)}
                      
                      onDeleteField={(fieldId) => onDeleteField(fieldId, fieldId)}
                      loading={loading}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TagIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {categories.length === 0 
                ? 'هنوز دسته‌بندی‌ای ایجاد نشده است' 
                : 'دسته‌بندی‌ای با این مشخصات یافت نشد'
              }
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {categories.length === 0 
                ? 'برای شروع، اولین دسته‌بندی خود را ایجاد کنید' 
                : 'عبارت جستجو را تغییر دهید یا فیلترها را بازنشانی کنید'
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-700">
              نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, sortedCategories.length)} از {sortedCategories.length} دسته‌بندی
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
              >
                قبلی
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  className={`px-3 py-1 border rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
              >
                بعدی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesTable;