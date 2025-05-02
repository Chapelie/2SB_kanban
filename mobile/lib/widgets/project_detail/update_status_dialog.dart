import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/task.dart';
import '../../controllers/task_controller.dart';

class UpdateStatusDialog extends StatefulWidget {
  final Task task;

  const UpdateStatusDialog({
    Key? key,
    required this.task,
  }) : super(key: key);

  @override
  State<UpdateStatusDialog> createState() => _UpdateStatusDialogState();
}

class _UpdateStatusDialogState extends State<UpdateStatusDialog> {
  late TaskStatus _selectedStatus;

  @override
  void initState() {
    super.initState();
    _selectedStatus = widget.task.status;
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Changer le statut'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Tâche: ${widget.task.title}'),
          const SizedBox(height: 16),
          
          const Text(
            'Sélectionnez le nouveau statut:',
            style: TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          
          _buildStatusOption(TaskStatus.open, 'À faire', Colors.grey),
          _buildStatusOption(TaskStatus.inProgress, 'En cours', Colors.blue),
          _buildStatusOption(TaskStatus.completed, 'Terminée', Colors.green),
          _buildStatusOption(TaskStatus.canceled, 'Annulée', Colors.red),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Annuler'),
        ),
        TextButton(
          onPressed: () {
            context.read<TaskController>().updateTaskStatus(widget.task.id, _selectedStatus);
            Navigator.pop(context);
          },
          child: const Text('Confirmer'),
        ),
      ],
    );
  }

  Widget _buildStatusOption(TaskStatus status, String label, Color color) {
    return RadioListTile<TaskStatus>(
      title: Row(
        children: [
          Icon(
            status == TaskStatus.open
                ? Icons.inbox_outlined
                : status == TaskStatus.inProgress
                    ? Icons.pending_actions_outlined
                    : status == TaskStatus.completed
                        ? Icons.check_circle_outline
                        : Icons.cancel_outlined,
            color: color,
            size: 20,
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontWeight: _selectedStatus == status
                  ? FontWeight.bold
                  : FontWeight.normal,
            ),
          ),
        ],
      ),
      value: status,
      groupValue: _selectedStatus,
      activeColor: color,
      selected: _selectedStatus == status,
      onChanged: (value) {
        if (value != null) {
          setState(() {
            _selectedStatus = value;
          });
        }
      },
    );
  }
}