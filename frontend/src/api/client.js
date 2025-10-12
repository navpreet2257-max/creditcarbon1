import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://54.227.62.67:8000';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carbon_credit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('carbon_credit_token');
      localStorage.removeItem('carbon_credit_business');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// Business API
export const businessAPI = {
  getProfile: () => apiClient.get('/business/profile'),
  updateProfile: (data) => apiClient.put('/business/profile', data),
};

// Calculator API
export const calculatorAPI = {
  calculate: (data) => apiClient.post('/calculator/calculate', data),
  getHistory: () => apiClient.get('/calculator/history'),
};

// Projects API
export const projectsAPI = {
  getAll: (projectType = null) => {
    const params = projectType && projectType !== 'all' ? { project_type: projectType } : {};
    return apiClient.get('/projects', { params });
  },
  getById: (id) => apiClient.get(`/projects/${id}`),
};

// Credits API
export const creditsAPI = {
  purchase: (data) => apiClient.post('/credits/purchase', data),
  getTransactions: () => apiClient.get('/credits/transactions'),
};

// Dashboard API
export const dashboardAPI = {
  getData: () => apiClient.get('/dashboard'),
};

// Certificates API
export const certificatesAPI = {
  getAll: () => apiClient.get('/certificates'),
  generate: (data) => apiClient.post('/certificates/generate', data),
  download: (certId) => apiClient.get(`/certificates/download/${certId}`, { responseType: 'blob' }),
};

// Products API
export const productsAPI = {
  getAll: (category = null) => {
    const params = category && category !== 'all' ? { category } : {};
    return apiClient.get('/products', { params });
  },
  create: (data) => apiClient.post('/products', data),
  contact: (data) => apiClient.post('/products/contact', data),
};

export default apiClient;
