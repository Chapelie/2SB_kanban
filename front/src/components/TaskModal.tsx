import React, { useState, useEffect, useRef } from 'react';
import { Task, SubTask } from '../types';
import { FaPlay, FaPause, FaPaperclip, FaPlus, FaTimes, FaEllipsisH, FaRegCommentAlt, FaChevronLeft, FaCheck, FaList } from 'react-icons/fa';

interface TaskModalProps {
  task: Task | SubTask;
  isOpen: boolean;
  onClose: () => void;
  isSubtask?: boolean;
  onOpenSubtask?: (subtask: SubTask) => void;
}

// Types locaux pour gérer les commentaires et les pièces jointes dans le modal
interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

interface Attachment {
  id: string;
  name: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, isSubtask = false, onOpenSubtask }) => {  
  // Debug des sous-tâches
  console.log("Task type:", isSubtask ? "SubTask" : "Task");
  console.log("Task has subtasks property:", 'subtasks' in task);
  console.log("Task subtasks:", (task as Task).subtasks);
  
  const [timer] = useState(task.timeSpent || '00:00:00');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Génération de pièces jointes simulées
  const [attachments, setAttachments] = useState<Attachment[]>(() => {
    if (task.attachments && typeof task.attachments === 'number') {
      return Array(task.attachments).fill(null).map((_, i) => ({
        id: `attachment-${i + 1}`,
        name: `Pièce jointe ${i + 1}`
      }));
    }
    return [];
  });
  
  // Génération de commentaires simulés
  const [mockComments] = useState<Comment[]>(() => {
    if (task.comments && typeof task.comments === 'number' && task.comments > 0) {
      return Array(task.comments).fill(null).map((_, i) => ({
        id: `comment-${i + 1}`,
        author: i === 0 ? 'Jean Dupont' : `Utilisateur ${i + 1}`,
        content: i === 0 ? 'Exemple de commentaire sur cette tâche.' : `Commentaire ${i + 1} sur cette tâche.`,
        date: `Il y a ${i + 1} jour${i > 0 ? 's' : ''}`
      }));
    }
    return [];
  });
  
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'subtasks'>('details');
  const [comment, setComment] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Vérifier si cette tâche a des sous-tâches - CORRECTION: toujours afficher l'onglet si c'est une tâche principale
  const hasSubtasks = !isSubtask && 'subtasks' in task;
  
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

  const addAttachment = () => {
    const newAttachment = {
      id: `attachment-${attachments.length + 1}`,
      name: `Pièce jointe ${attachments.length + 1}`
    };
    setAttachments([...attachments, newAttachment]);
  };

  // Fonction pour fermer le modal en cliquant à l'extérieur
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Fonction pour déterminer la couleur du badge de priorité
  const getPriorityBadgeColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour déterminer la couleur du badge de statut
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'InProgress':
        return 'bg-blue-500 text-white';
      case 'Canceled':
        return 'bg-red-500 text-white';
      case 'Open':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour obtenir le texte du statut en français
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'Terminé';
      case 'InProgress':
        return 'En cours';
      case 'Open':
        return 'À faire';
      case 'Canceled':
        return 'Annulé';
      default:
        return status;
    }
  };

  // Fonction pour obtenir le texte de la priorité en français
  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'Haute';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Basse';
      default:
        return priority;
    }
  };

  // Extraire les initiales du nom pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour soumettre le commentaire
    console.log('Commentaire soumis:', comment);
    setComment('');
  };

  // Gestion du clic sur une sous-tâche
  const handleSubtaskClick = (subtask: SubTask) => {
    if (onOpenSubtask) {
      onClose(); // Fermer le modal actuel
      onOpenSubtask(subtask); // Ouvrir le modal pour la sous-tâche
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      {/* Arrière-plan flou semi-transparent */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Contenu du modal */}
      <div 
        ref={modalRef}
        className="bg-[var(--bg-primary)] rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden relative z-10"
      >
        {/* En-tête du modal avec barre de progression et actions */}
        <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] py-3 px-5 sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={onClose} 
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 hover:bg-[var(--bg-secondary)] rounded-full mr-2"
                aria-label="Fermer"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-xs text-[var(--text-secondary)] font-medium">
                {isSubtask 
                  ? `Sous-tâche`
                  : `${(task as Task).projectId ? (task as Task).projectId : ''} / ${(task as Task).taskNumber ? (task as Task).taskNumber : ''}`
                }
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className={`${isTimerRunning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full p-1.5 shadow hover:shadow-md transition-all`}
                onClick={toggleTimer}
                aria-label={isTimerRunning ? "Pause" : "Démarrer"}
                title={isTimerRunning ? "Mettre en pause" : "Démarrer le chrono"}
              >
                {isTimerRunning ? <FaPause className="h-3.5 w-3.5" /> : <FaPlay className="h-3.5 w-3.5" />}
              </button>
              <span className="text-[var(--text-secondary)] text-sm font-mono">{timer}</span>
              <div className="relative group">
                <button 
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 hover:bg-[var(--bg-secondary)] rounded-full"
                  aria-label="Plus d'options"
                >
                  <FaEllipsisH className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-primary)] shadow-lg rounded-md hidden group-hover:block z-30 border border-[var(--border-color)]">
                  <ul className="py-1 text-sm">
                    <li><a href="#" className="block px-4 py-2 hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]">Modifier</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-[var(--bg-secondary)] text-red-600">Supprimer</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="h-1 w-full bg-[var(--border-color)] mt-2 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--accent-color)] rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
        
        {/* Titre et information prioritaire */}
        <div className="p-5">
          <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{task.title}</h2>
          
          <div className="flex flex-wrap gap-3 mb-5">
            <div className={`${getStatusBadgeColor(task.status)} text-sm px-3 py-1 rounded-full shadow-sm flex items-center`}>
              <FaCheck className="h-3 w-3 mr-1" />
              {getStatusText(task.status)}
            </div>
            {task.priority && (
              <div className={`${getPriorityBadgeColor(task.priority)} text-sm px-3 py-1 rounded-full shadow-sm`}>
                Priorité {getPriorityText(task.priority)}
              </div>
            )}
          </div>
        </div>
        
        {/* Onglets */}
        <div className="px-5 border-b border-[var(--border-color)] flex">
          <button 
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'details' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            onClick={() => setActiveTab('details')}
          >
            Détails
          </button>
          
          {hasSubtasks && (
            <button 
              className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors flex items-center ${activeTab === 'subtasks' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              onClick={() => setActiveTab('subtasks')}
            >
              Sous-tâches
              {(task as Task).subtasks && (task as Task).subtasks.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 rounded-full text-xs px-2 py-0.5">
                  {(task as Task).subtasks?.length}
                </span>
              )}
            </button>
          )}
          
          <button 
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors flex items-center ${activeTab === 'comments' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            onClick={() => setActiveTab('comments')}
          >
            Commentaires
            {task.comments && typeof task.comments === 'number' && task.comments > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 rounded-full text-xs px-2 py-0.5">
                {task.comments}
              </span>
            )}
          </button>
        </div>
        
        {/* Zone de défilement pour le contenu */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          {activeTab === 'details' && (
            <div className="p-5">
              {/* Assignation et informations */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center">
                  <div className="w-28 text-[var(--text-secondary)] text-sm">Assigné à</div>
                  <div className="flex items-center">
                    <div 
                      className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-xs mr-2 shadow-sm"
                      style={{ backgroundImage: task.assignedTo.avatar ? `url(${task.assignedTo.avatar})` : undefined, backgroundSize: 'cover' }}
                    >
                      {!task.assignedTo.avatar && getInitials(task.assignedTo.name)}
                    </div>
                    <span className="font-medium text-[var(--text-primary)]">{task.assignedTo.name}</span>
                  </div>
                </div>
                
                {!isSubtask && (task as Task).openedBy && (
                  <div className="flex items-center">
                    <div className="w-28 text-[var(--text-secondary)] text-sm">Ouvert par</div>
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-xs mr-2 shadow-sm">
                        {getInitials((task as Task).openedBy)}
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{(task as Task).openedBy}</span>
                    </div>
                  </div>
                )}
                
                {isSubtask && (task as SubTask).createdAt ? (
                  <div className="flex items-center">
                    <div className="w-28 text-[var(--text-secondary)] text-sm">Créé le</div>
                    <span className="text-[var(--text-primary)]">{new Date((task as SubTask).createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                ) : !isSubtask && (task as Task).openedDaysAgo ? (
                  <div className="flex items-center">
                    <div className="w-28 text-[var(--text-secondary)] text-sm">Ouvert il y a</div>
                    <span className="text-[var(--text-primary)]">{(task as Task).openedDaysAgo} jours</span>
                  </div>
                ) : null}
              </div>
              
              {/* Description */}
              {task.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">Description</h3>
                  <div className="text-[var(--text-primary)] text-sm bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                    {task.description}
                  </div>
                </div>
              )}
              
              {/* Pièces jointes */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">Pièces jointes</h3>
                  <button 
                    onClick={addAttachment} 
                    className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] text-sm flex items-center transition-colors"
                  >
                    <FaPlus className="h-3 w-3 mr-1" />
                    <span>Ajouter</span>
                  </button>
                </div>
                
                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center p-2 bg-[var(--bg-secondary)] rounded-md hover:bg-[var(--bg-secondary)]/80 transition-colors group">
                        <FaPaperclip className="h-4 w-4 mr-2 text-[var(--accent-color)]" />
                        <span className="text-sm flex-1 text-[var(--text-primary)]">{attachment.name}</span>
                        <button className="text-[var(--text-secondary)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FaTimes className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[var(--text-secondary)] text-sm bg-[var(--bg-secondary)] rounded-lg border border-dashed border-[var(--border-color)]">
                    <FaPaperclip className="h-5 w-5 mx-auto mb-1 text-[var(--text-secondary)]" />
                    <p>Aucune pièce jointe</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Onglet sous-tâches - CORRECTION: toujours afficher même si la liste est vide */}
          {activeTab === 'subtasks' && hasSubtasks && (
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[var(--text-primary)]">Liste des sous-tâches</h3>
                <button 
                  className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] text-sm flex items-center transition-colors"
                >
                  <FaPlus className="h-3 w-3 mr-1" />
                  <span>Ajouter</span>
                </button>
              </div>
              
              {(task as Task).subtasks && (task as Task).subtasks.length > 0 ? (
                <div className="space-y-3">
                  {(task as Task).subtasks?.map((subtask) => (
                    <div 
                      key={subtask.id}
                      className="p-3 border border-[var(--border-color)] rounded-lg hover:shadow-md transition-all cursor-pointer bg-[var(--bg-primary)]"
                      onClick={() => handleSubtaskClick(subtask)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--text-primary)]">{subtask.title}</h4>
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mt-1">{subtask.description}</p>
                        </div>
                        <div className={`${getStatusBadgeColor(subtask.status)} text-xs px-2 py-0.5 rounded-full`}>
                          {getStatusText(subtask.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <div 
                            className="h-6 w-6 rounded-full flex items-center justify-center text-xs mr-2"
                            style={{ backgroundImage: subtask.assignedTo.avatar ? `url(${subtask.assignedTo.avatar})` : undefined, backgroundSize: 'cover' }}
                          >
                            {!subtask.assignedTo.avatar && getInitials(subtask.assignedTo.name)}
                          </div>
                          <span className="text-xs text-[var(--text-secondary)]">{subtask.assignedTo.name}</span>
                        </div>
                        
                        <div className="text-xs text-[var(--text-secondary)]">
                          {subtask.timeSpent || '00:00:00'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--text-secondary)]">
                  <FaList className="h-10 w-10 mx-auto mb-3 text-[var(--border-color)]" />
                  <p>Aucune sous-tâche pour le moment</p>
                  <p className="text-sm mt-1">Ajoutez des sous-tâches pour diviser ce travail</p>
                </div>
              )}
            </div>
          )}
          
          {/* Onglet commentaires */}
          {activeTab === 'comments' && (
            <div className="p-5">
              {mockComments.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {/* Afficher les commentaires simulés */}
                  {mockComments.map((comment, index) => (
                    <div key={comment.id} className="bg-[var(--bg-secondary)] rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-2">
                          {getInitials(comment.author)}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm text-[var(--text-primary)]">{comment.author}</span>
                          <span className="text-[var(--text-secondary)] text-xs ml-2">{comment.date}</span>
                        </div>
                      </div>
                      <div className="text-sm text-[var(--text-primary)] ml-8">
                        {comment.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--text-secondary)]">
                  <FaRegCommentAlt className="h-10 w-10 mx-auto mb-3 text-[var(--border-color)]" />
                  <p>Aucun commentaire pour le moment</p>
                  <p className="text-sm mt-1">Soyez le premier à commenter</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Zone de commentaire (toujours visible) */}
        <div className="p-4 border-t border-[var(--border-color)] sticky bottom-0 bg-[var(--bg-primary)]">
          <form onSubmit={handleCommentSubmit} className="flex items-start">
            <div 
              className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-xs mr-2 flex-shrink-0 shadow-sm"
              style={{ backgroundImage: task.assignedTo.avatar ? `url(${task.assignedTo.avatar})` : undefined, backgroundSize: 'cover' }}
            >
              {!task.assignedTo.avatar && getInitials(task.assignedTo.name)}
            </div>
            <div className="flex-1 relative">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm py-2 px-3 min-h-[40px] max-h-[120px] resize-y bg-[var(--bg-primary)] text-[var(--text-primary)]"
                rows={1}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button 
                  type="button"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-[var(--bg-secondary)]"
                  title="Ajouter une pièce jointe"
                >
                  <FaPaperclip className="h-4 w-4" />
                </button>
                <button 
                  type="submit"
                  className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-full p-1.5 transition-colors"
                  disabled={!comment.trim()}
                >
                  <FaPlay className="h-3 w-3" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;