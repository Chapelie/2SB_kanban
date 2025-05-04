import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User } from '../types';
import TutorialManager from '../components/tutorial/TutorialManager';
import { useTutorial, getDashboardTutorialSteps } from '../contexts/TutorialContext';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('project');
  const { showTutorial, setShowTutorial, tutorialCompleted, markTutorialAsCompleted, skipTutorial } = useTutorial();
  
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
    // Pour le développement/test, nous forçons l'affichage du tutoriel
    if (location.pathname.includes('/projects')) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000); // Délai d'1 seconde pour laisser le dashboard se charger
      
      return () => clearTimeout(timer);
    }
  }, [setShowTutorial, location.pathname]);

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

  return (
    <div className="flex h-screen">
      <Sidebar id="sidebar-navigation" activePage={activePage} onNavigate={handleNavigate} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} activePage={activePage} />
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