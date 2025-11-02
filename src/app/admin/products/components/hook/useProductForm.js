// app/admin/products/components/hooks/useProductForm.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApiService } from '../../../../../services/api';

export const useProductForm = (mode, productId = null) => {
  const router = useRouter();
  
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
    discount: '0',
    discountType: 'amount',
    images: [],
    fields: [],
    labels: [],
    mainImage: '',
    variants: [],
    hasVariants: false
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFields, setCategoryFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});

  // دریافت داده‌ها
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchLabels()
        ]);
        
        if (mode === 'edit' && productId) {
          await fetchProductData();
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('خطا در دریافت اطلاعات');
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

        // پردازش تصاویر
        let processedImages = [];
        if (product.images && product.images.length > 0) {
          processedImages = product.images.map(img => {
            const imageUrl = typeof img === 'string' ? img : (img.url || img.imageUrl);
            return {
              url: imageUrl,
              isMain: imageUrl === (product.mainImage || product.images[0]?.url || product.images[0])
            };
          });
        }

        const mainImageUrl = product.mainImage || 
          (product.images && product.images[0] && 
          (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || product.images[0].imageUrl))) || '';

        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          categoryId: product.categoryId?.toString() || '',
          labelId: product.labelId?.toString() || '',
          description: product.description || '',
          isActive: product.isActive !== false,
          discount: product.discount?.toString() || '0',
          discountType: product.discountType || 'amount',
          images: [],
          fields: product.fields || [],
          labels: product.labels?.map(l => l.id) || [],
          mainImage: mainImageUrl,
          variants: product.variants || [],
          hasVariants: product.hasVariants || false
        });

        setExistingImages(processedImages);

        // پردازش فیلدهای محصول
        if (product.fields && product.fields.length > 0) {
          const initialFieldValues = {};
          product.fields.forEach(field => {
            if (field.fieldId || field.id) {
              const fieldId = field.fieldId || field.id;
              initialFieldValues[fieldId] = field.value || '';
            }
          });
          console.log('🔥 Setting initial field values:', initialFieldValues);
          setFieldValues(initialFieldValues);
        }

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

  // مدیریت فیلدهای دسته‌بندی
  useEffect(() => {
    if (formData.categoryId) {
      const category = categories.find(cat => cat.id == formData.categoryId);
      if (category) {
        setSelectedCategory(category);
        setCategoryFields(category.fields || []);
        
        // مقداردهی اولیه فیلدها
        setFieldValues(prev => {
          const newFieldValues = { ...prev };
          (category.fields || []).forEach(field => {
            if (!(field.id in newFieldValues)) {
              newFieldValues[field.id] = '';
            }
          });
          return newFieldValues;
        });
      }
    } else {
      setSelectedCategory(null);
      setCategoryFields([]);
    }
  }, [formData.categoryId, categories]);

 // در useProductForm.js - تابع handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // اعتبارسنجی
  if (!formData.name?.trim() || !formData.price || !formData.stock || !formData.categoryId) {
    setError('لطفا فیلدهای اجباری (نام، قیمت، موجودی، دسته‌بندی) را پر کنید');
    setLoading(false);
    return;
  }

  try {
    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      description: formData.description.trim(),
      isActive: formData.isActive,
      categoryId: parseInt(formData.categoryId),
      labelId: formData.labelId ? parseInt(formData.labelId) : null,
      discount: formData.discount && formData.discount !== '' ? parseFloat(formData.discount) : 0,
      discountType: formData.discountType,
      mainImage: formData.mainImage || '',
      images: formData.images,
      existingImages: existingImages.map(img => img.url).filter(url => url),
      fields: [],
      labels: formData.labels || [],
      variants: [], // اینجا را اصلاح می‌کنیم
      hasVariants: formData.variants && formData.variants.length > 0
    };

    // اضافه کردن فیلدها
    for (const fieldId in fieldValues) {
      const value = fieldValues[fieldId]?.toString().trim() || '';
      if (value !== '') {
        productData.fields.push({
          fieldId: parseInt(fieldId),
          value: value
        });
      }
    }

    // ✅ اصلاح: تبدیل مقادیر variants از string به number
    if (formData.variants && formData.variants.length > 0) {
      productData.variants = formData.variants.map(variant => ({
        ...variant,
        price: parseFloat(variant.price) || 0,    // تبدیل به number
        stock: parseInt(variant.stock) || 0,      // تبدیل به number
        // حذف فیلدهای undefined
        weight: variant.weight || null,
        dimensions: variant.dimensions || null
      }));
    }

    console.log('🚀 FINAL DATA TO SEND:', productData);

    let response;
    if (mode === 'edit') {
      response = await adminApiService.updateProduct(productId, productData);
    } else {
      response = await adminApiService.createProduct(productData);
    }
    
    if (response.success) {
      const successMessage = mode === 'edit' 
        ? 'محصول با موفقیت ویرایش شد' 
        : 'محصول با موفقیت ایجاد شد';
      
      setError('success:' + successMessage);
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
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

    if (['price', 'stock', 'discount'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }

    if (name === 'categoryId' || name === 'labelId') {
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }

    if (name === 'labels') {
      const labelId = parseInt(value);
      setFormData(prev => {
        const currentLabels = prev.labels || [];
        if (currentLabels.includes(labelId)) {
          return { ...prev, labels: currentLabels.filter(id => id !== labelId) };
        } else {
          return { ...prev, labels: [...currentLabels, labelId] };
        }
      });
      return;
    }

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFieldValueChange = (fieldId, value) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('حجم تصاویر نباید بیشتر از 5 مگابایت باشد');
      return;
    }
    
    const totalImages = existingImages.length + formData.images.length + files.length;
    if (totalImages > 5) {
      setError('حداکثر می‌توانید ۵ تصویر انتخاب کنید');
      return;
    }
    
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
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
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    const removedImage = existingImages[index];
    
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    
    if (removedImage.url === formData.mainImage) {
      const newMainImage = existingImages.length > 1 ? existingImages.find((_, i) => i !== index)?.url : '';
      setFormData(prev => ({ ...prev, mainImage: newMainImage }));
    }
  };

  const setMainImage = (imageUrl) => {
    setFormData(prev => ({ ...prev, mainImage: imageUrl }));

    setExistingImages(prev => 
      prev.map(img => ({ ...img, isMain: img.url === imageUrl }))
    );

    setImagePreviews(prev =>
      prev.map(img => ({ ...img, isMain: img.url === imageUrl }))
    );
  };

  return {
    // State
    categories,
    labels,
    loading,
    categoriesLoading,
    labelsLoading,
    error,
    formData,
    imagePreviews,
    existingImages,
    selectedCategory,
    categoryFields,
    fieldValues,
    
    // Setters
    setFormData,
    setError,
    
    // Handlers
    handleSubmit,
    handleChange,
    handleFieldValueChange,
    handleImagesChange,
    removeImage,
    removeExistingImage,
    setMainImage
  };
};