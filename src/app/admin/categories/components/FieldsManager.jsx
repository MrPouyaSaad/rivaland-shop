// components/FieldsManager.jsx (نسخه اصلاح شده با قابلیت variant)
import { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const FieldsManager = ({ category, onAddField, onDeleteField, loading = false }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    type: 'string',
    required: false,
    isVariant: false // اضافه کردن این فیلد
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

  const handleAddField = async () => {
    if (!newField.name.trim()) {
      alert('نام فیلد الزامی است');
      return;
    }

    await onAddField(newField);
    setNewField({ name: '', type: 'string', required: false, isVariant: false });
    setShowAddForm(false);
  };

  const getFieldStats = () => {
    const stats = {
      total: category.fields?.length || 0,
      required: category.fields?.filter(f => f.required)?.length || 0,
      variant: category.fields?.filter(f => f.isVariant)?.length || 0,
      byType: {}
    };

    category.fields?.forEach(field => {
      stats.byType[field.type] = (stats.byType[field.type] || 0) + 1;
    });

    return stats;
  };

  const stats = getFieldStats();

  const getFieldDescription = (field) => {
    const baseDesc = fieldTypes[field.type]?.description;
    
    let variantDesc = '';
    if (field.isVariant) {
      variantDesc = ' - این فیلد برای ایجاد گزینه‌های محصول (Variant) استفاده می‌شود';
    }
    
    if (['select', 'multi-select'].includes(field.type)) {
      return `${baseDesc}${variantDesc} - گزینه‌ها برای هر محصول جداگانه تعریف می‌شوند`;
    }
    
    return baseDesc + variantDesc;
  };

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
      {/* هدر */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">مدیریت فیلدهای دسته‌بندی</h3>
            <p className="text-sm text-gray-600 mt-1">
              فیلدها مشخص می‌کنند محصولات این دسته‌بندی چه ویژگی‌هایی دارند
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              📊 {stats.total} فیلد
            </span>
            {stats.required > 0 && (
              <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                ⚠️ {stats.required} اجباری
              </span>
            )}
            {stats.variant > 0 && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                🎨 {stats.variant} واریانت
              </span>
            )}
          </div>
        </div>
      </div>

      {/* آمار کلی */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <div className="text-xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-blue-700">کل فیلدها</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 border border-green-200">
            <div className="text-xl font-bold text-green-600">
              {stats.total - stats.required}
            </div>
            <div className="text-xs text-green-700">اختیاری</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3 border border-red-200">
            <div className="text-xl font-bold text-red-600">{stats.required}</div>
            <div className="text-xs text-red-700">اجباری</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
            <div className="text-xl font-bold text-purple-600">
              {Object.keys(stats.byType).length}
            </div>
            <div className="text-xs text-purple-700">انواع مختلف</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
            <div className="text-xl font-bold text-orange-600">{stats.variant}</div>
            <div className="text-xs text-orange-700">واریانت</div>
          </div>
        </div>
      </div>

      {/* دکمه افزودن فیلد */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                در حال پردازش...
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                افزودن فیلد جدید
              </>
            )}
          </button>
        ) : (
          <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">فیلد جدید</h4>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewField({ name: '', type: 'string', required: false, isVariant: false });
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* فرم افزودن فیلد */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام فیلد *
                  </label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="مثال: رنگ، سایز، جنس، وزن"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع فیلد *
                  </label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {Object.entries(fieldTypes).map(([value, config]) => (
                      <option key={value} value={value}>
                        {config.icon} {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* تنظیمات فیلد */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {/* فیلد اجباری */}
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">فیلد اجباری</span>
                    <span className="text-xs text-gray-500">کاربر باید این فیلد را پر کند</span>
                  </div>
                </label>

                {/* فیلد واریانت */}
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={newField.isVariant || false}
                    onChange={(e) => setNewField(prev => ({ ...prev, isVariant: e.target.checked }))}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">فیلد واریانت</span>
                    <span className="text-xs text-gray-500">برای ایجاد گزینه‌های محصول</span>
                  </div>
                </label>
              </div>

              {/* اطلاعات نوع فیلد */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2 text-sm text-blue-700">
                  <InformationCircleIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{fieldTypes[newField.type]?.label}: </span>
                    <span>{getFieldDescription({ type: newField.type, isVariant: newField.isVariant })}</span>
                    
                    {/* نکات مهم */}
                    <div className="mt-2 space-y-1">
                      {newField.isVariant && (
                        <div className="p-2 bg-white rounded border border-green-300 text-xs text-green-700">
                          🎨 <strong>فیلد واریانت:</strong> این فیلد برای ایجاد گزینه‌های مختلف محصول (مانند رنگ، سایز) استفاده می‌شود
                        </div>
                      )}
                      
                      {['select', 'multi-select'].includes(newField.type) && (
                        <div className="p-2 bg-white rounded border border-blue-300 text-xs">
                          💡 <strong>توجه:</strong> گزینه‌های این فیلد در فرم محصول تعریف می‌شوند
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* دکمه‌های اقدام */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewField({ name: '', type: 'string', required: false, isVariant: false });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  انصراف
                </button>
                <button
                  onClick={handleAddField}
                  disabled={!newField.name.trim() || loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <CheckIcon className="w-4 h-4" />
                  )}
                  {loading ? 'در حال افزودن...' : 'افزودن فیلد'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* لیست فیلدهای موجود */}
      <div className="p-4">
        {category.fields?.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-lg mb-4">فیلدهای تعریف شده</h4>
            
            {category.fields.map((field) => (
              <div
                key={field.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                      field.isVariant 
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200' 
                        : `bg-${fieldTypes[field.type]?.color}-100 border border-${fieldTypes[field.type]?.color}-200`
                    }`}>
                      {field.isVariant ? <CubeIcon className="w-6 h-6 text-green-600" /> : fieldTypes[field.type]?.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-semibold text-gray-900 text-lg">{field.name}</h5>
                        
                        <span className={`bg-${fieldTypes[field.type]?.color}-100 text-${fieldTypes[field.type]?.color}-800 text-sm px-3 py-1 rounded-full`}>
                          {fieldTypes[field.type]?.label}
                        </span>

                        {field.required && (
                          <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                            اجباری
                          </span>
                        )}

                        {field.isVariant && (
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                            <CubeIcon className="w-3 h-3" />
                            واریانت
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        {getFieldDescription(field)}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">شناسه:</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                            {field.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium">ایجاد:</span>
                          <span>{new Date(field.createdAt).toLocaleDateString('fa-IR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => console.log('Edit field:', field.id)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      title="ویرایش فیلد (به زودی)"
                      disabled
                    >
                      <PencilIcon className="w-4 h-4 opacity-50" />
                    </button>
                    
                    <button
                      onClick={() => onDeleteField(field.id)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="حذف فیلد"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <TrashIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">هنوز فیلدی تعریف نکرده‌اید</h4>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              فیلدها مشخص می‌کنند محصولات این دسته‌بندی چه ویژگی‌هایی می‌توانند داشته باشند
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <PlusIcon className="w-4 h-4" />
              افزودن اولین فیلد
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsManager;