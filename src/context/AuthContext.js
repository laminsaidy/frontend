import { createContext, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { getCSRFToken } from "../utils/csrf";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    try {
      const tokens = localStorage.getItem("authTokens");
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error("Error parsing auth tokens:", error);
      return null;
    }
  });
  
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const history = useHistory();

  const handleApiError = (error, defaultMessage = "An error occurred") => {
    console.error("API Error:", error);
    const message = error.message.includes("<!doctype") 
      ? "Server returned an unexpected response" 
      : error.message || defaultMessage;
      
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    
    return message;
  };

  const loginUser = async (email, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/token/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid server response");
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || "Login failed");
      }

      const tokens = {
        access: data.access,
        refresh: data.refresh,
      };
      
      setUser(data.user || { email }); // Fallback to email if user data not provided
      setAuthTokens(tokens);
      
      try {
        localStorage.setItem("authTokens", JSON.stringify(tokens));
      } catch (storageError) {
        console.error("LocalStorage error:", storageError);
      }

      history.push("/tasks");
      Swal.fire({
        title: "Login Successful",
        icon: "success",
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
      });
      
      return data;
    } catch (error) {
      throw new Error(handleApiError(error, "Login failed"));
    }
  };

  const logoutUser = useCallback(async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setAuthTokens(null);
      setUser(null);
      try {
        localStorage.removeItem("authTokens");
      } catch (error) {
        console.error("LocalStorage error:", error);
      }
      history.push("/login");
      Swal.fire({
        title: "Logged Out",
        icon: "success",
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
      });
    }
  }, [history]);

  const refreshToken = useCallback(async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return null;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/token/refresh/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          body: JSON.stringify({ refresh: authTokens.refresh }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid refresh response");
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Token refresh failed");
      }

      const newTokens = {
        access: data.access,
        refresh: authTokens.refresh, // Keep original refresh token
      };
      
      setAuthTokens(newTokens);
      
      try {
        localStorage.setItem("authTokens", JSON.stringify(newTokens));
      } catch (error) {
        console.error("LocalStorage error:", error);
      }
      
      return data.access;
    } catch (error) {
      handleApiError(error, "Session expired. Please login again.");
      logoutUser();
      throw error;
    }
  }, [authTokens?.refresh, logoutUser]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (authTokens?.access) {
        try {
          // Optionally: Fetch user profile here if not included in login response
          // const profile = await fetchUserProfile();
          // setUser(profile);
        } catch (error) {
          handleApiError(error, "Failed to initialize session");
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [authTokens]);

  // Setup token refresh interval
  useEffect(() => {
    if (!authTokens) return;

    const refreshInterval = setInterval(() => {
      refreshToken().catch(error => {
        console.error("Auto-refresh failed:", error);
      });
    }, 1000 * 60 * 14); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [authTokens, refreshToken]);

  // Provide auth context
  const contextData = {
    user,
    authTokens,
    isInitializing,
    loginUser,
    logoutUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!isInitializing && children}
    </AuthContext.Provider>
  );
};