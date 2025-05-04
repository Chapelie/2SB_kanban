import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { TutorialProvider } from './contexts/TutorialContext';
import './styles/themes.css'; // Importez les styles de thème

// Simuler un utilisateur connecté
const currentUser = {
  id: '1',
  name: 'Rafik SAWADOGO',
  location: 'Bobo, Burkina Faso',
  email: 'rafik@gmail.com',
  avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
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
      <TutorialProvider>
        <BrowserRouter>
          <AppRoutes 
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            handleLoginSuccess={handleLoginSuccess}
            handleRegisterSuccess={handleRegisterSuccess}
          />
        </BrowserRouter>
      </TutorialProvider>
    </ThemeProvider>
  );
};

export default App;