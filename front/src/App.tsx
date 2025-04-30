import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/themes.css'; // Importez les styles de thème

// Simuler un utilisateur connecté
const currentUser = {
  id: '1',
  name: 'Rafik SAWADOGO',
  location: 'Bobo, Burkina Faso',
  avatar: '/api/placeholder/128/128',
  role: 'Administrateur'
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          handleLoginSuccess={handleLoginSuccess}
          handleRegisterSuccess={handleRegisterSuccess}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;