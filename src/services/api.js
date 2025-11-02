// services/apiService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://saironstore.liara.run";

class ApiService {
  constructor(tokenKey = 'userToken', redirectOn401 = false) {
    this.tokenKey = tokenKey;
    this.redirectOn401 = redirectOn401;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers = options.body instanceof FormData
      ? { ...options.headers }
      : { 'Content-Type': 'application/json', ...options.headers };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { ...options, headers };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.removeToken();
        if (this.redirectOn401 && typeof window !== 'undefined') {
          window.location.href = '/admin/login';
          throw new Error('Unauthorized');
        } else {
          console.warn('User token invalid or missing');
          return { success: false, data: { items: [], total: 0, totalQuantity: 0 } };
        }
      }

      const data = await response.json();
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      return data;
    } catch (error) {
      if (!this.redirectOn401) {
        console.error('API error:', error);
        return { success: false, data: { items: [], total: 0, totalQuantity: 0 } };
      }
      throw error;
    }
  }

  // =============================================
  // 🔐 AUTHENTICATION APIs
  // =============================================
  async sendCode(phone) {
    return await this.request('/api/auth/request-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyCode(phone, code) {
    const response = await this.request('/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });

    if (response.token) this.setToken(response.token);
    return response;
  }

  async login(credentials) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) this.setToken(response.token);
    return response;
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  // =============================================
  // 👑 ADMIN DASHBOARD APIs
  // =============================================
  async getDashboardOverview(timeframe = 'monthly') {
    return await this.request(`/api/admin/dashboard/overView?timeframe=${timeframe}`);
  }

  async getQuickOverview() {
    return await this.request('/api/admin/dashboard/overView/quick');
  }

  async getDashboardHealth() {
    return await this.request('/api/admin/dashboard/overView/health');
  }

  async getTimeFilteredStats(period = 'monthly') {
    return await this.request(`/api/admin/dashboard/overView/filtered?period=${period}`);
  }

  async getDashboardSummary() {
    return await this.request('/api/admin/dashboard/summary');
  }

  async getAdminProfile() {
    return await this.request('/api/admin/profile');
  }

  // =============================================
  // 👑 ADMIN ORDERS MANAGEMENT APIs
  // =============================================
  async getAdminOrders(filters = {}) {
    const { status, page, limit, search } = filters;
    const queryParams = new URLSearchParams();
    
    if (status) queryParams.append('status', status);
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (search) queryParams.append('search', search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/admin/orders?${queryString}` : '/api/admin/orders';
    
    return await this.request(endpoint);
  }

  async getAdminOrderStats() {
    return await this.request('/api/admin/orders/stats');
  }

  async getRecentOrders(limit = 10) {
    return await this.request(`/api/admin/orders/recent?limit=${limit}`);
  }

  async getAdminOrderDetails(orderId) {
    return await this.request(`/api/admin/orders/${orderId}`);
  }

  async updateOrderStatus(orderId, statusData) {
    return await this.request(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async updateOrderPayment(orderId, paymentData) {
    return await this.request(`/api/admin/orders/${orderId}/payment`, {
      method: 'PATCH',
      body: JSON.stringify(paymentData),
    });
  }

  async cancelAdminOrder(orderId, reason) {
    return await this.request(`/api/admin/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async printOrderInvoice(orderId) {
    return await this.downloadFile(`/api/admin/orders/${orderId}/invoice/print`, `invoice-${orderId}.pdf`);
  }

  // =============================================
  // 👑 ADMIN PRODUCTS MANAGEMENT APIs
  // =============================================
  async createProduct(productData) {
    let formData;

    if (productData instanceof FormData) {
      formData = productData;
    } else {
      formData = new FormData();

      // فیلدهای اصلی
      formData.append('name', productData.name || '');
      formData.append('price', (productData.price || 0).toString());
      formData.append('stock', (productData.stock || 0).toString());
      formData.append('categoryId', productData.categoryId.toString());
      formData.append('description', productData.description || '');
      formData.append('isActive', productData.isActive ? 'true' : 'false');

      // فیلدهای اختیاری
      if (productData.discount !== undefined) {
        formData.append('discount', productData.discount.toString());
      }
      if (productData.discountType) {
        formData.append('discountType', productData.discountType);
      }
      if (productData.basePrice !== undefined) {
        formData.append('basePrice', productData.basePrice.toString());
      }
      if (productData.baseStock !== undefined) {
        formData.append('baseStock', productData.baseStock.toString());
      }

      // فیلدهای JSON
      if (productData.fields) {
        formData.append('fields', JSON.stringify(productData.fields));
      }
      if (productData.labels) {
        formData.append('labels', JSON.stringify(productData.labels));
      }
      if (productData.variants) {
        formData.append('variants', JSON.stringify(productData.variants));
      }

      // تصاویر
      if (productData.images && Array.isArray(productData.images)) {
        productData.images.forEach(image => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }
    }

    return await this.request('/api/admin/products', {
      method: 'POST',
      body: formData,
    });
  }

  async getAdminProducts(filters = {}) {
    const { categoryId, status, minPrice, maxPrice, search, page, limit } = filters;
    const queryParams = new URLSearchParams();
    
    if (categoryId) queryParams.append('categoryId', categoryId);
    if (status) queryParams.append('status', status);
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    if (search) queryParams.append('search', search);
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/admin/products?${queryString}` : '/api/admin/products';
    return await this.request(endpoint);
  }

  async getAdminProduct(id) {
    return await this.request(`/api/admin/products/${id}`);
  }

  async updateProduct(id, productData) {
    if (productData instanceof FormData) {
      return await this.request(`/api/admin/products/${id}`, {
        method: 'PUT',
        body: productData,
      });
    }

    const formData = new FormData();
    
    // فیلدهای اصلی
    formData.append('name', productData.name || '');
    formData.append('price', (productData.price || 0).toString());
    formData.append('stock', (productData.stock || 0).toString());
    formData.append('description', productData.description || '');
    formData.append('isActive', productData.isActive ? 'true' : 'false');

    // فیلدهای اختیاری
    if (productData.categoryId) {
      formData.append('categoryId', productData.categoryId.toString());
    }
    if (productData.discount !== undefined) {
      formData.append('discount', productData.discount.toString());
    }
    if (productData.discountType) {
      formData.append('discountType', productData.discountType);
    }
    if (productData.basePrice !== undefined) {
      formData.append('basePrice', productData.basePrice.toString());
    }
    if (productData.baseStock !== undefined) {
      formData.append('baseStock', productData.baseStock.toString());
    }

    // فیلدهای JSON
    if (productData.fields) {
      formData.append('fields', JSON.stringify(productData.fields));
    }
    if (productData.labels) {
      formData.append('labels', JSON.stringify(productData.labels));
    }
    if (productData.variants) {
      formData.append('variants', JSON.stringify(productData.variants));
    }

    // تصاویر
    if (productData.images && Array.isArray(productData.images)) {
      productData.images.forEach(image => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    return await this.request(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async deleteProduct(id) {
    return await this.request(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // =============================================
  // 👑 ADMIN CATEGORIES MANAGEMENT APIs
  // =============================================
  async getAdminCategories() {
    return await this.request('/api/admin/categories/without-products/list');
  }

  async getCategoriesWithProducts() {
    return await this.request('/api/admin/categories');
  }

  async createCategory(categoryData) {
    if (categoryData instanceof FormData) {
      return await this.request('/api/admin/categories', {
        method: 'POST',
        body: categoryData,
      });
    }
    
    const formData = new FormData();
    formData.append('name', categoryData.name || '');
    
    if (categoryData.image && typeof categoryData.image !== 'string') {
      formData.append('image', categoryData.image);
    }
    
    return await this.request('/api/admin/categories', {
      method: 'POST',
      body: formData,
    });
  }

  async updateCategory(id, categoryData) {
    if (categoryData instanceof FormData) {
      return await this.request(`/api/admin/categories/${id}`, {
        method: 'PUT',
        body: categoryData,
      });
    }
    
    const formData = new FormData();
    formData.append('name', categoryData.name || '');
    
    if (categoryData.image) {
      if (typeof categoryData.image !== 'string') {
        formData.append('image', categoryData.image);
      }
    }
    
    return await this.request(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async getAdminCategoryWithProducts(id) {
    return await this.request(`/api/admin/categories/${id}`);
  }

  async deleteCategory(id) {
    return await this.request(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminCategoryWithoutProducts(id) {
    return await this.request(`/api/admin/categories/without-products/${id}`);
  }

  // =============================================
  // 👑 ADMIN CATEGORY FIELDS MANAGEMENT APIs
  // =============================================
  async getCategoryFields(categoryId) {
    return await this.request(`/api/admin/categories/${categoryId}/fields`);
  }

  async addCategoryField(categoryId, fieldData) {
    return await this.request(`/api/admin/categories/${categoryId}/fields`, {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  }

  async removeCategoryField(fieldId) {
    return await this.request(`/api/admin/categories/fields/${fieldId}`, {
      method: 'DELETE',
    });
  }

  async getCategoryVariantFields(categoryId) {
    return await this.request(`/api/admin/categories/${categoryId}/fields/variant`);
  }

  async getCategoryNormalFields(categoryId) {
    return await this.request(`/api/admin/categories/${categoryId}/fields/normal`);
  }

  // =============================================
  // 👑 ADMIN LABELS MANAGEMENT APIs
  // =============================================
  async getLabels() {
    try {
      return await this.request('/api/admin/labels');
    } catch {
      return { success: true, data: [] };
    }
  }

  // =============================================
  // 👑 ADMIN CONTENT MANAGEMENT APIs
  // =============================================
  
  // Slider APIs
  async getAdminSliders() {
    return await this.request('/api/admin/content/slider');
  }

  async createSlider(images) {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    return await this.request('/api/admin/content/slider', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteSlider(id) {
    return await this.request(`/api/admin/content/slider/${id}`, {
      method: 'DELETE',
    });
  }

  async updateSliderStatus(id, isActive) {
    return await this.request(`/api/admin/content/slider/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  // Small Banner APIs
  async getAdminSmallBanners() {
    return await this.request('/api/admin/content/small-banner');
  }

  async createSmallBanner(images) {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    return await this.request('/api/admin/content/small-banner', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteSmallBanner(id) {
    return await this.request(`/api/admin/content/small-banner/${id}`, {
      method: 'DELETE',
    });
  }

  async updateSmallBannerStatus(id, isActive) {
    return await this.request(`/api/admin/content/small-banner/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  // Products Banner APIs
  async getAdminProductsBanners() {
    return await this.request('/api/admin/content/products-banner');
  }

  async createProductsBanner(images) {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    return await this.request('/api/admin/content/products-banner', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteProductsBanner(id) {
    return await this.request(`/api/admin/content/products-banner/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProductsBannerStatus(id, isActive) {
    return await this.request(`/api/admin/content/products-banner/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  // =============================================
  // 👤 USER PROFILE & ADDRESSES APIs
  // =============================================
  async getProfile() {
    return await this.request('/api/user/profile');
  }

  async updateProfile(profileData) {
    return await this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // GET user addresses
  async getUserAddresses() {
    return await this.request('/api/user/addresses');
  }

  // CREATE new address
  async createUserAddress(addressData) {
    return await this.request('/api/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  // UPDATE address
  async updateUserAddress(addressId, addressData) {
    return await this.request(`/api/user/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  // SET default address
  async setDefaultAddress(addressId) {
    return await this.request(`/api/user/addresses/${addressId}/default`, {
      method: 'PATCH',
    });
  }

  // DELETE address
  async deleteUserAddress(addressId) {
    return await this.request(`/api/user/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

 // services/apiService.js
// =============================================
// 👤 USER CART APIs - **اصلاح شده**
// =============================================

async getCart() {
  return await this.request('/api/cart');
}

async getActiveCart(sessionId = null) {
  // استفاده از POST برای ارسال sessionId در body
  return await this.request('/api/cart/active', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

async addToCart(cartData) {
  return await this.request('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify(cartData),
  });
}

async updateCartItem(cartItemId, quantity) {
  return await this.request(`/api/cart/update/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

async removeFromCart(cartItemId) {
  return await this.request(`/api/cart/remove/${cartItemId}`, {
    method: 'DELETE',
  });
}

async clearCart() {
  return await this.request('/api/cart/clear', {
    method: 'DELETE',
  });
}

async getCartDetailedCount() {
  return await this.request('/api/cart/detailed-count');
}

async getCartSummary() {
  return await this.request('/api/cart/summary');
}

async validateCart() {
  return await this.request('/api/cart/validate');
}

async mergeGuestCart(sessionId) {
  return await this.request('/api/cart/merge-guest', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

// =============================================
// 👤 GUEST CART APIs - **اصلاح شده**
// =============================================
async getGuestCart(sessionId) {
  return await this.request('/api/cart/guest', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

async addItemToGuestCart(cartData) {
  return await this.request('/api/cart/guest/add', {
    method: 'POST',
    body: JSON.stringify(cartData),
  });
}

  // =============================================
  // 👤 USER ORDERS APIs (کاملاً اصلاح شده)
  // =============================================
  async getUserOrders(filters = {}) {
    const { status, page, limit } = filters;
    const queryParams = new URLSearchParams();
    
    if (status) queryParams.append('status', status);
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/orders?${queryString}` : '/api/orders';
    
    return await this.request(endpoint);
  }

  async getOrderDetails(orderId) {
    return await this.request(`/api/orders/${orderId}`);
  }

  /**
   * ایجاد سفارش جدید (ساده‌شده)
   * فقط آدرس ارسال لازم است
   * @param {Object} shippingAddress - آدرس ارسال
   * @param {string} shippingAddress.firstName - نام
   * @param {string} shippingAddress.lastName - نام خانوادگی
   * @param {string} shippingAddress.phone - تلفن
   * @param {string} shippingAddress.province - استان
   * @param {string} shippingAddress.city - شهر
   * @param {string} shippingAddress.address - آدرس کامل
   * @param {string} [shippingAddress.postalCode] - کد پستی (اختیاری)
   */
  async createOrder(shippingAddress) {
    return await this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(shippingAddress),
    });
  }

  async cancelOrder(orderId) {
    return await this.request(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * محاسبه هزینه ارسال
   * @param {Object} shippingData - اطلاعات ارسال
   * @param {string} shippingData.province - استان
   * @param {string} shippingData.city - شهر
   * @param {number} [shippingData.subtotal=0] - مبلغ کل سبد خرید
   * @param {string} [shippingData.shippingMethod=standard] - روش ارسال
   */
  async calculateShippingCost(shippingData) {
    return await this.request('/api/orders/shipping/calculate', {
      method: 'POST',
      body: JSON.stringify(shippingData),
    });
  }

  async getOrderStats() {
    return await this.request('/api/orders/stats');
  }

  /**
   * اعتبارسنجی سبد خرید قبل از ایجاد سفارش
   * دیگر نیازی به ارسال cartId نیست - از سبد خرید فعال کاربر استفاده می‌کند
   */
  async validateCartForOrder() {
    return await this.request('/api/orders/validate-cart', {
      method: 'POST',
    });
  }

  /**
   * دریافت سبد خرید فعال کاربر
   */
  async getActiveCartForOrder() {
    return await this.request('/api/orders/active-cart');
  }

  // =============================================
  // 👤 USER PRODUCTS APIs
  // =============================================
  async getAllProducts(page = 1, limit = 10) {
    return await this.request(`/api/products/all?page=${page}&limit=${limit}`);
  }

  async getProductsByCategory(categoryId, page = 1, limit = 10) {
    return await this.request(`/api/products/category?categoryId=${categoryId}&page=${page}&limit=${limit}`);
  }

  async getProductsByLabel(label, page = 1, limit = 10) {
    return await this.request(`/api/products/label?label=${label}&page=${page}&limit=${limit}`);
  }

  async searchProducts(query, page = 1, limit = 10) {
    return await this.request(`/api/products/search?q=${query}&page=${page}&limit=${limit}`);
  }

  async getProductById(id) {
    return await this.request(`/api/products/${id}`);
  }

  async getRecommendedProducts(productId, limit = 10) {
    return await this.request(`/api/products/${productId}/recommended?limit=${limit}`);
  }

  // =============================================
  // 👤 USER CONTENT APIs
  // =============================================
  async getSlider() {
    return await this.request('/api/content/slider');
  }

  async getCategories() {
    return await this.request('/api/categories');
  }

  // =============================================
  // 💳 USER PAYMENTS APIs (سامان)
  // =============================================
  async getSamanToken(orderId, amount, cellNumber) {
    return await this.request(`/api/payments/create`, {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, cellNumber }),
    });
  }

  async verifySamanPayment(refNum) {
    return await this.request(`/api/payments/saman/verify`, {
      method: 'POST',
      body: JSON.stringify({ refNum }),
    });
  }

  async reverseSamanPayment(refNum) {
    return await this.request(`/api/payments/saman/reverse`, {
      method: 'POST',
      body: JSON.stringify({ refNum }),
    });
  }

  // =============================================
  // 🛠️ UTILITY METHODS
  // =============================================
  async downloadFile(endpoint, filename = 'file.pdf') {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      
      return { success: true };
    } catch (error) {
      console.error('Download error:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  async openFileInNewTab(endpoint) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      window.open(blobUrl, '_blank');
      
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
      
      return { success: true };
    } catch (error) {
      console.error('Open file error:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }
}

// ✅ ساخت دو نمونه جداگانه
export const adminApiService = new ApiService('adminToken', true);
export const userApiService = new ApiService('userToken', false);