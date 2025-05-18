import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "https://calendar-backend-gpkd.onrender.com/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(async (config) => {
    if (!authTokens?.access) return config;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (isExpired) {
      try {
        const response = await axios.post(`${baseURL}/token/refresh/`, {
          refresh: authTokens.refresh,
        });

        localStorage.setItem("authTokens", JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));

        config.headers.Authorization = `Bearer ${response.data.access}`;
      } catch (error) {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        return Promise.reject(error);
      }
    } else {
      config.headers.Authorization = `Bearer ${authTokens.access}`;
    }

    return config;
  });

  return axiosInstance;
};

export default useAxios;
