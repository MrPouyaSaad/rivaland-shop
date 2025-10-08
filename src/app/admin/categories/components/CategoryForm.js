import { useState } from 'react';
import { PlusIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

const CategoryForm = ({ handleCreateCategory, handleImageChange, renderImagePreview }) => {
  const [newCategory, setNewCategory] = useState({ name: '', image: null, fields: [] });
  const [newField, setNewField] = useState({ name: '', type: 'text', required: false, options: [] });
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim()) {
      setNewField({ ...newField, options: [...newField.options, newOption.trim()] });
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    const updatedOptions = [...newField.options];
    updatedOptions.splice(index, 1);
    setNewField({ ...newField, options: updatedOptions });
  };

  const addFieldToCategory = () => {
    if (!newField.name) return;
    setNewCategory({ ...newCategory, fields: [...newCategory.fields, { ...newField, id: Date.now() }] });
    setNewField({ name: '', type: 'text', required: false, options: [] });
    setNewOption('');
  };

  const removeFieldFromCategory = (index) => {
    const updatedFields = [...newCategory.fields];
    updatedFields.splice(index, 1);
    setNewCategory({ ...newCategory, fields: updatedFields });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateCategory(newCategory);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">افزودن دسته‌بندی جدید</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* دسته‌بندی */}
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نام دسته‌بندی</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="نام دسته‌بندی"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تصویر دسته‌بندی</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              {renderImagePreview()}
              <p className="text-xs text-gray-500 mt-2">PNG, JPG تا 10MB</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        {/* فیلدها */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">فیلدها</h3>
          <div className="space-y-3">
            {newCategory.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-2 items-center">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => {
                    const updatedFields = [...newCategory.fields];
                    updatedFields[index].name = e.target.value;
                    setNewCategory({ ...newCategory, fields: updatedFields });
                  }}
                  placeholder="نام فیلد"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <select
                  value={field.type}
                  onChange={(e) => {
                    const updatedFields = [...newCategory.fields];
                    updatedFields[index].type = e.target.value;
                    setNewCategory({ ...newCategory, fields: updatedFields });
                  }}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="text">متنی</option>
                  <option value="number">عددی</option>
                  <option value="select">انتخابی</option>
                  <option value="checkbox">چک‌باکس</option>
                </select>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => {
                      const updatedFields = [...newCategory.fields];
                      updatedFields[index].required = e.target.checked;
                      setNewCategory({ ...newCategory, fields: updatedFields });
                    }}
                    className="h-4 w-4"
                  />
                  ضروری
                </label>
                <button type="button" onClick={() => removeFieldFromCategory(index)} className="text-red-500">
                  <MinusCircleIcon className="w-5 h-5" />
                </button>

                {/* options */}
                {field.type === 'select' && (
                  <div className="flex flex-col gap-1 mt-1 flex-1">
                    {field.options.map((opt, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updatedFields = [...newCategory.fields];
                            updatedFields[index].options[i] = e.target.value;
                            setNewCategory({ ...newCategory, fields: updatedFields });
                          }}
                          placeholder="گزینه"
                          className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedFields = [...newCategory.fields];
                            updatedFields[index].options.splice(i, 1);
                            setNewCategory({ ...newCategory, fields: updatedFields });
                          }}
                          className="text-red-500"
                        >
                          <MinusCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        placeholder="گزینه جدید"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newOption) return;
                          const updatedFields = [...newCategory.fields];
                          updatedFields[index].options.push(newOption);
                          setNewCategory({ ...newCategory, fields: updatedFields });
                          setNewOption('');
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1"
                      >
                        <PlusIcon className="w-4 h-4" />
                        افزودن گزینه
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* افزودن فیلد جدید */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="نام فیلد جدید"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="text">متنی</option>
                <option value="number">عددی</option>
                <option value="select">انتخابی</option>
                <option value="checkbox">چک‌باکس</option>
              </select>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="h-4 w-4"
                />
                ضروری
              </label>
              <button
                type="button"
                onClick={addFieldToCategory}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                افزودن فیلد
              </button>
            </div>
          </div>
        </div>

        {/* دکمه نهایی افزودن دسته‌بندی */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            افزودن دسته‌بندی
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
