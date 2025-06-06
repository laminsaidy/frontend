import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// Update the baseURL to point to the live backend on Render
const baseURL = "https://backend-api-calender.onrender.com/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (!authTokens?.access) {
      // Handle the case where authTokens is missing
      return req;
    }

    const user = jwtDecode(authTokens.access); // Use jwtDecode
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));

      req.headers.Authorization = `Bearer ${response.data.access}`;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Handle the error (e.g., log out the user)
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem("authTokens");
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;
