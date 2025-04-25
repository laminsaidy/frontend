import React, { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const isAuthenticated = !!user;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navbarRef = useRef(null);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsCollapsed(true);
    }
  };

  const handleNavLinkClick = () => {
    setIsCollapsed(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={navbarRef}>
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark"
        style={{ paddingTop: "10px", paddingBottom: "10px", zIndex: "10" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={handleNavLinkClick}>
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
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleCollapse}
            aria-controls="navbarNav"
            aria-expanded={!isCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse justify-content-end ${!isCollapsed ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav" style={{ display: "flex", alignItems: "center" }}>
              <li className="nav-item" style={{ marginRight: "10px" }}>
                <Link
                  className="nav-link"
                  to="/"
                  onClick={handleNavLinkClick}
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
              {!isAuthenticated && (
                <>
                  <li className="nav-item" style={{ marginRight: "10px" }}>
                    <Link
                      className="nav-link"
                      to="/login"
                      onClick={handleNavLinkClick}
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
                      onClick={handleNavLinkClick}
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
              {isAuthenticated && (
                <>
                  <li className="nav-item" style={{ marginRight: "10px" }}>
                    <Link
                      className="nav-link"
                      to="/tasks"
                      onClick={handleNavLinkClick}
                      style={{
                        color: "white",
                        padding: "0.5rem 1rem",
                        textDecoration: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Task Manager
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => {
                        logoutUser();
                        handleNavLinkClick();
                      }}
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
    </div>
  );
}

export default Navbar;
