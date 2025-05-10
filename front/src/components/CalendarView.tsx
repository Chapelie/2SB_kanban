import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Task } from '../types';

// Configuration de moment pour la localisation française
moment.locale('fr');

// Création du localisateur avec moment
const localizer = momentLocalizer(moment);

// Messages traduits pour l'interface
const messages = {
  today: 'Aujourd\'hui',
  previous: 'Précédent',
  next: 'Suivant',
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Heure',
  event: 'Événement',
  allDay: 'Toute la journée',
  showMore: (total: number) => `+ ${total} autres`
};

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  // Convertir les tâches en événements du calendrier
  const events = useMemo(() => {
    return tasks.map(task => {
      // Analyser la date d'ouverture
      let startDate = new Date();
      
      try {
        // Si openedDate est sous forme de jours (ex: "10 jours")
        if (task.openedDaysAgo !== undefined) {
          startDate = new Date();
          startDate.setDate(startDate.getDate() - task.openedDaysAgo);
        } 
        // Si la date est au format string comme "10 octobre 2023"
        else if (typeof task.openedDate === 'string') {
          // Utiliser moment pour analyser la date française
          const parsedDate = moment(task.openedDate, 'DD MMMM YYYY').toDate();
          if (!isNaN(parsedDate.getTime())) {
            startDate = parsedDate;
          }
        }
      } catch (error) {
        console.error("Erreur d'analyse de la date:", error);
      }
      
      // Date de fin (pour cet exemple, nous utilisons la même date)
      const endDate = new Date(startDate);
      
      // La couleur dépend du statut de la tâche
      let backgroundColor;
      switch (task.status) {
        case 'Completed':
          backgroundColor = '#10B981'; // vert
          break;
        case 'InProgress':
          backgroundColor = '#3B82F6'; // bleu
          break;
        case 'Open':
          backgroundColor = '#6B7280'; // gris
          break;
        case 'Canceled':
          backgroundColor = '#EF4444'; // rouge
          break;
        default:
          backgroundColor = '#6B7280'; // gris par défaut
      }

      // Ajouter des informations supplémentaires pour l'affichage
      const priorityBadge = 
        task.priority === 'high' ? '🔴 ' :
        task.priority === 'medium' ? '🟡 ' :
        task.priority === 'low' ? '🟢 ' : '';

      return {
        id: task.id,
        title: `${priorityBadge}${task.taskNumber} - ${task.title}`,
        start: startDate,
        end: endDate,
        allDay: true, // Tâches affichées comme événements d'une journée entière
        resource: task, // Stocke la tâche complète pour y accéder lors du clic
        backgroundColor
      };
    });
  }, [tasks]);
  
  // Style personnalisé pour les événements
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block',
        fontWeight: 500,
        padding: '2px 5px'
      }
    };
  };

  // Gestionnaire pour le clic sur un événement
  const handleEventClick = (event: any) => {
    if (event.resource) {
      onTaskClick(event.resource.id);
    }
  };

  return (
    <div className="h-[600px] bg-[var(--bg-primary)] rounded-lg p-1">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        messages={messages}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick}
        popup
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        defaultDate={new Date()}
      />
    </div>
  );
};

export default CalendarView;