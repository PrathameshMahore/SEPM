const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // User endpoints
  USER_REGISTER: `${API_BASE_URL}/api/users/register`,
  USER_LOGIN: `${API_BASE_URL}/api/users/login`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  
  // Parking endpoints
  CHECK_AVAILABILITY: `${API_BASE_URL}/api/slots/check-availability`,
  BOOK_SLOT: `${API_BASE_URL}/api/slots/book`,
  PARKING_DURATION: `${API_BASE_URL}/api/parking/parkingDuration`,
  
  // Payment endpoints
  CREATE_ORDER: `${API_BASE_URL}/api/payment/createOrder`,
  SAVE_TRANSACTION: `${API_BASE_URL}/api/parkingTransaction/data`,
  
  // History endpoints
  PARKING_HISTORY: `${API_BASE_URL}/api/parkingHistory/history`,
};

export default API_ENDPOINTS; 