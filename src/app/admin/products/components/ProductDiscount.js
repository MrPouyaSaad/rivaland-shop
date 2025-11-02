// app/admin/products/components/ProductDiscount.js
'use client';

const ProductDiscount = ({ formData, handleChange }) => {
  return (
    <div className="md:col-span-2 bg-gray-50 p-5 rounded-xl">
      <h3 className="text-lg font-medium text-gray-800 mb-4">تخفیف (اختیاری)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع تخفیف
          </label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="percent">درصدی (%)</option>
            <option value="amount">مبلغی (تومان)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مقدار تخفیف
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={formData.discountType === 'percent' ? 'درصد تخفیف' : 'مبلغ تخفیف'}
          />
        </div>
      </div>
      {formData.discount && formData.discount !== '' && parseFloat(formData.discount) > 0 && (
        <p className="text-sm text-blue-600 mt-3 bg-blue-50 p-2 rounded-lg">
          تخفیف به صورت {formData.discountType === 'percent' ? 'درصدی' : 'مبلغی'} اعمال خواهد شد
        </p>
      )}
    </div>
  );
};

export default ProductDiscount;