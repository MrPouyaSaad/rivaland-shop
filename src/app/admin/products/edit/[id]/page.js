// app/admin/products/edit/[id]/page.js
'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductForm from '../../components/ProductForm';
import { useProductForm } from '../../components/hook/useProductForm';

const EditProductContent = () => {
  const params = useParams();
  const productId = params.id;
  
  const productForm = useProductForm('edit', productId);

  if (productForm.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری اطلاعات محصول...</p>
        </div>
      </div>
    );
  }

  return <ProductForm mode="edit" productId={productId} {...productForm} />;
};

const EditProductPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    }>
      <EditProductContent />
    </Suspense>
  );
};

export default EditProductPage;