import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

interface SecuritySectionProps {
  onBack: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ onBack }) => {
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

export default SecuritySection;