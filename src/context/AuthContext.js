import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                    (window.location.hostname === 'localhost' ? 'http://127.0.0.1:8081' : 'https://backend-render-api-calender.onrender.com');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to validate token structure
  const isValidToken = (token) => {
    return token && token !== "undefined" && token !== "null" && token.split('.').length === 3;
  };

  const logoutUser = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    toast.info("Logged out successfully");
  }, [navigate]);

  const loginUser = async (username, password) => {
    try {
      // 1. Get tokens with fresh request
      const tokenResponse = await axios.post(`${API_BASE_URL}/api/token/`, {
        username,
        password
      });
      
      const { access, refresh } = tokenResponse.data;
      
      if (!isValidToken(access) || !isValidToken(refresh)) {
        throw new Error("Invalid token received");
      }

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 2. Immediately configure axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // 3. Get user profile using the configured api instance
      const userResponse = await api.get('/api/profile/');
      setUser(userResponse.data?.data || userResponse.data);
      
      navigate('/tasks');
      toast.success("Login Successful");
      return true;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      toast.error(error.response?.data?.detail || "Login failed");
      return false;
    }
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    
    if (!isValidToken(token)) {
      setLoading(false);
      return;
    }

    try {
      // Verify token structure first
      if (!token || !isValidToken(token)) {
        throw new Error("Invalid token format");
      }

      // Verify token validity
      await api.post('/api/token/verify/', { token });

      // Get user profile
      const userResponse = await api.get('/api/profile/');
      setUser(userResponse.data?.data || userResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logoutUser();
      }
    } finally {
      setLoading(false);
    }
  }, [logoutUser]);

  // Setup request interceptor
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access_token');
        if (isValidToken(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Setup response interceptor for token refresh
    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!isValidToken(refreshToken)) {
              throw new Error("Invalid refresh token");
            }

            const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
              refresh: refreshToken
            });
            
            const newAccessToken = response.data.access;
            if (!isValidToken(newAccessToken)) {
              throw new Error("Invalid new access token");
            }

            localStorage.setItem('access_token', newAccessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            return api(originalRequest);
          } catch (refreshError) {
            logoutUser();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Initial auth check
    checkAuth();

    // Setup token refresh interval (every 55 minutes)
    const refreshInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!isValidToken(refreshToken)) return;

      try {
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken
        });
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      } catch (error) {
        logoutUser();
      }
    }, 55 * 60 * 1000);

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
      clearInterval(refreshInterval);
    };
  }, [checkAuth, logoutUser]);

  const contextData = {
    user,
    api,
    loginUser,
    logoutUser,
    loading
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;