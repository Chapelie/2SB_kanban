import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaTimes, FaCheck } from 'react-icons/fa';

export interface TutorialStepProps {
  title: string;
  description: string;
  image?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  targetElement?: string; // ID de l'élément cible pour le positionnement
  onNext: () => void;
  onSkip: () => void;
  onComplete?: () => void;
  isLastStep: boolean;
  step: number;
  totalSteps: number;
}

const TutorialStep: React.FC<TutorialStepProps> = ({
  title,
  description,
  image,
  position,
  targetElement,
  onNext,
  onSkip,
  onComplete,
  isLastStep,
  step,
  totalSteps
}) => {
  // Calcul du positionnement relatif à l'élément cible
  const [popupStyle, setPopupStyle] = React.useState<React.CSSProperties>({});
  
  React.useEffect(() => {
    if (targetElement) {
      const targetEl = document.getElementById(targetElement);
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Highlight l'élément cible avec un outline
        targetEl.style.outline = '2px solid var(--accent-color)';
        targetEl.style.outlineOffset = '2px';
        targetEl.style.zIndex = '1000';
        
        // Calculer la position de la popup (largeur de popup estimée à 300px, hauteur à 200px)
        const popupWidth = 300;
        const popupHeight = 200;
        let style: React.CSSProperties = {};
        
        // Protection contre les positionnements hors écran pour tous les éléments cibles
        if (targetElement === 'sidebar-navigation') {
          // Positionnement spécial pour la barre latérale
          style = {
            position: 'fixed',
            top: Math.max(rect.top + rect.height / 2 - popupHeight / 2, 100),
            left: rect.right + 20,
            zIndex: 1100
          };
        } else if (targetElement === 'projects-container') {
          // Positionnement spécial pour le conteneur de projets (étape 3)
          style = {
            position: 'fixed',
            top: rect.top + 100, // Positionner plus bas dans le conteneur de projets
            left: rect.left + rect.width / 2 - popupWidth / 2, // Centré horizontalement
            zIndex: 1100
          };
        } else if (targetElement === 'create-project-button') {
          // Position complètement recalculée pour l'étape 4 avec des valeurs fixes
          style = {
            position: 'fixed',
            top: rect.bottom + 50, // Beaucoup plus bas sous le bouton
            left: rect.left - 100, // Beaucoup plus à gauche
            zIndex: 9999 // z-index très élevé pour s'assurer qu'il est au-dessus de tout
          };
        } else if (targetElement === 'user-profile-menu') {
          // Positionnement spécial pour le menu utilisateur (étape 5)
          style = {
            position: 'fixed',
            top: rect.bottom + 15,
            left: rect.right - popupWidth, // Aligné avec le bord droit du menu utilisateur
            zIndex: 1100
          };
        } else {
          switch (position) {
            case 'top':
              style = {
                position: 'fixed',
                top: Math.max(10, rect.top - popupHeight - 10),
                left: Math.max(10, Math.min(viewportWidth - popupWidth - 10, rect.left + rect.width / 2 - popupWidth / 2))
              };
              break;
            case 'bottom':
              style = {
                position: 'fixed',
                top: Math.min(viewportHeight - popupHeight - 10, rect.bottom + 10),
                left: Math.max(10, Math.min(viewportWidth - popupWidth - 10, rect.left + rect.width / 2 - popupWidth / 2))
              };
              break;
            case 'left':
              style = {
                position: 'fixed',
                top: Math.max(10, Math.min(viewportHeight - popupHeight - 10, rect.top + rect.height / 2 - popupHeight / 2)),
                left: Math.max(10, rect.left - popupWidth - 10)
              };
              break;
            case 'right':
              style = {
                position: 'fixed',
                top: Math.max(10, Math.min(viewportHeight - popupHeight - 10, rect.top + rect.height / 2 - popupHeight / 2)),
                left: Math.min(viewportWidth - popupWidth - 10, rect.right + 10)
              };
              break;
            case 'center':
            default:
              style = {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              };
              break;
          }
        }
        
        setPopupStyle(style);
        
        // S'assurer que l'élément est visible dans la vue
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        
        return () => {
          // Nettoyage du style de l'élément cible
          targetEl.style.outline = '';
          targetEl.style.outlineOffset = '';
          targetEl.style.zIndex = '';
        };
      }
    } else {
      // Si pas d'élément cible, positionner encore plus haut dans l'écran (30% au lieu de 40%)
      setPopupStyle({
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1100
      });
    }
  }, [targetElement, position]);
  
  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };
  
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 }, exit: { opacity: 0 } }}
    >
      {/* Overlay semi-transparent sans effet de flou */}
      <div className="absolute inset-0 z-40" onClick={onSkip}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      {/* Popup de tutoriel */}
      <motion.div
        className="bg-[var(--bg-primary)] shadow-xl rounded-lg p-4 w-[300px]"
        style={popupStyle}
        variants={variants}
      >
        {/* En-tête avec titre et bouton fermer */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <button 
            onClick={onSkip}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Fermer le tutoriel"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Image d'illustration (si fournie) */}
        {image && (
          <div className="mb-3">
            <img 
              src={image} 
              alt={title} 
              className="rounded-md w-full h-auto max-h-[150px] object-cover"
            />
          </div>
        )}
        
        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] mb-4">{description}</p>
        
        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 w-5 rounded-full ${
                  i === step - 1 
                    ? 'bg-[var(--accent-color)]' 
                    : 'bg-[var(--border-color)]'
                }`}
              ></div>
            ))}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            Étape {step}/{totalSteps}
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-between">
          <button
            onClick={onSkip}
            className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Ignorer
          </button>
          
          <button
            onClick={isLastStep ? (onComplete || onNext) : onNext}
            className="px-4 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-md text-sm flex items-center"
          >
            {isLastStep ? (
              <>
                Terminer
                <FaCheck className="ml-2" />
              </>
            ) : (
              <>
                Suivant
                <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TutorialStep;