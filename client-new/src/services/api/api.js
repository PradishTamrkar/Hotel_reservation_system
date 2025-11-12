// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://8xj6mh5g-3002.asse.devtunnels.ms/'

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
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';
  }
  
  // Check if it's already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath; // Return as-is since backend already provides full URL
  }
  
  // Otherwise, construct the URL (fallback for relative paths)
  return `https://8xj6mh5g-3002.asse.devtunnels.ms/uploads/${imagePath}`;
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

  getExclusiveDeals: async () => {
    return apiCall('/roomCatagory/offers');
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

//Room Service
export const roomService ={
  getAvailableByDate: async(checkInDate,checkOutDate) => {
    return apiCall(`/rooms/available?check_in_date=${checkInDate}&check_out_date=${checkOutDate}`)
  }
};

//Faq Service
export const faqService ={
  getAll: async() => {
    return apiCall('/faq')
  },

  getById: async() => {
    return apiCall(`/faq/${id}`)
  },
  
  create: async() => {
    return apiCall('/faq',{
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async() => {
    return apiCall(`/faq/${id}`,{
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  delete: async() => {
    return apiCall(`/faq/${id}`,{
      method: 'DELETE'
    });
  },
};

//Contact Us Service
export const contactService = {
  create: async() => {
    return apiCall('/contactUs',{
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getAll: async() => {
    return apiCall('/contactUs')
  },

  getById: async() => {
    return apiCall(`/contactUs/${id}`)
  },

  delete: async() => {
    return apiCall(`/contactUs/${id}`, {
      method:'DELETE'
    });
  },
};
