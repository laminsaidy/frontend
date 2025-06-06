import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";  // Changed from useNavigate to useHistory
import AuthContext from "../context/AuthContext";
import "../styles/components/Loginpage.css";
import SmileyImage from "../assets/images/Smiley.jpg";

function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();  // Changed from useNavigate to useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get("email").trim();
    const password = formData.get("password");

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const loginSuccess = await loginUser(email, password);
      if (loginSuccess) {
        history.push("/");  // Changed from navigate to history.push
      }
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      
      if (err.message.includes("credentials")) {
        errorMessage = "Invalid email or password";
      } else if (err.response?.status === 400) {
        errorMessage = "Validation error - check your input";
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component remains the same ...
}

export default LoginPage;