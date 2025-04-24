/* eslint-disable @typescript-eslint/prefer-as-const */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task, SubTask, Project } from '../types';
import { FaArrowLeft, FaClock, FaComment, FaPaperclip, FaPlusCircle, FaCheck, FaPlay, FaTimes } from 'react-icons/fa';
import TaskModal from '../components/TaskModal';

// Simuler l'obtention d'une tâche spécifique
const getTaskById = (taskId: string): Task | null => {
  const tasks = Array(10).fill(null).map((_, index) => ({
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
          : 'Open') as Task['status'],
    timeSpent: index % 2 === 0 ? '00:30:00' : '00:15:00',
    priority: (index % 3 === 0 
      ? 'high' 
      : index % 3 === 1 
        ? 'medium' 
        : 'low') as 'high' | 'medium' | 'low',
    comments: index % 5,
    description: 'Cette tâche consiste à mettre en œuvre un système de paiement automatique qui permet à l\'équipe de conception de créer rapidement et efficacement des formulaires de paiement. Le système doit prendre en charge plusieurs méthodes de paiement et s\'intégrer aux API existantes.',
    attachments: index % 3 + 1,
    projectId: `project-${index % 3 + 1}`,
    subtasks: index % 3 === 0 ? [
      {
        id: `subtask-${index}-1`,
        title: 'Concevoir l\'interface utilisateur du formulaire de paiement',
        description: 'Créer des maquettes pour le formulaire de paiement conformes aux directives de conception',
        status: 'Completed' as SubTask['status'],
        priority: 'medium' as SubTask['priority'],
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
        status: 'InProgress' as SubTask['status'],
        priority: 'high' as SubTask['priority'],
        timeSpent: '01:45:00',
        assignedTo: {
          id: '3',
          name: 'Alex Martin',
          avatar: '/api/placeholder/32/32'
        },
        createdAt: '2025-04-12',
        comments: 1,
        attachments: 2
      },
      {
        id: `subtask-${index}-3`,
        title: 'Tests unitaires pour la logique de paiement',
        description: 'Écrire des tests unitaires complets pour la logique de traitement des paiements',
        status: 'Open' as SubTask['status'],
        priority: 'low' as SubTask['priority'],
        timeSpent: '00:00:00',
        assignedTo: {
          id: '1',
          name: 'Sophie Lefebvre',
          avatar: '/api/placeholder/32/32'
        },
        createdAt: '2025-04-14'
      }
    ] : [],
    assignedTo: {
      id: '1',
      name: 'Sophie Lefebvre',
      avatar: '/api/placeholder/32/32'
    }
  }));

  return tasks.find(task => task.id === taskId) || null;
};

const getProjectById = (projectId: string): Project | null => {
  const projects = [
    {
      id: 'project-1',
      title: 'Refonte du site web',
      description: 'Modernisation complète du site web corporate',
      dueDate: '15 JUIN 2025',
      status: 'OnTrack' as 'OnTrack',
      issuesCount: 8,
      teamMembers: [
        { id: '1', name: 'Sophie Lefebvre', avatar: '/api/placeholder/28/28' },
        { id: '2', name: 'Marie Dupont', avatar: '/api/placeholder/28/28' },
        { id: '3', name: 'Alex Martin', avatar: '/api/placeholder/28/28' },
      ]
    },
    {
      id: 'project-2',
      title: 'Application mobile',
      description: 'Développement de l\'application mobile cliente',
      dueDate: '30 JUILLET 2025',
      status: 'OnTrack' as 'OnTrack',
      issuesCount: 12,
      teamMembers: [
        { id: '1', name: 'Sophie Lefebvre', avatar: '/api/placeholder/28/28' },
        { id: '4', name: 'Pierre Moreau', avatar: '/api/placeholder/28/28' },
        { id: '5', name: 'Emma Laurent', avatar: '/api/placeholder/28/28' },
      ]
    },
    {
      id: 'project-3',
      title: 'Système de paiement',
      description: 'Intégration d\'une nouvelle passerelle de paiement',
      dueDate: '10 AOÛT 2025',
      status: 'Offtrack' as 'Offtrack',
      issuesCount: 6,
      teamMembers: [
        { id: '1', name: 'Sophie Lefebvre', avatar: '/api/placeholder/28/28' },
        { id: '3', name: 'Alex Martin', avatar: '/api/placeholder/28/28' },
        { id: '6', name: 'Lucas Bernard', avatar: '/api/placeholder/28/28' },
      ]
    }
  ];
  
  return projects.find(p => p.id === projectId) || null;
};

// Composant pour afficher une sous-tâche
const SubTaskItem: React.FC<{ 
  subtask: SubTask, 
  onStatusChange: (id: string, newStatus: SubTask['status']) => void,
  onClick: () => void
}> = ({ subtask, onStatusChange, onClick }) => {
  // Fonction pour déterminer la couleur du badge de priorité
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

  // Fonction pour déterminer la couleur du badge de statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'InProgress':
        return 'bg-blue-100 text-blue-600';
      case 'Open':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Fonction pour obtenir le texte du statut en français
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Terminé';
      case 'InProgress':
        return 'En cours';
      case 'Open':
        return 'À faire';
      default:
        return status;
    }
  };

  // Fonction pour obtenir le texte de la priorité en français
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

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-800">{subtask.title}</h3>
        <div className="flex space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(subtask.status)}`}>
            {getStatusText(subtask.status)}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(subtask.priority)}`}>
            {getPriorityText(subtask.priority)}
          </span>
        </div>
      </div>
      
      {subtask.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{subtask.description}</p>
      )}
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-500 text-sm">
            <FaClock className="mr-1 h-4 w-4" />
            <span>{subtask.timeSpent}</span>
          </div>
          
          {subtask.comments && (
            <div className="flex items-center text-gray-500 text-sm">
              <FaComment className="mr-1 h-4 w-4" />
              <span>{subtask.comments}</span>
            </div>
          )}
          
          {subtask.attachments && (
            <div className="flex items-center text-gray-500 text-sm">
              <FaPaperclip className="mr-1 h-4 w-4" />
              <span>{subtask.attachments}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-500">
            Créé le {new Date(subtask.createdAt).toLocaleDateString('fr-FR')}
          </div>
          <img 
            className="h-8 w-8 rounded-full" 
            src={subtask.assignedTo.avatar} 
            alt={subtask.assignedTo.name} 
          />
          
          {/* Actions rapides pour le statut */}
          <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
            <button 
              className={`p-1 rounded-full ${subtask.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:text-green-600'}`}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(subtask.id, 'Completed');
              }}
              title="Marquer comme terminé"
            >
              <FaCheck className="h-3.5 w-3.5" />
            </button>
            <button 
              className={`p-1 rounded-full ${subtask.status === 'InProgress' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 hover:text-blue-600'}`}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(subtask.id, 'InProgress');
              }}
              title="Marquer comme en cours"
            >
              <FaPlay className="h-3.5 w-3.5" />
            </button>
            <button 
              className={`p-1 rounded-full ${subtask.status === 'Open' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400 hover:text-purple-600'}`}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(subtask.id, 'Open');
              }}
              title="Marquer comme à faire"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubtask, setSelectedSubtask] = useState<SubTask | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    if (taskId) {
      // Dans une application réelle, ceci serait un appel API
      const fetchedTask = getTaskById(taskId);
      setTask(fetchedTask);
      
      if (fetchedTask?.projectId) {
        const fetchedProject = getProjectById(fetchedTask.projectId);
        setProject(fetchedProject);
      }
      
      setLoading(false);

      // Si la tâche n'a pas de sous-tâches, afficher le modal automatiquement
      if (fetchedTask && (!fetchedTask.subtasks || fetchedTask.subtasks.length === 0)) {
        setShowTaskModal(true);
      }
    }
  }, [taskId]);

  const handleBackClick = () => {
    navigate('/dashboard/tasks');
  };

  const handleAddSubtask = () => {
    console.log('Ajout de sous-tâche cliqué');
    // Ici vous pourriez ouvrir un modal pour créer une sous-tâche
  };
  
  // Gérer le changement de statut d'une sous-tâche
  const handleSubtaskStatusChange = (subtaskId: string, newStatus: SubTask['status']) => {
    if (!task || !task.subtasks) return;
    
    setTask({
      ...task,
      subtasks: task.subtasks.map(st => 
        st.id === subtaskId 
          ? { ...st, status: newStatus }
          : st
      )
    });
  };

  // Gérer le clic sur une sous-tâche
  const handleSubtaskClick = (subtask: SubTask) => {
    setSelectedSubtask(subtask);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-500">Chargement des détails de la tâche...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Tâche non trouvée. <button className="text-blue-500 hover:underline" onClick={handleBackClick}>Retour</button></p>
      </div>
    );
  }

  // Fonction pour déterminer la couleur du badge de statut
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'InProgress':
        return 'bg-blue-100 text-blue-600';
      case 'Canceled':
        return 'bg-red-100 text-red-600';
      case 'Open':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Fonction pour déterminer la couleur du badge de priorité
  const getPriorityBadgeColor = (priority?: string) => {
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
  
  // Fonction pour obtenir le texte du statut en français
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Terminé';
      case 'InProgress':
        return 'En cours';
      case 'Open':
        return 'À faire';
      case 'Canceled':
        return 'Annulé';
      default:
        return status;
    }
  };

  // Fonction pour obtenir le texte de la priorité en français
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

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <button 
            className="flex items-center text-blue-500 hover:text-blue-600"
            onClick={handleBackClick}
          >
            <FaArrowLeft className="mr-2" />
            Retour aux tâches
          </button>
        </div>
        
        {/* Afficher la tâche principale avec l'option de l'ouvrir dans un modal */}
        <div 
          className="bg-white rounded-lg shadow-sm p-6 mb-6 cursor-pointer hover:shadow-md transition-all"
          onClick={() => setShowTaskModal(true)}
        >
          <div className="flex justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{task.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {task.taskNumber} · Ouvert il y a {task.openedDaysAgo} jours par {task.openedBy}
              </p>
              {project && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {project.title}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              {task.priority && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
              )}
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-gray-50 p-2 rounded">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={task.assignedTo.avatar} 
                    alt={task.assignedTo.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigné à</p>
                  <p className="text-sm font-medium">{task.assignedTo.name}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-gray-50 p-2 rounded">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-3">
                  <FaClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Temps passé</p>
                  <p className="text-sm font-medium">{task.timeSpent}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-gray-50 p-2 rounded">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full mr-3">
                  <FaComment className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Commentaires</p>
                  <p className="text-sm font-medium">{task.comments || 0}</p>
                </div>
              </div>
              
              {task.attachments && (
                <div className="flex items-center bg-gray-50 p-2 rounded">
                  <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-500 rounded-full mr-3">
                    <FaPaperclip className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pièces jointes</p>
                    <p className="text-sm font-medium">{task.attachments}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {task.description && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600 line-clamp-3">{task.description}</p>
              {task.description.length > 150 && (
                <button className="text-blue-500 mt-2 text-sm">Voir plus</button>
              )}
            </div>
          )}
        </div>
        
        {/* Afficher la liste des sous-tâches si elles existent */}
        {hasSubtasks && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-700">Sous-tâches ({task.subtasks?.length || 0})</h2>
              <button 
                className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                onClick={handleAddSubtask}
              >
                <FaPlusCircle className="mr-2" />
                Ajouter une sous-tâche
              </button>
            </div>
            
            <div>
              {task.subtasks && task.subtasks.length > 0 ? (
                task.subtasks.map(subtask => (
                  <SubTaskItem 
                    key={subtask.id} 
                    subtask={subtask} 
                    onStatusChange={handleSubtaskStatusChange}
                    onClick={() => handleSubtaskClick(subtask)}
                  />
                ))
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500">Aucune sous-tâche pour le moment.</p>
                  <button 
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleAddSubtask}
                  >
                    Créer la première sous-tâche
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal pour afficher les détails d'une tâche */}
      {showTaskModal && task && (
        <TaskModal 
          task={task}
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {/* Modal pour afficher les détails d'une sous-tâche */}
      {selectedSubtask && (
        <TaskModal 
          task={selectedSubtask}
          isOpen={!!selectedSubtask}
          onClose={() => setSelectedSubtask(null)}
          isSubtask={true}
        />
      )}
    </div>
  );
};

export default TaskDetailPage;