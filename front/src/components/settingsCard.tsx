import React from 'react';

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

export default SettingsCard;