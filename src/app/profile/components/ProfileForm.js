const ProfileForm = ({ 
  user, 
  editForm, 
  setEditForm, 
  updating, 
  errors, 
  handleUpdateProfile,
  fetchUserProfile 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">اطلاعات حساب کاربری</h1>
      
      {/* نمایش ارور پروفایل */}
      {errors.profile && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-600 ml-2">⚠️</span>
            <p className="text-red-700 text-sm">{errors.profile}</p>
          </div>
          <button 
            onClick={fetchUserProfile}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      )}
      
      <form onSubmit={handleUpdateProfile}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* نام و نام خانوادگی اول */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
            <input
              type="text"
              value={editForm.firstName}
              onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="نام خود را وارد کنید"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
            <input
              type="text"
              value={editForm.lastName}
              onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="نام خانوادگی خود را وارد کنید"
            />
          </div>

          {/* ایمیل و شماره موبایل */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">شماره موبایل</label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* کد ملی */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی</label>
            <input
              type="text"
              value={editForm.nationalCode}
              onChange={(e) => setEditForm(prev => ({ ...prev, nationalCode: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={10}
              placeholder="کد ملی ۱۰ رقمی"
            />
          </div>
        </div>

        {/* نمایش ارور به‌روزرسانی پروفایل */}
        {errors.updateProfile && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <span className="text-red-600 ml-2">⚠️</span>
              <p className="text-red-700 text-sm">{errors.updateProfile}</p>
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
              '💾 ذخیره تغییرات'
            )}
          </button>
          <button 
            type="button"
            onClick={() => setEditForm({
              username: user.username || '',
              email: user.email || '',
              phone: user.phone || '',
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              nationalCode: user.nationalCode || ''
            })}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;