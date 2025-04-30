import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaUser, FaBell, FaShieldAlt, FaDesktop, FaDatabase, FaLanguage, 
  FaQuestionCircle, FaMoon, FaSun, FaCheck, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaCamera, FaDownload, FaTrash,
   FaSignOutAlt, FaGlobe, FaChevronLeft
} from 'react-icons/fa';

// Utilisateur simulé
const mockUser: User = {
  id: '1',
  name: 'Rafik SAWADOGO',
  location: 'Bobo, Burkina Faso',
  avatar: '/api/placeholder/128/128',
  email: 'rafik.sawadogo@example.com',
  phone: '+226 70 00 00 00',
  language: 'Français',
  role: 'Administrateur',
  department: 'Développement'
};

// Interface pour les éléments de la carte de paramètres
interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

// Composant pour afficher une carte de paramètres
const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, action }) => {
  return (
    <div 
      className="bg-[var(--bg-primary)] p-5 rounded-lg shadow-sm border border-[var(--border-color)] hover:shadow-md transition-shadow cursor-pointer"
      onClick={action}
    >
      <div className="flex items-start">
        <div className="mr-4 p-3 bg-[var(--accent-color-light)] text-[var(--accent-color)] rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">{title}</h3>
          <p className="text-[var(--text-secondary)]">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Types pour les différentes sections de paramètres
type SettingsSectionType = 'main' | 'profile' | 'notifications' | 'security' | 'appearance' | 'language' | 'data';

// Composant: Section de profil
interface ProfileSectionProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onBack: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onSave, onBack }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone || '',
    location: user.location,
    department: user.department || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, ...formData });
    setIsEditing(false);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color-light)] rounded-full transition-colors"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Profil utilisateur</h2>
      </div>
      
      <div className="flex flex-col md:flex-row mb-8">
        <div className="w-full md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-32 w-32 rounded-full object-cover border-4 border-[var(--bg-primary)] shadow-md"
            />
            <button 
              className="absolute bottom-0 right-0 bg-[var(--accent-color)] text-white p-2 rounded-full hover:bg-[var(--accent-hover)] transition-colors"
              title="Changer la photo"
            >
              <FaCamera size={16} />
            </button>
          </div>
          <h3 className="text-lg font-medium mt-4 text-[var(--text-primary)]">{user.name}</h3>
          <p className="text-[var(--text-secondary)]">{user.role || 'Utilisateur'}</p>
        </div>
        
        <div className="w-full md:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-[var(--text-secondary)]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 pl-10 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-[var(--text-secondary)]" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 pl-10 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Localisation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-[var(--text-secondary)]" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 pl-10 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Département
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border border-[var(--border-color)] rounded-md focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-[var(--bg-primary)] disabled:bg-[var(--bg-secondary)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)]"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] mr-3"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
                  >
                    Enregistrer
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
                >
                  Modifier le profil
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <hr className="my-8 border-[var(--border-color)]" />
      
      <div>
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Informations du compte</h3>
        <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">ID Utilisateur</p>
              <p className="font-medium text-[var(--text-primary)]">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Rôle</p>
              <p className="font-medium text-[var(--text-primary)]">{user.role || 'Utilisateur'}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Date de création</p>
              <p className="font-medium text-[var(--text-primary)]">12 janvier 2023</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Dernière connexion</p>
              <p className="font-medium text-[var(--text-primary)]">Aujourd'hui à 10:25</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="text-red-600 hover:text-red-800 flex items-center" onClick={() => alert('Déconnexion simulée')}>
          <FaSignOutAlt className="mr-2" /> Se déconnecter
        </button>
      </div>
    </div>
  );
};

// Composant: Section de notifications
interface NotificationsSectionProps {
  onBack: () => void;
  onSave: (preferences: any) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ onBack, onSave }) => {
  const { theme } = useTheme();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    taskUpdates: false,
    weeklyReports: true,
    systemAnnouncements: true
  });
  
  const handleToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof preferences]
    }));
  };
  
  const handleSavePreferences = () => {
    onSave(preferences);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color-light)] rounded-full transition-colors"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Paramètres de notifications</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Notifications par e-mail</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Activer les notifications par e-mail</p>
                <p className="text-sm text-[var(--text-secondary)]">Recevoir toutes les notifications par e-mail</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.emailNotifications} 
                  onChange={() => handleToggle('emailNotifications')}
                />
                <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color-light)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Préférences de notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Mises à jour de projets</p>
                <p className="text-sm text-[var(--text-secondary)]">Être notifié des mises à jour sur vos projets</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.projectUpdates} 
                  onChange={() => handleToggle('projectUpdates')}
                />
                <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color-light)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Affectations de tâches</p>
                <p className="text-sm text-[var(--text-secondary)]">Être notifié lorsqu'une tâche vous est assignée</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.taskAssignments} 
                  onChange={() => handleToggle('taskAssignments')}
                />
                <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color-light)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Mises à jour de tâches</p>
                <p className="text-sm text-[var(--text-secondary)]">Être notifié des mises à jour sur vos tâches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.taskUpdates} 
                  onChange={() => handleToggle('taskUpdates')}
                />
                <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color-light)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Rapports hebdomadaires</p>
                <p className="text-sm text-[var(--text-secondary)]">Recevoir un résumé hebdomadaire de votre activité</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.weeklyReports} 
                  onChange={() => handleToggle('weeklyReports')}
                />
                <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color-light)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Annonces système</p>
                <p className="text-sm text-[var(--text-secondary)]">Être notifié des annonces importantes du système</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={preferences.systemAnnouncements} 
                  onChange={() => handleToggle('systemAnnouncements')}
                />
                <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color-light)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
          >
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant: Section de sécurité
interface SecuritySectionProps {
  onBack: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color-light)] rounded-full transition-colors"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Sécurité du compte</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Mot de passe</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Votre mot de passe a été mis à jour pour la dernière fois il y a 30 jours. Il est recommandé de changer régulièrement votre mot de passe pour renforcer la sécurité de votre compte.
          </p>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
          >
            Modifier le mot de passe
          </button>
        </div>
        
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[var(--text-primary)]">Authentification à deux facteurs</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={twoFactorEnabled} 
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
              <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color-light)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
            </label>
          </div>
          
          {twoFactorEnabled ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-700">
                L'authentification à deux facteurs est activée. Votre compte est mieux protégé contre les accès non autorisés.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-700">
                L'authentification à deux facteurs n'est pas activée. Activez-la pour renforcer la sécurité de votre compte.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Sessions actives</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-md">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Windows 10 • Chrome</p>
                <p className="text-sm text-[var(--text-secondary)]">Bobo, Burkina Faso • Actif maintenant</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Session actuelle</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-md">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Android • Application mobile</p>
                <p className="text-sm text-[var(--text-secondary)]">Bobo, Burkina Faso • Il y a 2 jours</p>
              </div>
              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Modifier le mot de passe</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Mot de passe actuel</label>
                <input 
                  type="password" 
                  className="w-full p-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)]" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  className="w-full p-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)]" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  className="w-full p-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)]" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)]"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
                  onClick={() => {
                    alert('Mot de passe modifié avec succès');
                    setShowPasswordModal(false);
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant: Section d'apparence
interface AppearanceSectionProps {
  onBack: () => void;
  onSave: (appearance: any) => void;
}

// Dans le fichier, mettez à jour le composant AppearanceSection
const AppearanceSection: React.FC<AppearanceSectionProps> = ({ onBack, onSave }) => {
  // Utiliser le contexte de thème
  const { theme, setTheme, fontSize, setFontSize, animations, setAnimations } = useTheme();
  
  const themeOptions = [
    { id: 'light', name: 'Clair', icon: <FaSun className="text-yellow-500" />, preview: 'bg-white border border-gray-200' },
    { id: 'dark', name: 'Sombre', icon: <FaMoon className="text-blue-700" />, preview: 'bg-gray-800 border border-gray-700' },
    { id: 'blue', name: 'Bleu', icon: <FaGlobe className="text-blue-500" />, preview: 'bg-blue-50 border border-blue-200' },
  ];
  
  const handleSaveAppearance = () => {
    // Maintenant, les changements sont déjà appliqués via le contexte
    // Cette fonction sert seulement à afficher la notification
    onSave({
      theme,
      fontSize,
      animations
    });
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color-light)] rounded-full transition-colors"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Paramètres d'apparence</h2>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Thème</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map(themeOption => (
              <div 
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as 'light' | 'dark' | 'blue')}
                className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  theme === themeOption.id ? 'ring-2 ring-[var(--accent-color)] ring-offset-2' : 'border border-[var(--border-color)]'
                }`}
              >
                <div className={`h-20 rounded-md mb-3 ${themeOption.preview}`}></div>
                <div className="flex items-center">
                  <div className="mr-2">{themeOption.icon}</div>
                  <span className="font-medium text-[var(--text-primary)]">{themeOption.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Taille du texte</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'small', label: 'Petit' },
              { id: 'medium', label: 'Moyen' },
              { id: 'large', label: 'Grand' }
            ].map(size => (
              <button
                key={size.id}
                onClick={() => setFontSize(size.id as 'small' | 'medium' | 'large')}
                className={`px-4 py-2 rounded-md ${
                  fontSize === size.id 
                    ? 'bg-[var(--accent-color-light)] text-[var(--accent-color)] border border-[var(--accent-color-border)]' 
                    : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Animations</h3>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer mr-3">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={animations} 
                onChange={() => setAnimations(!animations)}
              />
              <div className="w-11 h-6 bg-[var(--bg-secondary)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-color-light)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
            </label>
            <span className="font-medium text-[var(--text-primary)]">{animations ? 'Animations activées' : 'Animations désactivées'}</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Les animations peuvent être désactivées pour améliorer les performances ou pour des raisons d'accessibilité.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSaveAppearance}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
          >
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant: Section de langue
interface LanguageSectionProps {
  onBack: () => void;
  onSave: (language: string) => void;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({ onBack, onSave }) => {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  
  const languages = [
    { id: 'fr', name: 'Français', flag: '🇫🇷' },
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'pt', name: 'Português', flag: '🇵🇹' },
    { id: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];
  
  const handleSaveLanguage = () => {
    onSave(selectedLanguage);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color-light)] rounded-full transition-colors"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Paramètres de langue</h2>
      </div>
      
      <div className="space-y-6">
        <p className="text-[var(--text-secondary)]">
          Sélectionnez la langue que vous souhaitez utiliser dans l'application. Ce paramètre affecte tous les textes de l'interface utilisateur.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {languages.map(lang => (
            <div 
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                selectedLanguage === lang.id 
                  ? 'bg-[var(--accent-color-light)] border-[var(--accent-color-border)]' 
                  : 'bg-[var(--bg-primary)] border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <div className="text-2xl mr-3">{lang.flag}</div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">{lang.name}</p>
              </div>
              {selectedLanguage === lang.id && (
                <div className="ml-auto">
                  <FaCheck className="text-[var(--accent-color)]" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveLanguage}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)]"
          >
            Appliquer la langue
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant: Section de gestion des données
interface DataSectionProps {
  onBack: () => void;
}

const DataSection: React.FC<DataSectionProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleExportData = () => {
    alert('Exportation des données simulée');
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color-light)] rounded-full transition-colors"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Gestion des données</h2>
      </div>
      
      <div className="space-y-8">
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Exporter vos données</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Vous pouvez exporter toutes vos données personnelles et vos logs de travail dans un format JSON ou CSV.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] flex items-center"
            >
              <FaDownload className="mr-2" /> Exporter en JSON
            </button>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-[var(--text-secondary)] text-white rounded-md hover:bg-[var(--text-primary)] flex items-center"
            >
              <FaDownload className="mr-2" /> Exporter en CSV
            </button>
          </div>
        </div>
        
        <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
          <h3 className="font-medium text-[var(--text-primary)] mb-4">Stockage et cache</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Cache de l'application</p>
                <p className="text-sm text-[var(--text-secondary)]">2.4 MB utilisés</p>
              </div>
              <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)]">
                Vider le cache
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Données locales</p>
                <p className="text-sm text-[var(--text-secondary)]">5.7 MB utilisés</p>
              </div>
              <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)]">
                Effacer les données
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="font-medium text-red-800 mb-4">Zone dangereuse</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            La suppression de votre compte est irréversible. Toutes vos données personnelles et vos logs de travail seront définitivement supprimés.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <FaTrash className="mr-2" /> Supprimer mon compte
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Confirmer la suppression</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Tapez "SUPPRIMER" pour confirmer</label>
              <input 
                type="text" 
                className="w-full p-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)]" 
                placeholder="SUPPRIMER" 
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                className="px-4 py-2 border border-[var(--border-color)] rounded-md text-[var(--text-primary)]"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={() => {
                  alert('Suppression de compte simulée');
                  setShowDeleteModal(false);
                }}
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Page principale des paramètres
const SettingsPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSectionType>('main');
  const [user, setUser] = useState<User>(mockUser);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Gérer la mise à jour du profil
  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    showNotification('Profil mis à jour avec succès', 'success');
  };
  
  // Gérer la mise à jour des notifications
  const handleUpdateNotifications = (preferences: any) => {
    // Simulation de mise à jour des préférences de notifications
    console.log('Préférences de notifications mises à jour:', preferences);
    showNotification('Préférences de notifications enregistrées', 'success');
  };
  
  // Gérer la mise à jour de l'apparence
  const handleUpdateAppearance = (appearance: any) => {
    // Simulation de mise à jour des préférences d'apparence
    console.log('Préférences d\'apparence mises à jour:', appearance);
    showNotification('Préférences d\'apparence enregistrées', 'success');
  };
  
  // Gérer la mise à jour de la langue
  const handleUpdateLanguage = (language: string) => {
    // Simulation de mise à jour de la langue
    console.log('Langue mise à jour:', language);
    showNotification('Langue changée avec succès', 'success');
  };
  
  // Afficher une notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };
  
  // Nettoyer les notifications après quelques secondes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Navigation vers une section
  const navigateToSection = (section: SettingsSectionType) => {
    setActiveSection(section);
    // Faire défiler vers le haut de la page lors de la navigation
    window.scrollTo(0, 0);
  };
  
  // Revenir à la page principale
  const goBackToMain = () => {
    navigateToSection('main');
  };

  // Rendu de la section active
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} onSave={handleUpdateProfile} onBack={goBackToMain} />;
      case 'notifications':
        return <NotificationsSection onSave={handleUpdateNotifications} onBack={goBackToMain} />;
      case 'security':
        return <SecuritySection onBack={goBackToMain} />;
      case 'appearance':
        return <AppearanceSection onSave={handleUpdateAppearance} onBack={goBackToMain} />;
      case 'language':
        return <LanguageSection onSave={handleUpdateLanguage} onBack={goBackToMain} />;
      case 'data':
        return <DataSection onBack={goBackToMain} />;
      default:
        return (
          <>
            <div className="flex flex-wrap justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Paramètres</h1>
            </div>

            {/* Section des paramètres personnels */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-[var(--text-secondary)] mb-4">Paramètres personnels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SettingsCard 
                  title="Profil" 
                  description="Gérer vos informations personnelles et préférences" 
                  icon={<FaUser size={20} />}
                  action={() => navigateToSection('profile')}
                />
                <SettingsCard 
                  title="Notifications" 
                  description="Configurer les notifications par email et dans l'application" 
                  icon={<FaBell size={20} />}
                  action={() => navigateToSection('notifications')}
                />
                <SettingsCard 
                  title="Sécurité" 
                  description="Gérer votre mot de passe et la sécurité du compte" 
                  icon={<FaShieldAlt size={20} />}
                  action={() => navigateToSection('security')}
                />
              </div>
            </div>

            {/* Section des paramètres de l'application */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-[var(--text-secondary)] mb-4">Paramètres de l'application</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SettingsCard 
                  title="Apparence" 
                  description="Personnaliser l'apparence de votre interface" 
                  icon={<FaDesktop size={20} />}
                  action={() => navigateToSection('appearance')}
                />
                <SettingsCard 
                  title="Langue" 
                  description="Modifier la langue de l'application" 
                  icon={<FaLanguage size={20} />}
                  action={() => navigateToSection('language')}
                />
                <SettingsCard 
                  title="Données" 
                  description="Gérer et exporter vos données" 
                  icon={<FaDatabase size={20} />}
                  action={() => navigateToSection('data')}
                />
              </div>
            </div>

            {/* Section d'aide */}
            <div className="bg-[var(--accent-color-light)] p-5 rounded-lg border border-[var(--accent-color-border)]">
              <div className="flex items-start">
                <div className="mr-4 p-3 bg-[var(--accent-color-light-hover)] text-[var(--accent-color)] rounded-lg">
                  <FaQuestionCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">Besoin d'aide ?</h3>
                  <p className="text-[var(--text-secondary)] mb-3">Si vous avez des questions sur les paramètres de l'application, consultez notre centre d'aide.</p>
                  <button className="text-[var(--accent-color)] hover:text-[var(--accent-hover)] font-medium">
                    Visiter le centre d'aide
                  </button>
                </div>
              </div>
            </div>

            {/* Informations sur l'application */}
            <div className="mt-8 text-center text-[var(--text-secondary)] text-sm">
              <p>AProjectO - Version 1.0.0</p>
              <p className="mt-1">© 2025 AProjectO. Tous droits réservés.</p>
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="flex-1 bg-[var(--bg-secondary)] overflow-auto">
      <div className="px-6 py-4 pb-16 max-w-7xl mx-auto">
        {renderActiveSection()}
      </div>
      
      {/* Notification */}
      {notification && (
        <div 
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;