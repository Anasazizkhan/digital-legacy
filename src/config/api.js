import axios from 'axios';

// Token refresh utility
let tokenRefreshPromise = null;

const refreshAuthToken = async () => {
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }
  
  tokenRefreshPromise = new Promise(async (resolve, reject) => {
    try {
      // Get the current Firebase user and refresh token
      const { getAuth } = await import('firebase/auth');
      const { app } = await import('../firebase');
      const auth = getAuth(app);
      const user = auth.currentUser;
      
      if (user) {
        const idToken = await user.getIdToken(true);
        localStorage.setItem('authToken', idToken);
        console.log('API - Token refreshed successfully');
        resolve(idToken);
      } else {
        reject(new Error('No user found'));
      }
    } catch (error) {
      console.error('API - Failed to refresh token:', error);
      reject(error);
    } finally {
      tokenRefreshPromise = null;
    }
  });
  
  return tokenRefreshPromise;
};

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors - NO AUTOMATIC REDIRECTS
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.message);
    
    // If we get a 401 error, try to refresh the token
    if (error.response?.status === 401) {
      console.log('API - Got 401 error, attempting token refresh...');
      
      try {
        const newToken = await refreshAuthToken();
        if (newToken) {
          console.log('API - Token refreshed, retrying request...');
          
          // Retry the original request with new token
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error('API - Failed to refresh token:', refreshError);
      }
    }
    
    // Don't automatically redirect - let components handle errors
    return Promise.reject(error);
  }
);

export default api; 