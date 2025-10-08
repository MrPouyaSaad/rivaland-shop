// hooks/useUserAuth.js
'use client';

import { useState, useEffect } from 'react';

export function useUserAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken'); // ✅ فقط توکن کاربر
    if (token) {
      setIsAuthenticated(true);
      try {
        const parsed = JSON.parse(atob(token.split('.')[1])); // دیکد JWT
        setUser(parsed);
      } catch {
        console.warn('Invalid user token');
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { loading, isAuthenticated, user, logout };
}
