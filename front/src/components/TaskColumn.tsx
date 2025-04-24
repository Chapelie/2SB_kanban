import React, { useState } from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';
import { FaPlus, FaEllipsisH } from 'react-icons/fa';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: 'backlog' | 'in-progress' | 'completed';
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: 'backlog' | 'in-progress' | 'completed') => void;
  onTaskClick: (task: Task) => void;
  onAddTask: () => void; // Ajout de la prop manquante
  isDragging?: boolean; // Rendre optionnel pour rétrocompatibilité
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
      className={`bg-gray-50 rounded-lg p-4 h-full transition-colors ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}`}
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
        <h3 className="font-medium text-gray-700 flex items-center">
          {getTranslatedTitle(title)}
          <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </h3>
        <button className="text-gray-400 hover:text-gray-600" aria-label="Plus d'options">
          <FaEllipsisH className="h-5 w-5" />
        </button>
      </div>
      
      <div 
        className="border-2 border-dashed border-blue-300 rounded-lg h-10 mb-4 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={onAddTask} // Utiliser la fonction passée en prop
      >
        <FaPlus className="h-5 w-5 text-blue-500" />
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
          <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
            Déposez une tâche ici
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;