import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Registerpage() {
  // State hooks to handle form inputs for email, username, password, and confirm password
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Destructure registerUser from AuthContext
  const { registerUser } = useContext(AuthContext);

  // Log form input values to the console for debugging purposes
  console.log(email);
  console.log(username);
  console.log(password);
  console.log(password2);

  // Handle form submission and call registerUser with the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(email, username, password, password2);
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
                  {/* Left-side image */}
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="register form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  {/* Right-side form */}
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      {/* Registration form */}
                      <form onSubmit={handleSubmit}>
                        {/* Welcome message */}
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i
                            className="fas fa-cubes fa-2x me-3"
                            style={{ color: "#ff6219" }}
                          />
                          <span className="h2 fw-bold mb-0">
                            Welcome! <b>👋</b>
                          </span>
                        </div>

                        {/* Header text */}
                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: 1 }}
                        >
                          Sign Up Please!
                        </h5>

                        {/* Email input field */}
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="form2Example17"
                            className="form-control form-control-lg"
                            placeholder="Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        {/* Username input field */}
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="form2Example17"
                            className="form-control form-control-lg"
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>

                        {/* Password input field */}
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="form2Example17"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        {/* Confirm password input field */}
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                            placeholder="Confirm Password"
                            onChange={(e) => setPassword2(e.target.value)}
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
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Already have an account?{" "}
                          <Link to="/login" style={{ color: "#393f81" }}>
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

export default Registerpage;
