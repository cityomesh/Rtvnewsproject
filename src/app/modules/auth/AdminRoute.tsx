import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from './session';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const user = getCurrentUser();

  // Not logged in OR not admin → redirect to dashboard
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;