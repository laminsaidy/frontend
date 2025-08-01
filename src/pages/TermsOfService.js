import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import '../styles/components/LegalPages.css';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Terms of Service</title>
        <meta name="description" content="Read our Terms of Service to understand the rules and regulations for using our service." />
      </Helmet>
      <div className="legal-content">
        <h1 className="legal-title">Terms of Service</h1>

        <div className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using our application, you agree to comply with and be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our platform.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials.
            You agree to use the platform only for lawful purposes and not to misuse any part of the service.
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Intellectual Property</h2>
          <p>
            All content and code provided by this application remain our intellectual property.
            You may not copy, reproduce, or distribute any part without written permission.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Service Modifications</h2>
          <p>
            We reserve the right to modify or discontinue any part of the service at any time without notice.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Termination</h2>
          <p>
            We may suspend or terminate your access to the platform if you violate any of these terms.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Disclaimer</h2>
          <p>
            The service is provided "as is" without warranties of any kind. We are not responsible for any damages
            resulting from use of the platform.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of your country or residence.
          </p>
        </div>

        <button onClick={() => navigate(-1)} className="btn btn-secondary mt-4">
          ⬅️ Back
        </button>
      </div>
    </div>
  );
};

export default TermsOfService;
