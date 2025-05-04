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
  bool _isSubmitting = false;

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
    final theme = Theme.of(context);
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;
    final screenWidth = mediaQuery.size.width;

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 5,
      child: Container(
        width: isSmall ? double.infinity : screenWidth * 0.6,
        constraints: BoxConstraints(
          maxWidth: 600,
          maxHeight: mediaQuery.size.height * 0.9,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // En-tête stylisé
            Container(
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  Icon(Icons.edit, color: theme.colorScheme.onPrimary, size: 24),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Modifier la tâche',
                      style: theme.textTheme.titleLarge?.copyWith(
                        color: theme.colorScheme.onPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close, color: theme.colorScheme.onPrimary),
                    onPressed: () => Navigator.of(context).pop(),
                    tooltip: 'Fermer',
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ),
            
            // Contenu avec défilement
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildInfoBadge(widget.task.taskNumber),
                    const SizedBox(height: 16),
                    
                    // Titre avec étiquette flottante
                    TextField(
                      controller: _titleController,
                      style: theme.textTheme.titleMedium,
                      decoration: InputDecoration(
                        labelText: 'Titre',
                        hintText: 'Titre de la tâche',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        prefixIcon: const Icon(Icons.title),
                        filled: true,
                        fillColor: theme.colorScheme.surface,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Description avec étiquette flottante
                    TextField(
                      controller: _descriptionController,
                      style: theme.textTheme.bodyMedium,
                      maxLines: 4,
                      decoration: InputDecoration(
                        labelText: 'Description',
                        hintText: 'Description détaillée de la tâche',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        prefixIcon: const Icon(Icons.description),
                        alignLabelWithHint: true,
                        filled: true,
                        fillColor: theme.colorScheme.surface,
                      ),
                    ),
                    const SizedBox(height: 24),
                    
                    // Section Priorité
                    _buildSectionHeader('Priorité', Icons.flag),
                    const SizedBox(height: 12),
                    _buildPrioritySelector(theme, isSmall),
                    const SizedBox(height: 24),
                    
                    // Section Assignation
                    _buildSectionHeader('Assignation', Icons.person),
                    const SizedBox(height: 12),
                    _buildMemberDropdown(theme),
                  ],
                ),
              ),
            ),
            
            // Séparateur
            const Divider(height: 1),
            
            // Boutons d'action
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.cancel_outlined),
                    label: const Text('Annuler'),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    onPressed: _isSubmitting ? null : _updateTask,
                    icon: _isSubmitting 
                        ? Container(
                            width: 20,
                            height: 20,
                            padding: const EdgeInsets.all(2),
                            child: const CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Icon(Icons.save),
                    label: Text(_isSubmitting ? 'Mise à jour...' : 'Mettre à jour'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primary,
                      foregroundColor: theme.colorScheme.onPrimary,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      elevation: 2,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoBadge(String taskNumber) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.bookmark, size: 16, color: Colors.grey),
          const SizedBox(width: 6),
          Text(
            taskNumber,
            style: const TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.grey,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.grey.shade700),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ],
    );
  }

  Widget _buildPrioritySelector(ThemeData theme, bool isSmall) {
    final priorities = [
      (TaskPriority.low, 'Basse', Colors.green.shade600, Icons.arrow_downward),
      (TaskPriority.medium, 'Moyenne', Colors.orange.shade600, Icons.drag_handle),
      (TaskPriority.high, 'Haute', Colors.red.shade600, Icons.arrow_upward),
    ];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: theme.dividerColor),
      ),
      child: isSmall 
        ? Column(
            children: priorities.map((priority) {
              return _buildPriorityOption(priority.$1, priority.$2, priority.$3, priority.$4);
            }).toList(),
          )
        : Row(
            children: priorities.map((priority) {
              return Expanded(
                child: _buildPriorityOption(priority.$1, priority.$2, priority.$3, priority.$4),
              );
            }).toList(),
          ),
    );
  }

  Widget _buildPriorityOption(TaskPriority priority, String label, Color color, IconData icon) {
    final isSelected = _selectedPriority == priority;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPriority = priority;
        });
      },
      child: Container(
        margin: const EdgeInsets.all(4),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: isSelected ? color.withOpacity(0.15) : Colors.transparent,
          border: Border.all(
            color: isSelected ? color : Colors.transparent,
            width: isSelected ? 1.5 : 0,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? color : Colors.grey.shade600,
              size: 20,
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? color : Colors.grey.shade700,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMemberDropdown(ThemeData theme) {
    return Consumer<ProjectController>(
      builder: (context, projectController, _) {
        final project = projectController.selectedProject;
        if (project == null) {
          return const Text('Aucun projet sélectionné');
        }

        return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: theme.dividerColor),
          ),
          child: DropdownButtonFormField<String>(
            value: _selectedMember?.id,
            decoration: InputDecoration(
              hintText: 'Sélectionner un membre',
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              border: InputBorder.none,
              prefixIcon: const Icon(Icons.person_outline),
            ),
            icon: const Icon(Icons.arrow_drop_down_circle_outlined),
            elevation: 3,
            style: theme.textTheme.bodyLarge,
            isExpanded: true,
            items: [
              const DropdownMenuItem<String>(
                value: null,
                child: Row(
                  children: [
                    Icon(Icons.person_off_outlined, color: Colors.grey, size: 20),
                    SizedBox(width: 10),
                    Text('Non assigné'),
                  ],
                ),
              ),
              ...project.teamMembers.map((member) {
                return DropdownMenuItem<String>(
                  value: member.id,
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: theme.colorScheme.primary.withOpacity(0.2),
                        backgroundImage: member.avatar.isNotEmpty
                            ? NetworkImage(member.avatar)
                            : null,
                        child: member.avatar.isEmpty
                            ? Text(
                                member.initials,
                                style: TextStyle(
                                  color: theme.colorScheme.primary,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              )
                            : null,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          member.name,
                          style: const TextStyle(fontWeight: FontWeight.w500),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
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
          ),
        );
      },
    );
  }
  
  void _updateTask() async {
    if (_titleController.text.isEmpty) {
      // Utiliser un BuildContext qui a accès à un Scaffold
      if (!mounted) return;
      
      // Option 1: Utiliser le contexte de navigateur global
      final scaffoldMessenger = ScaffoldMessenger.of(context);
      scaffoldMessenger.showSnackBar(
        const SnackBar(
          content: Text('Le titre ne peut pas être vide'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }
  
    setState(() {
      _isSubmitting = true;
    });
  
    try {
      final updatedTask = Task(
        id: widget.task.id,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        taskNumber: widget.task.taskNumber,
        openedDate: widget.task.openedDate,
        openedBy: widget.task.openedBy,
        status: widget.task.status,
        timeSpent: widget.task.timeSpent,
        assignedTo: _selectedMember,
        projectId: widget.task.projectId,
        priority: _selectedPriority,
        kanbanStatus: widget.task.kanbanStatus,
        comments: widget.task.comments,
        attachments: widget.task.attachments,
      );
  
      final success = await context.read<TaskController>().updateTask(updatedTask);
      
      if (success && mounted) {
        // Utiliser un navigateur pour retourner le résultat plutôt que d'afficher un snackbar ici
        Navigator.pop(context, true);
      } else if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
        // Informer l'appelant de l'échec
        Navigator.pop(context, false);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
        // Informer l'appelant de l'erreur
        Navigator.pop(context, false);
      }
    }
  }
}