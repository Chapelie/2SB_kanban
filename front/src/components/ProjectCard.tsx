import React from 'react';
import { FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void; // Prop optionnelle pour gérer les clics
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const navigate = useNavigate();

  // Gestionnaire de clic intégré au composant
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigation par défaut si aucun gestionnaire n'est fourni
      navigate(`/dashboard/projects/${project.id}`);
    }
  };
  
  // Gestionnaire de clic pour l'icône externe (ouvre dans un nouvel onglet)
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation au parent
    window.open(`/dashboard/projects/${project.id}`, '_blank');
  };

  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-all duration-200 transform hover:translate-y-[-2px] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <FaExternalLinkAlt 
            className="ml-2 text-gray-400 hover:text-blue-500 cursor-pointer" 
            size={14} 
            onClick={handleExternalLinkClick}
            aria-label="Ouvrir dans un nouvel onglet"
          />
        </div>
        <div className={`px-3 py-1 rounded-md text-xs font-medium ${
          project.status === 'Offtrack' 
            ? 'bg-red-100 text-red-600' 
            : project.status === 'OnTrack' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-blue-100 text-blue-600'
        }`}>
          {project.status}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center text-red-500 text-sm">
          <FaCalendarAlt className="mr-1" />
          <span>{project.dueDate}</span>
        </div>
        
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-2">
            {project.teamMembers.slice(0, 4).map((member) => (
              <img 
                key={member.id} 
                src={member.avatar || `/api/placeholder/24/24`} 
                alt={member.name}
                className="w-6 h-6 rounded-full border border-white"
              />
            ))}
            {project.teamMembers.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs text-gray-600">
                +{project.teamMembers.length - 4}
              </div>
            )}
          </div>
          
          <div className="flex items-center ml-4 text-gray-600 text-sm">
            <span className="bg-gray-100 rounded px-2 py-1">
              {project.issuesCount} issues
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;