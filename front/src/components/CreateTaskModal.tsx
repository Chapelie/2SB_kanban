import React, { useState, useEffect, useRef } from 'react';
import { Task, Project, SubTask, User, TeamMember } from '../types';
import { FaTimes, FaPlus, FaPaperclip, FaTrash } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  projects: Project[];
  currentUser: User;
  users: TeamMember[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  projects, 
  currentUser,
  users 
}) => {
  const { theme } = useTheme();
  
  // État pour le formulaire de tâche
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'Open',
    priority: 'medium',
    projectId: projects.length > 0 ? projects[0].id : '',
    assignedTo: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar
    },
    subtasks: []
  });

  // État pour les sous-tâches temporaires
  const [subtasks, setSubtasks] = useState<Partial<SubTask>[]>([]);
  
  // État pour les pièces jointes
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'attachments'>('details');
  
  // Référence pour le clic à l'extérieur
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (!isOpen) return null;

  // Gestionnaire de changement pour les champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestionnaire pour l'assignation
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    const selectedUser = users.find(user => user.id === userId);
    
    if (selectedUser) {
      setTaskForm(prev => ({
        ...prev,
        assignedTo: {
          id: selectedUser.id,
          name: selectedUser.name,
          avatar: selectedUser.avatar
        }
      }));
    }
  };

  // Ajouter une nouvelle sous-tâche vide
  const addSubtask = () => {
    const newSubtask: Partial<SubTask> = {
      id: `temp-subtask-${Date.now()}`,
      title: '',
      status: 'Open',
      priority: 'medium',
      assignedTo: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      }
    };
    
    setSubtasks([...subtasks, newSubtask]);
  };

  // Mettre à jour une sous-tâche existante
  const updateSubtask = (index: number, field: string, value: any) => {
    const updatedSubtasks = [...subtasks];
    
    if (field === 'assignedTo') {
      const selectedUser = users.find(user => user.id === value);
      if (selectedUser) {
        updatedSubtasks[index] = {
          ...updatedSubtasks[index],
          assignedTo: {
            id: selectedUser.id,
            name: selectedUser.name,
            avatar: selectedUser.avatar
          }
        };
      }
    } else {
      updatedSubtasks[index] = {
        ...updatedSubtasks[index],
        [field]: value
      };
    }
    
    setSubtasks(updatedSubtasks);
  };

  // Supprimer une sous-tâche
  const removeSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };

  // Traiter l'ajout de pièces jointes
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // Gérer le changement de fichiers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachmentFiles(prev => [...prev, ...filesArray]);
      
      // Réinitialiser l'input file pour permettre la sélection répétée du même fichier
      e.target.value = '';
    }
  };

  // Supprimer une pièce jointe
  const removeAttachment = (index: number) => {
    const updatedFiles = [...attachmentFiles];
    updatedFiles.splice(index, 1);
    setAttachmentFiles(updatedFiles);
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construire l'objet tâche final avec les sous-tâches
    const finalTask: Partial<Task> = {
      ...taskForm,
      subtasks: subtasks as SubTask[],
      // Dans une vraie application, vous enverriez les fichiers séparément
      // Ici, nous nous contentons de définir le nombre de pièces jointes
      attachments: attachmentFiles.length,
      // Ajouter des champs par défaut
      taskNumber: `#${Math.floor(Math.random() * 10000)}`,
      openedDate: new Date().toISOString(),
      openedBy: currentUser.name,
      openedDaysAgo: 0,
      timeSpent: '00:00:00'
    };
    
    onSubmit(finalTask);
    
    // Réinitialiser le formulaire
    setTaskForm({
      title: '',
      description: '',
      status: 'Open',
      priority: 'medium',
      projectId: projects.length > 0 ? projects[0].id : '',
      assignedTo: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      }
    });
    setSubtasks([]);
    setAttachmentFiles([]);
    setActiveTab('details');
    
    // Fermer le modal
    onClose();
  };

  // Fonction pour fermer le modal en cliquant à l'extérieur
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
        className="bg-[var(--bg-primary)] rounded-lg shadow-2xl w-full max-w-xl mx-4 relative z-10"
      >
        <form onSubmit={handleSubmit}>
          {/* En-tête du modal */}
          <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-4 px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Nouvelle tâche</h2>
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
          
          {/* Onglets */}
          <div className="px-6 border-b border-[var(--border-color)] flex">
            <button 
              type="button"
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'details' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              onClick={() => setActiveTab('details')}
            >
              Détails
            </button>
            
            <button 
              type="button"
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'subtasks' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              onClick={() => setActiveTab('subtasks')}
            >
              Sous-tâches {subtasks.length > 0 && `(${subtasks.length})`}
            </button>
            
            <button 
              type="button"
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'attachments' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              onClick={() => setActiveTab('attachments')}
            >
              Pièces jointes {attachmentFiles.length > 0 && `(${attachmentFiles.length})`}
            </button>
          </div>
          
          {/* Corps du formulaire */}
          <div className="p-6 max-h-[calc(90vh-160px)] overflow-y-auto">
            {/* Onglet Détails */}
            {activeTab === 'details' && (
              <>
                {/* Titre */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={taskForm.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    placeholder="Entrez le titre de la tâche"
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
                    value={taskForm.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    placeholder="Décrivez la tâche en détail..."
                  />
                </div>
                
                {/* Projet */}
                <div className="mb-4">
                  <label htmlFor="projectId" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Projet <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="projectId"
                    name="projectId"
                    value={taskForm.projectId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                    {projects.length === 0 && (
                      <option value="">Aucun projet disponible</option>
                    )}
                  </select>
                </div>
                
                {/* Ligne pour statut et priorité */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Statut */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Statut
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={taskForm.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="Open">À faire</option>
                      <option value="InProgress">En cours</option>
                      <option value="Completed">Terminé</option>
                      <option value="Canceled">Annulé</option>
                    </select>
                  </div>
                  
                  {/* Priorité */}
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Priorité
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={taskForm.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                </div>
                
                {/* Assigné à */}
                <div className="mb-4">
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Assigné à
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={taskForm.assignedTo?.id}
                    onChange={handleAssigneeChange}
                    className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            {/* Onglet Sous-tâches */}
            {activeTab === 'subtasks' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-[var(--text-primary)]">Liste des sous-tâches</h3>
                  <button 
                    type="button"
                    onClick={addSubtask}
                    className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <FaPlus className="mr-1.5 h-3 w-3" />
                    Ajouter
                  </button>
                </div>
                
                {subtasks.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-[var(--border-color)] rounded-lg">
                    <p className="text-[var(--text-secondary)]">Aucune sous-tâche</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Cliquez sur "Ajouter" pour créer une sous-tâche</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subtasks.map((subtask, index) => (
                      <div key={subtask.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--bg-primary)]">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-[var(--text-primary)] mb-3">Sous-tâche {index + 1}</h4>
                          <button 
                            type="button"
                            onClick={() => removeSubtask(index)}
                            className="text-[var(--text-secondary)] hover:text-red-500"
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        
                        {/* Titre de la sous-tâche */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                            Titre <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={subtask.title}
                            onChange={(e) => updateSubtask(index, 'title', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            placeholder="Titre de la sous-tâche"
                          />
                        </div>
                        
                        {/* Description de la sous-tâche */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                            Description
                          </label>
                          <textarea
                            value={subtask.description || ''}
                            onChange={(e) => updateSubtask(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                            placeholder="Description de la sous-tâche"
                          />
                        </div>
                        
                        {/* Ligne pour statut et priorité */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {/* Statut */}
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                              Statut
                            </label>
                            <select
                              value={subtask.status}
                              onChange={(e) => updateSubtask(index, 'status', e.target.value)}
                              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)] text-sm text-[var(--text-primary)]"
                            >
                              <option value="Open">À faire</option>
                              <option value="InProgress">En cours</option>
                              <option value="Completed">Terminé</option>
                            </select>
                          </div>
                          
                          {/* Priorité */}
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                              Priorité
                            </label>
                            <select
                              value={subtask.priority}
                              onChange={(e) => updateSubtask(index, 'priority', e.target.value)}
                              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)] text-sm text-[var(--text-primary)]"
                            >
                              <option value="low">Basse</option>
                              <option value="medium">Moyenne</option>
                              <option value="high">Haute</option>
                            </select>
                          </div>
                        </div>
                        
                        {/* Assigné à */}
                        <div>
                          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                            Assigné à
                          </label>
                          <select
                            value={subtask.assignedTo?.id}
                            onChange={(e) => updateSubtask(index, 'assignedTo', e.target.value)}
                            className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-[var(--bg-primary)] text-sm text-[var(--text-primary)]"
                          >
                            {users.map(user => (
                              <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Onglet Pièces jointes */}
            {activeTab === 'attachments' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-[var(--text-primary)]">Pièces jointes</h3>
                  <button 
                    type="button"
                    onClick={handleAttachmentClick}
                    className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <FaPaperclip className="mr-1.5 h-3 w-3" />
                    Ajouter
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                </div>
                
                {attachmentFiles.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-[var(--border-color)] rounded-lg">
                    <FaPaperclip className="mx-auto h-6 w-6 text-[var(--text-secondary)] mb-2" />
                    <p className="text-[var(--text-secondary)]">Aucune pièce jointe</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Cliquez sur "Ajouter" pour télécharger des fichiers</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachmentFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-md">
                        <div className="flex items-center">
                          <FaPaperclip className="h-4 w-4 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{file.name}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-[var(--text-secondary)] hover:text-red-500 p-1"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Pied du modal avec boutons d'action */}
          <div className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] px-6 py-4 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] rounded-md hover:bg-[var(--bg-secondary)] transition-colors bg-[var(--bg-primary)]"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors"
              disabled={!taskForm.title || !taskForm.projectId}
            >
              Créer la tâche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;