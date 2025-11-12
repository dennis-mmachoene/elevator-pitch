import { create } from 'zustand';
import { listingAPI } from '../services/api';
import toast from 'react-hot-toast';

const useListingStore = create((set, get) => ({
  listings: [],
  currentListing: null,
  savedListings: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  filters: {
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    university: '',
    campus: '',
    sort: '-createdAt',
  },

  // Get all listings with filters
  fetchListings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const allParams = { ...get().filters, ...params };
      const response = await listingAPI.getAll(allParams);
      const { listings, pagination } = response.data.data;
      
      set({ 
        listings, 
        pagination,
        isLoading: false 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch listings';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Search listings
  searchListings: async (query, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingAPI.search({ q: query, ...params });
      const { listings, pagination } = response.data.data;
      
      set({ 
        listings, 
        pagination,
        isLoading: false 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Search failed';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Get single listing
  fetchListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingAPI.getById(id);
      const { listing } = response.data.data;
      
      set({ 
        currentListing: listing,
        isLoading: false 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch listing';
      set({ error: message, isLoading: false, currentListing: null });
      toast.error(message);
    }
  },

  // Create listing
  createListing: async (listingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingAPI.create(listingData);
      const { listing } = response.data.data;
      
      set({ 
        listings: [listing, ...get().listings],
        isLoading: false 
      });
      
      toast.success('Listing created successfully!');
      return { success: true, listing };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create listing';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Update listing
  updateListing: async (id, listingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await listingAPI.update(id, listingData);
      const { listing } = response.data.data;
      
      set({ 
        listings: get().listings.map(l => l._id === id ? listing : l),
        currentListing: listing,
        isLoading: false 
      });
      
      toast.success('Listing updated successfully!');
      return { success: true, listing };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update listing';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Delete listing
  deleteListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await listingAPI.delete(id);
      
      set({ 
        listings: get().listings.filter(l => l._id !== id),
        currentListing: null,
        isLoading: false 
      });
      
      toast.success('Listing deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete listing';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Mark as sold
  markAsSold: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await listingAPI.markAsSold(id);
      
      set({ 
        listings: get().listings.map(l => 
          l._id === id ? { ...l, status: 'sold' } : l
        ),
        isLoading: false 
      });
      
      toast.success('Listing marked as sold');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Reactivate listing
  reactivateListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await listingAPI.reactivate(id);
      
      set({ 
        listings: get().listings.map(l => 
          l._id === id ? { ...l, status: 'active' } : l
        ),
        isLoading: false 
      });
      
      toast.success('Listing reactivated');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reactivate';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Update filters
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  // Reset filters
  resetFilters: () => {
    set({
      filters: {
        category: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
        university: '',
        campus: '',
        sort: '-createdAt',
      }
    });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear current listing
  clearCurrentListing: () => set({ currentListing: null }),
}));

export default useListingStore;