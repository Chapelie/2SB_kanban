import api from './api';

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    name: string;
  };
}

interface UploadResponse {
  attachment: Attachment;
  message: string;
}

class AttachmentService {
  // Télécharger un fichier joint pour une tâche
  async uploadTaskAttachment(taskId: string, file: File): Promise<UploadResponse> {
    try {
      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<UploadResponse>(
        `/tasks/${taskId}/attachments`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du téléchargement de la pièce jointe pour la tâche ${taskId}:`, error);
      throw error;
    }
  }

  // Télécharger un fichier joint pour une sous-tâche
  async uploadSubTaskAttachment(subtaskId: string, file: File): Promise<UploadResponse> {
    try {
      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<UploadResponse>(
        `/subtasks/${subtaskId}/attachments`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du téléchargement de la pièce jointe pour la sous-tâche ${subtaskId}:`, error);
      throw error;
    }
  }

  // Récupérer les pièces jointes d'une tâche
  async getTaskAttachments(taskId: string): Promise<Attachment[]> {
    try {
      const response = await api.get<Attachment[]>(`/tasks/${taskId}/attachments`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des pièces jointes de la tâche ${taskId}:`, error);
      throw error;
    }
  }

  // Récupérer les pièces jointes d'une sous-tâche
  async getSubTaskAttachments(subtaskId: string): Promise<Attachment[]> {
    try {
      const response = await api.get<Attachment[]>(`/subtasks/${subtaskId}/attachments`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des pièces jointes de la sous-tâche ${subtaskId}:`, error);
      throw error;
    }
  }

  // Supprimer une pièce jointe
  async deleteAttachment(attachmentId: string): Promise<void> {
    try {
      await api.delete(`/attachments/${attachmentId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la pièce jointe ${attachmentId}:`, error);
      throw error;
    }
  }

  // Télécharger une pièce jointe
  async downloadAttachment(attachmentId: string): Promise<Blob> {
    try {
      const response = await api.get(`/attachments/${attachmentId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du téléchargement de la pièce jointe ${attachmentId}:`, error);
      throw error;
    }
  }

  // Convertir un fichier en base64 (utilitaire)
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export default new AttachmentService();
