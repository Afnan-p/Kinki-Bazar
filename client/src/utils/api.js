import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors (invalid/expired token)
      if (error.response.status === 401) {
        localStorage.removeItem('userInfo');
        // We can't easily dispatch to store here without circular dependency
        // So we clear localStorage and let the app handle it on next check or reload
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
        }
      } else {
        const message = error.response.data.message || error.message;
        toast.error(message);
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
