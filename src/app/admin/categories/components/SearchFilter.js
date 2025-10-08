import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchFilter = ({ searchTerm, setSearchTerm, filteredCount }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجوی دسته‌بندی..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Count */}
      <div className="text-sm text-gray-600">
        {filteredCount} دسته‌بندی یافت شد
      </div>
    </div>
  );
};

export default SearchFilter;
