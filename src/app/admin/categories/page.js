'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowUpIcon,
  ArrowDownIcon,
  TagIcon,
  XMarkIcon,
  CheckIcon,
  ArrowLeftIcon,
  PhotoIcon,
  PlusCircleIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline';
import { adminApiService } from '@/services/api';


const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategoryForField, setSelectedCategoryForField] = useState(null);
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: null,
    fields: []
  });
  
  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    required: false,
    options: []
  });
  
  const [newOption, setNewOption] = useState('');
  
  const categoriesPerPage = 10;

  // دریافت دسته‌بندی‌ها از API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getCategories();
      
      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError('خطا در دریافت دسته‌بندی‌ها');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('خطا در دریافت دسته‌بندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  // اطمینان از اینکه categories همیشه یک آرایه است
  const safeCategories = Array.isArray(categories) ? categories : [];

  // فیلتر کردن دسته‌بندی‌ها
  const filteredCategories = safeCategories.filter(category => {
    if (!category || typeof category !== 'object') return false;
    
    return category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // مرتب‌سازی دسته‌بندی‌ها
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt) || '';
        bValue = new Date(b.createdAt) || '';
        break;
      default:
        aValue = a[sortField] || '';
        bValue = b[sortField] || '';
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // تغییر مرتب‌سازی
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // نمایش آیکون مرتب‌سازی
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUpIcon className="w-4 h-4" /> : 
      <ArrowDownIcon className="w-4 h-4" />;
  };

  // ایجاد دسته‌بندی جدید
  const handleCreateCategory = async (e) => {
  e.preventDefault();
  setCreatingCategory(true);
  setError('');
  
  try {
    const response = await adminApiService.createCategory(newCategory);
    
    if (response.success) {
      setSuccess('دسته‌بندی با موفقیت ایجاد شد');
      setNewCategory({ name: '', image: null, fields: [] });
      fetchCategories();
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError('خطا در ایجاد دسته‌بندی: ' + (response.message || 'خطای ناشناخته'));
    }
  } catch (err) {
    console.error('Error creating category:', err);
    setError('خطا در ایجاد دسته‌بندی: ' + (err.message || 'خطای ناشناخته'));
  } finally {
    setCreatingCategory(false);
  }
};

  // ویرایش دسته‌بندی
  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    try {
      const response = await adminApiService.updateCategory(editingCategory.id, editingCategory);
      
      if (response.success) {
        setSuccess('دسته‌بندی با موفقیت ویرایش شد');
        setIsEditModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError('خطا در ویرایش دسته‌بندی: ' + (response.message || 'خطای ناشناخته'));
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError('خطا در ویرایش دسته‌بندی: ' + (err.message || 'خطای ناشناخته'));
    }
  };

  // حذف دسته‌بندی
  const handleDeleteCategory = async () => {
    try {
      const response = await adminApiService.deleteCategory(categoryToDelete.id);
      
      if (response.success) {
        setSuccess('دسته‌بندی با موفقیت حذف شد');
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError('خطا در حذف دسته‌بندی: ' + (response.message || 'خطای ناشناخته'));
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('خطا در حذف دسته‌بندی: ' + (err.message || 'خطای ناشناخته'));
    }
  };

 // لیست نوع‌های مجاز
const FIELD_TYPES = ["string", "number", "boolean", "select", "multi-select"];

// تابع برای اضافه کردن فیلد
// تابع برای اضافه کردن فیلد - این تابع را جایگزین نسخه قبلی کنید
const handleAddField = async (selectedCategoryId, fieldData) => {
  try {
    // بررسی نوع فیلد
    const validTypes = ['string', 'number', 'boolean', 'select', 'multi-select'];
    if (!validTypes.includes(fieldData.type)) {
      throw new Error(`نوع فیلد معتبر نیست. انواع مجاز: ${validTypes.join(", ")}`);
    }

    // اگر نوع select یا multi-select است، مطمئن شو options موجوده
    if (
      (fieldData.type === 'select' || fieldData.type === 'multi-select') &&
      (!Array.isArray(fieldData.options) || fieldData.options.length === 0)
    ) {
      throw new Error("برای نوع select یا multi-select باید گزینه‌ها مشخص شوند.");
    }

    // ساخت آبجکت نهایی برای ارسال
    const newField = {
      name: fieldData.name,
      type: fieldData.type,
      required: fieldData.required || false,
      options: fieldData.options || [],
    };

    // صدا زدن adminApiService
    const response = await adminApiService.addCategoryField(selectedCategoryId, newField);
    
    if (response.success) {
      setSuccess('فیلد با موفقیت اضافه شد');
      setIsAddFieldModalOpen(false);
      setNewField({ name: '', type: 'string', required: false, options: [] });
      fetchCategories();
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError('خطا در اضافه کردن فیلد: ' + (response.message || 'خطای ناشناخته'));
    }

    return response;
  } catch (error) {
    console.error("خطا در اضافه کردن فیلد:", error.message);
    setError('خطا در اضافه کردن فیلد: ' + error.message);
    throw error;
  }
};


  // حذف فیلد
  const handleDeleteField = async (fieldId) => {
    try {
      const response = await adminApiService.deleteCategoryField(fieldId);
      
      if (response.success) {
        setSuccess('فیلد با موفقیت حذف شد');
        fetchCategories();
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError('خطا در حذف فیلد: ' + (response.message || 'خطای ناشناخته'));
      }
    } catch (err) {
      console.error('Error deleting field:', err);
      setError('خطا در حذف فیلد: ' + (err.message || 'خطای ناشناخته'));
    }
  };

  // افزودن گزینه به فیلد
  const addOption = () => {
    if (newOption.trim()) {
      setNewField({
        ...newField,
        options: [...newField.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  // حذف گزینه از فیلد
  const removeOption = (index) => {
    const updatedOptions = [...newField.options];
    updatedOptions.splice(index, 1);
    setNewField({
      ...newField,
      options: updatedOptions
    });
  };

  // باز کردن مودال ویرایش
  const openEditModal = (category) => {
    setEditingCategory({ ...category });
    setIsEditModalOpen(true);
  };

  // باز کردن مودال حذف
  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // باز کردن مودال افزودن فیلد
  const openAddFieldModal = (category) => {
    setSelectedCategoryForField(category);
    setIsAddFieldModalOpen(true);
  };

  // مدیریت تغییر تصویر
  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditingCategory({ ...editingCategory, image: file });
      } else {
        setNewCategory({ ...newCategory, image: file });
      }
    }
  };

 // نمایش تصویر
const renderImagePreview = (image, isEdit = false) => {
  if (isEdit && editingCategory?.image) {
    if (typeof editingCategory.image === 'string') {
      return (
        <Image 
          src={editingCategory.image} 
          alt="Preview" 
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-lg" 
        />
      );
    } else {
      return (
        <Image 
          src={URL.createObjectURL(editingCategory.image)} 
          alt="Preview" 
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-lg" 
        />
      );
    }
  } else if (!isEdit && newCategory.image) {
    return (
      <Image 
        src={URL.createObjectURL(newCategory.image)} 
        alt="Preview" 
        width={64}
        height={64}
        className="w-16 h-16 object-cover rounded-lg" 
      />
    );
  }
  return <PhotoIcon className="w-8 h-8 text-gray-400" />;
};

  // محاسبه pagination
  const totalPages = Math.ceil(sortedCategories.length / categoriesPerPage);
  const startIndex = (currentPage - 1) * categoriesPerPage;
  const currentCategories = sortedCategories.slice(startIndex, startIndex + categoriesPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">در حال دریافت دسته‌بندی‌ها...</div>
      </div>
    );
  }

  return (
    <div>
      {/* هدر و دکمه‌ها */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="بازگشت"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت دسته‌بندی‌ها</h1>
        </div>
      </div>

      {/* نمایش پیام‌های خطا و موفقیت */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
          {error}
          <button onClick={() => setError('')} className="float-left">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
          {success}
          <button onClick={() => setSuccess('')} className="float-left">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* فرم ایجاد دسته‌بندی جدید */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">افزودن دسته‌بندی جدید</h2>
        <form onSubmit={handleCreateCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="نام دسته‌بندی"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تصویر دسته‌بندی</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {renderImagePreview()}
                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
              />
            </label>
          </div>
          <div className="flex items-end">
           <button
  type="submit"
  disabled={creatingCategory}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center gap-2"
>
  {creatingCategory ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      در حال ایجاد...
    </>
  ) : (
    <>
      <PlusIcon className="w-5 h-5" />
      افزودن دسته‌بندی
    </>
  )}
</button>
          </div>
        </form>
      </div>

      {/* فیلتر جستجو */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">جستجوی دسته‌بندی</label>
            <input
              type="text"
              placeholder="نام دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              {filteredCategories.length} دسته‌بندی یافت شد
            </p>
          </div>
        </div>
      </div>

      {/* جدول دسته‌بندی‌ها */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th 
                  className="px-6 py-3 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    نام دسته‌بندی
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">تصویر</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">فیلدها</th>
                <th 
                  className="px-6 py-3 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    تاریخ ایجاد
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <TagIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name || 'بدون نام'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                     {category.image ? (
  <Image 
    src={category.image} 
    alt={category.name} 
    width={48}  // اضافه شد
    height={48} // اضافه شد
    className="w-12 h-12 object-cover rounded-lg"
  />
) : (
  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
    <PhotoIcon className="w-6 h-6 text-gray-400" />
  </div>
)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {category.fields && category.fields.length > 0 ? (
                          category.fields.map((field) => (
                            <span key={field.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              {field.name}
                              <button 
                                onClick={() => handleDeleteField(field.id)}
                                className="text-red-500 hover:text-red-700"
                                title="حذف فیلد"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">بدون فیلد</span>
                        )}
                        <button
                          onClick={() => openAddFieldModal(category)}
                          className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1"
                          title="افزودن فیلد"
                        >
                          <PlusCircleIcon className="w-4 h-4" />
                          افزودن
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="ویرایش"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {safeCategories.length === 0 ? 'هنوز دسته‌بندی‌ای ایجاد نشده است' : 'دسته‌بندی‌ای با این مشخصات یافت نشد'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-700">
                نمایش {startIndex + 1} تا {Math.min(startIndex + categoriesPerPage, sortedCategories.length)} از {sortedCategories.length} دسته‌بندی
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  قبلی
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  بعدی
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* مودال ویرایش دسته‌بندی */}
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">ویرایش دسته‌بندی</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditCategory} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">تصویر دسته‌بندی</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {renderImagePreview(null, true)}
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, true)}
                  />
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* مودال افزودن فیلد */}
{isAddFieldModalOpen && selectedCategoryForField && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            افزودن فیلد به {selectedCategoryForField.name}
          </h3>
          <button
            onClick={() => {
              setIsAddFieldModalOpen(false);
              setNewField({ name: '', type: 'string', required: false, options: [] });
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddField(selectedCategoryForField.id, newField);
        }}
        className="p-6"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">نام فیلد</label>
          <input
            type="text"
            value={newField.name}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">نوع فیلد</label>
          <select
            value={newField.type}
            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="string">متنی</option>
            <option value="number">عددی</option>
            <option value="boolean">چک باکس</option>
            <option value="select">انتخابی</option>
            <option value="multi-select">چندانتخابی</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newField.required}
              onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">فیلد اجباری</span>
          </label>
        </div>

        {["select", "multi-select"].includes(newField.type) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">گزینه‌ها</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="افزودن گزینه جدید"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addOption}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {newField.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                  <span>{option}</span>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <MinusCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setIsAddFieldModalOpen(false);
              setNewField({ name: '', type: 'string', required: false, options: [] });
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            افزودن فیلد
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default CategoriesPage;


