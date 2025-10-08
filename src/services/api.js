// services/apiService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://rivaland.liara.run";

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
          window.location.href = '/admin/login'; // ادمین
          throw new Error('Unauthorized');
        } else {
          // کاربران عادی → ارور نشون داده نشه
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

  // ==== AUTH ====
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

  // ==== ADMIN ====

  // ==== ADMIN ORDERS MANAGEMENT ====
  
  // GET orders list with pagination and filters
  async getAdminOrders(filters = {}) {
    const { status, page, limit, sortBy, sortOrder } = filters;
    const queryParams = new URLSearchParams();
    
    if (status) queryParams.append('status', status);
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/admin/orders?${queryString}` : '/api/admin/orders';
    
    return await this.request(endpoint);
  }

  // GET order statistics
  async getAdminOrderStats() {
    return await this.request('/api/admin/orders/stats');
  }

  // GET order details
  async getAdminOrderDetails(orderId) {
    return await this.request(`/api/admin/orders/${orderId}`);
  }

  // PATCH update order status
  async updateOrderStatus(orderId, status) {
    return await this.request(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // PATCH update payment information
  async updateOrderPayment(orderId, paymentData) {
    return await this.request(`/api/admin/orders/${orderId}/payment`, {
      method: 'PATCH',
      body: JSON.stringify(paymentData),
    });
  }

  // POST cancel order
  async cancelAdminOrder(orderId) {
    return await this.request(`/api/admin/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  }

  // GET print invoice as PDF
  async printOrderInvoice(orderId) {
    return await this.request(`/api/admin/orders/${orderId}/invoice/print`);
  }

  // ==== ADMIN CONTENT MANAGEMENT ====

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

  async getAdminProfile() {
    return await this.request('/api/admin/profile');
  }

  async getDashboardSummary() {
    return await this.request('/api/admin/dashboard/summary');
  }

  async getDashboardOverview() {
    return await this.request('/api/admin/dashboard/overView');
  }

  async createProduct(productData) {
    let formData;

    if (productData instanceof FormData) {
      formData = productData;
      if (!formData.get('categoryId')) throw new Error('Category ID is required');
    } else {
      formData = new FormData();

      if (!productData.categoryId) throw new Error('Category ID is required');
      formData.append('categoryId', Number(productData.categoryId).toString());
      formData.append('name', productData.name || '');
      formData.append('price', (productData.price ? Number(productData.price) : 0).toString());
      formData.append('stock', (productData.stock ? Number(productData.stock) : 0).toString());
      formData.append('description', productData.description || '');
      formData.append('isActive', productData.isActive ? 'true' : 'false');

      if (productData.discount !== undefined && productData.discount !== null) {
        formData.append('discount', Number(productData.discount).toString());
      }
      if (productData.discountType) {
        formData.append('discountType', productData.discountType);
      }

      if (productData.image) {
        formData.append('image', productData.image);
      }

      if (Array.isArray(productData.images)) {
        const validImages = productData.images.filter(img => img instanceof File);
        validImages.forEach(img => formData.append('images', img));

        if (validImages.length === 0 && productData.images.length > 0) {
          formData.append('image_list', JSON.stringify(productData.images));
        }
      }

      if (productData.fields && productData.fields.length > 0) {
        formData.append('fields', JSON.stringify(productData.fields));
      }
    }

    return await this.request('/api/admin/products', {
      method: 'POST',
      body: formData,
    });
  }

  async getAdminProducts(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/admin/products?${queryString}` : '/api/admin/products';
    return await this.request(endpoint);
  }

  async getAdminProduct(id) {
    return await this.request(`/api/admin/products/${id}`);
  }

  async updateProduct(id, productData) {
    const formData = new FormData();
    formData.append('name', productData.name || '');
    formData.append('price', productData.price ? Number(productData.price) : 0);
    formData.append('stock', productData.stock ? Number(productData.stock) : 0);

    if (productData.categoryId) {
      formData.append('categoryId', Number(productData.categoryId));
    }

    formData.append('description', productData.description || '');
    formData.append('isActive', productData.isActive ? 'true' : 'false');

    if (productData.discount !== undefined) {
      formData.append('discount', Number(productData.discount));
    }
    if (productData.discountType) {
      formData.append('discountType', productData.discountType);
    }
    if (productData.image) {
      formData.append('image', productData.image);
    }
    if (productData.images && productData.images.length > 0) {
      if (productData.images[0] instanceof File) {
        productData.images.forEach(img => formData.append('images', img));
      } else {
        formData.append('image_list', JSON.stringify(productData.images));
      }
    }
    if (productData.fields && productData.fields.length > 0) {
      formData.append('fields', JSON.stringify(productData.fields));
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
    
    if (categoryData.fields && categoryData.fields.length > 0) {
      formData.append('fields', JSON.stringify(categoryData.fields));
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
      } else {
        formData.append('imageUrl', categoryData.image);
      }
    }
    
    if (categoryData.fields) {
      formData.append('fields', JSON.stringify(categoryData.fields));
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

  async addCategoryField(categoryId, fieldData) {
    return await this.request(`/api/admin/categories/${categoryId}/fields`, {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  }

  async getLabels() {
    try {
      return await this.request('/api/admin/labels');
    } catch {
      return { success: true, data: [] };
    }
  }

  // ==== USER ====
  
  // اسلایدرهای کاربر
  async getSlider() {
    return await this.request('/api/content/slider');
  }

  async getCategories() {
    return await this.request('/api/categories');
  }

  async getProductsByLabel(label, page = 1, limit = 10) {
    return await this.request(`/api/products/label?label=${label}&page=${page}&limit=${limit}`);
  }

  async getRecommendedProducts(productId) {
    return await this.request(`/api/products/${productId}/recommended`);
  }

  async getAllProducts(page = 1, limit = 10) {
    return await this.request(`/api/products/all?page=${page}&limit=${limit}`);
  }

  async getProductsByCategory(categoryId, page = 1, limit = 10) {
    return await this.request(`/api/products/category?categoryId=${categoryId}&page=${page}&limit=${limit}`);
  }

  async getProductById(id) {
    return await this.request(`/api/products/${id}`);
  }

  async searchProducts(query, page = 1, limit = 10) {
    return await this.request(`/api/products/search?q=${query}&page=${page}&limit=${limit}`);
  }

  // ==== USER CART APIs ====
  async getCart() {
    return await this.request('/api/cart');
  }

  async addToCart(productId, quantity = 1) {
    return await this.request('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return await this.request('/api/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId) {
    return await this.request(`/api/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return await this.request('/api/cart/clear', {
      method: 'DELETE',
    });
  }

  // ==== USER PROFILE & ADDRESSES ====
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

  // ==== USER ORDERS APIs ====
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

  async createOrder(orderData) {
    return await this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(orderId) {
    return await this.request(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  }

  async getOrderStats() {
    return await this.request('/api/orders/stats');
  }
}

// ✅ ساخت دو نمونه جداگانه
export const adminApiService = new ApiService('adminToken', true);
export const userApiService = new ApiService('userToken', false);