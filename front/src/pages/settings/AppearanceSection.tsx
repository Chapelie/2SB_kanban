import React from 'react';
import { FaChevronLeft, FaMoon, FaSun, FaGlobe } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

interface AppearanceSectionProps {
  onBack: () => void;
  onSave: (appearance: any) => void;
}

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

export default AppearanceSection;