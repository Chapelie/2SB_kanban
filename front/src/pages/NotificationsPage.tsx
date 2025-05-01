import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaCalendarAlt, FaUserPlus, FaCommentAlt, FaClipboardCheck, FaTasks } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Types pour les notifications selon votre structure
interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  date: Date;
  read: boolean;
  relatedItemId: string;
  relatedItemType: string;
}

// Pour l'affichage, on convertit la date en format relatif
interface DisplayNotification extends Notification {
  displayDate: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<DisplayNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fonction pour formater la date en format relatif
  const getRelativeTimeString = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return `Il y a quelques secondes`;
    if (diffMin < 60) return `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
    if (diffHour < 24) return `Il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;
    if (diffDay === 1) return `Hier`;
    if (diffDay < 7) return `Il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };

  // Simuler le chargement des notifications
  useEffect(() => {
    // Dans une vraie application, vous feriez un appel API ici
    setTimeout(() => {
      // Création des dates
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId: 'user123',
          type: 'task_assigned',
          content: 'Marie Dubois vous a assigné une nouvelle tâche: "Mettre à jour la documentation API"',
          date: twoHoursAgo,
          read: false,
          relatedItemId: 'task456',
          relatedItemType: 'task'
        },
        {
          id: '2',
          userId: 'user123',
          type: 'comment_added',
          content: 'Thomas Martin a commenté sur la tâche "Intégration de la nouvelle API de paiement"',
          date: fiveHoursAgo,
          read: false,
          relatedItemId: 'task789',
          relatedItemType: 'task'
        },
        {
          id: '3',
          userId: 'user123',
          type: 'project_completed',
          content: 'Le projet "Refonte du site web" a été marqué comme terminé',
          date: yesterday,
          read: true,
          relatedItemId: 'project123',
          relatedItemType: 'project'
        },
        {
          id: '4',
          userId: 'user123',
          type: 'user_mentioned',
          content: 'Vous avez été mentionné dans un commentaire par Lucas Bernard',
          date: yesterday,
          read: true,
          relatedItemId: 'comment456',
          relatedItemType: 'comment'
        },
        {
          id: '5',
          userId: 'user123',
          type: 'task_due_soon',
          content: 'La tâche "Finaliser les maquettes" arrive à échéance demain',
          date: twoDaysAgo,
          read: false,
          relatedItemId: 'task321',
          relatedItemType: 'task'
        }
      ];
      
      // Conversion des dates pour l'affichage
      const displayNotifications: DisplayNotification[] = mockNotifications.map(notif => ({
        ...notif,
        displayDate: getRelativeTimeString(notif.date)
      }));
      
      setNotifications(displayNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrer les notifications selon l'onglet actif
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.read);

  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    // Dans une application réelle, vous feriez un appel API ici
  };

  // Supprimer une notification
  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
    // Dans une application réelle, vous feriez un appel API ici
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    // Dans une application réelle, vous feriez un appel API ici
  };

  // Obtenir l'icône correspondant au type de notification
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return <FaTasks className="text-blue-500" />;
      case 'task_due_soon':
        return <FaCalendarAlt className="text-orange-500" />;
      case 'project_completed':
        return <FaClipboardCheck className="text-green-500" />;
      case 'comment_added':
        return <FaCommentAlt className="text-purple-500" />;
      case 'user_mentioned':
        return <FaUserPlus className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  // Naviguer vers l'élément lié
  const navigateToRelatedItem = (notification: DisplayNotification) => {
    markAsRead(notification.id);
    
    switch (notification.relatedItemType) {
      case 'task':
        navigate(`/dashboard/tasks?id=${notification.relatedItemId}`);
        break;
      case 'project':
        navigate(`/dashboard/projects/${notification.relatedItemId}`);
        break;
      case 'comment':
        // Pour les commentaires, on pourrait avoir besoin de l'ID de la tâche parent
        // Dans cet exemple, on redirige simplement vers la liste des tâches
        navigate('/dashboard/tasks');
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Notifications</h1>
        
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] text-sm rounded-md transition-colors duration-200"
          >
            <FaCheck className="mr-2" />
            Tout marquer comme lu
          </button>
        )}
      </div>
      
      {/* Onglets */}
      <div className="flex border-b border-[var(--border-color)] mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'all'
              ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
              : 'text-[var(--text-secondary)]'
          }`}
          onClick={() => setActiveTab('all')}
        >
          Toutes ({notifications.length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'unread'
              ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
              : 'text-[var(--text-secondary)]'
          }`}
          onClick={() => setActiveTab('unread')}
        >
          Non lues ({notifications.filter(n => !n.read).length})
        </button>
      </div>
      
      {/* Liste des notifications */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-10">
          <FaBell className="mx-auto text-4xl text-[var(--text-secondary)] mb-3" />
          <p className="text-[var(--text-secondary)]">Aucune notification {activeTab === 'unread' ? 'non lue' : ''}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                notification.read 
                  ? 'border-[var(--border-color)] bg-[var(--bg-primary)]' 
                  : 'border-[var(--accent-color)] bg-[var(--bg-secondary)]'
              } cursor-pointer hover:bg-[var(--bg-hover)]`}
              onClick={() => navigateToRelatedItem(notification)}
            >
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-[var(--bg-hover)] mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-[var(--text-primary)]">{notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <span className="text-xs text-[var(--text-secondary)]">{notification.displayDate}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{notification.content}</p>
                </div>
              </div>
              <div className="flex justify-end mt-2 space-x-2" onClick={e => e.stopPropagation()}>
                {!notification.read && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-hover)]"
                    title="Marquer comme lu"
                  >
                    <FaCheck className="text-sm" />
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="p-1.5 rounded text-[var(--text-secondary)] hover:text-red-500 hover:bg-[var(--bg-hover)]"
                  title="Supprimer"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;