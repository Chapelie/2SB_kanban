import React from 'react';
import { FaCog, FaUser, FaBell } from 'react-icons/fa';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <FaTasks size={20} /> },
    { id: 'workLogs', label: 'Work Logs', icon: <FaClipboardList size={20} /> },
    { id: 'performance', label: 'Performance', icon: <FaChartLine size={20} /> },
    { id: 'settings', label: 'Settings', icon: <FaCog size={20} /> },
  ];

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 shadow-sm flex flex-col">
      {/* Logo et bouton de réduction */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="ml-3 text-lg font-semibold text-blue-900">2SB Kanban</span>
        </div>
      </div>

      {/* Menu principal */}
      <div className="mt-6 flex-grow">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-blue-50 group ${
              activePage === item.id ? 'bg-blue-50 border-l-4 border-blue-500 pl-[10px]' : 'pl-4'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <div className={`flex items-center justify-center h-8 w-8 rounded-md ${
              activePage === item.id ? 'text-blue-500 bg-blue-100' : 'text-gray-500 group-hover:text-blue-500'
            }`}>
              {item.icon}
            </div>
            <span className={`ml-3 ${
              activePage === item.id ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-blue-500'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;