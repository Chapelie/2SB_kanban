import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import TutorialStep from './TutorialStep';

// Définition d'une étape de tutoriel
export interface TutorialStepData {
  id: string;
  title: string;
  description: string;
  image?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  targetElement?: string;
}

interface TutorialManagerProps {
  steps: TutorialStepData[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const TutorialManager: React.FC<TutorialManagerProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Réinitialiser à la première étape lorsque le tutoriel devient actif
  useEffect(() => {
    if (isActive) {
      setCurrentStepIndex(0);
    }
  }, [isActive]);
  
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };
  
  // Si le tutoriel n'est pas actif, ne rien afficher
  if (!isActive || steps.length === 0) {
    return null;
  }
  
  const currentStep = steps[currentStepIndex];
  
  return (
    <AnimatePresence>
      <TutorialStep
        key={currentStep.id}
        title={currentStep.title}
        description={currentStep.description}
        image={currentStep.image}
        position={currentStep.position}
        targetElement={currentStep.targetElement}
        onNext={handleNext}
        onSkip={onSkip}
        isLastStep={currentStepIndex === steps.length - 1}
        step={currentStepIndex + 1}
        totalSteps={steps.length}
        onComplete={onComplete}
      />
    </AnimatePresence>
  );
};

export default TutorialManager;