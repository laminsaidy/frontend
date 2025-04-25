import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import '../styles/components/Loginpage.css';

function Loginpage() {
  const { loginUser } = useContext(AuthContext);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log("Email:", email);
    console.log("Password:", password);

    // If both email and password are provided, attempt login
    if (email.length > 0 && password.length > 0) {
      loginUser(email, password);
    } else {
      console.error("Email and password are required.");
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
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit}>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i className="fas fa-cubes fa-2x me-3 login-icon" />
                          <span className="h2 fw-bold mb-0">
                            Hello! Welcome back👋
                          </span>
                        </div>

                        <h5 className="fw-normal mb-3 pb-3 login-heading">
                          Sign into your account!
                        </h5>

                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="form2Example17"
                            className="form-control form-control-lg"
                            name="email"
                          />
                          <label className="form-label" htmlFor="form2Example17">
                            Email address
                          </label>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                            name="password"
                          />
                          <label className="form-label" htmlFor="form2Example27">
                            Password
                          </label>
                        </div>

                        <div className="pt-1 mb-4">
                          <button className="btn btn-dark btn-lg btn-block" type="submit">
                            Login
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

export default Loginpage;