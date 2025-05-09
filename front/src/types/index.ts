export interface Project {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Offtrack' | 'OnTrack' | 'Completed';
  issuesCount: number;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  location: string;
  avatar: string;
  initials?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  location: string;
  avatar: string;
  initials?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  status: 'Completed' | 'InProgress' | 'Open';
  priority: 'low' | 'medium' | 'high';
  timeSpent: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  dueDate?: string;
  comments?: number;
  attachments?: number;
}

export interface Task {
  id: string;
  title: string;
  taskNumber: string;
  openedDate: string;
  openedBy: string;
  status: 'Completed' | 'Canceled' | 'InProgress' | 'Open';
  timeSpent: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
  };
  description?: string;
  days?: number;
  comments?: number;
  attachments?: number;
  projectId: string;
  assignees?: User[];
  kanbanStatus?: 'backlog' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  openedDaysAgo?: number;
  subtasks?: SubTask[];
}

export interface WorkLog {
  id: string;
  projectId: string;
  userId: string;
  description: string;
  date: string;
  status: 'pending' | 'completed';
}