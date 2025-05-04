import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
import '../../controllers/project_controller.dart';
import '../../models/task.dart';
import '../../models/team_member.dart';

class AddTaskDialog extends StatefulWidget {
  final String projectId;
  final Task? taskToEdit; // Si on veut modifier une tâche existante

  const AddTaskDialog({
    Key? key,
    required this.projectId,
    this.taskToEdit,
  }) : super(key: key);

  @override
  State<AddTaskDialog> createState() => _AddTaskDialogState();
}

class _AddTaskDialogState extends State<AddTaskDialog> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  DateTime? _dueDate;
  TaskPriority _priority = TaskPriority.medium;
  late TaskStatus _status;
  TeamMember? _assignedTo;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    
    // Si nous éditons une tâche existante, initialiser avec ses valeurs
    if (widget.taskToEdit != null) {
      _titleController = TextEditingController(text: widget.taskToEdit!.title);
      _descriptionController = TextEditingController(text: widget.taskToEdit!.description);
      _status = widget.taskToEdit!.status;
      _priority = widget.taskToEdit!.priority;
      _assignedTo = widget.taskToEdit!.assignedTo;
      
      // Parsing de la date d'ouverture comme date d'échéance
      try {
        final openedDate = DateTime.parse(widget.taskToEdit!.openedDate);
        _dueDate = openedDate.add(const Duration(days: 14)); // Default à 2 semaines après ouverture
      } catch (e) {
        // Ignorer les erreurs de parsing
      }
    } else {
      _titleController = TextEditingController();
      _descriptionController = TextEditingController();
      _status = TaskStatus.open;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _selectDate(BuildContext context) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: _dueDate ?? DateTime.now().add(const Duration(days: 7)),
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Theme.of(context).colorScheme.primary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (pickedDate != null && pickedDate != _dueDate) {
      setState(() {
        _dueDate = pickedDate;
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  void _submitForm() async {
    // Validation
    if (_titleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
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
      final controller = Provider.of<ProjectController>(context, listen: false);
      
      // Génération des valeurs pour les champs requis par Task
      final currentDate = DateTime.now();
      final formattedDate = _formatDate(currentDate);
      final userId = "user_${math.Random().nextInt(1000)}"; // À remplacer par l'ID de l'utilisateur actuel
      final taskNumber = widget.taskToEdit?.taskNumber ?? 
                         'TASK-${math.Random().nextInt(10000).toString().padLeft(4, '0')}';
      
      // Détermination du kanbanStatus basé sur le _status
      String kanbanStatus;
      switch (_status) {
        case TaskStatus.open:
          kanbanStatus = 'backlog';
          break;
        case TaskStatus.inProgress:
          kanbanStatus = 'in-progress';
          break;
        case TaskStatus.completed:
          kanbanStatus = 'completed';
          break;
        default:
          kanbanStatus = 'backlog';
      }
      
      // Création de la tâche avec tous les champs requis
      final task = Task(
        id: widget.taskToEdit?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        taskNumber: taskNumber,
        openedDate: widget.taskToEdit?.openedDate ?? currentDate.toIso8601String(),
        openedBy: widget.taskToEdit?.openedBy ?? userId,
        status: _status,
        priority: _priority,
        projectId: widget.projectId,
        kanbanStatus: kanbanStatus,
        timeSpent: widget.taskToEdit?.timeSpent ?? '00:00:00',
        assignedTo: _assignedTo,
        comments: widget.taskToEdit?.comments ?? 0,
        attachments: widget.taskToEdit?.attachments ?? 0,
      );

      if (widget.taskToEdit != null) {
        // Mise à jour d'une tâche existante
        await controller.updateTask(widget.projectId, task);
      } else {
        // Ajout d'une nouvelle tâche
        await controller.addTask(widget.projectId, task);
      }

      if (mounted) {
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: $e'),
            behavior: SnackBarBehavior.floating,
          ),
        );
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;
    final isVerySmall = mediaQuery.size.width < 400;

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        width: isSmall ? double.maxFinite : 600,
        constraints: BoxConstraints(
          maxWidth: 600,
          maxHeight: mediaQuery.size.height * 0.9,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    widget.taskToEdit != null ? Icons.edit : Icons.add_task,
                    color: Colors.white,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      widget.taskToEdit != null 
                          ? 'Modifier la tâche ${widget.taskToEdit!.taskNumber}' 
                          : 'Ajouter une tâche',
                      style: theme.textTheme.titleLarge?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                    tooltip: 'Fermer',
                  ),
                ],
              ),
            ),
            
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Titre
                    _buildSectionTitle('Titre', theme),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _titleController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'Saisissez le titre de la tâche',
                        filled: true,
                        fillColor: theme.cardColor,
                      ),
                      maxLength: 100,
                    ),
                    const SizedBox(height: 16),
                    
                    // Description
                    _buildSectionTitle('Description', theme),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _descriptionController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'Description détaillée de la tâche',
                        filled: true,
                        fillColor: theme.cardColor,
                        alignLabelWithHint: true,
                      ),
                      maxLines: 4,
                      maxLength: 500,
                    ),
                    const SizedBox(height: 16),
                    
                    // Date d'échéance
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _buildSectionTitle("Date d'échéance", theme),
                              const SizedBox(height: 8),
                              InkWell(
                                onTap: () => _selectDate(context),
                                borderRadius: BorderRadius.circular(12),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: theme.dividerColor),
                                    borderRadius: BorderRadius.circular(12),
                                    color: theme.cardColor,
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(Icons.calendar_today, color: theme.colorScheme.primary),
                                      const SizedBox(width: 12),
                                      Text(
                                        _dueDate != null
                                            ? _formatDate(_dueDate!)
                                            : 'Sélectionner',
                                        style: theme.textTheme.bodyLarge?.copyWith(
                                          color: _dueDate != null 
                                              ? theme.textTheme.bodyLarge?.color 
                                              : theme.hintColor,
                                        ),
                                      ),
                                      const Spacer(),
                                      if (_dueDate != null)
                                        IconButton(
                                          icon: const Icon(Icons.clear),
                                          onPressed: () {
                                            setState(() {
                                              _dueDate = null;
                                            });
                                          },
                                          tooltip: 'Effacer la date',
                                          iconSize: 18,
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        
                        if (!isVerySmall) ...[
                          const SizedBox(width: 16),
                          
                          // Priorité
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildSectionTitle('Priorité', theme),
                                const SizedBox(height: 8),
                                _buildPrioritySelector(theme),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                    
                    if (isVerySmall) ...[
                      const SizedBox(height: 16),
                      
                      // Priorité
                      _buildSectionTitle('Priorité', theme),
                      const SizedBox(height: 8),
                      _buildPrioritySelector(theme),
                    ],
                    
                    const SizedBox(height: 16),
                    
                    // Statut
                    _buildSectionTitle('Statut', theme),
                    const SizedBox(height: 8),
                    _buildStatusSelector(theme, isSmall),
                    
                    const SizedBox(height: 16),
                    
                    // Assignation (version simplifiée)
                    _buildSectionTitle('Assignation', theme),
                    const SizedBox(height: 8),
                    ListTile(
                      onTap: () {
                        // Ici, vous devriez ouvrir un dialogue pour sélectionner un membre
                        // Pour l'instant, c'est juste un placeholder
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Fonction à implémenter'))
                        );
                      },
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: theme.dividerColor),
                      ),
                      leading: _assignedTo != null
                          ? CircleAvatar(
                              backgroundImage: _assignedTo!.avatar.isNotEmpty 
                                  ? NetworkImage(_assignedTo!.avatar) 
                                  : null,
                              child: _assignedTo!.avatar.isEmpty 
                                  ? Text(_assignedTo!.name[0].toUpperCase()) 
                                  : null,
                            )
                          : const CircleAvatar(
                              child: Icon(Icons.person_add),
                            ),
                      title: Text(
                        _assignedTo != null ? _assignedTo!.name : 'Assigner à un membre',
                        style: theme.textTheme.bodyLarge,
                      ),
                      subtitle: _assignedTo != null 
                          ? Text(_assignedTo!.email) 
                          : const Text('Aucun membre assigné'),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    ),
                  ],
                ),
              ),
            ),
            
            const Divider(height: 1),
            
            // Actions
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Annuler'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _isSubmitting ? null : _submitForm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primary,
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(
                        horizontal: 16, 
                        vertical: isVerySmall ? 10 : 12,
                      ),
                      disabledBackgroundColor: theme.disabledColor,
                    ),
                    child: _isSubmitting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(widget.taskToEdit != null ? Icons.save : Icons.add, size: 18),
                              const SizedBox(width: 8),
                              Text(widget.taskToEdit != null ? 'Enregistrer' : 'Ajouter'),
                            ],
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

  Widget _buildSectionTitle(String title, ThemeData theme) {
    return Text(
      title,
      style: theme.textTheme.titleMedium?.copyWith(
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildPrioritySelector(ThemeData theme) {
    final priorities = [
      (TaskPriority.low, 'Faible', Colors.green, Icons.arrow_downward),
      (TaskPriority.medium, 'Moyenne', Colors.orange, Icons.drag_handle),
      (TaskPriority.high, 'Haute', Colors.red, Icons.arrow_upward),
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.dividerColor),
        color: theme.cardColor,
      ),
      child: Row(
        children: priorities.map((p) {
          final (priority, label, color, icon) = p;
          final isSelected = priority == _priority;
          
          return Expanded(
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _priority = priority;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  color: isSelected ? color.withOpacity(0.1) : Colors.transparent,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(icon, color: color, size: 20),
                    const SizedBox(height: 4),
                    Text(
                      label,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: isSelected ? color : theme.hintColor,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildStatusSelector(ThemeData theme, bool isSmall) {
    final statuses = [
      (TaskStatus.open, 'À faire', theme.colorScheme.primary, Icons.check_box_outline_blank),
      (TaskStatus.inProgress, 'En cours', Colors.orange, Icons.hourglass_top),
      (TaskStatus.completed, 'Terminé', Colors.green, Icons.check_box),
    ];
    
    return isSmall
        ? Column(
            children: statuses.map((s) {
              final (status, label, color, icon) = s;
              final isSelected = status == _status;
              
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  onTap: () {
                    setState(() {
                      _status = status;
                    });
                  },
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                    side: BorderSide(
                      color: isSelected ? color : theme.dividerColor,
                      width: isSelected ? 2 : 1,
                    ),
                  ),
                  tileColor: isSelected ? color.withOpacity(0.1) : null,
                  leading: Icon(icon, color: color),
                  title: Text(
                    label,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                  trailing: isSelected
                      ? Icon(Icons.radio_button_checked, color: color)
                      : Icon(Icons.radio_button_unchecked, color: theme.disabledColor),
                ),
              );
            }).toList(),
          )
        : Row(
            children: [
              for (var s in statuses) ...[
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _status = s.$1;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: s.$1 == _status ? s.$3 : theme.dividerColor,
                          width: s.$1 == _status ? 2 : 1,
                        ),
                        color: s.$1 == _status ? s.$3.withOpacity(0.1) : theme.cardColor,
                      ),
                      child: Column(
                        children: [
                          Icon(s.$4, color: s.$3, size: 24),
                          const SizedBox(height: 8),
                          Text(
                            s.$2,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              fontWeight: s.$1 == _status ? FontWeight.bold : FontWeight.normal,
                              color: s.$1 == _status ? s.$3 : theme.textTheme.bodyLarge?.color,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                if (s != statuses.last) const SizedBox(width: 8),
              ],
            ],
          );
  }
}