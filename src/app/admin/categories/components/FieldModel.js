import { XMarkIcon, PlusIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

const FieldModal = ({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
  newField,
  setNewField,
  newOption,
  setNewOption,
  addOption,
  removeOption,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">
            افزودن فیلد به <span className="font-bold">{categoryName}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Field Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام فیلد</label>
            <input
              type="text"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="مثلاً رنگ"
            />
          </div>

          {/* Field Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع فیلد</label>
            <select
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">متنی</option>
              <option value="number">عددی</option>
              <option value="select">انتخابی</option>
              <option value="checkbox">چک‌باکس</option>
            </select>
          </div>

          {/* Required */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newField.required}
              onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">ضروری باشد</label>
          </div>

          {/* Options (only for select) */}
          {newField.type === 'select' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">گزینه‌ها</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="مثلاً قرمز"
                />
                <button
                  type="button"
                  onClick={addOption}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  افزودن
                </button>
              </div>
              <ul className="space-y-1">
                {newField.options.map((option, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span>{option}</span>
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MinusCircleIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ذخیره فیلد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldModal;
