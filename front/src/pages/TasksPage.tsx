import React, { useState, useEffect } from 'react';
import { Task, Project, SubTask, User } from '../types';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import CreateTaskModal from '../components/CreateTaskModal';
import ProjectHeader from '../components/ProjectHeader';
import Pagination from '../components/Pagination';
import ProjectSelector from '../components/ProjectSelector';
import { FaFileAlt, FaClipboardList, FaSearch, FaPlusCircle, FaTable, FaListUl } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

// Utilisateur connecté (simulé)
const currentUser: User = {
  id: '1',
  name: 'Rafik SAWADOGO',
  email: 'rafiksawadogo@gmail.com',
  location: 'Bobo, Burkina Faso',
  avatar: '/api/placeholder/32/32',

};

// Mock data pour les tâches avec le typage correct
const getMockTasks = (): Task[] => {
  return Array(15).fill(null).map((_, index) => {
    // Création des sous-tâches correctement typées
    const subtasks: SubTask[] | undefined = index % 3 === 0 ? [
      {
        id: `subtask-${index}-1`,
        title: 'Concevoir le formulaire de paiement',
        description: 'Créer des maquettes pour le formulaire de paiement conformes aux directives de conception',
        status: 'Completed',
        priority: 'medium',
        timeSpent: '00:15:00',
        assignedTo: {
          id: '2',
          name: 'Marie Dupont',
          avatar: '/api/placeholder/32/32'
        },
        createdAt: '2025-04-10',
        comments: 2
      },
      {
        id: `subtask-${index}-2`,
        title: 'Intégrer l\'API de paiement',
        description: 'Connecter le formulaire de paiement à l\'API de la passerelle de paiement',
        status: 'InProgress',
        priority: 'high',
        timeSpent: '01:45:00',
        assignedTo: {
          id: '3',
          name: 'Alex Martin',
          avatar: '/api/placeholder/32/32'
        },
        createdAt: '2025-04-12',
        comments: 1,
        attachments: 2
      }
    ] : undefined;
    
    // Création de la tâche avec les sous-tâches correctement typées
    return {
      id: `task-${index + 1}`,
      title: 'Créer un système de paiement automatique compatible avec le design',
      taskNumber: `#${622230 + index}`,
      openedDate: '10 jours',
      openedDaysAgo: 10,
      openedBy: 'Thomas Petit',
      status: (index % 4 === 0 
        ? 'Completed' 
        : index % 4 === 1 
          ? 'InProgress' 
          : index % 4 === 2 
            ? 'Canceled' 
            : 'Open'),
      timeSpent: index % 2 === 0 ? '00:30:00' : '00:15:00',
      priority: (index % 3 === 0 
        ? 'high' 
        : index % 3 === 1 
          ? 'medium' 
          : 'low'),
      comments: index % 5,
      description: 'Cette tâche consiste à mettre en œuvre un système de paiement automatique qui permet à l\'équipe de conception de créer rapidement et efficacement des formulaires de paiement.',
      attachments: index % 3 + 1,
      subtasks: subtasks,
      assignedTo: {
        id: index % 5 === 0 ? '2' : index % 3 === 0 ? '3' : '1', // Attribue des tâches à différents utilisateurs, dont le courant
        name: index % 5 === 0 ? 'Marie Dupont' : index % 3 === 0 ? 'Alex Martin' : 'Rafik SAWADOGO',
        avatar: '/api/placeholder/32/32'
      },
      projectId: `project-${index % 3 + 1}` // Attribue des tâches à différents projets
    };
  });
};

// Mock data pour les projets
const getMockProjects = (): Project[] => {
  return [
    {
      id: 'project-1',
      title: 'Refonte du site web',
      description: 'Modernisation complète du site web corporate',
      dueDate: '15 JUIN 2025',
      status: 'OnTrack',
      issuesCount: 8,
      teamMembers: [
        { id: '1', name: 'Rafik SAWADOGO', avatar: '/api/placeholder/28/28' },
        { id: '2', name: 'Marie Dupont', avatar: '/api/placeholder/28/28' },
        { id: '3', name: 'Alex Martin', avatar: '/api/placeholder/28/28' },
      ]
    },
    {
      id: 'project-2',
      title: 'Application mobile',
      description: 'Développement de l\'application mobile cliente',
      dueDate: '30 JUILLET 2025',
      status: 'OnTrack',
      issuesCount: 12,
      teamMembers: [
        { id: '1', name: 'Rafik SAWADOGO', avatar: '/api/placeholder/28/28' },
        { id: '4', name: 'Pierre Moreau', avatar: '/api/placeholder/28/28' },
        { id: '5', name: 'Emma Laurent', avatar: '/api/placeholder/28/28' },
      ]
    },
    {
      id: 'project-3',
      title: 'Système de paiement',
      description: 'Intégration d\'une nouvelle passerelle de paiement',
      dueDate: '10 AOÛT 2025',
      status: 'Offtrack',
      issuesCount: 6,
      teamMembers: [
        { id: '1', name: 'Rafik SAWADOGO', avatar: '/api/placeholder/28/28' },
        { id: '3', name: 'Alex Martin', avatar: '/api/placeholder/28/28' },
        { id: '6', name: 'Lucas Bernard', avatar: '/api/placeholder/28/28' },
      ]
    }
  ];
};

// Fonction pour obtenir la couleur du badge de priorité
const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-600';
    case 'medium':
      return 'bg-yellow-100 text-yellow-600';
    case 'low':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// Fonction pour obtenir le texte de priorité en français
const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'Haute';
    case 'medium':
      return 'Moyenne';
    case 'low':
      return 'Basse';
    default:
      return priority;
  }
};

// Composant pour la vue kanban
const KanbanView: React.FC<{ 
  tasks: Task[], 
  onTaskClick: (taskId: string) => void,
  onTaskMove: (taskId: string, newStatus: Task['status']) => void
}> = ({ tasks, onTaskClick, onTaskMove }) => {
  const { theme } = useTheme();
  
  // Grouper les tâches par statut
  const todoTasks = tasks.filter(task => task.status === 'Open');
  const inProgressTasks = tasks.filter(task => task.status === 'InProgress');
  const doneTasks = tasks.filter(task => task.status === 'Completed');
  const canceledTasks = tasks.filter(task => task.status === 'Canceled');
  
  // État pour le drag and drop
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
  // Fonctions pour le drag and drop
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
    
    // Créer une image fantôme pour améliorer l'expérience de drag
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const ghostImage = document.createElement('div');
      ghostImage.classList.add('bg-[var(--bg-primary)]', 'p-3', 'rounded', 'shadow-lg', 'text-sm');
      ghostImage.innerHTML = `
        <div class="font-medium text-[var(--text-primary)]">${task.title}</div>
        <div class="text-xs text-[var(--text-secondary)]">${task.taskNumber}</div>
      `;
      document.body.appendChild(ghostImage);
      ghostImage.style.position = 'absolute';
      ghostImage.style.top = '-1000px';
      
      e.dataTransfer.setDragImage(ghostImage, 20, 20);
      
      // Nettoyer l'élément fantôme après un court délai
      setTimeout(() => {
        document.body.removeChild(ghostImage);
      }, 0);
    }
    
    // Ajouter une classe au body pour indiquer que le glisser-déposer est actif
    document.body.classList.add('dragging');
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
    document.body.classList.remove('dragging');
  };
  
  const handleDragOver = (e: React.DragEvent, columnStatus: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnStatus) {
      setDragOverColumn(columnStatus);
    }
  };
  
  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    if (!taskId) return;
    
    const draggedTask = tasks.find(task => task.id === taskId);
    if (!draggedTask) return;
    
    // Ne rien faire si la tâche est déjà dans la colonne cible
    if (draggedTask.status === newStatus) return;
    
    // Appeler la fonction de rappel pour mettre à jour le statut de la tâche
    onTaskMove(taskId, newStatus);
    
    // Réinitialiser les états
    setDraggedTaskId(null);
    setDragOverColumn(null);
    document.body.classList.remove('dragging');
  };
  
  // CSS conditionnel pour les colonnes lors du drag
  const getColumnClass = (status: string) => {
    const baseClass = "p-2";
    if (dragOverColumn === status) {
      return `${baseClass} bg-[var(--accent-color-light)] border-2 border-dashed border-[var(--accent-color)] rounded transition-colors`;
    }
    return baseClass;
  };
  
  // Rendu d'une carte de tâche avec support pour drag and drop
  const renderTaskCard = (task: Task) => (
    <div 
      key={task.id}
      className="bg-[var(--bg-primary)] p-3 rounded-md shadow-sm mb-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-l-4 relative"
      style={{
        borderLeftColor: task.priority === 'high' ? '#f87171' : 
                         task.priority === 'medium' ? '#facc15' : 
                         task.priority === 'low' ? '#4ade80' : '#9ca3af'
      }}
      draggable="true"
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragEnd={handleDragEnd}
      onClick={() => onTaskClick(task.id)}
    >
      <div className="text-sm font-medium mb-2 text-[var(--text-primary)] pr-6">{task.title}</div>
      <div className="flex justify-between items-center text-xs">
        <div className="text-[var(--text-secondary)]">{task.taskNumber}</div>
        {task.priority && (
          <span className={`px-2 py-1 rounded-full ${getPriorityBadgeColor(task.priority)}`}>
            {getPriorityText(task.priority)}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={task.assignedTo.avatar} 
            alt={task.assignedTo.name} 
            className="w-6 h-6 rounded-full"
          />
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="ml-2 bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded-full text-xs text-[var(--text-secondary)]">
              {task.subtasks.length} sous-tâches
            </span>
          )}
        </div>
        <div className="text-xs text-[var(--text-secondary)]">{task.timeSpent}</div>
      </div>
      
      {/* Poignée de glisser-déposer */}
      <div className="absolute right-2 top-2 text-[var(--border-color)] group-hover:text-[var(--text-secondary)] opacity-0 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Colonne À faire */}
      <div>
        <div className="bg-blue-50 p-3 rounded-t-md mb-3 flex justify-between items-center">
          <h3 className="font-medium text-blue-700">À faire ({todoTasks.length})</h3>
        </div>
        <div 
          className={getColumnClass('Open')}
          onDragOver={(e) => handleDragOver(e, 'Open')}
          onDrop={(e) => handleDrop(e, 'Open')}
        >
          {todoTasks.map(renderTaskCard)}
          {todoTasks.length === 0 && (
            <div className="text-center py-6 text-[var(--text-secondary)] text-sm border-2 border-dashed border-[var(--border-color)] rounded-lg">
              Déposez une tâche ici
            </div>
          )}
        </div>
      </div>
      
      {/* Colonne En cours */}
      <div>
        <div className="bg-yellow-50 p-3 rounded-t-md mb-3 flex justify-between items-center">
          <h3 className="font-medium text-yellow-700">En cours ({inProgressTasks.length})</h3>
        </div>
        <div 
          className={getColumnClass('InProgress')}
          onDragOver={(e) => handleDragOver(e, 'InProgress')}
          onDrop={(e) => handleDrop(e, 'InProgress')}
        >
          {inProgressTasks.map(renderTaskCard)}
          {inProgressTasks.length === 0 && (
            <div className="text-center py-6 text-[var(--text-secondary)] text-sm border-2 border-dashed border-[var(--border-color)] rounded-lg">
              Déposez une tâche ici
            </div>
          )}
        </div>
      </div>
      
      {/* Colonne Terminé */}
      <div>
        <div className="bg-green-50 p-3 rounded-t-md mb-3 flex justify-between items-center">
          <h3 className="font-medium text-green-700">Terminé ({doneTasks.length})</h3>
        </div>
        <div 
          className={getColumnClass('Completed')}
          onDragOver={(e) => handleDragOver(e, 'Completed')}
          onDrop={(e) => handleDrop(e, 'Completed')}
        >
          {doneTasks.map(renderTaskCard)}
          {doneTasks.length === 0 && (
            <div className="text-center py-6 text-[var(--text-secondary)] text-sm border-2 border-dashed border-[var(--border-color)] rounded-lg">
              Déposez une tâche ici
            </div>
          )}
        </div>
      </div>
      
      {/* Colonne Annulé */}
      <div>
        <div className="bg-red-50 p-3 rounded-t-md mb-3 flex justify-between items-center">
          <h3 className="font-medium text-red-700">Annulé ({canceledTasks.length})</h3>
        </div>
        <div 
          className={getColumnClass('Canceled')}
          onDragOver={(e) => handleDragOver(e, 'Canceled')}
          onDrop={(e) => handleDrop(e, 'Canceled')}
        >
          {canceledTasks.map(renderTaskCard)}
          {canceledTasks.length === 0 && (
            <div className="text-center py-6 text-[var(--text-secondary)] text-sm border-2 border-dashed border-[var(--border-color)] rounded-lg">
              Déposez une tâche ici
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant pour les notifications
const Notification: React.FC<{ 
  message: string, 
  type: 'success' | 'error' | 'info' 
}> = ({ message, type }) => {
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg animate-fadeIn ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`}>
      {message}
    </div>
  );
};

const TasksPage: React.FC = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [assignedToMeFilter, setAssignedToMeFilter] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<SubTask | null>(null);
  const [taskHistory, setTaskHistory] = useState<Array<Task>>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  
  const navigate = useNavigate();
  
  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    // Simuler un délai d'API
    const timer = setTimeout(() => {
      setTasks(getMockTasks());
      setProjects(getMockProjects());
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Nombre d'éléments par page
  const itemsPerPage = 5;
  
  // Filtrer les tâches en fonction de la recherche et des filtres
  const filteredTasks = tasks.filter(task => {
    // Filtrer par projet si un projet est sélectionné
    const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;
    
    // Filtrer par recherche
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.openedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrer par statut si un filtre est sélectionné
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    // Filtrer par priorité si un filtre est sélectionné
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    // Filtrer par tâches assignées à l'utilisateur connecté
    const matchesAssignment = !assignedToMeFilter || task.assignedTo.id === currentUser.id;
    
    return matchesProject && matchesSearch && matchesStatus && matchesPriority && matchesAssignment;
  });
  
  // Obtenir les tâches pour la page actuelle
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  
  // Réinitialiser la page courante lorsque les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, selectedProject, assignedToMeFilter]);
  
  // Effet pour nettoyer la notification après un certain délai
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Naviguer vers la page de détail d'une tâche
  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    } else {
      navigate(`/dashboard/tasks/${taskId}`);
    }
  };
  
  // Fonction pour déplacer une tâche (pour le drag and drop)
  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
    
    // Afficher une notification de succès
    setNotification({
      message: `Tâche déplacée vers "${
        newStatus === 'Open' ? 'À faire' : 
        newStatus === 'InProgress' ? 'En cours' : 
        newStatus === 'Completed' ? 'Terminé' : 'Annulé'
      }"`,
      type: 'success'
    });
  };
  
  // Créer une nouvelle tâche
  const handleCreateTask = () => {
    setShowCreateTaskModal(true);
  };
  
  // Fonction pour traiter la soumission du formulaire de création
  const handleCreateTaskSubmit = (newTask: Partial<Task>) => {
    // Calculer un numéro de tâche unique
    const taskNumber = `#${Math.floor(622230 + tasks.length + 1)}`;
    
    // Créer une tâche complète à partir des données partielles
    const completedTask: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title || 'Nouvelle tâche',
      taskNumber: newTask.taskNumber || taskNumber,
      openedDate: new Date().toISOString(),
      openedDaysAgo: 0,
      openedBy: currentUser.name,
      status: newTask.status || 'Open',
      timeSpent: newTask.timeSpent || '00:00:00',
      priority: newTask.priority || 'medium',
      comments: 0,
      description: newTask.description || '',
      attachments: newTask.attachments || 0,
      assignedTo: newTask.assignedTo || {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      projectId: newTask.projectId || 'project-1',
      subtasks: newTask.subtasks || []
    };
    
    // Ajouter la nouvelle tâche au début du tableau de tâches
    setTasks([completedTask, ...tasks]);
    
    // Afficher une notification de succès
    setNotification({
      message: 'Tâche créée avec succès',
      type: 'success'
    });
  };
  
  // Basculer entre les vues liste et kanban
  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'kanban' : 'list');
  };
  
  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelectedProject('all');
    setAssignedToMeFilter(true);
  };

  // Obtenir le projet sélectionné
  const getSelectedProjectData = () => {
    if (selectedProject === 'all') {
      return {
        id: 'all',
        title: 'Tous les projets',
        description: 'Vue combinée de tous les projets',
        dueDate: '',
        status: 'OnTrack' as const,
        issuesCount: filteredTasks.length,
        teamMembers: projects.flatMap(p => p.teamMembers).filter(
          (member, index, self) => index === self.findIndex(m => m.id === member.id)
        )
      };
    }
    return projects.find(p => p.id === selectedProject) || null;
  };

  // Gestion de l'ouverture d'une sous-tâche
  const handleOpenSubtask = (subtask: SubTask) => {
    if (selectedTask) {
      // Enregistrer la tâche parente dans l'historique
      setTaskHistory([...taskHistory, selectedTask]);
    }
    
    // Fermer la tâche principale et ouvrir la sous-tâche
    setSelectedTask(null);
    setSelectedSubtask(subtask);
    
    // Afficher une notification pour indiquer le changement
    setNotification({
      message: `Sous-tâche "${subtask.title}" ouverte`,
      type: 'info'
    });
  };
  
  // Gestion de la fermeture d'une sous-tâche
  const handleCloseSubtask = () => {
    if (taskHistory.length > 0) {
      // Revenir à la tâche parente depuis l'historique
      const lastTask = taskHistory[taskHistory.length - 1];
      setTaskHistory(taskHistory.slice(0, -1));
      setSelectedSubtask(null);
      setSelectedTask(lastTask);
      
      // Notification pour indiquer le retour à la tâche parente
      setNotification({
        message: `Retour à la tâche "${lastTask.title}"`,
        type: 'info'
      });
    } else {
      // Si pas d'historique, simplement fermer
      setSelectedSubtask(null);
    }
  };

  // Récupérer les données du projet sélectionné
  const selectedProjectData = getSelectedProjectData();

  // Obtenir la liste combinée des utilisateurs pour l'assignation
  const allUsers = [
    currentUser,
    ...projects.flatMap(p => p.teamMembers).filter(
      (member, index, self) => index === self.findIndex(m => m.id === member.id)
    )
  ];

  return (
    <div className="flex-1 bg-[var(--bg-secondary)] min-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        <ProjectSelector 
          projects={projects}
          selectedProject={selectedProject}
          onChange={setSelectedProject}
        />
        
        {selectedProjectData && (
          <ProjectHeader 
            project={selectedProjectData}  
          />
        )}
        
        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm mt-6">
          <div className="flex flex-wrap justify-between items-center p-4 border-b border-[var(--border-color)]">
            <h2 className="text-lg font-medium text-[var(--text-primary)] flex items-center">
              Tâches
              {filteredTasks.length > 0 && (
                <span className="ml-2 bg-[var(--accent-color-light)] text-[var(--accent-color)] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {filteredTasks.length}
                </span>
              )}
            </h2>
            
            <div className="flex items-center flex-wrap space-x-3 mt-2 sm:mt-0">
              {/* Recherche */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Rechercher des tâches..."
                  className="pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm w-full sm:w-auto bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filtres */}
              <div className="relative inline-block text-left">
                <select
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-[var(--bg-primary)] focus:border-[var(--accent-color)] text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Task['status'] | 'all')}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Open">À faire</option>
                  <option value="InProgress">En cours</option>
                  <option value="Completed">Terminé</option>
                  <option value="Canceled">Annulé</option>
                </select>
              </div>
              
              <div className="relative inline-block text-left">
                <select
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-[var(--bg-primary)] focus:border-[var(--accent-color)] text-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as Task['priority'] | 'all')}
                >
                  <option value="all">Toutes les priorités</option>
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Basse</option>
                </select>
              </div>
              
              {/* Filtre de tâches assignées */}
              <div className="flex items-center">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-[var(--accent-color)]"
                    checked={assignedToMeFilter}
                    onChange={(e) => setAssignedToMeFilter(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-[var(--text-primary)]">Mes tâches</span>
                </label>
              </div>
              
              {/* Bouton de réinitialisation des filtres */}
              {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || selectedProject !== 'all' || !assignedToMeFilter) && (
                <button 
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </button>
              )}
              
              {/* Basculer la vue */}
              <button 
                className="flex items-center px-3 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] rounded-md"
                onClick={toggleViewMode}
              >
                {viewMode === 'list' 
                  ? <><FaTable className="mr-2" />Vue Kanban</>
                  : <><FaListUl className="mr-2" />Vue Liste</>
                }
              </button>
              
              {/* Créer une tâche */}
              <button 
                className="flex items-center px-3 py-2 text-sm text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] rounded-md"
                onClick={handleCreateTask}
              >
                <FaPlusCircle className="mr-2" />
                Nouvelle tâche
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)] mx-auto"></div>
              <p className="mt-3 text-[var(--text-secondary)]">Chargement des tâches...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <FaClipboardList className="mx-auto h-12 w-12 text-[var(--border-color)]" />
              <p className="mt-3 text-[var(--text-secondary)]">Aucune tâche ne correspond à vos critères.</p>
              <button 
                className="mt-3 text-[var(--accent-color)] hover:text-[var(--accent-hover)] text-sm"
                onClick={resetFilters}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="p-4">
              {viewMode === 'list' ? (
                <>
                  {paginatedTasks.map((task) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onClick={() => handleTaskClick(task.id)} 
                    />
                  ))}
                  
                  {filteredTasks.length > itemsPerPage && (
                    <div className="mt-4">
                      <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={setCurrentPage} 
                      />
                    </div>
                  )}
                </>
              ) : (
                <KanbanView 
                  tasks={filteredTasks} 
                  onTaskClick={handleTaskClick} 
                  onTaskMove={handleTaskMove}
                />
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm text-[var(--text-secondary)]">
          <div className="text-sm text-[var(--text-secondary)]">
            {filteredTasks.length > 0 
              ? `Affichage de ${viewMode === 'list' ? `${Math.min(filteredTasks.length, (currentPage - 1) * itemsPerPage + 1)}-${Math.min(filteredTasks.length, currentPage * itemsPerPage)}` : filteredTasks.length} sur ${filteredTasks.length} tâches`
              : 'Aucune tâche trouvée'
            }
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-6">
              <FaClipboardList className="mr-2" />
              <span>{tasks.length} tâches au total</span>
            </div>
            <div className="flex items-center">
              <FaFileAlt className="mr-2" />
              <span>15 fichiers</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal pour les tâches principales */}
      {selectedTask && (
        <TaskModal 
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onOpenSubtask={handleOpenSubtask}
        />
      )}
      
      {/* Modal pour les sous-tâches avec possibilité de retour à la tâche parente */}
      {selectedSubtask && (
        <TaskModal 
          task={selectedSubtask}
          isOpen={!!selectedSubtask}
          onClose={handleCloseSubtask}
          isSubtask={true}
        />
      )}
      
      {/* Modal de création de tâche */}
      {showCreateTaskModal && (
        <CreateTaskModal 
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          onSubmit={handleCreateTaskSubmit}
          projects={projects}
          currentUser={currentUser}
          users={allUsers}
        />
      )}
      
      {/* Notification */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
};

export default TasksPage;