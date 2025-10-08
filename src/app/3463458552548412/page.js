'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { adminApiService } from '@/services/api';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // مطمئن شو که adminApiService.login این ساختار رو پشتیبانی می‌کنه
      const response = await adminApiService.login({
        username: formData.username,
        password: formData.password
      });

     if (response?.success) {
  // ذخیره توکن با کلید مخصوص ادمین
  localStorage.setItem('adminToken', response.token);

  // می‌تونیم نقش رو هم ذخیره کنیم تا سریعتر چک بشه
  localStorage.setItem('adminRole', response.role || 'admin');

  router.push('/admin/dashboard');
}
else {
        throw new Error(response?.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-indigo-100 mt-2">Please login to continue</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errors.submit && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center">
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.submit}
              </div>
            )}
            
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                    errors.username 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="admin"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 left-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login to Admin Panel'
                )}
              </button>
            </div>
          </form>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
            <div className="text-center text-xs text-gray-500">
              <p>© {new Date().getFullYear()} Admin Panel. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
