import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  if (tokens?.token) {
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
      const response = await api.post('/api/token/', {
        email,
        password
      });

      if (response.status === 200) {
        const { access, refresh, user } = response.data;

        if (!access) {
          throw new Error("Authentication token missing in response");
        }

        const authData = {
          token: access,
          refresh,
          user: user || {
            id: response.data.user_id,
            email: email,
            username: email.split('@')[0]
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
      console.error("Login Error:", {
        error: error.response?.data || error.message,
        request: { email }
      });

      let errorMessage = "Login failed";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0];
      }

      Swal.fire({
        title: errorMessage,
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
      if (!email || !username || !password || !password2) {
        throw new Error("All fields are required");
      }
      if (password !== password2) {
        throw new Error("Passwords do not match");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const response = await api.post('/api/register/', {
        email,
        username,
        password,
        password2
      });

      if (response.status >= 200 && response.status < 300) {
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
      throw new Error(response.data?.error || "Registration failed");
    } catch (error) {
      console.error("Registration Error:", {
        error: error.response?.data || error.message,
        request: { email, username }
      });

      let errorMessage = "Registration failed";
      if (error.response?.data?.email) {
        errorMessage = `Email: ${error.response.data.email[0]}`;
      } else if (error.response?.data?.username) {
        errorMessage = `Username: ${error.response.data.username[0]}`;
      } else if (error.response?.data?.password) {
        errorMessage = `Password: ${error.response.data.password[0]}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: errorMessage,
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

  const refreshToken = useCallback(async () => {
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
          token: data.access,
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
  }, [logoutUser]);

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
      if (authTokens?.token) {
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
  }, [authTokens, refreshToken]);

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
