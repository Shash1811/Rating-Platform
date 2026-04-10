import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout';
import ChangePasswordForm from './components/auth/ChangePasswordForm';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/Dashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminUserDetails from './components/admin/AdminUserDetails';
import AdminStores from './components/admin/AdminStores';
import StoreList from './components/store/StoreList';
import MyRatings from './components/user/MyRatings';
import MyStores from './components/store/MyStores';
import { useAuth } from './context/AuthContext';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginForm />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterForm />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/change-password" element={
        <ProtectedRoute>
          <ChangePasswordForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/users/:id" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          <AdminUserDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/stores" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
          <AdminStores />
        </ProtectedRoute>
      } />
      <Route path="/stores" element={
        <ProtectedRoute allowedRoles={[UserRole.NORMAL_USER]}>
          <StoreList />
        </ProtectedRoute>
      } />
      <Route path="/my-ratings" element={
        <ProtectedRoute allowedRoles={[UserRole.NORMAL_USER]}>
          <MyRatings />
        </ProtectedRoute>
      } />
      <Route path="/my-stores" element={
        <ProtectedRoute allowedRoles={[UserRole.STORE_OWNER]}>
          <MyStores />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
