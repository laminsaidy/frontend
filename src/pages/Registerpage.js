import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/components/Registerpage.css';
import registerImage from '../assets/images/register.jpg';

function Registerpage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const { registerUser } = useContext(AuthContext);

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
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src={registerImage}
                      alt="register form"
                      className="img-fluid register-image"
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit} autoComplete="on">
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i className="fas fa-cubes fa-2x me-3 register-icon" />
                          <span className="h2 fw-bold mb-0">
                            Welcome! <b>👋</b>
                          </span>
                        </div>

                        <h5 className="fw-normal mb-3 pb-3 register-heading">
                          Sign Up Please!
                        </h5>

                        {/* Email Input */}
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="registerEmail"
                            className="form-control form-control-lg"
                            placeholder="Email Address"
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <label className="form-label" htmlFor="registerEmail">
                            Email Address
                          </label>
                        </div>

                        {/* Username Input */}
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="registerUsername"
                            className="form-control form-control-lg"
                            placeholder="Username"
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                          <label
                            className="form-label"
                            htmlFor="registerUsername"
                          >
                            Username
                          </label>
                        </div>

                        {/* Password Input */}
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="registerPassword"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="8"
                          />
                          <label
                            className="form-label"
                            htmlFor="registerPassword"
                          >
                            Password
                          </label>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="registerConfirmPassword"
                            className="form-control form-control-lg"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                          />
                          <label
                            className="form-label"
                            htmlFor="registerConfirmPassword"
                          >
                            Confirm Password
                          </label>
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                          >
                            Register
                          </button>
                        </div>

                        <p className="mb-5 pb-lg-2 login-link">
                          Already have an account?{' '}
                          <Link to="/login" className="login-link">
                            Login Now
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
            Copyright &copy; 2025; Designed by{' '}
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

export default Registerpage;
