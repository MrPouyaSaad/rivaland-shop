// src/app/products/page.js
"use client";

import { Suspense } from "react";
import ProductsPageContent from "./ProductsPageContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">در حال بارگذاری...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
