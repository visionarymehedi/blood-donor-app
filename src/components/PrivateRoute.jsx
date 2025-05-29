// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// Private route to protect admin pages
const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('adminAuthenticated'); // Check if the user is authenticated

  if (isAuthenticated) {
    return element; // If authenticated, render the protected component
  } else {
    return <Navigate to="/admin-login" />; // If not authenticated, redirect to login
  }
};

export default PrivateRoute;
