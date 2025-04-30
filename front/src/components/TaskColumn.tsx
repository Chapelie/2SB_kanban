import React, { useState } from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';
import { FaPlus, FaEllipsisH } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: 'backlog' | 'in-progress' | 'completed';
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: 'backlog' | 'in-progress' | 'completed') => void;
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
  isDragging?: boolean;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  tasks, 
  status, 
  onDragStart, 
  onDragOver, 
  onDrop,
  onTaskClick,
  onAddTask,
  isDragging = false
}) => {
  const { theme } = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);

  // Gérer l'entrée du drag
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  // Gérer la sortie du drag
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Traduire les titres des colonnes en français
  const getTranslatedTitle = (englishTitle: string) => {
    switch (englishTitle) {
      case 'Backlog':
        return 'À faire';
      case 'In Progress':
        return 'En cours';
      case 'Completed':
        return 'Terminé';
      default:
        return englishTitle;
    }
  };

  return (
    <div 
      className={`bg-[var(--bg-secondary)] rounded-lg p-4 h-full transition-colors ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, status);
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-[var(--text-primary)] flex items-center">
          {getTranslatedTitle(title)}
          <span className="ml-2 text-xs font-normal text-[var(--text-secondary)] bg-[var(--bg-primary)] rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </h3>
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" aria-label="Plus d'options">
          <FaEllipsisH className="h-5 w-5" />
        </button>
      </div>
      
      <div 
        className="border-2 border-dashed border-[var(--accent-color)] rounded-lg h-10 mb-4 flex items-center justify-center cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
        onClick={onAddTask}
      >
        <FaPlus className="h-5 w-5 text-[var(--accent-color)]" />
      </div>
      
      <div className="space-y-3 min-h-[100px]">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDragStart={onDragStart} 
              onClick={onTaskClick}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-20 border-2 border-dashed border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] text-sm">
            Déposez une tâche ici
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;