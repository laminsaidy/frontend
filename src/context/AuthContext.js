import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const AuthContext = createContext();
const backendUrl = "https://backend-api-calender.onrender.com";

// Configure axios instance
const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Add request interceptor
api.interceptors.request.use(config => {
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  if (tokens?.token) {  // Changed from tokens?.access
    config.headers.Authorization = `Bearer ${tokens.token}`;
  }
  return config;
});

const validateToken = (token) => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    return parts.length === 3;
  } catch {
    return false;
  }
};

const safeDecode = (token) => {
  if (!validateToken(token)) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    try {
      const tokens = localStorage.getItem("authTokens");
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    const tokens = JSON.parse(localStorage.getItem("authTokens"));
    return tokens?.user || (tokens?.token ? safeDecode(tokens.token) : null);
  });

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const loginUser = async (email, password) => {
    try {
      const response = await api.post('/api/token/', { email, password });
      const data = response.data;

      if (response.status === 200) {
        const token = data.token || data.access;
        if (!validateToken(token)) {
          throw new Error("Invalid token format received");
        }

        const authData = {
          token: token,  // Using 'token' consistently
          refresh: data.refresh,
          user: data.user || {
            id: data.user_id,
            email: email,
            username: data.username || email.split('@')[0]
          }
        };

        localStorage.setItem("authTokens", JSON.stringify(authData));
        setAuthTokens(authData);
        setUser(authData.user);

        history.push("/");
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-end",
          showConfirmButton: false,
        });
        return true;
      }
      throw new Error(data.detail || "Login failed");
    } catch (error) {
      console.error("Login Error:", {
        error: error.response?.data || error.message,
        request: { email }
      });
      Swal.fire({
        title: error.response?.data?.detail || "Invalid credentials",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-end",
        showConfirmButton: false,
      });
      throw error;
    }
  };

  const registerUser = async (email, username, password, password2) => {
    try {
      const response = await api.post('/api/register/', {
        email,
        username,
        password,
        password2
      });

      if (response.status >= 200 && response.status < 300) {
        history.push("/login");
        Swal.fire({
          title: "Registration Successful! Please login.",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-end",
          showConfirmButton: false,
        });
        return true;
      }
      throw new Error(response.data.error || "Registration failed");
    } catch (error) {
      console.error("Registration Error:", {
        error: error.response?.data || error.message,
        request: { email, username }
      });
      Swal.fire({
        title: error.response?.data?.error || "Registration failed",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-end",
        showConfirmButton: false,
      });
      throw error;
    }
  };

  const logoutUser = useCallback(() => {
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    history.push("/login");
    Swal.fire({
      title: "Logged out successfully",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "top-end",
      showConfirmButton: false,
    });
  }, [history]);

  const refreshToken = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("authTokens"));
      if (!tokens?.refresh) {
        logoutUser();
        return;
      }

      const response = await api.post('/api/token/refresh/', {
        refresh: tokens.refresh
      });

      const data = response.data;
      if (response.status === 200 && validateToken(data.access)) {
        const updatedTokens = {
          ...tokens,
          token: data.access,  // Using 'token' consistently
          user: data.user || tokens.user
        };

        localStorage.setItem("authTokens", JSON.stringify(updatedTokens));
        setAuthTokens(updatedTokens);
        setUser(updatedTokens.user);
        return true;
      }
      throw new Error("Token refresh failed");
    } catch (error) {
      console.error("Refresh Token Error:", error);
      logoutUser();
      return false;
    }
  };

  const contextData = {
    user,
    authTokens,
    api,
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (authTokens?.token) {  // Changed from authTokens?.access
        const decoded = safeDecode(authTokens.token);
        if (!decoded || decoded.exp * 1000 < Date.now()) {
          await refreshToken();
        }
      }
      setLoading(false);
    };

    verifyToken();
    const interval = setInterval(verifyToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;