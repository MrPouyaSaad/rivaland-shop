// app/admin/products/components/ProductForm.js
'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ProductImages from './ProductImages';
import ProductFields from './ProductFields';
import ProductLabels from './ProductLabels';
import ProductDiscount from './ProductDiscount';
// import ProductVariants from './ProductVariants';

const ProductForm = ({ 
  mode, 
  productId,
  categories,
  labels,
  loading,
  categoriesLoading,
  labelsLoading,
  error,
  formData,
  imagePreviews,
  existingImages,
  selectedCategory,
  categoryFields,
  fieldValues,
  handleSubmit,
  handleChange,
  handleFieldValueChange,
  handleImagesChange,
  removeImage,
  removeExistingImage,
  setMainImage,
  setFormData // اضافه کردن setFormData
}) => {
  // توابع مدیریت variants
  const addVariant = () => {
    const currentVariants = formData.variants || [];
    const newVariant = {
      id: Date.now().toString(),
      sku: `VARIANT-${Date.now()}`,
      price: formData.price || 0,
      stock: formData.stock || 0,
      attributes: {}
    };
    
    setFormData(prev => ({
      ...prev,
      variants: [...currentVariants, newVariant],
      hasVariants: true
    }));
  };

  const updateVariant = (variantIndex, field, value) => {
    const currentVariants = formData.variants || [];
    const updatedVariants = [...currentVariants];
    
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const updateVariantAttribute = (variantIndex, attributeName, value) => {
    const currentVariants = formData.variants || [];
    const updatedVariants = [...currentVariants];
    
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      attributes: {
        ...updatedVariants[variantIndex].attributes,
        [attributeName]: value
      }
    };
    
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const removeVariant = (index) => {
    const currentVariants = formData.variants || [];
    const updatedVariants = currentVariants.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants,
      hasVariants: updatedVariants.length > 0
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* هدر */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/products"
            className="p-2 text-gray-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:text-blue-600"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {mode === 'edit' ? 'ویرایش محصول' : 'افزودن محصول جدید'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'edit' ? 'اطلاعات محصول را ویرایش کنید' : 'اطلاعات محصول جدید را وارد کنید'}
            </p>
          </div>
        </div>

        {/* نمایش خطا یا موفقیت */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl ${
            error.startsWith('success:') 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {error.startsWith('success:') ? error.substring(8) : error}
          </div>
        )}

        {/* فرم */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* بخش اطلاعات اصلی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* نام محصول */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام محصول <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="نام محصول را وارد کنید"
                />
              </div>

              {/* قیمت پایه */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت پایه (تومان) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.hasVariants ? 'قیمت پایه برای محصولات بدون واریانت' : 'قیمت اصلی محصول'}
                </p>
              </div>

              {/* موجودی پایه */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موجودی پایه <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.hasVariants ? 'موجودی پایه برای محصولات بدون واریانت' : 'موجودی اصلی محصول'}
                </p>
              </div>

              {/* دسته‌بندی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  disabled={categoriesLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categoriesLoading && (
                  <p className="text-xs text-blue-500 mt-1">در حال دریافت دسته‌بندی‌ها...</p>
                )}
              </div>

              {/* لیبل اصلی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  لیبل اصلی
                </label>
                <select
                  name="labelId"
                  value={formData.labelId}
                  onChange={handleChange}
                  disabled={labelsLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                >
                  <option value="">انتخاب لیبل</option>
                  {labels.map(label => (
                    <option key={label.id} value={label.id}>
                      {label.title}
                    </option>
                  ))}
                </select>
                {labelsLoading && (
                  <p className="text-xs text-blue-500 mt-1">در حال دریافت لیبل‌ها...</p>
                )}
              </div>

              {/* وضعیت محصول */}
              <div className="md:col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">محصول فعال است</span>
                </label>
                <span className="text-xs text-gray-500">
                  محصولات غیرفعال برای کاربران نمایش داده نمی‌شوند
                </span>
              </div>
            </div>

            {/* تخفیف */}
            <ProductDiscount 
              formData={formData} 
              handleChange={handleChange} 
            />

            {/* ویژگی‌های محصول */}
            <ProductFields
              selectedCategory={selectedCategory}
              categoryFields={categoryFields}
              fieldValues={fieldValues}
              handleFieldValueChange={handleFieldValueChange}
              formData={formData}
              setFormData={setFormData}
            />

            {/* واریانت‌ها
            <ProductVariants
              categoryFields={categoryFields}
              variants={formData.variants || []}
              addVariant={addVariant}
              updateVariant={updateVariant}
              updateVariantAttribute={updateVariantAttribute}
              removeVariant={removeVariant}
            /> */}

            {/* لیبل‌های چندتایی */}
            <ProductLabels
              labels={labels}
              formData={formData}
              handleChange={handleChange}
            />

            {/* تصاویر محصول */}
            <ProductImages
              mode={mode}
              formData={formData}
              imagePreviews={imagePreviews}
              existingImages={existingImages}
              handleImagesChange={handleImagesChange}
              removeImage={removeImage}
              removeExistingImage={removeExistingImage}
              setMainImage={setMainImage}
            />

            {/* توضیحات محصول */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات محصول
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="توضیحات کامل محصول را در اینجا بنویسید..."
              />
            </div>

            {/* دکمه‌های اقدام */}
            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || categoriesLoading || labelsLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {mode === 'edit' ? 'در حال ویرایش...' : 'در حال ایجاد...'}
                  </>
                ) : (
                  mode === 'edit' ? 'ویرایش محصول' : 'ایجاد محصول'
                )}
              </button>
              
              <Link
                href="/admin/products"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 border border-gray-300"
              >
                انصراف
              </Link>
            </div>
          </form>
        </div>

        {/* راهنما */}
        <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            {mode === 'edit' ? 'راهنمای ویرایش محصول' : 'راهنمای افزودن محصول'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <ul className="space-y-2 list-disc pr-5">
              <li>فیلدهای دارای علامت <span className="text-red-500">*</span> اجباری هستند</li>
              <li>قیمت و موجودی پایه برای محصولات بدون واریانت استفاده می‌شود</li>
              <li>برای محصولات با گزینه‌های مختلف (مثل رنگ، سایز) از بخش واریانت‌ها استفاده کنید</li>
              <li>هر واریانت می‌تواند قیمت و موجودی جداگانه داشته باشد</li>
            </ul>
            <ul className="space-y-2 list-disc pr-5">
              <li>حداکثر ۵ تصویر برای هر محصول قابل آپلود است</li>
              <li>حتماً یک تصویر اصلی انتخاب کنید</li>
              <li>ویژگی‌ها بر اساس دسته‌بندی انتخاب شده نمایش داده می‌شوند</li>
              <li>می‌توانید یک لیبل اصلی و چندین برچسب انتخاب کنید</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;