import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuthContext from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import '../styles/components/Registerpage.css';

function Registerpage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== password2) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const success = await registerUser(username, email, password, password2);
      if (success) {
        navigate("/tasks");
      }
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Helmet>
        <title>Register | TaskManager</title>
        <meta name="description" content="Create a new TaskManager account to start managing your tasks" />
      </Helmet>

      <section className="min-vh-85 register-section">
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card register-container">
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="Register illustration"
                      className="img-fluid register-image"
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit}>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i className="fas fa-cubes fa-2x me-3 register-icon" />
                          <span className="h2 fw-bold mb-0">
                            Welcome! <b>👋</b>
                          </span>
                        </div>
                        <h5 className="fw-normal mb-3 pb-3 register-heading">
                          Sign Up Please!
                        </h5>
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="register-email"
                            className="form-control form-control-lg"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                          />
                          <label className="form-label" htmlFor="register-email">
                            Email Address
                          </label>
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="register-username"
                            className="form-control form-control-lg"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                          />
                          <label className="form-label" htmlFor="register-username">
                            Username
                          </label>
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="register-password"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="8"
                            autoComplete="new-password"
                          />
                          <label className="form-label" htmlFor="register-password">
                            Password
                          </label>
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="register-confirm-password"
                            className="form-control form-control-lg"
                            placeholder="Confirm Password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            minLength="8"
                            autoComplete="new-password"
                          />
                          <label className="form-label" htmlFor="register-confirm-password">
                            Confirm Password
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
                            ) : "Register"}
                          </button>
                        </div>
                        <p className="mb-5 pb-lg-2 login-link">
                          Already have an account?{" "}
                          <Link to="/login" className="login-link">
                            Login Now
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

export default Registerpage;