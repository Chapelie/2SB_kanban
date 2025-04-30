import React, { useState, useEffect, useRef } from 'react';
import { Project, User } from '../types';
import { FaTimes, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
  users: User[];
  currentUser: User;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  users,
  currentUser
}) => {
  const { theme } = useTheme();
  
  // État pour le formulaire de projet
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    status: 'OnTrack',
    dueDate: '',
    issuesCount: 0,
    teamMembers: [
      {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        location: currentUser.location
      }
    ]
  });

  // État pour la date d'échéance
  const [dueDate, setDueDate] = useState<string>('');
  
  // Référence pour le clic à l'extérieur
  const modalRef = useRef<HTMLDivElement>(null);

  // Empêcher le défilement du corps lorsque le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Gestion de l'échap pour fermer le modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (dueDate) {
      // Formater la date dans le format attendu "DD MONTH YYYY"
      const date = new Date(dueDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('fr-FR', { month: 'long' }).toUpperCase();
      const year = date.getFullYear();
      
      setProjectForm(prev => ({
        ...prev,
        dueDate: `${day} ${month} ${year}`
      }));
    }
  }, [dueDate]);

  if (!isOpen) return null;

  // Gestionnaire de changement pour les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ajouter un membre à l'équipe
  const handleAddTeamMember = (userId: string) => {
    // Vérifier si l'utilisateur est déjà dans l'équipe
    if (projectForm.teamMembers?.some(member => member.id === userId)) {
      return;
    }
    
    const selectedUser = users.find(user => user.id === userId);
    
    if (selectedUser && projectForm.teamMembers) {
      setProjectForm(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers!, selectedUser]
      }));
    }
  };

  // Supprimer un membre de l'équipe
  const handleRemoveTeamMember = (userId: string) => {
    // Ne pas permettre la suppression de l'utilisateur courant
    if (userId === currentUser.id) {
      return;
    }
    
    if (projectForm.teamMembers) {
      setProjectForm(prev => ({
        ...prev,
        teamMembers: prev.teamMembers!.filter(member => member.id !== userId)
      }));
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider que tous les champs obligatoires sont remplis
    if (!projectForm.title || !projectForm.dueDate) {
      // Dans une application réelle, afficher une erreur de validation
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    onSubmit(projectForm);
    
    // Réinitialiser le formulaire
    setProjectForm({
      title: '',
      description: '',
      status: 'OnTrack',
      dueDate: '',
      issuesCount: 0,
      teamMembers: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          location: currentUser.location
        }
      ]
    });
    setDueDate('');
    
    // Fermer le modal
    onClose();
  };

  // Fonction pour fermer le modal en cliquant à l'extérieur
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const availableUsers = users.filter(
    user => !projectForm.teamMembers?.some(member => member.id === user.id)
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Arrière-plan flou semi-transparent */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Contenu du modal */}
      <div 
        ref={modalRef}
        className="bg-[var(--bg-primary)] rounded-lg shadow-2xl w-full max-w-xl mx-4 relative z-10 overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          {/* En-tête du modal */}
          <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-4 px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Nouveau projet</h2>
              <button 
                type="button"
                onClick={onClose} 
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 hover:bg-[var(--bg-secondary)] rounded-full"
                aria-label="Fermer"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Corps du formulaire */}
          <div className="p-6 max-h-[calc(90vh-160px)] overflow-y-auto">
            {/* Titre */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Titre du projet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={projectForm.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-primary)]"
                placeholder="Entrez le titre du projet"
              />
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={projectForm.description || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none bg-[var(--bg-primary)]"
                placeholder="Décrivez votre projet en quelques lignes..."
              />
            </div>
            
            {/* Date d'échéance */}
            <div className="mb-4">
              <label htmlFor="dueDate" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Date d'échéance <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-primary)]"
                />
              </div>
            </div>
            
            {/* Statut du projet */}
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={projectForm.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)]"
              >
                <option value="OnTrack">En cours</option>
                <option value="Offtrack">En retard</option>
                <option value="Completed">Terminé</option>
              </select>
            </div>
            
            {/* Membres de l'équipe */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Membres de l'équipe
              </label>
              
              {/* Liste des membres actuels */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {projectForm.teamMembers?.map(member => (
                    <div 
                      key={member.id}
                      className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full pl-1 pr-2 py-1"
                    >
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-[var(--text-primary)]">{member.name}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className={`ml-2 text-[var(--text-secondary)] hover:text-red-500 ${member.id === currentUser.id ? 'opacity-30 cursor-not-allowed' : ''}`}
                        disabled={member.id === currentUser.id}
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ajouter de nouveaux membres */}
              {availableUsers.length > 0 && (
                <div className="mt-2">
                  <label htmlFor="newMember" className="block text-xs text-[var(--text-secondary)] mb-1">
                    Ajouter un membre
                  </label>
                  <select
                    id="newMember"
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)]"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddTeamMember(e.target.value);
                        e.target.value = ''; // Réinitialiser après ajout
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Sélectionner un utilisateur</option>
                    {availableUsers.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          
          {/* Pied du modal avec boutons d'action */}
          <div className="bg-[var(--bg-secondary)] px-6 py-4 flex justify-end space-x-3 border-t border-[var(--border-color)]">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-md hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent-color)] border border-transparent rounded-md hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] flex items-center"
            >
              <FaPlus className="mr-2" />
              Créer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;