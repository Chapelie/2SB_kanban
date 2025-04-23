import React from 'react';
import { Task } from '../types';
import UserAvatar from './UserAvatar';
import { FaPaperclip, FaComment, FaClock } from 'react-icons/fa';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm mb-3"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <h4 className="font-medium text-gray-800">{task.title}</h4>
      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
      
      <div className="flex items-center mt-3">
        <div className="flex items-center text-gray-400 text-sm mr-4">
          <FaClock className="h-4 w-4 mr-1" />
          {task.days || parseInt(task.timeSpent) || 0} Days
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-gray-600">
            <FaPaperclip className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-500">{task.attachments || 0}</span>
          <button className="text-gray-400 hover:text-gray-600 ml-2">
            <FaComment className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-500">{task.comments || 0}</span>
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