// app/admin/products/components/ProductImages.js
'use client';

import { PhotoIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';

const ProductImages = ({
  mode,
  formData,
  imagePreviews,
  existingImages,
  handleImagesChange,
  removeImage,
  removeExistingImage,
  setMainImage
}) => {
  const renderExistingImages = () => {
    if (existingImages.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">تصاویر موجود:</h4>
        <div className="flex flex-wrap gap-4">
          {existingImages.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image.url} 
                alt={`تصویر موجود ${index + 1}`} 
                className={`w-24 h-24 object-cover rounded-lg border-2 shadow-sm transition-all ${
                  image.url === formData.mainImage 
                    ? 'border-yellow-400 border-3 shadow-lg' 
                    : 'border-dashed border-green-200'
                }`}
                onError={(e) => {
                  console.error(`❌ Error loading image: ${image.url}`);
                  e.target.src = '/api/placeholder/96/96';
                }}
              />
              
              {image.url !== formData.mainImage && (
                <button
                  type="button"
                  onClick={() => setMainImage(image.url)}
                  className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-yellow-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="انتخاب به عنوان تصویر اصلی"
                >
                  <StarIcon className="w-3 h-3" />
                </button>
              )}
              
              {image.url === formData.mainImage && (
                <div className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md">
                  <StarIcon className="w-3 h-3 fill-white" />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {formData.mainImage && (
          <p className="text-xs text-yellow-600 mt-2 bg-yellow-50 p-2 rounded-lg">
            <StarIcon className="w-4 h-4 inline ml-1" />
            تصویر با حاشیه زرد، تصویر اصلی محصول است
          </p>
        )}
      </div>
    );
  };

  const renderNewImages = () => {
    if (imagePreviews.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">تصاویر جدید:</h4>
        <div className="flex flex-wrap gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img 
                src={preview.url} 
                alt={`پیش‌نمایش ${index + 1}`} 
                className={`w-24 h-24 object-cover rounded-lg border-2 shadow-sm transition-all ${
                  preview.url === formData.mainImage 
                    ? 'border-yellow-400 border-3 shadow-lg' 
                    : 'border-dashed border-blue-200'
                }`}
              />
              
              {preview.url !== formData.mainImage && (
                <button
                  type="button"
                  onClick={() => setMainImage(preview.url)}
                  className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-yellow-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="انتخاب به عنوان تصویر اصلی"
                >
                  <StarIcon className="w-3 h-3" />
                </button>
              )}
              
              {preview.url === formData.mainImage && (
                <div className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md">
                  <StarIcon className="w-3 h-3 fill-white" />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        تصاویر محصول (حداکثر ۵ تصویر)
      </label>
      
      {renderExistingImages()}
      {renderNewImages()}
      
      {(existingImages.length + imagePreviews.length) < 5 && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-all duration-200 bg-gray-50 hover:bg-blue-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold">برای آپلود کلیک کنید</span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (حداکثر 5MB)</p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImagesChange}
            multiple
            disabled={(existingImages.length + imagePreviews.length) >= 5}
          />
        </label>
      )}
      
      {(existingImages.length + imagePreviews.length) > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500">
            {existingImages.length} تصویر موجود + {imagePreviews.length} تصویر جدید
          </p>
          <p className="text-xs text-yellow-600 mt-1 bg-yellow-50 p-2 rounded-lg">
            <StarIcon className="w-4 h-4 inline ml-1" />
            برای انتخاب تصویر اصلی، روی آیکون ستاره در گوشه تصویر کلیک کنید
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductImages;