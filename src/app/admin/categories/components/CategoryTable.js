import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon 
} from '@heroicons/react/24/outline';

const CategoryTable = ({
  categories,
  sortField,
  sortDirection,
  handleSort,
  SortIcon,
  openEditModal,
  openDeleteModal,
  openAddFieldModal,
  handleDeleteField,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th 
              className="px-4 py-3 cursor-pointer" 
              onClick={() => handleSort('name')}
            >
              نام دسته‌بندی
              <SortIcon field="name" />
            </th>
            <th className="px-4 py-3">تصویر</th>
            <th 
              className="px-4 py-3 cursor-pointer"
              onClick={() => handleSort('createdAt')}
            >
              تاریخ ایجاد
              <SortIcon field="createdAt" />
            </th>
            <th className="px-4 py-3">فیلدها</th>
            <th className="px-4 py-3 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                دسته‌بندی‌ای یافت نشد
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {category.name}
                </td>
                <td className="px-4 py-3">
                  {category.image ? (
                    <img
                      src={typeof category.image === 'string' ? category.image : URL.createObjectURL(category.image)}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString('fa-IR')
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <ul className="list-disc list-inside space-y-1">
                    {Array.isArray(category.fields) && category.fields.length > 0 ? (
                      category.fields.map((field) => (
                        <li key={field.id || field.name} className="flex justify-between items-center">
                          <span>{field.name}</span>
                          <button
                            onClick={() => handleDeleteField(category.id, field.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            حذف
                          </button>
                        </li>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">هیچ فیلدی ندارد</span>
                    )}
                  </ul>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="ویرایش"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(category)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="حذف"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openAddFieldModal(category)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="افزودن فیلد"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
