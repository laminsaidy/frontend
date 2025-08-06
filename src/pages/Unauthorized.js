import React from "react";
import { Link } from "react-router-dom";
import '../styles/components/LegalPages.css';


const Unauthorized = () => {
  return (
    <div className="error-page">
      <h1>401 - Unauthorized</h1>
      <p>You don't have permission to view this page.</p>
      <Link to="/" className="btn-go-home">🔒 Back to Home</Link>
    </div>
  );
};

export default Unauthorized;
