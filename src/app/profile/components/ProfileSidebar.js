const ProfileSidebar = ({ user, activeTab, setActiveTab, orderStats, addresses, handleLogout }) => {
  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
        {/* User Info */}
        {user && (
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            
            {/* سلام و نام کاربر */}
            {user.firstName && (
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                سلام {user.firstName}
              </h2>
            )}
            
            {/* شماره موبایل */}
            <p className="text-gray-600 text-sm">
              {user.phone}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('active-orders')}
            className={`w-full text-right px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
              activeTab === 'active-orders'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>📦 سفارش‌های فعال</span>
            {orderStats.active > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === 'active-orders' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {orderStats.active}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-right px-4 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'profile'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            👤 اطلاعات حساب
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-right px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
              activeTab === 'addresses'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>🏠 آدرس‌ها</span>
            {addresses.length > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === 'addresses' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {addresses.length}
              </span>
            )}
          </button>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="w-full text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
            >
              <span className="ml-2">🚪</span>
              خروج از حساب
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default ProfileSidebar;