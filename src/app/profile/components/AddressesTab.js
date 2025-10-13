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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">آدرس‌های من</h1>
        <button
          onClick={handleNewAddress}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <span className="ml-2">➕</span>
          افزودن آدرس جدید
        </button>
      </div>

      {/* نمایش ارور آدرس‌ها */}
      {errors.addresses && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-600 ml-2">⚠️</span>
            <p className="text-red-700 text-sm">{errors.addresses}</p>
          </div>
          <button 
            onClick={fetchAddresses}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-4">هنوز آدرسی ثبت نکرده‌اید</h3>
          <button
            onClick={handleNewAddress}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            افزودن اولین آدرس
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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