// Centralized API client for AutoPremium

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);
    
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data?.message || `Lỗi yêu cầu máy chủ (${res.status})`
      };
    }

    return data || { success: true };
  } catch (error) {
    console.warn(`[API] Không thể kết nối tới backend tại ${url}:`, error.message);
    return {
      success: false,
      isNetworkError: true,
      message: 'Không thể kết nối đến máy chủ API.'
    };
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Cars
  getCars: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.type && params.type !== 'All') query.append('type', params.type);
    if (params.fuel && params.fuel !== 'All') query.append('fuel', params.fuel);
    if (params.sort) query.append('sort', params.sort);
    const qs = query.toString();
    return request(`/cars${qs ? `?${qs}` : ''}`);
  },

  getCarById: (id) => request(`/cars/${id}`),

  createCar: (carData) => request('/cars', {
    method: 'POST',
    body: JSON.stringify(carData)
  }),

  updateCar: (id, carData) => request(`/cars/${id}`, {
    method: 'PUT',
    body: JSON.stringify(carData)
  }),

  deleteCar: (id) => request(`/cars/${id}`, {
    method: 'DELETE'
  }),

  resetCars: () => request('/cars/reset', {
    method: 'POST'
  }),

  // Auth & Profile
  login: (username, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  updateProfile: (profileData) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  changePassword: (id, currentPassword, newPassword) => request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ id, currentPassword, newPassword })
  }),

  // Users (Admin)
  getUsers: () => request('/users'),
  deleteUser: (id) => request(`/users/${id}`, {
    method: 'DELETE'
  }),

  // Bookings (Lái thử & Tư vấn)
  getBookings: () => request('/bookings'),
  createBooking: (bookingData) => request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  deleteBooking: (id) => request(`/bookings/${id}`, {
    method: 'DELETE'
  }),

  // Favorites
  toggleFavorite: (userId, carId) => request('/favorites/toggle', {
    method: 'POST',
    body: JSON.stringify({ userId, carId })
  }),
  getFavorites: (userId) => request(`/favorites/${userId}`)
};

export default api;
