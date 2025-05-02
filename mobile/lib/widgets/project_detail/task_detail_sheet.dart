import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/task.dart';
import '../../controllers/task_controller.dart';
import 'task_status_chip.dart';

class TaskDetailSheet extends StatelessWidget {
  final Task task;
  final Function(Task) onUpdateTask;
  final Function(Task) onUpdateStatus;
  final Function(String) onDeleteTask;

  const TaskDetailSheet({
    Key? key,
    required this.task,
    required this.onUpdateTask,
    required this.onUpdateStatus,
    required this.onDeleteTask,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.5,
      maxChildSize: 0.9,
      expand: false,
      builder: (context, scrollController) {
        return SingleChildScrollView(
          controller: scrollController,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Barre d'en-tête
                Center(
                  child: Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Titre et numéro de tâche
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        task.taskNumber,
                        style: TextStyle(
                          color: Colors.grey[700],
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    TaskStatusChip(status: task.status),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                // Titre de la tâche
                Text(
                  task.title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Description
                const Text(
                  'Description',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  task.description.isEmpty ? 'Aucune description' : task.description,
                  style: TextStyle(
                    color: Colors.grey[800],
                  ),
                ),
                
                const Divider(height: 32),
                
                // Informations supplémentaires
                Row(
                  children: [
                    // Assigné à
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Assigné à',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 4),
                          task.assignedTo != null
                              ? Row(
                                  children: [
                                    CircleAvatar(
                                      radius: 14,
                                      backgroundColor: Colors.indigo.withOpacity(0.2),
                                      child: Text(
                                        task.assignedTo!.initials,
                                        style: const TextStyle(
                                          color: Colors.indigo,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        task.assignedTo!.name,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                )
                              : const Text('Non assigné'),
                        ],
                      ),
                    ),
                    
                    // Priorité
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Priorité',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Container(
                                width: 12,
                                height: 12,
                                decoration: BoxDecoration(
                                  color: _getPriorityColor(task.priority),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(_getPriorityText(task.priority)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 16),
                
                // Dates et autres informations
                Row(
                  children: [
                    // Date d'ouverture
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Créée le',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(task.openedDate.split('T')[0]),
                        ],
                      ),
                    ),
                    
                    // Créée par
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Créée par',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(task.openedBy),
                        ],
                      ),
                    ),
                  ],
                ),
                
                const Divider(height: 32),
                
                // Commentaires et pièces jointes
                Row(
                  children: [
                    if (task.comments > 0) ...[
                      Icon(Icons.comment_outlined, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 8),
                      Text('${task.comments} commentaire(s)'),
                      const SizedBox(width: 16),
                    ],
                    
                    if (task.attachments > 0) ...[
                      Icon(Icons.attach_file, size: 16, color: Colors.grey[600]),
                      const SizedBox(width: 8),
                      Text('${task.attachments} pièce(s) jointe(s)'),
                    ],
                  ],
                ),
                
                const SizedBox(height: 24),
                
                // Actions
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    OutlinedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        onUpdateTask(task);
                      },
                      icon: const Icon(Icons.edit),
                      label: const Text('Modifier'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.indigo,
                      ),
                    ),
                    OutlinedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        onUpdateStatus(task);
                      },
                      icon: const Icon(Icons.sync),
                      label: const Text('Changer statut'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.orange,
                      ),
                    ),
                    OutlinedButton.icon(
                      onPressed: () async {
                        Navigator.pop(context);
                        final confirmed = await _showDeleteConfirmation(context);
                        if (confirmed) {
                          onDeleteTask(task.id);
                        }
                      },
                      icon: const Icon(Icons.delete),
                      label: const Text('Supprimer'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<bool> _showDeleteConfirmation(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Supprimer la tâche'),
            content: const Text(
                'Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Annuler'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Supprimer'),
              ),
            ],
          ),
        ) ??
        false;
  }

  Color _getPriorityColor(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.low:
        return Colors.green;
      case TaskPriority.medium:
        return Colors.orange;
      case TaskPriority.high:
        return Colors.red;
    }
  }

  String _getPriorityText(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.low:
        return 'Basse';
      case TaskPriority.medium:
        return 'Moyenne';
      case TaskPriority.high:
        return 'Haute';
    }
  }
}