import { useState } from 'react';
import { 
  XMarkIcon, 
  PlusIcon,
  CheckIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import Notification from './Notification';

const FieldModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categoryName,
  loading = false,
  error = '',
  onClearError
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'string',
    required: false
  });

  const fieldTypes = {
    string: { 
      label: 'متنی', 
      color: 'blue', 
      icon: '📝',
      description: 'مقدار متنی ساده (مثل: جنس، برند)'
    },
    number: { 
      label: 'عددی', 
      color: 'green', 
      icon: '🔢',
      description: 'مقدار عددی (مثل: وزن، ابعاد)'
    },
    boolean: { 
      label: 'صحیح/غلط', 
      color: 'purple', 
      icon: '⚡',
      description: 'مقدار بولی (مثل: موجود بودن، گارانتی)'
    },
    select: { 
      label: 'انتخابی', 
      color: 'orange', 
      icon: '🎨',
      description: 'انتخاب از گزینه‌ها (مثل: رنگ) - گزینه‌ها در سطح محصول تعریف می‌شوند'
    },
    'multi-select': { 
      label: 'چند انتخابی', 
      color: 'red', 
      icon: '🏷️',
      description: 'انتخاب چند گزینه (مثل: ویژگی‌ها) - گزینه‌ها در سطح محصول تعریف می‌شوند'
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'string',
      required: false
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('نام فیلد الزامی است');
      return;
    }

    await onSubmit(formData);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* هدر مودال */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">افزودن فیلد جدید</h2>
            <p className="text-sm text-gray-600 mt-1">دسته‌بندی: {categoryName}</p>
          </div>
          <button
            onClick={handleClose}
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

          {/* نام فیلد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام فیلد *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="نام فیلد را وارد کنید"
            />
          </div>

          {/* نوع فیلد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع فیلد *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Object.entries(fieldTypes).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* فیلد اجباری */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                disabled={loading}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
              />
              <span className="text-sm font-medium text-gray-700">فیلد اجباری</span>
            </label>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
              کاربر باید این فیلد را پر کند
            </span>
          </div>

          {/* اطلاعات نوع فیلد */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2 text-sm text-blue-700">
              <InformationCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{fieldTypes[formData.type]?.label}: </span>
                <span>{fieldTypes[formData.type]?.description}</span>
              </div>
            </div>
          </div>

          {/* دکمه‌های اقدام */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
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
                <>
                  <CheckIcon className="w-4 h-4" />
                  افزودن فیلد
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldModal;