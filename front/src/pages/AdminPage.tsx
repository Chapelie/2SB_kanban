import React, { useState, useEffect } from 'react';
import { User, Project } from '../types';
import { FaUsers, FaProjectDiagram, FaChartBar, FaShieldAlt, FaPlug, FaDatabase, FaClipboardList, FaUserPlus, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

// Simuler des données pour la page d'administration
const getAdminData = () => {
  // Utilisateurs simulés
  const users: User[] = [
    { id: '1', name: 'Rafik SAWADOGO', email: 'rafik@gmail.com', avatar: '/api/placeholder/40/40', location: 'Bobo, Burkina Faso', role: 'Admin', lastLogin: '2025-04-30T10:15:00Z', status: 'Active', initials: 'RS' },
    { id: '2', name: 'Marie Dupont', email: 'marie@example.com', avatar: '/api/placeholder/40/40', location: 'Paris, France', role: 'Manager', lastLogin: '2025-04-29T14:22:00Z', status: 'Active', initials: 'MD' },
    { id: '3', name: 'John Smith', email: 'john@example.com', avatar: '/api/placeholder/40/40', location: 'London, UK', role: 'Developer', lastLogin: '2025-04-30T08:45:00Z', status: 'Active', initials: 'JS' },
    { id: '4', name: 'Ana Mueller', email: 'ana@example.com', avatar: '/api/placeholder/40/40', location: 'Berlin, Germany', role: 'Developer', lastLogin: '2025-04-25T11:30:00Z', status: 'Inactive', initials: 'AM' },
    { id: '5', name: 'Carlos Rodriguez', email: 'carlos@example.com', avatar: '/api/placeholder/40/40', location: 'Madrid, Spain', role: 'Viewer', lastLogin: '2025-04-28T09:10:00Z', status: 'Active', initials: 'CR' },
  ];

  // Projets simulés
  const projects: Project[] = [
    { id: 'project-1', title: 'Adoddle Platform Redesign', description: 'Refonte du tableau de bord principal', dueDate: '15 MAI 2025', status: 'OnTrack', issuesCount: 8, teamMembers: users.slice(0, 3), createdAt: '2025-03-15' },
    { id: 'project-2', title: 'Mobile App Development', description: 'Développement d\'une application mobile', dueDate: '30 JUIN 2025', status: 'Offtrack', issuesCount: 12, teamMembers: users.slice(1, 4), createdAt: '2025-02-20' },
    { id: 'project-3', title: 'API Integration', description: 'Intégration avec des API tierces', dueDate: '10 MAI 2025', status: 'Completed', issuesCount: 5, teamMembers: users.slice(2, 5), createdAt: '2025-01-10' },
  ];

  // Journaux d'audit simulés
  const auditLogs = [
    { id: 1, user: 'Rafik SAWADOGO', action: 'Création d\'utilisateur', details: 'A créé l\'utilisateur Carlos Rodriguez', timestamp: '2025-04-30T09:30:00Z', ip: '192.168.1.1' },
    { id: 2, user: 'Marie Dupont', action: 'Création de projet', details: 'A créé le projet Mobile App Development', timestamp: '2025-04-29T14:45:00Z', ip: '192.168.1.2' },
    { id: 3, user: 'John Smith', action: 'Connexion', details: 'Connexion réussie', timestamp: '2025-04-30T08:45:00Z', ip: '192.168.1.3' },
    { id: 4, user: 'Système', action: 'Sauvegarde', details: 'Sauvegarde quotidienne automatique', timestamp: '2025-04-30T00:00:00Z', ip: 'system' },
  ];

  // Données d'analyse simulées
  const analytics = {
    activeUsers: 16,
    projectsCount: 8,
    tasksCount: 73,
    completionRate: 68,
    userGrowth: [4, 6, 8, 11, 13, 16],
    tasksByStatus: { open: 25, inProgress: 30, completed: 18 }
  };

  // Sessions actives simulées
  const activeSessions = [
    { id: 1, user: 'Rafik SAWADOGO', device: 'Windows 11 / Chrome', ip: '192.168.1.1', loginTime: '2025-04-30T09:00:00Z' },
    { id: 2, user: 'Marie Dupont', device: 'macOS / Safari', ip: '192.168.1.2', loginTime: '2025-04-30T09:15:00Z' },
    { id: 3, user: 'John Smith', device: 'iOS / Mobile App', ip: '192.168.1.3', loginTime: '2025-04-30T08:45:00Z' },
  ];

  // Clés API simulées
  const apiKeys = [
    { id: 'api-1', name: 'App Mobile', key: 'XXXX-XXXX-XXXX-1234', created: '2025-03-01', lastUsed: '2025-04-30', status: 'Active' },
    { id: 'api-2', name: 'Integration CRM', key: 'XXXX-XXXX-XXXX-5678', created: '2025-02-15', lastUsed: '2025-04-29', status: 'Active' },
  ];

  // Sauvegardes simulées
  const backups = [
    { id: 'backup-1', name: 'Sauvegarde journalière', date: '2025-04-30T00:00:00Z', size: '1.2 GB', status: 'Success' },
    { id: 'backup-2', name: 'Sauvegarde journalière', date: '2025-04-29T00:00:00Z', size: '1.1 GB', status: 'Success' },
    { id: 'backup-3', name: 'Sauvegarde journalière', date: '2025-04-28T00:00:00Z', size: '1.2 GB', status: 'Success' },
    { id: 'backup-4', name: 'Sauvegarde hebdomadaire', date: '2025-04-27T00:00:00Z', size: '5.8 GB', status: 'Success' },
  ];

  return { users, projects, auditLogs, analytics, activeSessions, apiKeys, backups };
};

// Types pour les onglets de la page d'administration
type AdminTab = 'users' | 'projects' | 'audit' | 'analytics' | 'security' | 'api' | 'backup';

const AdminPage: React.FC = () => {
  const _theme = useTheme(); // Utiliser un underscore pour éviter l'avertissement
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminData, setAdminData] = useState<ReturnType<typeof getAdminData> | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', projectId: '', message: '' });
  const [selectedProjectForInvite, setSelectedProjectForInvite] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Charger les données d'administration
  useEffect(() => {
    const data = getAdminData();
    setAdminData(data);
  }, []);

  // Gestion des notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Gérer l'envoi d'invitation
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification de l'email
    if (!inviteData.email || !inviteData.email.includes('@')) {
      setNotification({
        message: 'Veuillez entrer une adresse email valide',
        type: 'error'
      });
      return;
    }

    // Simulation d'envoi d'email d'invitation
    console.log('Invitation envoyée à:', inviteData.email, 'pour le projet:', inviteData.projectId);
    
    // Notification de succès
    setNotification({
      message: `Invitation envoyée à ${inviteData.email}`,
      type: 'success'
    });
    
    // Fermer le modal et réinitialiser les données
    setShowInviteModal(false);
    setInviteData({ email: '', projectId: '', message: '' });
    setSelectedProjectForInvite(null);
  };

  // Ouvrir le modal d'invitation pour un projet spécifique
  const openInviteModal = (project: Project) => {
    setSelectedProjectForInvite(project);
    setInviteData(prev => ({ ...prev, projectId: project.id }));
    setShowInviteModal(true);
  };

  if (!adminData) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-t-[var(--accent-color)] border-r-transparent border-b-[var(--accent-color)] border-l-transparent rounded-full mb-4"></div>
          <p className="text-[var(--text-secondary)]">Chargement des données administratives...</p>
        </div>
      </div>
    );
  }

  // Rendu des différents onglets
  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return renderUsersTab();
      case 'projects':
        return renderProjectsTab();
      case 'audit':
        return renderAuditTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'security':
        return renderSecurityTab();
      case 'api':
        return renderApiTab();
      case 'backup':
        return renderBackupTab();
      default:
        return <div>Sélectionnez un onglet</div>;
    }
  };

  // Onglet de gestion des utilisateurs
  const renderUsersTab = () => {
    // Filtrer les utilisateurs en fonction de la recherche
    const filteredUsers = adminData.users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div>
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Gestion des Utilisateurs</h2>
          <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-md flex items-center">
            <FaUserPlus className="mr-2" />
            Ajouter un utilisateur
          </button>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)]">
            <input
              type="text"
              placeholder="Rechercher des utilisateurs..."
              className="w-full pl-4 pr-10 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-color)]">
              <thead className="bg-[var(--bg-secondary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Dernière connexion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--bg-primary)] divide-y divide-[var(--border-color)]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--bg-secondary)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[var(--text-primary)]">{user.name}</div>
                          <div className="text-sm text-[var(--text-secondary)]">{user.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                         user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                         user.role === 'Developer' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] mr-4">Modifier</button>
                      <button className="text-red-500 hover:text-red-700">Désactiver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Onglet de gestion des projets
  const renderProjectsTab = () => {
    // Filtrer les projets en fonction de la recherche
    const filteredProjects = adminData.projects.filter(project => 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div>
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Gestion des Projets</h2>
          <div className="flex space-x-2">
            <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-md flex items-center">
              <FaProjectDiagram className="mr-2" />
              Nouveau Projet
            </button>
          </div>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)]">
            <input
              type="text"
              placeholder="Rechercher des projets..."
              className="w-full pl-4 pr-10 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-color)]">
              <thead className="bg-[var(--bg-secondary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Projet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Date de création</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Date d'échéance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Membres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--bg-primary)] divide-y divide-[var(--border-color)]">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-[var(--bg-secondary)]">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-[var(--text-primary)]">{project.title}</div>
                        <div className="text-sm text-[var(--text-secondary)]">{project.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                      {project.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                      {project.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${project.status === 'OnTrack' ? 'bg-green-100 text-green-800' : 
                         project.status === 'Offtrack' ? 'bg-red-100 text-red-800' : 
                         project.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {project.status === 'OnTrack' ? 'En bonne voie' : 
                         project.status === 'Offtrack' ? 'En retard' : 
                         project.status === 'Completed' ? 'Terminé' : project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                      <div className="flex -space-x-2 overflow-hidden">
                        {project.teamMembers.map((member, index) => (
                          <img
                            key={member.id}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--bg-primary)]"
                            src={member.avatar}
                            alt={member.name}
                            title={member.name}
                          />
                        ))}
                        <button 
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[var(--accent-color)] text-white text-xs font-medium"
                          onClick={() => openInviteModal(project)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] mr-3">Modifier</button>
                      <button 
                        className="text-indigo-600 hover:text-indigo-800 mr-3"
                        onClick={() => openInviteModal(project)}
                      >
                        Inviter
                      </button>
                      <button className="text-red-500 hover:text-red-700">Archiver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Onglet des journaux d'audit
  const renderAuditTab = () => {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Journaux d'Audit</h2>
          <p className="text-[var(--text-secondary)] mt-1">Consultez l'historique des actions et activités du système</p>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
            <input
              type="text"
              placeholder="Rechercher dans les journaux..."
              className="pl-4 pr-10 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex space-x-2">
              <select className="border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 py-2">
                <option value="all">Tous les types</option>
                <option value="login">Connexion</option>
                <option value="user">Utilisateur</option>
                <option value="project">Projet</option>
                <option value="system">Système</option>
              </select>
              <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-md">
                Exporter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-color)]">
              <thead className="bg-[var(--bg-secondary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Horodatage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Détails</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Adresse IP</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--bg-primary)] divide-y divide-[var(--border-color)]">
                {adminData.auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--bg-secondary)]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">{log.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${log.action.includes('Connexion') ? 'bg-blue-100 text-blue-800' : 
                         log.action.includes('utilisateur') ? 'bg-green-100 text-green-800' : 
                         log.action.includes('Sauvegarde') ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{log.details}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Onglet des rapports et analytiques
  const renderAnalyticsTab = () => {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Rapports et Analyses</h2>
          <p className="text-[var(--text-secondary)] mt-1">Vue d'ensemble des performances et statistiques du système</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* KPI Cards */}
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Utilisateurs Actifs</p>
                <p className="text-3xl font-semibold text-[var(--text-primary)]">{adminData.analytics.activeUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <span>↑ +24%</span>
              <span className="ml-1 text-[var(--text-secondary)]">depuis le mois dernier</span>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Projets Actifs</p>
                <p className="text-3xl font-semibold text-[var(--text-primary)]">{adminData.analytics.projectsCount}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaProjectDiagram className="text-purple-600 text-xl" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <span>↑ +12%</span>
              <span className="ml-1 text-[var(--text-secondary)]">depuis le mois dernier</span>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Tâches Totales</p>
                <p className="text-3xl font-semibold text-[var(--text-primary)]">{adminData.analytics.tasksCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaClipboardList className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="mt-2 text-xs text-red-600 flex items-center">
              <span>↓ -5%</span>
              <span className="ml-1 text-[var(--text-secondary)]">depuis la semaine dernière</span>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Taux de Complétion</p>
                <p className="text-3xl font-semibold text-[var(--text-primary)]">{adminData.analytics.completionRate}%</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaChartBar className="text-yellow-600 text-xl" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <span>↑ +8%</span>
              <span className="ml-1 text-[var(--text-secondary)]">depuis le mois dernier</span>
            </div>
          </div>
        </div>

        {/* Charts and Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Croissance des Utilisateurs</h3>
            <div className="h-64 flex items-end justify-between">
              {adminData.analytics.userGrowth.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-[var(--accent-color)] rounded-t-sm w-10" 
                    style={{ height: `${value * 10}px` }}
                  ></div>
                  <div className="text-xs text-[var(--text-secondary)] mt-2">Mois {index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Tâches par Statut</h3>
            <div className="h-64 flex justify-center items-center">
              <div className="w-48 h-48 rounded-full border-8 border-[var(--bg-secondary)] relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-[var(--text-primary)]">{adminData.analytics.tasksCount}</div>
                    <div className="text-sm text-[var(--text-secondary)]">Total</div>
                  </div>
                </div>
                <div 
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ 
                    clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 70%)',
                    backgroundColor: '#10B981' 
                  }}
                ></div>
                <div 
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ 
                    clipPath: 'polygon(50% 50%, 100% 70%, 50% 100%, 0 70%)',
                    backgroundColor: '#3B82F6' 
                  }}
                ></div>
                <div 
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ 
                    clipPath: 'polygon(50% 50%, 0 70%, 0 0)',
                    backgroundColor: '#EF4444' 
                  }}
                ></div>
              </div>
              <div className="ml-8">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-[#EF4444] rounded-sm mr-2"></div>
                  <span className="text-sm text-[var(--text-primary)]">
                    À faire ({adminData.analytics.tasksByStatus.open})
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-[#3B82F6] rounded-sm mr-2"></div>
                  <span className="text-sm text-[var(--text-primary)]">
                    En cours ({adminData.analytics.tasksByStatus.inProgress})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#10B981] rounded-sm mr-2"></div>
                  <span className="text-sm text-[var(--text-primary)]">
                    Terminé ({adminData.analytics.tasksByStatus.completed})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Onglet de sécurité et conformité
  const renderSecurityTab = () => {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Sécurité et Conformité</h2>
          <p className="text-[var(--text-secondary)] mt-1">Gérez les paramètres de sécurité et les sessions utilisateur</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Politique de mot de passe</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Longueur minimale</p>
                  <p className="text-xs text-[var(--text-secondary)]">Nombre minimum de caractères requis</p>
                </div>
                <select className="border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 py-2">
                  <option>8 caractères</option>
                  <option>10 caractères</option>
                  <option>12 caractères</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Complexité requise</p>
                  <p className="text-xs text-[var(--text-secondary)]">Types de caractères obligatoires</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="lowercase" className="rounded text-[var(--accent-color)]" checked />
                  <label htmlFor="lowercase" className="text-sm text-[var(--text-primary)]">Minuscules</label>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <input type="checkbox" id="uppercase" className="rounded text-[var(--accent-color)]" checked />
                <label htmlFor="uppercase" className="text-sm text-[var(--text-primary)]">Majuscules</label>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <input type="checkbox" id="numbers" className="rounded text-[var(--accent-color)]" checked />
                <label htmlFor="numbers" className="text-sm text-[var(--text-primary)]">Chiffres</label>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <input type="checkbox" id="special" className="rounded text-[var(--accent-color)]" checked />
                <label htmlFor="special" className="text-sm text-[var(--text-primary)]">Caractères spéciaux</label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Expiration des mots de passe</p>
                  <p className="text-xs text-[var(--text-secondary)]">Fréquence de changement obligatoire</p>
                </div>
                <select className="border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 py-2">
                  <option>90 jours</option>
                  <option>60 jours</option>
                  <option>30 jours</option>
                  <option>Jamais</option>
                </select>
              </div>
              <button className="mt-4 w-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium py-2 px-4 rounded-md">
                Enregistrer les modifications
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Sessions actives</h3>
            <div className="space-y-4">
              {adminData.activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-md">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{session.user}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{session.device}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      IP: {session.ip} • Connecté le {new Date(session.loginTime).toLocaleString()}
                    </p>
                  </div>
                  <button className="text-red-500 hover:text-red-700 text-sm">
                    Révoquer
                  </button>
                </div>
              ))}
              <button className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md">
                Révoquer toutes les sessions
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Authentification à deux facteurs (2FA)</h3>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                L'authentification à deux facteurs ajoute une couche supplémentaire de sécurité à votre application en exigeant des utilisateurs qu'ils fournissent un second facteur d'authentification en plus de leur mot de passe.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Exiger 2FA pour les administrateurs</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="admin2fa" className="sr-only" checked />
                    <div className="w-10 h-5 bg-green-500 rounded-full shadow-inner"></div>
                    <div className="absolute -left-1 -top-1 w-7 h-7 bg-white rounded-full shadow transition transform translate-x-5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Exiger 2FA pour tous les utilisateurs</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="all2fa" className="sr-only" />
                    <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner"></div>
                    <div className="absolute -left-1 -top-1 w-7 h-7 bg-white rounded-full shadow transition"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Méthodes 2FA autorisées</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="app2fa" className="rounded text-[var(--accent-color)]" checked />
                      <label htmlFor="app2fa" className="text-sm text-[var(--text-primary)]">Application d'authentification</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms2fa" className="rounded text-[var(--accent-color)]" checked />
                      <label htmlFor="sms2fa" className="text-sm text-[var(--text-primary)]">SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email2fa" className="rounded text-[var(--accent-color)]" checked />
                      <label htmlFor="email2fa" className="text-sm text-[var(--text-primary)]">Email</label>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-4 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium py-2 px-4 rounded-md">
                Enregistrer les paramètres 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Onglet de gestion des API (suite)
  const renderApiTab = () => {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Intégrations et API</h2>
          <p className="text-[var(--text-secondary)] mt-1">Gérez les clés API et les intégrations externes</p>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">Clés API</h3>
            <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-md">
              Créer une nouvelle clé
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border-color)]">
              <thead className="bg-[var(--bg-secondary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Clé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Créée le</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Dernière utilisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--bg-primary)] divide-y divide-[var(--border-color)]">
                {adminData.apiKeys.map((key) => (
                  <tr key={key.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">{key.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[var(--text-primary)]">{key.key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">{key.created}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">{key.lastUsed}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${key.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {key.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] mr-3">Régénérer</button>
                      <button className="text-red-500 hover:text-red-700">Révoquer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Webhooks</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Configurez des webhooks pour envoyer des notifications à des systèmes externes lorsque des événements se produisent dans l'application.
            </p>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Événements</p>
                  <p className="text-xs text-[var(--text-secondary)]">Sélectionnez les événements qui déclencheront des webhooks</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="projectCreated" className="rounded text-[var(--accent-color)]" checked />
                    <label htmlFor="projectCreated" className="text-sm text-[var(--text-primary)]">Création de projet</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="taskUpdated" className="rounded text-[var(--accent-color)]" checked />
                    <label htmlFor="taskUpdated" className="text-sm text-[var(--text-primary)]">Mise à jour de tâche</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="userCreated" className="rounded text-[var(--accent-color)]" />
                    <label htmlFor="userCreated" className="text-sm text-[var(--text-primary)]">Création d'utilisateur</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">URL de destination</label>
                <input
                  type="text"
                  placeholder="https://example.com/webhook"
                  className="w-full pl-4 pr-10 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                />
              </div>
              <button className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium py-2 px-4 rounded-md">
                Ajouter un webhook
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Intégrations</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Connectez votre application à d'autres services pour étendre ses fonctionnalités.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-md">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.08 12.539l-1.617-2.803a.595.595 0 01-.079-.301v-3.467c0-.513-.261-.99-.696-1.265l-2.723-1.579a.596.596 0 01-.296-.516V.608C16.669.272 16.397 0 16.061 0H7.938c-.336 0-.608.272-.608.608v2.054c0 .214-.119.41-.31.508l-2.77 1.431C3.784 4.866 3.5 5.37 3.5 5.912v3.233a.595.595 0 01-.093.318l-1.68 2.892c-.292.503-.292 1.22 0 1.723l1.68 2.891c.06.102.093.219.093.318v3.233c0 .542.284 1.046.75 1.313l2.968 1.431c.19.099.302.301.302.522V23.4c0 .333.272.6.604.6h8.135c.333 0 .604-.267.604-.6v-2.1c0-.221.112-.424.302-.522l2.968-1.431c.466-.267.75-.771.75-1.313v-3.233c0-.1.033-.217.092-.318l1.617-2.803c.27-.477.27-1.13 0-1.606l.001-.001z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Slack</p>
                    <p className="text-xs text-[var(--text-secondary)]">Notifications en temps réel dans vos canaux Slack</p>
                  </div>
                </div>
                <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-3 py-1 rounded-md text-sm">
                  Connecter
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-md">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1.152 6.352h21.696c.636 0 1.152.516 1.152 1.152v8.992c0 .637-.516 1.153-1.152 1.153H1.152A1.152 1.152 0 010 16.496V7.504c0-.636.516-1.152 1.152-1.152zM21.6 9.8v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.497V9.8c0 .273.222.496.496.496h1.6c.273 0 .496-.223.496-.496zm-4 0v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.497V9.8c0 .273.222.496.496.496h1.6c.273 0 .496-.223.496-.496zm-4 0v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.497V9.8c0 .273.222.496.496.496h1.6c.273 0 .496-.223.496-.496zm-4 0v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.497V9.8c0 .273.222.496.496.496h1.6c.273 0 .496-.223.496-.496zm-4 0v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.497V9.8c0 .273.222.496.496.496h1.6c.273 0 .496-.223.496-.496zm16 4.4v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.496v.24c0 .274.222.497.496.497h1.6c.273 0 .496-.223.496-.497zm-4 0v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.496v.24c0 .274.222.497.496.497h1.6c.273 0 .496-.223.496-.497zm-4 0v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.496v.24c0 .274.222.497.496.497h1.6c.273 0 .496-.223.496-.497zm-4 0v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.496v.24c0 .274.222.497.496.497h1.6c.273 0 .496-.223.496-.497zm-4 0v-.24c0-.273-.223-.496-.496-.496h-1.6c-.274 0-.496.223-.496.496v.24c0 .274.222.497.496.497h1.6c.273 0 .496-.223.496-.497z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Trello</p>
                    <p className="text-xs text-[var(--text-secondary)]">Synchronisez vos tâches avec des cartes Trello</p>
                  </div>
                </div>
                <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-3 py-1 rounded-md text-sm">
                  Connecter
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-md">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-md mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm6.826 5.914l-5.238 5.234 5.238 5.238-1.586 1.586-5.237-5.238-5.235 5.238-1.586-1.586 5.235-5.238-5.235-5.234 1.586-1.586 5.235 5.235 5.237-5.235 1.586 1.586z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Gmail</p>
                    <p className="text-xs text-[var(--text-secondary)]">Intégrez vos emails pour les notifications</p>
                  </div>
                </div>
                <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-3 py-1 rounded-md text-sm">
                  Connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Onglet de sauvegarde et restauration
  const renderBackupTab = () => {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Sauvegarde et Restauration</h2>
          <p className="text-[var(--text-secondary)] mt-1">Gérez les sauvegardes de votre système et restaurez des données</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6 col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Historique des sauvegardes</h3>
              <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-md">
                Nouvelle sauvegarde
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--border-color)]">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Taille</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--bg-primary)] divide-y divide-[var(--border-color)]">
                  {adminData.backups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">{backup.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                        {new Date(backup.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">{backup.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${backup.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {backup.status === 'Success' ? 'Réussie' : 'Échec'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] mr-3">Restaurer</button>
                        <button className="text-indigo-600 hover:text-indigo-800 mr-3">Télécharger</button>
                        <button className="text-red-500 hover:text-red-700">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Configuration des sauvegardes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Fréquence</label>
                <select className="w-full border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 py-2">
                  <option>Quotidienne</option>
                  <option>Hebdomadaire</option>
                  <option>Mensuelle</option>
                  <option>Manuelle uniquement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Heure de sauvegarde</label>
                <input
                  type="time"
                  className="w-full border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 py-2"
                  value="00:00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Rétention</label>
                <select className="w-full border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 py-2">
                  <option>7 jours</option>
                  <option>14 jours</option>
                  <option>30 jours</option>
                  <option>90 jours</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input type="checkbox" id="compressBackups" className="rounded text-[var(--accent-color)]" checked />
                <label htmlFor="compressBackups" className="text-sm text-[var(--text-primary)]">Compresser les sauvegardes</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="encryptBackups" className="rounded text-[var(--accent-color)]" checked />
                <label htmlFor="encryptBackups" className="text-sm text-[var(--text-primary)]">Chiffrer les sauvegardes</label>
              </div>
              <button className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium py-2 px-4 rounded-md mt-4">
                Enregistrer la configuration
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Exportation de données</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Exportez des données spécifiques pour une analyse externe ou une migration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[var(--border-color)] rounded-md p-4">
              <div className="flex items-center mb-2">
                <input type="checkbox" id="exportProjects" className="rounded text-[var(--accent-color)]" />
                <label htmlFor="exportProjects" className="ml-2 text-sm font-medium text-[var(--text-primary)]">Projets</label>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Toutes les données de projet, y compris les métadonnées</p>
            </div>
            <div className="border border-[var(--border-color)] rounded-md p-4">
              <div className="flex items-center mb-2">
                <input type="checkbox" id="exportTasks" className="rounded text-[var(--accent-color)]" />
                <label htmlFor="exportTasks" className="ml-2 text-sm font-medium text-[var(--text-primary)]">Tâches</label>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Toutes les tâches avec leurs détails et commentaires</p>
            </div>
            <div className="border border-[var(--border-color)] rounded-md p-4">
              <div className="flex items-center mb-2">
                <input type="checkbox" id="exportUsers" className="rounded text-[var(--accent-color)]" />
                <label htmlFor="exportUsers" className="ml-2 text-sm font-medium text-[var(--text-primary)]">Utilisateurs</label>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Données des utilisateurs (hors mots de passe)</p>
            </div>
          </div>
          <div className="flex mt-4">
            <select className="border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] px-3 py-2 mr-2">
              <option>Format CSV</option>
              <option>Format JSON</option>
              <option>Format XML</option>
            </select>
            <button className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-md">
              Exporter les données
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Menu de navigation de la barre latérale
  const renderSidebar = () => {
    return (
      <div className="w-64 bg-[var(--bg-primary)] border-r border-[var(--border-color)] p-4 hidden md:block">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Administration</h2>
        <nav>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'users' 
                    ? 'bg-[var(--accent-color)] text-white' 
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <FaUsers className="mr-2" />
                Utilisateurs
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'projects' 
                    ? 'bg-[var(--accent-color)] text-white' 
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <FaProjectDiagram className="mr-2" />
                Projets
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('audit')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'audit' 
                    ? 'bg-[var(--accent-color)] text-white' 
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <FaClipboardList className="mr-2" />
                Journaux d'audit
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'analytics' 
                    ? 'bg-[var(--accent-color)] text-white' 
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <FaChartBar className="mr-2" />
                Rapports et analyses
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'security' 
                    ? 'bg-[var(--accent-color)] text-white' 
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <FaShieldAlt className="mr-2" />
                Sécurité
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('api')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'api' 
                    ? 'bg-[var(--accent-color)] text-white' 
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <FaPlug className="mr-2" />
                API et intégrations
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'backup' 
                    ? 'bg-[var(--accent-color)] text-white' 
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <FaDatabase className="mr-2" />
                Sauvegarde et restauration
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  // Modal d'invitation d'utilisateur à un projet
  const renderInviteModal = () => {
    if (!showInviteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Inviter un utilisateur au projet
            </h3>
            <button 
              onClick={() => setShowInviteModal(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          </div>
          
          {selectedProjectForInvite && (
            <div className="mb-4 p-3 bg-[var(--bg-secondary)] rounded-md">
              <p className="text-sm font-medium text-[var(--text-primary)]">Projet : {selectedProjectForInvite.title}</p>
              <p className="text-xs text-[var(--text-secondary)]">{selectedProjectForInvite.description}</p>
            </div>
          )}
          
          <form onSubmit={handleInviteSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <div className="mr-2 text-[var(--text-secondary)]">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  required
                  placeholder="utilisateur@example.com"
                  className="flex-1 pl-2 pr-4 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Message personnel
              </label>
              <textarea
                placeholder="Nous aimerions que vous rejoigniez notre projet..."
                className="w-full pl-4 pr-4 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] h-24"
                value={inviteData.message}
                onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-md"
              >
                Envoyer l'invitation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Notification de succès ou d'erreur
  const renderNotification = () => {
    if (!notification) return null;
    
    return (
      <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${
        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white z-50 flex items-center`}>
        {notification.type === 'success' ? (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )}
        {notification.message}
      </div>
    );
  };

  // Navigation mobile (pour les petits écrans)
  const renderMobileNav = () => {
    return (
      <div className="md:hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)] p-4">
        <select
          className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as AdminTab)}
        >
          <option value="users">Utilisateurs</option>
          <option value="projects">Projets</option>
          <option value="audit">Journaux d'audit</option>
          <option value="analytics">Rapports et analyses</option>
          <option value="security">Sécurité</option>
          <option value="api">API et intégrations</option>
          <option value="backup">Sauvegarde et restauration</option>
        </select>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[var(--bg-secondary)] overflow-hidden flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Barre latérale */}
        {renderSidebar()}
        
        {/* Contenu principal */}
        <div className="flex-1 overflow-auto">
          {renderMobileNav()}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      {/* Modal d'invitation */}
      {renderInviteModal()}
      
      {/* Notification */}
      {renderNotification()}
    </div>
  );
};

export default AdminPage;