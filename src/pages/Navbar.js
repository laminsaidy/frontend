import React, { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");

  let user_id = null;
  if (token) {
    const decoded = jwtDecode(token);
    user_id = decoded?.user_id;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          {/* Left Side - Logo */}
          <a className="navbar-brand" href="#">
            <img
              style={{
                width: "120px",
                padding: "6px",
                backgroundColor: "none", // Set a solid background color
              }}
              src="https://i.imgur.com/OyJ8xmm.png"
              alt="Logo"
            />
          </a>

          {/* Navbar Toggler for Mobile View */}
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

          {/* Right Side - Navbar Links */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
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
              {token && (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/dashboard">
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      onClick={logoutUser}
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </a>
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
