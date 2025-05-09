import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  fullPage = false 
}) => {
  // Déterminer la taille du spinner
  const sizeClass = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3',
  }[size];

  // Spinner de base
  const spinner = (
    <div className={`animate-spin rounded-full border-t-[var(--accent-color)] border-r-transparent border-b-[var(--accent-color)] border-l-transparent ${sizeClass}`}></div>
  );

  // Si fullPage est true, centrer dans toute la page
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)] bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  // Sinon, retourner le spinner seul
  return spinner;
};

export default LoadingSpinner;