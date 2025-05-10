import api from './api';
import { Task } from '../types';

interface CreateTaskData {
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  status?: 'Open' | 'InProgress' | 'Completed' | 'Canceled';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  kanbanStatus?: 'backlog' | 'in-progress' | 'completed';
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: 'Open' | 'InProgress' | 'Completed' | 'Canceled';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  kanbanStatus?: 'backlog' | 'in-progress' | 'completed';
}

class TaskService {
  // Récupérer toutes les tâches d'un projet
  async getTasksByProject(projectId: string): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des tâches du projet ${projectId}:`, error);
      throw error;
    }
  }

  // Récupérer une tâche par son ID
  async getTaskById(taskId: string): Promise<Task> {
    try {
      const response = await api.get<Task>(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la tâche ${taskId}:`, error);
      throw error;
    }
  }

  // Créer une nouvelle tâche
  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const response = await api.post<Task>('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  }

  // Mettre à jour une tâche
  async updateTask(taskId: string, taskData: UpdateTaskData): Promise<Task> {
    try {
      const response = await api.put<Task>(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);
      throw error;
    }
  }

  // Supprimer une tâche
  async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, error);
      throw error;
    }
  }

  // Changer le statut d'une tâche
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
    try {
      const response = await api.patch<Task>(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la tâche ${taskId}:`, error);
      throw error;
    }
  }

  // Assigner une tâche à un utilisateur
  async assignTask(taskId: string, userId: string): Promise<Task> {
    try {
      const response = await api.patch<Task>(`/tasks/${taskId}/assign`, { userId });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'assignation de la tâche ${taskId}:`, error);
      throw error;
    }
  }

  // Déplacer une tâche vers un statut kanban différent
  async moveTaskKanban(taskId: string, kanbanStatus: Task['kanbanStatus']): Promise<Task> {
    try {
      const response = await api.patch<Task>(`/tasks/${taskId}/kanban`, { kanbanStatus });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du déplacement de la tâche ${taskId} dans le kanban:`, error);
      throw error;
    }
  }
}

export default new TaskService();
