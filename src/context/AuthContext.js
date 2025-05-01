import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwtDecode(JSON.parse(tokens).access) : null;
  });

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/token/`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register/`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, username, password, password2 }),
      });

      if (response.status === 201) {
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
      } else {
        const errorData = await response.json();
        if (errorData.email) {
          throw new Error(errorData.email[0]);
        } else if (errorData.username) {
          throw new Error(errorData.username[0]);
        } else if (errorData.password) {
          throw new Error(errorData.password[0]);
        } else {
          throw new Error(errorData.detail || `Error: ${response.status}`);
        }
      }
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/token/refresh/`, {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
