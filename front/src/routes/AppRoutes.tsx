import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import Dashboard from '../layouts/Dashboard';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import TasksPage from '../pages/TasksPage';
import WorkLogsPage from '../pages/WorkLogsPage';
import PerformancePage from '../pages/PerformancePage';
import SettingsPage from '../pages/SettingsPage';
import AdminPage from '../pages/AdminPage';
import NotificationsPage from '../pages/NotificationsPage';
import MessagesPage from '../pages/MessagesPage';
import { User } from '../types';

// Composant pour les routes protégées qui nécessitent une authentification
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  // Ne vérifiez que l'état isAuthenticated fourni par les props et pas le localStorage
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

interface AppRoutesProps {
  isAuthenticated: boolean;
  currentUser: User;
  handleLoginSuccess: () => void;
  handleRegisterSuccess: () => void;
  handleLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  handleLoginSuccess,
  handleRegisterSuccess,

}) => {
  return (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<HomePage />} />
      
      {/* Routes d'authentification */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard/projects" replace />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard/projects" replace />
          ) : (
            <RegisterPage onRegisterSuccess={handleRegisterSuccess} />
          )
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard/projects" replace />
          ) : (
            <ForgotPasswordPage />
          )
        } 
      />

      {/* Routes protégées de l'application */}
      <Route path="/dashboard" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Dashboard/>
        </ProtectedRoute>
      }>
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="work-logs" element={<WorkLogsPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route index element={<Navigate to="/dashboard/projects" replace />} />
      </Route>

      {/* Route pour les pages non trouvées */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;