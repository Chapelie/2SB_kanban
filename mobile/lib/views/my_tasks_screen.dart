import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/task_controller.dart';
import '../controllers/auth_controller.dart';
import '../controllers/project_controller.dart';
import '../models/task.dart';

class MyTasksScreen extends StatefulWidget {
  const MyTasksScreen({Key? key}) : super(key: key);

  @override
  State<MyTasksScreen> createState() => _MyTasksScreenState();
}

class _MyTasksScreenState extends State<MyTasksScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    
    // Charger les tâches au démarrage
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshTasks();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  // Rafraîchir les tâches
  Future<void> _refreshTasks() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final taskController = context.read<TaskController>();
      await taskController.fetchTasks();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors du chargement des tâches: $e')),
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes Tâches'),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Implémentation future: filtrage des tâches
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Filtrage - Fonctionnalité à venir')),
              );
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.indigo,
          unselectedLabelColor: Colors.grey,
          indicatorColor: Colors.indigo,
          tabs: const [
            Tab(text: 'À faire'),
            Tab(text: 'En cours'),
            Tab(text: 'Terminées'),
          ],
        ),
      ),
      body: Consumer<TaskController>(
        builder: (context, taskController, _) {
          if (taskController.isLoading || _isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final allTasks = taskController.tasks;
          
          // Si nous n'avons pas de tâches, afficher un état vide
          if (allTasks.isEmpty) {
            return _buildEmptyState();
          }

          final openTasks = allTasks.where((t) => t.status == TaskStatus.open).toList();
          final inProgressTasks = allTasks.where((t) => t.status == TaskStatus.inProgress).toList();
          final completedTasks = allTasks.where((t) => t.status == TaskStatus.completed).toList();

          return RefreshIndicator(
            onRefresh: _refreshTasks,
            child: TabBarView(
              controller: _tabController,
              children: [
                // Onglet "À faire"
                _buildTaskList(context, openTasks),
                
                // Onglet "En cours"
                _buildTaskList(context, inProgressTasks),
                
                // Onglet "Terminées"
                _buildTaskList(context, completedTasks),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: 'fab_unique_tag_2',
        backgroundColor: Colors.indigo,
        child: const Icon(Icons.add),
        onPressed: () {
          _showAddTaskDialog(context);
        },
      ),
    );
  }

  // Afficher un état vide lorsqu'il n'y a pas de tâches
  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.assignment_outlined,
            size: 80,
            color: Colors.grey,
          ),
          const SizedBox(height: 16),
          Text(
            'Aucune tâche pour le moment',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const Text(
            'Toutes vos tâches assignées apparaîtront ici',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              _showAddTaskDialog(context);
            },
            icon: const Icon(Icons.add),
            label: const Text('Créer une tâche'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.indigo,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Construire la liste des tâches pour un onglet
  Widget _buildTaskList(BuildContext context, List<Task> tasks) {
    if (tasks.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.assignment_outlined,
                size: 48,
                color: Colors.grey[400],
              ),
              const SizedBox(height: 16),
              Text(
                'Aucune tâche dans cette catégorie',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: tasks.length,
      itemBuilder: (context, index) {
        return _buildTaskCard(context, tasks[index]);
      },
    );
  }

  // Construire une carte de tâche
  Widget _buildTaskCard(BuildContext context, Task task) {
    // Récupérer le nom du projet
    final projectController = Provider.of<ProjectController>(context, listen: false);
    final project = projectController.getProjectById(task.projectId);
    final projectName = project?.title ?? 'Projet inconnu';

    return Card(
      margin: const EdgeInsets.only(bottom: 16.0),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () {
          _showTaskDetailDialog(context, task);
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPriorityIndicator(task.priority),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          task.title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          task.taskNumber,
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  _buildStatusChip(task.status),
                ],
              ),
              if (task.description.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 12.0),
                  child: Text(
                    task.description,
                    style: TextStyle(
                      color: Colors.grey[800],
                      fontSize: 14,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Information sur le projet
                  Chip(
                    label: Text(
                      projectName,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.indigo,
                      ),
                    ),
                    backgroundColor: Colors.indigo.withOpacity(0.1),
                    padding: EdgeInsets.zero,
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  
                  // Information sur l'échéance et l'assignation
                  Row(
                    children: [
                      // Jours depuis ouverture
                      Text(
                        'Il y a ${task.openedDaysAgo} ${task.openedDaysAgo > 1 ? 'jours' : 'jour'}',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                      
                      const SizedBox(width: 8),
                      
                      // Assigné à
                      if (task.assignedTo != null)
                        CircleAvatar(
                          radius: 14,
                          backgroundColor: Colors.indigo.withOpacity(0.2),
                          child: Text(
                            task.assignedTo!.initials,
                            style: const TextStyle(
                              color: Colors.indigo,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Construire l'indicateur de priorité
  Widget _buildPriorityIndicator(TaskPriority priority) {
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
        width: 8,
        height: 60,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(4),
        ),
      ),
    );
  }

  // Construire une puce de statut
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

  // Afficher les détails d'une tâche
  void _showTaskDetailDialog(BuildContext context, Task task) {
    final projectController = Provider.of<ProjectController>(context, listen: false);
    final project = projectController.getProjectById(task.projectId);
    final projectName = project?.title ?? 'Projet inconnu';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(task.title),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
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
              
              const Divider(height: 24),
              
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
                task.description.isEmpty ? 'Aucune description' : task.description,
                style: TextStyle(
                  color: Colors.grey[800],
                ),
              ),
              
              const SizedBox(height: 16),
              
              // Projet
              const Text(
                'Projet',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
              Text(projectName),
              
              const SizedBox(height: 16),
              
              // Assigné à
              const Text(
                'Assigné à',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
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
              
              const SizedBox(height: 16),
              
              // Informations supplémentaires
              const Text(
                'Informations',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.access_time, size: 16),
                  const SizedBox(width: 8),
                  Text('Ouverte il y a ${task.openedDaysAgo} jours'),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.person_outline, size: 16),
                  const SizedBox(width: 8),
                  Text('Ouverte par: ${task.openedBy}'),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.comment_outlined, size: 16),
                  const SizedBox(width: 8),
                  Text('${task.comments} commentaire(s)'),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.attach_file, size: 16),
                  const SizedBox(width: 8),
                  Text('${task.attachments} pièce(s) jointe(s)'),
                ],
              ),
            ],
          ),
        ),
        actions: [
          // Bouton pour mettre à jour le statut
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _showUpdateStatusDialog(context, task);
            },
            child: const Text('Changer le statut'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  // Dialogue pour mettre à jour le statut d'une tâche
  void _showUpdateStatusDialog(BuildContext context, Task task) {
    TaskStatus selectedStatus = task.status;
    
    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            title: const Text('Mettre à jour le statut'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  title: const Text('À faire'),
                  leading: Radio<TaskStatus>(
                    value: TaskStatus.open,
                    groupValue: selectedStatus,
                    onChanged: (value) {
                      setState(() {
                        selectedStatus = value!;
                      });
                    },
                  ),
                ),
                ListTile(
                  title: const Text('En cours'),
                  leading: Radio<TaskStatus>(
                    value: TaskStatus.inProgress,
                    groupValue: selectedStatus,
                    onChanged: (value) {
                      setState(() {
                        selectedStatus = value!;
                      });
                    },
                  ),
                ),
                ListTile(
                  title: const Text('Terminée'),
                  leading: Radio<TaskStatus>(
                    value: TaskStatus.completed,
                    groupValue: selectedStatus,
                    onChanged: (value) {
                      setState(() {
                        selectedStatus = value!;
                      });
                    },
                  ),
                ),
                ListTile(
                  title: const Text('Annulée'),
                  leading: Radio<TaskStatus>(
                    value: TaskStatus.canceled,
                    groupValue: selectedStatus,
                    onChanged: (value) {
                      setState(() {
                        selectedStatus = value!;
                      });
                    },
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Annuler'),
              ),
              TextButton(
                onPressed: () async {
                  // Fermer le dialogue
                  Navigator.pop(context);
                  
                  // Appliquer le changement
                  if (selectedStatus != task.status) {
                    final taskController = Provider.of<TaskController>(context, listen: false);
                    final success = await taskController.updateTaskStatus(task.id, selectedStatus);
                    
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            success
                                ? 'Statut mis à jour avec succès'
                                : 'Erreur lors de la mise à jour du statut',
                          ),
                          backgroundColor: success ? Colors.green : Colors.red,
                        ),
                      );
                    }
                  }
                },
                child: const Text('Appliquer'),
              ),
            ],
          );
        },
      ),
    );
  }

  // Dialogue d'ajout de tâche
  void _showAddTaskDialog(BuildContext context) {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    final formKey = GlobalKey<FormState>();
    
    // Obtenir la liste des projets
    final projectController = Provider.of<ProjectController>(context, listen: false);
    final projects = projectController.projects;
    
    String? selectedProjectId = projects.isNotEmpty ? projects.first.id : null;
    TaskPriority selectedPriority = TaskPriority.medium;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            title: const Text('Nouvelle tâche'),
            content: SingleChildScrollView(
              child: Form(
                key: formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Titre de la tâche
                    TextFormField(
                      controller: titleController,
                      decoration: const InputDecoration(
                        labelText: 'Titre',
                        hintText: 'ex: Implémenter la fonctionnalité X',
                        prefixIcon: Icon(Icons.title),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Veuillez entrer un titre';
                        }
                        return null;
                      },
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Description
                    TextFormField(
                      controller: descriptionController,
                      decoration: const InputDecoration(
                        labelText: 'Description',
                        hintText: 'Décrivez la tâche en détail...',
                        prefixIcon: Icon(Icons.description),
                      ),
                      maxLines: 3,
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Sélection de projet
                    if (projects.isEmpty)
                      const Text(
                        'Aucun projet disponible. Veuillez créer un projet d\'abord.',
                        style: TextStyle(color: Colors.red),
                      )
                    else
                      DropdownButtonFormField<String>(
                        value: selectedProjectId,
                        decoration: const InputDecoration(
                          labelText: 'Projet',
                          prefixIcon: Icon(Icons.folder_outlined),
                        ),
                        items: projects.map((project) {
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
                        validator: (value) {
                          if (value == null) {
                            return 'Veuillez sélectionner un projet';
                          }
                          return null;
                        },
                      ),
                    
                    const SizedBox(height: 16),
                    
                    // Sélection de priorité
                    const Text('Priorité:'),
                    Row(
                      children: [
                        Radio<TaskPriority>(
                          value: TaskPriority.low,
                          groupValue: selectedPriority,
                          onChanged: (value) {
                            setState(() {
                              selectedPriority = value!;
                            });
                          },
                        ),
                        const Text('Basse'),
                        Radio<TaskPriority>(
                          value: TaskPriority.medium,
                          groupValue: selectedPriority,
                          onChanged: (value) {
                            setState(() {
                              selectedPriority = value!;
                            });
                          },
                        ),
                        const Text('Moyenne'),
                        Radio<TaskPriority>(
                          value: TaskPriority.high,
                          groupValue: selectedPriority,
                          onChanged: (value) {
                            setState(() {
                              selectedPriority = value!;
                            });
                          },
                        ),
                        const Text('Haute'),
                      ],
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
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: projects.isEmpty
                        ? null
                        : () async {
                            if (formKey.currentState!.validate() && selectedProjectId != null) {
                              // Récupérer les contrôleurs
                              final taskController = Provider.of<TaskController>(context, listen: false);
                              final user = authController.currentUser;
                              
                              if (user != null) {
                                // Créer la tâche
                                final task = await taskController.createTask(
                                  projectId: selectedProjectId!,
                                  title: titleController.text.trim(),
                                  description: descriptionController.text.trim(),
                                  priority: selectedPriority,
                                  openedBy: user.name,
                                );
                                
                                if (mounted) {
                                  Navigator.pop(context);
                                  
                                  if (task != null) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Tâche créée avec succès'),
                                        backgroundColor: Colors.green,
                                      ),
                                    );
                                  } else {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('Erreur: ${taskController.error ?? "Inconnue"}'),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                  }
                                }
                              }
                            }
                          },
                    child: const Text('Créer'),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }
}