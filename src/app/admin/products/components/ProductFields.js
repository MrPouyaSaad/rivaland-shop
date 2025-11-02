// app/admin/products/components/ProductFields.js
'use client';

import { useState } from 'react';

const ProductFields = ({
  selectedCategory,
  categoryFields,
  fieldValues,
  handleFieldValueChange,
  formData,
  setFormData
}) => {
  if (categoryFields.length === 0) return null;

  // فیلدهایی که isVariant دارند (برای variants)
  const variantFields = categoryFields.filter(field => field.isVariant);
  // فیلدهای معمولی
  const normalFields = categoryFields.filter(field => !field.isVariant);

  // مدیریت variants
  const handleVariantChange = (variantIndex, field, value) => {
    const currentVariants = formData.variants || [];
    const variant = currentVariants[variantIndex] || { attributes: {} };
    
    const updatedVariant = {
      ...variant,
      attributes: {
        ...variant.attributes,
        [field.name]: value
      }
    };

    const updatedVariants = [...currentVariants];
    updatedVariants[variantIndex] = updatedVariant;
    
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const addVariant = () => {
    const currentVariants = formData.variants || [];
    const newVariant = {
      sku: `VARIANT-${Date.now()}`,
      price: formData.price || 0,
      stock: formData.stock || 0,
      attributes: {}
    };
    
    setFormData(prev => ({
      ...prev,
      variants: [...currentVariants, newVariant]
    }));
  };

  const removeVariant = (index) => {
    const currentVariants = formData.variants || [];
    const updatedVariants = currentVariants.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  return (
    <div className="space-y-8">
      {/* فیلدهای معمولی */}
      {normalFields.length > 0 && (
        <div className="md:col-span-2 bg-blue-50 p-5 rounded-xl">
          <h3 className="text-lg font-medium text-blue-800 mb-4">
            ویژگی‌های {selectedCategory?.name}
          </h3>
          <div className="space-y-5">
            {normalFields.map(field => (
              <div key={field.id} className="bg-white p-4 rounded-lg border border-blue-100">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  {field.name} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'boolean' ? (
                  <select
                    value={fieldValues[field.id] || ''}
                    onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={field.required}
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="true">بله</option>
                    <option value="false">خیر</option>
                  </select>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={fieldValues[field.id] || ''}
                    onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`مقدار ${field.name} را وارد کنید`}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variants (برای فیلدهای انتخابی) */}
      {variantFields.length > 0 && (
        <div className="md:col-span-2 bg-green-50 p-5 rounded-xl">
          <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center justify-between">
            <span>گزینه‌های محصول (Variant)</span>
            <button
              type="button"
              onClick={addVariant}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              + افزودن گزینه
            </button>
          </h3>
          
          <div className="space-y-4">
            {(formData.variants || []).map((variant, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-green-700">گزینه {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    حذف
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* فیلدهای variant */}
                  {variantFields.map(field => (
                    <div key={field.id}>
                      <label className="block text-xs text-gray-600 mb-1">
                        {field.name}
                      </label>
                      <input
                        type="text"
                        value={variant.attributes[field.name] || ''}
                        onChange={(e) => handleVariantChange(index, field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder={`مقدار ${field.name}`}
                      />
                    </div>
                  ))}
                  
                  {/* قیمت variant */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      قیمت (تومان)
                    </label>
                    <input
                      type="number"
                      value={variant.price || ''}
                      onChange={(e) => {
                        const currentVariants = formData.variants || [];
                        const updatedVariants = [...currentVariants];
                        updatedVariants[index] = {
                          ...updatedVariants[index],
                          price: e.target.value
                        };
                        setFormData(prev => ({ ...prev, variants: updatedVariants }));
                      }}
                      min="0"
                      step="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="قیمت"
                    />
                  </div>

                  {/* موجودی variant */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      موجودی
                    </label>
                    <input
                      type="number"
                      value={variant.stock || ''}
                      onChange={(e) => {
                        const currentVariants = formData.variants || [];
                        const updatedVariants = [...currentVariants];
                        updatedVariants[index] = {
                          ...updatedVariants[index],
                          stock: e.target.value
                        };
                        setFormData(prev => ({ ...prev, variants: updatedVariants }));
                      }}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="موجودی"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku || ''}
                      onChange={(e) => {
                        const currentVariants = formData.variants || [];
                        const updatedVariants = [...currentVariants];
                        updatedVariants[index] = {
                          ...updatedVariants[index],
                          sku: e.target.value
                        };
                        setFormData(prev => ({ ...prev, variants: updatedVariants }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="کد محصول"
                    />
                  </div>
                </div>

                {/* خلاصه variant */}
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>خلاصه:</strong> 
                  {Object.entries(variant.attributes).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: {value}
                    </span>
                  ))}
                  {variant.price && ` - قیمت: ${Number(variant.price).toLocaleString()} تومان`}
                  {variant.stock && ` - موجودی: ${variant.stock}`}
                </div>
              </div>
            ))}
          </div>

          {(formData.variants || []).length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg border border-dashed border-green-300">
              <p className="text-gray-500 mb-3">هنوز گزینه‌ای اضافه نکرده‌اید</p>
              <p className="text-sm text-gray-400">
                برای محصولاتی که گزینه‌های مختلف دارند (مانند رنگ، سایز) از این بخش استفاده کنید
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFields;