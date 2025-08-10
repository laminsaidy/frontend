import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './styles/theme.css';

// 🚫 Disable WebSockets in production without modifying the global
if (process.env.NODE_ENV === "production" && typeof WebSocket !== "undefined") {
  window.WebSocket = class extends window.WebSocket {
    constructor(...args) {
      console.warn("WebSockets are disabled in this app. Attempted to connect to:", args[0]);
      super(); // Call parent constructor with no args to avoid actual connection
    }
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
