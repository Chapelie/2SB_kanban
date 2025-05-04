import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../models/task.dart';
import '../../models/team_member.dart';

class TaskCardWidget extends StatelessWidget {
  final Task task;
  final Color statusColor;
  final String projectName;
  final Function(Task) onTap;

  const TaskCardWidget({
    Key? key,
    required this.task,
    required this.statusColor,
    required this.projectName,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;

    // Couleurs adaptées au thème sombre
    final cardColor = isDark
        ? Color.alphaBlend(
            theme.cardColor.withOpacity(0.2), Colors.grey.shade900)
        : Colors.white;

    final shadowColor =
        isDark ? Colors.black.withOpacity(0.2) : Colors.black.withOpacity(0.05);

    final borderColor =
        isDark ? statusColor.withOpacity(0.5) : statusColor.withOpacity(0.3);

    final textColor = isDark ? Colors.white.withOpacity(0.9) : Colors.black87;

    final secondaryTextColor =
        isDark ? Colors.white.withOpacity(0.7) : Colors.grey[700];

    final tertiaryTextColor =
        isDark ? Colors.white.withOpacity(0.5) : Colors.grey[600];

    return GestureDetector(
      onTap: () {
        onTap(task);
        HapticFeedback.selectionClick();
      },
      child: Container(
        margin: const EdgeInsets.fromLTRB(12, 4, 12, 12),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: shadowColor,
              blurRadius: isDark ? 4 : 3,
              offset: const Offset(0, 1),
              spreadRadius: isDark ? 1 : 0,
            ),
          ],
          border: Border.all(
            color: borderColor,
            width: isDark ? 1.5 : 1,
          ),
        ),
        child: Stack(
          children: [
            // Contenu principal
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // En-tête avec numéro et statut
                Container(
                  padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
                  decoration: BoxDecoration(
                    color: isDark
                        ? statusColor.withOpacity(0.2)
                        : statusColor.withOpacity(0.08),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(9),
                      topRight: Radius.circular(9),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          _buildPriorityDot(task.priority),
                          const SizedBox(width: 8),
                          Text(
                            task.taskNumber,
                            style: TextStyle(
                              color: secondaryTextColor,
                              fontWeight: FontWeight.w500,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                      _buildStatusChip(task.status, isDark),
                    ],
                  ),
                ),

                // Corps de la carte
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Titre et avatar
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              task.title,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (task.assignedTo != null) ...[
                            const SizedBox(width: 12),
                            _buildAvatar(task.assignedTo!, theme, isDark),
                          ],
                        ],
                      ),

                      // Description (si présente)
                      if (task.description.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        Text(
                          task.description,
                          style: TextStyle(
                            color: secondaryTextColor,
                            fontSize: 14,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],

                      const SizedBox(height: 16),

                      // Badge de projet et métadonnées
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(
                            child:
                                _buildProjectBadge(projectName, theme, isDark),
                          ),
                          Flexible(
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // Date
                                Icon(
                                  Icons.access_time,
                                  size: 14,
                                  color: tertiaryTextColor,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  _getTimeAgo(task.openedDate),
                                  style: TextStyle(
                                    color: tertiaryTextColor,
                                    fontSize: 12,
                                  ),
                                ),

                                // Commentaires et pièces jointes
                                if ((task.comments > 0 ||
                                        task.attachments > 0) &&
                                    !isSmall) ...[
                                  const SizedBox(width: 12),
                                  if (task.comments > 0) ...[
                                    Icon(
                                      Icons.comment_outlined,
                                      size: 14,
                                      color: tertiaryTextColor,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${task.comments}',
                                      style: TextStyle(
                                        color: tertiaryTextColor,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                  if (task.attachments > 0) ...[
                                    const SizedBox(width: 8),
                                    Icon(
                                      Icons.attach_file,
                                      size: 14,
                                      color: tertiaryTextColor,
                                    ),
                                    const SizedBox(width: 2),
                                    Text(
                                      '${task.attachments}',
                                      style: TextStyle(
                                        color: tertiaryTextColor,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Indicateur de tâche glissable (style Kanban)
            Positioned(
              top: 0,
              right: 0,
              child: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(isDark ? 0.9 : 0.8),
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(9),
                    bottomLeft: Radius.circular(9),
                  ),
                ),
                child: const Icon(
                  Icons.drag_indicator,
                  color: Colors.white,
                  size: 14,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvatar(TeamMember member, ThemeData theme, bool isDark) {
    final bgColor = isDark
        ? theme.colorScheme.primary.withOpacity(0.4)
        : theme.colorScheme.primary.withOpacity(0.2);

    final textColor = isDark ? Colors.white : theme.colorScheme.primary;

    return CircleAvatar(
      radius: 18,
      backgroundColor: bgColor,
      backgroundImage:
          member.avatar.isNotEmpty ? NetworkImage(member.avatar) : null,
      child: member.avatar.isEmpty
          ? Text(
              member.initials,
              style: TextStyle(
                color: textColor,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            )
          : null,
    );
  }

  Widget _buildPriorityDot(TaskPriority priority) {
    Color color;
    String tooltip;

    switch (priority) {
      case TaskPriority.high:
        color = Colors.red;
        tooltip = 'Haute priorité';
        break;
      case TaskPriority.medium:
        color = Colors.orange;
        tooltip = 'Priorité moyenne';
        break;
      case TaskPriority.low:
        color = Colors.green;
        tooltip = 'Priorité basse';
        break;
    }

    return Tooltip(
      message: tooltip,
      child: Container(
        width: 12,
        height: 12,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  Widget _buildStatusChip(TaskStatus status, bool isDark) {
    String label;
    Color color;
    IconData icon;

    switch (status) {
      case TaskStatus.open:
        label = 'À faire';
        color = Colors.grey;
        icon = Icons.inbox_outlined;
        break;
      case TaskStatus.inProgress:
        label = 'En cours';
        color = Colors.blue;
        icon = Icons.pending_actions_outlined;
        break;
      case TaskStatus.completed:
        label = 'Terminée';
        color = Colors.green;
        icon = Icons.task_alt_outlined;
        break;
      case TaskStatus.canceled:
        label = 'Annulée';
        color = Colors.red;
        icon = Icons.cancel_outlined;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(isDark ? 0.2 : 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(isDark ? 0.7 : 0.5),
          width: isDark ? 1.5 : 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: isDark ? color.withOpacity(0.9) : color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: isDark ? color.withOpacity(0.9) : color,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectBadge(String projectName, ThemeData theme, bool isDark) {
    final primaryColor = isDark
        ? theme.colorScheme.primary.withOpacity(0.8)
        : theme.colorScheme.primary;

    final bgColor = isDark
        ? theme.colorScheme.primary.withOpacity(0.2)
        : theme.colorScheme.primary.withOpacity(0.1);

    final borderColor = isDark
        ? theme.colorScheme.primary.withOpacity(0.5)
        : theme.colorScheme.primary.withOpacity(0.3);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: borderColor,
          width: isDark ? 1.5 : 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.folder_outlined,
            size: 14,
            color: primaryColor,
          ),
          const SizedBox(width: 4),
          Flexible(
            child: Text(
              projectName,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: primaryColor,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  String _getTimeAgo(String isoDate) {
    try {
      final date = DateTime.parse(isoDate);
      final now = DateTime.now();
      final difference = now.difference(date);

      if (difference.inDays > 0) {
        return 'Il y a ${difference.inDays} j';
      } else if (difference.inHours > 0) {
        return 'Il y a ${difference.inHours} h';
      } else {
        return 'Il y a ${difference.inMinutes} min';
      }
    } catch (e) {
      return 'Date inconnue';
    }
  }
}
