import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/auth_controller.dart';
import '../../controllers/project_controller.dart';
import '../../models/project.dart';
import '../../config/app_routes.dart';
import '../../widgets/project_detail/ProjectCard.dart';
import '../../config/themes.dart';

class ProjectListScreen extends StatefulWidget {
  const ProjectListScreen({Key? key}) : super(key: key);

  @override
  State<ProjectListScreen> createState() => _ProjectListScreenState();
}

class _ProjectListScreenState extends State<ProjectListScreen>
    with SingleTickerProviderStateMixin {
  String _searchQuery = '';
  ProjectListFilter? _selectedFilter;

  // Utilisation de AnimationController non-nullable
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  bool _isAnimationReady = false;

  @override
  void initState() {
    super.initState();

    // Animation pour le chargement des projets
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );

    // Marquer l'animation comme prête à être utilisée
    setState(() {
      _isAnimationReady = true;
    });

    // Charger les projets au démarrage
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        context.read<ProjectController>().fetchProjects();
        _animationController.forward();
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkTheme = theme.brightness == Brightness.dark;

    // Obtenir les couleurs du thème actuel
    final backgroundColor = theme.scaffoldBackgroundColor;
    final cardColor = isDarkTheme ? AppTheme.darkCardBg : AppTheme.lightCardBg;
    final accentColor = theme.colorScheme.primary;
    final textColor = theme.textTheme.bodyLarge?.color;
    final secondaryTextColor = theme.textTheme.bodyMedium?.color;

    return Scaffold(
      body: SafeArea(
        child: Consumer<ProjectController>(
          builder: (context, projectController, child) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // En-tête personnalisé
                _buildCustomHeader(context, theme),

                // Barre de recherche et filtres
                _buildSearchAndFilters(context, theme),

                // Contenu principal
                Expanded(
                  child: _buildMainContent(projectController, theme),
                ),
              ],
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: 'fab_unique_tag_4',
        onPressed: () => _showAddProjectDialog(context),
        backgroundColor: accentColor,
        foregroundColor: Colors.white,
        elevation: 4,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildCustomHeader(BuildContext context, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mes Projets',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w900,
                  fontSize: 28,
                ),
              ),
              const SizedBox(height: 4),
              Consumer<ProjectController>(
                builder: (context, projectController, _) {
                  final projectCount = projectController.projects.length;
                  return Text(
                    '$projectCount projet${projectCount > 1 ? 's' : ''} disponible${projectCount > 1 ? 's' : ''}',
                    style: theme.textTheme.bodyMedium,
                  );
                },
              ),
            ],
          ),
          Consumer<AuthController>(
            builder: (context, authController, _) {
              return GestureDetector(
                onTap: () {
                  // Naviguer vers le profil utilisateur ou afficher un menu
                  // Navigator.pushNamed(context, AppRoutes.profile);
                },
                child: Stack(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.2),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: theme.colorScheme.primary,
                          width: 2,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          (authController.currentUser?.name.isNotEmpty ?? false)
                              ? authController.currentUser!.name[0]
                                  .toUpperCase()
                              : '?',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        width: 14,
                        height: 14,
                        decoration: BoxDecoration(
                          color: Colors.green,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: theme.scaffoldBackgroundColor,
                            width: 2,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSearchAndFilters(BuildContext context, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      child: Column(
        children: [
          // Barre de recherche améliorée
          Container(
            height: 56,
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Rechercher des projets...',
                prefixIcon: Icon(
                  Icons.search_rounded,
                  color: theme.hintColor,
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
                hintStyle: TextStyle(
                  color: theme.hintColor,
                  fontSize: 15,
                ),
              ),
              style: TextStyle(
                color: theme.textTheme.bodyLarge?.color,
                fontSize: 15,
              ),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),

          // Filtres rapides (chips)
          const SizedBox(height: 16),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip(
                  context: context,
                  label: 'Tous',
                  icon: Icons.all_inclusive,
                  isSelected: _selectedFilter == null,
                  onSelected: (_) {
                    setState(() {
                      _selectedFilter = null;
                    });
                  },
                ),
                _buildFilterChip(
                  context: context,
                  label: 'En cours',
                  icon: Icons.play_circle_outline,
                  isSelected: _selectedFilter == ProjectListFilter.inProgress,
                  color: Colors.blue,
                  onSelected: (_) {
                    setState(() {
                      _selectedFilter = ProjectListFilter.inProgress;
                    });
                  },
                ),
                _buildFilterChip(
                  context: context,
                  label: 'Terminés',
                  icon: Icons.check_circle_outline,
                  isSelected: _selectedFilter == ProjectListFilter.completed,
                  color: Colors.green,
                  onSelected: (_) {
                    setState(() {
                      _selectedFilter = ProjectListFilter.completed;
                    });
                  },
                ),
                _buildFilterChip(
                  context: context,
                  label: 'En retard',
                  icon: Icons.error_outline,
                  isSelected: _selectedFilter == ProjectListFilter.late,
                  color: Colors.red,
                  onSelected: (_) {
                    setState(() {
                      _selectedFilter = ProjectListFilter.late;
                    });
                  },
                ),
                _buildFilterChip(
                  context: context,
                  label: 'Favoris',
                  icon: Icons.star,
                  isSelected: _selectedFilter == ProjectListFilter.favorite,
                  color: Colors.amber,
                  onSelected: (_) {
                    setState(() {
                      _selectedFilter = ProjectListFilter.favorite;
                    });
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip({
    required BuildContext context,
    required String label,
    required IconData icon,
    required bool isSelected,
    Color? color,
    required void Function(bool) onSelected,
  }) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: FilterChip(
        label: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected
                  ? Colors.white
                  : color ?? theme.colorScheme.primary,
            ),
            const SizedBox(width: 6),
            Text(label),
          ],
        ),
        selected: isSelected,
        showCheckmark: false,
        backgroundColor: theme.cardTheme.color,
        selectedColor: color ?? theme.colorScheme.primary,
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : theme.textTheme.bodyMedium?.color,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        elevation: 0,
        pressElevation: 2,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected
                ? Colors.transparent
                : theme.dividerTheme.color ?? Colors.transparent,
          ),
        ),
        onSelected: onSelected,
      ),
    );
  }

  Widget _buildMainContent(
      ProjectController projectController, ThemeData theme) {
    if (projectController.isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (projectController.error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Erreur: ${projectController.error}',
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                projectController.fetchProjects();
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Réessayer'),
              style: ElevatedButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),
          ],
        ),
      );
    }

    if (projectController.projects.isEmpty) {
      // Utilisation d'AnimatedOpacity au lieu de FadeTransition pour éviter les problèmes d'animation
      return AnimatedOpacity(
        opacity: _isAnimationReady ? 1.0 : 0.0,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeIn,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.folder_open,
                size: 80,
                color: theme.colorScheme.primary.withOpacity(0.3),
              ),
              const SizedBox(height: 24),
              Text(
                'Aucun projet trouvé',
                style: theme.textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Text(
                  'Créez votre premier projet en appuyant sur le bouton +',
                  style: theme.textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: () {
                  _showAddProjectDialog(context);
                },
                icon: const Icon(Icons.add),
                label: const Text('Créer un projet'),
                style: ElevatedButton.styleFrom(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Filtrer les projets selon la recherche et le filtre sélectionné
    List<Project> filteredProjects = projectController.projects;

    // Filtre textuel
    if (_searchQuery.isNotEmpty) {
      filteredProjects = filteredProjects.where((project) {
        return project.title
                .toLowerCase()
                .contains(_searchQuery.toLowerCase()) ||
            project.description
                .toLowerCase()
                .contains(_searchQuery.toLowerCase());
      }).toList();
    }

    // Filtre par statut
    if (_selectedFilter != null) {
      filteredProjects = filteredProjects.where((project) {
        switch (_selectedFilter) {
          case ProjectListFilter.inProgress:
            return project.status == ProjectStatus.ontrack;
          case ProjectListFilter.completed:
            return project.status == ProjectStatus.completed;
          case ProjectListFilter.late:
            return project.status == ProjectStatus.offtrack ||
                (project.daysRemaining < 0 &&
                    project.status != ProjectStatus.completed);
          case ProjectListFilter.favorite:
            return project.isFavorite;
          default:
            return true;
        }
      }).toList();
    }

    if (filteredProjects.isEmpty) {
      // Utilisation d'AnimatedOpacity ici aussi
      return AnimatedOpacity(
        opacity: _isAnimationReady ? 1.0 : 0.0,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeIn,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                _selectedFilter == null
                    ? Icons.search_off
                    : Icons.filter_alt_off,
                size: 64,
                color: theme.colorScheme.primary.withOpacity(0.3),
              ),
              const SizedBox(height: 16),
              Text(
                'Aucun projet ne correspond à votre recherche',
                style: theme.textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
              if (_selectedFilter != null) ...[
                const SizedBox(height: 24),
                OutlinedButton.icon(
                  onPressed: () {
                    setState(() {
                      _selectedFilter = null;
                    });
                  },
                  icon: const Icon(Icons.filter_alt_off),
                  label: const Text('Effacer le filtre'),
                ),
              ],
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => projectController.fetchProjects(),
      // Utilisation d'AnimatedOpacity ici aussi pour la liste de projets
      child: AnimatedOpacity(
        opacity: _isAnimationReady ? 1.0 : 0.0,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeIn,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GridView.builder(
            physics: const AlwaysScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.85,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: filteredProjects.length,
            itemBuilder: (context, index) {
              final project = filteredProjects[index];
              return ProjectCard(
                project: project,
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    AppRoutes.projectDetail,
                    arguments: project.id,
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }

  void _showAddProjectDialog(BuildContext context) {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    final dueDateController = TextEditingController();
    final formKey = GlobalKey<FormState>();
    final theme = Theme.of(context);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Row(
          children: [
            Icon(Icons.create_new_folder, color: theme.colorScheme.primary),
            const SizedBox(width: 12),
            const Text('Nouveau projet'),
          ],
        ),
        content: Form(
          key: formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: titleController,
                  decoration: InputDecoration(
                    labelText: 'Titre',
                    prefixIcon: const Icon(Icons.title),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veuillez entrer un titre';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: descriptionController,
                  decoration: InputDecoration(
                    labelText: 'Description',
                    prefixIcon: const Icon(Icons.description),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: dueDateController,
                  decoration: InputDecoration(
                    labelText: 'Date d\'échéance (optionnel)',
                    prefixIcon: const Icon(Icons.calendar_today),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  readOnly: true,
                  onTap: () async {
                    final DateTime? picked = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now().add(const Duration(days: 7)),
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null) {
                      dueDateController.text =
                          "${picked.day}/${picked.month}/${picked.year}";
                    }
                  },
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Annuler',
                style: TextStyle(color: theme.colorScheme.secondary)),
          ),
          Consumer<AuthController>(
            builder: (context, authController, _) {
              return ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  foregroundColor: Colors.white,
                ),
                onPressed: () async {
                  if (formKey.currentState!.validate()) {
                    final userId = authController.currentUser?.id;
                    if (userId != null) {
                      final project =
                          await context.read<ProjectController>().createProject(
                                title: titleController.text,
                                description: descriptionController.text,
                                ownerId: userId,
                                dueDate: dueDateController.text,
                              );

                      if (context.mounted && project != null) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text('Projet créé avec succès'),
                            backgroundColor: Colors.green,
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            margin: const EdgeInsets.all(16),
                          ),
                        );
                      }
                    }
                  }
                },
                icon: const Icon(Icons.add),
                label: const Text('Créer'),
              );
            },
          ),
        ],
      ),
    );
  }
}

enum ProjectListFilter {
  inProgress,
  completed,
  late,
  favorite,
}
