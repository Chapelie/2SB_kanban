import React, { useState } from 'react';
import { User } from '../types';
import { 
  FaUser, FaBell, FaShieldAlt, FaDesktop, FaDatabase, FaLanguage, FaQuestionCircle 
} from 'react-icons/fa';

// Importation du hook de notification
import useNotification from '../hooks/useNotification';

// Importation des sections de paramètres
import ProfileSection from './settings/ProfileSection';
import NotificationsSection from './settings/NotificationsSection';
import SecuritySection from './settings/SecuritySection';
import AppearanceSection from './settings/AppearanceSection';
import LanguageSection from './settings/LanguageSection';
import DataSection from './settings/DataSection';

// Importation du composant de carte de paramètres
import SettingsCard from '../components/settingsCard';
import authService from '../services/authService';

// Types pour les différentes sections de paramètres
type SettingsSectionType = 'main' | 'profile' | 'notifications' | 'security' | 'appearance' | 'language' | 'data';

// Utilisateur simulé
const currentUser: User = authService.getCurrentUser();

// Page principale des paramètres
const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSectionType>('main');
  const [user, setUser] = useState<User>(currentUser);
  const { notification, showNotification } = useNotification();
  
  // Gérer la mise à jour du profil
  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    showNotification('Profil mis à jour avec succès', 'success');
  };
  
  // Gérer la mise à jour des notifications
  const handleUpdateNotifications = (preferences: React.ChangeEvent<HTMLInputElement>) => {
    // Simulation de mise à jour des préférences de notifications
    console.log('Préférences de notifications mises à jour:', preferences);
    showNotification('Préférences de notifications enregistrées', 'success');
  };
  
  // Gérer la mise à jour de l'apparence
  const handleUpdateAppearance = (appearance: React.ChangeEvent<HTMLInputElement>) => {
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
              <p>2SB Kanban - Version 1.0.0</p>
              <p className="mt-1">© 2025 2SB Kanban. Tous droits réservés.</p>
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
      
      {/* Affichage des notifications via le hook useNotification */}
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