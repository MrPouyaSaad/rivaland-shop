const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  startIndex,
  categoriesPerPage,
  sortedCategories,
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Info */}
      <div className="text-sm text-gray-600">
        نمایش {startIndex + 1} تا{" "}
        {Math.min(startIndex + categoriesPerPage, sortedCategories.length)} از{" "}
        {sortedCategories.length} دسته‌بندی
      </div>

      {/* Page Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
        >
          قبلی
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded-lg ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default Pagination;
