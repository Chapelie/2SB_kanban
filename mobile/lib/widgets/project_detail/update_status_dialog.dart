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
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _selectedStatus = widget.task.status;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 5,
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
                Icon(Icons.update, color: theme.colorScheme.onPrimary, size: 24),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Changer le statut',
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
          
          // Badge de tâche
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: _buildTaskBadge(theme),
          ),
          
          // Contenu
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Sélectionnez le nouveau statut:',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 12),
                
                Card(
                  margin: EdgeInsets.zero,
                  elevation: 0,
                  color: theme.cardColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                    side: BorderSide(color: theme.dividerColor.withOpacity(0.5)),
                  ),
                  child: Column(
                    children: [
                      _buildStatusOption(TaskStatus.open, 'À faire', Colors.grey.shade700, Icons.inbox_outlined, theme),
                      const Divider(height: 1, indent: 54),
                      _buildStatusOption(TaskStatus.inProgress, 'En cours', Colors.blue.shade600, Icons.pending_actions_outlined, theme),
                      const Divider(height: 1, indent: 54),
                      _buildStatusOption(TaskStatus.completed, 'Terminée', Colors.green.shade600, Icons.check_circle_outline, theme),
                      const Divider(height: 1, indent: 54),
                      _buildStatusOption(TaskStatus.canceled, 'Annulée', Colors.red.shade600, Icons.cancel_outlined, theme),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          // Séparateur
          const Divider(height: 1),
          
          // Boutons d'action
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.cancel_outlined, size: 18),
                  label: const Text('Annuler'),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton.icon(
                  onPressed: _isSubmitting ? null : _updateStatus,
                  icon: _isSubmitting 
                      ? Container(
                          width: 18,
                          height: 18,
                          padding: const EdgeInsets.all(2),
                          child: const CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Icon(Icons.check_circle_outline, size: 18),
                  label: Text(_isSubmitting ? 'Mise à jour...' : 'Confirmer'),
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
    );
  }

  Widget _buildTaskBadge(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: theme.dividerColor.withOpacity(0.5)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
            child: Icon(Icons.task_alt, color: theme.colorScheme.primary, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.task.title,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  widget.task.taskNumber,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.primary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusOption(TaskStatus status, String label, Color color, IconData icon, ThemeData theme) {
    return Material(
      color: _selectedStatus == status ? color.withOpacity(0.1) : theme.cardColor,
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedStatus = status;
          });
        },
        borderRadius: BorderRadius.circular(4),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Icon(
                icon,
                color: color,
                size: 22,
              ),
              const SizedBox(width: 16),
              Text(
                label,
                style: TextStyle(
                  color: _selectedStatus == status ? color : theme.textTheme.bodyLarge?.color,
                  fontWeight: _selectedStatus == status ? FontWeight.bold : FontWeight.normal,
                  fontSize: 15,
                ),
              ),
              const Spacer(),
              if (_selectedStatus == status)
                Icon(
                  Icons.check_circle,
                  color: color,
                  size: 22,
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _updateStatus() async {
    setState(() {
      _isSubmitting = true;
    });

    try {
      final success = await context.read<TaskController>().updateTaskStatus(widget.task.id, _selectedStatus);
      
      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 12),
                Text('Statut modifié en "$_getStatusLabel(_selectedStatus)"'),
              ],
            ),
            backgroundColor: Colors.green,
            behavior: SnackBarBehavior.floating,
          ),
        );
        Navigator.pop(context, true);
      } else if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Échec de la mise à jour du statut'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: $e'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  String _getStatusLabel(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return 'À faire';
      case TaskStatus.inProgress:
        return 'En cours';
      case TaskStatus.completed:
        return 'Terminée';
      case TaskStatus.canceled:
        return 'Annulée';
      default:
        return '';
    }
  }
}