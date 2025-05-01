import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTasks, FaClipboardList, FaCog,  FaBell, FaEnvelope } from 'react-icons/fa';

const MobileMenu: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath.includes(path);
  };
  
  // Nombre de notifications et messages non lus (à implémenter avec un vrai système)
  const unreadNotifications = 3;
  const unreadMessages = 2;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border-color)] md:hidden">
      <div className="grid grid-cols-6 h-16">
        <Link
          to="/dashboard/projects"
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard/projects') ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          <FaHome className="text-lg" />
          <span className="text-xs mt-1">Projets</span>
        </Link>
        <Link
          to="/dashboard/tasks"
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard/tasks') ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          <FaTasks className="text-lg" />
          <span className="text-xs mt-1">Tâches</span>
        </Link>
        <Link
          to="/dashboard/work-logs"
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard/work-logs') ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          <FaClipboardList className="text-lg" />
          <span className="text-xs mt-1">Logs</span>
        </Link>
        <Link
          to="/dashboard/notifications"
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard/notifications') ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          <div className="relative">
            <FaBell className="text-lg" />
            {unreadNotifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-white text-xs">{unreadNotifications}</span>
              </div>
            )}
          </div>
          <span className="text-xs mt-1">Notifs</span>
        </Link>
        <Link
          to="/dashboard/messages"
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard/messages') ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          <div className="relative">
            <FaEnvelope className="text-lg" />
            {unreadMessages > 0 && (
              <div className="absolute -top-2 -right-2 bg-[var(--accent-color)] rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-white text-xs">{unreadMessages}</span>
              </div>
            )}
          </div>
          <span className="text-xs mt-1">Messages</span>
        </Link>
        <Link
          to="/dashboard/settings"
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard/settings') ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'
          }`}
        >
          <FaCog className="text-lg" />
          <span className="text-xs mt-1">Réglages</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;