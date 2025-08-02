import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8081';

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

  const logoutUser = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    Swal.fire({
      title: "Logged out successfully",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "top-end",
      showConfirmButton: false,
    });
  }, [navigate]);

  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access_token');
        if (token && token !== "undefined" && token !== "null") {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          delete config.headers.Authorization;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const resInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/token/refresh/")
        ) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
              throw new Error('No refresh token available');
            }
            const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
              refresh: refreshToken,
            });
            localStorage.setItem('access_token', response.data.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            return api(originalRequest);
          } catch {
            logoutUser();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [logoutUser]);

  const loginUser = async (username, password) => {
    try {
      const response = await api.post('/api/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      const userResponse = await api.get('/api/user/');
      setUser(userResponse.data);
      navigate('/');
      Swal.fire({
        title: "Login Successful",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-end",
        showConfirmButton: false,
      });
      return true;
    } catch (error) {
      Swal.fire({
        title: error.response?.data?.detail || "Login failed",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-end",
        showConfirmButton: false,
      });
      return false;
    }
  };

  const registerUser = async (username, email, password, password2) => {
    try {
      console.log('Registering user with data:', { email, username, password, password2 });
      const response = await api.post('/api/register/', {
        email, username, password, password2,
      });
      if (response.status === 201) {
        Swal.fire({
          title: "Registration Successful! Please login.",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-end",
          showConfirmButton: false,
        });
        navigate('/login');
        return true;
      }
    } catch (error) {
      console.error('Registration error response:', error.response?.data);
      let errorMessage = "Registration failed";
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = Object.values(error.response.data).flat().join('\n');
        } else if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data.join('\n');
        } else {
          errorMessage = error.response.data;
        }
      }
      Swal.fire({
        title: errorMessage,
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-end",
        showConfirmButton: false,
      });
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
      const userResponse = await api.get('/api/user/');
      setUser(userResponse.data);
    } catch {
      logoutUser();
    } finally {
      setLoading(false);
    }
  }, [logoutUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
        return;
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem("access_token", response.data.access);
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      } catch {
        logoutUser();
      }
    }, 4 * 60 * 1000); // every 4 minutes
    return () => clearInterval(interval);
  }, [logoutUser]);

  const contextData = {
    user,
    api,
    loginUser,
    logoutUser,
    registerUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
