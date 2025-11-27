const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'

// Helper to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token); // Debug log
  return token;
};

// Main API call function for JSON data
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

// API call function for FormData
const apiCallFormData = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  console.log('🔍 FormData API Call:', endpoint, 'Auth:', token ? 'Present' : 'Missing');
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
  getAll: async() => {
    return apiCall('/customers')
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

  search: async (query) => {
    return apiCall(`/customers/search?search=${encodeURIComponent(query)}`);
  }
};

// Admin Service
export const adminService = {
  login: async (credentials) => {
    const response = await apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', 'admin');
    }
    
    return response;
  },

  Logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },
};

// Room Category Service
export const roomCategoryService = {
  create: async (formData) => {
    return apiCallFormData('/roomCatagory', {
      method: 'POST',
      body: formData,
    });
  },
  
  getAll: async () => {
    return apiCall('/roomCatagory');
  },

  getById: async (id) => {
    return apiCall(`/roomCatagory/${id}`);
  },

  getRoomsByCategory: async (categoryId) => {
    return apiCall(`/roomCatagory/${categoryId}/rooms`);
  },

  getExclusiveDeals: async () => {
    return apiCall('/roomCatagory/offers');
  },

  update: async (id, formData) => {
    return apiCallFormData(`/roomCatagory/${id}`, {
      method: 'PUT',
      body: formData, 
    });
  },

  delete: async (id) => {
    return apiCall(`/roomCatagory/${id}`, {
      method: 'DELETE',
    });
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

  getAll: async () => {
    return apiCall('/booking');
  },
  
  getById: async (id) => {
    return apiCall(`/booking/${id}`);
  },

  delete: async (id) => {
    return apiCall(`/booking/${id}`, {
      method: 'DELETE',
    });
  },

  searchByCDetail: async (query) => {
    return apiCall(`/booking/search?search=${encodeURIComponent(query)}`);
  },

  getByCustomerId: async (customerId) => {
    return apiCall(`/booking/customer/${customerId}`);
  },
};

// Hotel Amenity Service
export const hotelAmenityService = {
  create: async (formData) => {
    return apiCallFormData('/hotelAmenities', {
      method: 'POST',
      body: formData,
    });
  },

  getAll: async () => {
    return apiCall('/hotelAmenities');
  },

  getById: async (id) => {
    return apiCall(`/hotelAmenities/${id}`);
  },

  update: async (id, formData) => {
    return apiCallFormData(`/hotelAmenities/${id}`, {
      method: 'PUT',
      body: formData, 
    });
  },

  delete: async (id) => {
    return apiCall(`/hotelAmenities/${id}`, {
      method: 'DELETE',
    });
  },
};

// Room Amenity Service
export const roomAmenityService = {
  getByCategory: async (categoryId) => {
    return apiCall(`/amenityBridge/${categoryId}`);
  },

  create: async (data) => {
    return apiCall('/roomAmenities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiCall('/roomAmenities');
  },

  getById: async (id) => {
    return apiCall(`/roomAmenities/${id}`);
  },

  update: async (id, data) => {
    return apiCall(`/roomAmenities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiCall(`/roomAmenities/${id}`, {
      method: 'DELETE',
    });
  },
};

// Amenity Bridge Service
export const amenityBridgeService = {
  create: async (data) => {
    return apiCall('/amenityBridge', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getByCategoryId: async (categoryId) => {
    return apiCall(`/amenityBridge/${categoryId}`);
  },

  delete: async (id) => {
    return apiCall(`/amenityBridge/${id}`, {
      method: 'DELETE',
    });
  },
};

// Testimonial Service
export const testimonialService = {
  create: async (data) => {
    return apiCall('/testimony',{
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  getAll: async () => {
    return apiCall('/testimony');
  },

  getFeaturedTestimonies: async () => {
    return apiCall('/testimony/featured');
  },

  getById: async (id) => {
    return apiCall(`/testimony/${id}`);
  },

  toggleTestimonyFeatured: async (id) => {
    return apiCall(`/testimony/${id}/toggle-featured`, {
      method: 'PATCH',
    });
  },

  delete: async (id) => {
    return apiCall(`/testimony/${id}`, {
      method: 'DELETE',
    });
  },
};

// Room Service 
export const roomService = {
  create: async (formData) => {
    return apiCallFormData('/rooms', {
      method: 'POST',
      body: formData,
    });
  },

  getAll: async () => {
    return apiCall('/rooms');
  },

  getById: async (id) => {
    return apiCall(`/rooms/${id}`);
  },

  getAvailableByDate: async (checkInDate, checkOutDate) => {
    return apiCall(`/rooms/available?check_in_date=${checkInDate}&check_out_date=${checkOutDate}`);
  },

  update: async (id, formData) => {
    return apiCallFormData(`/rooms/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: async (id) => {
    return apiCall(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },

  search: async (searchTerm) => {
    return apiCall(`/rooms/search?search=${encodeURIComponent(searchTerm)}`);
  },
};

// FAQ Service
export const faqService = {
  getAll: async () => {
    return apiCall('/faq');
  },

  getFeaturedFAQs: async () => {
    return apiCall('/faq/featured');
  },

  getById: async (id) => {
    return apiCall(`/faq/${id}`);
  },
  
  create: async (data) => {
    return apiCall('/faq', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiCall(`/faq/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiCall(`/faq/${id}`, {
      method: 'DELETE',
    });
  },

  toggleFAQFeatured: async (id) => {
    return apiCall(`/faq/${id}/toggle-featured`, {
      method: 'PATCH',
    });
  },
};

// Contact Us Service 
export const contactService = {
  create: async (data) => {
    return apiCall('/contactUs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return apiCall('/contactUs');
  },

  getById: async (id) => {
    return apiCall(`/contactUs/${id}`);
  },

  delete: async (id) => {
    return apiCall(`/contactUs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Offer Service
export const offerService = {
  create: async (formData) => {
    return apiCallFormData('/promosAndOffer', {
      method: 'POST',
      body: formData,
    });
  },

  getAll: async () => {
    return apiCall('/promosAndOffer');
  },

  getById: async (id) => {
    return apiCall(`/promosAndOffer/${id}`);
  },

  update: async (id, formData) => {
    return apiCallFormData(`/promosAndOffer/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: async (id) => {
    return apiCall(`/promosAndOffer/${id}`, {
      method: 'DELETE',
    });
  },
};