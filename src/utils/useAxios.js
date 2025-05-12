import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    }
  });

  // Add JWT token to all requests
  axiosInstance.interceptors.request.use((config) => {
    if (authTokens?.access) {
      config.headers.Authorization = `Bearer ${authTokens.access}`;
    }
    return config;
  });

  // Handle token refresh
  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens?.access) return req;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!isExpired) return req;

    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh
      });

      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));

      req.headers.Authorization = `Bearer ${response.data.access}`;
    } catch (error) {
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem("authTokens");
      return Promise.reject(error);
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;