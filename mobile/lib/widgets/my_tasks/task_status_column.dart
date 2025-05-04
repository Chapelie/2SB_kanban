import 'package:flutter/material.dart';
import '../../models/task.dart';
import 'task_card_widget.dart';

class TaskStatusColumn extends StatelessWidget {
  final List<Task> tasks;
  final Color color;
  final String title;
  final TaskStatus status;
  final Function(Task) onTaskTap;

  const TaskStatusColumn({
    Key? key,
    required this.tasks,
    required this.color,
    required this.title,
    required this.status,
    required this.onTaskTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Container(
      color: isDark ? Colors.grey.shade900 : Colors.grey.shade50,
      padding: const EdgeInsets.fromLTRB(4, 4, 4, 80), // Espace pour le FAB
      child: Column(
        children: [
          // En-tête de colonne dans le style Kanban
          Container(
            margin: const EdgeInsets.fromLTRB(12, 8, 12, 0),
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
            decoration: BoxDecoration(
              color: color.withOpacity(isDark ? 0.15 : 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: color.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      _getIconForStatus(status),
                      color: color,
                      size: 20,
                    ),
                    const SizedBox(width: 10),
                    Text(
                      title,
                      style: TextStyle(
                        color: color,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.black26 : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: color.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    '${tasks.length}',
                    style: TextStyle(
                      color: color,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Corps de la colonne avec la liste des tâches
          if (tasks.isEmpty)
            Expanded(child: _buildEmptyKanbanColumn(status, color))
          else
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.only(top: 12, bottom: 16),
                itemCount: tasks.length,
                itemBuilder: (context, index) {
                  return TaskCardWidget(
                    task: tasks[index],
                    statusColor: color,
                    onTap: onTaskTap, projectName: tasks[index].projectId,
                  );
                },
              ),
            ),
        ],
      ),
    );
  }

  // État vide pour la colonne Kanban
  Widget _buildEmptyKanbanColumn(TaskStatus status, Color color) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              _getIconForStatus(status),
              size: 32,
              color: color,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            _getEmptyStateText(status),
            style: TextStyle(
              fontSize: 16,
              color: color.withOpacity(0.7),
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 48.0),
            child: Text(
              _getEmptyStateSubtitle(status),
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: color.withOpacity(0.5),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Icône pour le statut de la tâche
  IconData _getIconForStatus(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return Icons.inbox_outlined;
      case TaskStatus.inProgress:
        return Icons.pending_actions_outlined;
      case TaskStatus.completed:
        return Icons.task_outlined;
      case TaskStatus.canceled:
        return Icons.cancel_outlined;
    }
  }

  // Texte d'état vide principal
  String _getEmptyStateText(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return 'Aucune tâche à faire';
      case TaskStatus.inProgress:
        return 'Aucune tâche en cours';
      case TaskStatus.completed:
        return 'Aucune tâche terminée';
      case TaskStatus.canceled:
        return 'Aucune tâche annulée';
    }
  }

  // Sous-titre d'état vide
  String _getEmptyStateSubtitle(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return 'Les tâches à faire s\'afficheront ici. Ajoutez une nouvelle tâche pour commencer.';
      case TaskStatus.inProgress:
        return 'Déplacez des tâches ici lorsque vous commencez à y travailler.';
      case TaskStatus.completed:
        return 'Les tâches marquées comme terminées s\'afficheront ici.';
      case TaskStatus.canceled:
        return 'Les tâches annulées s\'afficheront ici.';
    }
  }
}