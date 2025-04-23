import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { User } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('project');

  // Mettre à jour la page active en fonction de l'URL
  useEffect(() => {
    const path = location.pathname.split('/').pop() || '';
    if (path === 'projects') setActivePage('project');
    else if (path === 'tasks') setActivePage('tasks');
    else if (path === 'work-logs') setActivePage('workLogs');
    else if (path === 'performance') setActivePage('performance');
    else if (path === 'settings') setActivePage('settings');
  }, [location]);

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
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} activePage={activePage} />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;