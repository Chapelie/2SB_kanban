import React from 'react';
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
}

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  tasks, 
  status, 
  onDragStart, 
  onDragOver, 
  onDrop 
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <button className="text-gray-400 hover:text-gray-600" aria-label="More options">
          <FaEllipsisH className="h-5 w-5" />
        </button>
      </div>
      
      <div 
        className="border-2 border-dashed border-blue-300 rounded-lg h-10 mb-4 flex items-center justify-center cursor-pointer hover:bg-blue-50"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
        onClick={() => console.log(`Add task to ${status}`)}
      >
        <FaPlus className="h-5 w-5 text-blue-500" />
      </div>
      
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onDragStart={onDragStart} 
        />
      ))}
    </div>
  );
};

export default TaskColumn;