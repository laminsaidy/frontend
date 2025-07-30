import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../styles/components/Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Welcome to Your Task Manager" />
      </Helmet>
      <svg className="illustration" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* SVG content */}
      </svg>
      <h1>Welcome to Your Task Manager</h1>
      <p>Organize your work, manage your projects, and boost your productivity with our simple yet powerful task management tool.</p>
      <a href="/tasks" className="btn">Get Started</a>
    </div>
  );
};

export default Homepage;
