import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();
const backendUrl = "https://backend-api-calender.onrender.com";

// Token validation helper
const validateToken = (token) => {
  return token && typeof token === 'string' && token.split('.').length === 3;
};

// Safe decoding wrapper
const safeDecode = (token) => {
  if (!validateToken(token)) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    try {
      const tokens = localStorage.getItem("authTokens");
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const tokens = localStorage.getItem("authTokens");
      return tokens ? safeDecode(JSON.parse(tokens).access) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${backendUrl}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!validateToken(data.access)) {
          throw new Error("Invalid token received from server");
        }
        
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(safeDecode(data.access));
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
        throw new Error(data.detail || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: error.message || "Login error",
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
      const response = await fetch(`${backendUrl}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, password2 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

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
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: error.message || "Registration error",
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
      title: "Logged out successfully",
      icon: "success",
      toast: true,
      timer: 6000,
      position: "top",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }, [history]);

  const refreshToken = async () => {
    if (!validateToken(authTokens?.refresh)) {
      logoutUser();
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Token refresh failed");
      if (!validateToken(data.access)) throw new Error("Invalid refreshed token");

      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(safeDecode(data.access));
    } catch (error) {
      console.error("Refresh token error:", error);
      logoutUser();
    }
  };

  const contextData = {
    user,
    authTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
  };

  useEffect(() => {
    if (authTokens?.access) {
      const decoded = safeDecode(authTokens.access);
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        logoutUser();
      } else {
        setUser(decoded);
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