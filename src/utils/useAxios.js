import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getCSRFToken } from '../utils/csrf';

const baseURL = process.env.REACT_APP_API_URL + '/api';

const useAxios = () => {
  const { logoutUser } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true, // Essential for cookies
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    timeout: 15000,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
