import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

interface NotificationsSectionProps {
  onBack: () => void;
  onSave: (preferences: unknown) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ onBack, onSave }) => {
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

export default NotificationsSection;