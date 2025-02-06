import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  // Accessing logoutUser from AuthContext
  const { logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens"); // Retrieving the auth token from localStorage

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
            <ul className="navbar-nav" style={{ display: "flex", alignItems: "center" }}>
              {/* Home Link */}
              <li className="nav-item" style={{ marginRight: "10px" }}>
                <Link
                  className="nav-link"
                  to="/"
                  style={{
                    color: "white",
                    padding: "0.5rem 1rem",
                    textDecoration: "none",
                    fontSize: "1rem",
                  }}
                >
                  Home
                </Link>
              </li>

              {/* Login and Register links (only shown if no token) */}
              {!token && (
                <>
                  <li className="nav-item" style={{ marginRight: "10px" }}>
                    <Link
                      className="nav-link"
                      to="/login"
                      style={{
                        color: "white",
                        padding: "0.5rem 1rem",
                        textDecoration: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item" style={{ marginRight: "10px" }}>
                    <Link
                      className="nav-link"
                      to="/register"
                      style={{
                        color: "white",
                        padding: "0.5rem 1rem",
                        textDecoration: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}

              {/* Dashboard and Logout links (only shown if token exists) */}
              {token && (
                <>
                  <li className="nav-item" style={{ marginRight: "10px" }}>
                    <Link
                      className="nav-link"
                      to="/dashboard"
                      style={{
                        color: "white",
                        padding: "0.5rem 1rem",
                        textDecoration: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    {/* Logout button */}
                    <button
                      className="nav-link"
                      onClick={logoutUser}
                      style={{
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        color: "white",
                        padding: "0.5rem 1rem",
                        textDecoration: "none",
                        fontSize: "1rem",
                      }}
                      aria-label="Logout"
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

      {/* Add hover effect using CSS */}
      <style>
        {`
          .navbar-nav .nav-link:hover {
            color: #ccc !important; /* Light gray on hover */
          }
          .navbar-nav button.nav-link:hover {
            color: #ccc !important; /* Light gray on hover for the Logout button */
          }
        `}
      </style>
    </div>
  );
}

export default Navbar;