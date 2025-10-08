// components/WithUserAuth.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/hooks/useUserAuth';

export const withUserAuth = (WrappedComponent) => {
  const WithUserAuth = (props) => {
    const { isAuthenticated, loading } = useUserAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/sign-in'); // ✅ صفحه لاگین کاربر
      }
    }, [loading, isAuthenticated, router]);

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

  // 👇 این خط مهمه
  WithUserAuth.displayName = `WithUserAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithUserAuth;
};
