// src/app/admin/categories/page.js (نسخه کامل با لودینگ)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiService } from '@/services/api';
import { useAsync } from './components/hooks/useAsync';

// کامپوننت‌های فرزند
import CategoriesHeader from './components/CategoriesHeader';
import CategoriesTable from './components/CategoriesTable';
import CategoryModal from './components/CategoryModal';
import FieldModal from './components/FieldModal';
import DeleteModal from './components/DeleteModal';
import Notification from './components/Notification';

const CategoriesPage = () => {
  const router = useRouter();
  
  // State مدیریت
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State فیلتر و جستجو
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' });
  
  // State مودال‌ها
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  
  // State داده‌ها
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryForField, setCategoryForField] = useState(null);
  
  // هوک‌های async
  const categoriesAsync = useAsync();
  const createCategoryAsync = useAsync();
  const updateCategoryAsync = useAsync();
  const deleteCategoryAsync = useAsync();
  const addFieldAsync = useAsync();
  const deleteFieldAsync = useAsync();

  const categoriesPerPage = 10;

  // دریافت دسته‌بندی‌ها
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    await categoriesAsync.execute(
      async () => {
        const response = await adminApiService.getAdminCategories();
        if (response.success) {
          setCategories(response.data || []);
        } else {
          throw new Error(response.message || 'خطا در دریافت دسته‌بندی‌ها');
        }
      },
      null,
      (error) => {
        setGlobalError(error.message);
      }
    );
  };

  // ایجاد دسته‌بندی جدید
  const handleCreateCategory = async (categoryData) => {
    await createCategoryAsync.execute(
      async () => {
        const response = await adminApiService.createCategory(categoryData);
        if (response.success) {
          setSuccess('دسته‌بندی با موفقیت ایجاد شد');
          setIsCreateModalOpen(false);
          await fetchCategories();
        } else {
          throw new Error(response.message || 'خطا در ایجاد دسته‌بندی');
        }
      },
      null,
      (error) => {
        setGlobalError(error.message);
      }
    );
  };

  // ویرایش دسته‌بندی
  const handleUpdateCategory = async (categoryData) => {
    await updateCategoryAsync.execute(
      async () => {
        const response = await adminApiService.updateCategory(selectedCategory.id, categoryData);
        if (response.success) {
          setSuccess('دسته‌بندی با موفقیت ویرایش شد');
          setIsEditModalOpen(false);
          setSelectedCategory(null);
          await fetchCategories();
        } else {
          throw new Error(response.message || 'خطا در ویرایش دسته‌بندی');
        }
      },
      null,
      (error) => {
        setGlobalError(error.message);
      }
    );
  };

  // حذف دسته‌بندی
  const handleDeleteCategory = async () => {
    await deleteCategoryAsync.execute(
      async () => {
        const response = await adminApiService.deleteCategory(categoryToDelete.id);
        if (response.success) {
          setSuccess('دسته‌بندی با موفقیت حذف شد');
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
          await fetchCategories();
        } else {
          throw new Error(response.message || 'خطا در حذف دسته‌بندی');
        }
      },
      null,
      (error) => {
        setGlobalError(error.message);
      }
    );
  };

  // افزودن فیلد جدید
  const handleAddField = async (categoryId, fieldData) => {
    await addFieldAsync.execute(
      async () => {
        const response = await adminApiService.addCategoryField(categoryId, fieldData);
        if (response.success) {
          setSuccess('فیلد با موفقیت اضافه شد');
          setIsFieldModalOpen(false);
          setCategoryForField(null);
          await fetchCategories();
        } else {
          throw new Error(response.message || 'خطا در اضافه کردن فیلد');
        }
      },
      null,
      (error) => {
        setGlobalError(error.message);
      }
    );
  };

  // حذف فیلد
  const handleDeleteField = async (fieldId) => {
  try {
    await deleteFieldAsync.execute(
      async () => {
        const response = await adminApiService.removeCategoryField(fieldId);
        if (!response.success) throw new Error(response.message || 'خطا در حذف فیلد');
        setSuccess('فیلد با موفقیت حذف شد');
        await fetchCategories();
      },
      null,
      (error) => {
        setGlobalError(error?.message || 'خطای ناشناخته');
      }
    );
  } catch (err) {
    setGlobalError(err?.message || 'خطای غیرمنتظره');
  }
};


  // مدیریت مرتب‌سازی
  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // بستن نوتیفیکیشن
  const clearNotification = () => {
    setGlobalError('');
    setSuccess('');
    categoriesAsync.clearError();
    createCategoryAsync.clearError();
    updateCategoryAsync.clearError();
    deleteCategoryAsync.clearError();
    addFieldAsync.clearError();
    deleteFieldAsync.clearError();
  };

  // باز کردن مودال‌ها
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const openFieldModal = (category) => {
    setCategoryForField(category);
    setIsFieldModalOpen(true);
  };

  if (categoriesAsync.loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <CategoriesHeader 
        onBack={() => router.back()}
        onAddCategory={() => setIsCreateModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCategories={categories.length}
      />

      {/* نوتیفیکیشن */}
      <Notification 
        error={globalError || categoriesAsync.error || createCategoryAsync.error || 
               updateCategoryAsync.error || deleteCategoryAsync.error || 
               addFieldAsync.error || deleteFieldAsync.error}
        success={success}
        onClose={clearNotification}
      />

      {/* جدول دسته‌بندی‌ها */}
      <CategoriesTable
        categories={categories}
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        currentPage={currentPage}
        itemsPerPage={categoriesPerPage}
        onSort={handleSort}
        onPageChange={setCurrentPage}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onAddField={handleAddField}
        onDeleteField={handleDeleteField}
        loading={deleteFieldAsync.loading}
      />

      {/* مودال ایجاد دسته‌بندی */}
      <CategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
        title="ایجاد دسته‌بندی جدید"
        submitText="ایجاد دسته‌بندی"
        loading={createCategoryAsync.loading}
        error={createCategoryAsync.error}
        onClearError={createCategoryAsync.clearError}
      />

      {/* مودال ویرایش دسته‌بندی */}
      {selectedCategory && (
        <CategoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
          }}
          onSubmit={handleUpdateCategory}
          category={selectedCategory}
          title="ویرایش دسته‌بندی"
          submitText="ذخیره تغییرات"
          loading={updateCategoryAsync.loading}
          error={updateCategoryAsync.error}
          onClearError={updateCategoryAsync.clearError}
        />
      )}

      {/* مودال افزودن فیلد */}
      {categoryForField && (
        <FieldModal
          isOpen={isFieldModalOpen}
          onClose={() => {
            setIsFieldModalOpen(false);
            setCategoryForField(null);
          }}
          onSubmit={(fieldData) => handleAddField(categoryForField.id, fieldData)}
          categoryName={categoryForField.name}
          loading={addFieldAsync.loading}
          error={addFieldAsync.error}
          onClearError={addFieldAsync.clearError}
        />
      )}

      {/* مودال حذف دسته‌بندی */}
      {categoryToDelete && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
          }}
          onConfirm={handleDeleteCategory}
          itemName={categoryToDelete.name}
          itemType="دسته‌بندی"
          loading={deleteCategoryAsync.loading}
          error={deleteCategoryAsync.error}
          onClearError={deleteCategoryAsync.clearError}
        />
      )}
    </div>
  );
};

export default CategoriesPage;