import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/task.dart';
import '../../controllers/auth_controller.dart';
import '../../controllers/task_controller.dart';

class AddTaskDialog extends StatefulWidget {
  final String projectId;

  const AddTaskDialog({
    Key? key,
    required this.projectId,
  }) : super(key: key);

  @override
  State<AddTaskDialog> createState() => _AddTaskDialogState();
}

class _AddTaskDialogState extends State<AddTaskDialog> {
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  TaskPriority selectedPriority = TaskPriority.medium;

  @override
  void dispose() {
    titleController.dispose();
    descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Nouvelle tâche'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titleController,
              decoration: const InputDecoration(
                labelText: 'Titre',
                hintText: 'ex: Implémenter la fonctionnalité X',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
                hintText: 'Décrivez la tâche en détail...',
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            
            // Priorité
            const Text('Priorité:'),
            Row(
              children: [
                Radio<TaskPriority>(
                  value: TaskPriority.low,
                  groupValue: selectedPriority,
                  onChanged: (value) {
                    setState(() {
                      selectedPriority = value!;
                    });
                  },
                ),
                const Text('Basse'),
                Radio<TaskPriority>(
                  value: TaskPriority.medium,
                  groupValue: selectedPriority,
                  onChanged: (value) {
                    setState(() {
                      selectedPriority = value!;
                    });
                  },
                ),
                const Text('Moyenne'),
                Radio<TaskPriority>(
                  value: TaskPriority.high,
                  groupValue: selectedPriority,
                  onChanged: (value) {
                    setState(() {
                      selectedPriority = value!;
                    });
                  },
                ),
                const Text('Haute'),
              ],
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Annuler'),
        ),
        Consumer<AuthController>(
          builder: (context, authController, _) {
            return TextButton(
              onPressed: () async {
                if (titleController.text.isNotEmpty) {
                  final user = authController.currentUser;
                  await context.read<TaskController>().createTask(
                        projectId: widget.projectId,
                        title: titleController.text,
                        description: descriptionController.text,
                        priority: selectedPriority,
                        openedBy: user?.name ?? 'Utilisateur',
                      );
                  if (context.mounted) {
                    Navigator.pop(context);
                  }
                }
              },
              child: const Text('Créer'),
            );
          },
        ),
      ],
    );
  }
}