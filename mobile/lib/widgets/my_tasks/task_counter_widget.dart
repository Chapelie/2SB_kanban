import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/task_controller.dart';
import '../../models/task.dart';

class TaskCounterWidget extends StatelessWidget {
  const TaskCounterWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;

    return Consumer<TaskController>(
      builder: (context, taskController, _) {
        final totalTasks = taskController.tasks.length;
        final openTasks = taskController.tasks
            .where((t) => t.status == TaskStatus.open)
            .length;
        final inProgressTasks = taskController.tasks
            .where((t) => t.status == TaskStatus.inProgress)
            .length;
        final completedTasks = taskController.tasks
            .where((t) => t.status == TaskStatus.completed)
            .length;
        final percentage =
            totalTasks > 0 ? (completedTasks / totalTasks * 100).round() : 0;

        return Container(
          padding: EdgeInsets.symmetric(
              horizontal: isSmall ? 12 : 16, vertical: isSmall ? 10 : 12),
          decoration: BoxDecoration(
            color: isDark
                ? theme.cardColor.withOpacity(0.8)
                : theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
            border: Border.all(
              color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
              width: 1,
            ),
          ),
          child: isSmall
              // Version compacte pour petits écrans
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: 36,
                      height: 36,
                      child: Stack(
                        children: [
                          CircularProgressIndicator(
                            value: percentage / 100,
                            strokeWidth: 4,
                            backgroundColor: isDark
                                ? Colors.grey.shade700
                                : Colors.grey.shade300,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              percentage >= 100
                                  ? Colors.green
                                  : theme.colorScheme.primary,
                            ),
                          ),
                          Center(
                            child: Text(
                              '$percentage%',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white70 : Colors.black87,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '$completedTasks/$totalTasks',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.white : Colors.black87,
                        fontSize: 14,
                      ),
                    ),
                  ],
                )
              // Version complète pour grands écrans
              : Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 40,
                          height: 40,
                          child: Stack(
                            children: [
                              CircularProgressIndicator(
                                value: percentage / 100,
                                strokeWidth: 4,
                                backgroundColor: isDark
                                    ? Colors.grey.shade700
                                    : Colors.grey.shade300,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  percentage >= 100
                                      ? Colors.green
                                      : theme.colorScheme.primary,
                                ),
                              ),
                              Center(
                                child: Text(
                                  '$percentage%',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: isDark
                                        ? Colors.white70
                                        : Colors.black87,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '$completedTasks/$totalTasks tâches',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isDark ? Colors.white : Colors.black87,
                              ),
                            ),
                            Text(
                              'terminées',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? Colors.white60 : Colors.black54,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    if (!isSmall) ...[
                      const SizedBox(height: 8),
                      Divider(
                        height: 1,
                        color: isDark
                            ? Colors.grey.shade700
                            : Colors.grey.shade300,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildTaskCountBadge(
                              openTasks,
                              'À faire',
                              Colors.grey.shade600,
                              Icons.inbox_outlined,
                              isDark),
                          const SizedBox(width: 8),
                          _buildTaskCountBadge(
                              inProgressTasks,
                              'En cours',
                              Colors.blue.shade600,
                              Icons.pending_actions_outlined,
                              isDark),
                        ],
                      ),
                    ],
                  ],
                ),
        );
      },
    );
  }

  Widget _buildTaskCountBadge(
      int count, String label, Color color, IconData icon, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 12,
            color: color,
          ),
          const SizedBox(width: 4),
          Text(
            '$count $label',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w500,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}