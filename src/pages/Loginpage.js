import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../context/AuthContext";
import "../styles/components/Loginpage.css";
import SmileyImage from "../assets/images/Smiley.jpg";

function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    // Handle login logic
  };

  return (
    <div>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login to your task manager account." />
      </Helmet>
      <section className="min-vh-85 login-section">
        {/* Login form */}
      </section>
    </div>
  );
}

export default LoginPage;
