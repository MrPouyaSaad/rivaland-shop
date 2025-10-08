// components/WithAdminAuth.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export const withAdminAuth = (WrappedComponent) => {
  const WithAdminAuth = (props) => {
    const { isAuthenticated, loading } = useAdminAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/admin/login');
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };

  // 👇 اسم مشخص
  WithAdminAuth.displayName = `WithAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAdminAuth;
};
