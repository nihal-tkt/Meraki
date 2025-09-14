import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  console.log(user);

  // Check if user exists and their role matches the allowed roles
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <div>You do not have permission to access this page.</div>;
  }

  return children;
};

export default ProtectedRoute;
