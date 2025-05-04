import React, { useState } from 'react';
import { FaProjectDiagram, FaTasks, FaClipboardList, FaChartLine, FaCog, FaChevronLeft } from 'react-icons/fa';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  id?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, id }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'project', label: 'Projets', icon: <FaProjectDiagram size={20} /> },
    { id: 'tasks', label: 'Tâches', icon: <FaTasks size={20} /> },
    { id: 'workLogs', label: 'Work Logs', icon: <FaClipboardList size={20} /> },
    { id: 'performance', label: 'Performance', icon: <FaChartLine size={20} /> },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Settings', icon: <FaCog size={20} /> },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      id={id}
      className={`${collapsed ? 'w-16' : 'w-64'} bg-[var(--sidebar-bg)] h-full border-r border-[var(--border-color)] shadow-sm transition-all duration-300 flex flex-col`}
    >
      {/* Logo et bouton de réduction */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <span className="text-white font-bold">2SB</span>
          </div>
          {!collapsed && <span className="ml-3 text-lg font-semibold text-[var(--text-primary)]">2SB Kanban</span>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className={`text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        >
          <FaChevronLeft />
        </button>
      </div>

      {/* Menu principal */}
      <div className="mt-6 flex-grow">
        <div className={`${collapsed ? 'px-2' : 'px-4'} mb-2`}>
          {!collapsed && <h3 className="text-xs uppercase font-semibold text-[var(--text-secondary)] tracking-wider">MAIN MENU</h3>}
        </div>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} p-3 cursor-pointer transition-all duration-200 hover:bg-[var(--bg-secondary)] group ${
              activePage === item.id 
                ? 'bg-[var(--bg-secondary)] border-l-4 border-[var(--accent-color)] pl-[10px]' 
                : collapsed ? '' : 'pl-4'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <div className={`flex items-center justify-center h-8 w-8 rounded-md ${
              activePage === item.id 
                ? 'text-[var(--accent-color)] bg-[var(--bg-secondary)]' 
                : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-color)]'
            }`}>
              {item.icon}
            </div>
            {!collapsed && (
              <span className={`ml-3 ${
                activePage === item.id 
                  ? 'text-[var(--accent-color)] font-medium' 
                  : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-color)]'
              }`}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Menu inférieur */}
      <div className="mt-auto mb-6">
        <div className={`${collapsed ? 'px-2' : 'px-4'} mb-2`}>
          {!collapsed && <h3 className="text-xs uppercase font-semibold text-[var(--text-secondary)] tracking-wider">OTHER</h3>}
        </div>
        {bottomMenuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} p-3 cursor-pointer transition-all duration-200 hover:bg-[var(--bg-secondary)] group ${
              activePage === item.id 
                ? 'bg-[var(--bg-secondary)] border-l-4 border-[var(--accent-color)] pl-[10px]' 
                : collapsed ? '' : 'pl-4'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <div className={`flex items-center justify-center h-8 w-8 rounded-md ${
              activePage === item.id 
                ? 'text-[var(--accent-color)] bg-[var(--bg-secondary)]' 
                : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-color)]'
            }`}>
              {item.icon}
            </div>
            {!collapsed && (
              <span className={`ml-3 ${
                activePage === item.id 
                  ? 'text-[var(--accent-color)] font-medium' 
                  : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-color)]'
              }`}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;