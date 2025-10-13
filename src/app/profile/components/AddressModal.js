const AddressModal = ({
  showAddressModal,
  editingAddress,
  addressForm,
  setAddressForm,
  updating,
  errors,
  handleAddressSubmit,
  handleCloseAddressModal,
  provinces
}) => {
  if (!showAddressModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
          </h2>
        </div>

        <form onSubmit={handleAddressSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان آدرس *</label>
              <input
                type="text"
                value={addressForm.title}
                onChange={(e) => setAddressForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: خانه، محل کار"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام تحویل‌گیرنده *</label>
              <input
                type="text"
                value={addressForm.receiver}
                onChange={(e) => setAddressForm(prev => ({ ...prev, receiver: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="نام و نام خانوادگی"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شماره تماس *</label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="09xxxxxxxxx"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">استان *</label>
              <select
                value={addressForm.province}
                onChange={(e) => setAddressForm(prev => ({ ...prev, province: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">انتخاب استان</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شهر *</label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="نام شهر"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">کد پستی *</label>
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10 رقمی"
                maxLength={10}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">آدرس کامل *</label>
              <textarea
                value={addressForm.address}
                onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="آدرس کامل شامل خیابان، کوچه، پلاک، واحد و ..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="mr-2 text-sm text-gray-700">تنظیم به عنوان آدرس پیش‌فرض</span>
              </label>
            </div>
          </div>

          {/* نمایش ارور آدرس */}
          {errors.address && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <span className="text-red-600 ml-2">⚠️</span>
                <p className="text-red-700 text-sm">{errors.address}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button 
              type="submit"
              disabled={updating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  در حال ذخیره...
                </span>
              ) : (
                editingAddress ? '💾 به‌روزرسانی آدرس' : '➕ افزودن آدرس'
              )}
            </button>
            <button 
              type="button"
              onClick={handleCloseAddressModal}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
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