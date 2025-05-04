import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/task.dart';
import '../../controllers/task_controller.dart';
import '../../models/team_member.dart';
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
    final theme = Theme.of(context);
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;
    final isDark = theme.brightness == Brightness.dark;

    return DraggableScrollableSheet(
      initialChildSize: isSmall ? 0.8 : 0.6,
      minChildSize: 0.4,
      maxChildSize: 0.95,
      expand: false,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: Column(
            children: [
              // En-tête avec poignée et bouton de fermeture
              Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                child: Column(
                  children: [
                    // Poignée de glissement
                    Center(
                      child: Container(
                        width: 40,
                        height: 5,
                        decoration: BoxDecoration(
                          color: isDark ? Colors.grey[600] : Colors.grey[300],
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Barre supérieure
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.bookmark_outline,
                                color: theme.colorScheme.primary,
                                size: 16,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                task.taskNumber,
                                style: TextStyle(
                                  color: theme.colorScheme.primary,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        TaskStatusChip(status: task.status),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(context),
                          tooltip: 'Fermer',
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Ligne de séparation
              const Divider(height: 1),

              // Contenu avec défilement
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding:
                      const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Titre de la tâche
                      Text(
                        task.title,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      // Priorité et date sous le titre
                      Padding(
                        padding: const EdgeInsets.only(top: 8, bottom: 24),
                        child: Row(
                          children: [
                            _buildPriorityIndicator(task.priority, theme),
                            const SizedBox(width: 16),
                            Icon(
                              Icons.calendar_today_outlined,
                              size: 16,
                              color: theme.hintColor,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              _formatDate(task.openedDate),
                              style: TextStyle(
                                color: theme.hintColor,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Section description
                      _buildSectionCard(
                        title: 'Description',
                        icon: Icons.description_outlined,
                        content: task.description.isEmpty
                            ? _buildEmptyContent(
                                'Aucune description fournie pour cette tâche.')
                            : Text(
                                task.description,
                                style: theme.textTheme.bodyLarge,
                              ),
                        theme: theme,
                        isSmall: isSmall,
                      ),

                      const SizedBox(height: 16),

                      // Section détails - ligne adaptative
                      isSmall
                          ? Column(
                              children: [
                                _buildDetailCard(
                                  title: 'Assigné à',
                                  icon: Icons.person_outline,
                                  content: _buildAssigneeInfo(
                                      task.assignedTo, theme),
                                  theme: theme,
                                ),
                                const SizedBox(height: 16),
                                _buildDetailCard(
                                  title: 'Temps passé',
                                  icon: Icons.timer_outlined,
                                  content: Text(
                                    task.timeSpent == '00:00:00'
                                        ? 'Aucun temps enregistré'
                                        : task.timeSpent,
                                    style: theme.textTheme.bodyLarge,
                                  ),
                                  theme: theme,
                                ),
                              ],
                            )
                          : Row(
                              children: [
                                Expanded(
                                  child: _buildDetailCard(
                                    title: 'Assigné à',
                                    icon: Icons.person_outline,
                                    content: _buildAssigneeInfo(
                                        task.assignedTo, theme),
                                    theme: theme,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: _buildDetailCard(
                                    title: 'Temps passé',
                                    icon: Icons.timer_outlined,
                                    content: Text(
                                      task.timeSpent == '00:00:00'
                                          ? 'Aucun temps enregistré'
                                          : task.timeSpent,
                                      style: theme.textTheme.bodyLarge,
                                    ),
                                    theme: theme,
                                  ),
                                ),
                              ],
                            ),

                      const SizedBox(height: 16),

                      // Section informations - ligne adaptative
                      isSmall
                          ? Column(
                              children: [
                                _buildDetailCard(
                                  title: 'Créée par',
                                  icon: Icons.person_add_outlined,
                                  content: Text(
                                    task.openedBy,
                                    style: theme.textTheme.bodyLarge,
                                  ),
                                  theme: theme,
                                ),
                                const SizedBox(height: 16),
                                _buildDetailCard(
                                  title: 'Statut Kanban',
                                  icon: Icons.dashboard_outlined,
                                  content: _buildKanbanStatus(
                                      task.kanbanStatus, theme),
                                  theme: theme,
                                ),
                              ],
                            )
                          : Row(
                              children: [
                                Expanded(
                                  child: _buildDetailCard(
                                    title: 'Créée par',
                                    icon: Icons.person_add_outlined,
                                    content: Text(
                                      task.openedBy,
                                      style: theme.textTheme.bodyLarge,
                                    ),
                                    theme: theme,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: _buildDetailCard(
                                    title: 'Statut Kanban',
                                    icon: Icons.dashboard_outlined,
                                    content: _buildKanbanStatus(
                                        task.kanbanStatus, theme),
                                    theme: theme,
                                  ),
                                ),
                              ],
                            ),

                      // Activité récente
                      if (task.comments > 0 || task.attachments > 0) ...[
                        const SizedBox(height: 16),
                        _buildSectionCard(
                          title: 'Activité récente',
                          icon: Icons.history_outlined,
                          content: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (task.comments > 0)
                                ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor:
                                        Colors.blue.withOpacity(0.1),
                                    child: Icon(Icons.comment_outlined,
                                        color: Colors.blue, size: 20),
                                  ),
                                  title: Text(
                                      '${task.comments} commentaire${task.comments > 1 ? 's' : ''}'),
                                  dense: true,
                                  contentPadding: EdgeInsets.zero,
                                ),
                              if (task.attachments > 0)
                                ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor:
                                        Colors.teal.withOpacity(0.1),
                                    child: Icon(Icons.attach_file_outlined,
                                        color: Colors.teal, size: 20),
                                  ),
                                  title: Text(
                                      '${task.attachments} pièce${task.attachments > 1 ? 's' : ''} jointe${task.attachments > 1 ? 's' : ''}'),
                                  dense: true,
                                  contentPadding: EdgeInsets.zero,
                                ),
                            ],
                          ),
                          theme: theme,
                          isSmall: isSmall,
                        ),
                      ],
                    ],
                  ),
                ),
              ),

              // Ligne de séparation
              const Divider(height: 1),

              // Barre d'actions en bas
              Container(
                padding: EdgeInsets.symmetric(
                  vertical: 16,
                  horizontal: isSmall ? 8 : 16,
                ),
                child: isSmall
                    ? Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _buildActionButton(
                                  icon: Icons.edit_outlined,
                                  label: 'Modifier',
                                  color: theme.colorScheme.primary,
                                  onPressed: () {
                                    Navigator.pop(context);
                                    onUpdateTask(task);
                                  },
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: _buildActionButton(
                                  icon: Icons.sync_outlined,
                                  label: 'Statut',
                                  color: Colors.orange,
                                  onPressed: () {
                                    Navigator.pop(context);
                                    onUpdateStatus(task);
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          _buildActionButton(
                            icon: Icons.delete_outline,
                            label: 'Supprimer',
                            color: theme.colorScheme.error,
                            onPressed: () async {
                              Navigator.pop(context);
                              final confirmed =
                                  await _showDeleteConfirmation(context);
                              if (confirmed) {
                                onDeleteTask(task.id);
                              }
                            },
                            fullWidth: true,
                          ),
                        ],
                      )
                    : Row(
                        children: [
                          Expanded(
                            child: _buildActionButton(
                              icon: Icons.edit_outlined,
                              label: 'Modifier',
                              color: theme.colorScheme.primary,
                              onPressed: () {
                                Navigator.pop(context);
                                onUpdateTask(task);
                              },
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildActionButton(
                              icon: Icons.sync_outlined,
                              label: 'Changer statut',
                              color: Colors.orange,
                              onPressed: () {
                                Navigator.pop(context);
                                onUpdateStatus(task);
                              },
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildActionButton(
                              icon: Icons.delete_outline,
                              label: 'Supprimer',
                              color: theme.colorScheme.error,
                              onPressed: () async {
                                Navigator.pop(context);
                                final confirmed =
                                    await _showDeleteConfirmation(context);
                                if (confirmed) {
                                  onDeleteTask(task.id);
                                }
                              },
                            ),
                          ),
                        ],
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Widget content,
    required ThemeData theme,
    required bool isSmall,
  }) {
    return Card(
      elevation: 0,
      color: theme.brightness == Brightness.dark
          ? theme.cardColor.withOpacity(0.4)
          : theme.scaffoldBackgroundColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: theme.dividerColor.withOpacity(0.3)),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 18, color: theme.colorScheme.primary),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: isSmall ? 15 : 16,
                    color: theme.colorScheme.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            content,
          ],
        ),
      ),
    );
  }

  Widget _buildDetailCard({
    required String title,
    required IconData icon,
    required Widget content,
    required ThemeData theme,
  }) {
    return Card(
      elevation: 0,
      color: theme.brightness == Brightness.dark
          ? theme.cardColor.withOpacity(0.4)
          : theme.scaffoldBackgroundColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: theme.dividerColor.withOpacity(0.3)),
      ),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 16, color: theme.hintColor),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                    color: theme.hintColor,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            content,
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onPressed,
    bool fullWidth = false,
  }) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 20),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color.withOpacity(0.1),
        foregroundColor: color,
        elevation: 0,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: color.withOpacity(0.3)),
        ),
        minimumSize: fullWidth ? const Size(double.infinity, 46) : null,
      ),
    );
  }

  Widget _buildPriorityIndicator(TaskPriority priority, ThemeData theme) {
    final Color color = _getPriorityColor(priority);
    final String label = _getPriorityText(priority);
    final IconData icon = priority == TaskPriority.high
        ? Icons.arrow_upward
        : priority == TaskPriority.low
            ? Icons.arrow_downward
            : Icons.drag_handle;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssigneeInfo(TeamMember? member, ThemeData theme) {
    if (member == null) {
      return Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: theme.disabledColor.withOpacity(0.1),
            child: Icon(
              Icons.person_off_outlined,
              color: theme.disabledColor,
              size: 16,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            'Non assigné',
            style: TextStyle(
              color: theme.hintColor,
            ),
          ),
        ],
      );
    }

    return Row(
      children: [
        CircleAvatar(
          radius: 16,
          backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
          backgroundImage:
              member.avatar.isNotEmpty ? NetworkImage(member.avatar) : null,
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                member.name,
                style: const TextStyle(
                  fontWeight: FontWeight.w500,
                ),
                overflow: TextOverflow.ellipsis,
              ),
              if (member.email.isNotEmpty)
                Text(
                  member.email,
                  style: TextStyle(
                    fontSize: 12,
                    color: theme.hintColor,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildKanbanStatus(String status, ThemeData theme) {
    IconData icon;
    Color color;
    String label;

    switch (status) {
      case 'backlog':
        icon = Icons.event_note_outlined;
        color = theme.colorScheme.primary;
        label = 'Backlog';
        break;
      case 'in-progress':
        icon = Icons.sync_outlined;
        color = Colors.orange;
        label = 'En cours';
        break;
      case 'completed':
        icon = Icons.check_circle_outline;
        color = Colors.green;
        label = 'Terminée';
        break;
      default:
        icon = Icons.help_outline;
        color = Colors.grey;
        label = 'Non défini';
    }

    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 12),
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyContent(String message) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.grey.withOpacity(0.05),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
      ),
      child: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.info_outline,
              color: Colors.grey.withOpacity(0.5),
              size: 20,
            ),
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                message,
                style: TextStyle(
                  color: Colors.grey.withOpacity(0.7),
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String isoDate) {
    try {
      final dateTime = DateTime.parse(isoDate);
      final day = dateTime.day.toString().padLeft(2, '0');
      final month = dateTime.month.toString().padLeft(2, '0');
      final year = dateTime.year;
      return '$day/$month/$year';
    } catch (e) {
      return isoDate;
    }
  }

  Future<bool> _showDeleteConfirmation(BuildContext context) async {
    final theme = Theme.of(context);

    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: Row(
              children: [
                Icon(Icons.warning_amber_rounded,
                    color: theme.colorScheme.error),
                const SizedBox(width: 10),
                const Text('Supprimer la tâche'),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.',
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                        color: theme.colorScheme.error.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.delete_forever,
                        color: theme.colorScheme.error,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              task.taskNumber,
                              style: TextStyle(
                                color: theme.colorScheme.error,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              task.title,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Annuler'),
              ),
              ElevatedButton.icon(
                onPressed: () => Navigator.pop(context, true),
                icon: const Icon(Icons.delete_forever, size: 18),
                label: const Text('Supprimer'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.error,
                  foregroundColor: theme.colorScheme.onError,
                ),
              ),
            ],
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            actionsPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
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
        return 'Priorité basse';
      case TaskPriority.medium:
        return 'Priorité moyenne';
      case TaskPriority.high:
        return 'Priorité haute';
    }
  }
}
