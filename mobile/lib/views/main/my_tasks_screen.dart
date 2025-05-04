import 'package:flutter/material.dart';
import 'package:mobile/controllers/project_controller.dart';
import 'package:provider/provider.dart';
import 'package:flutter/services.dart';
import '../../controllers/auth_controller.dart';
import '../../controllers/task_controller.dart';
import '../../models/task.dart';
import '../../widgets/project_detail/update_task_dialog.dart';
import '../../widgets/project_detail/update_status_dialog.dart';
import '../../widgets/project_detail/task_detail_sheet.dart';
import '../../widgets/my_tasks/task_filter_dialog.dart';
import '../../widgets/my_tasks/task_status_column.dart';
import '../../widgets/my_tasks/task_header_widgets.dart';

class MyTasksScreen extends StatefulWidget {
  const MyTasksScreen({Key? key}) : super(key: key);

  @override
  State<MyTasksScreen> createState() => _MyTasksScreenState();
}

class _MyTasksScreenState extends State<MyTasksScreen>
    with SingleTickerProviderStateMixin {
  // ====== CONTROLLERS & STATE VARIABLES ======
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  // ====== UI STATE ======
  bool _isLoading = false;
  bool _isScrolled = false;
  bool _isSearchOpen = false;

  // ====== FILTER STATE ======
  String _searchQuery = '';
  String? _filterProject;
  TaskPriority? _filterPriority;

  // ====== UI CONSTANTS ======
  final List<Color> _tabColors = [
    Colors.grey.shade700,
    Colors.blue.shade600,
    Colors.green.shade600
  ];
  final List<IconData> _tabIcons = [
    Icons.inbox_outlined,
    Icons.pending_actions_outlined,
    Icons.task_alt_outlined
  ];

  @override
  void initState() {
    super.initState();
    _initializeControllers();
    _loadInitialData();
  }

  void _initializeControllers() {
    _tabController = TabController(length: 3, vsync: this);
    _scrollController.addListener(_handleScroll);
  }

  void _loadInitialData() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshTasks();
    });
  }

  void _handleScroll() {
    setState(() {
      _isScrolled = _scrollController.offset > 10;
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  // ====== DATA METHODS ======
  Future<void> _refreshTasks() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final taskController = context.read<TaskController>();
      await taskController.fetchTasks();
    } catch (e) {
      _showErrorSnackBar('Erreur: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  // Méthode pour créer la tâche dans le contrôleur
  Future<void> _createTask({
    required String title,
    required String description,
    required String projectId,
    required TaskPriority priority,
  }) async {
    final taskController = Provider.of<TaskController>(context, listen: false);
    final authController = Provider.of<AuthController>(context, listen: false);

    // Afficher un indicateur de chargement
    setState(() {
      _isLoading = true;
    });

    try {
      // Récupérer l'utilisateur courant
      final currentUser = authController.currentUser;
      String openedBy = currentUser?.name ?? 'Utilisateur';

      // Créer la tâche
      final task = await taskController.createTask(
        title: title,
        description: description,
        projectId: projectId,
        priority: priority,
        openedBy: openedBy,
      );

      if (mounted) {
        if (task != null) {
          _showSuccessSnackBar('Tâche créée avec succès !');
        } else {
          _showErrorSnackBar('Erreur lors de la création de la tâche');
        }
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('Erreur: $e');
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  List<Task> _filterTasks(List<Task> tasks) {
    return tasks.where((task) {
      // Filtre de recherche
      final matchesSearch = _searchQuery.isEmpty ||
          task.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          task.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          task.taskNumber.toLowerCase().contains(_searchQuery.toLowerCase());

      // Filtre de projet
      final matchesProject =
          _filterProject == null || task.projectId == _filterProject;

      // Filtre de priorité
      final matchesPriority =
          _filterPriority == null || task.priority == _filterPriority;

      return matchesSearch && matchesProject && matchesPriority;
    }).toList();
  }

  // ====== UI HANDLING METHODS ======
  void _toggleSearchMode({bool open = true}) {
    setState(() {
      _isSearchOpen = open;
      if (!open) {
        _searchQuery = '';
        _searchController.clear();
      }
    });
  }

  void _clearSearch() {
    _searchController.clear();
    setState(() {
      _searchQuery = '';
    });
  }

  // ====== DIALOG METHODS ======
  void _showFilterDialog() async {
    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TaskFilterDialog(
        initialPriority: _filterPriority,
        initialProject: _filterProject,
        onApplyFilters: (priority, projectId) {
          setState(() {
            _filterPriority = priority;
            _filterProject = projectId;
          });
        },
      ),
    );

    if (result != null) {
      setState(() {
        _filterPriority = result['priority'];
        _filterProject = result['projectId'];
      });
    }
  }

  void _showAddTaskDialog() async {
    // Récupérer la liste des projets pour le sélecteur
    final projectController =
        Provider.of<ProjectController>(context, listen: false);
    if (projectController.projects.isEmpty) {
      await projectController.fetchProjects();
    }

    if (!mounted) return;

    // Préparer les controllers et variables pour le formulaire
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    String? selectedProjectId = _filterProject ??
        (projectController.projects.isNotEmpty
            ? projectController.projects[0].id
            : null);
    TaskPriority selectedPriority = TaskPriority.medium;

    // Afficher le dialogue
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(builder: (context, setState) {
        return AlertDialog(
          title: Row(
            children: [
              Icon(Icons.add_task,
                  color: Theme.of(context).colorScheme.primary),
              const SizedBox(width: 12),
              const Text('Nouvelle tâche'),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Champ titre
                TextField(
                  controller: titleController,
                  decoration: const InputDecoration(
                    labelText: 'Titre*',
                    hintText: 'Entrez un titre pour la tâche',
                    border: OutlineInputBorder(),
                  ),
                  maxLength: 100,
                ),
                const SizedBox(height: 16),

                // Champ description
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description',
                    hintText: 'Détaillez la tâche à accomplir',
                    border: OutlineInputBorder(),
                    alignLabelWithHint: true,
                  ),
                  maxLines: 3,
                  maxLength: 500,
                ),
                const SizedBox(height: 16),

                // Sélecteur de projet
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'Projet*',
                    border: OutlineInputBorder(),
                  ),
                  value: selectedProjectId,
                  items: projectController.projects.map((project) {
                    return DropdownMenuItem<String>(
                      value: project.id,
                      child: Text(project.title),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedProjectId = value;
                    });
                  },
                ),
                const SizedBox(height: 16),

                // Sélecteur de priorité
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Priorité',
                        style: TextStyle(fontSize: 14, color: Colors.grey)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        _buildPriorityButton(
                            context,
                            'Basse',
                            TaskPriority.low,
                            selectedPriority,
                            Colors.green,
                            setState,
                            (priority) => selectedPriority = priority),
                        const SizedBox(width: 8),
                        _buildPriorityButton(
                            context,
                            'Moyenne',
                            TaskPriority.medium,
                            selectedPriority,
                            Colors.orange,
                            setState,
                            (priority) => selectedPriority = priority),
                        const SizedBox(width: 8),
                        _buildPriorityButton(
                            context,
                            'Haute',
                            TaskPriority.high,
                            selectedPriority,
                            Colors.red,
                            setState,
                            (priority) => selectedPriority = priority),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Annuler'),
            ),
            ElevatedButton.icon(
              onPressed: () {
                // Valider le formulaire
                if (titleController.text.trim().isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Le titre est obligatoire'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }

                if (selectedProjectId == null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Veuillez sélectionner un projet'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }

                Navigator.pop(context, true);
              },
              icon: const Icon(Icons.add),
              label: const Text('Créer'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
              ),
            ),
          ],
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          actionsPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        );
      }),
    );

    // Si l'utilisateur a validé le formulaire, créer la tâche
    if (result == true) {
      await _createTask(
        title: titleController.text.trim(),
        description: descriptionController.text.trim(),
        projectId: selectedProjectId!,
        priority: selectedPriority,
      );
    }

    // Libérer les ressources
    titleController.dispose();
    descriptionController.dispose();
  }

  // Méthode auxiliaire pour créer les boutons de priorité
  Widget _buildPriorityButton(
    BuildContext context,
    String label,
    TaskPriority priority,
    TaskPriority selectedPriority,
    Color color,
    StateSetter setState,
    Function(TaskPriority) onSelected,
  ) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final isSelected = priority == selectedPriority;

    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            onSelected(priority);
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected
                ? color.withOpacity(isDark ? 0.3 : 0.2)
                : isDark
                    ? Colors.grey.shade800
                    : Colors.grey.shade200,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected
                  ? color
                  : isDark
                      ? Colors.grey.shade700
                      : Colors.grey.shade300,
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: color,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: isSelected
                      ? isDark
                          ? color.withOpacity(0.9)
                          : color
                      : null,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showTaskDetailSheet(Task task) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TaskDetailSheet(
        task: task,
        onUpdateTask: (task) {
          Navigator.pop(context);
          _showUpdateTaskDialog(context, task);
        },
        onUpdateStatus: (task) {
          Navigator.pop(context);
          _showUpdateStatusDialog(context, task);
        },
        onDeleteTask: (taskId) {
          Navigator.pop(context);
          _showDeleteConfirmation(context, task);
        },
      ),
    );
  }

  void _showUpdateTaskDialog(BuildContext context, Task task) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => UpdateTaskDialog(task: task),
    );

    if (result == true) {
      _showSuccessSnackBar('Tâche mise à jour avec succès !');
    } else if (result == false) {
      _showErrorSnackBar('Échec de la mise à jour');
    }
  }

  void _showUpdateStatusDialog(BuildContext context, Task task) {
    showDialog(
      context: context,
      builder: (context) => UpdateStatusDialog(task: task),
    );
  }

  Future<void> _showDeleteConfirmation(BuildContext context, Task task) async {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final result = await showDialog<bool>(
      context: context,
      builder: (context) => _buildDeleteConfirmationDialog(task, isDark),
    );

    if (result == true) {
      await _deleteTask(task);
    }
  }

  // ====== TASK OPERATIONS ======
  Future<void> _deleteTask(Task task) async {
    final taskController = Provider.of<TaskController>(context, listen: false);
    try {
      final success = await taskController.deleteTask(task.id);

      if (mounted) {
        final message = success
            ? 'Tâche supprimée avec succès'
            : 'Erreur lors de la suppression de la tâche';
        final backgroundColor = success ? Colors.green : Colors.red;
        final icon = success ? Icons.check_circle : Icons.error_outline;

        _showSnackBar(message, backgroundColor, icon);
      }
    } catch (e) {
      _showErrorSnackBar('Erreur: $e');
    }
  }

  // ====== NOTIFICATION METHODS ======
  void _showErrorSnackBar(String message) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white),
            const SizedBox(width: 12),
            Text(message),
          ],
        ),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showSnackBar(String message, Color backgroundColor, IconData icon) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(icon, color: Colors.white),
            const SizedBox(width: 10),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  // ====== UI BUILDERS ======
  Widget _buildTab(int index, String title) {
    return Tab(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(_tabIcons[index], size: 18),
          const SizedBox(width: 8),
          Text(title),
        ],
      ),
    );
  }

  Widget _buildDeleteConfirmationDialog(Task task, bool isDark) {
    return AlertDialog(
      title: Row(
        children: [
          Icon(Icons.warning_amber, color: Colors.red.shade600),
          const SizedBox(width: 10),
          const Text('Supprimer la tâche'),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action ne peut pas être annulée.',
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? Colors.red.withOpacity(0.1) : Colors.red.shade50,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color:
                    isDark ? Colors.red.withOpacity(0.3) : Colors.red.shade200,
              ),
            ),
            child: Row(
              children: [
                Icon(Icons.delete_forever,
                    color: Colors.red.shade600, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task.taskNumber,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.red.shade600,
                        ),
                      ),
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
            backgroundColor: Colors.red.shade600,
            foregroundColor: Colors.white,
          ),
        ),
      ],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      actionsPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
    );
  }

  // ====== MAIN BUILD METHOD ======
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;

    return Scaffold(
      backgroundColor: isDark ? Colors.grey.shade900 : Colors.grey.shade50,
      body: NestedScrollView(
        controller: _scrollController,
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            _buildAppBar(
                theme, innerBoxIsScrolled, isDark, isSmall, mediaQuery),
          ];
        },
        body: _buildBody(theme),
      ),
      floatingActionButton: _buildFloatingActionButton(),
    );
  }

  Widget _buildAppBar(ThemeData theme, bool innerBoxIsScrolled, bool isDark,
      bool isSmall, MediaQueryData mediaQuery) {
    return SliverAppBar(
      pinned: true,
      floating: true,
      expandedHeight: isSmall ? 120.0 : 140.0, // Hauteur légèrement réduite
      backgroundColor: isDark ? Colors.grey.shade800 : Colors.white,
      shadowColor: Colors.black26,
      elevation: _isScrolled ? 2 : 0,
      forceElevated: innerBoxIsScrolled,
      centerTitle: false, // Aligner le titre à gauche
      title: _isSearchOpen
          ? TaskSearchField(
              controller: _searchController,
              onChanged: (value) => setState(() => _searchQuery = value),
            )
          : null,
      leading: _isSearchOpen
          ? IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => _toggleSearchMode(open: false),
            )
          : null,
      flexibleSpace: _isSearchOpen
          ? null
          : FlexibleSpaceBar(
              title: Padding(
                padding: const EdgeInsets.only(left: 16.0, bottom: 46.0),
                child: Text(
                  'Mes Tâches',
                  style: TextStyle(
                    color: isDark ? Colors.white : Colors.black87,
                    fontWeight: FontWeight.bold,
                    fontSize: isSmall ? 18 : 20,
                  ),
                ),
              ),
              titlePadding: EdgeInsets.zero,
              background: Stack(
                children: [
                  // Fond principal
                  Container(
                    color: isDark ? Colors.grey.shade800 : Colors.white,
                  ),

                  // Indicateur de filtre actif (si nécessaire)
                  if (_filterPriority != null || _filterProject != null)
                    Positioned(
                      top: mediaQuery.padding.top + (isSmall ? 10 : 16),
                      left: 72, // Espace pour le bouton retour
                      child: _buildActiveFilterIndicator(theme, isDark),
                    ),
                ],
              ),
            ),
      actions: _isSearchOpen
          ? [
              IconButton(
                icon: const Icon(Icons.clear),
                onPressed: _clearSearch,
                iconSize: 24,
                padding: const EdgeInsets.all(8), // Padding réduit
                tooltip: 'Effacer la recherche',
              ),
            ]
          : [
              // Espace entre les actions pour éviter qu'elles ne soient trop collées
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.filter_list),
                    color: isDark ? Colors.white70 : Colors.black54,
                    tooltip: 'Filtrer',
                    onPressed: () => _showFilterDialog(),
                    iconSize: 24,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  IconButton(
                    icon: const Icon(Icons.search),
                    color: isDark ? Colors.white70 : Colors.black54,
                    tooltip: 'Rechercher',
                    onPressed: () => _toggleSearchMode(),
                    iconSize: 24,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  const SizedBox(width: 8),
                ],
              ),
            ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(48),
        child: Container(
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                  color: isDark ? Colors.grey.shade700 : Colors.grey.shade300,
                  width: 1),
            ),
          ),
          child: TabBar(
            controller: _tabController,
            labelColor: isDark ? Colors.white : Colors.black87,
            unselectedLabelColor: isDark ? Colors.white54 : Colors.black45,
            indicatorColor: theme.colorScheme.primary,
            indicatorWeight: 3,
            indicatorSize: TabBarIndicatorSize.label,
            labelStyle: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: isSmall ? 12 : 14,
            ),
            tabs: [
              _buildTab(0, 'À faire'),
              _buildTab(1, 'En cours'),
              _buildTab(2, 'Terminées'),
            ],
          ),
        ),
      ),
    );
  }

  // Indicateur de filtre actif
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

  Widget _buildBody(ThemeData theme) {
    return Consumer<TaskController>(
      builder: (context, taskController, _) {
        if (taskController.isLoading || _isLoading) {
          return Center(
            child: CircularProgressIndicator(
              valueColor:
                  AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
            ),
          );
        }

        // Filtrer les tâches selon les critères de recherche et de filtre
        final allTasks = _filterTasks(taskController.tasks);

        // Si nous n'avons pas de tâches, afficher un état vide
        if (allTasks.isEmpty) {
          final isDark = theme.brightness == Brightness.dark;
          return TaskEmptyState(
            onCreateTask: _showAddTaskDialog,
            isDark: isDark,
          );
        }

        final openTasks =
            allTasks.where((t) => t.status == TaskStatus.open).toList();
        final inProgressTasks =
            allTasks.where((t) => t.status == TaskStatus.inProgress).toList();
        final completedTasks =
            allTasks.where((t) => t.status == TaskStatus.completed).toList();

        return RefreshIndicator(
          onRefresh: _refreshTasks,
          color: theme.colorScheme.primary,
          child: TabBarView(
            controller: _tabController,
            children: [
              // Onglet "À faire"
              TaskStatusColumn(
                tasks: openTasks,
                color: _tabColors[0],
                title: "À faire",
                status: TaskStatus.open,
                onTaskTap: _showTaskDetailSheet,
              ),

              // Onglet "En cours"
              TaskStatusColumn(
                tasks: inProgressTasks,
                color: _tabColors[1],
                title: "En cours",
                status: TaskStatus.inProgress,
                onTaskTap: _showTaskDetailSheet,
              ),

              // Onglet "Terminées"
              TaskStatusColumn(
                tasks: completedTasks,
                color: _tabColors[2],
                title: "Terminées",
                status: TaskStatus.completed,
                onTaskTap: _showTaskDetailSheet,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFloatingActionButton() {
    return FloatingActionButton.extended(
      heroTag: 'fab_unique_tag_2',
      backgroundColor: Theme.of(context).colorScheme.primary,
      foregroundColor: Colors.white,
      elevation: 4,
      icon: const Icon(Icons.add),
      label: const Text('Nouvelle tâche'),
      onPressed: () {
        _showAddTaskDialog();
        HapticFeedback.mediumImpact();
      },
    );
  }
}
