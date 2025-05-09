import React from 'react';
import { Task } from '../types';
import UserAvatar from './UserAvatar';
import { FaPaperclip, FaComment, FaClock, FaGripLines } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onClick }) => {
  const { theme } = useTheme();
  
  // Déterminer la couleur du badge de priorité
  const getPriorityColor = (priority: string = 'medium') => {
    switch (priority) {
      case 'high':
        return 'bg-red-400';
      case 'medium':
        return 'bg-yellow-400';
      case 'low':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    // Ajouter une image fantôme pour améliorer l'expérience de drag
    const ghostImage = document.createElement('div');
    ghostImage.classList.add('bg-[var(--bg-primary)]', 'p-2', 'rounded', 'shadow-md', 'text-sm');
    ghostImage.innerText = task.title;
    document.body.appendChild(ghostImage);
    ghostImage.style.position = 'absolute';
    ghostImage.style.top = '-1000px';
    
    e.dataTransfer.setDragImage(ghostImage, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
    
    // Appeler la fonction onDragStart passée en props
    onDragStart(e, task.id);
    
    // Nettoyer l'élément fantôme après un court délai
    setTimeout(() => {
      document.body.removeChild(ghostImage);
    }, 0);
  };

  return (
    <div 
      className="bg-[var(--bg-primary)] rounded-lg p-4 shadow-sm mb-3 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border-l-4 border-transparent hover:border-l-4 hover:border-[var(--accent-color)] relative group"
      draggable="true"
      onDragStart={handleDragStart}
      onClick={() => onClick(task)}
    >
      {/* Poignée de glisser-déposer */}
      <div className="absolute right-2 top-2 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors cursor-grab">
        <FaGripLines />
      </div>
      
      {/* Indicateur de priorité */}
      <div className={`absolute left-0 top-0 w-1 h-full ${getPriorityColor(task.priority)} rounded-l-lg`}></div>
      
      <h4 className="font-medium text-[var(--text-primary)] pr-6">{task.title}</h4>
      <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center mt-3">
        <div className="flex items-center text-[var(--text-secondary)] text-sm mr-4">
          <FaClock className="h-4 w-4 mr-1" />
          {task.days || parseInt(task.timeSpent) || 0} jours
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <button 
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={(e) => e.stopPropagation()}
          >
            <FaPaperclip className="h-4 w-4" />
          </button>
          <span className="text-sm text-[var(--text-secondary)]">{task.attachments || 0}</span>
          <button 
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            <FaComment className="h-4 w-4" />
          </button>
          <span className="text-sm text-[var(--text-secondary)]">{task.comments || 0}</span>
        </div>
        <div className="flex -space-x-1">
          {task.assignees ? (
            task.assignees.map((assignee, idx) => (
              <UserAvatar 
                key={idx} 
                user={assignee} 
                size="sm" 
                className="-ml-1" 
              />
            ))
          ) : (
            <UserAvatar 
              user={{ 
                name: task.assignedTo.name, 
                avatar: task.assignedTo.avatar 
              }} 
              size="sm" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;