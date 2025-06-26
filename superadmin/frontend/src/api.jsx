// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend URL
});

// Add token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle token errors globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && [401, 403].includes(err.response.status)) {
      // Clear session and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
