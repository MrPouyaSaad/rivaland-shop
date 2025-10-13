const AddressCard = ({ 
  address, 
  handleEditAddress, 
  handleDeleteAddress, 
  handleSetDefaultAddress 
}) => {
  return (
    <div key={address.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{address.title}</h3>
          {address.isDefault && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
              پیش‌فرض
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEditAddress(address)}
            className="text-blue-600 hover:text-blue-800 p-2"
            title="ویرایش"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDeleteAddress(address.id)}
            className="text-red-600 hover:text-red-800 p-2"
            title="حذف"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-gray-600">
        <p className="flex items-center">
          <span className="ml-2">👤</span>
          {address.receiver}
        </p>
        <p className="flex items-center">
          <span className="ml-2">📞</span>
          {address.phone}
        </p>
        <p className="flex items-center">
          <span className="ml-2">📍</span>
          {address.province}، {address.city}
        </p>
        <p className="flex items-start">
          <span className="ml-2 mt-1">🏠</span>
          <span className="text-right">{address.address}</span>
        </p>
        <p className="flex items-center">
          <span className="ml-2">📮</span>
          کد پستی: {address.postalCode}
        </p>
      </div>

      {!address.isDefault && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSetDefaultAddress(address.id)}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            تنظیم به عنوان آدرس پیش‌فرض
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;