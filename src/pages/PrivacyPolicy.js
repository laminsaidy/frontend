import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../styles/components/LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Privacy Policy</title>
        <meta name="description" content="Read our Privacy Policy to understand how we handle your data." />
      </Helmet>
      <div className="legal-content">
        <h1 className="legal-title">Privacy Policy</h1>
        {/* Privacy policy content */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
