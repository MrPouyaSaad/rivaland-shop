import { useState, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Notification from './Notification';

const CategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  category, 
  title, 
  submitText,
  loading = false,
  error = '',
  onClearError
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    imagePreview: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: null,
        imagePreview: category.image || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: null,
        imagePreview: ''
      });
    }
  }, [category, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('نام دسته‌بندی الزامی است');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    
    if (formData.description) {
      submitData.append('description', formData.description.trim());
    }
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* هدر مودال */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* نمایش خطا */}
          {error && (
            <Notification 
              error={error}
              onClose={onClearError}
            />
          )}

          {/* فیلد نام */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام دسته‌بندی *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="نام دسته‌بندی را وارد کنید"
            />
          </div>

          {/* فیلد توضیحات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="توضیحات اختیاری..."
            />
          </div>

          {/* آپلود تصویر */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصویر دسته‌بندی
            </label>
            
            {/* پیش‌نمایش تصویر */}
            {formData.imagePreview && (
              <div className="mb-4">
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={formData.imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      image: null, 
                      imagePreview: '' 
                    }))}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* آپلودر */}
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-colors duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'
            }`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {formData.imagePreview ? (
                  <CloudArrowUpIcon className="w-8 h-8 text-blue-500 mb-2" />
                ) : (
                  <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                )}
                <p className="text-sm text-gray-500 text-center">
                  {formData.imagePreview ? 'تغییر تصویر' : 'آپلود تصویر'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (حداکثر 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
            </label>
          </div>

          {/* دکمه‌های اقدام */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  در حال پردازش...
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;