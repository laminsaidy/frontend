import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getCSRFToken } from "../utils/csrf";

const baseURL = process.env.REACT_APP_API_URL + "/api";

const useAxios = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    timeout: 15000,
  });

  axiosInstance.interceptors.request.use(async (config) => {
    if (!authTokens?.access) return config;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) {
      config.headers.Authorization = `Bearer ${authTokens.access}`;
      return config;
    }

    try {
      const response = await axios.post(`${baseURL}/auth/token/refresh/`, {
        refresh: authTokens.refresh,
      }, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": getCSRFToken(),
        }
      });

      config.headers.Authorization = `Bearer ${response.data.access}`;
      return config;
    } catch (error) {
      logoutUser();
      return Promise.reject(error);
    }
  });

  return axiosInstance;
};

export default useAxios;