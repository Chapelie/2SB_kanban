import 'package:flutter/material.dart';
import '../../models/task.dart';

class TaskStatusChip extends StatelessWidget {
  final TaskStatus status;

  const TaskStatusChip({
    Key? key,
    required this.status,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    String label;
    Color color;
    
    switch (status) {
      case TaskStatus.open:
        label = 'À faire';
        color = Colors.grey;
        break;
      case TaskStatus.inProgress:
        label = 'En cours';
        color = Colors.blue;
        break;
      case TaskStatus.completed:
        label = 'Terminée';
        color = Colors.green;
        break;
      case TaskStatus.canceled:
        label = 'Annulée';
        color = Colors.red;
        break;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5), width: 1),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}