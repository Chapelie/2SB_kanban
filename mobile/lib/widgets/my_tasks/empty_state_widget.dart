import 'package:flutter/material.dart';
import '../../models/task.dart';

class EmptyStateWidget extends StatelessWidget {
  final TaskStatus status;
  final Color color;
  
  const EmptyStateWidget({
    Key? key,
    required this.status,
    required this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
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

class GlobalEmptyStateWidget extends StatelessWidget {
  final VoidCallback onCreateTask;
  
  const GlobalEmptyStateWidget({Key? key, required this.onCreateTask}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: isDark
                    ? Colors.blue.withOpacity(0.1)
                    : Colors.blue.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.assignment_outlined,
                size: 80,
                color: isDark ? Colors.blue.shade200 : Colors.blue.shade400,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Aucune tâche pour le moment',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: Text(
                'Toutes vos tâches assignées apparaîtront ici. Commencez par créer votre première tâche !',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: isDark ? Colors.white70 : Colors.black54,
                ),
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: onCreateTask,
              icon: const Icon(Icons.add),
              label: const Text('Créer une tâche'),
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}