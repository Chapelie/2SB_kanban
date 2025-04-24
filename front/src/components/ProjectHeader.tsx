import React from 'react';
import { Project } from '../types';
import { FaCalendarAlt, FaUsers, FaChartLine } from 'react-icons/fa';

interface ProjectHeaderProps {
  project: Project;
  onAssignTask?: () => void; // Rendre optionnel pour faciliter la suppression
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onAssignTask }) => {
  // Fonction pour convertir le statut en français
  const getStatusText = (status: string) => {
    switch (status) {
      case 'OnTrack':
        return 'En bonne voie';
      case 'Offtrack':
        return 'En retard';
      case 'AtRisk':
        return 'À risque';
      default:
        return status;
    }
  };

  // Fonction pour déterminer la couleur du badge de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OnTrack':
        return 'bg-green-100 text-green-600 border border-green-200';
      case 'Offtrack':
        return 'bg-red-100 text-red-600 border border-red-200';
      case 'AtRisk':
        return 'bg-yellow-100 text-yellow-600 border border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-600 border border-blue-200';
    }
  };

  // Formater les dates en français
  const formatFrenchMonth = (dateStr: string) => {
    if (!dateStr) return '';
    
    const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
    const parts = dateStr.split(' ');
    const monthIdx = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(parts[1]);
    
    if (monthIdx !== -1) {
      return `${parts[0]} ${months[monthIdx]} ${parts[2]}`;
    }
    return dateStr;
  };

  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="text-sm text-gray-500 mb-4 flex items-center">
        <span className="hover:text-blue-500 cursor-pointer transition-colors">Projets</span> 
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">{project.title}</span>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center">
          <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
          
          <div className={`mt-2 md:mt-0 md:ml-4 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${getStatusColor(project.status)}`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${
              project.status === 'OnTrack' ? 'bg-green-500' : 
              project.status === 'Offtrack' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></span>
            {getStatusText(project.status)}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mt-2 mb-6 max-w-3xl">
        {project.description}
      </p>

      <div className="flex flex-wrap -mx-3 pt-4 border-t border-gray-100 items-center">
        {/* Membres de l'équipe */}
        <div className="px-3 mb-4 md:mb-0 w-full sm:w-auto">
          <div className="flex items-center">
            <FaUsers className="text-gray-400 mr-2" />
            <div className="text-sm text-gray-500 mr-2">Équipe:</div>
            <div className="flex -space-x-2">
              {project.teamMembers.slice(0, 4).map((member, index) => (
                <div 
                  key={member.id} 
                  className="relative group"
                >
                  <img 
                    src={member.avatar || `/api/placeholder/32/32`} 
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 z-10"
                    title={member.name}
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {member.name}
                  </div>
                </div>
              ))}
              {project.teamMembers.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium border-2 border-white shadow-sm cursor-pointer hover:bg-blue-200 transition-colors z-20">
                  +{project.teamMembers.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Date limite */}
        {project.dueDate && (
          <div className="px-3 mb-4 md:mb-0 w-full sm:w-auto">
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Date limite</div>
                <div className="font-medium text-gray-800">{formatFrenchMonth(project.dueDate)}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Problèmes */}
        <div className="px-3 mb-4 md:mb-0 w-full sm:w-auto">
          <div className="flex items-center">
            <FaChartLine className="text-purple-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Problèmes</div>
              <div className="font-medium text-gray-800">{project.issuesCount || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;