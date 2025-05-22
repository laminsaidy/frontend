import axios from 'axios';
import { useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext';

const baseURL = process.env.REACT_APP_API_URL + '/api';

const useAxios = () => {
  const { logoutUser, getAccessToken, refreshAccessToken } = useContext(AuthContext);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    // Attach Authorization header with access token
    instance.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401 errors (token expiry)
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Try refreshing token
            const newAccessToken = await refreshAccessToken();
            // Update Authorization header and retry original request
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            logoutUser();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [logoutUser, getAccessToken, refreshAccessToken]);

  return axiosInstance;
};

export default useAxios;
