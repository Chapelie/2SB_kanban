import React from 'react';
import { Task } from '../types';
import { FaComment, FaClipboardList,  } from 'react-icons/fa';

// Définir l'interface des props avec onClick
interface TaskItemProps {
  task: Task;
  onClick?: () => void; // La prop onClick est optionnelle
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => {
  
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


  // Fonction pour obtenir le texte du statut en français
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Terminé';
      case 'InProgress':
        return 'En cours';
      case 'Canceled':
        return 'Annulé';
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
      className="border-b border-[var(--border-color)] last:border-b-0 py-4 flex items-center hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
      onClick={onClick} // Utiliser la prop onClick passée
    >
      <div className="flex-shrink-0 mr-4">
        <div className="w-6 h-6 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
          <svg className="h-4 w-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <h2 className="font-medium text-[var(--text-primary)]">{task.title}</h2>
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          {task.taskNumber} · Ouvert il y a {task.openedDaysAgo} jours par {task.openedBy}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex items-center space-x-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
          {getStatusText(task.status)}
        </span>
        
        {task.priority && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
            {getPriorityText(task.priority)}
          </span>
        )}
        
        <div>
          <img 
            className="h-8 w-8 rounded-full border border-[var(--border-color)]" 
            src={task.assignedTo.avatar || "https://randomuser.me/api/portraits/men/1.jpg"} 
            alt={task.assignedTo.name} 
          />
        </div>
        
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center text-[var(--text-primary)]">
            <span className="mr-1">{task.subtasks.length}</span>
            <FaClipboardList className="h-4 w-4 text-[var(--text-secondary)]" />
          </div>
        )}
        
        {task.comments && task.comments > 0 && (
          <div className="flex items-center text-[var(--text-primary)]">
            <span className="mr-1">{task.comments}</span>
            <FaComment className="h-4 w-4 text-[var(--text-secondary)]" />
          </div>
        )}
        
        <button 
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          onClick={(e) => {
            e.stopPropagation(); // Empêche le déclenchement du onClick du parent
            console.log('Options cliquées pour la tâche', task.id);
          }}
        >
          
        </button>
      </div>
    </div>
  );
};

export default TaskItem;