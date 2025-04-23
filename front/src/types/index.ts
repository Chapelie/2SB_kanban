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
  avatar: string;
}

export interface User {
  id: string;
  name: string;
  location: string;
  avatar: string;
  initials?: string;
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
  // Nouveaux champs pour le Kanban
  description?: string;
  days?: number;
  comments?: number;
  attachments?: number;
  assignees?: User[];
  kanbanStatus?: 'backlog' | 'in-progress' | 'completed';
}