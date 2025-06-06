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
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

const validateToken = (token) => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    return parts.length === 3; // Proper JWT format
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
    return tokens?.user || (tokens?.access ? safeDecode(tokens.access) : null);
  });

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const loginUser = async (email, password) => {
    try {
      const response = await api.post('/api/token/', { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Full login response:", response); // Debug log

      if (response.status === 200) {
        const { token, refresh, user } = response.data;

        if (!token) {
          throw new Error("Authentication token missing in response");
        }

        const authData = {
          token,
          refresh,
          user: {
            id: user?.id,
            email: user?.email,
            username: user?.username
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
      throw new Error(response.data?.detail || "Login failed");

    } catch (error) {
      console.error("Detailed login error:", {
        error: error.response?.data || error.message,
        request: { email }
      });
      Swal.fire({
        title: error.message || "Login error",
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
      } else {
        throw new Error(response.data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: error.message || "Registration error",
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
          access: data.access,
          user: data.user || tokens.user
        };

        localStorage.setItem("authTokens", JSON.stringify(updatedTokens));
        setAuthTokens(updatedTokens);
        setUser(updatedTokens.user);
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      logoutUser();
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
      if (authTokens?.access) {
        const decoded = safeDecode(authTokens.access);
        if (!decoded || decoded.exp * 1000 < Date.now()) {
          await refreshToken();
        }
      }
      setLoading(false);
    };

    verifyToken();
    const interval = setInterval(() => {
      if (authTokens?.access) {
        verifyToken();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [authTokens, refreshToken]);

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
