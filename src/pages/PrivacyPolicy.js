import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import '../styles/components/LegalPages.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page-container">
      <Helmet>
        <title>Privacy Policy</title>
        <meta name="description" content="Read our Privacy Policy to understand how we handle your data." />
      </Helmet>
      <div className="legal-content">
        <h1 className="legal-title">Privacy Policy</h1>

        <div className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains what
            information we collect, how we use it, and your rights regarding your data.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Data We Collect</h2>
          <p>We may collect the following types of personal information:</p>
          <ul>
            <li>Username and email address when you register</li>
            <li>Login and usage data</li>
            <li>Tasks or entries you create in the app</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>Your data is used to:</p>
          <ul>
            <li>Authenticate you into the system</li>
            <li>Allow you to manage tasks</li>
            <li>Send important updates (if needed)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to ensure your data is secure and protected against
            unauthorized access, loss, or misuse.
          </p>
        </div>

        <div className="legal-section">
          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as you use the service or as required to comply with legal
            obligations.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal data</li>
            <li>Withdraw consent at any time</li>
            <li>Request a copy of your stored information</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this policy or your data, please contact us at:
            <br />
            <strong>support@example.com</strong>
          </p>
        </div>

        <button onClick={() => navigate(-1)} className="btn btn-secondary mt-4">
          ⬅️ Back
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
