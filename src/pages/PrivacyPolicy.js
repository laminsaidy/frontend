import React from 'react';
import '../styles/components/LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page-container">
      <div className="legal-content">
        <h1 className="legal-title">Privacy Policy</h1>

        <div className="legal-section">
          <h2>1. Information We Collect</h2>
          <p>We collect personal information you provide when you register, including your name, email address, and other contact details.</p>
        </div>

        <div className="legal-section">
          <h2>2. How We Use Information</h2>
          <p>Your information is used to provide and improve our services, communicate with you, and ensure the security of your account.</p>
        </div>

        <div className="legal-section">
          <h2>3. Data Protection</h2>
          <p>We implement appropriate security measures to protect against unauthorized access, alteration, or destruction of your personal data.</p>
        </div>

        <div className="legal-section">
          <h2>4. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information at any time through your account settings.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
