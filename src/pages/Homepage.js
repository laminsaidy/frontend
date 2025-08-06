import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/components/Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <Helmet>
        <title>Home | TaskManager</title>
        <meta name="description" content="Welcome to TaskManager - Organize your work and boost productivity with our task management tool" />
        <meta property="og:title" content="TaskManager - Your Productivity Companion" />
        <meta property="og:description" content="Organize your work and manage projects with our powerful task management tool" />
      </Helmet>

      <div className="homepage-hero">
        <svg className="illustration" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="homepage-title">Welcome to Your Task Manager</h1>
        <p className="homepage-subtitle">
          Organize your work, manage your projects, and boost your productivity
          with our simple yet powerful task management tool.
        </p>
        <Link to="/tasks" className="btn btn-primary btn-lg homepage-cta">
          Get Started
        </Link>
      </div>

      <div className="homepage-features">
        <div className="feature-card">
          <h3>Easy Task Management</h3>
          <p>Create, edit, and organize tasks with ease</p>
        </div>
        <div className="feature-card">
          <h3>Priority Levels</h3>
          <p>Mark tasks by priority to focus on what matters</p>
        </div>
        <div className="feature-card">
          <h3>Progress Tracking</h3>
          <p>Monitor your tasks from start to completion</p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;