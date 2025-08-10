import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                    (window.location.hostname === 'localhost' ? 'http://127.0.0.1:8081' : 'https://backend-render-api-calender.onrender.com');

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

  // Logout function (no WebSocket cleanup)
  const logoutUser = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    toast.info("Logged out successfully");
  }, [navigate]);

  // Login function (ensures token is valid before proceeding)
  const loginUser = async (username, password) => {
    try {
      // 1. Get tokens
      const response = await axios.post(`${API_BASE_URL}/api/token/`, { 
        username, 
        password 
      });

      const { access, refresh } = response.data;

      // 2. Validate tokens before storing
      if (!access || !refresh) {
        throw new Error("Invalid token response");
      }

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 3. Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // 4. Fetch user profile (with token attached)
      const userResponse = await api.get('/api/profile/');
      setUser(userResponse.data?.data || userResponse.data);

      navigate('/tasks');
      toast.success("Login Successful");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.detail || "Login failed");
      return false;
    }
  };

  // Check auth status on app load
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Verify token
      await api.post('/api/token/verify/', { token });

      // Fetch user data
      const userResponse = await api.get('/api/profile/');
      setUser(userResponse.data?.data || userResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logoutUser(); // Auto-logout if token is invalid
      }
    } finally {
      setLoading(false);
    }
  }, [logoutUser]);

  // Setup axios interceptors (for token refresh)
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          logoutUser(); // Force logout on 401 errors
        }
        return Promise.reject(error);
      }
    );

    checkAuth(); // Initial auth check

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [checkAuth, logoutUser]);

  const contextData = {
    user,
    api,
    loginUser,
    logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;