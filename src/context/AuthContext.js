import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwtDecode(JSON.parse(tokens).access) : null;
  });

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const loginUser = async (email, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/token/`,
        {
          method: "POST",
          mode: "cors", // Explicitly enable CORS mode
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include", // Required for cookies/sessions
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const data = await response.json();

      // Handle successful login
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));

      // Redirect to home page
      history.push("/");

      // Show success notification
      Swal.fire({
        title: "Login Successful",
        icon: "success",
        toast: true,
        timer: 6000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false,
      });

      return data;
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: error.message || "An error occurred during login",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      throw error; // Re-throw for additional error handling if needed
    }
  };

  const registerUser = async (email, username, password, password2) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/register/`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, username, password, password2 }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.email) throw new Error(errorData.email[0]);
        if (errorData.username) throw new Error(errorData.username[0]);
        if (errorData.password) throw new Error(errorData.password[0]);
        throw new Error(
          errorData.detail || `Registration failed (${response.status})`
        );
      }

      const data = await response.json();
      history.push("/login");

      Swal.fire({
        title: "Registration Successful. Please login.",
        icon: "success",
        toast: true,
        timer: 6000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false,
      });

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: error.message || "An error occurred during registration",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      throw error;
    }
  };

  const logoutUser = useCallback(() => {
    // Clear all auth data
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");

    // Attempt to notify backend of logout
    fetch(`${process.env.REACT_APP_API_URL}/api/logout/`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).catch(console.error); // Silent fail if logout API fails

    // Redirect to login page
    history.push("/login");

    // Show logout notification
    Swal.fire({
      title: "You have been logged out",
      icon: "success",
      toast: true,
      timer: 6000,
      position: "top",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }, [history]);

  const refreshToken = useCallback(async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/token/refresh/`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ refresh: authTokens.refresh }),
        }
      );

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      setAuthTokens(data);
      localStorage.setItem("authTokens", JSON.stringify(data));
      setUser(jwtDecode(data.access));
      return data;
    } catch (error) {
      console.error("Token refresh error:", error);
      logoutUser();
      throw error;
    }
  }, [authTokens?.refresh, logoutUser, setAuthTokens, setUser]);

  // Auto-refresh token logic
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (authTokens) {
        refreshToken().catch(console.error);
      }
    }, 1000 * 60 * 14); // Refresh every 14 minutes

    return () => clearInterval(refreshInterval);
  }, [authTokens, refreshToken]); 

  useEffect(() => {
    if (authTokens) {
      const decodedToken = jwtDecode(authTokens.access);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();

      if (isTokenExpired) {
        if (authTokens.refresh) {
          refreshToken().catch(() => logoutUser());
        } else {
          logoutUser();
        }
      } else {
        setUser(decodedToken);
      }
    }
    setLoading(false);
  }, [authTokens, logoutUser, refreshToken]); // 

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
