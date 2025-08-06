import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/components/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <Helmet>
        <title>404 - Page Not Found | TaskManager</title>
        <meta name="description" content="The page you are looking for does not exist or has been moved." />
        <meta property="og:title" content="404 - Page Not Found | TaskManager" />
        <meta property="og:description" content="The page you requested could not be found." />
      </Helmet>
      
      <div className="not-found-content">
        <div className="not-found-illustration">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FF0066" d="M40,-74.4C52.5,-69.2,63.9,-59.1,71.9,-46.3C79.9,-33.5,84.5,-18,85.4,-1.9C86.3,14.2,83.5,29,74.9,40.5C66.3,52.1,51.9,60.4,36.4,67.3C20.9,74.2,4.3,79.7,-12.6,77.1C-29.5,74.5,-46.6,63.8,-58.6,50.3C-70.6,36.8,-77.5,20.5,-79.8,2.9C-82.1,-14.7,-79.9,-33.7,-69.9,-47.4C-59.9,-61.1,-42.1,-69.5,-26.4,-73.5C-10.7,-77.5,2.9,-77.1,16.3,-73.5C29.7,-69.9,42.9,-63.1,40,-74.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <h1 className="not-found-title">404 - Page Not Found</h1>
        <p className="not-found-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary not-found-button">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;