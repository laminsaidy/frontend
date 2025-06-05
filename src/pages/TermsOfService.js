import React from 'react';
import '../styles/components/LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal-page-container">
      <div className="legal-content">
        <h1 className="legal-title">Terms of Service</h1>

        <div className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using our service, you agree to be bound by these
            terms and all applicable laws and regulations.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account.
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Prohibited Activities</h2>
          <p>
            You agree not to engage in any activity that interferes with or
            disrupts the Service or the servers and networks connected to the
            Service.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Modifications</h2>
          <p>
            We reserve the right to revise these terms at any time without
            notice. By using this service you are agreeing to be bound by the
            then current version.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
