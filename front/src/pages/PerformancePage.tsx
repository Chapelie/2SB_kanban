import React, { useState, useEffect, useMemo } from 'react';
import { Project, Task, WorkLog } from '../types';
import { FaChartPie, FaCalendarAlt, FaProjectDiagram, FaClipboardList, FaChartBar, FaFilter } from 'react-icons/fa';
import { format, parseISO, subDays, isWithinInterval } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

// Types pour les statistiques
interface ProjectStats {
  onTrack: number;
  offTrack: number;
  completed: number;
  total: number;
}

interface TaskStats {
  open: number;
  inProgress: number;
  completed: number;
  total: number;
}

interface WorkLogStats {
  pending: number;
  completed: number;
  total: number;
  byProject: Record<string, number>;
}

// Génération de données fictives
const getProjects = (): Project[] => {
  return Array(10).fill(null).map((_, index) => ({
    id: `project-${index + 1}`,
    title: `Adoddle Project ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    dueDate: format(subDays(new Date(), Math.floor(Math.random() * 90)), 'dd MMMM yyyy'),
    status: index % 3 === 0 ? 'Offtrack' : index % 3 === 1 ? 'OnTrack' : 'Completed',
    issuesCount: index + 5,
    teamMembers: [
      { id: '1', name: 'Rafik SAWADOGO', avatar: '/api/placeholder/24/24', location: 'Bobo, Burkina Faso' },
      { id: '2', name: 'Marie Dupont', avatar: '/api/placeholder/24/24', location: 'Paris, France' },
    ]
  }));
};

const getTasks = (): Task[] => {
  return Array(20).fill(null).map((_, index) => ({
    id: `task-${index + 1}`,
    title: `Tâche ${index + 1}`,
    taskNumber: `T-${1000 + index}`,
    openedDate: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
    openedBy: 'Rafik SAWADOGO',
    status: index % 4 === 0 ? 'Open' : index % 4 === 1 ? 'InProgress' : index % 4 === 2 ? 'Completed' : 'Canceled',
    timeSpent: `${Math.floor(Math.random() * 10)}h ${Math.floor(Math.random() * 60)}m`,
    assignedTo: {
      id: '1',
      name: 'Rafik SAWADOGO',
      avatar: '/api/placeholder/24/24'
    },
    description: 'Description de la tâche...',
    days: Math.floor(Math.random() * 10),
    comments: Math.floor(Math.random() * 10),
    attachments: Math.floor(Math.random() * 5),
    projectId: `project-${Math.floor(Math.random() * 10) + 1}`,
    priority: index % 3 === 0 ? 'low' : index % 3 === 1 ? 'medium' : 'high',
    openedDaysAgo: Math.floor(Math.random() * 30)
  }));
};

const getWorkLogs = (): WorkLog[] => {
  const logs: WorkLog[] = [];
  const today = new Date();
  
  // Créer des logs pour les 30 derniers jours
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    const logsPerDay = Math.floor(Math.random() * 4);
    for (let j = 0; j < logsPerDay; j++) {
      const projectId = `project-${Math.floor(Math.random() * 10) + 1}`;
      
      logs.push({
        id: `log-${dateString}-${j}`,
        projectId,
        userId: '1',
        description: j % 3 === 0 
          ? 'Développement de nouvelles fonctionnalités' 
          : j % 3 === 1
            ? 'Réunion avec l\'équipe et planification'
            : 'Correction de bugs et tests',
        date: dateString,
        status: i < 3 && j === 0 ? 'pending' : 'completed'
      });
    }
  }
  
  return logs;
};

// Composant: Carte de statistiques
interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className={`bg-[var(--bg-primary)] rounded-lg shadow-sm p-4 border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">{title}</h3>
          <div className="text-2xl font-bold mt-1 text-[var(--text-primary)]">{value}</div>
          {subtitle && <div className="text-xs text-[var(--text-secondary)] mt-1">{subtitle}</div>}
        </div>
        <div className={`p-2 rounded-full bg-opacity-10 ${color.replace('border-', 'bg-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Composant: Graphique de progression
interface ProgressBarProps {
  title: string;
  items: {
    label: string;
    value: number;
    color: string;
  }[];
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ title, items, total }) => {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">{title}</h3>
      <div className="h-4 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        {items.map((item, index) => (
          <div 
            key={index}
            style={{ 
              width: `${(item.value / total) * 100}%`,
              height: '100%',
              float: 'left'
            }}
            className={`${item.color}`}
          ></div>
        ))}
      </div>
      <div className="flex justify-between mt-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-1.5 ${item.color}`}></div>
            <span className="text-xs text-[var(--text-secondary)]">{item.label}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant: Graphique à barres vertical
interface BarChartProps {
  title: string;
  data: {
    label: string;
    value: number;
  }[];
  maxValue: number;
}

const BarChart: React.FC<BarChartProps> = ({ title, data, maxValue }) => {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">{title}</h3>
      <div className="flex h-40 items-end justify-between">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              className={`w-8 rounded-t-md ${index % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
            ></div>
            <div className="text-xs text-[var(--text-secondary)] mt-1 w-16 text-center truncate">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Page principale de Performance
const PerformancePage: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [timeframe, setTimeframe] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  
  // Charger les données
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setProjects(getProjects());
      setTasks(getTasks());
      setWorkLogs(getWorkLogs());
      setIsLoading(false);
    }, 800);
  }, []);

  // Filtrer les données selon la période sélectionnée
  const filteredData = useMemo(() => {
    if (timeframe === 'all') {
      return { projects, tasks, workLogs };
    }

    const today = new Date();
    let startDate: Date;

    switch (timeframe) {
      case '7days':
        startDate = subDays(today, 7);
        break;
      case '30days':
        startDate = subDays(today, 30);
        break;
      case '90days':
      default:
        startDate = subDays(today, 90);
        break;
    }

    const filteredTasks = tasks.filter(task => {
      const taskDate = parseISO(task.openedDate);
      return isWithinInterval(taskDate, { start: startDate, end: today });
    });

    const filteredWorkLogs = workLogs.filter(log => {
      const logDate = parseISO(log.date);
      return isWithinInterval(logDate, { start: startDate, end: today });
    });

    return {
      projects, // Projets ne sont pas filtrés par date
      tasks: filteredTasks,
      workLogs: filteredWorkLogs
    };
  }, [projects, tasks, workLogs, timeframe]);

  // Calculer les statistiques de projets
  const projectStats: ProjectStats = useMemo(() => {
    return filteredData.projects.reduce((stats, project) => {
      if (project.status === 'OnTrack') stats.onTrack++;
      else if (project.status === 'Offtrack') stats.offTrack++;
      else if (project.status === 'Completed') stats.completed++;
      stats.total++;
      return stats;
    }, { onTrack: 0, offTrack: 0, completed: 0, total: 0 });
  }, [filteredData.projects]);

  // Calculer les statistiques de tâches
  const taskStats: TaskStats = useMemo(() => {
    return filteredData.tasks.reduce((stats, task) => {
      if (task.status === 'Open') stats.open++;
      else if (task.status === 'InProgress') stats.inProgress++;
      else if (task.status === 'Completed') stats.completed++;
      stats.total++;
      return stats;
    }, { open: 0, inProgress: 0, completed: 0, total: 0 });
  }, [filteredData.tasks]);

  // Calculer les statistiques de logs de travail
  const workLogStats: WorkLogStats = useMemo(() => {
    const stats = filteredData.workLogs.reduce((stats, log) => {
      if (log.status === 'pending') stats.pending++;
      else if (log.status === 'completed') stats.completed++;
      
      stats.total++;
      
      // Regrouper par projet
      if (!stats.byProject[log.projectId]) {
        stats.byProject[log.projectId] = 0;
      }
      stats.byProject[log.projectId]++;
      
      return stats;
    }, { pending: 0, completed: 0, total: 0, byProject: {} as Record<string, number> });
    
    return stats;
  }, [filteredData.workLogs]);

  // Taux de complétion des tâches
  const taskCompletionRate = useMemo(() => {
    if (taskStats.total === 0) return 0;
    return Math.round((taskStats.completed / taskStats.total) * 100);
  }, [taskStats]);

  // Top projets par activité
  const topProjects = useMemo(() => {
    const projectEntries = Object.entries(workLogStats.byProject)
      .map(([id, count]) => ({
        id,
        count,
        project: projects.find(p => p.id === id)
      }))
      .filter(item => item.project)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return projectEntries.map(entry => ({
      label: entry.project?.title.split(' ').slice(-1)[0] || 'Inconnu',
      value: entry.count
    }));
  }, [workLogStats.byProject, projects]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-[var(--bg-secondary)] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[var(--bg-secondary)] overflow-auto">
      <div className="px-6 py-4 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Tableau de bord</h1>
          
          {/* Filtre de période */}
          <div className="flex items-center bg-[var(--bg-primary)] rounded-md border border-[var(--border-color)] p-1">
            <FaFilter className="ml-2 text-[var(--text-secondary)]" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as unknown as '7days' | '30days' | '90days' | 'all')}
              className="py-1 px-2 bg-transparent border-0 text-sm focus:ring-0 focus:outline-none text-[var(--text-primary)]"
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
              <option value="all">Tout</option>
            </select>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Projets" 
            value={projectStats.total}
            subtitle={`${projectStats.completed} terminés`}
            icon={<FaProjectDiagram className="text-blue-500" />}
            color="border-blue-500"
          />
          <StatCard 
            title="Tâches" 
            value={taskStats.total}
            subtitle={`${taskStats.open} ouvertes, ${taskStats.inProgress} en cours`}
            icon={<FaClipboardList className="text-green-500" />}
            color="border-green-500"
          />
          <StatCard 
            title="Logs de travail" 
            value={workLogStats.total}
            subtitle={`${workLogStats.pending} en cours, ${workLogStats.completed} terminés`}
            icon={<FaCalendarAlt className="text-yellow-500" />}
            color="border-yellow-500"
          />
          <StatCard 
            title="Complétion des tâches" 
            value={`${taskCompletionRate}%`}
            subtitle="Taux de complétion"
            icon={<FaChartPie className="text-purple-500" />}
            color="border-purple-500"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ProgressBar
            title="État des projets"
            items={[
              { label: 'En bonne voie', value: projectStats.onTrack, color: 'bg-green-500' },
              { label: 'En retard', value: projectStats.offTrack, color: 'bg-red-500' },
              { label: 'Terminés', value: projectStats.completed, color: 'bg-blue-500' }
            ]}
            total={projectStats.total}
          />
          <ProgressBar
            title="État des tâches"
            items={[
              { label: 'Ouvertes', value: taskStats.open, color: 'bg-yellow-500' },
              { label: 'En cours', value: taskStats.inProgress, color: 'bg-blue-500' },
              { label: 'Terminées', value: taskStats.completed, color: 'bg-green-500' }
            ]}
            total={taskStats.total}
          />
        </div>

        {/* Activité par projet */}
        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Activité par projet</h3>
          <BarChart
            title=""
            data={topProjects}
            maxValue={Math.max(...topProjects.map(p => p.value), 1)}
          />
        </div>

        {/* Aperçu de la productivité */}
        <div className="bg-[var(--bg-primary)] rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">Aperçu de la productivité</h3>
            <FaChartBar className="text-[var(--accent-color)]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Nombre de tâches terminées</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{taskStats.completed}</div>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Entrées de travail créées</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{workLogStats.total}</div>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="text-sm text-[var(--text-secondary)] mb-1">Projets actifs</div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{projectStats.total - projectStats.completed}</div>
            </div>
          </div>
        </div>

        {/* Citation motivante */}
        <div className="bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] rounded-lg shadow-md p-6 text-white">
          <blockquote className="italic text-lg">
            "La productivité n'est jamais un accident. C'est toujours le résultat d'un engagement envers l'excellence, une planification intelligente et un effort ciblé."
          </blockquote>
          <div className="mt-3 text-white/80 text-right font-medium">— Paul J. Meyer</div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;