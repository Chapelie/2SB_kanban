import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Project, Task, User } from '../types';
import TaskColumn from '../components/TaskColumn';
import SearchInput from '../components/SearchInput';
import ToggleSwitch from '../components/ToggleSwitch';
import TaskModal from '../components/TaskModal';
import { FaArrowLeft, FaPlus, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CreateTaskModal from '../components/CreateTaskModal';

// Fonction pour convertir le statut d'une tâche vers le format kanban
const mapTaskStatusToKanban = (status: string): 'backlog' | 'in-progress' | 'completed' => {
  switch (status) {
    case 'Open':
      return 'backlog';
    case 'InProgress':
      return 'in-progress';
    case 'Completed':
      return 'completed';
    case 'Canceled':
      return 'backlog'; 
    default:
      return 'backlog';
  }
};

// Simuler l'obtention des données du projet et des tâches
const getProjectData = (): { project: Project, tasks: Task[] } => {
  // Création d'un projet de test
  const project: Project = {
    id: '1',
    title: 'Développement d\'une application web Kanban',
    description: 'Application de gestion de projets avec tableau Kanban et suivi des tâches',
    dueDate: '15 décembre 2023',
    status: 'OnTrack',
    issuesCount: 3,
    teamMembers: [
      {
        id: '1',
        name: 'John Doe',
        location: 'Paris',
        avatar: '/api/placeholder/40/40',
        initials: 'JD'
      },
      {
        id: '2',
        name: 'Marie Dupont',
        location: 'Lyon',
        avatar: '/api/placeholder/40/40',
        initials: 'MD'
      },
      {
        id: '3',
        name: 'Alex Martin',
        location: 'Marseille',
        avatar: '/api/placeholder/40/40',
        initials: 'AM'
      }
    ]
  };

  // Création de tâches de test
  const tasks: Task[] = [
    {
      id: '1',
      taskNumber: 'TASK-001',
      title: 'Conception de l\'interface utilisateur',
      openedDate: '10 octobre 2023',
      openedBy: 'John Doe',
      status: 'Completed',
      timeSpent: '10h',
      assignedTo: {
        id: '1',
        name: 'John Doe',
        avatar: '/api/placeholder/40/40'
      },
      description: 'Création des maquettes et prototypes pour l\'interface utilisateur du tableau Kanban',
      comments: 5,
      attachments: 2,
      projectId: '1',
      kanbanStatus: 'completed'
    },
    {
      id: '2',
      taskNumber: 'TASK-002',
      title: 'Développement du backend API',
      openedDate: '15 octobre 2023',
      openedBy: 'Marie Dupont',
      status: 'InProgress',
      timeSpent: '15h',
      assignedTo: {
        id: '2',
        name: 'Marie Dupont',
        avatar: '/api/placeholder/40/40'
      },
      description: 'Création des endpoints API pour la gestion des tâches et projets',
      comments: 3,
      attachments: 1,
      projectId: '1',
      kanbanStatus: 'in-progress'
    },
    {
      id: '3',
      taskNumber: 'TASK-003',
      title: 'Intégration front-end avec l\'API',
      openedDate: '20 octobre 2023',
      openedBy: 'Alex Martin',
      status: 'Open',
      timeSpent: '0h',
      assignedTo: {
        id: '3',
        name: 'Alex Martin',
        avatar: '/api/placeholder/40/40'
      },
      description: 'Connecter l\'interface utilisateur avec les endpoints du backend',
      comments: 1,
      attachments: 0,
      projectId: '1',
      kanbanStatus: 'backlog'
    },
    {
      id: '4',
      taskNumber: 'TASK-004',
      title: 'Tests d\'intégration',
      openedDate: '25 octobre 2023',
      openedBy: 'John Doe',
      status: 'Open',
      timeSpent: '0h',
      assignedTo: {
        id: '1',
        name: 'John Doe',
        avatar: '/api/placeholder/40/40'
      },
      description: 'Créer et exécuter des tests d\'intégration pour l\'application',
      comments: 0,
      attachments: 0,
      projectId: '1',
      kanbanStatus: 'backlog'
    }
  ];

  return { project, tasks };
};

const ProjectDetailPage: React.FC = () => {
  // Utiliser un underscore pour éviter l'avertissement
  const { projectId } = useParams<{ projectId?: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [newTaskColumnStatus, setNewTaskColumnStatus] = useState<'backlog' | 'in-progress' | 'completed' | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', message: '' });
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  // Utilisateur actuel simulé
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'John Doe',
    avatar: '/api/placeholder/40/40',
    location: 'Remote',
    email: 'john.doe@example.com',
    initials: 'JD'
  });

  // Charger les données du projet
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    const { project, tasks } = getProjectData();
    setProject(project);
    setTasks(tasks);
    
    // Initialiser la liste des projets avec le projet actuel
    setAllProjects([project]);
  }, [projectId]);

  // Effet pour gérer les classes CSS globales pendant le drag
  useEffect(() => {
    if (draggedTaskId) {
      document.body.classList.add('dragging');
    } else {
      document.body.classList.remove('dragging');
    }
    
    return () => {
      document.body.classList.remove('dragging');
    };
  }, [draggedTaskId]);

  // Gestion des notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filtrer les tâches en fonction de la recherche
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour obtenir les tâches par statut
  const getTasksByStatus = (status: 'backlog' | 'in-progress' | 'completed') => {
    return filteredTasks.filter(task => 
      task.kanbanStatus === status || mapTaskStatusToKanban(task.status) === status
    );
  };

  // Fonctions pour gérer le glisser-déposer
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: 'backlog' | 'in-progress' | 'completed') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // Mettre à jour le statut de la tâche
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, kanbanStatus: targetStatus };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setDraggedTaskId(null);
  };

  // Gestionnaire de clic sur une tâche
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Fermeture du modal
  const handleCloseModal = () => {
    setSelectedTask(null);
  };
  
  // Gestionnaire pour créer une nouvelle tâche
  const handleCreateNewTask = (columnStatus: 'backlog' | 'in-progress' | 'completed') => {
    setNewTaskColumnStatus(columnStatus);
    setShowNewTaskModal(true);
  };
  
  // Gestionnaire pour sauvegarder une nouvelle tâche
  const handleSaveNewTask = (newTaskData: Partial<Task>) => {
    if (!project) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      taskNumber: `TASK-${100 + tasks.length}`,
      title: newTaskData.title || 'Nouvelle tâche',
      openedDate: new Date().toLocaleDateString('fr-FR'),
      openedBy: currentUser.name,
      status: 'Open',
      timeSpent: '0h',
      assignedTo: newTaskData.assignedTo || currentUser,
      description: newTaskData.description || '',
      comments: 0,
      attachments: 0,
      projectId: project.id,
      kanbanStatus: newTaskData.kanbanStatus || 'backlog'
    };
    
    // Ajouter la nouvelle tâche
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // Fermer le modal
    setShowNewTaskModal(false);
    setNewTaskColumnStatus(null);
  };

  // Ouvrir le modal d'invitation
  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
    setInviteData({ email: '', message: '' });
  };

  // Gérer l'envoi d'invitation
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification de l'email
    if (!inviteData.email || !inviteData.email.includes('@')) {
      setNotification({
        message: 'Veuillez entrer une adresse email valide',
        type: 'error'
      });
      return;
    }

    // Simulation d'envoi d'email d'invitation
    console.log('Invitation envoyée à:', inviteData.email, 'pour le projet:', projectId);
    
    // Notification de succès
    setNotification({
      message: `Invitation envoyée à ${inviteData.email}`,
      type: 'success'
    });
    
    // Fermer le modal et réinitialiser les données
    setShowInviteModal(false);
    setInviteData({ email: '', message: '' });
  };

  // Notification de succès ou d'erreur
  const renderNotification = () => {
    if (!notification) return null;
    
    return (
      <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${
        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white z-50 flex items-center`}>
        {notification.type === 'success' ? (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )}
        {notification.message}
      </div>
    );
  };

  // Modal d'invitation d'utilisateur à un projet
  const renderInviteModal = () => {
    if (!showInviteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Inviter un collaborateur au projet
            </h3>
            <button 
              onClick={() => setShowInviteModal(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          </div>
          
          {project && (
            <div className="mb-4 p-3 bg-[var(--bg-secondary)] rounded-md">
              <p className="text-sm font-medium text-[var(--text-primary)]">Projet : {project.title}</p>
              <p className="text-xs text-[var(--text-secondary)]">{project.description}</p>
            </div>
          )}
          
          <form onSubmit={handleInviteSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <div className="mr-2 text-[var(--text-secondary)]">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  required
                  placeholder="utilisateur@example.com"
                  className="flex-1 pl-2 pr-4 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Message personnel
              </label>
              <textarea
                placeholder="Nous aimerions que vous rejoigniez notre projet..."
                className="w-full pl-4 pr-4 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] h-24"
                value={inviteData.message}
                onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-md"
              >
                Envoyer l'invitation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // État de chargement
  if (!project) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-t-[var(--accent-color)] border-r-transparent border-b-[var(--accent-color)] border-l-transparent rounded-full mb-4"></div>
          <p className="text-[var(--text-secondary)]">Chargement des détails du projet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[var(--bg-secondary)] overflow-y-auto">
      <div className="px-6 py-4">
        {/* Entête avec navigation */}
        <div className="mb-6">
          <Link to="/dashboard/projects" className="inline-flex items-center text-[var(--accent-color)] hover:text-[var(--accent-hover)] mb-4">
            <FaArrowLeft className="mr-2" />
            Retour aux Projets
          </Link>
          
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{project.title}</h1>
              <p className="text-[var(--text-secondary)] mt-1">{project.description}</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'OnTrack' ? 'bg-green-100 text-green-800' : 
                project.status === 'Offtrack' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status === 'OnTrack' ? 'En bonne voie' : 
                 project.status === 'Offtrack' ? 'En retard' : project.status}
              </div>
              <div className="text-[var(--text-secondary)] text-sm">
                Échéance: <span className="font-medium">{project.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Section des membres d'équipe avec bouton d'invitation */}
          <div className="mt-4 flex flex-wrap items-center">
            <div className="mr-4 mb-2">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Équipe :</span>
            </div>
            <div className="flex -space-x-2 mr-3 mb-2">
              {project.teamMembers.map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  title={member.name}
                  className="w-8 h-8 rounded-full border-2 border-[var(--bg-primary)]"
                />
              ))}
            </div>
            <button 
              onClick={handleOpenInviteModal}
              className="mb-2 flex items-center text-sm bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-3 py-1.5 rounded-md transition-colors"
            >
              <FaUserPlus className="mr-1.5" />
              Inviter un collaborateur
            </button>
          </div>
        </div>
        
        {/* Contrôles de recherche et de vue */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <SearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Rechercher des tâches" 
            className="w-full sm:w-64 mb-4 sm:mb-0"
          />
          
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => handleCreateNewTask('backlog')}
            >
              <FaPlus className="mr-2" />
              Nouvelle tâche
            </button>
            
            <ToggleSwitch 
              isOn={viewMode === 'grid'} 
              onChange={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} 
              leftLabel="Vue liste" 
              rightLabel="Vue grille" 
            />
          </div>
        </div>
        
        {/* Tableau kanban */}
        <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
          {/* Colonne À faire */}
          <TaskColumn 
            title="À faire" 
            tasks={getTasksByStatus('backlog')} 
            status="backlog"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onTaskClick={handleTaskClick}
            onAddTask={() => handleCreateNewTask('backlog')}
            isDragging={!!draggedTaskId}
          />
          
          {/* Colonne En cours */}
          <TaskColumn 
            title="En cours" 
            tasks={getTasksByStatus('in-progress')} 
            status="in-progress"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onTaskClick={handleTaskClick}
            onAddTask={() => handleCreateNewTask('in-progress')}
            isDragging={!!draggedTaskId}
          />
          
          {/* Colonne Terminé */}
          <TaskColumn 
            title="Terminé" 
            tasks={getTasksByStatus('completed')} 
            status="completed"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onTaskClick={handleTaskClick}
            onAddTask={() => handleCreateNewTask('completed')}
            isDragging={!!draggedTaskId}
          />
        </div>
      </div>

      {/* Modal pour afficher les détails d'une tâche */}
      {selectedTask && (
        <TaskModal 
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={handleCloseModal}
        />
      )}
      
      {/* Utilisation du composant CreateTaskModal */}
      {showNewTaskModal && project && (
        <CreateTaskModal
          isOpen={showNewTaskModal}
          onClose={() => {
            setShowNewTaskModal(false);
            setNewTaskColumnStatus(null);
          }}
          onSubmit={(newTaskData) => {
            handleSaveNewTask({
              ...newTaskData,
              kanbanStatus: newTaskColumnStatus || 'backlog'
            });
          }}
          projects={allProjects}
          currentUser={currentUser}
          users={project.teamMembers}
        />
      )}

      {/* Modal d'invitation */}
      {renderInviteModal()}
      
      {/* Notification */}
      {renderNotification()}
    </div>
  );
};

export default ProjectDetailPage;