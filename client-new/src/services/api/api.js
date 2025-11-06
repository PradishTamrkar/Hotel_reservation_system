// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Main API call function
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Get image URL
export const getImageUrl = (filename) => {
  if (!filename) return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';
  return `http://localhost:3002/uploads/${filename}`;
};

// Customer Service
export const customerService = {
  register: async (data) => {
    return apiCall('/customers/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (credentials) => {
    const response = await apiCall('/customers/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', 'customer');
    }
    
    return response;
  },

  getById: async (id) => {
    return apiCall(`/customers/${id}`);
  },

  update: async (id, data) => {
    return apiCall(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  Logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },
};

// Room Category Service
export const roomCategoryService = {
  getAll: async () => {
    return apiCall('/roomCatagory');
  },

  getById: async (id) => {
    return apiCall(`/roomCatagory/${id}`);
  },

  getRoomsByCategory: async (categoryId) => {
    return apiCall(`/roomCatagory/${categoryId}/rooms`);
  },
};

// Booking Service
export const bookingService = {
  create: async (data) => {
    return apiCall('/booking', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyBookings: async () => {
    return apiCall('/booking/history');
  },

  getById: async (id) => {
    return apiCall(`/booking/${id}`);
  },

  delete: async (id) => {
    return apiCall(`/booking/${id}`, {
      method: 'DELETE',
    });
  },
};

// Hotel Amenity Service
export const hotelAmenityService = {
  getAll: async () => {
    return apiCall('/hotelAmenities');
  },
};

// Room Amenity Service
export const roomAmenityService = {
  getByCategory: async (categoryId) => {
    return apiCall(`/amenityBridge/${categoryId}`);
  },
};

// Testimonial Service
export const testimonialService = {
  getAll: async () => {
    return apiCall('/testimony');
  },
};

// Auth Utils
export const authUtils = {
  isAuthenticated: () => !!getAuthToken(),

  getCurrentUser: () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
};

// Validation Utils
export const validationUtils = {
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

  isValidDateRange: (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkInDate >= today && checkOutDate > checkInDate;
  },

  calculateNights: (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  formatCurrency: (amount) => {
    return `Rs ${parseFloat(amount).toLocaleString('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },

  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
};