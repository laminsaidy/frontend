import React from "react";
import "../styles/components/LoadingSpinner.css"; 

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-wrapper">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
