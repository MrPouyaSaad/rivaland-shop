import React from "react";
import Select from "react-select";
import { shahr, ostan } from "iran-cities-json";

const AddressModal = ({
  showAddressModal,
  editingAddress,
  addressForm,
  setAddressForm,
  updating,
  errors,
  handleAddressSubmit,
  handleCloseAddressModal
}) => {
  if (!showAddressModal) return null;

  // لیست استان‌ها
  const provinceOptions = ostan.map(province => ({
    value: province.id,
    label: province.name
  }));

  // لیست شهرها بر اساس استان انتخاب شده
  const cityOptions = addressForm.provinceId 
    ? shahr
        .filter(city => city.ostan === addressForm.provinceId)
        .map(city => ({
          value: city.id,
          label: city.name
        }))
    : [];

  const handleProvinceChange = (selectedOption) => {
    const provinceId = selectedOption ? selectedOption.value : "";
    const provinceName = selectedOption ? selectedOption.label : "";
    
    setAddressForm(prev => ({ 
      ...prev, 
      province: provinceName,
      provinceId: provinceId,
      city: "",
      cityId: ""
    }));
  };

  const handleCityChange = (selectedOption) => {
    const cityId = selectedOption ? selectedOption.value : "";
    const cityName = selectedOption ? selectedOption.label : "";
    
    setAddressForm(prev => ({ 
      ...prev, 
      city: cityName,
      cityId: cityId
    }));
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? "1px solid #3b82f6" : "1px solid #d1d5db",
      borderRadius: "0.5rem",
      padding: "2px 4px",
      minHeight: "40px",
      fontSize: "0.875rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.1)" : "none",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#9ca3af"
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: "8px 12px",
      fontSize: "0.875rem",
      transition: "all 0.2s ease"
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 9999
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontSize: "0.875rem"
    })
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
          </h2>
        </div>

        <form onSubmit={handleAddressSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">عنوان آدرس *</label>
              <input
                type="text"
                value={addressForm.title}
                onChange={(e) => setAddressForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: خانه، محل کار"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">نام تحویل‌گیرنده *</label>
              <input
                type="text"
                value={addressForm.receiver}
                onChange={(e) => setAddressForm(prev => ({ ...prev, receiver: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="نام و نام خانوادگی"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">شماره تماس *</label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="09xxxxxxxxx"
                required
              />
            </div>

            {/* فیلد استان با react-select */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">استان *</label>
              <Select
                options={provinceOptions}
                value={provinceOptions.find(option => option.value === addressForm.provinceId) || null}
                onChange={handleProvinceChange}
                placeholder="استان را انتخاب کنید"
                styles={customStyles}
                isSearchable
                noOptionsMessage={() => "استانی یافت نشد"}
                required
              />
              {errors.province && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="text-red-400">⚠</span> {errors.province}
                </p>
              )}
            </div>

            {/* فیلد شهر با react-select */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">شهر *</label>
              <Select
                options={cityOptions}
                value={cityOptions.find(option => option.value === addressForm.cityId) || null}
                onChange={handleCityChange}
                placeholder={addressForm.provinceId ? "شهر را انتخاب کنید" : "ابتدا استان را انتخاب کنید"}
                styles={customStyles}
                isDisabled={!addressForm.provinceId}
                isSearchable
                noOptionsMessage={() => "شهری یافت نشد"}
                required
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="text-red-400">⚠</span> {errors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">کد پستی *</label>
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10 رقمی"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">آدرس کامل *</label>
              <textarea
                value={addressForm.address}
                onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="آدرس کامل شامل خیابان، کوچه، پلاک، واحد و ..."
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="mr-2 text-xs text-gray-600">تنظیم به عنوان آدرس پیش‌فرض</span>
            </div>
          </div>

          {/* نمایش ارور آدرس */}
          {errors.address && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              <div className="flex items-center">
                <span className="text-red-500 text-sm ml-2">⚠️</span>
                <p className="text-red-600 text-xs">{errors.address}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button 
              type="submit"
              disabled={updating}
              className="flex-1 bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                editingAddress ? (
                  <>
                    <span>📝</span>
                    <span>به‌روزرسانی آدرس</span>
                  </>
                ) : (
                  <>
                    <span>🏠</span>
                    <span>افزودن آدرس</span>
                  </>
                )
              )}
            </button>
            <button 
              type="button"
              onClick={handleCloseAddressModal}
              className="flex-1 border border-gray-300 text-gray-600 px-4 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;