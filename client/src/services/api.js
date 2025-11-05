// src/services/api.js
// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API calls
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
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Calling API:', url); // Debug log
    
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log('API Response:', data); // Debug log

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


// CUSTOMER SERVICE
export const customerService = {
  // Register new customer
  register: async (customerData) => {
    return apiCall('/customers/register', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  // Login customer
  login: async (credentials) => {
    const response = await apiCall('/customers/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', 'customer');
    }
    
    return response;
  },

  // Get customer by ID
  getById: async (id) => {
    return apiCall(`/customers/${id}`);
  },

  // Update customer
  update: async (id, customerData) => {
    return apiCall(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },
};


// ROOM CATEGORY SERVICE
export const roomCategoryService = {
  // Get all room categories
  getAll: async () => {
    return apiCall('/roomCatagory');
  },

  // Get room category by ID
  getById: async (id) => {
    return apiCall(`/roomCatagory/${id}`);
  },

  // Get rooms by category
  getRoomsByCategory: async (categoryId) => {
    return apiCall(`/roomCatagory/${categoryId}/rooms`);
  },

  // Get categories with exclusive deals
  getExclusiveDeals: async () => {
    return apiCall('/roomCatagory/offers');
  },
};

// ROOM SERVICE

export const roomService = {
  // Get all rooms with pagination
  getAll: async (pageNumber = 1, limit = 10) => {
    return apiCall(`/rooms?pageNumber=${pageNumber}&limit=${limit}`);
  },

  // Get room by ID
  getById: async (id) => {
    return apiCall(`/rooms/${id}`);
  },
};


// BOOKING SERVICE
export const bookingService = {
  // Create booking (for both logged-in users and guests)
  create: async (bookingData) => {
    return apiCall('/booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get all bookings (admin only)
  getAll: async (pageNumber = 1, limit = 10) => {
    return apiCall(`/booking?pageNumber=${pageNumber}&limit=${limit}`);
  },

  // Get booking by ID
  getById: async (id) => {
    return apiCall(`/booking/${id}`);
  },

  // Get customer's booking history
  getMyBookings: async () => {
    return apiCall('/booking/history');
  },

  // Update booking
  update: async (id, bookingData) => {
    return apiCall(`/booking/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  // Delete booking
  delete: async (id) => {
    return apiCall(`/booking/${id}`, {
      method: 'DELETE',
    });
  },

  // Search booking by customer details
  search: async (searchQuery) => {
    return apiCall(`/booking/search?search=${encodeURIComponent(searchQuery)}`);
  },
};

// HOTEL AMENITIES SERVICE
export const hotelAmenityService = {
  // Get all hotel amenities
  getAll: async () => {
    return apiCall('/hotelAmenities');
  },

  // Get amenity by ID
  getById: async (id) => {
    return apiCall(`/hotelAmenities/${id}`);
  },
};


// ROOM AMENITIES SERVICE

export const roomAmenityService = {
  // Get all room amenities
  getAll: async () => {
    return apiCall('/roomAmenities');
  },

  // Get amenities by category
  getByCategory: async (categoryId) => {
    return apiCall(`/amenityBridge/${categoryId}`);
  },
};

// TESTIMONIALS SERVICE
export const testimonialService = {
  // Get all testimonials
  getAll: async () => {
    return apiCall('/testimony');
  },

  // Create testimonial (customer only)
  create: async (testimonialData) => {
    return apiCall('/testimony', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  },

  // Update testimonial
  update: async (id, testimonialData) => {
    return apiCall(`/testimony/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  },
};

// FAQ SERVICE
export const faqService = {
  // Get all FAQs
  getAll: async () => {
    return apiCall('/faq');
  },

  // Get FAQ by ID
  getById: async (id) => {
    return apiCall(`/faq/${id}`);
  },
};

// CONTACT US SERVICE
export const contactService = {
  // Send contact message
  sendMessage: async (messageData) => {
    return apiCall('/contactUs', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
};

// PROMOS AND OFFERS SERVICE
export const promoService = {
  // Get all offers
  getAll: async () => {
    return apiCall('/promosAndOffer');
  },

  // Get offer by ID
  getById: async (id) => {
    return apiCall(`/promosAndOffer/${id}`);
  },
};

// AUTH UTILITIES
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get current user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  // Decode token to get user info
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
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

  getUserField: (field) => {
    const user = authUtils.getCurrentUser();
    return user ? user[field] : null
  },

  getFullName: () => {
    const user = authUtils.getCurrentUser()
    if(!user) return ''
    const middle = user.middle_name ? `${user.middle_name}` : ' '
    return `${user.first_name || ''}${middle}${user.last_name || ''}`.trim()
  }
};

// VALIDATION UTILITIES
export const validationUtils = {
  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Nepal format)
  isValidPhone: (phone) => {
    const phoneRegex = /^(\+977)?[9][6-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Validate date range
  isValidDateRange: (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return checkInDate >= today && checkOutDate > checkInDate;
  },

  // Calculate nights
  calculateNights: (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // Format currency (Nepali Rupees)
  formatCurrency: (amount) => {
    return `Rs ${parseFloat(amount).toLocaleString('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },

  // Format date
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
};