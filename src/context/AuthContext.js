import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        history.push("/");
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.detail || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: error.message || "An error occurred during login",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const registerUser = async (email, username, password, password2) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password, password2 }),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      history.push("/login");
      Swal.fire({
        title: "Registration Successful. Please login.",
        icon: "success",
        toast: true,
        timer: 6000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false,
      });

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: error.message || "An error occurred during registration",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      throw error;
    }
  };

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history.push("/login");
    Swal.fire({
      title: "You have been logged out",
      icon: "success",
      toast: true,
      timer: 6000,
      position: "top",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }, [history]);

  const refreshToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthTokens(data);
        localStorage.setItem("authTokens", JSON.stringify(data));
        setUser(jwtDecode(data.access));
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logoutUser();
    }
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
  };

  useEffect(() => {
    if (authTokens) {
      const decodedToken = jwtDecode(authTokens.access);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();
      if (isTokenExpired) {
        logoutUser();
      } else {
        setUser(decodedToken);
      }
    }
    setLoading(false);
  }, [authTokens, logoutUser]);

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
