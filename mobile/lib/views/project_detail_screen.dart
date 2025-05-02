import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/project_controller.dart';
import '../controllers/task_controller.dart';
import '../controllers/auth_controller.dart';
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
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Consumer<ProjectController>(
          builder: (context, projectController, child) {
            if (projectController.selectedProject != null) {
              return Text(projectController.selectedProject!.title);
            }
            return const Text('Détails du projet');
          },
        ),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.people),
            onPressed: () => _showTeamDialog(),
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => _showProjectSettingsDialog(),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Consumer2<ProjectController, TaskController>(
              builder: (context, projectController, taskController, child) {
                if (projectController.isLoading || taskController.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (projectController.error != null) {
                  return Center(child: Text(projectController.error!));
                }

                if (taskController.error != null) {
                  return Center(child: Text(taskController.error!));
                }

                final project = projectController.selectedProject;
                if (project == null) {
                  return const Center(child: Text('Projet non trouvé'));
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
      floatingActionButton: FloatingActionButton(
        heroTag: 'fab_project_detail',
        onPressed: () => _showAddTaskDialog(),
        backgroundColor: Colors.indigo,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showTaskDetails(Task task) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
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

  Future<bool> _showDeleteConfirmation(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Supprimer la tâche'),
            content: const Text(
                'Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Annuler'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Supprimer'),
              ),
            ],
          ),
        ) ??
        false;
  }

  void _showAddTaskDialog() {
    showDialog(
      context: context,
      builder: (context) => AddTaskDialog(projectId: widget.projectId),
    );
  }

  void _showTeamDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => TeamMembersSheet(
        onAddMember: _showAddMemberDialog,
        onRemoveMember: (projectId, member) async {
          final confirmed =
              await _showRemoveMemberConfirmation(context, member);
          if (confirmed && mounted) {
            await context.read<ProjectController>().removeMemberFromProject(
                  projectId,
                  member.id,
                );
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

  Future<bool> _showRemoveMemberConfirmation(
      BuildContext context, TeamMember member) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Retirer le membre'),
            content: Text(
                'Êtes-vous sûr de vouloir retirer ${member.name} de l\'équipe du projet ?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Annuler'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Retirer'),
              ),
            ],
          ),
        ) ??
        false;
  }

  void _showProjectSettingsDialog() {
    final project = context.read<ProjectController>().selectedProject;
    if (project == null) return;

    showDialog(
      context: context,
      builder: (context) => ProjectSettingsDialog(project: project),
    );
  }
}
