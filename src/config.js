// src/config.js
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("REACT_APP_API_BASE_URL is not defined in the environment variables");
}

export const API_BASE_URL = apiBaseUrl;
