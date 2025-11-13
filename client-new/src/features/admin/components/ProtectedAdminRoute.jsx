import React from 'react';
import { Navigate } from 'react-router-dom';
import adminAuthUtils from '@services/utils/authAdmin.js';

export default function ProtectedAdminRoute({ children }) {
  if (!adminAuthUtils.isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}