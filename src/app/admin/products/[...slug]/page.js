// app/admin/products/[...slug]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon, PlusIcon, TrashIcon, TagIcon, StarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { adminApiService } from '../../../../services/api';

const ProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug || [];
  const mode = slug[0];           // 'add' یا 'edit'
  const productId = slug[1] || null; // فقط در edit وجود دارد

  const [categories, setCategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [labelsLoading, setLabelsLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    labelId: '',
    description: '',
    isActive: true,
    discount: '',
    discountType: 'amount',
    images: [],
    fields: [],
    labels: [],
    mainImage: ''
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFields, setCategoryFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});

  // بررسی معتبر بودن mode
  useEffect(() => {
    if (mode !== 'add' && mode !== 'edit') {
      router.push('/admin/products');
      return;
    }
    if (mode === 'edit' && !productId) {
      router.push('/admin/products');
      return;
    }
  }, [mode, productId, router]);

  // دریافت داده‌ها
  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchLabels();
      if (mode === 'edit' && productId) {
        await fetchProductData();
      }
    };
    fetchData();
  }, [mode, productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getAdminProduct(productId);
      if (response.success) {
        const product = response.data;
        
        console.log('📥 Product data received:', product);

        // پردازش صحیح تصاویر
        const processedImages = (product.images || []).map(img => ({
          url: typeof img === 'string' ? img : img.url,
          isMain: typeof img === 'string' 
            ? img === (product.mainImage || (product.images[0] && (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)))
            : img.url === (product.mainImage || (product.images[0] && product.images[0].url))
        }));

        // پیدا کردن تصویر اصلی
        const mainImageUrl = product.mainImage || 
          (product.images && product.images[0] && 
          (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)) || '';

        // ✅ مقداردهی صحیح فرم - تبدیل مقادیر عددی به string برای inputها
        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          categoryId: product.categoryId?.toString() || '',
          labelId: product.labelId?.toString() || '',
          description: product.description || '',
          isActive: product.isActive !== false,
          discount: product.discount?.toString() || '',
          discountType: product.discountType || 'amount',
          images: [],
          fields: product.fields || [],
          labels: product.labels?.map(l => l.id) || [],
          mainImage: mainImageUrl
        });

        setExistingImages(processedImages);

        // پردازش فیلدهای محصول
        if (product.fields && product.fields.length > 0) {
          const initialFieldValues = {};
          product.fields.forEach(field => {
            if (field.id) {
              initialFieldValues[field.id] = field.value || '';
            }
          });
          setFieldValues(initialFieldValues);
        }

        console.log('✅ Form data set:', {
          name: product.name,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId
        });

      } else {
        setError('خطا در دریافت اطلاعات محصول');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('خطا در دریافت اطلاعات محصول');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await adminApiService.getAdminCategories();
      if (response.success) {
        setCategories(response.data || response);
      } else {
        setError('خطا در دریافت دسته‌بندی‌ها');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('خطا در دریافت دسته‌بندی‌ها');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchLabels = async () => {
    try {
      setLabelsLoading(true);
      const response = await adminApiService.getLabels();
      if (response.success) {
        setLabels(response.data || response);
      } else {
        console.error('خطا در دریافت لیبل‌ها');
      }
    } catch (err) {
      console.error('Error fetching labels:', err);
    } finally {
      setLabelsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'add') {
      setFormData({
        name: '',
        price: '',
        stock: '',
        categoryId: '',
        labelId: '',
        description: '',
        isActive: true,
        discount: '',
        discountType: 'amount',
        images: [],
        fields: [],
        labels: [],
        mainImage: ''
      });
      setImagePreviews([]);
      setExistingImages([]);
      setFieldValues({});
    }
  }, [mode]);

  // مدیریت فیلدهای دسته‌بندی
  useEffect(() => {
    if (formData.categoryId) {
      const category = categories.find(cat => cat.id == formData.categoryId);
      if (category) {
        setSelectedCategory(category);
        setCategoryFields(category.fields || []);
        
        // مقداردهی اولیه فیلدها
        const initialFieldValues = {};
        (category.fields || []).forEach(field => {
          // اگر در حالت edit هستیم و مقدار قبلی داریم، از آن استفاده کن
          if (mode === 'edit' && fieldValues[field.id]) {
            initialFieldValues[field.id] = fieldValues[field.id];
          } else {
            initialFieldValues[field.id] = '';
          }
        });
        setFieldValues(initialFieldValues);
      }
    } else {
      setSelectedCategory(null);
      setCategoryFields([]);
    }
  }, [formData.categoryId, categories, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // اضافه کردن لاگ برای دیباگ
    console.log('🔄 FORM DATA BEFORE SUBMIT:', formData);
    console.log('📊 FIELD VALUES:', fieldValues);

    // اعتبارسنجی فیلدهای اجباری
    if (!formData.name?.trim() || !formData.price || !formData.stock || !formData.categoryId) {
      setError('لطفا فیلدهای اجباری (نام، قیمت، موجودی، دسته‌بندی) را پر کنید');
      setLoading(false);
      return;
    }

    try {
      // آماده کردن فیلدها برای ارسال
      const fieldsToSend = [];
      for (const fieldId in fieldValues) {
        const value = fieldValues[fieldId]?.trim();
        if (value) {
          fieldsToSend.push({
            fieldId: parseInt(fieldId),
            value: value
          });
        }
      }

      // ایجاد FormData برای ارسال
      const formDataToSend = new FormData();
      
      // اضافه کردن فیلدهای اصلی با تبدیل به عدد
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('price', parseFloat(formData.price) || 0);
      formDataToSend.append('stock', parseInt(formData.stock) || 0);
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('categoryId', formData.categoryId.toString());
      
      if (formData.labelId) {
        formDataToSend.append('labelId', formData.labelId.toString());
      }

      // پردازش تخفیف
      if (formData.discount && parseFloat(formData.discount) > 0) {
        formDataToSend.append('discount', parseFloat(formData.discount));
        formDataToSend.append('discountType', formData.discountType);
      } else {
        formDataToSend.append('discount', '0');
        formDataToSend.append('discountType', formData.discountType);
      }
      
      // اضافه کردن تصویر اصلی
      if (formData.mainImage) {
        formDataToSend.append('mainImage', formData.mainImage);
      }
      
      // اضافه کردن تصاویر جدید
      const validImages = formData.images.filter(img => img instanceof File);
      validImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      // اضافه کردن تصاویر موجود در حالت ویرایش
      if (mode === 'edit') {
        formDataToSend.append('existingImages', JSON.stringify(existingImages.map(img => img.url)));
      }
      
      // اضافه کردن فیلدها و لیبل‌ها
      formDataToSend.append('fields', JSON.stringify(fieldsToSend));
      formDataToSend.append('labels', JSON.stringify(formData.labels));

      // لاگ داده‌های ارسالی
      console.log('🚀 SENDING DATA TO API:');
      console.log('Name:', formData.name);
      console.log('Price:', parseFloat(formData.price));
      console.log('Stock:', parseInt(formData.stock));
      console.log('Category ID:', formData.categoryId);
      console.log('Fields:', fieldsToSend);

      let response;
      if (mode === 'edit') {
        response = await adminApiService.updateProduct(productId, formDataToSend);
      } else {
        response = await adminApiService.createProduct(formDataToSend);
      }
      
      if (response.success) {
        const successMessage = mode === 'edit' 
          ? 'محصول با موفقیت ویرایش شد' 
          : 'محصول با موفقیت ایجاد شد';
        
        setError('success:' + successMessage);
        setTimeout(() => {
          router.push('/admin/products');
        }, 1500);
      } else {
        setError(`خطا در ${mode === 'edit' ? 'ویرایش' : 'ایجاد'} محصول: ` + (response.message || 'خطای ناشناخته'));
      }
    } catch (err) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} product:`, err);
      setError(`خطا در ${mode === 'edit' ? 'ویرایش' : 'ایجاد'} محصول: ` + (err.message || 'خطای ناشناخته'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // پردازش فیلدهای عددی
    if (['price', 'stock', 'discount'].includes(name)) {
      setFormData({ 
        ...formData, 
        [name]: value === '' ? '' : parseFloat(value) || 0 
      });
      return;
    }

    // پردازش فیلدهای ID
    if (name === 'categoryId' || name === 'labelId') {
      const parsed = value === '' ? '' : parseInt(value);
      setFormData({ ...formData, [name]: isNaN(parsed) ? '' : parsed });
      return;
    }

    if (name === 'labels') {
      const labelId = parseInt(value);
      setFormData(prev => {
        const currentLabels = prev.labels || [];
        if (currentLabels.includes(labelId)) {
          return {
            ...prev,
            labels: currentLabels.filter(id => id !== labelId)
          };
        } else {
          return {
            ...prev,
            labels: [...currentLabels, labelId]
          };
        }
      });
      return;
    }

    if (type === 'checkbox' || type === 'radio') {
      setFormData({
        ...formData,
        [name]: type === 'radio' ? value === 'true' : checked
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFieldValueChange = (fieldId, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('حجم تصاویر نباید بیشتر از 5 مگابایت باشد');
      return;
    }
    
    // بررسی تعداد کل تصاویر
    const totalImages = existingImages.length + formData.images.length + files.length;
    if (totalImages > 5) {
      setError('حداکثر می‌توانید ۵ تصویر انتخاب کنید');
      return;
    }
    
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
    
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          url: e.target.result,
          isMain: false,
          isNew: true
        });
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFormData({
      ...formData,
      images: newImages
    });
    
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = (index) => {
    const newExistingImages = [...existingImages];
    const removedImage = newExistingImages[index];
    
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
    
    // اگر تصویر حذف شده تصویر اصلی بود، تصویر اصلی را به اولین تصویر موجود تغییر دهید
    if (removedImage.url === formData.mainImage) {
      const newMainImage = newExistingImages.length > 0 ? newExistingImages[0].url : '';
      setFormData(prev => ({
        ...prev,
        mainImage: newMainImage
      }));
    }
  };

  // تابع برای انتخاب تصویر اصلی
  const setMainImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      mainImage: imageUrl
    }));

    // آپدیت وضعیت تصاویر موجود
    setExistingImages(prev => 
      prev.map(img => ({
        ...img,
        isMain: img.url === imageUrl
      }))
    );

    // آپدیت وضعیت تصاویر جدید
    setImagePreviews(prev =>
      prev.map(img => ({
        ...img,
        isMain: img.url === imageUrl
      }))
    );
  };

  const renderCategoryFields = () => {
    if (categoryFields.length === 0) return null;
    
    return (
      <div className="md:col-span-2 bg-blue-50 p-5 rounded-xl">
        <h3 className="text-lg font-medium text-blue-800 mb-4">
          ویژگی‌های {selectedCategory?.name}
        </h3>
        <div className="space-y-5">
          {categoryFields.map(field => (
            <div key={field.id} className="bg-white p-4 rounded-lg border border-blue-100">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                {field.name} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              <input
                type="text"
                value={fieldValues[field.id] || ''}
                onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`مقدار ${field.name} را وارد کنید`}
                required={field.required}
              />
              
              <p className="text-xs text-blue-500 mt-2">
                مقدار این فیلد را وارد کنید (مثال: 100 CM)
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMultipleLabelsSection = () => {
    if (labels.length === 0) return null;

    return (
      <div className="md:col-span-2 bg-purple-50 p-5 rounded-xl">
        <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
          <TagIcon className="w-5 h-5 ml-2" />
          برچسب‌های محصول (چندتایی)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {labels.map(label => (
            <label key={label.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="labels"
                value={label.id}
                checked={formData.labels.includes(label.id)}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span 
                className="mr-2 text-gray-700 bg-purple-100 px-3 py-1 rounded-full text-sm flex items-center"
                style={{ borderLeft: `3px solid ${label.color || '#6b7280'}` }}
              >
                <span 
                  className="inline-block w-3 h-3 rounded-full ml-2"
                  style={{ backgroundColor: label.color || '#6b7280' }}
                ></span>
                {label.title}
              </span>
            </label>
          ))}
        </div>
        {formData.labels.length > 0 && (
          <p className="text-sm text-purple-600 mt-3">
            {formData.labels.length} برچسب انتخاب شده است
          </p>
        )}
      </div>
    );
  };

  const renderExistingImages = () => {
    if (existingImages.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">تصاویر موجود:</h4>
        <div className="flex flex-wrap gap-4">
          {existingImages.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image.url} 
                alt={`تصویر موجود ${index + 1}`} 
                className={`w-24 h-24 object-cover rounded-lg border-2 shadow-sm transition-all ${
                  image.url === formData.mainImage 
                    ? 'border-yellow-400 border-3' 
                    : 'border-dashed border-green-200'
                }`}
              />
              
              {/* دکمه انتخاب به عنوان تصویر اصلی */}
              {image.url !== formData.mainImage && (
                <button
                  type="button"
                  onClick={() => setMainImage(image.url)}
                  className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-yellow-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="انتخاب به عنوان تصویر اصلی"
                >
                  <StarIcon className="w-3 h-3" />
                </button>
              )}
              
              {/* نشانگر تصویر اصلی */}
              {image.url === formData.mainImage && (
                <div className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md">
                  <StarIcon className="w-3 h-3 fill-white" />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {formData.mainImage && (
          <p className="text-xs text-yellow-600 mt-2 bg-yellow-50 p-2 rounded-lg">
            <StarIcon className="w-4 h-4 inline ml-1" />
            تصویر با حاشیه زرد، تصویر اصلی محصول است
          </p>
        )}
      </div>
    );
  };

  const renderNewImages = () => {
    if (imagePreviews.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">تصاویر جدید:</h4>
        <div className="flex flex-wrap gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img 
                src={preview.url} 
                alt={`پیش‌نمایش ${index + 1}`} 
                className={`w-24 h-24 object-cover rounded-lg border-2 shadow-sm transition-all ${
                  preview.url === formData.mainImage 
                    ? 'border-yellow-400 border-3' 
                    : 'border-dashed border-blue-200'
                }`}
              />
              
              {/* دکمه انتخاب به عنوان تصویر اصلی */}
              {preview.url !== formData.mainImage && (
                <button
                  type="button"
                  onClick={() => setMainImage(preview.url)}
                  className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-yellow-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="انتخاب به عنوان تصویر اصلی"
                >
                  <StarIcon className="w-3 h-3" />
                </button>
              )}
              
              {/* نشانگر تصویر اصلی */}
              {preview.url === formData.mainImage && (
                <div className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md">
                  <StarIcon className="w-3 h-3 fill-white" />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // اگر mode معتبر نیست، چیزی نمایش نده
  if (mode !== 'add' && mode !== 'edit') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* هدر */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/products"
            className="p-2 text-gray-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:text-blue-600"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {mode === 'edit' ? 'ویرایش محصول' : 'افزودن محصول جدید'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'edit' ? 'اطلاعات محصول را ویرایش کنید' : 'اطلاعات محصول جدید را در فرم زیر وارد کنید'}
            </p>
          </div>
        </div>

        {/* نمایش خطا یا موفقیت */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl ${error.startsWith('success:') 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'}`}
          >
            {error.startsWith('success:') ? error.substring(8) : error}
          </div>
        )}

        {/* فرم */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* نام محصول */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    نام محصول <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="نام محصول را وارد کنید"
                  />
                </div>

                {/* قیمت */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    قیمت (تومان) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                      تومان
                    </div>
                  </div>
                </div>

                {/* موجودی */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    موجودی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="تعداد موجودی"
                  />
                </div>

                {/* دسته‌بندی */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    دسته‌بندی <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    disabled={categoriesLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categoriesLoading && (
                    <p className="text-xs text-blue-500 mt-2">
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال دریافت دسته‌بندی‌ها...
                      </span>
                    </p>
                  )}
                </div>

                {/* لیبل اصلی (تکی) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    لیبل اصلی (تکی)
                  </label>
                  <select
                    name="labelId"
                    value={formData.labelId}
                    onChange={handleChange}
                    disabled={labelsLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">انتخاب لیبل اصلی</option>
                    {labels.map(label => (
                      <option key={label.id} value={label.id} className="flex items-center">
                        <span 
                          className="inline-block w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: label.color || '#6b7280' }}
                        ></span>
                        {label.title}
                      </option>
                    ))}
                  </select>
                  {labelsLoading && (
                    <p className="text-xs text-blue-500 mt-2">
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال دریافت لیبل‌ها...
                      </span>
                    </p>
                  )}
                </div>

                {/* وضعیت محصول */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    وضعیت محصول
                  </label>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        value="true"
                        checked={formData.isActive === true || formData.isActive === 'true'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="mr-2 text-gray-700">فعال</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="isActive"
                        value="false"
                        checked={formData.isActive === false || formData.isActive === 'false'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="mr-2 text-gray-700">غیرفعال</span>
                    </label>
                  </div>
                </div>

                {/* تخفیف */}
                <div className="md:col-span-2 bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">تخفیف (اختیاری)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع تخفیف
                      </label>
                      <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="percent">درصدی (%)</option>
                        <option value="amount">مبلغی (تومان)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مقدار تخفیف
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={formData.discountType === 'percent' ? 'درصد تخفیف' : 'مبلغ تخفیف'}
                      />
                    </div>
                  </div>
                  {formData.discount && (
                    <p className="text-sm text-blue-600 mt-3 bg-blue-50 p-2 rounded-lg">
                      تخفیف به صورت {formData.discountType === 'percent' ? 'درصدی' : 'مبلغی'} اعمال خواهد شد
                    </p>
                  )}
                </div>

                {/* ویژگی‌های محصول بر اساس دسته‌بندی */}
                {renderCategoryFields()}

                {/* بخش لیبل‌های چندتایی */}
                {renderMultipleLabelsSection()}

                {/* آپلود تصاویر */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    تصاویر محصول (حداکثر ۵ تصویر)
                  </label>
                  
                  {renderExistingImages()}
                  {renderNewImages()}
                  
                  {(existingImages.length + imagePreviews.length) < 5 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-all duration-200 bg-gray-50 hover:bg-blue-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">برای آپلود کلیک کنید</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (حداکثر 5MB)</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImagesChange}
                        multiple
                        disabled={(existingImages.length + imagePreviews.length) >= 5}
                      />
                    </label>
                  )}
                  
                  {(existingImages.length + imagePreviews.length) > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">
                        {existingImages.length} تصویر موجود + {imagePreviews.length} تصویر جدید
                      </p>
                      <p className="text-xs text-yellow-600 mt-1 bg-yellow-50 p-2 rounded-lg">
                        <StarIcon className="w-4 h-4 inline ml-1" />
                        برای انتخاب تصویر اصلی، روی آیکون ستاره در گوشه تصویر کلیک کنید
                      </p>
                    </div>
                  )}
                </div>

                {/* توضیحات محصول */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    توضیحات محصول
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="توضیحات کامل محصول را در اینجا بنویسید..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading || categoriesLoading || labelsLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {loading ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === 'edit' ? 'در حال ویرایش...' : 'در حال ایجاد...'}
                    </span>
                  ) : (
                    mode === 'edit' ? 'ویرایش محصول' : 'ایجاد محصول'
                  )}
                </button>
                <Link
                  href="/admin/products"
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  انصراف
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* راهنما */}
        <div className="mt-8 bg-blue-50 p-5 rounded-xl border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            {mode === 'edit' ? 'راهنمای ویرایش محصول' : 'راهنمای افزودن محصول'}
          </h3>
          <ul className="text-sm text-blue-600 list-disc pr-5 space-y-1">
            <li>فیلدهای دارای علامت <span className="text-red-500">*</span> اجباری هستند</li>
            <li>برای محصولات غیرفعال، امکان خرید توسط کاربران وجود ندارد</li>
            <li>حداکثر حجم مجاز برای تصاویر 5 مگابایت است</li>
            <li>می‌توانید حداکثر ۵ تصویر برای هر محصول آپلود کنید</li>
            <li>حتما یک تصویر اصلی برای محصول انتخاب کنید</li>
            <li>تصویر اصلی با حاشیه زرد و آیکون ستاره مشخص شده است</li>
            <li>برای تغییر تصویر اصلی، روی آیکون ستاره در گوشه تصویر مورد نظر کلیک کنید</li>
            <li>ویژگی‌های محصول بر اساس دسته‌بندی انتخاب شده نمایش داده می‌شوند</li>
            <li>برای هر ویژگی یک مقدار واحد وارد کنید (مثال: 100 CM)</li>
            <li>می‌توانید یک لیبل اصلی و چندین برچسب برای محصول انتخاب کنید</li>
            {mode === 'edit' && (
              <li>برای حذف تصاویر موجود، روی علامت × کلیک کنید</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;