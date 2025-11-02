// app/admin/products/add/page.js
'use client';

import { Suspense } from 'react';
import ProductForm from '../components/ProductForm';
import { useProductForm } from '../components/hook/useProductForm';

const AddProductContent = () => {
  const productForm = useProductForm('add');

  return <ProductForm mode="add" {...productForm} />;
};

const AddProductPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    }>
      <AddProductContent />
    </Suspense>
  );
};

export default AddProductPage;