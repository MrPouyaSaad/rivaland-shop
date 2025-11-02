import { ArrowLeftIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CategoriesHeader = ({ 
  onBack, 
  onAddCategory, 
  searchTerm, 
  onSearchChange, 
  totalCategories 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* عنوان و دکمه بازگشت */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="بازگشت"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h1>
            <p className="text-gray-600 mt-1">مدیریت و سازماندهی دسته‌بندی‌های محصولات</p>
          </div>
        </div>

        {/* جستجو و آمار */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          {/* جستجو */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی دسته‌بندی..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full sm:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* آمار */}
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            {totalCategories} دسته‌بندی
          </div>

          {/* دکمه افزودن */}
          <button
            onClick={onAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <PlusIcon className="w-5 h-5" />
            افزودن دسته‌بندی
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesHeader;