import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../styles/components/LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Terms of Service</title>
        <meta name="description" content="Read our Terms of Service to understand the rules and regulations for using our service." />
      </Helmet>
      <div className="legal-content">
        <h1 className="legal-title">Terms of Service</h1>
        {/* Terms of service content */}
      </div>
    </div>
  );
};

export default TermsOfService;
