import React, { useState, useEffect } from 'react';
import { Project, User } from '../types';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import Pagination from '../components/Pagination';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Utilisateur connecté (simulé)
const currentUser: User = {
  id: '1',
  name: 'Rafik SAWADOGO',
  email: 'rafik@gmail.com',
  location: 'Bobo, Burkina Faso',
  avatar: '/api/placeholder/32/32',
};

// Cette fonction simule l'obtention de données de projet
const getProjects = (): Project[] => {
  return Array(6).fill(null).map((_, index) => ({
    id: `project-${index + 1}`,
    title: `Adoddle Project ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    dueDate: '05 AVRIL 2023',
    status: index % 3 === 0 ? 'Offtrack' : index % 3 === 1 ? 'OnTrack' : 'Completed',
    issuesCount: 14,
    teamMembers: [
      { id: '1', name: 'Rafik SAWADOGO', avatar: '/api/placeholder/24/24', location: 'Bobo, Burkina Faso' },
      { id: '2', name: 'Member 2', avatar: '/api/placeholder/24/24', location: 'Paris, France' },
      { id: '3', name: 'Member 3', avatar: '/api/placeholder/24/24', location: 'London, UK' },
      { id: '4', name: 'Member 4', avatar: '/api/placeholder/24/24', location: 'Berlin, Germany' },
      { id: '5', name: 'Member 5', avatar: '/api/placeholder/24/24', location: 'New York, USA' },
    ]
  }));
};

// Liste complète des utilisateurs disponibles (simulée)
const getAllUsers = (): User[] => {
  return [
    { id: '1', name: 'Rafik SAWADOGO', email: 'rafik@gmail.com', avatar: '/api/placeholder/24/24', location: 'Bobo, Burkina Faso' },
    { id: '2', name: 'Marie Dupont', email: 'rafik@gmail.com',avatar: '/api/placeholder/24/24', location: 'Paris, France' },
    { id: '3', name: 'John Smith', email: 'rafik@gmail.com',avatar: '/api/placeholder/24/24', location: 'London, UK' },
    { id: '4', name: 'Ana Mueller', email: 'rafik@gmail.com',avatar: '/api/placeholder/24/24', location: 'Berlin, Germany' },
    { id: '5', name: 'Carlos Rodriguez', email: 'rafik@gmail.com', avatar: '/api/placeholder/24/24', location: 'Madrid, Spain' },
    { id: '6', name: 'Yuki Tanaka', email: 'rafik@gmail.com', avatar: '/api/placeholder/24/24', location: 'Tokyo, Japan' },
    { id: '7', name: 'Elena Petrova', email: 'rafik@gmail.com', avatar: '/api/placeholder/24/24', location: 'Moscow, Russia' },
    { id: '8', name: 'Mohammed Al-Fahim', email: 'rafik@gmail.com', avatar: '/api/placeholder/24/24', location: 'Dubai, UAE' },
    { id: '9', name: 'Liu Wei', email: 'rafik@gmail.com', avatar: '/api/placeholder/24/24', location: 'Beijing, China' },
    { id: '10', name: 'Isabella Rossi', email: 'rafik@gmail.com', avatar: '/api/placeholder/24/24', location: 'Rome, Italy' },
  ];
};

const ProjectsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();
  
  const users = getAllUsers();
  const itemsPerPage = 6; // Nombre de projets par page

  // Charger les projets
  useEffect(() => {
    setProjects(getProjects());
  }, []);

  // Filtrer les projets en fonction de la recherche
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Projets paginés
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Nombre total de pages
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // Fonction pour naviguer vers la page de détail d'un projet
  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  // Fonction pour créer un nouveau projet
  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  // Fonction pour créer un projet à partir des données du formulaire
  const handleCreateProjectSubmit = (newProject: Partial<Project>) => {
    // Générer un ID unique pour le nouveau projet
    const projectId = `project-${Date.now()}`;
    
    // Créer un projet complet à partir des données partielles
    const project: Project = {
      id: projectId,
      title: newProject.title || 'Nouveau projet',
      description: newProject.description || '',
      dueDate: newProject.dueDate || '01 JANVIER 2026',
      status: newProject.status || 'OnTrack',
      issuesCount: newProject.issuesCount || 0,
      teamMembers: newProject.teamMembers || [currentUser]
    };
    
    // Ajouter le nouveau projet au début du tableau
    setProjects([project, ...projects]);
    
    // Afficher une notification
    setNotification({
      message: 'Projet créé avec succès',
      type: 'success'
    });

    // Retourner à la première page pour voir le nouveau projet
    setCurrentPage(1);
    
    // Fermer le modal
    setShowCreateModal(false);
  };

  // Nettoyer la notification après un délai
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    // Conteneur principal avec overflow-auto pour permettre le défilement
    <div className="flex-1 bg-[var(--bg-secondary)] overflow-auto">
      {/* Container avec padding important en bas pour garantir l'espace pour la pagination */}
      <div className="px-6 py-4 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Projets</h1>
          <button 
            id="create-project-button"
            className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium px-4 py-2 rounded-md flex items-center"
            onClick={handleCreateProject}
          >
            <FaPlus className="mr-2" />
            Créer un projet
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-[var(--text-secondary)]" />
            </div>
            <input
              type="text"
              placeholder="Rechercher des projets..."
              className="pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] w-full bg-[var(--bg-primary)] text-[var(--text-primary)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-primary)] rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-[var(--text-primary)] font-medium">Aucun projet trouvé</h3>
            <p className="mt-1 text-[var(--text-secondary)] text-sm">Commencez par créer un nouveau projet.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nouveau projet
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grille de projets avec une marge significative en bas */}
            <div id="projects-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProjects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* Pagination avec une marge importante en haut et en bas */}
            <div className="mt-8 mb-10">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          </>
        )}
      </div>

      {/* Modal de création de projet */}
      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProjectSubmit}
          users={users}
          currentUser={currentUser}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;