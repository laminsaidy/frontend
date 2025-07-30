import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../context/AuthContext";
import '../styles/components/Registerpage.css';

function Registerpage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    // Handle registration logic
  };

  return (
    <div>
      <Helmet>
        <title>Register</title>
        <meta name="description" content="Register for a new task manager account." />
      </Helmet>
      <section className="min-vh-85 register-section">
        {/* Registration form */}
      </section>
    </div>
  );
}

export default Registerpage;
