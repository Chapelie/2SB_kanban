import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/project_controller.dart';
import '../controllers/task_controller.dart';
import '../models/task.dart';
import '../models/team_member.dart';
import '../widgets/project_detail/project_header.dart';
import '../widgets/project_detail/kanban_board.dart';
import '../widgets/project_detail/task_detail_sheet.dart';
import '../widgets/project_detail/team_members_sheet.dart';
import '../widgets/project_detail/add_task_dialog.dart';
import '../widgets/project_detail/update_task_dialog.dart';
import '../widgets/project_detail/update_status_dialog.dart';
import '../widgets/project_detail/add_member_dialog.dart';
import '../widgets/project_detail/project_settings_dialog.dart';

class ProjectDetailScreen extends StatefulWidget {
  final String projectId;

  const ProjectDetailScreen({Key? key, required this.projectId})
      : super(key: key);

  @override
  State<ProjectDetailScreen> createState() => _ProjectDetailScreenState();
}

class _ProjectDetailScreenState extends State<ProjectDetailScreen> {
  bool _isLoading = false;

  Future<void> _refreshData() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final projectController =
          Provider.of<ProjectController>(context, listen: false);
      final taskController =
          Provider.of<TaskController>(context, listen: false);

      await projectController.fetchProjectById(widget.projectId);
      await taskController.fetchTasks(projectId: widget.projectId);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur: $e'),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
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
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;

    return Scaffold(
      appBar: AppBar(
        title: Consumer<ProjectController>(
          builder: (context, projectController, child) {
            if (projectController.selectedProject != null) {
              return Text(
                projectController.selectedProject!.title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: isSmall ? 18 : 20,
                ),
              );
            }
            return const Text('Détails du projet');
          },
        ),
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        centerTitle: false,
        actions: [
          // Équipe
          Tooltip(
            message: 'Voir l\'équipe',
            child: IconButton(
              icon: const Icon(Icons.people_alt_outlined),
              onPressed: () => _showTeamDialog(),
            ),
          ),
          // Paramètres
          Tooltip(
            message: 'Paramètres du projet',
            child: IconButton(
              icon: const Icon(Icons.settings_outlined),
              onPressed: () => _showProjectSettingsDialog(),
            ),
          ),
          if (!isSmall) const SizedBox(width: 8),
        ],
      ),
      body: _isLoading
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(height: 16),
                  Text(
                    'Chargement des données...',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.hintColor,
                    ),
                  ),
                ],
              ),
            )
          : Consumer2<ProjectController, TaskController>(
              builder: (context, projectController, taskController, child) {
                if (projectController.isLoading || taskController.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (projectController.error != null) {
                  return _buildErrorView(projectController.error!);
                }

                if (taskController.error != null) {
                  return _buildErrorView(taskController.error!);
                }

                final project = projectController.selectedProject;
                if (project == null) {
                  return _buildErrorView('Projet non trouvé');
                }

                return Column(
                  children: [
                    // En-tête avec les informations du projet
                    ProjectHeader(project: project),

                    // Tableau Kanban
                    Expanded(
                      child: KanbanBoard(
                        onTaskTap: _showTaskDetails,
                        onAddTask: () => _showAddTaskDialog(),
                        onRefresh: _refreshData,
                      ),
                    ),
                  ],
                );
              },
            ),
      floatingActionButton: FloatingActionButton.extended(
        heroTag: 'fab_project_detail',
        onPressed: () => _showAddTaskDialog(),
        backgroundColor: theme.colorScheme.primary,
        label: Text(isSmall ? 'Tâche' : 'Nouvelle tâche'),
        icon: const Icon(Icons.add),
        elevation: 4,
      ),
    );
  }

  Widget _buildErrorView(String errorMessage) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Erreur',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              errorMessage,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _refreshData,
              icon: const Icon(Icons.refresh),
              label: const Text('Réessayer'),
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

  void _showTaskDetails(Task task) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => TaskDetailSheet(
        task: task,
        onUpdateTask: _showUpdateTaskDialog,
        onUpdateStatus: _showUpdateStatusDialog,
        onDeleteTask: (taskId) async {
          final confirmed = await _showDeleteConfirmation(context);
          if (confirmed && mounted) {
            await context.read<TaskController>().deleteTask(taskId);
          }
        },
      ),
    );
  }

  void _showUpdateTaskDialog(Task task) {
    showDialog(
      context: context,
      builder: (context) => UpdateTaskDialog(task: task),
    );
  }

  void _showUpdateStatusDialog(Task task) {
    showDialog(
      context: context,
      builder: (context) => UpdateStatusDialog(task: task),
    );
  }

  // Remplacez la méthode _showDeleteConfirmation par celle-ci

  Future<bool> _showDeleteConfirmation(BuildContext context) async {
    // Utilisation de BuildContext fourni en paramètre au lieu de this.context
    final mediaQuery = MediaQuery.maybeOf(context) ??
        MediaQueryData.fromView(View.of(context));
    final isSmall = mediaQuery.size.width < 600;
    final theme = Theme.of(context);

    return await showDialog<bool>(
          context: context,
          builder: (dialogContext) => Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Container(
              width: isSmall ? null : 400,
              padding: const EdgeInsets.all(0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Header
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.red.shade700,
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(16),
                        topRight: Radius.circular(16),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.delete_forever,
                          color: Colors.white,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Supprimer la tâche',
                            style: theme.textTheme.titleLarge?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Content
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        // Warning icon
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.red.shade100,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.warning_amber_rounded,
                            color: Colors.red.shade700,
                            size: 36,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Warning text
                        Text(
                          'Attention !',
                          style: theme.textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Colors.red.shade700,
                          ),
                        ),
                        const SizedBox(height: 8),

                        // Description
                        Text(
                          'Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.',
                          textAlign: TextAlign.center,
                          style: theme.textTheme.bodyLarge,
                        ),
                      ],
                    ),
                  ),

                  // Actions
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () =>
                                Navigator.of(dialogContext).pop(false),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text('Annuler'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () =>
                                Navigator.of(dialogContext).pop(true),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red.shade700,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text('Supprimer'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ) ??
        false;
  }

  void _showAddTaskDialog() {
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;

    if (isSmall) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        builder: (context) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: AddTaskDialog(projectId: widget.projectId),
        ),
      );
    } else {
      showDialog(
        context: context,
        builder: (context) => AddTaskDialog(projectId: widget.projectId),
      );
    }
  }
  
  void _showTeamDialog() {
    // Obtenir le projet sélectionné
    final project = Provider.of<ProjectController>(context, listen: false).selectedProject;
    if (project == null) return;
  
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (bottomSheetContext) => TeamMembersSheet(
        onAddMember: () {
          // Fermer la bottom sheet avant d'ouvrir le dialogue
          Navigator.of(bottomSheetContext).pop();
          _showAddMemberDialog();
        },
        onRemoveMember: (projectId, member) async {
          // Fermer la bottom sheet avant d'afficher le dialogue de confirmation
          Navigator.of(bottomSheetContext).pop();
          
          // Utiliser le context principal pour afficher la confirmation
          final confirmed = await _showRemoveMemberConfirmation(context, member);
          
          if (confirmed) {
            // Montrer l'indicateur de chargement
            setState(() {
              _isLoading = true;
            });
            
            try {
              // Utiliser le projectController directement depuis le context principal
              final controller = Provider.of<ProjectController>(context, listen: false);
              final success = await controller.removeMemberFromProject(projectId, member.id);
              
              // Afficher le résultat seulement si le widget est toujours monté
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      success 
                        ? '${member.name} a été retiré(e) du projet' 
                        : 'Échec du retrait du membre'
                    ),
                    backgroundColor: success ? Colors.green : Colors.red,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            } catch (e) {
              // Gérer les erreurs
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Erreur: $e'),
                    backgroundColor: Colors.red,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            } finally {
              // Désactiver l'indicateur de chargement
              if (mounted) {
                setState(() {
                  _isLoading = false;
                });
              }
            }
          }
        },
      ),
    );
  }

  void _showAddMemberDialog() {
    final project = context.read<ProjectController>().selectedProject;
    if (project == null) return;

    showDialog(
      context: context,
      builder: (context) => AddMemberDialog(
        projectId: project.id,
        currentMembers: project.teamMembers,
      ),
    );
  }

  // Modifiez la méthode _showRemoveMemberConfirmation pour éviter d'utiliser un contexte potentiellement désactivé

  Future<bool> _showRemoveMemberConfirmation(
      BuildContext context, TeamMember member) async {
    // Vérifier si le contexte est toujours monté avant d'utiliser MediaQuery
    if (!context.mounted) return false;

    // Capturer les valeurs du contexte immédiatement, avant toute opération asynchrone
    final mediaQuery = MediaQuery.maybeOf(context) ??
        MediaQueryData.fromView(View.of(context));
    final isSmall = mediaQuery.size.width < 600;
    final theme = Theme.of(context);

    // Générer des initiales sécurisées même si la propriété member.initials est null
    // Utilisez le null-aware operator pour éviter les erreurs
    final String name = member.name;
    final String initials = member.initials;

    // Vérifier à nouveau que le contexte est toujours monté avant d'afficher le dialogue
    if (!context.mounted) return false;

    return await showDialog<bool>(
          context: context,
          barrierDismissible:
              false, // Empêche de fermer le dialogue en cliquant en dehors
          builder: (dialogContext) => Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Container(
              width: isSmall ? null : 400,
              padding: const EdgeInsets.all(0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Header
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.red.shade700,
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(16),
                        topRight: Radius.circular(16),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.person_remove_outlined,
                          color: Colors.white,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Retirer le membre',
                            style: theme.textTheme.titleLarge?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Content
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 40,
                          backgroundImage: member.avatar.isNotEmpty
                              ? NetworkImage(member.avatar)
                              : null,
                          backgroundColor:
                              theme.colorScheme.primary.withOpacity(0.1),
                          child: member.avatar.isEmpty
                              ? Text(
                                  initials,
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: theme.colorScheme.primary,
                                  ),
                                )
                              : null,
                        ),
                        const SizedBox(height: 20),
                        Text(
                          'Êtes-vous sûr de vouloir retirer',
                          style: theme.textTheme.bodyMedium,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          name,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'de l\'équipe du projet ?',
                          style: theme.textTheme.bodyMedium,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Cette action ne peut pas être annulée.',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: Colors.red.shade700,
                            fontStyle: FontStyle.italic,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),

                  // Actions
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () =>
                                Navigator.of(dialogContext).pop(false),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text('Annuler'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () =>
                                Navigator.of(dialogContext).pop(true),
                            icon: const Icon(Icons.person_remove, size: 18),
                            label: const Text('Retirer'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red.shade700,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ) ??
        false;
  }

  void _showProjectSettingsDialog() {
    final project = context.read<ProjectController>().selectedProject;
    if (project == null) return;

    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;

    if (isSmall) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        builder: (context) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: ProjectSettingsDialog(project: project),
        ),
      );
    } else {
      showDialog(
        context: context,
        builder: (context) => ProjectSettingsDialog(project: project),
      );
    }
  }
}
