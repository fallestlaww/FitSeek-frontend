import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../api/auth';

export default function ProtectedRoute({ children }) {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
