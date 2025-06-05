import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import '../styles/components/Registerpage.css';

function Registerpage() {
  // State hooks to handle form inputs for email, username, password, and confirm password
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Destructure registerUser from AuthContext
  const { registerUser } = useContext(AuthContext);

  // Handle form submission and call registerUser with the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(email, username, password, password2);
  };

  return (
    <div>
      <section className="min-vh-85 register-section">
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card register-container">
                <div className="row g-0">
                  {/* Left-side image */}
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="register form"
                      className="img-fluid register-image"
                    />
                  </div>
                  {/* Right-side form */}
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      {/* Registration form */}
                      <form onSubmit={handleSubmit}>
                        {/* Welcome message */}
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i className="fas fa-cubes fa-2x me-3 register-icon" />
                          <span className="h2 fw-bold mb-0">
                            Welcome! <b>👋</b>
                          </span>
                        </div>

                        {/* Header text */}
                        <h5 className="fw-normal mb-3 pb-3 register-heading">
                          Sign Up Please!
                        </h5>

                        {/* Email input field */}
                        <div className="form-outline mb-4">
                          <label htmlFor="register-email" className="form-label visually-hidden">Email Address</label>
                          <input
                            type="email"
                            id="register-email"
                            className="form-control form-control-lg"
                            placeholder="Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        {/* Username input field */}
                        <div className="form-outline mb-4">
                          <label htmlFor="register-username" className="form-label visually-hidden">Username</label>
                          <input
                            type="text"
                            id="register-username"
                            className="form-control form-control-lg"
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>

                        {/* Password input field */}
                        <div className="form-outline mb-4">
                          <label htmlFor="register-password" className="form-label visually-hidden">Password</label>
                          <input
                            type="password"
                            id="register-password"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                          />
                        </div>

                        {/* Confirm password input field */}
                        <div className="form-outline mb-4">
                          <label htmlFor="register-confirm-password" className="form-label visually-hidden">Confirm Password</label>
                          <input
                            type="password"
                            id="register-confirm-password"
                            className="form-control form-control-lg"
                            placeholder="Confirm Password"
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            minLength="6"
                          />
                        </div>

                        {/* Submit button */}
                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                          >
                            Register
                          </button>
                        </div>

                        {/* Link to Login page if the user already has an account */}
                        <p className="mb-5 pb-lg-2 login-link">
                          Already have an account?{" "}
                          <Link to="/login" className="login-link">
                            Login Now
                          </Link>
                        </p>

                        {/* Links to terms of use and privacy policy */}
                        <a href="#!" className="small text-muted">
                          Terms of use.
                        </a>
                        <a href="#!" className="small text-muted">
                          Privacy policy
                        </a>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with copyright */}
      <footer className="bg-light text-center text-lg-start footer">
        <div className="footer">
          <p>
            Copyright &copy; 2025; Designed by{" "}
            <span className="creator">
              <a
                href="https://github.com/laminsaidy"
                target="_blank"
                rel="noreferrer"
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

export default Registerpage;