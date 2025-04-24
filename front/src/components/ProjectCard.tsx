import React from 'react';
import { FaCalendarAlt, FaExternalLinkAlt, FaUsers, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
import { Project } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/dashboard/projects/${project.id}`);
    }
  };
  
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/dashboard/projects/${project.id}`, '_blank');
  };

  // Calcul de la progression estimée basée sur le statut (simulé)
  const getProgressPercentage = () => {
    const now = new Date();
    const dueDate = new Date(project.dueDate.split(' ').slice(1).join(' '));
    const creationDate = new Date(now);
    creationDate.setDate(now.getDate() - 30); // Supposons que le projet a commencé il y a 30 jours
    
    const totalDuration = dueDate.getTime() - creationDate.getTime();
    const elapsed = now.getTime() - creationDate.getTime();
    
    const progress = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
    return project.status === 'Offtrack' ? progress - 15 : progress;
  };


  // Déterminer la couleur du badge de statut
  const getStatusColor = () => {
    switch (project.status) {
      case 'Offtrack':
        return 'bg-red-100 text-red-600 border border-red-200';
      case 'OnTrack':
        return 'bg-green-100 text-green-600 border border-green-200';
      default:
        return 'bg-blue-100 text-blue-600 border border-blue-200';
    }
  };

  // Calculer jours restants
  const getDaysRemaining = () => {
    const now = new Date();
    const dueDate = new Date(project.dueDate.split(' ').slice(1).join(' '));
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const progress = getProgressPercentage();
  const daysRemaining = getDaysRemaining();

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 mb-4 group hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-3px] cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Barre de progression en haut */}
      <div className="h-1.5 w-full bg-gray-100">
        <div 
          className={`h-full ${
            project.status === 'Offtrack' ? 'bg-red-500' : 
            project.status === 'OnTrack' ? 'bg-green-500' : 'bg-blue-500'
          }`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              <button
                className="ml-2 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={handleExternalLinkClick}
                aria-label="Ouvrir dans un nouvel onglet"
              >
                <FaExternalLinkAlt size={14} />
              </button>
            </div>
            <div className={`mt-1.5 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor()}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${
                project.status === 'Offtrack' ? 'bg-red-500' : 
                project.status === 'OnTrack' ? 'bg-green-500' : 'bg-blue-500'
              }`}></span>
              {project.status}
            </div>
          </div>
          
          {/* Badge de jours restants */}
          <div className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
            daysRemaining < 7 ? 'bg-red-50 text-red-600' : 
            daysRemaining < 14 ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
          }`}>
            <FaCalendarAlt className="mr-1.5" size={12} />
            {daysRemaining} jours restants
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {project.description}
        </p>

        <div className="flex flex-wrap justify-between items-center pt-3 border-t border-gray-100">
          {/* Métrique d'équipe */}
          <div className="flex items-center mr-4 mb-2 sm:mb-0">
            <div className="flex -space-x-2 mr-2">
              {project.teamMembers.slice(0, 3).map((member) => (
                <div 
                  key={member.id} 
                  className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-transparent group-hover:ring-blue-100 transition-all duration-300 overflow-hidden"
                  title={member.name}
                >
                  <img 
                    src={member.avatar || '/api/placeholder/32/32'} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {project.teamMembers.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                  +{project.teamMembers.length - 3}
                </div>
              )}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <FaUsers className="mr-1" size={12} />
              <span>{project.teamMembers.length}</span>
            </div>
          </div>
          
          {/* Issues et bouton d'action */}
          <div className="flex items-center">
            {project.issuesCount > 0 && (
              <div className="flex items-center mr-3 text-gray-600 text-sm bg-gray-50 px-2.5 py-1.5 rounded-lg">
                <FaExclamationCircle className={`mr-1 ${project.issuesCount > 5 ? 'text-red-500' : 'text-yellow-500'}`} size={12} />
                <span>{project.issuesCount} issues</span>
              </div>
            )}
            <button 
              className="text-blue-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/projects/${project.id}`);
              }}
              aria-label="Voir les détails"
            >
              <FaArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;