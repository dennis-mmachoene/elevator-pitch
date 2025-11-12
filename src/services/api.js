import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies (refresh token)
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => 
    api.post(`/auth/reset-password/${token}`, { password }),
};

// User endpoints
export const userAPI = {
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/me', data),
  getUserListings: (id, params) => api.get(`/users/${id}/listings`, { params }),
  getSavedListings: (params) => api.get('/users/me/saved', { params }),
  toggleSaveListing: (listingId) => api.post(`/users/me/saved/${listingId}`),
  getUserOrders: (params) => api.get('/users/me/orders', { params }),
  getUserStats: (id) => api.get(`/users/${id}/stats`),
  searchUsers: (params) => api.get('/users/search', { params }),
  reportUser: (id, data) => api.post(`/users/${id}/report`, data),
};

// Listing endpoints
export const listingAPI = {
  getAll: (params) => api.get('/listings', { params }),
  search: (params) => api.get('/listings/search', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  getFeatured: (params) => api.get('/listings/featured', { params }),
  getByCategory: (category, params) => 
    api.get(`/listings/category/${category}`, { params }),
  getSimilar: (id) => api.get(`/listings/${id}/similar`),
  markAsSold: (id) => api.patch(`/listings/${id}/sold`),
  reactivate: (id) => api.patch(`/listings/${id}/reactivate`),
};

// Chat endpoints
export const chatAPI = {
  getAll: (params) => api.get('/chat', { params }),
  getOrCreate: (data) => api.post('/chat', data),
  getById: (id) => api.get(`/chat/${id}`),
  sendMessage: (id, data) => api.post(`/chat/${id}/messages`, data),
  markAsRead: (id) => api.put(`/chat/${id}/read`),
  delete: (id) => api.delete(`/chat/${id}`),
  toggleBlock: (id) => api.put(`/chat/${id}/block`),
  respondToOffer: (chatId, messageId, status) =>
    api.put(`/chat/${chatId}/messages/${messageId}/offer`, { status }),
  getUnreadCount: () => api.get('/chat/unread/count'),
};

// Order endpoints
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  updateMeetup: (id, data) => api.put(`/orders/${id}/meetup`, data),
  addRating: (id, data) => api.post(`/orders/${id}/rating`, data),
  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  initiateDispute: (id, reason) => api.post(`/orders/${id}/dispute`, { reason }),
  addNotes: (id, notes) => api.put(`/orders/${id}/notes`, { notes }),
};

// Upload endpoints
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (publicId) => api.delete('/upload/image', { data: { publicId } }),
};

export default api;