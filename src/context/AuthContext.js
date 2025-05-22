import { createContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCSRFToken } from '../utils/csrf';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const history = useHistory();

  const handleApiError = (error, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error);
    const message = error.message.includes('<!doctype')
      ? 'Server returned an unexpected response'
      : error.message || defaultMessage;

    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      position: 'top-end',
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
          method: 'POST',
          credentials: 'include', // Essential for cookies
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.detail ||
          data.message ||
          (data.non_field_errors && data.non_field_errors.join(', ')) ||
          'Authentication failed';
        throw new Error(errorMsg);
      }

      // Backend sets tokens in cookies - we only need to store user data
      setUser(data.user || { email });

      history.push('/tasks');
      Swal.fire({
        title: 'Login Successful',
        icon: 'success',
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
      });

      return data;
    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text: error.message.includes('Invalid credentials')
          ? 'Incorrect email or password'
          : error.message,
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      throw error;
    }
  };

  const registerUser = async (email, username, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/register/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
          body: JSON.stringify({
            email,
            username,
            password,
            password2: password,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');

      return data; // { user: { email, username } }
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = useCallback(async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCSRFToken(),
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      history.push('/login');
      Swal.fire({
        title: 'Logged Out',
        icon: 'success',
        timer: 2000,
        position: 'top-end',
        showConfirmButton: false,
      });
    }
  }, [history]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/profile/`,
          {
            credentials: 'include',
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []);

  const contextData = {
    user,
    isInitializing,
    loginUser,
    logoutUser,
    registerUser, // Add this line
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!isInitializing && children}
    </AuthContext.Provider>
  );
};
