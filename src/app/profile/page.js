'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import { withUserAuth } from '@/components/WithUserAuth';
import { userApiService } from '@/services/api';

// Import Components
import LoadingSkeleton from './components/LoadingSkeleton';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileStats from './components/ProfileStats';
import ActiveOrders from './components/ActiveOrders';
import ProfileForm from './components/ProfileForm';
import AddressesTab from './components/AddressesTab';
import AddressModal from './components/AddressModal';

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
  const [activeFilter, setActiveFilter] = useState('all');
  
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

  // تغییر در state مربوط به آدرس - اضافه کردن provinceId و cityId
  const [addressForm, setAddressForm] = useState({
    title: '',
    receiver: '',
    phone: '',
    province: '',
    provinceId: '',
    city: '',
    cityId: '',
    address: '',
    postalCode: '',
    isDefault: false
  });

  // حذف لیست استان‌های ثابت - چون از iran-cities-json استفاده می‌کنیم

  // Helper Functions
  const getOrderSteps = (order) => {
    if (order.steps && Array.isArray(order.steps)) {
      return order.steps.map(apiStep => {
        const stepNameMap = {
          'Payment': 'پرداخت',
          'Processing': 'در حال پردازش',
          'Preparing': 'آماده‌سازی',
          'Shipped': 'تحویل به پست',
          'Delivered': 'تحویل داده شد'
        };

        return {
          name: stepNameMap[apiStep.name] || apiStep.name,
          key: apiStep.name?.toLowerCase(),
          status: apiStep.status === 'current' ? 'current' : 
                  apiStep.status === 'completed' ? 'completed' : 'pending',
          date: apiStep.date
        };
      });
    }

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

    steps.forEach((step, index) => {
      if (index < currentStatusIndex) {
        step.status = 'completed';
      } else if (index === currentStatusIndex) {
        step.status = 'current';
      } else {
        step.status = 'pending';
      }
    });

    return steps;
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  // تابع کمکی برای مدیریت ارورها
  const setError = (section, error) => {
    setErrors(prev => ({
      ...prev,
      [section]: error
    }));
  };

  const handleStatusFilter = async (status) => {
    setActiveFilter(status);
    await fetchActiveOrders(status);
  };

  // API Functions
  const fetchActiveOrders = async (filter = 'all') => {
    try {
      setActiveOrdersFilter(filter);
      setError('activeOrders', null);
      
      const response = await userApiService.getUserOrders();
      
      if (response.success) {
        let orders = response.data.orders || [];
        
        // فیلتر کردن سفارش‌ها بر اساس وضعیت
        if (filter === 'active') {
          // سفارش‌های فعال: همه به جز تحویل شده و لغو شده
          orders = orders.filter(order => 
            !['delivered', 'cancelled'].includes(order.status)
          );
        } else if (filter !== 'all') {
          // فیلتر بر اساس وضعیت خاص
          orders = orders.filter(order => order.status === filter);
        }
        // اگر فیلتر 'all' باشد، همه سفارش‌ها نمایش داده می‌شوند
        
        setActiveOrders(orders);
      } else {
        throw new Error(response.message || 'خطا در دریافت سفارش‌ها');
      }
    } catch (error) {
      console.error('Error fetching active orders:', error);
      setError('activeOrders', 'خطا در دریافت سفارش‌های فعال');
    }
  };

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
      const response = await userApiService.getUserOrders();
      
      if (response.success) {
        const orders = response.data.orders || [];
        
        const stats = {
          pending_payment: 0,
          paid: 0,
          processing: 0,
          preparing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
          total: orders.length
        };

        orders.forEach(order => {
          switch (order.status) {
            case 'pending_payment':
              stats.pending_payment++;
              break;
            case 'paid':
              stats.paid++;
              break;
            case 'processing':
              stats.processing++;
              break;
            case 'preparing':
              stats.preparing++;
              break;
            case 'shipped':
              stats.shipped++;
              break;
            case 'delivered':
              stats.delivered++;
              break;
            case 'cancelled':
              stats.cancelled++;
              break;
          }
        });

        const activeOrdersCount = stats.paid + stats.processing + stats.preparing + stats.shipped;
        
        setOrderStats({
          ...stats,
          active: activeOrdersCount
        });
      } else {
        throw new Error(response.message || 'خطا در دریافت آمار سفارش‌ها');
      }
    } catch (error) {
      console.error('Error fetching order stats:', error);
      setError('orderStats', 'خطا در دریافت آمار سفارش‌ها');
    }
  };

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchUserProfile();
        await Promise.all([
          fetchOrderStats(),
          fetchActiveOrders('all'),
          fetchAddresses()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
        // ریست فرم به حالت اولیه با فیلدهای جدید
        setAddressForm({
          title: '',
          receiver: '',
          phone: '',
          province: '',
          provinceId: '',
          city: '',
          cityId: '',
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

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    // تنظیم فرم با فیلدهای جدید provinceId و cityId
    setAddressForm({
      title: address.title,
      receiver: address.receiver,
      phone: address.phone,
      province: address.province,
      provinceId: address.provinceId || '', // اضافه کردن provinceId
      city: address.city,
      cityId: address.cityId || '', // اضافه کردن cityId
      address: address.address,
      postalCode: address.postalCode,
      isDefault: address.isDefault
    });
    setShowAddressModal(true);
  };

  const handleNewAddress = () => {
    setEditingAddress(null);
    // ریست فرم با فیلدهای جدید
    setAddressForm({
      title: '',
      receiver: '',
      phone: '',
      province: '',
      provinceId: '',
      city: '',
      cityId: '',
      address: '',
      postalCode: '',
      isDefault: false
    });
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setError('address', null);
  };

  const handleLogout = async () => {
    try {
      await userApiService.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('آیا از لغو این سفارش مطمئن هستید؟')) return;
    
    try {
      setError('cancelOrder', null);
      const response = await userApiService.cancelOrder(orderId);
      if (response.success) {
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

  if (!user && errors.profile?.includes('USER_NOT_FOUND')) {
    return null;
  }

  if (loading) return (
    <Layout>
      <LoadingSkeleton />
    </Layout>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <ProfileSidebar
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              orderStats={orderStats}
              addresses={addresses}
              handleLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="lg:w-3/4">
              
              {/* بخش سفارش‌های فعال */}
              {activeTab === 'active-orders' && (
                <>
                  <ProfileStats 
                    orderStats={orderStats} 
                    errors={errors}
                    onStatusFilter={handleStatusFilter}
                    activeFilter={activeFilter}
                  />
                  
                  <ActiveOrders
                    activeOrders={activeOrders}
                    activeOrdersFilter={activeOrdersFilter}
                    fetchActiveOrders={fetchActiveOrders}
                    errors={errors}
                    getStatusInfo={getStatusInfo}
                    getOrderSteps={getOrderSteps}
                    formatDate={formatDate}
                    handleCancelOrder={handleCancelOrder}
                  />
                </>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && user && (
                <ProfileForm
                  user={user}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  updating={updating}
                  errors={errors}
                  handleUpdateProfile={handleUpdateProfile}
                  fetchUserProfile={fetchUserProfile}
                />
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <AddressesTab
                  addresses={addresses}
                  errors={errors}
                  handleNewAddress={handleNewAddress}
                  fetchAddresses={fetchAddresses}
                  handleEditAddress={handleEditAddress}
                  handleDeleteAddress={handleDeleteAddress}
                  handleSetDefaultAddress={handleSetDefaultAddress}
                />
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Address Modal - حذف prop provinces */}
      <AddressModal
        showAddressModal={showAddressModal}
        editingAddress={editingAddress}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        updating={updating}
        errors={errors}
        handleAddressSubmit={handleAddressSubmit}
        handleCloseAddressModal={handleCloseAddressModal}
        // حذف شده: provinces={provinces}
      />
    </Layout>
  );
};

export default withUserAuth(ProfilePage);