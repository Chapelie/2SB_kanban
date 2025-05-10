import api from './api';
import { SubTask } from '../types';

interface CreateSubTaskData {
  title: string;
  description?: string;
  taskId: string;
  assignedTo?: string; // ID de l'utilisateur assigné
  status?: 'Open' | 'InProgress' | 'Completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface UpdateSubTaskData {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: 'Open' | 'InProgress' | 'Completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  timeSpent?: string;
}

class SubTaskService {
  // Récupérer toutes les sous-tâches d'une tâche
  async getSubTasksByTask(taskId: string): Promise<SubTask[]> {
    try {
      const response = await api.get<SubTask[]>(`/tasks/${taskId}/subtasks`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des sous-tâches de la tâche ${taskId}:`, error);
      throw error;
    }
  }

  // Récupérer une sous-tâche par son ID
  async getSubTaskById(subtaskId: string): Promise<SubTask> {
    try {
      const response = await api.get<SubTask>(`/subtasks/${subtaskId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la sous-tâche ${subtaskId}:`, error);
      throw error;
    }
  }

  // Créer une nouvelle sous-tâche
  async createSubTask(subtaskData: CreateSubTaskData): Promise<SubTask> {
    try {
      const response = await api.post<SubTask>('/subtasks', subtaskData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la sous-tâche:', error);
      throw error;
    }
  }

  // Mettre à jour une sous-tâche
  async updateSubTask(subtaskId: string, subtaskData: UpdateSubTaskData): Promise<SubTask> {
    try {
      const response = await api.put<SubTask>(`/subtasks/${subtaskId}`, subtaskData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la sous-tâche ${subtaskId}:`, error);
      throw error;
    }
  }

  // Supprimer une sous-tâche
  async deleteSubTask(subtaskId: string): Promise<void> {
    try {
      await api.delete(`/subtasks/${subtaskId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la sous-tâche ${subtaskId}:`, error);
      throw error;
    }
  }

  // Changer le statut d'une sous-tâche
  async updateSubTaskStatus(subtaskId: string, status: SubTask['status']): Promise<SubTask> {
    try {
      const response = await api.patch<SubTask>(`/subtasks/${subtaskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la sous-tâche ${subtaskId}:`, error);
      throw error;
    }
  }

  // Assigner une sous-tâche à un utilisateur
  async assignSubTask(subtaskId: string, userId: string): Promise<SubTask> {
    try {
      const response = await api.patch<SubTask>(`/subtasks/${subtaskId}/assign`, { userId });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'assignation de la sous-tâche ${subtaskId}:`, error);
      throw error;
    }
  }

  // Mettre à jour le temps passé sur une sous-tâche
  async updateTimeSpent(subtaskId: string, timeSpent: string): Promise<SubTask> {
    try {
      const response = await api.patch<SubTask>(`/subtasks/${subtaskId}/time`, { timeSpent });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du temps passé sur la sous-tâche ${subtaskId}:`, error);
      throw error;
    }
  }
}

export default new SubTaskService();
