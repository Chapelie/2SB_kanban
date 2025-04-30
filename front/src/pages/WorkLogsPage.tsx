import React, { useState, useEffect } from 'react';
import { Project, User } from '../types';
import { FaSearch, FaCalendarAlt, FaPlay, FaCheck, FaRegClock } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../contexts/ThemeContext';

// Utilisateur connecté (simulé)
const currentUser: User = {
  id: '1',
  name: 'Rafik SAWADOGO',
  location: 'Bobo, Burkina Faso',
  avatar: '/api/placeholder/32/32',
};

// Type pour les entrées de journal de travail simplifié
interface WorkLog {
  id: string;
  projectId: string;
  userId: string;
  description: string;
  date: string;
  status: 'pending' | 'completed';
}

// Fonction pour obtenir des données de projets simulées
const getMockProjects = (): Project[] => {
  return Array(5).fill(null).map((_, index) => ({
    id: `project-${index + 1}`,
    title: `Adoddle Project ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    dueDate: '15 MAI 2025',
    status: index % 3 === 0 ? 'Offtrack' : index % 3 === 1 ? 'OnTrack' : 'Completed',
    issuesCount: index + 5,
    teamMembers: [
      { id: '1', name: 'Rafik SAWADOGO', avatar: '/api/placeholder/24/24', location: 'Bobo, Burkina Faso' },
      { id: '2', name: 'Marie Dupont', avatar: '/api/placeholder/24/24', location: 'Paris, France' },
    ]
  }));
};

// Fonction pour obtenir des entrées de journal de travail simulées
const getMockWorkLogs = (): WorkLog[] => {
  const logs: WorkLog[] = [];
  const now = new Date();
  
  // Créer des logs pour les 30 derniers jours
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Ajouter entre 0 et 3 logs par jour
    const logsPerDay = Math.floor(Math.random() * 4);
    for (let j = 0; j < logsPerDay; j++) {
      const projectId = `project-${Math.floor(Math.random() * 5) + 1}`;
      
      logs.push({
        id: `log-${dateString}-${j}`,
        projectId,
        userId: '1', // ID de l'utilisateur actuel
        description: j % 3 === 0 
          ? 'Développement de nouvelles fonctionnalités' 
          : j % 3 === 1
          ? 'Réunion avec l\'équipe et planification'
          : 'Correction de bugs et tests',
        date: dateString,
        status: i < 3 && j === 0 ? 'pending' : 'completed'
      });
    }
  }
  
  return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Composant pour afficher une entrée de journal de travail
interface WorkLogItemProps {
  workLog: WorkLog;
  project: Project | undefined;
  onComplete: (logId: string) => void;
}

const WorkLogItem: React.FC<WorkLogItemProps> = ({ workLog, project, onComplete }) => {
  const { theme } = useTheme();
  const logDate = parseISO(workLog.date);
  const formattedDate = format(logDate, 'dd MMMM yyyy', { locale: fr });
  
  return (
    <div className="bg-[var(--bg-primary)] p-4 rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <div 
              className={`h-3 w-3 rounded-full mr-2 ${
                workLog.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            ></div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] truncate">
              {project?.title || 'Projet inconnu'}
            </h3>
          </div>
          <p className="mt-1 text-[var(--text-secondary)] line-clamp-2">{workLog.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 text-[var(--text-secondary)]" />
              {formattedDate}
            </div>
            <div className="flex items-center font-medium">
              <span className={`${workLog.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                {workLog.status === 'pending' ? 'En cours' : 'Terminé'}
              </span>
            </div>
          </div>
        </div>
        
        {workLog.status === 'pending' && (
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button 
              onClick={() => onComplete(workLog.id)}
              className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              title="Marquer comme terminé"
            >
              <FaCheck />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal pour ajouter une nouvelle entrée de journal
interface NewWorkLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workLog: Partial<WorkLog>) => void;
  projects: Project[];
}

const NewWorkLogModal: React.FC<NewWorkLogModalProps> = ({ isOpen, onClose, onSubmit, projects }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<Partial<WorkLog>>({
    projectId: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'pending'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer une entrée de journal complète
    const newWorkLog: Partial<WorkLog> = {
      ...formData,
      userId: currentUser.id,
      status: 'pending'
    };
    
    onSubmit(newWorkLog);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-[var(--bg-secondary)] px-6 py-4 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Nouvelle entrée de journal</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="projectId" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Projet <span className="text-red-500">*</span>
            </label>
            <select
              id="projectId"
              name="projectId"
              required
              className="w-full p-2 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">Sélectionner un projet</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="w-full p-2 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] resize-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
              placeholder="Décrivez votre tâche..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="w-full p-2 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal de la page WorkLogs
const WorkLogsPage: React.FC = () => {
  const { theme } = useTheme();
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [showNewLogModal, setShowNewLogModal] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  // Charger les données simulées
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setProjects(getMockProjects());
      setWorkLogs(getMockWorkLogs());
      setIsLoading(false);
    }, 600);
  }, []);
  
  // Filtrer les entrées de journal
  const filteredWorkLogs = workLogs.filter(log => {
    // Filtrer par recherche
    const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrer par projet
    const matchesProject = projectFilter === 'all' || log.projectId === projectFilter;
    
    // Filtrer par statut
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    // Filtrer par date
    let matchesDate = true;
    const today = new Date();
    const logDate = parseISO(log.date);
    
    if (dateFilter === 'today') {
      matchesDate = format(today, 'yyyy-MM-dd') === log.date;
    } else if (dateFilter === 'week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 7);
      matchesDate = logDate >= weekStart;
    } else if (dateFilter === 'month') {
      const monthStart = new Date(today);
      monthStart.setDate(today.getDate() - 30);
      matchesDate = logDate >= monthStart;
    }
    
    return matchesSearch && matchesProject && matchesStatus && matchesDate;
  });
  
  // Gérer les actions sur les entrées de journal
  const handleCompleteWorkLog = (logId: string) => {
    setWorkLogs(logs => logs.map(log => {
      if (log.id === logId) {
        return {
          ...log,
          status: 'completed'
        };
      }
      return log;
    }));
    
    // Afficher une notification
    setNotification({
      message: 'Tâche marquée comme terminée',
      type: 'success'
    });
  };
  
  // Créer une nouvelle entrée de journal
  const handleNewWorkLog = (newLog: Partial<WorkLog>) => {
    const workLog: WorkLog = {
      id: `log-${Date.now()}`,
      projectId: newLog.projectId || '',
      userId: currentUser.id,
      description: newLog.description || '',
      date: newLog.date || format(new Date(), 'yyyy-MM-dd'),
      status: 'pending'
    };
    
    setWorkLogs([workLog, ...workLogs]);
    setShowNewLogModal(false);
    
    // Afficher une notification
    setNotification({
      message: 'Nouvelle tâche ajoutée',
      type: 'success'
    });
  };
  
  // Nettoyer les notifications après 3 secondes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Calculer les statistiques
  const stats = {
    total: workLogs.length,
    pending: workLogs.filter(log => log.status === 'pending').length,
    completed: workLogs.filter(log => log.status === 'completed').length
  };
  
  return (
    <div className="flex-1 bg-[var(--bg-secondary)] overflow-auto">
      <div className="px-6 py-4 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Journal de travail</h1>
          <button 
            className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium px-4 py-2 rounded-md flex items-center"
            onClick={() => setShowNewLogModal(true)}
          >
            <FaPlay className="mr-2" />
            Ajouter une entrée
          </button>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="text-sm text-[var(--text-secondary)] mb-1">En cours</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)]">{stats.pending}</div>
          </div>
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Terminées</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)]">{stats.completed}</div>
          </div>
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Total</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)]">{stats.total}</div>
          </div>
        </div>
        
        {/* Filtres et recherche */}
        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-[var(--text-secondary)]" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par description..."
                  className="pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] w-full bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)] bg-[var(--bg-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="all">Tous les projets</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
              
              <select
                className="px-3 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)] bg-[var(--bg-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En cours</option>
                <option value="completed">Terminé</option>
              </select>
              
              <select
                className="px-3 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)] bg-[var(--bg-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="all">Tout</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Liste des entrées de journal */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"></div>
          </div>
        ) : filteredWorkLogs.length === 0 ? (
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-8 text-center">
            <div className="text-[var(--text-secondary)] text-5xl mb-4">
              <FaRegClock className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">Aucune entrée trouvée</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              {searchQuery || projectFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
                ? "Essayez de modifier vos filtres."
                : "Commencez par ajouter une nouvelle entrée."}
            </p>
            <button
              onClick={() => setShowNewLogModal(true)}
              className="inline-flex items-center px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
            >
              <FaPlay className="mr-2" />
              Ajouter une entrée
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkLogs.map(log => (
              <WorkLogItem 
                key={log.id} 
                workLog={log}
                project={projects.find(p => p.id === log.projectId)}
                onComplete={handleCompleteWorkLog}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modal pour ajouter une nouvelle entrée */}
      {showNewLogModal && (
        <NewWorkLogModal
          isOpen={showNewLogModal}
          onClose={() => setShowNewLogModal(false)}
          onSubmit={handleNewWorkLog}
          projects={projects}
        />
      )}
      
      {/* Notification */}
      {notification && (
        <div 
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default WorkLogsPage;