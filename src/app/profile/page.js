'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import { withUserAuth } from '@/components/WithUserAuth';
import { userApiService } from '@/services/api';

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active-orders');
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orderStats, setOrderStats] = useState({
    active: 0,
    cancelled: 0,
    delivered: 0,
    total: 0
  });
  const [activeOrders, setActiveOrders] = useState([]);
  const [activeOrdersFilter, setActiveOrdersFilter] = useState('active');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // ارورهای بخش‌بندی شده
  const [errors, setErrors] = useState({
    profile: null,
    addresses: null,
    orderStats: null,
    activeOrders: null,
    updateProfile: null,
    cancelOrder: null,
    address: null
  });

  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    nationalCode: ''
  });

  const [addressForm, setAddressForm] = useState({
    title: '',
    receiver: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    isDefault: false
  });

  // استان‌های ایران
  const provinces = [
    'تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی',
    'آذربایجان غربی', 'کرمان', 'خوزستان', 'قم', 'مرکزی', 'گیلان',
    'مازندران', 'هرمزگان', 'سیستان و بلوچستان', 'کردستان', 'لرستان',
    'همدان', 'یزد', 'کرمانشاه', 'اردبیل', 'زنجان', 'سمنان', 'چهارمحال و بختیاری',
    'کهگیلویه و بویراحمد', 'گلستان', 'ایلام', 'بوشهر', 'خراسان شمالی',
    'خراسان جنوبی'
  ];

  // تابع getOrderSteps را به‌روزرسانی کنید:
  const getOrderSteps = (order) => {
    const steps = [
      { 
        name: 'پرداخت', 
        key: 'payment',
        status: 'pending',
        date: order.paidAt
      },
      { 
        name: 'در حال پردازش', 
        key: 'processing',
        status: 'pending',
        date: null
      },
      { 
        name: 'آماده‌سازی', 
        key: 'preparing',
        status: 'pending',
        date: null
      },
      { 
        name: 'تحویل به پست', 
        key: 'shipped',
        status: 'pending',
        date: null
      },
      { 
        name: 'تحویل داده شد', 
        key: 'delivered',
        status: 'pending',
        date: null
      }
    ];

    const statusOrder = {
      pending_payment: 0,
      paid: 1,
      processing: 2,
      preparing: 3,
      shipped: 4,
      delivered: 5,
      cancelled: -1
    };

    const currentStatusIndex = statusOrder[order.status] || 0;

    if (order.status === 'cancelled') {
      steps.forEach(step => {
        step.status = 'cancelled';
      });
      return steps;
    }

    // استفاده از steps واقعی از API اگر موجود باشد
    if (order.steps && Array.isArray(order.steps)) {
      order.steps.forEach(apiStep => {
        const foundStep = steps.find(s => s.key === apiStep.name?.toLowerCase());
        if (foundStep) {
          foundStep.status = apiStep.status === 'completed' ? 'completed' : 
                            apiStep.status === 'current' ? 'current' : 'pending';
          foundStep.date = apiStep.date;
        }
      });
    } else {
      // منطق قدیمی برای زمانی که steps از API نمی‌آید
      steps.forEach((step, index) => {
        if (index < currentStatusIndex) {
          step.status = 'completed';
        } else if (index === currentStatusIndex) {
          step.status = 'current';
        } else {
          step.status = 'pending';
        }
      });
    }

    return steps;
  };

  // تابع getStatusInfo را به‌روزرسانی کنید:
  const getStatusInfo = (status) => {
    const statusMap = {
      pending_payment: { 
        text: 'در انتظار پرداخت', 
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        icon: '⏳'
      },
      paid: { 
        text: 'پرداخت شده', 
        color: 'bg-blue-100 text-blue-800 border border-blue-200',
        icon: '✅'
      },
      processing: { 
        text: 'در حال پردازش', 
        color: 'bg-purple-100 text-purple-800 border border-purple-200',
        icon: '⚙️'
      },
      preparing: { 
        text: 'در حال آماده سازی', 
        color: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
        icon: '📦'
      },
      shipped: { 
        text: 'تحویل به پست', 
        color: 'bg-orange-100 text-orange-800 border border-orange-200',
        icon: '🚚'
      },
      delivered: { 
        text: 'تحویل داده شده', 
        color: 'bg-green-100 text-green-800 border border-green-200',
        icon: '🎉'
      },
      cancelled: { 
        text: 'لغو شده', 
        color: 'bg-red-100 text-red-800 border border-red-200',
        icon: '❌'
      }
    };
    return statusMap[status] || { 
      text: status, 
      color: 'bg-gray-100 text-gray-800 border border-gray-200',
      icon: '❓'
    };
  };

  // تابع fetchActiveOrders را به‌روزرسانی کنید:
  const fetchActiveOrders = async (filter = 'active') => {
    try {
      setActiveOrdersFilter(filter);
      setError('activeOrders', null);
      
      const filters = {};
      if (filter === 'active') {
        filters.status = 'active'; // یا می‌توانید status های خاصی را فیلتر کنید
      }
      
      const response = await userApiService.getUserOrders(filters);
      if (response.success) {
        setActiveOrders(response.data.orders || []);
      } else {
        throw new Error(response.message || 'خطا در دریافت سفارش‌ها');
      }
    } catch (error) {
      console.error('Error fetching active orders:', error);
      setError('activeOrders', 'خطا در دریافت سفارش‌های فعال');
    }
  };

  // تابع کمکی برای مدیریت ارورها
  const setError = (section, error) => {
    setErrors(prev => ({
      ...prev,
      [section]: error
    }));
  };

  // دریافت اطلاعات کاربر
  const fetchUserProfile = async () => {
    try {
      setError('profile', null);
      const response = await userApiService.getProfile();
      if (response.success) {
        setUser(response.data);
        setEditForm({
          username: response.data.username || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          nationalCode: response.data.nationalCode || ''
        });
        setAddresses(response.data.addresses || []);
      } else {
        if (response.code === 'USER_NOT_FOUND' || response.status === 401) {
          router.push('/sign-in');
          return;
        }
        throw new Error(response.message || 'خطا در دریافت اطلاعات کاربر');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401 || error.message?.includes('USER_NOT_FOUND')) {
        router.push('/sign-in');
        return;
      }
      setError('profile', error.message || 'خطا در دریافت اطلاعات کاربر');
    }
  };

  // دریافت آدرس‌ها
  const fetchAddresses = async () => {
    try {
      setError('addresses', null);
      const response = await userApiService.getUserAddresses();
      if (response.success) {
        setAddresses(response.data);
      } else {
        throw new Error(response.message || 'خطا در دریافت آدرس‌ها');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('addresses', 'خطا در دریافت آدرس‌ها');
    }
  };

  const fetchOrderStats = async () => {
    try {
      setError('orderStats', null);
      const response = await userApiService.getOrderStats();
      if (response.success) {
        // محاسبه سفارش‌های فعال
        const activeOrdersCount = (response.data.paid || 0) + 
                                (response.data.processing || 0) + 
                                (response.data.preparing || 0) + 
                                (response.data.shipped || 0);
        
        setOrderStats({
          pending_payment: response.data.pending_payment || 0,
          paid: response.data.paid || 0,
          active: activeOrdersCount,
          delivered: response.data.delivered || 0,
          cancelled: response.data.cancelled || 0,
          total: response.data.total || 0
        });
      } else {
        throw new Error(response.message || 'خطا در دریافت آمار سفارش‌ها');
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
      setError('orderStats', 'خطا در دریافت آمار سفارش‌ها');
    }
  };

  // به‌روزرسانی پروفایل
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError('updateProfile', null);
      const response = await userApiService.updateProfile(editForm);
      if (response.success) {
        setUser(prev => ({ ...prev, ...editForm }));
        alert('اطلاعات با موفقیت به‌روزرسانی شد');
      } else {
        throw new Error(response.message || 'خطا در به‌روزرسانی اطلاعات');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('updateProfile', error.message || 'خطا در به‌روزرسانی اطلاعات');
    } finally {
      setUpdating(false);
    }
  };

  // مدیریت آدرس
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError('address', null);
      
      let response;
      if (editingAddress) {
        response = await userApiService.updateUserAddress(editingAddress.id, addressForm);
      } else {
        response = await userApiService.createUserAddress(addressForm);
      }

      if (response.success) {
        await fetchAddresses();
        setShowAddressModal(false);
        setEditingAddress(null);
        setAddressForm({
          title: '',
          receiver: '',
          phone: '',
          province: '',
          city: '',
          address: '',
          postalCode: '',
          isDefault: false
        });
        alert(editingAddress ? 'آدرس با موفقیت ویرایش شد' : 'آدرس جدید با موفقیت اضافه شد');
      } else {
        throw new Error(response.message || 'خطا در ذخیره آدرس');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      setError('address', error.message || 'خطا در ذخیره آدرس');
    } finally {
      setUpdating(false);
    }
  };

  // تنظیم آدرس پیش‌فرض
  const handleSetDefaultAddress = async (addressId) => {
    try {
      setError('addresses', null);
      const response = await userApiService.setDefaultAddress(addressId);
      if (response.success) {
        await fetchAddresses();
        alert('آدرس پیش‌فرض با موفقیت تغییر کرد');
      } else {
        throw new Error(response.message || 'خطا در تغییر آدرس پیش‌فرض');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      setError('addresses', error.message || 'خطا در تغییر آدرس پیش‌فرض');
    }
  };

  // حذف آدرس
  const handleDeleteAddress = async (addressId) => {
    if (!confirm('آیا از حذف این آدرس مطمئن هستید؟')) return;
    
    try {
      setError('addresses', null);
      const response = await userApiService.deleteUserAddress(addressId);
      if (response.success) {
        await fetchAddresses();
        alert('آدرس با موفقیت حذف شد');
      } else {
        throw new Error(response.message || 'خطا در حذف آدرس');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('addresses', error.message || 'خطا در حذف آدرس');
    }
  };

  // ویرایش آدرس
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      title: address.title,
      receiver: address.receiver,
      phone: address.phone,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,
      isDefault: address.isDefault
    });
    setShowAddressModal(true);
  };

  // ایجاد آدرس جدید
  const handleNewAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      title: '',
      receiver: '',
      phone: '',
      province: '',
      city: '',
      address: '',
      postalCode: '',
      isDefault: false
    });
    setShowAddressModal(true);
  };

  // بستن مودال آدرس
  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setError('address', null);
  };

  // خروج از سیستم
  const handleLogout = async () => {
    try {
      await userApiService.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // لغو سفارش
  const handleCancelOrder = async (orderId) => {
    if (!confirm('آیا از لغو این سفارش مطمئن هستید؟')) return;
    
    try {
      setError('cancelOrder', null);
      const response = await userApiService.cancelOrder(orderId);
      if (response.success) {
        // به‌روزرسانی لیست سفارش‌ها
        fetchActiveOrders();
        fetchOrderStats();
        alert('سفارش با موفقیت لغو شد');
      } else {
        throw new Error(response.message || 'خطا در لغو سفارش');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('cancelOrder', error.message || 'خطا در لغو سفارش');
    }
  };

  // تبدیل تاریخ به فرمت فارسی
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchUserProfile();
        if (user !== null) {
          await Promise.all([
            fetchOrderStats(),
            fetchActiveOrders('active') // بارگذاری اولیه سفارش‌های فعال
          ]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // اسکلت لودینگ
  const LoadingSkeleton = () => (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Skeleton */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
                </div>
                
                <nav className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:w-3/4">
              {/* Stats Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                ))}
              </div>

              {/* Orders Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-1/4 mb-6 animate-pulse"></div>
                
                {[1, 2].map((order) => (
                  <div key={order} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="border-b border-gray-200 p-6">
                      <div className="flex justify-between">
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-300 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gray-50">
                      <div className="h-5 bg-gray-300 rounded w-24 mb-4"></div>
                      <div className="flex justify-between">
                        {[1, 2, 3, 4, 5].map((step) => (
                          <div key={step} className="flex flex-col items-center">
                            <div className="w-6 h-6 bg-gray-300 rounded-full mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="h-5 bg-gray-300 rounded w-24 mb-4"></div>
                      {[1, 2].map((item) => (
                        <div key={item} className="flex justify-between items-center py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );

  // اگر کاربر پیدا نشد و به صفحه sign-in هدایت شد، چیزی نمایش نده
  if (!user && errors.profile?.includes('USER_NOT_FOUND')) {
    return null;
  }

  if (loading) return <LoadingSkeleton />;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                {/* User Info */}
                {user && (
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                      {user.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
                    <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      عضو since {formatDate(user.createdAt)}
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

            {/* Main Content */}
            <div className="lg:w-3/4">
              
              {/* بخش سفارش‌های فعال */}
              {activeTab === 'active-orders' && (
                <>
                  {/* نمایش ارور آمار سفارش‌ها */}
                  {errors.orderStats && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <span className="text-red-600 ml-2">⚠️</span>
                        <p className="text-red-700 text-sm">{errors.orderStats}</p>
                      </div>
                    </div>
                  )}

                  {/* آمار سفارش‌ها */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">{orderStats.pending_payment || 0}</div>
                      <div className="text-sm text-gray-600">در انتظار پرداخت</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{orderStats.paid || 0}</div>
                      <div className="text-sm text-gray-600">پرداخت شده</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{orderStats.active || 0}</div>
                      <div className="text-sm text-gray-600">در حال انجام</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">{orderStats.delivered || 0}</div>
                      <div className="text-sm text-gray-600">تحویل شده</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-bold text-gray-800">سفارش‌های من</h1>
                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchActiveOrders('active')}
                          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            activeOrdersFilter === 'active' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          فعال
                        </button>
                        <button
                          onClick={() => fetchActiveOrders('all')}
                          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            activeOrdersFilter === 'all' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          همه
                        </button>
                      </div>
                    </div>
                    
                    {/* نمایش ارور سفارش‌های فعال */}
                    {errors.activeOrders && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <span className="text-red-600 ml-2">⚠️</span>
                          <p className="text-red-700 text-sm">{errors.activeOrders}</p>
                        </div>
                        <button 
                          onClick={() => fetchActiveOrders(activeOrdersFilter)}
                          className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          تلاش مجدد
                        </button>
                      </div>
                    )}

                    {/* نمایش ارور لغو سفارش */}
                    {errors.cancelOrder && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <span className="text-red-600 ml-2">⚠️</span>
                          <p className="text-red-700 text-sm">{errors.cancelOrder}</p>
                        </div>
                      </div>
                    )}
                    
                    {!errors.activeOrders && activeOrders.length === 0 ? (
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-4">هیچ سفارشی پیدا نشد</h3>
                        <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                          شروع به خرید
                        </Link>
                      </div>
                    ) : (
                      !errors.activeOrders && activeOrders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        const steps = getOrderSteps(order);
                        
                        return (
                          <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            {/* Order Header */}
                            <div className="border-b border-gray-200 p-6">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                  <h3 className="font-semibold text-gray-800 text-lg">سفارش #{order.id}</h3>
                                  <p className="text-gray-600 text-sm mt-1">
                                    تاریخ ثبت: {formatDate(order.createdAt)}
                                  </p>
                                  {order.paidAt && (
                                    <p className="text-gray-600 text-sm">
                                      تاریخ پرداخت: {formatDate(order.paidAt)}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className={`px-3 py-2 rounded-full text-sm font-medium ${statusInfo.color} flex items-center gap-2`}>
                                    <span>{statusInfo.icon}</span>
                                    {statusInfo.text}
                                  </span>
                                  {order.trackingCode && (
                                    <div className="text-left">
                                      <p className="text-sm text-gray-600">کد پیگیری:</p>
                                      <p className="font-mono text-sm font-bold text-blue-600">{order.trackingCode}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Order Progress */}
                            <div className="p-6 bg-gray-50">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-gray-800">روند سفارش</h4>
                                {order.trackingCode && (
                                  <Link 
                                    href={`/tracking/${order.trackingCode}`} 
                                    className="text-blue-600 text-sm hover:text-blue-700 flex items-center"
                                  >
                                    رهگیری کامل
                                    <span className="mr-1">↗</span>
                                  </Link>
                                )}
                              </div>
                              
                              <div className="relative">
                                <div className="absolute left-0 right-0 top-3 h-1 bg-gray-300"></div>
                                <div 
                                  className="absolute left-0 top-3 h-1 bg-green-500 transition-all duration-500"
                                  style={{
                                    width: `${(steps.filter(step => step.status === 'completed').length / (steps.length - 1)) * 100}%`
                                  }}
                                ></div>
                                
                                <div className="flex justify-between relative">
                                  {steps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center text-center">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs z-10 mb-2 transition-all ${
                                        step.status === 'completed' 
                                          ? 'bg-green-500 text-white shadow-lg transform scale-110' 
                                          : step.status === 'current'
                                          ? 'bg-blue-500 text-white shadow-lg transform scale-110'
                                          : step.status === 'cancelled'
                                          ? 'bg-red-500 text-white'
                                          : 'bg-gray-300 text-gray-600'
                                      }`}>
                                        {step.status === 'completed' ? '✓' : 
                                         step.status === 'cancelled' ? '✕' : 
                                         index + 1}
                                      </div>
                                      <div className="text-xs">
                                        <p className={`font-medium ${
                                          step.status === 'completed' || step.status === 'current'
                                            ? 'text-gray-800'
                                            : 'text-gray-500'
                                        }`}>
                                          {step.name}
                                        </p>
                                        {step.date && (
                                          <p className="text-gray-400 mt-1 text-xs">
                                            {formatDate(step.date)}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Order Items Summary */}
                            <div className="p-6">
                              <h4 className="font-semibold text-gray-800 mb-4">محصولات ({order.items?.length || 0})</h4>
                              <div className="space-y-3">
                                {order.items?.slice(0, 3).map((item, index) => (
                                  <div key={index} className="flex justify-between items-center py-2">
                                    <div className="flex items-center gap-3">
                                      {item.product?.image && (
                                        <img 
                                          src={item.product.image} 
                                          alt={item.product.name}
                                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                        />
                                      )}
                                      <div>
                                        <span className="text-gray-700 font-medium block">
                                          {item.product?.name || 'محصول'}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                          تعداد: {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="text-gray-600 font-medium">
                                      {((item.price || 0) * (item.quantity || 1)).toLocaleString()} تومان
                                    </span>
                                  </div>
                                ))}
                                
                                {order.items && order.items.length > 3 && (
                                  <div className="text-center pt-2 border-t border-gray-200">
                                    <p className="text-gray-500 text-sm">
                                      و {order.items.length - 3} محصول دیگر...
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Order Summary */}
                              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">جمع کل:</span>
                                  <span className="text-gray-800">{(order.subtotal || 0).toLocaleString()} تومان</span>
                                </div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">تخفیف:</span>
                                    <span className="text-green-600">-{(order.discount || 0).toLocaleString()} تومان</span>
                                  </div>
                                )}
                                {order.shippingCost > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">هزینه ارسال:</span>
                                    <span className="text-gray-800">{(order.shippingCost || 0).toLocaleString()} تومان</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center font-semibold border-t border-gray-200 pt-2">
                                  <span>مبلغ نهایی:</span>
                                  <span className="text-lg text-blue-600">
                                    {(order.total || 0).toLocaleString()} تومان
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Order Actions */}
                            <div className="border-t border-gray-200 p-6 bg-gray-50">
                              <div className="flex flex-wrap gap-3">
                                <Link 
                                  href={`/order/${order.id}`}
                                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                  <span>📦</span>
                                  مشاهده جزئیات کامل
                                </Link>
                                
                                {/* فقط سفارش‌هایی که پرداخت شده و هنوز ارسال نشده‌اند قابل لغو هستند */}
                                {['paid', 'processing', 'preparing'].includes(order.status) && (
                                  <button 
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="px-5 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-2"
                                  >
                                    <span>❌</span>
                                    لغو سفارش
                                  </button>
                                )}
                                
                                <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
                                  <span>📞</span>
                                  پشتیبانی
                                </button>
                                
                                {order.trackingCode && (
                                  <button className="px-5 py-2.5 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium flex items-center gap-2">
                                    <span>🚚</span>
                                    رهگیری
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && user && (
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی</label>
                        <input
                          type="text"
                          value={editForm.nationalCode}
                          onChange={(e) => setEditForm(prev => ({ ...prev, nationalCode: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                  {/* Logout Button in Profile */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button 
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <span className="ml-2">🚪</span>
                      خروج از حساب کاربری
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
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
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Modal برای افزودن/ویرایش آدرس */}
      {showAddressModal && (
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
      )}
    </Layout>
  );
};

export default withUserAuth(ProfilePage);