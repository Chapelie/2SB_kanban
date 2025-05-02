import 'package:flutter/material.dart';
import '../../models/task.dart';
import '../../config/app_routes.dart';

class TaskItem extends StatelessWidget {
  final String title;
  final String project;
  final String dueDate;
  final TaskPriority priority;
  
  const TaskItem({
    Key? key,
    required this.title,
    required this.project,
    required this.dueDate,
    required this.priority,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Couleur de priorité
    final Color priorityColor;
    final String priorityText;
    
    switch (priority) {
      case TaskPriority.high:
        priorityColor = Colors.red;
        priorityText = 'Haute';
        break;
      case TaskPriority.medium:
        priorityColor = Colors.orange;
        priorityText = 'Moyenne';
        break;
      case TaskPriority.low:
        priorityColor = Colors.green;
        priorityText = 'Basse';
        break;
    }
    
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      title: Text(
        title,
        style: const TextStyle(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Padding(
        padding: const EdgeInsets.only(top: 4),
        child: Row(
          children: [
            Flexible(
              child: Text(
                project,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const Text(' • '),
            Text(
              dueDate,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: priorityColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          priorityText,
          style: TextStyle(
            color: priorityColor,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      onTap: () {
        // Rediriger vers la page des tâches
        Navigator.pushNamed(context, AppRoutes.home, arguments: {'initialTab': 1});
      },
    );
  }
}