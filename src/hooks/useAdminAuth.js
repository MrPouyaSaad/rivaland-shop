'use client';

import { useState, useEffect } from 'react';

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    setIsAuthenticated(false);
  };

  return { loading, isAuthenticated, logout };
};
