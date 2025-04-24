import React, { useState, useEffect } from 'react';
import { Task, SubTask } from '../types';
import { FaPlay, FaPause, FaPaperclip, FaPlus, FaTimes } from 'react-icons/fa';

interface TaskModalProps {
  task: Task | SubTask;
  isOpen: boolean;
  onClose: () => void;
  isSubtask?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, isSubtask = false }) => {
  const [timer] = useState(task.timeSpent || '00:00:00');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [attachments, setAttachments] = useState<{id: string, name: string}[]>(
    task.attachments ? Array(task.attachments).fill(null).map((_, i) => ({
      id: `${i + 1}`,
      name: `Pièce jointe ${i + 1}`
    })) : []
  );
  
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

  if (!isOpen) return null;

  const addAttachment = () => {
    const newAttachment = {
      id: `${attachments.length + 1}`,
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
        return 'bg-red-400 text-white';
      case 'medium':
        return 'bg-yellow-400 text-white';
      case 'low':
        return 'bg-green-400 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  // Fonction pour déterminer la couleur du badge de statut
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-400 text-white';
      case 'InProgress':
        return 'bg-blue-400 text-white';
      case 'Canceled':
        return 'bg-red-400 text-white';
      case 'Open':
        return 'bg-purple-400 text-white';
      default:
        return 'bg-gray-400 text-white';
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Arrière-plan flou semi-transparent */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Contenu du modal */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative z-10 animate-modalFadeIn">
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <div className="text-xs text-gray-500">
              {isSubtask 
                ? `Sous-tâche de ${(task as SubTask).createdAt ? new Date((task as SubTask).createdAt).toLocaleDateString('fr-FR') : ''}`
                : `${(task as Task).projectId} / ${(task as Task).taskNumber}`
              }
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          <h2 className="text-xl font-semibold mb-6">{task.title}</h2>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2 items-center">
              <span className="text-gray-500">Priorité</span>
              <span className={`${getPriorityBadgeColor(task.priority)} text-sm px-3 py-1 rounded-full shadow-sm`}>
                {getPriorityText(task.priority)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">{timer}</span>
              <button 
                className={`${isTimerRunning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-full p-1.5 shadow-sm hover:shadow transition-shadow`}
                onClick={toggleTimer}
              >
                {isTimerRunning ? <FaPause className="h-4 w-4" /> : <FaPlay className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <div className="w-24 text-gray-500">Statut</div>
              <div className={`${getStatusBadgeColor(task.status)} text-sm px-3 py-1 rounded-full shadow-sm`}>
                {getStatusText(task.status)}
              </div>
            </div>
            
            {!isSubtask && (
              <div className="flex items-center">
                <div className="w-24 text-gray-500">Ouvert par</div>
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-2 shadow-sm">
                    {getInitials((task as Task).openedBy)}
                  </div>
                  <span>{(task as Task).openedBy}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <div className="w-24 text-gray-500">Assigné à</div>
              <div className="flex items-center">
                <div 
                  className="h-6 w-6 rounded-full bg-orange-200 flex items-center justify-center text-xs mr-2 shadow-sm"
                  style={{ backgroundImage: `url(${task.assignedTo.avatar})`, backgroundSize: 'cover' }}
                >
                  {!task.assignedTo.avatar && getInitials(task.assignedTo.name)}
                </div>
                <span>{task.assignedTo.name}</span>
              </div>
            </div>
            
            {isSubtask && (
              <div className="flex items-center">
                <div className="w-24 text-gray-500">Créé le</div>
                <span>{new Date((task as SubTask).createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            )}

            {!isSubtask && (
              <div className="flex items-center">
                <div className="w-24 text-gray-500">Ouvert il y a</div>
                <span>{(task as Task).openedDaysAgo} jours</span>
              </div>
            )}
          </div>
          
          {attachments.length > 0 && (
            <div className="border-t border-b py-4 mb-4">
              <h3 className="font-medium mb-2">Pièces jointes</h3>
              <div className="space-y-2">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center text-blue-500 hover:text-blue-600 hover:underline cursor-pointer">
                    <FaPaperclip className="h-4 w-4 mr-2" />
                    <span>{attachment.name}</span>
                  </div>
                ))}
                <button 
                  onClick={addAttachment} 
                  className="flex items-center text-gray-500 hover:text-gray-700 mt-2"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  <span>Ajouter une pièce jointe</span>
                </button>
              </div>
            </div>
          )}
          
          {task.description && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                {task.description}
              </p>
            </div>
          )}
          
          {task.comments && task.comments > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Commentaires ({task.comments})</h3>
              <div className="text-gray-500 text-sm italic bg-gray-50 p-3 rounded">
                Les commentaires ne sont pas disponibles dans cette prévisualisation.
              </div>
            </div>
          )}
          
          <div className="flex mt-4 pt-3 border-t">
            <div 
              className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-xs mr-2 shadow-sm"
              style={{ backgroundImage: `url(${task.assignedTo.avatar})`, backgroundSize: 'cover' }}
            >
              {!task.assignedTo.avatar && getInitials(task.assignedTo.name)}
            </div>
            <input 
              type="text"
              placeholder="Ajouter un commentaire..."
              className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm py-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;