import React from 'react';
import { FaLightbulb, FaComment } from 'react-icons/fa';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-start">
        <div className="mr-4 mt-1">
          <FaLightbulb className="text-gray-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-base font-medium mb-1">{task.title}</h3>
          <div className="text-xs text-gray-500 mb-2">
            #{task.taskNumber} Opened {task.openedDate} by {task.openedBy}
          </div>
          
          <div className="flex mt-2 justify-between items-center">
            <div className="flex space-x-2">
              <button className={`px-3 py-1 rounded-md text-xs ${
                task.status === 'Canceled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                Canceled
              </button>
              
              <button className={`px-3 py-1 rounded-md text-xs ${
                task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                Completed
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center justify-center text-green-500">
              <span className="text-sm">{task.timeSpent}</span>
            </div>
          </div>
          
          <div className="w-8 h-8">
            <img 
              src={task.assignedTo.avatar || "/api/placeholder/32/32"} 
              alt={task.assignedTo.name}
              className="w-8 h-8 rounded-full border border-gray-200"
            />
          </div>
          
          <div>
            <FaComment className="text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
