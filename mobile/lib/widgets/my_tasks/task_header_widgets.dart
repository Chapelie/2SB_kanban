import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/task_controller.dart';
import '../../models/task.dart';
import 'task_count_badge.dart';

class TaskSearchField extends StatelessWidget {
  final TextEditingController controller;
  final Function(String) onChanged;

  const TaskSearchField({
    Key? key,
    required this.controller,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Container(
      height: 40,
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800 : Colors.grey.shade100,
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: TextField(
        controller: controller,
        autofocus: true,
        textAlignVertical: TextAlignVertical.center,
        decoration: InputDecoration(
          hintText: 'Rechercher des tâches...',
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 8),
          prefixIcon: Icon(
            Icons.search,
            color: isDark ? Colors.white70 : Colors.grey.shade600,
            size: 20,
          ),
          hintStyle: TextStyle(
            color: isDark ? Colors.white54 : Colors.grey.shade600,
            fontSize: 14,
          ),
        ),
        style: TextStyle(
          fontSize: 14,
          color: isDark ? Colors.white : Colors.black87,
        ),
        onChanged: onChanged,
      ),
    );
  }
}

class TaskHeaderBackground extends StatelessWidget {
  final MediaQueryData mediaQuery;
  final bool isDark;
  final bool hasActiveFilters;
  final bool isSmall;

  const TaskHeaderBackground({
    Key? key,
    required this.mediaQuery,
    required this.isDark,
    required this.hasActiveFilters,
    required this.isSmall,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Stack(
      children: [
        // Arrière-plan avec dégradé subtil
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: isDark
                  ? [
                      Colors.grey.shade800,
                      Colors.grey.shade900,
                    ]
                  : [
                      Colors.white,
                      Colors.grey.shade50,
                    ],
            ),
          ),
        ),
        
        // Motif décoratif (optionnel)
        if (!isSmall)
          Positioned(
            top: -10,
            right: -10,
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
            ),
          ),
        
        // Widget de compteur de tâches
        Positioned(
          right: 16,
          top: isSmall ? mediaQuery.viewPadding.top + 8 : mediaQuery.viewPadding.top + 16,
          child: TasksCountWidget(
            isDark: isDark, 
            isSmall: isSmall,
          ),
        ),
        
        // Indicateur de filtre actif
        if (hasActiveFilters)
          Positioned(
            left: 16,
            top: mediaQuery.viewPadding.top + 8,
            child: _buildActiveFilterIndicator(theme, isDark),
          ),
      ],
    );
  }

  Widget _buildActiveFilterIndicator(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: theme.colorScheme.primary.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.filter_list,
            size: 14,
            color: isDark 
                ? theme.colorScheme.primary.withOpacity(0.8) 
                : theme.colorScheme.primary,
          ),
          const SizedBox(width: 4),
          Text(
            'Filtres actifs',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: isDark 
                  ? theme.colorScheme.primary.withOpacity(0.8) 
                  : theme.colorScheme.primary,
            ),
          ),
        ],
      ),
    );
  }
}

class TasksCountWidget extends StatelessWidget {
  final bool isDark;
  final bool isSmall;

  const TasksCountWidget({
    Key? key,
    required this.isDark,
    required this.isSmall,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Consumer<TaskController>(
      builder: (context, taskController, _) {
        final totalTasks = taskController.tasks.length;
        final openTasks = taskController.tasks.where((t) => t.status == TaskStatus.open).length;
        final inProgressTasks = taskController.tasks.where((t) => t.status == TaskStatus.inProgress).length;
        final completedTasks = taskController.tasks.where((t) => t.status == TaskStatus.completed).length;
        final percentage = totalTasks > 0 ? (completedTasks / totalTasks * 100).round() : 0;
        
        return Container(
          padding: EdgeInsets.symmetric(
            horizontal: isSmall ? 12 : 16, 
            vertical: isSmall ? 10 : 12
          ),
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
              color: isDark 
                  ? Colors.grey.shade800 
                  : Colors.grey.shade200,
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
                            backgroundColor: isDark ? Colors.grey.shade700 : Colors.grey.shade300,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              percentage >= 100 ? Colors.green : theme.colorScheme.primary,
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
                                backgroundColor: isDark ? Colors.grey.shade700 : Colors.grey.shade300,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  percentage >= 100 ? Colors.green : theme.colorScheme.primary,
                                ),
                              ),
                              Center(
                                child: Text(
                                  '$percentage%',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: isDark ? Colors.white70 : Colors.black87,
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
                        color: isDark ? Colors.grey.shade700 : Colors.grey.shade300,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          TaskCountBadge(
                            count: openTasks, 
                            label: 'À faire', 
                            color: Colors.grey.shade600, 
                            icon: Icons.inbox_outlined,
                            isDark: isDark,
                          ),
                          const SizedBox(width: 8),
                          TaskCountBadge(
                            count: inProgressTasks, 
                            label: 'En cours', 
                            color: Colors.blue.shade600, 
                            icon: Icons.pending_actions_outlined,
                            isDark: isDark,
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
        );
      },
    );
  }
}

class TaskEmptyState extends StatelessWidget {
  final VoidCallback onCreateTask;
  final bool isDark;

  const TaskEmptyState({
    Key? key,
    required this.onCreateTask,
    required this.isDark,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: isDark ? Colors.blue.withOpacity(0.1) : Colors.blue.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.assignment_outlined,
                size: 80,
                color: isDark ? Colors.blue.shade200 : Colors.blue.shade400,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Aucune tâche pour le moment',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: Text(
                'Toutes vos tâches assignées apparaîtront ici. Commencez par créer votre première tâche !',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: isDark ? Colors.white70 : Colors.black54,
                ),
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: onCreateTask,
              icon: const Icon(Icons.add),
              label: const Text('Créer une tâche'),
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }
}