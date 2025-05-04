import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/project_controller.dart';
import '../../models/task.dart';
import 'task_card_widget.dart';
import 'empty_state_widget.dart';

class KanbanColumnWidget extends StatelessWidget {
  final List<Task> tasks;
  final Color color;
  final String title;
  final TaskStatus status;
  final Function(Task) onTaskTap;
  final List<IconData> tabIcons;

  const KanbanColumnWidget({
    Key? key,
    required this.tasks,
    required this.color,
    required this.title,
    required this.status,
    required this.onTaskTap,
    required this.tabIcons,
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
                      tabIcons[_statusToIndex(status)],
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
          
          // Corps de la colonne
          if (tasks.isEmpty)
            Expanded(child: EmptyStateWidget(status: status, color: color))
          else
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.only(top: 12, bottom: 16),
                itemCount: tasks.length,
                itemBuilder: (context, index) {
                  final task = tasks[index];
                  final projectController = Provider.of<ProjectController>(context, listen: false);
                  final project = projectController.getProjectById(task.projectId);
                  final projectName = project?.title ?? 'Projet inconnu';
                  
                  return TaskCardWidget(
                    task: task,
                    statusColor: color,
                    projectName: projectName,
                    onTap: onTaskTap,
                  );
                },
              ),
            ),
        ],
      ),
    );
  }

  int _statusToIndex(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return 0;
      case TaskStatus.inProgress:
        return 1;
      case TaskStatus.completed:
        return 2;
      default:
        return 0;
    }
  }
}