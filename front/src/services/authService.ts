import api from './api';

// Types pour les données d'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  location: string;
  role?: string;
  avatar?: File;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    location: string;
    avatar: string;
    initials?: string;
  };
}

//interface pour la mise à jour du profil
export interface ProfileUpdateData {
  name?: string;
  location?: string;
  avatar?: File;
}


  
  

class AuthService {
  // Méthode de connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/login', credentials);
      
      // Stocker le token et les informations utilisateur
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  // Méthode d'inscription
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Création d'un objet pour l'envoi en JSON (pas un FormData)
      const registerData: any = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        location: userData.location,
        role: userData.role || 'user'
      };
      
      // Si un avatar est fourni, le convertir en base64
      if (userData.avatar) {
        // Attendre la conversion en base64
        registerData.avatar = await this.convertFileToBase64(userData.avatar);
      }
      
      
      
      // Envoyer les données en tant que JSON
      const response = await api.post<AuthResponse>('/register', registerData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Stocker le token et les informations utilisateur
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      // Le reste de votre gestion d'erreurs reste inchangé
      console.error('Erreur d\'inscription:', error);
      
      if (error.response) {
        console.error('Données de réponse d\'erreur:', error.response.data);
        console.error('Statut d\'erreur:', error.response.status);
        console.error('En-têtes de réponse:', error.response.headers);
      } else if (error.request) {
        console.error('Pas de réponse reçue:', error.request);
      } else {
        console.error('Erreur de configuration:', error.message);
      }
      
      throw error;
    }
  }

  // Méthode de déconnexion simplifiée qui évite les délais
  logout(): void {
    // Puis nettoyer localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('tutorialCompleted');
    localStorage.removeItem('animations');
    
    // Notifier le serveur en arrière-plan (facultatif)
    this.notifyLogoutToServer().catch(err => 
      console.warn("Échec de la notification de déconnexion au serveur", err)
    );
  }
  
  // Méthode séparée pour la notification au serveur (ne bloque pas l'UI)
  private async notifyLogoutToServer(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  // Méthode pour récupérer le mot de passe
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Erreur de récupération de mot de passe:', error);
      throw error;
    }
  }

  // Méthode pour réinitialiser le mot de passe
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/reset-password', { 
        token,
        password 
      });
      return response.data;
    } catch (error) {
      console.error('Erreur de réinitialisation de mot de passe:', error);
      throw error;
    }
  }
  
  // Méthode utilitaire pour convertir un fichier en base64 (utilisable si nécessaire)
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
    // Méthode pour mettre à jour le profil utilisateur
  async updateProfile(userData: ProfileUpdateData): Promise<any> {
    try {
      const requestData: any = { ...userData };
      
      // Si un nouvel avatar est fourni sous forme de fichier, le convertir en base64
      if (userData.avatar instanceof File) {
        requestData.avatar = await this.convertFileToBase64(userData.avatar);
      }
      
      // Envoi de la requête API
      const response = await api.put('/api/user/me', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Mettre à jour les informations utilisateur dans le localStorage
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { 
          ...currentUser, 
          ...response.data,
          // S'assurer que ces champs sont bien préservés
          name: response.data.name || currentUser.name,
          location: response.data.location || currentUser.location,
          avatar: response.data.avatar || currentUser.avatar
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      return this.handleApiError(error, 'lors de la mise à jour du profil');
    }
  }
  //méthode utilitaire pour traiter les erreurs API
  private handleApiError(error: any, context: string): never {
    let errorMessage = `Erreur ${context}: `;
    
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      const statusCode = error.response.status;
      const serverMessage = error.response.data?.message || 'Erreur inconnue';
      
      if (statusCode === 401) {
        errorMessage += 'Non autorisé. Veuillez vous reconnecter.';
        // Déconnecter l'utilisateur si le token est invalide
        this.logout();
      } else if (statusCode === 400) {
        errorMessage += serverMessage;
      } else {
        errorMessage += `${serverMessage} (${statusCode})`;
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      errorMessage += 'Pas de réponse du serveur. Vérifiez votre connexion internet.';
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      errorMessage += error.message;
    }
    
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}

export default new AuthService();