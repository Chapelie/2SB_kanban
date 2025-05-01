import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaCheck, FaTimes, FaTrash, FaSearch, FaFilter, FaUserPlus, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Types pour les messages
interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
  };
  projectName: string;
  projectId: string;
  date: string;
  read: boolean;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Simuler le chargement des messages
  useEffect(() => {
    // Dans une vraie application, vous feriez un appel API ici
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: '1',
          sender: {
            name: 'Marie Dubois',
            avatar: '/api/placeholder/40/40'
          },
          projectName: 'Refonte du site web',
          projectId: '101',
          date: '2 heures',
          read: false,
          status: 'pending',
          message: 'Bonjour, je vous invite à rejoindre notre projet de refonte du site web. Votre expertise en UI/UX serait précieuse pour l\'équipe.'
        },
        {
          id: '2',
          sender: {
            name: 'Thomas Martin',
            avatar: '/api/placeholder/40/40'
          },
          projectName: 'API de paiement',
          projectId: '102',
          date: '1 jour',
          read: true,
          status: 'accepted',
          message: 'Nous avons besoin de votre expertise pour intégrer la nouvelle API de paiement. Acceptez-vous de rejoindre ce projet ?'
        },
        {
          id: '3',
          sender: {
            name: 'Lucas Bernard',
            avatar: '/api/placeholder/40/40'
          },
          projectName: 'Application mobile',
          projectId: '103',
          date: '3 jours',
          read: true,
          status: 'declined',
          message: 'Nous lançons une nouvelle application mobile et nous aimerions que vous fassiez partie de l\'équipe de développement.'
        },
        {
          id: '4',
          sender: {
            name: 'Emma Petit',
            avatar: '/api/placeholder/40/40'
          },
          projectName: 'Plateforme e-learning',
          projectId: '104',
          date: '1 semaine',
          read: false,
          status: 'pending',
          message: 'Invitation à participer au projet de plateforme e-learning. Nous avons besoin de votre expertise en backend.'
        },
        // Ajout de messages supplémentaires pour tester le défilement
        {
          id: '5',
          sender: {
            name: 'Simon Fournier',
            avatar: '/api/placeholder/40/40'
          },
          projectName: 'Système de gestion des stocks',
          projectId: '105',
          date: '2 semaines',
          read: false,
          status: 'pending',
          message: 'Nous cherchons quelqu\'un pour travailler sur un nouveau système de gestion des stocks. Votre expérience avec les ERP serait très utile.'
        },
        {
          id: '6',
          sender: {
            name: 'Julie Moreau',
            avatar: '/api/placeholder/40/40'
          },
          projectName: 'Application de suivi de fitness',
          projectId: '106',
          date: '2 semaines',
          read: true,
          status: 'accepted',
          message: 'Nous lançons une application de suivi de fitness et nous avons besoin de quelqu\'un pour gérer l\'architecture frontend.'
        },
        {
          id: '7',
          sender: {
            name: 'Nicolas Blanc',
            avatar: '/api/placeholder/40/40'
          },
          projectName: 'Refonte UI dashboard',
          projectId: '107',
          date: '3 semaines',
          read: true,
          status: 'declined',
          message: 'Nous recherchons un designer UI/UX pour la refonte de notre tableau de bord administratif. Votre portfolio correspond parfaitement à nos besoins.'
        }
      ];
      
      setMessages(mockMessages);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrer les messages selon l'onglet actif et la recherche
  const filteredMessages = messages
    .filter(message => 
      activeTab === 'all' || message.status === activeTab
    )
    .filter(message => 
      message.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Fonction pour marquer tous les messages comme lus
  const markAllAsRead = () => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.read ? message : { ...message, read: true }
      )
    );
    // Dans une vraie application, vous feriez un appel API ici
  };

  // Marquer un message comme lu
  const markAsRead = (id: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id ? { ...message, read: true } : message
      )
    );
    // Dans une vraie application, vous feriez un appel API ici
  };

  // Accepter une invitation
  const acceptInvitation = (id: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id ? { ...message, status: 'accepted', read: true } : message
      )
    );
    // Dans une vraie application, vous feriez un appel API ici
  };

  // Décliner une invitation
  const declineInvitation = (id: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id ? { ...message, status: 'declined', read: true } : message
      )
    );
    // Dans une vraie application, vous feriez un appel API ici
  };

  // Supprimer un message
  const deleteMessage = (id: string) => {
    setMessages(prevMessages => 
      prevMessages.filter(message => message.id !== id)
    );
    // Dans une vraie application, vous feriez un appel API ici
  };

  // Obtenir la couleur de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'accepted':
        return 'text-green-500';
      case 'declined':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Obtenir le texte de statut
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'declined':
        return 'Refusée';
      default:
        return '';
    }
  };

  // Nombre de messages non lus
  const unreadCount = messages.filter(message => !message.read).length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-6 max-w-4xl flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Invitations aux projets</h1>
          
          {/* Bouton pour marquer tous les messages comme lus */}
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] text-sm rounded-md transition-colors duration-200"
            >
              <FaEye className="mr-2" />
              Tout marquer comme lu
            </button>
          )}
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher des invitations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
          </div>
          
          <div className="flex">
            <button className="flex items-center px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]">
              <FaFilter className="mr-2 text-[var(--text-secondary)]" />
              <span>Filtrer</span>
            </button>
          </div>
        </div>
        
        {/* Onglets */}
        <div className="flex border-b border-[var(--border-color)] mb-6 overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'all'
                ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
                : 'text-[var(--text-secondary)]'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Toutes ({messages.length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'pending'
                ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
                : 'text-[var(--text-secondary)]'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            En attente ({messages.filter(m => m.status === 'pending').length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'accepted'
                ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
                : 'text-[var(--text-secondary)]'
            }`}
            onClick={() => setActiveTab('accepted')}
          >
            Acceptées ({messages.filter(m => m.status === 'accepted').length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'declined'
                ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]'
                : 'text-[var(--text-secondary)]'
            }`}
            onClick={() => setActiveTab('declined')}
          >
            Refusées ({messages.filter(m => m.status === 'declined').length})
          </button>
        </div>
      </div>
      
      {/* Liste des messages avec défilement */}
      <div className="flex-grow overflow-y-auto px-4 pb-6">
        <div className="container mx-auto max-w-4xl">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-10">
              <FaEnvelope className="mx-auto text-4xl text-[var(--text-secondary)] mb-3" />
              <p className="text-[var(--text-secondary)]">Aucune invitation trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    !message.read 
                      ? 'border-[var(--accent-color)] bg-[var(--bg-secondary)]' 
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)]'
                  }`}
                  onClick={() => !message.read && markAsRead(message.id)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 relative">
                      <img 
                        src={message.sender.avatar || "/api/placeholder/40/40"} 
                        alt={message.sender.name}
                        className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)]"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[var(--bg-primary)] rounded-full p-0.5 border border-[var(--border-color)]">
                        <FaUserPlus className="text-xs text-[var(--accent-color)]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between">
                        <div>
                          <h3 className="font-medium text-[var(--text-primary)]">{message.sender.name}</h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Projet: <span className="font-medium">{message.projectName}</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-[var(--text-secondary)]">{message.date}</span>
                          <span className={`text-xs font-medium mt-1 ${getStatusColor(message.status)}`}>
                            {getStatusText(message.status)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-2">{message.message}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end mt-3 space-x-2" onClick={e => e.stopPropagation()}>
                    {!message.read && (
                      <button 
                        onClick={() => markAsRead(message.id)}
                        className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-hover)]"
                        title="Marquer comme lu"
                      >
                        <FaEye className="text-sm" />
                      </button>
                    )}
                    {message.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => acceptInvitation(message.id)}
                          className="px-3 py-1.5 text-sm rounded bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                        >
                          <FaCheck className="inline-block mr-1" />
                          Accepter
                        </button>
                        <button 
                          onClick={() => declineInvitation(message.id)}
                          className="px-3 py-1.5 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <FaTimes className="inline-block mr-1" />
                          Décliner
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => deleteMessage(message.id)}
                      className="p-1.5 rounded text-[var(--text-secondary)] hover:text-red-500 hover:bg-[var(--bg-hover)]"
                      title="Supprimer"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </motion.div>
              ))}
              {/* Espace supplémentaire en bas pour éviter que le dernier élément soit coupé par la barre de navigation mobile */}
              <div className="h-16 md:h-4"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;