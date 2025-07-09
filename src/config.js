const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

if (!apiBaseUrl) {
  console.warn("REACT_APP_API_BASE_URL is not defined in the environment variables. Using default URL.");
}

export const API_BASE_URL = apiBaseUrl;

