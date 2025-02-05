import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  // Accessing logoutUser from AuthContext
  const { logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");
  // Retrieving the auth token from localStorage

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark"
        style={{ paddingTop: "10px", paddingBottom: "10px", zIndex: "10" }}
      >
        <div className="container-fluid">
          {/* Logo Link - Clicking the logo redirects to the homepage */}
          <Link className="navbar-brand" to="/">
            <img
              style={{
                width: "120px",
                padding: "6px",
                backgroundColor: "none",
              }}
              src="https://i.imgur.com/OyJ8xmm.png"
              alt="Logo"
            />
          </Link>

          {/* Navbar toggler for responsive mobile view */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible navbar content */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              {/* Home Link */}
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>

              {/* Login and Register links (only shown if no token) */}
              {!token && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}

              {/* Dashboard and Logout links (only shown if token exists) */}
              {token && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    {/* Logout button */}
                    <button
                      className="nav-link"
                      onClick={logoutUser} // Calls logoutUser function from AuthContext
                      style={{
                        cursor: "pointer", // Ensures the button looks clickable
                        background: "none", // No background
                        border: "none", // No border
                        color: "inherit", // Inherit the color from parent
                        padding: 0, // No padding
                        textDecoration: "none", // No underline
                      }}
                      aria-label="Logout" // Accessibility label for the button
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
