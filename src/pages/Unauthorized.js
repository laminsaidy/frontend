import React from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from "react-router-dom";
import '../styles/components/LegalPages.css';

const Unauthorized = () => {
  return (
    <div className="error-page">
      <Helmet>
        <title>401 - Unauthorized Access | TaskManager</title>
        <meta name="description" content="You don't have permission to access this page. Please log in or contact support." />
        <meta property="og:title" content="401 - Unauthorized | TaskManager" />
        <meta property="og:description" content="Access to this page is restricted." />
      </Helmet>

      <div className="unauthorized-container">
        <div className="unauthorized-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="unauthorized-title">401 - Unauthorized Access</h1>
        <p className="unauthorized-message">
          You don't have permission to view this page. Please log in with the correct credentials.
        </p>
        <div className="unauthorized-actions">
          <Link to="/login" className="btn btn-primary">
            Go to Login Page
          </Link>
          <Link to="/" className="btn btn-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;