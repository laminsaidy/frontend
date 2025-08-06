import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/components/Loginpage.css";
import SmileyImage from "../assets/images/Smiley.jpg";

function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username").trim();
    const password = formData.get("password");

    if (!username || !password) {
      setError("Username and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const success = await loginUser(username, password);
      if (success) {
        navigate("/tasks");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Login | TaskManager</title>
        <meta name="description" content="Login to your TaskManager account to access your tasks and productivity tools" />
      </Helmet>

      <section className="min-vh-85 login-section">
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card login-container">
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src={SmileyImage}
                      alt="Login illustration"
                      className="img-fluid login-image"
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit} autoComplete="on">
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i className="fas fa-cubes fa-2x me-3 login-icon" />
                          <span className="h2 fw-bold mb-0">
                            Hello! Welcome back 👋
                          </span>
                        </div>
                        <h5 className="fw-normal mb-3 pb-3 login-heading">
                          Sign into your account!
                        </h5>
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="username"
                            className="form-control form-control-lg"
                            name="username"
                            autoComplete="username"
                            required
                          />
                          <label className="form-label" htmlFor="username">
                            Username
                          </label>
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="password"
                            className="form-control form-control-lg"
                            name="password"
                            autoComplete="current-password"
                            required
                            minLength="8"
                          />
                          <label className="form-label" htmlFor="password">
                            Password
                          </label>
                        </div>
                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <LoadingSpinner small />
                            ) : "Login"}
                          </button>
                        </div>
                        <p className="mb-5 pb-lg-2 register-link">
                          Don't have an account?{" "}
                          <Link to="/register" className="register-link">
                            Register Now
                          </Link>
                        </p>
                        <div className="policy-links">
                          <Link to="/terms" className="small text-muted me-2">
                            Terms of use
                          </Link>
                          <Link to="/privacy" className="small text-muted">
                            Privacy policy
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;