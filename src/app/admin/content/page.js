// app/admin/content/page.js
'use client';

import { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { adminApiService } from '@/services/api';

const ContentManagementPage = () => {
  const [activeTab, setActiveTab] = useState('sliders');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // داده‌های اصلی
  const [sliders, setSliders] = useState([]);
  const [smallBanners, setSmallBanners] = useState([]);
  const [productsBanners, setProductsBanners] = useState([]);
  
  // حالت‌های آپلود
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // آمار کلی
  const stats = {
    totalSliders: sliders.length,
    activeSliders: sliders.filter(s => s.isActive).length,
    totalSmallBanners: smallBanners.length,
    activeSmallBanners: smallBanners.filter(b => b.isActive).length,
    totalProductsBanners: productsBanners.length,
    activeProductsBanners: productsBanners.filter(b => b.isActive).length,
  };

  // دریافت داده‌ها از API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [slidersRes, smallBannersRes, productsBannersRes] = await Promise.all([
        adminApiService.getAdminSliders(),
        adminApiService.getAdminSmallBanners(),
        adminApiService.getAdminProductsBanners()
      ]);
      
      if (slidersRes.success) setSliders(slidersRes.data);
      if (smallBannersRes.success) setSmallBanners(smallBannersRes.data);
      if (productsBannersRes.success) setProductsBanners(productsBannersRes.data);
      
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // مدیریت آپلود فایل
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // پیش‌نمایش تصاویر
      const previews = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setUploadedImages(previews);
    }
  };

  const removeSelectedFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newPreviews = [...uploadedImages];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setUploadedImages(newPreviews);
  };

  // آپلود تصاویر
  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      setError('لطفاً حداقل یک تصویر انتخاب کنید.');
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      let result;
      if (activeTab === 'sliders') {
        result = await adminApiService.createSlider(selectedFiles);
      } else if (activeTab === 'smallBanners') {
        result = await adminApiService.createSmallBanner(selectedFiles);
      } else if (activeTab === 'productsBanners') {
        result = await adminApiService.createProductsBanner(selectedFiles);
      }
      
      if (result.success) {
        setSuccess(result.message);
        setSelectedFiles([]);
        setUploadedImages([]);
        fetchData(); // بارگذاری مجدد داده‌ها
      } else {
        setError('خطا در آپلود تصاویر.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('خطا در آپلود تصاویر. لطفاً دوباره تلاش کنید.');
    } finally {
      setUploading(false);
    }
  };

  // حذف آیتم
  const deleteItem = async (id) => {
    if (!confirm('آیا از حذف این آیتم اطمینان دارید؟')) return;
    
    try {
      setError(null);
      
      let result;
      if (activeTab === 'sliders') {
        result = await adminApiService.deleteSlider(id);
      } else if (activeTab === 'smallBanners') {
        result = await adminApiService.deleteSmallBanner(id);
      } else if (activeTab === 'productsBanners') {
        result = await adminApiService.deleteProductsBanner(id);
      }
      
      if (result.success) {
        setSuccess(result.message);
        fetchData(); // بارگذاری مجدد داده‌ها
      } else {
        setError('خطا در حذف آیتم.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('خطا در حذف آیتم. لطفاً دوباره تلاش کنید.');
    }
  };

  // تغییر وضعیت آیتم
  const toggleStatus = async (id, currentStatus) => {
    try {
      setError(null);
      
      let result;
      if (activeTab === 'sliders') {
        result = await adminApiService.updateSliderStatus(id, !currentStatus);
      } else if (activeTab === 'smallBanners') {
        result = await adminApiService.updateSmallBannerStatus(id, !currentStatus);
      } else if (activeTab === 'productsBanners') {
        result = await adminApiService.updateProductsBannerStatus(id, !currentStatus);
      }
      
      if (result.success) {
        setSuccess('وضعیت با موفقیت تغییر کرد.');
        fetchData(); // بارگذاری مجدد داده‌ها
      } else {
        setError('خطا در تغییر وضعیت.');
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      setError('خطا در تغییر وضعیت. لطفاً دوباره تلاش کنید.');
    }
  };

  // بستن پیام‌ها
  const closeError = () => setError(null);
  const closeSuccess = () => setSuccess(null);

  // فیلتر کردن داده‌ها بر اساس جستجو
  const getFilteredData = () => {
    const searchLower = searchTerm.toLowerCase();
    let data = [];
    
    if (activeTab === 'sliders') data = sliders;
    else if (activeTab === 'smallBanners') data = smallBanners;
    else if (activeTab === 'productsBanners') data = productsBanners;
    
    return data.filter(item => 
      item.imageKey.toLowerCase().includes(searchLower) || 
      item.id.toString().includes(searchLower)
    );
  };

  const filteredData = getFilteredData();

  // دریافت عنوان تب فعال
  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'sliders': return 'اسلایدرها';
      case 'smallBanners': return 'بنرهای کوچک';
      case 'productsBanners': return 'بنرهای محصولات';
      default: return 'محتوا';
    }
  };

  // قالب تاریخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت محتوا</h1>
        
        <div className="flex items-center gap-3">
          {/* جستجو */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجو بر اساس نام فایل یا شناسه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* دکمه بارگذاری مجدد */}
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowPathIcon className="w-5 h-5 text-gray-600" />
            بارگذاری مجدد
          </button>
        </div>
      </div>

      {/* نمایش پیام‌های خطا و موفقیت */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 ml-2" />
            <span>{error}</span>
          </div>
          <button onClick={closeError} className="absolute left-3 top-3">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg relative">
          <div className="flex items-center">
            <span>{success}</span>
          </div>
          <button onClick={closeSuccess} className="absolute left-3 top-3">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* کارت آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PhotoIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">اسلایدرها (فعال/کل)</div>
              <div className="text-xl font-bold">{stats.activeSliders} / {stats.totalSliders}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PhotoIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">بنرهای کوچک (فعال/کل)</div>
              <div className="text-xl font-bold">{stats.activeSmallBanners} / {stats.totalSmallBanners}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PhotoIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">بنرهای محصولات (فعال/کل)</div>
              <div className="text-xl font-bold">{stats.activeProductsBanners} / {stats.totalProductsBanners}</div>
            </div>
          </div>
        </div>
      </div>

      {/* تب‌های دسته‌بندی */}
      <div className="bg-white rounded-2xl shadow-lg mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab('sliders')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'sliders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            اسلایدرها
          </button>
          <button
            onClick={() => setActiveTab('smallBanners')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'smallBanners' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            بنرهای کوچک
          </button>
          <button
            onClick={() => setActiveTab('productsBanners')}
            className={`px-4 py-3 font-medium text-sm ${activeTab === 'productsBanners' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            بنرهای محصولات
          </button>
        </div>

        {/* بخش آپلود تصاویر */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">افزودن {getActiveTabTitle()} جدید</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              انتخاب تصاویر (می‌توانید چندین تصویر انتخاب کنید)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowUpTrayIcon className="w-8 h-8 text-gray-400" />
                  <p className="text-xs text-gray-500 mt-2">افزودن تصویر</p>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileSelect}
                  className="hidden" 
                />
              </label>
              
              <div className="flex flex-wrap gap-2">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image.url} 
                      alt={image.name} 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeSelectedFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={uploadImages}
            disabled={uploading || selectedFiles.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${uploading || selectedFiles.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                در حال آپلود...
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                آپلود تصاویر
              </>
            )}
          </button>
        </div>

        {/* جدول محتوا */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تصویر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام فایل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ایجاد</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-16 w-24">
                        <img 
                          className="h-16 w-24 object-cover rounded" 
                          src={item.image} 
                          alt={item.imageKey} 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.imageKey}</div>
                      <div className="text-xs text-gray-500">ID: {item.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(item.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleStatus(item.id, item.isActive)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} hover:opacity-80`}
                      >
                        {item.isActive ? 'فعال' : 'غیرفعال'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <a 
                          href={item.image} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <EyeIcon className="w-4 h-4" />
                          مشاهده
                        </a>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <TrashIcon className="w-4 h-4" />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    هیچ موردی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentManagementPage;