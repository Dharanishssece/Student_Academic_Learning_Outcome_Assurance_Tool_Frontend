import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: backendUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on each request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('salo_user');
  if (stored) {
    const user = JSON.parse(stored);
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 globally — but NOT on the login endpoint itself
// (a failed login returns 401 "Invalid email or password" which
//  must surface as an error message, not cause a page redirect)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginEndpoint = err.config?.url?.includes('/api/auth/login');
    if (err.response?.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('salo_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
