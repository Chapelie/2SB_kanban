import React, { useState } from 'react';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import Pagination from '../components/Pagination';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Cette fonction simule l'obtention de données de projet
const getProjects = (): Project[] => {
  return Array(6).fill(null).map((_, index) => ({
    id: `project-${index + 1}`,
    title: `Adoddle Project ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    dueDate: '05 APRIL 2023',
    status: index % 3 === 0 ? 'Offtrack' : index % 3 === 1 ? 'OnTrack' : 'Completed',
    issuesCount: 14,
    teamMembers: [
      { id: '1', name: 'Member 1', avatar: '/api/placeholder/24/24' },
      { id: '2', name: 'Member 2', avatar: '/api/placeholder/24/24' },
      { id: '3', name: 'Member 3', avatar: '/api/placeholder/24/24' },
      { id: '4', name: 'Member 4', avatar: '/api/placeholder/24/24' },
      { id: '5', name: 'Member 5', avatar: '/api/placeholder/24/24' },
    ]
  }));
};

const ProjectsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const projects = getProjects();
  const totalPages = 3; // Pour la pagination

  // Fonction pour naviguer vers la page de détail d'un projet
  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  // Fonction pour créer un nouveau projet
  const handleCreateProject = () => {
    // Dans une application réelle, vous pourriez rediriger vers un formulaire de création
    console.log("Création d'un nouveau projet");
    // Par exemple: navigate('/dashboard/projects/new');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md flex items-center"
            onClick={handleCreateProject}
          >
            <FaPlus className="mr-2" />
            Create
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="cursor-pointer transform transition-transform hover:scale-102 hover:shadow-lg"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};

export default ProjectsPage;