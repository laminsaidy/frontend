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
  withCredentials: true,
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logoutUser = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    toast.info("Logged out successfully");
  }, [navigate]);

  const attachTokenToRequest = useCallback((config) => {
    const token = localStorage.getItem('access_token');
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, []);

  const handleUnauthorizedError = useCallback(async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken
        });

        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        const errorMessage = refreshError.response?.data?.detail || "Session expired. Please log in again.";
        toast.error(errorMessage);
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }, [logoutUser]);

  const setupInterceptors = useCallback(() => {
    const reqInterceptor = api.interceptors.request.use((config) => {
      return attachTokenToRequest(config);
    }, (error) => {
      return Promise.reject(error);
    });

    const resInterceptor = api.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      return handleUnauthorizedError(error);
    });

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [attachTokenToRequest, handleUnauthorizedError]);

  const loginUser = async (username, password) => {
    try {
      const response = await api.post('/api/token/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      const userResponse = await api.get('/api/profile/');
      setUser(userResponse.data?.data || userResponse.data);
      navigate('/tasks');
      toast.success("Login Successful");
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Login failed. Please check your credentials and try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  const registerUser = async (username, email, password, password2) => {
    try {
      const response = await api.post('/api/register/', {
        username, email, password, password2
      });
      if (response.status === 201) {
        toast.success("Registration Successful! Please login.");
        navigate('/login');
        return true;
      }
    } catch (error) {
      const errorMessage = error.response?.data ?
        (typeof error.response.data === 'object' ?
          Object.values(error.response.data).flat().join('\n') :
          error.response.data) :
        "Registration failed";
      toast.error(errorMessage);
      return false;
    }
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token || token === "undefined" || token === "null") {
      setLoading(false);
      return;
    }
    try {
      await api.post('/api/token/verify/', { token });
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

  const setupTokenRefresh = useCallback(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return;
      try {
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken
        });
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      } catch (error) {
        console.error('Token refresh failed:', error);
        logoutUser();
      }
    }, 55 * 60 * 1000); // 55 minutes
    return () => clearInterval(interval);
  }, [logoutUser]);

  useEffect(() => {
    const cleanupInterceptors = setupInterceptors();
    const cleanupRefresh = setupTokenRefresh();
    checkAuth();
    return () => {
      cleanupInterceptors();
      cleanupRefresh();
    };
  }, [setupInterceptors, setupTokenRefresh, checkAuth]);

  const contextData = {
    user,
    api,
    loginUser,
    logoutUser,
    registerUser,
    loading,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
