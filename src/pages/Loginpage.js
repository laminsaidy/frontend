import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import '../styles/components/Loginpage.css';

function Loginpage() {
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      await loginUser(email, password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      // For debugging only (remove in production)
      console.error("Login error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <section className="min-vh-85 login-section">
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card login-container">
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="login form"
                      className="img-fluid login-image"
                      crossOrigin="anonymous" // Added for security
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit} autoComplete="on">
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i className="fas fa-cubes fa-2x me-3 login-icon" />
                          <span className="h2 fw-bold mb-0">
                            Hello! Welcome back👋
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
                            type="email"
                            id="email"
                            className="form-control form-control-lg"
                            name="email"
                            autoComplete="username"
                            required
                          />
                          <label className="form-label" htmlFor="email">
                            Email address
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
                            {isLoading ? "Logging in..." : "Login"}
                          </button>
                        </div>

                        <a className="small text-muted" href="#!">
                          Forgot password?
                        </a>

                        <p className="mb-5 pb-lg-2 register-link">
                          Don't have an account?{" "}
                          <Link to="/register" className="register-link">
                            Register Now
                          </Link>
                        </p>

                        <Link to="/terms" className="small text-muted me-2">
                          Terms of use.
                        </Link>
                        <Link to="/privacy" className="small text-muted">
                          Privacy policy
                        </Link>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-light text-center text-lg-start footer">
        <div className="footer">
          <p>
            Copyright &copy; 2025; Designed by{" "}
            <span className="creator">
              <a
                href="https://github.com/laminsaidy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lamin Saidy
              </a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Loginpage;