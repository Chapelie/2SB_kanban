import React, { useState } from 'react';
import { FaSearch, FaBell, FaEnvelope, FaRegQuestionCircle, FaChevronDown } from 'react-icons/fa';
import { User } from '../types';

interface HeaderProps {
  user: User;
  activePage: string; // Ajout de cette propriété
}

const Header: React.FC<HeaderProps> = ({ user, activePage }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  // Fonction pour obtenir le titre de la page à partir de l'ID
  const getPageTitle = (pageId: string): string => {
    switch (pageId) {
      case 'project':
        return 'Projects';
      case 'tasks':
        return 'Tasks';
      case 'workLogs':
        return 'Work Logs';
      case 'performance':
        return 'Performance';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  // Construire le fil d'Ariane selon la page active
  const getBreadcrumbs = () => {
    const pageTitle = getPageTitle(activePage);
    return (
      <>
        <span className="font-medium text-gray-900">Dashboard</span>
        <span className="mx-2">/</span>
        <span className="text-blue-600">{pageTitle}</span>
      </>
    );
  };
  
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
      {/* Breadcrumbs - Visible seulement sur écrans moyens et grands */}
      <div className="hidden md:flex items-center text-sm text-gray-600">
        {getBreadcrumbs()}
      </div>
      
      {/* Titre sur mobile */}
      <div className="md:hidden flex items-center">
        <h1 className="text-lg font-semibold text-gray-800">{getPageTitle(activePage)}</h1>
      </div>
      
      {/* Barre de recherche et Actions */}
      <div className="flex-1 flex items-center justify-end">
        {/* Zone de recherche - Adaptative */}
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-40 sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          />
        </div>
        
        {/* Actions - Cachées sur mobile */}
        <div className="hidden sm:flex items-center ml-6 space-x-4">
          <button className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors duration-200">
            <FaRegQuestionCircle className="text-xl" />
          </button>
          
          {/* Emails */}
          <div className="relative">
            <button className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors duration-200">
              <FaEnvelope className="text-xl" />
            </button>
            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
              <span className="text-white text-xs">2</span>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors duration-200">
              <FaBell className="text-xl" />
            </button>
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              <span className="text-white text-xs">3</span>
            </div>
          </div>
        </div>
        
        {/* Séparateur vertical */}
        <div className="mx-4 h-8 w-px bg-gray-200 hidden sm:block"></div>
        
        {/* Profil utilisateur */}
        <div className="relative">
          <button 
            onClick={toggleUserMenu}
            className="flex items-center space-x-3 focus:outline-none group"
          >
            <div className="mr-2 text-right hidden sm:block">
              <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{user.name}</div>
              <div className="text-xs text-gray-500">{user.location}</div>
            </div>
            <div className="flex items-center space-x-1">
              <img
                src={user.avatar || "/api/placeholder/40/40"}
                alt={user.name}
                className="w-9 h-9 rounded-full border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-200 object-cover"
              />
              <FaChevronDown className="text-gray-400 text-xs group-hover:text-blue-500 transition-colors duration-200" />
            </div>
          </button>
          
          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Your Profile</a>
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
              <a href="#admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Console</a>
              <div className="border-t border-gray-100 my-1"></div>
              <a href="#logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign out</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;