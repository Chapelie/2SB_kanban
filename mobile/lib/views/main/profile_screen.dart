import 'package:flutter/material.dart';
import 'package:mobile/services/navigation_service.dart';
import 'package:provider/provider.dart';
import '../../controllers/auth_controller.dart';
import '../../controllers/project_controller.dart';
import '../../controllers/task_controller.dart';
import '../../models/user.dart';
import '../../config/app_routes.dart';
import '../../models/project.dart';
import '../../models/task.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();

    // Utiliser un post-frame callback pour éviter les appels pendant le build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadUserData();
    });
  }

  // Modifier la méthode _loadUserData pour être plus sûre
  Future<void> _loadUserData() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Utiliser listen: false pour tous les providers
      final projectController =
          Provider.of<ProjectController>(context, listen: false);
      final taskController =
          Provider.of<TaskController>(context, listen: false);

      // Éviter d'appeler fetchProjects et fetchTasks si les données sont déjà chargées
      final futures = <Future>[];

      if (projectController.projects.isEmpty && !projectController.isLoading) {
        futures.add(projectController.fetchProjects());
      }

      if (taskController.tasks.isEmpty && !taskController.isLoading) {
        futures.add(taskController.fetchTasks());
      }

      if (futures.isNotEmpty) {
        await Future.wait(futures);
      }
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

    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadUserData,
              child:
                  Consumer3<AuthController, ProjectController, TaskController>(
                builder: (context, authController, projectController,
                    taskController, _) {
                  final user = authController.currentUser;

                  if (user == null) {
                    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      Navigator.of(context)
                          .pushReplacementNamed(AppRoutes.login);
                    });
                    return const SizedBox();
                  }

                  return SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 40),
                        // Entête avec avatar et informations utilisateur
                        _buildProfileHeader(user, theme),

                        const SizedBox(height: 24),

                        // Section Statistiques
                        _buildStatisticsSection(
                            context, projectController, taskController),

                        const SizedBox(height: 24),

                        // Section Projets récents
                        _buildRecentProjects(context, projectController),

                        const SizedBox(height: 24),

                        const SizedBox(height: 40),
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }

  Widget _buildProfileHeader(User user, ThemeData theme) {
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.only(bottom: 24.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            theme.colorScheme.primary.withOpacity(0.9),
            theme.colorScheme.primary,
          ],
        ),
        borderRadius: const BorderRadius.all(
          Radius.circular(24),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            offset: const Offset(0, 4),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        children: [
          // Zone supérieure avec avatar et informations principales
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 30, 20, 20),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Avatar avec bouton d'édition
                Stack(
                  children: [
                    Hero(
                      tag: 'user_avatar',
                      child: Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.white,
                            width: 3,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 10,
                              offset: const Offset(0, 5),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(45),
                          child: user.avatar.isNotEmpty
                              ? Image.network(
                                  user.avatar,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, _, __) =>
                                      _buildAvatarFallback(user),
                                )
                              : _buildAvatarFallback(user),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: InkWell(
                        onTap: () => _showEditProfileDialog(context, user),
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 5,
                              ),
                            ],
                          ),
                          child: Icon(
                            Icons.edit,
                            color: theme.colorScheme.primary,
                            size: 18,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(width: 20),

                // Informations utilisateur
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.name,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        user.email,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withOpacity(0.8),
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 8),
                      if (user.location.isNotEmpty)
                        Row(
                          children: [
                            Icon(
                              Icons.location_on,
                              size: 14,
                              color: Colors.white.withOpacity(0.8),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              user.location,
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white.withOpacity(0.8),
                              ),
                            ),
                          ],
                        ),
                      // Badge de rôle supprimé
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Section des statistiques supprimée

          const SizedBox(height: 20),

          // Boutons d'action
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    icon: Icons.edit,
                    label: 'Modifier profil',
                    onTap: () => _showEditProfileDialog(context, user),
                    isPrimary: true,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    icon: Icons.settings,
                    label: 'Paramètres',
                    onTap: () =>
                        Navigator.of(context).pushNamed(AppRoutes.settings),
                    isPrimary: false,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Widget pour l'avatar par défaut
  Widget _buildAvatarFallback(User user) {
    return Container(
      color: Colors.indigo.shade300,
      alignment: Alignment.center,
      child: Text(
        user.initials,
        style: const TextStyle(
          fontSize: 35,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }

  // Widget pour les boutons d'action
  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required bool isPrimary,
  }) {
    return Material(
      color: isPrimary ? Colors.white : Colors.transparent,
      borderRadius: BorderRadius.circular(16), // Augmenté de 12 à 16
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16), // Augmenté de 12 à 16
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16), // Augmenté de 12 à 16
            border: isPrimary ? null : Border.all(color: Colors.white),
          ),
          alignment: Alignment.center,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 18,
                color: isPrimary ? Colors.indigo.shade700 : Colors.white,
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                  color: isPrimary ? Colors.indigo.shade700 : Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Widget pour l'avatar par défaut

  // Widget pour les statistiques rapides
  Widget _buildQuickStats(User user) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildStatItem('Projets', '12'),
        _buildDivider(),
        _buildStatItem('Tâches', '48'),
        _buildDivider(),
        _buildStatItem('Terminées', '32'),
      ],
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.white.withOpacity(0.7),
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 30,
      width: 1,
      color: Colors.white.withOpacity(0.3),
    );
  }

  // Widget pour les boutons d'action
  Widget _buildStatisticsSection(BuildContext context,
      ProjectController projectController, TaskController taskController) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    // Calculer les statistiques à partir des données réelles
    final allProjects = projectController.projects;
    final allTasks = taskController.tasks;

    final projectsCompleted =
        allProjects.where((p) => p.status == ProjectStatus.completed).length;
    final projectsInProgress =
        allProjects.where((p) => p.status == ProjectStatus.ontrack).length;

    final tasksCompleted =
        allTasks.where((t) => t.status == TaskStatus.completed).length;
    final tasksPending = allTasks
        .where((t) =>
            t.status == TaskStatus.open || t.status == TaskStatus.inProgress)
        .length;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Statistiques',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: isDarkMode ? Colors.white : Colors.black87,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  context,
                  'Projets terminés',
                  projectsCompleted.toString(),
                  Colors.green,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildStatCard(
                  context,
                  'Tâches terminées',
                  tasksCompleted.toString(),
                  Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  context,
                  'Projets en cours',
                  projectsInProgress.toString(),
                  Colors.orange,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildStatCard(
                  context,
                  'Tâches en attente',
                  tasksPending.toString(),
                  Colors.purple,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
      BuildContext context, String title, String value, Color color) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    final cardColor = isDarkMode
        ? Color.alphaBlend(
            theme.cardColor.withOpacity(0.2), Colors.grey.shade900)
        : Colors.white;

    final textColor = isDarkMode ? Colors.white : Colors.black87;

    final subtitleColor = isDarkMode ? Colors.grey[400] : Colors.grey[600];

    final shadowColor =
        isDarkMode ? Colors.black38 : Colors.grey.withOpacity(0.1);

    final borderColor = isDarkMode ? Colors.grey.shade800 : Colors.transparent;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(12),
        border: isDarkMode ? Border.all(color: borderColor) : null,
        boxShadow: [
          BoxShadow(
            color: shadowColor,
            spreadRadius: isDarkMode ? 0 : 1,
            blurRadius: 6,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(isDarkMode ? 0.2 : 0.1),
              borderRadius: BorderRadius.circular(8),
              border:
                  isDarkMode ? Border.all(color: color.withOpacity(0.4)) : null,
            ),
            child: Icon(
              _getIconForTitle(title),
              color: color,
              size: 20,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              color: subtitleColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentProjects(
      BuildContext context, ProjectController projectController) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    final NavigationService navigationService = NavigationService();
    final recentProjects = projectController.projects
        .take(3)
        .toList(); // Prendre les 3 premiers projets

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Projets récents',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: isDarkMode ? Colors.white : Colors.black87,
                ),
              ),
              TextButton(
                onPressed: () {
                  navigationService.navigateToTab(1);
                },
                child: Text(
                  'Voir tous',
                  style: TextStyle(
                    color: theme.primaryColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 160,
            child: recentProjects.isEmpty
                ? Center(
                    child: Text(
                      'Aucun projet récent',
                      style: TextStyle(
                        color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                        fontSize: 16,
                      ),
                    ),
                  )
                : ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: recentProjects.length,
                    itemBuilder: (context, index) {
                      final project = recentProjects[index];
                      return _buildProjectCard(project);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectCard(Project project) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    // Couleurs adaptées au mode sombre
    final cardColor = isDarkMode
        ? Color.alphaBlend(
            theme.cardColor.withOpacity(0.2), Colors.grey.shade900)
        : Colors.white;

    final textColor = isDarkMode ? Colors.white : Colors.black87;
    final subtitleColor = isDarkMode ? Colors.grey[400] : Colors.grey[600];
    final shadowColor =
        isDarkMode ? Colors.black38 : Colors.grey.withOpacity(0.1);
    final borderColor = isDarkMode ? Colors.grey.shade800 : Colors.transparent;

    // Simuler une progression en fonction du statut
    String progress;
    Color color;
    double progressValue;

    switch (project.status) {
      case ProjectStatus.offtrack:
        progress = '30%';
        progressValue = 0.3;
        color = Colors.red;
        break;
      case ProjectStatus.ontrack:
        progress = '60%';
        progressValue = 0.6;
        color = Colors.blue;
        break;
      case ProjectStatus.completed:
        progress = '100%';
        progressValue = 1.0;
        color = Colors.green;
        break;
    }

    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(
          context,
          AppRoutes.projectDetail,
          arguments: project.id,
        );
      },
      child: Container(
        width: isSmallScreen ? size.width * 0.75 : 200,
        height: 160, // Hauteur fixe pour toute la carte
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(12),
          border: isDarkMode ? Border.all(color: borderColor) : null,
          boxShadow: [
            BoxShadow(
              color: shadowColor,
              spreadRadius: isDarkMode ? 0 : 1,
              blurRadius: 6,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          // Utilisation d'un IntrinsicHeight pour garantir que les enfants ont la hauteur appropriée
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // En-tête avec icône et pourcentage - hauteur fixe
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: color.withOpacity(isDarkMode ? 0.2 : 0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: isDarkMode
                          ? Border.all(color: color.withOpacity(0.4))
                          : null,
                    ),
                    child: Icon(
                      Icons.folder,
                      color: color,
                      size: 20,
                    ),
                  ),
                  Text(
                    progress,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // Titre - hauteur fixe
              Text(
                project.title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: textColor,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 6),

              // Description avec hauteur contrainte
              Expanded(
                child: Text(
                  project.description,
                  style: TextStyle(
                    fontSize: 12,
                    color: subtitleColor,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),

              // Barre de progression en bas avec marge au-dessus
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: progressValue,
                  backgroundColor:
                      Colors.grey.withOpacity(isDarkMode ? 0.3 : 0.2),
                  valueColor: AlwaysStoppedAnimation<Color>(color),
                  minHeight: 8,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showTaskDetails(BuildContext context, Task task, String projectName) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.5,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) {
          return SingleChildScrollView(
            controller: scrollController,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Barre d'en-tête
                  Center(
                    child: Container(
                      width: 40,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Numéro et état de la tâche
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        task.taskNumber,
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      _buildStatusChip(task.status),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Titre de la tâche
                  Text(
                    task.title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Description
                  const Text(
                    'Description',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    task.description.isEmpty
                        ? 'Aucune description'
                        : task.description,
                    style: TextStyle(
                      color: Colors.grey[800],
                    ),
                  ),

                  const Divider(height: 32),

                  // Projet
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Projet',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(projectName),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Priorité',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: _getPriorityColor(task.priority),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(_getPriorityText(task.priority)),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Autres informations
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Statut',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(_getStatusText(task.status)),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Ouverte depuis',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text('${task.openedDaysAgo} jours'),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Assignée à
                  const Text(
                    'Assigné à',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 4),
                  task.assignedTo != null
                      ? Row(
                          children: [
                            CircleAvatar(
                              radius: 16,
                              backgroundColor: Colors.indigo.withOpacity(0.2),
                              child: Text(
                                task.assignedTo!.initials,
                                style: const TextStyle(
                                  color: Colors.indigo,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(task.assignedTo!.name),
                          ],
                        )
                      : const Text('Non assigné'),

                  const SizedBox(height: 32),

                  // Bouton pour ouvrir les détails complets
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(
                        context,
                        AppRoutes.projectDetail,
                        arguments: task.projectId,
                      );
                    },
                    icon: const Icon(Icons.visibility),
                    label: const Text('Voir dans le projet'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _showEditProfileDialog(BuildContext context, User user) {
    final nameController = TextEditingController(text: user.name);
    final locationController = TextEditingController(text: user.location);
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Modifier le profil'),
        content: Form(
          key: formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Nom complet',
                    prefixIcon: Icon(Icons.person),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez entrer votre nom';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: locationController,
                  decoration: const InputDecoration(
                    labelText: 'Emplacement',
                    prefixIcon: Icon(Icons.location_on),
                  ),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: () {
                    _showChangePasswordDialog(context);
                  },
                  icon: const Icon(Icons.lock_outline),
                  label: const Text('Changer le mot de passe'),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                  ),
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          Consumer<AuthController>(
            builder: (context, authController, _) {
              return ElevatedButton(
                onPressed: authController.isLoading
                    ? null
                    : () async {
                        if (formKey.currentState!.validate()) {
                          final success = await authController.updateProfile(
                            name: nameController.text.trim(),
                            location: locationController.text.trim(),
                          );

                          if (context.mounted) {
                            Navigator.pop(context);

                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  success
                                      ? 'Profil mis à jour avec succès'
                                      : 'Erreur lors de la mise à jour du profil: ${authController.error}',
                                ),
                                backgroundColor:
                                    success ? Colors.green : Colors.red,
                              ),
                            );
                          }
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo,
                  foregroundColor: Colors.white,
                ),
                child: authController.isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text('Enregistrer'),
              );
            },
          ),
        ],
      ),
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();
    final formKey = GlobalKey<FormState>();
    bool obscureCurrentPassword = true;
    bool obscureNewPassword = true;
    bool obscureConfirmPassword = true;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            title: const Text('Changer le mot de passe'),
            content: Form(
              key: formKey,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextFormField(
                      controller: currentPasswordController,
                      decoration: InputDecoration(
                        labelText: 'Mot de passe actuel',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          icon: Icon(
                            obscureCurrentPassword
                                ? Icons.visibility_off
                                : Icons.visibility,
                          ),
                          onPressed: () {
                            setState(() {
                              obscureCurrentPassword = !obscureCurrentPassword;
                            });
                          },
                        ),
                      ),
                      obscureText: obscureCurrentPassword,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veuillez entrer votre mot de passe actuel';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: newPasswordController,
                      decoration: InputDecoration(
                        labelText: 'Nouveau mot de passe',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          icon: Icon(
                            obscureNewPassword
                                ? Icons.visibility_off
                                : Icons.visibility,
                          ),
                          onPressed: () {
                            setState(() {
                              obscureNewPassword = !obscureNewPassword;
                            });
                          },
                        ),
                      ),
                      obscureText: obscureNewPassword,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veuillez entrer un nouveau mot de passe';
                        }
                        if (value.length < 6) {
                          return 'Le mot de passe doit contenir au moins 6 caractères';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: confirmPasswordController,
                      decoration: InputDecoration(
                        labelText: 'Confirmer le mot de passe',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          icon: Icon(
                            obscureConfirmPassword
                                ? Icons.visibility_off
                                : Icons.visibility,
                          ),
                          onPressed: () {
                            setState(() {
                              obscureConfirmPassword = !obscureConfirmPassword;
                            });
                          },
                        ),
                      ),
                      obscureText: obscureConfirmPassword,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veuillez confirmer votre nouveau mot de passe';
                        }
                        if (value != newPasswordController.text) {
                          return 'Les mots de passe ne correspondent pas';
                        }
                        return null;
                      },
                    ),
                  ],
                ),
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Annuler'),
              ),
              Consumer<AuthController>(
                builder: (context, authController, _) {
                  return ElevatedButton(
                    onPressed: authController.isLoading
                        ? null
                        : () async {
                            if (formKey.currentState!.validate()) {
                              final success =
                                  await authController.changePassword(
                                currentPasswordController.text,
                                newPasswordController.text,
                              );

                              if (context.mounted) {
                                Navigator.pop(context);

                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      success
                                          ? 'Mot de passe changé avec succès'
                                          : 'Erreur: ${authController.error}',
                                    ),
                                    backgroundColor:
                                        success ? Colors.green : Colors.red,
                                  ),
                                );
                              }
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      foregroundColor: Colors.white,
                    ),
                    child: authController.isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Text('Enregistrer'),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStatusChip(TaskStatus status) {
    String label;
    Color color;

    switch (status) {
      case TaskStatus.open:
        label = 'À faire';
        color = Colors.grey;
        break;
      case TaskStatus.inProgress:
        label = 'En cours';
        color = Colors.blue;
        break;
      case TaskStatus.completed:
        label = 'Terminée';
        color = Colors.green;
        break;
      case TaskStatus.canceled:
        label = 'Annulée';
        color = Colors.red;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5), width: 1),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  String _getStatusText(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return 'À faire';
      case TaskStatus.inProgress:
        return 'En cours';
      case TaskStatus.completed:
        return 'Terminée';
      case TaskStatus.canceled:
        return 'Annulée';
    }
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
        return 'Basse';
      case TaskPriority.medium:
        return 'Moyenne';
      case TaskPriority.high:
        return 'Haute';
    }
  }

  IconData _getIconForTitle(String title) {
    switch (title) {
      case 'Projets terminés':
        return Icons.check_circle;
      case 'Tâches terminées':
        return Icons.task_alt;
      case 'Projets en cours':
        return Icons.work;
      case 'Tâches en attente':
        return Icons.pending_actions;
      default:
        return Icons.data_usage;
    }
  }
}
