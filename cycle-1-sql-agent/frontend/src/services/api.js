import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.detail ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(errorMsg));
  }
);

export const apiService = {
  // Health & Stats
  getHealth: () => apiClient.get('/health'),
  getStats: () => apiClient.get('/api/stats'),

  // Agent execution
  runQuery: (data) => apiClient.post('/api/query/run', data),
  getQueryHistory: (limit = 20) => apiClient.get(`/api/query/history?limit=${limit}`),
  getQueryById: (queryId) => apiClient.get(`/api/query/${queryId}`),

  // Database introspection
  getDatabaseSchema: () => apiClient.get('/api/database/schema'),
  getDatabaseTables: () => apiClient.get('/api/database/tables'),
  resetDatabase: () => apiClient.post('/api/database/reset'),

  // Logs
  getLogs: (limit = 100, level = null) => {
    const query = level && level !== 'ALL' ? `?limit=${limit}&level=${level}` : `?limit=${limit}`;
    return apiClient.get(`/api/logs${query}`);
  },
};

export default apiService;
