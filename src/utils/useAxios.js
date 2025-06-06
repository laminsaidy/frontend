import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "https://backend-api-calender.onrender.com/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { 
      Authorization: authTokens?.access ? `Bearer ${authTokens.access}` : undefined 
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens?.access) return req;

    try {
      const user = jwtDecode(authTokens.access);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) return req;

      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      if (!response.data.access) throw new Error("Invalid refresh response");

      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));

      req.headers.Authorization = `Bearer ${response.data.access}`;
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