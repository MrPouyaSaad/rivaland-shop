import AddressCard from './AddressCard';

const AddressesTab = ({ 
  addresses, 
  errors, 
  handleNewAddress, 
  fetchAddresses, 
  handleEditAddress, 
  handleDeleteAddress, 
  handleSetDefaultAddress 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">آدرس‌های من</h1>
        <button
          onClick={handleNewAddress}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>🏠</span>
          افزودن آدرس جدید
        </button>
      </div>

      {/* نمایش ارور آدرس‌ها */}
      {errors.addresses && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-sm">⚠️</span>
            <p className="text-red-600 text-xs">{errors.addresses}</p>
          </div>
          <button 
            onClick={fetchAddresses}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 text-gray-400">🏠</div>
          <h3 className="text-base font-medium text-gray-500 mb-3">هنوز آدرسی ثبت نکرده‌اید</h3>
          <button
            onClick={handleNewAddress}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            افزودن اولین آدرس
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              handleEditAddress={handleEditAddress}
              handleDeleteAddress={handleDeleteAddress}
              handleSetDefaultAddress={handleSetDefaultAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesTab;