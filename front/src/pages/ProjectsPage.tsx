import React, { useState, useEffect } from 'react';
import { Project, User } from '../types';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import Pagination from '../components/Pagination';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import userService from '../services/userService';
import authService from '../services/authService';

const ProjectsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const itemsPerPage = 6; // Nombre de projets par page

  // Charger les données utilisateur et projets
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Récupérer l'utilisateur actuel depuis le localStorage
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        } else {
          // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
          navigate('/login');
          return;
        }

        // Charger les projets depuis l'API
        const projectsData = await projectService.getProjects();
        setProjects(projectsData);

        // Charger les utilisateurs depuis l'API
        const usersData = await userService.getAllUsers();
        setUsers(usersData);
      } catch (err: unknown) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les projets. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));

  // Fonction pour naviguer vers la page de détail d'un projet
  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  // Fonction pour créer un nouveau projet
  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  // Fonction pour créer un projet à partir des données du formulaire
  const handleCreateProjectSubmit = async (newProject: Partial<Project>) => {
    try {
      setIsLoading(true);
      
      // Préparer les données du projet
      const projectData = {
        title: newProject.title || 'Nouveau projet',
        description: newProject.description || '',
        dueDate: newProject.dueDate || new Date().toISOString().split('T')[0],
        status: newProject.status || 'OnTrack',
        teamMembers: newProject.teamMembers?.map(member => member.id) || []
      };
      
      // Envoyer la requête API pour créer le projet
      const createdProject = await projectService.createProject(projectData);
      
      // Ajouter le nouveau projet au début du tableau
      setProjects([createdProject, ...projects]);
      
      // Afficher une notification
      setNotification({
        message: 'Projet créé avec succès',
        type: 'success'
      });

      // Retourner à la première page pour voir le nouveau projet
      setCurrentPage(1);
      
      // Fermer le modal
      setShowCreateModal(false);
    } catch (err: unknown) {
      console.error("Erreur lors de la création du projet:", err);
      setNotification({
        message: "Erreur lors de la création du projet: " + (err instanceof Error ? err.message : "Veuillez réessayer"),
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
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

  // Si l'utilisateur n'est pas connecté, ne rien afficher
  if (!currentUser) return null;

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
            disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Affichage de l'état de chargement */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
          </div>
        )}

        {/* Affichage des erreurs */}
        {error && !isLoading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            <p>{error}</p>
            <button 
              className="mt-2 text-sm underline"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Affichage lorsqu'il n'y a pas de projets */}
        {!isLoading && !error && filteredProjects.length === 0 && (
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
        )}

        {/* Affichage des projets */}
        {!isLoading && !error && filteredProjects.length > 0 && (
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