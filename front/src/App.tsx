import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { TutorialProvider } from './contexts/TutorialContext';
import './styles/themes.css'; // Importez les styles de thème
import authService from './services/authService';
import { User } from './types';
const App: React.FC = () => {
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  
  // fonction pour gérer la déconnexion au niveau App
  const handleLogout = () => {
    // Mettre à jour l'état d'abord
    setIsAuthenticated(false);
    setCurrentUser(null);
    
    // Puis nettoyer localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('tutorialCompleted');
    localStorage.removeItem('animations');
    
    
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider>
      <TutorialProvider>
        <BrowserRouter>
          <AppRoutes 
            isAuthenticated={isAuthenticated}
            currentUser={currentUser!}
            handleLoginSuccess={handleLoginSuccess}
            handleRegisterSuccess={handleRegisterSuccess}
            handleLogout={handleLogout} 
          />
        </BrowserRouter>
      </TutorialProvider>
    </ThemeProvider>
  );
};

export default App;