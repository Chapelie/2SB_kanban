import React, { createContext, useState, useContext, useEffect } from 'react';
import { TutorialStepData } from '../components/tutorial/TutorialManager';

interface TutorialContextType {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  tutorialCompleted: boolean;
  markTutorialAsCompleted: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType>({
  showTutorial: false,
  setShowTutorial: () => {},
  tutorialCompleted: false,
  markTutorialAsCompleted: () => {},
  skipTutorial: () => {},
  resetTutorial: () => {},
});

export const useTutorial = () => useContext(TutorialContext);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Vérifier si le tutoriel a été complété ou ignoré
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(() => {
    return localStorage.getItem('tutorialCompleted') === 'true';
  });
  
  // État pour contrôler l'affichage du tutoriel
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  
  // Marquer le tutoriel comme complété et le cacher
  const markTutorialAsCompleted = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setTutorialCompleted(true);
    setShowTutorial(false);
  };
  
  // Ignorer le tutoriel et le marquer comme complété
  const skipTutorial = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setTutorialCompleted(true);
    setShowTutorial(false);
  };
  
  // Réinitialiser le tutoriel pour qu'il s'affiche à nouveau
  const resetTutorial = () => {
    localStorage.setItem('tutorialCompleted', 'false');
    setTutorialCompleted(false);
  };
  
  return (
    <TutorialContext.Provider
      value={{
        showTutorial,
        setShowTutorial,
        tutorialCompleted,
        markTutorialAsCompleted,
        skipTutorial,
        resetTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

// Données du tutoriel pour différentes pages
export const getDashboardTutorialSteps = (): TutorialStepData[] => [
  {
    id: 'welcome',
    title: 'Bienvenue sur 2SB Kanban !',
    description: 'Nous vous guidons à travers les fonctionnalités essentielles pour bien démarrer. Ce tutoriel vous aidera à vous familiariser avec l\'interface.',
    position: 'center',
    image: '/images/hero-mockup.jpeg'
  },
  {
    id: 'sidebar',
    title: 'Menu de navigation',
    description: 'Utilisez cette barre latérale pour naviguer entre les différentes sections de l\'application : projets, tâches, journal de travail, et plus encore.',
    position: 'right',
    targetElement: 'sidebar-navigation'
  },
  {
    id: 'projects',
    title: 'Vos projets',
    description: 'Ici, vous pouvez voir tous vos projets actuels, leur statut, et y accéder d\'un simple clic.',
    position: 'bottom',
    targetElement: 'projects-container'
  },
  {
    id: 'create-project',
    title: 'Créer un projet',
    description: 'Cliquez ici pour créer un nouveau projet et commencer à organiser vos tâches.',
    position: 'left',
    targetElement: 'create-project-button'
  },
  {
    id: 'profile',
    title: 'Votre profil',
    description: 'Accédez à votre profil, aux paramètres et aux options de déconnexion depuis cet emplacement.',
    position: 'bottom',
    targetElement: 'user-profile-menu'
  },
  {
    id: 'complete',
    title: 'Vous êtes prêt !',
    description: 'Vous connaissez maintenant les bases de 2SB Kanban. Explorez l\'application et créez votre premier projet pour commencer.',
    position: 'center',
    image: '/images/demo-kanban.png'
  }
];

export const getProjectDetailTutorialSteps = (): TutorialStepData[] => [
  {
    id: 'project-overview',
    title: 'Détails du projet',
    description: 'Cette page vous montre tous les détails de votre projet et vous permet de gérer les tâches à l\'aide d\'un tableau Kanban.',
    position: 'center'
  },
  {
    id: 'kanban-board',
    title: 'Tableau Kanban',
    description: 'Visualisez et gérez vos tâches avec ce tableau qui les organise en trois colonnes : À faire, En cours et Terminé.',
    position: 'top',
    targetElement: 'kanban-board'
  },
  {
    id: 'task-drag',
    title: 'Déplacer des tâches',
    description: 'Faites glisser et déposez les tâches entre les colonnes pour mettre à jour leur statut d\'avancement.',
    position: 'top',
    targetElement: 'task-columns'
  },
  {
    id: 'create-task',
    title: 'Créer une tâche',
    description: 'Cliquez ici pour ajouter une nouvelle tâche à votre projet.',
    position: 'left',
    targetElement: 'create-task-button'
  },
  {
    id: 'team-members',
    title: 'Membres de l\'équipe',
    description: 'Visualisez les membres de l\'équipe du projet et invitez de nouveaux collaborateurs.',
    position: 'bottom',
    targetElement: 'team-members-section'
  }
];

export const getTasksTutorialSteps = (): TutorialStepData[] => [
  {
    id: 'tasks-overview',
    title: 'Gestion des tâches',
    description: 'Cette page vous permet de voir toutes vos tâches à travers tous les projets et de les filtrer selon différents critères.',
    position: 'center'
  },
  {
    id: 'task-filters',
    title: 'Filtres de tâches',
    description: 'Utilisez ces filtres pour trouver rapidement les tâches qui vous intéressent par statut, priorité ou assignation.',
    position: 'bottom',
    targetElement: 'task-filters'
  },
  {
    id: 'task-details',
    title: 'Détails des tâches',
    description: 'Cliquez sur une tâche pour voir tous ses détails, ajouter des commentaires ou modifier son statut.',
    position: 'right',
    targetElement: 'task-list'
  }
];

export const getWorkLogsTutorialSteps = (): TutorialStepData[] => [
  {
    id: 'worklogs-overview',
    title: 'Journal de travail',
    description: 'Suivez le temps passé sur chaque tâche et projet pour une meilleure gestion de votre temps et des rapports précis.',
    position: 'center'
  },
  {
    id: 'add-worklog',
    title: 'Ajouter une entrée',
    description: 'Cliquez ici pour enregistrer une nouvelle entrée de temps de travail sur un projet.',
    position: 'left',
    targetElement: 'add-worklog-button'
  },
  {
    id: 'worklog-list',
    title: 'Historique des entrées',
    description: 'Consultez toutes vos entrées précédentes et voyez comment vous avez réparti votre temps entre les projets.',
    position: 'top',
    targetElement: 'worklog-list'
  }
];