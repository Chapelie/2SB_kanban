import React, { useState } from 'react';
import { FaChevronLeft, FaCheck } from 'react-icons/fa';

interface LanguageSectionProps {
  onBack: () => void;
  onSave: (language: string) => void;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({ onBack, onSave }) => {
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

export default LanguageSection;