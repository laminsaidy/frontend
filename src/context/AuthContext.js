import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const AuthContext = createContext();
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login failed');
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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Registration failed');
      }
      Swal.fire({
        title: 'Registration Successful',
        icon: 'success',
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
      });
      return await res.json();
    } catch (error) {
      showErrorAlert(error.message);
      throw error;
    }
  };

  // Logout user (clear tokens and user state)
  const logoutUser = useCallback(() => {
    clearTokens();
    setUser(null);
    history.push('/login');
    Swal.fire({
      title: 'Logged Out',
      icon: 'success',
      timer: 2000,
      position: 'top-end',
      showConfirmButton: false,
    });
  }, [history]);

  // On app start, try to load tokens and fetch profile
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
    };

    initializeAuth();
  }, []);

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
