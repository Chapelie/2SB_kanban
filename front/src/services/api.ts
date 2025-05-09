import axios from 'axios';

// Création d'une instance axios avec des configurations de base
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs 401 (non autorisé)
    if (error.response && error.response.status === 401) {
      // Puis nettoyer localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('tutorialCompleted');
    localStorage.removeItem('animations');
    }
    return Promise.reject(error);
  }
);

export default api;