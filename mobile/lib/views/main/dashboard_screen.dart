import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/auth_controller.dart';
import '../../controllers/project_controller.dart';
import '../../controllers/task_controller.dart';
import '../../models/project.dart';
import '../../models/task.dart';
import '../../config/app_routes.dart';
import '../../services/navigation_service.dart';
import '../../widgets/dashboard_widgets/project_card.dart';
import '../../widgets/dashboard_widgets/task_item.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = false;
  String _selectedFilter = 'Cette semaine';
  final NavigationService _navigationService = NavigationService();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshData();
    });
  }

  Future<void> _refreshData() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Pour une implémentation réelle
      final projectController =
          Provider.of<ProjectController>(context, listen: false);
      final taskController =
          Provider.of<TaskController>(context, listen: false);

      await Future.wait([
        projectController.fetchProjects(),
        taskController.fetchTasks(),
      ]);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Consumer3<AuthController, ProjectController, TaskController>(
      builder: (context, authController, projectController, taskController, _) {
        final user = authController.currentUser;
        final projects = projectController.projects;
        final tasks = taskController.tasks;

        // Calculs pour les métriques du tableau de bord
        final completedTasks =
            tasks.where((t) => t.status == TaskStatus.completed).length;
        final openTasks =
            tasks.where((t) => t.status == TaskStatus.open).length;
        final inProgressTasks =
            tasks.where((t) => t.status == TaskStatus.inProgress).length;
        final totalTasks = tasks.length;

        // Projets récents (triés par date)
        final recentProjects = projects.take(2).toList();

        // Tâches urgentes ou prioritaires
        final priorityTasks = tasks
            .where((task) =>
                task.status != TaskStatus.completed &&
                task.priority == TaskPriority.high)
            .take(3)
            .toList();

        return Scaffold(
          backgroundColor:
              isDark ? theme.colorScheme.background : theme.colorScheme.surface,
          body: RefreshIndicator(
            onRefresh: _refreshData,
            color: theme.colorScheme.primary,
            child: Stack(
              children: [
                SizedBox(
                  height: MediaQuery.of(context).size.height,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: SafeArea(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // En-tête du tableau de bord
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Tableau de bord',
                                        style: TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      if (user != null)
                                        Padding(
                                          padding:
                                              const EdgeInsets.only(top: 4),
                                          child: Text(
                                            'Bonjour, ${user.name.split(' ').first}',
                                            style: TextStyle(
                                              fontSize: 16,
                                              color: isDark
                                                  ? Colors.grey[400]
                                                  : Colors.grey[600],
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                                _buildFilterDropdown(),
                              ],
                            ),
                          ),

                          // Cartes de statistiques
                          _buildStatCards(context, openTasks, inProgressTasks,
                              completedTasks, totalTasks),

                          const SizedBox(height: 24),

                          // Section projets récents
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Projets récents',
                                  style:
                                      Theme.of(context).textTheme.titleMedium,
                                ),
                                TextButton.icon(
                                  onPressed: () =>
                                      _navigationService.navigateToTab(1),
                                  icon: const Icon(Icons.visibility, size: 18),
                                  label: const Text('Voir tous'),
                                  style: TextButton.styleFrom(
                                    foregroundColor: theme.colorScheme.primary,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 8,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 8),

                          if (recentProjects.isEmpty)
                            _buildEmptyState(
                              'Aucun projet',
                              'Créez votre premier projet pour commencer',
                              Icons.folder_outlined,
                              () => _navigationService.navigateToTab(1),
                            )
                          else
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 16),
                              child: Column(
                                children: recentProjects
                                    .map((project) => Padding(
                                          padding:
                                              const EdgeInsets.only(bottom: 16),
                                          child: ProjectCard(project: project),
                                        ))
                                    .toList(),
                              ),
                            ),

                          const SizedBox(height: 24),

                          // Section tâches prioritaires
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Tâches prioritaires',
                                  style:
                                      Theme.of(context).textTheme.titleMedium,
                                ),
                                TextButton.icon(
                                  onPressed: () =>
                                      _navigationService.navigateToTab(2),
                                  icon: const Icon(Icons.visibility, size: 18),
                                  label: const Text('Voir toutes'),
                                  style: TextButton.styleFrom(
                                    foregroundColor: theme.colorScheme.primary,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 8,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 8),

                          if (priorityTasks.isEmpty)
                            _buildEmptyState(
                              'Aucune tâche prioritaire',
                              'Vous êtes à jour !',
                              Icons.task_alt,
                              () => _navigationService.navigateToTab(2),
                            )
                          else
                            Container(
                              margin:
                                  const EdgeInsets.symmetric(horizontal: 16),
                              decoration: BoxDecoration(
                                color: isDark ? theme.cardColor : Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    spreadRadius: 0,
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Column(
                                children:
                                    priorityTasks.asMap().entries.map((entry) {
                                  final index = entry.key;
                                  final task = entry.value;

                                  return Column(
                                    children: [
                                      TaskItem(
                                        title: task.title,
                                        project: projectController
                                                .getProjectById(task.projectId)
                                                ?.title ??
                                            '',
                                        dueDate: 'Tâche #${task.taskNumber}',
                                        priority: task.priority,
                                      ),
                                      if (index < priorityTasks.length - 1)
                                        Divider(
                                            height: 1,
                                            color: isDark
                                                ? Colors.grey[800]
                                                : Colors.grey[200]),
                                    ],
                                  );
                                }).toList(),
                              ),
                            ),

                          // Espace en bas pour éviter que le contenu soit coupé par la bottom bar
                          const SizedBox(height: 80),
                        ],
                      ),
                    ),
                  ),
                ),

                // Indicateur de chargement
                if (_isLoading)
                  Container(
                    width: double.infinity,
                    height: double.infinity,
                    color: Colors.black.withOpacity(0.1),
                    child: Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(
                            theme.colorScheme.primary),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  // Widget pour afficher les cartes de statistiques
  Widget _buildStatCards(BuildContext context, int openTasks,
      int inProgressTasks, int completedTasks, int totalTasks) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      height: 100,
      margin: const EdgeInsets.only(top: 16),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 8),
        children: [
          _buildStatCard(
            context: context,
            title: 'À faire',
            value: openTasks,
            icon: Icons.inbox_outlined,
            color: Colors.purple, // Plus coloré que gris
          ),
          _buildStatCard(
            context: context,
            title: 'En cours',
            value: inProgressTasks,
            icon: Icons.pending_actions_outlined,
            color: Colors.orange, // Orange pour "en cours" est plus intuitif
          ),
          _buildStatCard(
            context: context,
            title: 'Terminées',
            value: completedTasks,
            icon: Icons.task_alt_outlined,
            color: Colors.green.shade600, // Vert plus soutenu
          ),
          _buildStatCard(
            context: context,
            title: 'Total',
            value: totalTasks,
            icon: Icons.assessment_outlined,
            color: theme.colorScheme.primary
                .withOpacity(0.85), // Un peu plus subtil
          ),
        ],
      ),
    );
  }

  // Widget pour une carte de statistique individuelle
  Widget _buildStatCard({
    required BuildContext context,
    required String title,
    required int value,
    required IconData icon,
    required Color color,
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      width: 140,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        // Fond coloré avec opacité pour une meilleure lisibilité
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color.withOpacity(isDark ? 0.2 : 0.1),
            color.withOpacity(isDark ? 0.1 : 0.05),
          ],
        ),
        border: Border.all(color: color.withOpacity(0.3), width: 1.5),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            spreadRadius: 0,
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(
            value.toString(),
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.grey[300] : Colors.grey[700],
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  // État vide pour les sections sans données
  Widget _buildEmptyState(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onActionPressed,
  ) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final emptyStateColor = title.contains('projet')
        ? Colors.blue.shade700
        : Colors.purple.shade700;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? Colors.grey.shade800.withOpacity(0.5) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: emptyStateColor.withOpacity(isDark ? 0.3 : 0.2),
          width: 1.5,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: emptyStateColor.withOpacity(isDark ? 0.2 : 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              size: 36,
              color: emptyStateColor.withOpacity(isDark ? 0.8 : 1.0),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.grey[300] : Colors.grey[800],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 14,
              color: isDark ? Colors.grey[400] : Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: onActionPressed,
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Créer'),
            style: ElevatedButton.styleFrom(
              backgroundColor: emptyStateColor,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Widget pour le menu déroulant des filtres
  Widget _buildFilterDropdown() {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final dropdownColor = theme.colorScheme.primary;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: dropdownColor.withOpacity(isDark ? 0.2 : 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: dropdownColor.withOpacity(isDark ? 0.3 : 0.3),
          width: 1,
        ),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedFilter,
          icon: Icon(
            Icons.keyboard_arrow_down,
            size: 18,
            color: dropdownColor,
          ),
          elevation: 2,
          isDense: true,
          style: TextStyle(
            color: dropdownColor,
            fontWeight: FontWeight.w500,
            fontSize: 14,
          ),
          onChanged: (String? newValue) {
            if (newValue != null) {
              setState(() {
                _selectedFilter = newValue;
              });
            }
          },
          items: ['Cette semaine', 'Ce mois', 'Cette année', 'Globale']
              .map<DropdownMenuItem<String>>((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
        ),
      ),
    );
  }
}
