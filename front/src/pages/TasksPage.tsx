import React, { useState } from 'react';
import { Task, Project } from '../types';
import TaskItem from '../components/TaskItem';
import ProjectHeader from '../components/ProjectHeader';
import { FaFileAlt, FaClipboardList } from 'react-icons/fa';

// Mock data pour les tâches
const getMockTasks = (): Task[] => {
  return Array(6).fill(null).map((_, index) => ({
    id: `task-${index + 1}`,
    title: 'Make an Automatic Payment System that enable the design',
    taskNumber: `#622235`,
    openedDate: '10 days ago',
    openedBy: 'Yash Ghori',
    status: index % 2 === 0 ? 'Completed' : 'Canceled',
    timeSpent: '00 : 30 : 00',
    assignedTo: {
      id: '1',
      name: 'Anima Agrawal',
      avatar: '/api/placeholder/32/32'
    }
  }));
};

// Mock data pour le projet actuel
const getCurrentProject = (): Project => {
  return {
    id: 'adoddle-1',
    title: 'Adoddle',
    description: 'Project management system',
    dueDate: '05 APRIL 2023',
    status: 'OnTrack',
    issuesCount: 14,
    teamMembers: [
      { id: '1', name: 'Member 1', avatar: '/api/placeholder/28/28' },
      { id: '2', name: 'Member 2', avatar: '/api/placeholder/28/28' },
      { id: '3', name: 'Member 3', avatar: '/api/placeholder/28/28' },
      { id: '4', name: 'Member 4', avatar: '/api/placeholder/28/28' },
      { id: '5', name: 'Member 5', avatar: '/api/placeholder/28/28' },
      { id: '6', name: 'Member 6', avatar: '/api/placeholder/28/28' },
    ]
  };
};

const TasksPage: React.FC = () => {
  const [tasks] = useState<Task[]>(getMockTasks());
  const [currentProject] = useState<Project>(getCurrentProject());
  
  const handleAssignTask = () => {
    console.log('Assign task clicked');
    // Ici vous pourriez ouvrir un modal pour assigner une tâche
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-6 py-4">
        <ProjectHeader project={currentProject} onAssignTask={handleAssignTask} />
        
        <div className="mt-6">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
        
        <div className="flex justify-end mt-4 text-sm text-gray-600">
          <div className="flex items-center mr-6">
            <FaClipboardList className="mr-2" />
            <span>50 tasks</span>
          </div>
          <div className="flex items-center">
            <FaFileAlt className="mr-2" />
            <span>15 files</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
