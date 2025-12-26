import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('[Axios Error]', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.response?.data?.message || error.message
    });

    if (error.response?.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      console.log('[Auth Error] 401 Unauthorized at path:', currentPath);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');

      // Only redirect if not already on login page
      // RELAXED REDIRECT: Just warn for now to debug
      console.warn('[Auth Error] 401 detected. Token removed.');

      if (currentPath !== '/login' && !currentPath.includes('/login')) {
        const shouldRedirect = window.confirm("Your session has expired. Click OK to login again.");
        if (shouldRedirect) {
          window.location.href = '/login';
        }
      }
    }

    // For 404 errors, don't redirect - just reject
    if (error.response?.status === 404) {
      console.error('[404 Error] Resource not found:', error.config?.url);
    }

    return Promise.reject(error);
  }
);

export default api;
