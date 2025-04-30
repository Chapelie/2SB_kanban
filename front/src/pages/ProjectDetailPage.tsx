import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Project, Task, User } from '../types';
import TaskColumn from '../components/TaskColumn';
import SearchInput from '../components/SearchInput';
import ToggleSwitch from '../components/ToggleSwitch';
import TaskModal from '../components/TaskModal';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
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
  // Exemple d'utilisateurs
  const teamMembers = [
    { id: '1', name: 'John Doe', avatar: '/api/placeholder/40/40', initials: 'JD', location: 'Remote' },
    { id: '2', name: 'Jane Smith', avatar: '/api/placeholder/40/40', initials: 'JS', location: 'Remote' },
    { id: '3', name: 'Alex Johnson', avatar: '/api/placeholder/40/40', initials: 'AJ', location: 'Remote' },
  ];

  // Création d'utilisateurs compatibles avec le type User (incluant location)
  const users: User[] = teamMembers.map(member => ({
    id: member.id,
    name: member.name,
    avatar: member.avatar,
    location: 'Remote', // Ajout de la propriété location obligatoire
    email: `${member.name.toLowerCase().replace(' ', '.')}@example.com`,
    initials: member.name.split(' ').map(n => n[0]).join('').toUpperCase()
  }));
  
  // Création du projet
  const project: Project = {
    id: 'project-1',
    title: 'Refonte de la plateforme Adoddle',
    description: 'Refonte du tableau de bord principal et amélioration de l\'expérience utilisateur pour notre plateforme SaaS.',
    dueDate: '05 MAI 2025',
    status: 'OnTrack',
    issuesCount: 8,
    teamMembers: teamMembers
  };
  
  // Création des tâches
  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Étude des besoins utilisateurs',
      description: 'Interroger les utilisateurs et recueillir des retours sur leur expérience avec la plateforme actuelle.',
      days: 5,
      comments: 3,
      attachments: 2,
      assignees: users.slice(0, 2),
      kanbanStatus: 'backlog',
      taskNumber: 'TASK-001',
      openedDate: '2025-04-15',
      openedBy: 'John Doe',
      status: 'Open',
      timeSpent: '5',
      assignedTo: teamMembers[0],
      projectId: 'project-1',
      openedDaysAgo: 10,
      priority: 'high'
    },
    {
      id: 'task-2',
      title: 'Création des wireframes',
      description: 'Concevoir des wireframes pour la nouvelle interface utilisateur basés sur les résultats de la recherche.',
      days: 7,
      comments: 6,
      attachments: 4,
      assignees: users.slice(1, 3),
      kanbanStatus: 'backlog',
      taskNumber: 'TASK-002',
      openedDate: '2025-04-16',
      openedBy: 'Jane Smith',
      status: 'Open',
      timeSpent: '7',
      assignedTo: teamMembers[1],
      projectId: 'project-1',
      openedDaysAgo: 9,
      priority: 'medium'
    },
    {
      id: 'task-3',
      title: 'Cartographie des flux utilisateurs',
      description: 'Cartographier le flux utilisateur pour les fonctionnalités clés de la plateforme afin d\'identifier les améliorations.',
      days: 4,
      comments: 2,
      attachments: 1,
      assignees: users.slice(0, 1),
      kanbanStatus: 'in-progress',
      taskNumber: 'TASK-003',
      openedDate: '2025-04-17',
      openedBy: 'Alex Johnson',
      status: 'InProgress',
      timeSpent: '4',
      assignedTo: teamMembers[2],
      projectId: 'project-1',
      openedDaysAgo: 8,
      priority: 'high'
    },
    {
      id: 'task-4',
      title: 'Design d\'interface',
      description: 'Créer des maquettes haute-fidélité basées sur les wireframes approuvés.',
      days: 8,
      comments: 4,
      attachments: 8,
      assignees: users.slice(1, 2),
      kanbanStatus: 'in-progress',
      taskNumber: 'TASK-004',
      openedDate: '2025-04-18',
      openedBy: 'John Doe',
      status: 'InProgress',
      timeSpent: '8',
      assignedTo: teamMembers[0],
      projectId: 'project-1',
      openedDaysAgo: 7,
      priority: 'medium'
    },
    {
      id: 'task-5',
      title: 'Plan de test d\'utilisabilité',
      description: 'Créer un plan de test pour évaluer le nouveau design avec de vrais utilisateurs.',
      days: 3,
      comments: 2,
      attachments: 1,
      assignees: users.slice(1, 2),
      kanbanStatus: 'completed',
      taskNumber: 'TASK-005',
      openedDate: '2025-04-19',
      openedBy: 'Jane Smith',
      status: 'Completed',
      timeSpent: '3',
      assignedTo: teamMembers[1],
      projectId: 'project-1',
      openedDaysAgo: 6,
      priority: 'low'
    },
    {
      id: 'task-6',
      title: 'Mises à jour du système de design',
      description: 'Mettre à jour le système de design pour inclure de nouveaux composants et modèles.',
      days: 6,
      comments: 7,
      attachments: 3,
      assignees: users,
      kanbanStatus: 'completed',
      taskNumber: 'TASK-006',
      openedDate: '2025-04-20',
      openedBy: 'Alex Johnson',
      status: 'Completed',
      timeSpent: '6',
      assignedTo: teamMembers[2],
      projectId: 'project-1',
      openedDaysAgo: 5,
      priority: 'low'
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
    
    // Créer une image fantôme pour améliorer l'expérience de drag
    const draggedTask = tasks.find(t => t.id === taskId);
    if (draggedTask) {
      const ghostImage = document.createElement('div');
      ghostImage.classList.add('bg-[var(--bg-primary)]', 'p-3', 'rounded', 'shadow-lg', 'text-sm', 'max-w-xs');
      ghostImage.innerHTML = `
        <div class="font-medium text-[var(--text-primary)]">${draggedTask.title}</div>
        <div class="text-xs text-[var(--text-secondary)]">${draggedTask.taskNumber}</div>
      `;
      document.body.appendChild(ghostImage);
      ghostImage.style.position = 'absolute';
      ghostImage.style.top = '-1000px';
      ghostImage.style.opacity = '0.9';
      
      e.dataTransfer.setDragImage(ghostImage, 20, 20);
      
      // Nettoyer l'élément fantôme après un court délai
      setTimeout(() => {
        document.body.removeChild(ghostImage);
      }, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: 'backlog' | 'in-progress' | 'completed') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setDraggedTaskId(null);
    
    if (!taskId) return; // Vérifier que l'ID de tâche est présent
    
    const draggedTask = tasks.find(task => task.id === taskId);
    if (!draggedTask) return; // Vérifier que la tâche existe
    
    // Ne rien faire si la tâche est déjà dans la colonne cible
    if (draggedTask.kanbanStatus === targetStatus) return;
    
    // Traduire les statuts pour les notifications
    const getStatusName = (status: 'backlog' | 'in-progress' | 'completed') => {
      switch(status) {
        case 'backlog': return 'À faire';
        case 'in-progress': return 'En cours';
        case 'completed': return 'Terminé';
      }
    };
    
    // Mettre à jour l'état des tâches
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          // Mettre à jour à la fois kanbanStatus et status
          let newStatus: Task['status'] = task.status;
          
          switch(targetStatus) {
            case 'backlog':
              newStatus = 'Open';
              break;
            case 'in-progress':
              newStatus = 'InProgress';
              break;
            case 'completed':
              newStatus = 'Completed';
              break;
          }
          
          // Ajouter une notification ou un toast ici dans une application réelle
          console.log(`Tâche "${task.title}" déplacée vers "${getStatusName(targetStatus)}"`);
          
          return { 
            ...task, 
            kanbanStatus: targetStatus,
            status: newStatus
          };
        }
        return task;
      })
    );
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
    if (newTaskColumnStatus && project) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskData.title || 'Nouvelle tâche',
        description: newTaskData.description || '',
        days: newTaskData.days || 0,
        comments: 0,
        attachments: newTaskData.attachments || 0,
        assignees: newTaskData.assignees || [],
        kanbanStatus: newTaskColumnStatus,
        taskNumber: `TASK-${(tasks.length + 1).toString().padStart(3, '0')}`,
        openedDate: new Date().toISOString().split('T')[0],
        openedBy: currentUser.name,
        status: newTaskData.status || (
          newTaskColumnStatus === 'backlog' ? 'Open' : 
          newTaskColumnStatus === 'in-progress' ? 'InProgress' : 'Completed'
        ),
        timeSpent: '0',
        assignedTo: newTaskData.assignedTo || {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar
        },
        projectId: newTaskData.projectId || project.id,
        openedDaysAgo: 0,
        priority: newTaskData.priority || 'medium',
        subtasks: newTaskData.subtasks || []
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setShowNewTaskModal(false);
      setNewTaskColumnStatus(null);
    }
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
      
      {/* Utilisation du composant CreateTaskModal au lieu du modal simple */}
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
    </div>
  );
};

export default ProjectDetailPage;