import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/project_controller.dart';
import '../../models/task.dart';

class TaskFilterDialog extends StatefulWidget {
  final TaskPriority? initialPriority;
  final String? initialProject;
  final Function(TaskPriority?, String?) onApplyFilters;

  const TaskFilterDialog({
    Key? key,
    this.initialPriority,
    this.initialProject,
    required this.onApplyFilters,
  }) : super(key: key);

  @override
  State<TaskFilterDialog> createState() => _TaskFilterDialogState();
}

class _TaskFilterDialogState extends State<TaskFilterDialog> {
  late TaskPriority? _tempPriority;
  late String? _tempProject;

  @override
  void initState() {
    super.initState();
    _tempPriority = widget.initialPriority;
    _tempProject = widget.initialProject;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    // Liste des projets
    final projectController = Provider.of<ProjectController>(context, listen: false);
    final projects = projectController.projects;
    
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.5,
      maxChildSize: 0.9,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: isDark ? Colors.grey.shade800 : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 10,
                offset: const Offset(0, -2),
              ),
            ],
          ),
          child: Column(
            children: [
              // Barre de titre
              Container(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                ),
                child: Column(
                  children: [
                    // Poignée
                    Center(
                      child: Container(
                        width: 40,
                        height: 5,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Row(
                      children: [
                        Icon(Icons.filter_list, color: Colors.white, size: 24),
                        SizedBox(width: 12),
                        Text(
                          'Filtrer les tâches',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Contenu avec défilement
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  children: [
                    // Section priorité
                    _buildFilterSectionTitle('Priorité', Icons.flag_outlined),
                    
                    const SizedBox(height: 8),
                    
                    // Options de priorité
                    Row(
                      children: [
                        Expanded(
                          child: _buildPriorityFilterOption(
                            'Basse',
                            TaskPriority.low,
                            Colors.green,
                            _tempPriority,
                            (priority) => setState(() => _tempPriority = priority),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildPriorityFilterOption(
                            'Moyenne',
                            TaskPriority.medium,
                            Colors.orange,
                            _tempPriority,
                            (priority) => setState(() => _tempPriority = priority),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildPriorityFilterOption(
                            'Haute',
                            TaskPriority.high,
                            Colors.red,
                            _tempPriority,
                            (priority) => setState(() => _tempPriority = priority),
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Section projets
                    _buildFilterSectionTitle('Projet', Icons.folder_outlined),
                    
                    const SizedBox(height: 12),
                    
                    // Options de projet
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 2),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.grey.shade800 : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          _buildProjectFilterOption(
                            'Tous les projets',
                            null,
                            _tempProject,
                            theme.colorScheme.primary,
                            (projectId) => setState(() => _tempProject = projectId),
                          ),
                          for (var project in projects)
                            _buildProjectFilterOption(
                              project.title,
                              project.id,
                              _tempProject,
                              theme.colorScheme.secondary,
                              (projectId) => setState(() => _tempProject = projectId),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              
              // Boutons d'action
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark ? Colors.grey.shade800 : Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 4,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          setState(() {
                            _tempPriority = null;
                            _tempProject = null;
                          });
                        },
                        icon: const Icon(Icons.clear_all, size: 18),
                        label: const Text('Réinitialiser'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          side: BorderSide(color: theme.colorScheme.primary),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          widget.onApplyFilters(_tempPriority, _tempProject);
                        },
                        icon: const Icon(Icons.check, size: 18),
                        label: const Text('Appliquer'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          backgroundColor: theme.colorScheme.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
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

  Widget _buildFilterSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.grey),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildPriorityFilterOption(
    String label, 
    TaskPriority priority, 
    Color color, 
    TaskPriority? selectedPriority,
    Function(TaskPriority?) onSelect,
  ) {
    final isSelected = selectedPriority == priority;
    
    return GestureDetector(
      onTap: () {
        onSelect(isSelected ? null : priority);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? color : Colors.grey.withOpacity(0.3),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(
              priority == TaskPriority.high
                  ? Icons.arrow_upward
                  : priority == TaskPriority.low
                      ? Icons.arrow_downward
                      : Icons.drag_handle,
              color: isSelected ? color : Colors.grey,
              size: 20,
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? color : Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectFilterOption(
    String label, 
    String? projectId, 
    String? selectedProjectId,
    Color color,
    Function(String?) onSelect,
  ) {
    final isSelected = selectedProjectId == projectId;
    
    return InkWell(
      onTap: () {
        onSelect(isSelected ? null : projectId);
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
        child: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: color.withOpacity(0.1),
              child: Icon(
                Icons.folder_outlined,
                color: color,
                size: 16,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ),
            if (isSelected)
              Icon(
                Icons.check_circle,
                color: color,
              ),
          ],
        ),
      ),
    );
  }
}