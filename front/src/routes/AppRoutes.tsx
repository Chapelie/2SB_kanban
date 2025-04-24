import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import Dashboard from '../layouts/Dashboard';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import TasksPage from '../pages/TasksPage';
import TaskDetailPage from '../pages/TaskDetailPage';
import { User } from '../types';

// Composant pour les routes protégées qui nécessitent une authentification
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
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
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  currentUser,
  handleLoginSuccess,
  handleRegisterSuccess
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
          <Dashboard user={currentUser} />
        </ProtectedRoute>
      }>
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="work-logs" element={
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <h2 className="text-xl text-gray-500">Work Logs page content will be displayed here</h2>
          </div>
        } />
        <Route path="performance" element={
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <h2 className="text-xl text-gray-500">Performance page content will be displayed here</h2>
          </div>
        } />
        <Route path="settings" element={
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <h2 className="text-xl text-gray-500">Settings page content will be displayed here</h2>
          </div>
        } />
        <Route index element={<Navigate to="/dashboard/projects" replace />} />
      </Route>

      {/* Route pour les pages non trouvées */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;