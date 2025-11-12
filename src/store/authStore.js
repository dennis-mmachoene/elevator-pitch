import { create } from 'zustand';
import { authAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      
      set({ 
        user, 
        accessToken, 
        isAuthenticated: true, 
        isLoading: false 
      });

      // Connect socket
      socketService.connect(user.id);
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Login
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      
      set({ 
        user, 
        accessToken, 
        isAuthenticated: true, 
        isLoading: false 
      });

      // Connect socket
      socketService.connect(user.id);
      
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false, 
        isLoading: false 
      });

      // Disconnect socket
      socketService.disconnect();
      
      toast.success('Logged out successfully');
    }
  },

  // Get current user
  fetchUser: async () => {
    if (!get().accessToken) return;
    
    set({ isLoading: true });
    try {
      const response = await authAPI.getMe();
      const { user } = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isLoading: false });
      
      // Ensure socket is connected
      if (!socketService.connected) {
        socketService.connect(user.id);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      set({ isLoading: false });
    }
  },

  // Update user in store (after profile update)
  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // Update password
  updatePassword: async (passwords) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.updatePassword(passwords);
      set({ isLoading: false });
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;