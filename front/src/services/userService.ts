import api from './api';
import { User } from '../types';

class UserService {
  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Récupérer les détails d'un utilisateur
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
      throw error;
    }
  }
}

export default new UserService();