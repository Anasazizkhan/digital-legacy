import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request - Token added to request:', config.url);
    } else {
      console.warn('API Request - No authenticated user found for request:', config.url);
    }
  } catch (error) {
    console.error('API Request - Failed to get auth token:', error);
  }
  return config;
}, (error) => {
  console.error('API Request - Interceptor error:', error);
  return Promise.reject(error);
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response - Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Response - Error:', error.config?.url, error.response?.status, error.response?.data);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('API Response - Authentication failed. Token may be invalid or expired.');
    }
    
    // Handle vault not found errors
    if (error.response?.status === 404 && error.response?.data?.message?.includes('vault not found')) {
      console.error('API Response - Vault not found error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api; 