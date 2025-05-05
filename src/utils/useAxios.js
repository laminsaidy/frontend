import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  // Safe CSRF token extraction
  const getCSRFToken = () => {
    try {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
      return cookie ? cookie.split('=')[1] : null;
    } catch (error) {
      console.error("Error getting CSRF token:", error);
      return null;
    }
  };

  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      ...(authTokens?.access && { Authorization: `Bearer ${authTokens.access}` }),
      ...(getCSRFToken() && { 'X-CSRFToken': getCSRFToken() })
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens?.access) {
      return req;
    }

    try {
      const user = jwtDecode(authTokens.access);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) return req;

      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh,
      }, { withCredentials: true });

      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));

      req.headers.Authorization = `Bearer ${response.data.access}`;
    } catch (error) {
      console.error("Token refresh failed:", error);
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem("authTokens");
      // Redirect to login or handle unauthorized state
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;