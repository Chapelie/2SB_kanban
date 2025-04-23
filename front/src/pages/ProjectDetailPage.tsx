import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Project, Task, User } from '../types';
import TaskColumn from '../components/TaskColumn';
import SearchInput from '../components/SearchInput';
import ToggleSwitch from '../components/ToggleSwitch';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
    { id: '1', name: 'John Doe', avatar: '/api/placeholder/40/40', initials: 'JD' },
    { id: '2', name: 'Jane Smith', avatar: '/api/placeholder/40/40', initials: 'JS' },
    { id: '3', name: 'Alex Johnson', avatar: '/api/placeholder/40/40', initials: 'AJ' },
  ];

    // Création d'utilisateurs compatibles avec le type User (incluant location)
  const users: User[] = teamMembers.map(member => ({
    id: member.id,
    name: member.name,
    avatar: member.avatar,
    location: 'Remote', // Ajout de la propriété location obligatoire
    initials: member.name.split(' ').map(n => n[0]).join('').toUpperCase()
  }));
  
  // Création du projet
  const project: Project = {
    id: 'project-1',
    title: 'Adoddle Platform Redesign',
    description: 'Redesign the main dashboard and improve the user experience for our SaaS platform.',
    dueDate: '05 MAY 2025',
    status: 'OnTrack',
    issuesCount: 8,
    teamMembers: teamMembers
  };
  
  // Création des tâches
  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Research User Needs',
      description: 'Interview users and collect feedback about their experience with the current platform.',
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
      assignedTo: teamMembers[0]
    },
    {
      id: 'task-2',
      title: 'Create Wireframes',
      description: 'Design wireframes for the new user interface based on research findings.',
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
      assignedTo: teamMembers[1]
    },
    {
      id: 'task-3',
      title: 'User Flow Mapping',
      description: 'Map out the user flow for key platform features to identify improvements.',
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
      assignedTo: teamMembers[2]
    },
    {
      id: 'task-4',
      title: 'UI Design',
      description: 'Create high-fidelity mockups based on the approved wireframes.',
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
      assignedTo: teamMembers[0]
    },
    {
      id: 'task-5',
      title: 'Usability Testing Plan',
      description: 'Create a test plan for evaluating the new design with real users.',
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
      assignedTo: teamMembers[1]
    },
    {
      id: 'task-6',
      title: 'Design System Updates',
      description: 'Update the design system to include new components and patterns.',
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
      assignedTo: teamMembers[2]
    }
  ];
  
  return { project, tasks };
};

const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId?: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchQuery, setSearchQuery] = useState<string>('');

  // Charger les données du projet
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    const { project, tasks } = getProjectData();
    setProject(project);
    setTasks(tasks);
  }, [projectId]);

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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: 'backlog' | 'in-progress' | 'completed') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
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

  if (!project) {
    return <div className="flex-1 p-8 flex items-center justify-center">Loading project details...</div>;
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-6 py-4">
        {/* Entête avec navigation */}
        <div className="mb-6">
          <Link to="/dashboard/projects" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-4">
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </Link>
          
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{project.title}</h1>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {project.status}
              </div>
              <div className="text-gray-600 text-sm">
                Due: <span className="font-medium">{project.dueDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contrôles de recherche et de vue */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <SearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search Tasks" 
            className="w-full sm:w-64 mb-4 sm:mb-0"
          />
          
          <ToggleSwitch 
            isOn={viewMode === 'grid'} 
            onChange={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} 
            leftLabel="List View" 
            rightLabel="Grid View"
          />
        </div>
        
        {/* Tableau kanban */}
        <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
          {/* Colonne Backlog */}
          <TaskColumn 
            title="Backlog" 
            tasks={getTasksByStatus('backlog')} 
            status="backlog"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          
          {/* Colonne In Progress */}
          <TaskColumn 
            title="In Progress" 
            tasks={getTasksByStatus('in-progress')} 
            status="in-progress"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          
          {/* Colonne Completed */}
          <TaskColumn 
            title="Completed" 
            tasks={getTasksByStatus('completed')} 
            status="completed"
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;