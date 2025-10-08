import React, { useState, useEffect } from "react";
import Select from "react-select";
import { shahr, ostan } from "iran-cities-json";
import { userApiService } from "@/services/api";

const ShippingForm = ({ formData, setFormData, errors, onSaveOptions }) => {
  const [saveAsAddress, setSaveAsAddress] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [addressTitle, setAddressTitle] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);

  // ارسال گزینه‌ها به والد هنگام تغییر
  useEffect(() => {
    if (onSaveOptions) {
      onSaveOptions({
        updateProfile,
        saveAsAddress: saveAsAddress && addressTitle && !selectedAddressId,
        addressTitle
      });
    }
  }, [updateProfile, saveAsAddress, addressTitle, selectedAddressId, onSaveOptions]);

  // دریافت پروفایل کاربر و آدرس‌ها
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const profileResponse = await userApiService.getProfile();
        if (profileResponse.success && profileResponse.data) {
          setUserData(profileResponse.data);
          
          setFormData(prev => ({
            ...prev,
            firstName: profileResponse.data.firstName || prev.firstName || "",
            lastName: profileResponse.data.lastName || prev.lastName || "",
            phone: profileResponse.data.phone || prev.phone || "",
            email: profileResponse.data.email || prev.email || ""
          }));
        }

        const addressesResponse = await userApiService.getUserAddresses();
        if (addressesResponse.success && addressesResponse.data) {
          setAddresses(addressesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setFormData]);

  // پر کردن خودکار فرم از آدرس انتخاب شده
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        setFormData(prev => ({
          ...prev,
          firstName: selectedAddress.receiver?.split(' ')[0] || prev.firstName,
          lastName: selectedAddress.receiver?.split(' ').slice(1).join(' ') || prev.lastName,
          phone: selectedAddress.phone || prev.phone,
          province: selectedAddress.province || prev.province,
          city: selectedAddress.city || prev.city,
          address: selectedAddress.address || prev.address,
          postalCode: selectedAddress.postalCode || prev.postalCode
        }));

        const province = ostan.find(p => p.name === selectedAddress.province);
        if (province) {
          setFormData(prev => ({ ...prev, provinceId: province.id }));
        }
        
        const city = shahr.find(c => c.name === selectedAddress.city && c.ostan === province?.id);
        if (city) {
          setFormData(prev => ({ ...prev, cityId: city.id }));
        }
      }
    }
  }, [selectedAddressId, addresses, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProvinceChange = (selectedOption) => {
    const provinceId = selectedOption ? selectedOption.value : "";
    const provinceName = selectedOption ? selectedOption.label : "";
    
    setFormData({ 
      ...formData, 
      province: provinceName,
      provinceId: provinceId,
      city: "",
      cityId: ""
    });
  };

  const handleCityChange = (selectedOption) => {
    const cityId = selectedOption ? selectedOption.value : "";
    const cityName = selectedOption ? selectedOption.label : "";
    
    setFormData({ 
      ...formData, 
      city: cityName,
      cityId: cityId
    });
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setSaveAsAddress(false);
  };

  // لیست استان‌ها
  const provinceOptions = ostan.map(province => ({
    value: province.id,
    label: province.name
  }));

  // لیست شهرها بر اساس استان انتخاب شده
  const cityOptions = formData.provinceId 
    ? shahr
        .filter(city => city.ostan === formData.provinceId)
        .map(city => ({
          value: city.id,
          label: city.name
        }))
    : [];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? "1px solid #3b82f6" : "1px solid #d1d5db",
      borderRadius: "0.75rem",
      padding: "4px 8px",
      minHeight: "44px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#9ca3af"
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: "10px 12px",
      fontSize: "14px",
      transition: "all 0.2s ease"
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      zIndex: 9999
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontSize: "14px"
    })
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* آدرس‌های ذخیره شده */}
      {addresses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 text-lg mb-4">آدرس‌های ذخیره شده</h3>
          <div className="space-y-3">
            {addresses.map(address => (
              <div 
                key={address.id} 
                className={`flex items-start gap-3 p-4 bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedAddressId === address.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-blue-100 hover:border-blue-300"
                }`}
                onClick={() => handleAddressSelect(address.id)}
              >
                <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${
                  selectedAddressId === address.id 
                    ? "bg-blue-500 border-blue-500" 
                    : "bg-white border-gray-300"
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 text-sm">{address.title}</span>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">پیش‌فرض</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {address.province}، {address.city}، {address.address}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    {address.postalCode} - {address.phone}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    تحویل گیرنده: {address.receiver}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <button
              type="button"
              onClick={() => setSelectedAddressId(null)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              ✏️ استفاده از آدرس جدید
            </button>
          </div>
        </div>
      )}

      <form className="space-y-6">
        {/* اطلاعات شخصی */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100">
            اطلاعات شخصی
            {userData?.phone && (
              <span className="text-sm font-normal text-green-600 mr-2">
                (شماره از پروفایل: {userData.phone})
              </span>
            )}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                placeholder="نام خود را وارد کنید"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                placeholder="نام خانوادگی خود را وارد کنید"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره تماس
                {userData?.phone && !formData.phone && (
                  <span className="text-green-600 text-xs mr-2">(خودکار پر می‌شود)</span>
                )}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                placeholder="09xxxxxxxxx"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* اطلاعات آدرس */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4 pb-3 border-b border-gray-100">
            اطلاعات آدرس
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">استان</label>
              <Select
                options={provinceOptions}
                value={provinceOptions.find(option => option.value === formData.provinceId) || null}
                onChange={handleProvinceChange}
                placeholder="استان را انتخاب کنید"
                styles={customStyles}
                isSearchable
                noOptionsMessage={() => "استانی یافت نشد"}
              />
              {errors.province && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.province}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شهر</label>
              <Select
                options={cityOptions}
                value={cityOptions.find(option => option.value === formData.cityId) || null}
                onChange={handleCityChange}
                placeholder={formData.provinceId ? "شهر را انتخاب کنید" : "ابتدا استان را انتخاب کنید"}
                styles={customStyles}
                isDisabled={!formData.provinceId}
                isSearchable
                noOptionsMessage={() => "شهری یافت نشد"}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {errors.city}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">آدرس کامل</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 resize-none"
              placeholder="خیابان، کوچه، پلاک، واحد، طبقه..."
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <span>⚠</span> {errors.address}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">کد پستی</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
              placeholder="۱۰ رقمی"
              maxLength={10}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <span>⚠</span> {errors.postalCode}
              </p>
            )}
          </div>
        </div>

        {/* گزینه‌های ذخیره */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4">گزینه‌های ذخیره</h3>
          
          <div className="space-y-4">
            {/* بروزرسانی پروفایل */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="updateProfile"
                checked={updateProfile}
                onChange={(e) => setUpdateProfile(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="updateProfile" className="block text-sm font-medium text-gray-700 mb-1">
                  بروزرسانی اطلاعات پروفایل
                </label>
                <p className="text-gray-500 text-sm">
                  اطلاعات شخصی وارد شده در پروفایل شما ذخیره خواهد شد.
                </p>
              </div>
            </div>

            {/* ذخیره آدرس جدید */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="saveAddress"
                checked={saveAsAddress}
                onChange={(e) => setSaveAsAddress(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={!!selectedAddressId}
              />
              <div className="flex-1">
                <label htmlFor="saveAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  ذخیره این آدرس در پروفایل
                </label>
                <p className="text-gray-500 text-sm mb-3">
                  این آدرس به لیست آدرس‌های شما اضافه خواهد شد.
                  {selectedAddressId && (
                    <span className="text-orange-600 block mt-1">
  برای ذخیره آدرس جدید، ابتدا گزینه 'استفاده از آدرس جدید' را انتخاب کنید.
</span>
                  )}
                </p>
                
                {saveAsAddress && !selectedAddressId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عنوان آدرس</label>
                    <input
                      type="text"
                      value={addressTitle}
                      onChange={(e) => setAddressTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      placeholder="مثال: منزل، محل کار، دفتر"
                      maxLength={50}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;