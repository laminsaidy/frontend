import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://127.0.0.1:8081' : '');
if (!API_BASE_URL) {
  console.error('REACT_APP_API_BASE_URL is not set');
}

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
    toast.info("Logged out successfully", {
      position: "top-right",
      autoClose: 3000,
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
          error.response?.data?.code === "token_not_valid" &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/token/refresh/")
        ) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken || refreshToken === "undefined" || refreshToken === "null") {
              throw new Error("No refresh token");
            }
            const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
              refresh: refreshToken,
            });
            localStorage.setItem("access_token", response.data.access);
            api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
            return api(originalRequest);
          } catch {
            logoutUser();
            return Promise.reject(error);
          }
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/unauthorized");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [logoutUser, navigate]);

  const loginUser = async (username, password) => {
    try {
      const response = await api.post('/api/token/', { username, password });
      const access = response.data.access;
      const refresh = response.data.refresh;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const userResponse = await axios.get(`${API_BASE_URL}/api/user/`, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });

      setUser(userResponse.data?.data || userResponse.data);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      navigate('/');
      toast.success("Login Successful", {
        position: "top-right",
        autoClose: 3000,
      });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }
  };

  const registerUser = async (username, email, password, password2) => {
    try {
      const response = await api.post('/api/register/', {
        email, username, password, password2,
      });
      if (response.status === 201) {
        toast.success("Registration Successful! Please login.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/login');
        return true;
      }
    } catch (error) {
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
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
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
      setUser(userResponse.data?.data || userResponse.data);
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
    }, 4 * 60 * 1000);
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
