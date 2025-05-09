// Types pour les différentes sections de paramètres
export type SettingsSectionType = 'main' | 'profile' | 'notifications' | 'security' | 'appearance' | 'language' | 'data';

// Interface pour les éléments de la carte de paramètres (si nécessaire)
export interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}