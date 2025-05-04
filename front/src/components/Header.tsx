import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaEnvelope, FaRegQuestionCircle, FaChevronDown, FaUser, FaCog, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface HeaderProps {
  user: User;
  activePage: string;
}

const Header: React.FC<HeaderProps> = ({ user, activePage }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Gérer la fermeture du menu au clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour obtenir le titre de la page à partir de l'ID
  const getPageTitle = (pageId: string): string => {
    switch (pageId) {
      case 'project':
        return 'Projets';
      case 'tasks':
        return 'Tâches';
      case 'workLogs':
        return 'Logs de Travail';
      case 'performance':
        return 'Performance';
      case 'settings':
        return 'Paramètres';
      case 'admin':
        return 'Admin Console';
      case 'notifications':
        return 'Notifications';
      case 'messages':
        return 'Messages';
      default:
        return 'Tableau de Bord';
    }
  };

  // Construire le fil d'Ariane selon la page active
  const getBreadcrumbs = () => {
    const pageTitle = getPageTitle(activePage);
    return (
      <>
        <span className="font-medium text-[var(--text-primary)]">Tableau de Bord</span>
        <span className="mx-2">/</span>
        <span className="text-[var(--accent-color)]">{pageTitle}</span>
      </>
    );
  };

  // Gérer la navigation vers les pages de paramètres
  const handleNavigateToProfile = () => {
    navigate('/dashboard/settings');
    setShowUserMenu(false);
  };

  const handleNavigateToSettings = () => {
    navigate('/dashboard/settings');
    setShowUserMenu(false);
  };

  const handleNavigateToAdmin = () => {
    navigate('/dashboard/admin');
    setShowUserMenu(false);
  };
  
  const handleNavigateToNotifications = () => {
    navigate('/dashboard/notifications');
  };
  
  const handleNavigateToMessages = () => {
    navigate('/dashboard/messages');
  };

  const handleLogout = () => {
    // Simuler une déconnexion
    alert('Déconnexion simulée');
    setShowUserMenu(false);
    // Dans une vraie application, vous implémenteriez un processus de déconnexion complet
    // navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
  };
  
  return (
    <div className="h-16 bg-[var(--bg-primary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
      {/* Breadcrumbs - Visible seulement sur écrans moyens et grands */}
      <div className="hidden md:flex items-center text-sm text-[var(--text-secondary)]">
        {getBreadcrumbs()}
      </div>
      
      {/* Titre sur mobile */}
      <div className="md:hidden flex items-center">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">{getPageTitle(activePage)}</h1>
      </div>
      
      {/* Barre de recherche et Actions */}
      <div className="flex-1 flex items-center justify-end">
        
        {/* Actions - Cachées sur mobile */}
        <div className="hidden sm:flex items-center ml-6 space-x-4">
          <button className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] focus:outline-none transition-colors duration-200">
            <FaRegQuestionCircle className="text-xl" />
          </button>
          
          {/* Emails (Messages) */}
          <div className="relative">
            <button 
              onClick={handleNavigateToMessages}
              className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] focus:outline-none transition-colors duration-200"
            >
              <FaEnvelope className="text-xl" />
            </button>
            <div className="absolute -top-1 -right-1 bg-[var(--accent-color)] rounded-full w-4 h-4 flex items-center justify-center">
              <span className="text-white text-xs">2</span>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={handleNavigateToNotifications}
              className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] focus:outline-none transition-colors duration-200"
            >
              <FaBell className="text-xl" />
            </button>
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              <span className="text-white text-xs">3</span>
            </div>
          </div>
        </div>
        
        {/* Séparateur vertical */}
        <div className="mx-4 h-8 w-px bg-[var(--border-color)] hidden sm:block"></div>
        
        {/* Profil utilisateur */}
        <div className="relative" ref={menuRef} id="user-profile-menu">
          <div 
            className="flex items-center space-x-3 focus:outline-none cursor-pointer"
            onClick={toggleUserMenu}
          >
            <div className="mr-2 text-right hidden sm:block">
              <div className="font-medium text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors duration-200">{user.name}</div>
              {/* Location a été supprimé ici */}
            </div>
            <div className="flex items-center space-x-1">
              <img
                src={user.avatar || "/api/placeholder/40/40"}
                alt={user.name}
                className="w-9 h-9 rounded-full border-2 border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors duration-200 object-cover"
              />
              <FaChevronDown className={`text-[var(--text-secondary)] text-xs transition-colors duration-200 ${showUserMenu ? 'text-[var(--accent-color)] transform rotate-180' : ''}`} />
            </div>
          </div>
          
          {/* Dropdown menu */}
          <div 
            className={`absolute right-0 mt-2 w-48 bg-[var(--bg-primary)] rounded-lg shadow-lg py-1 z-10 border border-[var(--border-color)] 
            transition-all duration-200 transform origin-top ${
              showUserMenu 
                ? 'opacity-100 visible scale-100' 
                : 'opacity-0 invisible scale-95'
            }`}
          >
            <button 
              onClick={handleNavigateToProfile}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            >
              <FaUser className="mr-2 text-[var(--text-secondary)]" /> 
              Mon Profil
            </button>
            
            <button 
              onClick={handleNavigateToSettings}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            >
              <FaCog className="mr-2 text-[var(--text-secondary)]" /> 
              Paramètres
            </button>
            
            <button 
              onClick={handleNavigateToAdmin}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            >
              <FaShieldAlt className="mr-2 text-[var(--text-secondary)]" /> 
              Admin Console
            </button>
            
            <div className="border-t border-[var(--border-color)] my-1"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-[var(--bg-secondary)]"
            >
              <FaSignOutAlt className="mr-2" /> 
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;