import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const API_BASE_URL = 'http://127.0.0.1:8000';

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authTokens?.token ? `Bearer ${authTokens.token}` : undefined,
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens?.token) return req;

    try {
      const user = jwtDecode(authTokens.token);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) return req;

      const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
        refresh: authTokens.refresh,
      }, {
        withCredentials: true,
      });

      if (!response.data.access) throw new Error("Invalid refresh response");

      const tokens = {
        ...authTokens,
        token: response.data.access,
        refresh: response.data.refresh || authTokens.refresh,
      };

      localStorage.setItem("authTokens", JSON.stringify(tokens));
      setAuthTokens(tokens);
      setUser(jwtDecode(tokens.token));

      req.headers.Authorization = `Bearer ${tokens.token}`;
    } catch (error) {
      console.error("Token refresh failed:", error);
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem("authTokens");
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;
