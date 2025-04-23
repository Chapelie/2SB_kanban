import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { User } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // User mock data
  const currentUser: User = {
    id: '1',
    name: 'Anima Agrawal',
    location: 'UP, India',
    avatar: '/api/placeholder/40/40'
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <AppRoutes 
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        handleLoginSuccess={handleLoginSuccess}
        handleRegisterSuccess={handleRegisterSuccess}
      />
    </BrowserRouter>
  );
};

export default App;