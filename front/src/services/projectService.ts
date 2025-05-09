import api from './api';
import { Project } from '../types';

interface CreateProjectData {
  title: string;
  description: string;
  dueDate: string;
  status?: 'OnTrack' | 'Offtrack' | 'Completed';
  teamMembers?: string[]; // IDs des membres de l'équipe
}

class ProjectService {
  // Récupérer tous les projets
  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
  }

  // Récupérer un projet par son ID
  async getProjectById(projectId: string): Promise<Project> {
    try {
      const response = await api.get<Project>(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${projectId}:`, error);
      throw error;
    }
  }

  // Créer un nouveau projet
  async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const response = await api.post<Project>('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw error;
    }
  }

  // Mettre à jour un projet
  async updateProject(projectId: string, projectData: Partial<CreateProjectData>): Promise<Project> {
    try {
      const response = await api.put<Project>(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du projet ${projectId}:`, error);
      throw error;
    }
  }

  // Supprimer un projet
  async deleteProject(projectId: string): Promise<void> {
    try {
      await api.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du projet ${projectId}:`, error);
      throw error;
    }
  }
}

export default new ProjectService();