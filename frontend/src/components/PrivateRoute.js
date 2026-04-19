import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

function PrivateRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  return currentUser ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
