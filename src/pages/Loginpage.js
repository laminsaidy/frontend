import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Loginpage() {
  const { loginUser } = useContext(AuthContext); // Accessing loginUser from the AuthContext

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const email = e.target.email.value; // Get email value from form
    const password = e.target.password.value; // Get password value from form

    console.log("Email:", email); // Logging email value for testing
    console.log("Password:", password); // Logging password value for testing

    // If both email and password are provided, attempt login
    if (email.length > 0 && password.length > 0) {
      loginUser(email, password); // Calling loginUser with email and password
    } else {
      console.error("Email and password are required."); // If not both provided, log an error
    }
  };

  return (
    <div>
      <section className="min-vh-85" style={{ backgroundColor: "#7D5A75" }}>
        <div
          className="container py-5"
          style={{ marginTop: "80px", paddingBottom: "20px" }}
        >
          {/* Adjust margin-top to avoid navbar overlap */}
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    {/* Login image for larger screens */}
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    {/* Login form container */}
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit}>
                        {/* Welcome message with icon */}
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i
                            className="fas fa-cubes fa-2x me-3"
                            style={{ color: "#ff6219" }}
                          />
                          <span className="h2 fw-bold mb-0">
                            Hello! Welcome back👋
                          </span>
                        </div>

                        {/* Heading text for login */}
                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: 1 }}
                        >
                          Sign into your account!
                        </h5>

                        {/* Email input field */}
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="form2Example17"
                            className="form-control form-control-lg"
                            name="email"
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example17"
                          >
                            Email address
                          </label>
                        </div>

                        {/* Password input field */}
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                            name="password"
                          />
                          <label
                            className="form-label"
                            htmlFor="form2Example27"
                          >
                            Password
                          </label>
                        </div>

                        {/* Login button */}
                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                          >
                            Login
                          </button>
                        </div>

                        {/* Forgot password link */}
                        <a className="small text-muted" href="#!">
                          Forgot password?
                        </a>

                        {/* Register link for new users */}
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Don't have an account?{" "}
                          <Link to="/register" style={{ color: "#393f81" }}>
                            Register Now
                          </Link>
                        </p>

                        {/* Footer links */}
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

      <footer className="bg-light text-center text-lg-start">
        <div class="footer">
          <p>
            Copy right &copy;2025; Designed by{" "}
            <span class="creator">
              <a href="https://github.com/laminsaidy" target="_blank">
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
