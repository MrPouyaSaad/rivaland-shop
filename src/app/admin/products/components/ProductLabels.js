// app/admin/products/components/ProductLabels.js
'use client';

import { TagIcon } from '@heroicons/react/24/outline';

const ProductLabels = ({ labels, formData, handleChange }) => {
  if (labels.length === 0) return null;

  return (
    <div className="md:col-span-2 bg-purple-50 p-5 rounded-xl">
      <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
        <TagIcon className="w-5 h-5 ml-2" />
        برچسب‌های محصول (چندتایی)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {labels.map(label => (
          <label key={label.id} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="labels"
              value={label.id}
              checked={formData.labels.includes(label.id)}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span 
              className="mr-2 text-gray-700 bg-purple-100 px-3 py-1 rounded-full text-sm flex items-center"
              style={{ borderLeft: `3px solid ${label.color || '#6b7280'}` }}
            >
              <span 
                className="inline-block w-3 h-3 rounded-full ml-2"
                style={{ backgroundColor: label.color || '#6b7280' }}
              ></span>
              {label.title}
            </span>
          </label>
        ))}
      </div>
      {formData.labels.length > 0 && (
        <p className="text-sm text-purple-600 mt-3">
          {formData.labels.length} برچسب انتخاب شده است
        </p>
      )}
    </div>
  );
};

export default ProductLabels;