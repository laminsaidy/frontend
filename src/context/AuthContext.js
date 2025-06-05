import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const AuthContext = createContext();
<<<<<<< HEAD

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  const [loading, setLoading] = useState(true);
  const history = useHistory();
=======
export default AuthContext;

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const history = useHistory();

  // Helper to show error alerts
  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
  };

  // Save tokens in localStorage
  const saveTokens = (access, refresh) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  };

  // Remove tokens from localStorage
  const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };
>>>>>>> dc089331c89ae810e4176373e740ab29aee10da2

  // Get tokens from localStorage
  const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
  const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

  // Decode JWT (optional helper, can use a lib like jwt-decode)
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  // Fetch user profile using access token
  const fetchUserProfile = async (token) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return await res.json();
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('No refresh token available');

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) throw new Error('Failed to refresh token');
    const data = await res.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    return data.access;
  };

  // Login user: POST to /api/token/ to get tokens
  const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

<<<<<<< HEAD
      const data = await response.json();

      if (response.ok) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        history.push("/");
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.detail || "Invalid username or password");
=======
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login failed');
>>>>>>> dc089331c89ae810e4176373e740ab29aee10da2
      }

      const data = await res.json();
      saveTokens(data.access, data.refresh);

      // Get user profile from access token or backend
      const profile = await fetchUserProfile(data.access);
      setUser(profile);

      Swal.fire({
        title: 'Login Successful',
        icon: 'success',
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
      });

      history.push('/tasks');
      return data;
    } catch (error) {
      showErrorAlert(error.message.includes('No active account') ? 'Invalid email or password' : error.message);
      throw error;
    }
  };

  // Register user (same as before, no tokens yet)
  const registerUser = async (email, username, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, password2: password }),
      });
<<<<<<< HEAD

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

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
=======
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Registration failed');
      }
>>>>>>> dc089331c89ae810e4176373e740ab29aee10da2
      Swal.fire({
        title: 'Registration Successful',
        icon: 'success',
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
      });
<<<<<<< HEAD
=======
      return await res.json();
    } catch (error) {
      showErrorAlert(error.message);
>>>>>>> dc089331c89ae810e4176373e740ab29aee10da2
      throw error;
    }
  };

  // Logout user (clear tokens and user state)
  const logoutUser = useCallback(() => {
    clearTokens();
    setUser(null);
<<<<<<< HEAD
    localStorage.removeItem("authTokens");
    history.push("/login");
=======
    history.push('/login');
>>>>>>> dc089331c89ae810e4176373e740ab29aee10da2
    Swal.fire({
      title: 'Logged Out',
      icon: 'success',
      timer: 2000,
      position: 'top-end',
      showConfirmButton: false,
    });
  }, [history]);

<<<<<<< HEAD
  const refreshToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthTokens(data);
        localStorage.setItem("authTokens", JSON.stringify(data));
        setUser(jwtDecode(data.access));
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logoutUser();
    }
  };

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

=======
  // On app start, try to load tokens and fetch profile
>>>>>>> dc089331c89ae810e4176373e740ab29aee10da2
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let access = getAccessToken();
        if (!access) throw new Error('No access token');

        // Optionally check expiry and refresh token if needed here

        // Fetch user profile
        const profile = await fetchUserProfile(access);
        setUser(profile);
      } catch (error) {
        clearTokens();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
<<<<<<< HEAD
    }
    setLoading(false);
  }, [authTokens, logoutUser]);
=======
    };

    initializeAuth();
  }, []);
>>>>>>> dc089331c89ae810e4176373e740ab29aee10da2

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        loginUser,
        logoutUser,
        registerUser,
        getAccessToken, // expose to other components/hooks for auth headers
        refreshAccessToken,
      }}
    >
      {!isInitializing && children}
    </AuthContext.Provider>
  );
};
<<<<<<< HEAD

export default AuthContext;
=======
>>>>>>> dc089331c89ae810e4176373e740ab29aee10da2
