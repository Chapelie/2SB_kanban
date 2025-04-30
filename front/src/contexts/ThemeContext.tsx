import React, { createContext, useState, useContext, useEffect } from 'react';

// Types de thèmes disponibles
export type ThemeType = 'light' | 'dark' | 'blue';

// Structure du contexte
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  animations: boolean;
  setAnimations: (enabled: boolean) => void;
}

// Création du contexte avec des valeurs par défaut
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  animations: true,
  setAnimations: () => {}
});

// Hook personnalisé pour utiliser le contexte
export const useTheme = () => useContext(ThemeContext);

// Fournisseur du contexte
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupération des préférences depuis le localStorage ou utilisation des valeurs par défaut
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'light';
  });
  
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    return (savedFontSize as 'small' | 'medium' | 'large') || 'medium';
  });
  
  const [animations, setAnimations] = useState<boolean>(() => {
    const savedAnimations = localStorage.getItem('animations');
    return savedAnimations ? savedAnimations === 'true' : true;
  });

  // Sauvegarde des préférences dans le localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Appliquer les classes de thème au body ou au conteneur racine
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-blue');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    
    // Appliquer les classes de taille de police au body
    document.body.classList.remove('text-small', 'text-medium', 'text-large');
    document.body.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('animations', animations.toString());
    
    // Ajouter ou supprimer la classe pour désactiver les animations
    if (!animations) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }, [animations]);

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        fontSize, 
        setFontSize, 
        animations, 
        setAnimations 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};