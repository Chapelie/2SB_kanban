import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/task.dart';
import '../../models/team_member.dart';
import '../../controllers/task_controller.dart';
import '../../controllers/project_controller.dart';

class UpdateTaskDialog extends StatefulWidget {
  final Task task;

  const UpdateTaskDialog({
    Key? key,
    required this.task,
  }) : super(key: key);

  @override
  State<UpdateTaskDialog> createState() => _UpdateTaskDialogState();
}

class _UpdateTaskDialogState extends State<UpdateTaskDialog> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TaskPriority _selectedPriority;
  TeamMember? _selectedMember;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task.title);
    _descriptionController = TextEditingController(text: widget.task.description);
    _selectedPriority = widget.task.priority;
    _selectedMember = widget.task.assignedTo;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Modifier la tâche'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Titre',
                hintText: 'Titre de la tâche',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
                hintText: 'Description détaillée de la tâche',
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            
            // Priorité
            const Text(
              'Priorité:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                _buildPriorityChip(TaskPriority.low, 'Basse', Colors.green),
                _buildPriorityChip(TaskPriority.medium, 'Moyenne', Colors.orange),
                _buildPriorityChip(TaskPriority.high, 'Haute', Colors.red),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Membre assigné
            const Text(
              'Assigné à:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 8),
            _buildMemberDropdown(),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Annuler'),
        ),
        TextButton(
          onPressed: () {
            if (_titleController.text.isNotEmpty) {
              final updatedTask = Task(
                id: widget.task.id,
                projectId: widget.task.projectId,
                title: _titleController.text,
                description: _descriptionController.text,
                status: widget.task.status,
                priority: _selectedPriority,
                assignedTo: _selectedMember,
                openedBy: widget.task.openedBy,
                openedDate: widget.task.openedDate,
                taskNumber: widget.task.taskNumber,
                comments: widget.task.comments,
                attachments: widget.task.attachments,
              );
              
              context.read<TaskController>().updateTask(updatedTask);
              Navigator.pop(context);
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Le titre ne peut pas être vide')),
              );
            }
          },
          child: const Text('Mettre à jour'),
        ),
      ],
    );
  }

  Widget _buildPriorityChip(TaskPriority priority, String label, Color color) {
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          color: _selectedPriority == priority ? Colors.white : Colors.black87,
          fontSize: 12,
        ),
      ),
      selected: _selectedPriority == priority,
      selectedColor: color,
      backgroundColor: color.withOpacity(0.1),
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _selectedPriority = priority;
          });
        }
      },
    );
  }

  Widget _buildMemberDropdown() {
    return Consumer<ProjectController>(
      builder: (context, projectController, _) {
        final project = projectController.selectedProject;
        if (project == null) {
          return const Text('Aucun projet sélectionné');
        }

        return DropdownButtonFormField<String>(
          value: _selectedMember?.id,
          decoration: const InputDecoration(
            hintText: 'Sélectionner un membre',
            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            border: OutlineInputBorder(),
          ),
          items: [
            const DropdownMenuItem<String>(
              value: null,
              child: Text('Non assigné'),
            ),
            ...project.teamMembers.map((member) {
              return DropdownMenuItem<String>(
                value: member.id,
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 14,
                      backgroundColor: Colors.indigo.withOpacity(0.2),
                      backgroundImage: member.avatar.isNotEmpty
                          ? NetworkImage(member.avatar)
                          : null,
                      child: member.avatar.isEmpty
                          ? Text(
                              member.initials,
                              style: const TextStyle(
                                color: Colors.indigo,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 8),
                    Text(member.name),
                  ],
                ),
              );
            }),
          ],
          onChanged: (String? memberId) {
            setState(() {
              _selectedMember = memberId == null
                  ? null
                  : project.teamMembers.firstWhere((m) => m.id == memberId);
            });
          },
        );
      },
    );
  }
}