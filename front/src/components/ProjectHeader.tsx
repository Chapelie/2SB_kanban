import React from 'react';
import { Project } from '../types';
import { FaClock } from 'react-icons/fa';

interface ProjectHeaderProps {
  project: Project;
  onAssignTask: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onAssignTask }) => {
  return (
    <div className="mb-6">
      <div className="text-sm text-gray-600 mb-2">
        <span className="hover:text-blue-500 cursor-pointer">Projects</span> / 
        <span className="hover:text-blue-500 cursor-pointer ml-1">{project.title}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <div className="ml-2 p-1 rounded-md bg-white border border-gray-200 shadow-sm">
            <img 
              src={project.teamMembers[0]?.avatar || "/api/placeholder/28/28"}
              alt="Project Owner"
              className="w-7 h-7 rounded-full"
            />
          </div>
          
          <div className="ml-3 flex items-center">
            <div className="flex -space-x-2">
              {project.teamMembers.slice(0, 5).map((member, index) => (
                <img 
                  key={member.id} 
                  src={member.avatar || `/api/placeholder/28/28`} 
                  alt={member.name}
                  className="w-7 h-7 rounded-full border-2 border-white"
                />
              ))}
            </div>
            {project.teamMembers.length > 5 && (
              <div className="ml-1 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                +{project.teamMembers.length - 5}
              </div>
            )}
          </div>
          
          <div className="ml-3 px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-md">
            OnTrack
          </div>
        </div>
        
        <div className="flex">
          <button 
            onClick={onAssignTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Assign Task
          </button>
          
          <div className="flex ml-6 items-center">
            <div className="mr-6">
              <div className="text-sm text-gray-500 mb-1">Time spent</div>
              <div className="flex items-center text-green-500">
                <FaClock className="mr-1" />
                <span>2M : 0W : 0D</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Deadline</div>
              <div className="flex items-center text-green-500">
                <FaClock className="mr-1" />
                <span>6M : 0W : 0D</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
