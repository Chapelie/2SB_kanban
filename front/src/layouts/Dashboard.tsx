import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User } from '../types';
import TutorialManager from '../components/tutorial/TutorialManager';
import { useTutorial, getDashboardTutorialSteps } from '../contexts/TutorialContext';
import authService from '../services/authService';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('project');
  const { showTutorial, setShowTutorial, tutorialCompleted, markTutorialAsCompleted, skipTutorial } = useTutorial();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Vérifier l'authentification et récupérer l'utilisateur
  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        // Rediriger vers la page de connexion si non authentifié
        navigate('/login');
        return;
      }
      
      // Récupérer l'utilisateur connecté depuis le localStorage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Si des données utilisateur sont manquantes, déconnecter et rediriger
        authService.logout();
        navigate('/login');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);
  
  // Mettre à jour la page active en fonction de l'URL
  useEffect(() => {
    const path = location.pathname.split('/').pop() || '';
    if (path === 'projects') setActivePage('project');
    else if (path === 'tasks') setActivePage('tasks');
    else if (path === 'work-logs') setActivePage('workLogs');
    else if (path === 'performance') setActivePage('performance');
    else if (path === 'settings') setActivePage('settings');
  }, [location]);

  // Vérifier si c'est la première visite de l'utilisateur
  useEffect(() => {
    // Pour le développement/test, nous affichons le tutoriel sur la page projets
    if (location.pathname.includes('/projects') && !tutorialCompleted) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000); // Délai d'1 seconde pour laisser le dashboard se charger
      
      return () => clearTimeout(timer);
    }
  }, [setShowTutorial, location.pathname, tutorialCompleted]);

  // Fonction pour naviguer via la sidebar
  const handleNavigate = (page: string) => {
    let route = '';
    switch (page) {
      case 'project':
        route = '/dashboard/projects';
        break;
      case 'tasks':
        route = '/dashboard/tasks';
        break;
      case 'workLogs':
        route = '/dashboard/work-logs';
        break;
      case 'performance':
        route = '/dashboard/performance';
        break;
      case 'settings':
        route = '/dashboard/settings';
        break;
      default:
        route = '/dashboard/projects';
    }
    navigate(route);
    setActivePage(page);
  };
  
  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
      </div>
    );
  }
  
  // Afficher le dashboard uniquement si l'utilisateur est authentifié
  if (!user) {
    return null; // Redirection déjà gérée dans le useEffect
  }

  return (
    <div className="flex h-screen">
      <Sidebar id="sidebar-navigation" activePage={activePage} onNavigate={handleNavigate} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header  activePage={activePage} />
        <Outlet />
      </div>
      
      {/* Tutoriel */}
      <TutorialManager
        steps={getDashboardTutorialSteps()}
        isActive={showTutorial}
        onComplete={markTutorialAsCompleted}
        onSkip={skipTutorial}
      />
    </div>
  );
};

export default Dashboard;