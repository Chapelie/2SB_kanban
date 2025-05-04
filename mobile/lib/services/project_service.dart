import 'dart:convert';
import 'package:uuid/uuid.dart';
import '../models/project.dart';
import '../models/team_member.dart';
import '../models/task.dart';
import 'dart:math' as math;
import 'storage_service.dart';

class ProjectService {
  // Récupérer tous les projets
  Future<List<Project>> getAllProjects() async {
    final projectsJson = StorageService.getAll('projects');
    List<Project> projects = [];

    for (var projectJson in projectsJson) {
      if (projectJson is String) {
        projects.add(Project.fromJson(json.decode(projectJson)));
      }
    }

    return projects;
  }

  // Récupérer un projet spécifique
  Future<Project> getProjectById(String id) async {
    final projectJson = StorageService.get('projects', id);
    if (projectJson == null) {
      throw Exception('Projet non trouvé');
    }

    return Project.fromJson(json.decode(projectJson));
  }

  // Créer un nouveau projet
  Future<Project> createProject({
    required String title,
    required String description,
    required String ownerId,
    String dueDate = '',
    ProjectStatus status = ProjectStatus.ontrack,
    List<TeamMember> teamMembers = const [],
  }) async {
    final id = const Uuid().v4();
    
    // Si aucune date d'échéance n'est fournie, définir à 30 jours par défaut
    final effectiveDueDate = dueDate.isEmpty
        ? '${DateTime.now().add(const Duration(days: 30)).day} ${_getMonthName(DateTime.now().add(const Duration(days: 30)).month)} ${DateTime.now().add(const Duration(days: 30)).year}'
        : dueDate;
    
    final project = Project(
      id: id,
      title: title,
      description: description,
      dueDate: effectiveDueDate,
      status: status,
      issuesCount: 0,
      teamMembers: teamMembers,
      createdAt: DateTime.now(),
      ownerId: ownerId,
    );

    await StorageService.save('projects', id, jsonEncode(project.toJson()));
    return project;
  }

  // Mettre à jour un projet
  Future<bool> updateProject(Project project) async {
    await StorageService.save(
      'projects',
      project.id,
      jsonEncode(project.toJson()),
    );
    return true;
  }

  // Supprimer un projet
  Future<bool> deleteProject(String id) async {
    await StorageService.delete('projects', id);
    return true;
  }

  // Ajouter un membre à un projet
  Future<Project> addMemberToProject(String projectId, TeamMember member) async {
    final project = await getProjectById(projectId);
    
    // Vérifier si le membre est déjà dans le projet
    if (project.teamMembers.any((m) => m.id == member.id)) {
      return project; // Membre déjà présent, retourner le projet inchangé
    }
    
    // Ajouter le membre à la liste
    final updatedMembers = List<TeamMember>.from(project.teamMembers)..add(member);
    
    // Créer un nouveau projet avec la liste de membres mise à jour
    final updatedProject = Project(
      id: project.id,
      title: project.title,
      description: project.description,
      dueDate: project.dueDate,
      status: project.status,
      issuesCount: project.issuesCount,
      teamMembers: updatedMembers,
      createdAt: project.createdAt,
      ownerId: project.ownerId,
    );

    await StorageService.save(
      'projects',
      projectId,
      jsonEncode(updatedProject.toJson()),
    );
    
    return updatedProject;
  }

  // Supprimer un membre d'un projet
  Future<Project> removeMemberFromProject(String projectId, String memberId) async {
    final project = await getProjectById(projectId);
    
    // Filtrer les membres pour enlever celui avec l'ID spécifié
    final updatedMembers = project.teamMembers.where((m) => m.id != memberId).toList();
    
    // Créer un nouveau projet avec la liste de membres mise à jour
    final updatedProject = Project(
      id: project.id,
      title: project.title,
      description: project.description,
      dueDate: project.dueDate,
      status: project.status,
      issuesCount: project.issuesCount,
      teamMembers: updatedMembers,
      createdAt: project.createdAt,
      ownerId: project.ownerId,
    );

    await StorageService.save(
      'projects',
      projectId,
      jsonEncode(updatedProject.toJson()),
    );
    
    return updatedProject;
  }
  
  // Récupérer toutes les tâches d'un projet
  Future<List<Task>> getTasksForProject(String projectId) async {
    try {
      // Récupérer toutes les tâches
      final tasksJson = StorageService.getAll('tasks');
      List<Task> allTasks = [];
  
      for (var taskJson in tasksJson) {
        if (taskJson is String) {
          final task = Task.fromJson(json.decode(taskJson));
          allTasks.add(task);
        }
      }
  
      // Filtrer les tâches pour ce projet
      return allTasks.where((task) => task.projectId == projectId).toList();
    } catch (e) {
      throw Exception('Erreur lors de la récupération des tâches: $e');
    }
  }
  
  // Ajouter une tâche à un projet
  Future<Project> addTaskToProject(String projectId, Task task) async {
    try {
      // Récupérer le projet
      final project = await getProjectById(projectId);
      
      // Générer un numéro de tâche s'il n'en a pas déjà un
      String taskNumber = task.taskNumber;
      if (taskNumber.isEmpty) {
        // Générer un numéro de tâche comme "PROJ-0001"
        final projectCode = project.title.substring(0, math.min(4, project.title.length)).toUpperCase();
        final random = 1000 + math.Random().nextInt(9000); // Entre 1000 et 9999
        taskNumber = '$projectCode-$random';
      }
      
      // Créer la tâche finale avec le numéro généré
      final finalTask = Task(
        id: task.id,
        title: task.title,
        taskNumber: taskNumber,
        openedDate: task.openedDate,
        openedBy: task.openedBy,
        status: task.status,
        timeSpent: task.timeSpent,
        assignedTo: task.assignedTo,
        description: task.description,
        comments: task.comments,
        attachments: task.attachments,
        projectId: projectId,
        kanbanStatus: task.kanbanStatus,
        priority: task.priority,
      );
      
      // Enregistrer la tâche
      await StorageService.save(
        'tasks',
        finalTask.id,
        jsonEncode(finalTask.toJson()),
      );
      
      // Mettre à jour le compteur d'issues dans le projet
      final tasksCount = (await getTasksForProject(projectId)).length + 1;  // +1 car on vient d'ajouter
      
      // Créer un projet mis à jour avec le nouveau nombre d'issues
      final updatedProject = Project(
        id: project.id,
        title: project.title,
        description: project.description,
        dueDate: project.dueDate,
        status: project.status,
        issuesCount: tasksCount, // Mettre à jour le compteur
        teamMembers: project.teamMembers,
        createdAt: project.createdAt,
        ownerId: project.ownerId,
        isFavorite: project.isFavorite,
      );
      
      // Enregistrer le projet mis à jour
      await StorageService.save(
        'projects',
        projectId,
        jsonEncode(updatedProject.toJson()),
      );
      
      return updatedProject;
    } catch (e) {
      throw Exception('Erreur lors de l\'ajout de la tâche: $e');
    }
  }
  
  // Mettre à jour une tâche dans un projet
  Future<Project> updateTaskInProject(String projectId, Task updatedTask) async {
    try {
      // Vérifier si la tâche existe
      final taskJson = StorageService.get('tasks', updatedTask.id);
      if (taskJson == null) {
        throw Exception('Tâche non trouvée');
      }
      
      // Récupérer le projet
      final project = await getProjectById(projectId);
      
      // Enregistrer la tâche mise à jour
      await StorageService.save(
        'tasks',
        updatedTask.id,
        jsonEncode(updatedTask.toJson()),
      );
      
      // Comme aucune modification au compteur d'issues n'est nécessaire lors d'une mise à jour,
      // nous retournons simplement le projet inchangé
      return project;
    } catch (e) {
      throw Exception('Erreur lors de la mise à jour de la tâche: $e');
    }
  }
  
  // Supprimer une tâche d'un projet
  Future<Project> deleteTaskFromProject(String projectId, String taskId) async {
    try {
      // Récupérer le projet
      final project = await getProjectById(projectId);
      
      // Supprimer la tâche
      await StorageService.delete('tasks', taskId);
      
      // Mettre à jour le compteur d'issues dans le projet
      final tasksCount = (await getTasksForProject(projectId)).length;
      
      // Créer un projet mis à jour avec le nouveau nombre d'issues
      final updatedProject = Project(
        id: project.id,
        title: project.title,
        description: project.description,
        dueDate: project.dueDate,
        status: project.status,
        issuesCount: tasksCount, // Mettre à jour le compteur
        teamMembers: project.teamMembers,
        createdAt: project.createdAt,
        ownerId: project.ownerId,
        isFavorite: project.isFavorite,
      );
      
      // Enregistrer le projet mis à jour
      await StorageService.save(
        'projects',
        projectId,
        jsonEncode(updatedProject.toJson()),
      );
      
      return updatedProject;
    } catch (e) {
      throw Exception('Erreur lors de la suppression de la tâche: $e');
    }
  }
  
  // Récupérer une tâche spécifique
  Future<Task> getTaskById(String taskId) async {
    final taskJson = StorageService.get('tasks', taskId);
    if (taskJson == null) {
      throw Exception('Tâche non trouvée');
    }
  
    return Task.fromJson(json.decode(taskJson));
  }
  
  // Mettre à jour le statut d'une tâche
  Future<Task> updateTaskStatus(String taskId, TaskStatus newStatus, String newKanbanStatus) async {
    try {
      // Récupérer la tâche existante
      final task = await getTaskById(taskId);
      
      // Créer une nouvelle tâche avec le statut mis à jour
      final updatedTask = Task(
        id: task.id,
        title: task.title,
        taskNumber: task.taskNumber,
        openedDate: task.openedDate,
        openedBy: task.openedBy,
        status: newStatus,
        timeSpent: task.timeSpent,
        assignedTo: task.assignedTo,
        description: task.description,
        comments: task.comments,
        attachments: task.attachments,
        projectId: task.projectId,
        kanbanStatus: newKanbanStatus,
        priority: task.priority,
      );
      
      // Enregistrer la tâche mise à jour
      await StorageService.save(
        'tasks',
        taskId,
        jsonEncode(updatedTask.toJson()),
      );
      
      return updatedTask;
    } catch (e) {
      throw Exception('Erreur lors de la mise à jour du statut de la tâche: $e');
    }
  }
  
  // Assigner une tâche à un membre
  Future<Task> assignTaskToMember(String taskId, TeamMember member) async {
    try {
      // Récupérer la tâche existante
      final task = await getTaskById(taskId);
      
      // Créer une nouvelle tâche avec le membre assigné
      final updatedTask = Task(
        id: task.id,
        title: task.title,
        taskNumber: task.taskNumber,
        openedDate: task.openedDate,
        openedBy: task.openedBy,
        status: task.status,
        timeSpent: task.timeSpent,
        assignedTo: member,
        description: task.description,
        comments: task.comments,
        attachments: task.attachments,
        projectId: task.projectId,
        kanbanStatus: task.kanbanStatus,
        priority: task.priority,
      );
      
      // Enregistrer la tâche mise à jour
      await StorageService.save(
        'tasks',
        taskId,
        jsonEncode(updatedTask.toJson()),
      );
      
      return updatedTask;
    } catch (e) {
      throw Exception('Erreur lors de l\'assignation de la tâche: $e');
    }
  }
  
  // Mettre à jour la priorité d'une tâche
  Future<Task> updateTaskPriority(String taskId, TaskPriority newPriority) async {
    try {
      // Récupérer la tâche existante
      final task = await getTaskById(taskId);
      
      // Créer une nouvelle tâche avec la priorité mise à jour
      final updatedTask = Task(
        id: task.id,
        title: task.title,
        taskNumber: task.taskNumber,
        openedDate: task.openedDate,
        openedBy: task.openedBy,
        status: task.status,
        timeSpent: task.timeSpent,
        assignedTo: task.assignedTo,
        description: task.description,
        comments: task.comments,
        attachments: task.attachments,
        projectId: task.projectId,
        kanbanStatus: task.kanbanStatus,
        priority: newPriority,
      );
      
      // Enregistrer la tâche mise à jour
      await StorageService.save(
        'tasks',
        taskId,
        jsonEncode(updatedTask.toJson()),
      );
      
      return updatedTask;
    } catch (e) {
      throw Exception('Erreur lors de la mise à jour de la priorité de la tâche: $e');
    }
  }
  
  // Utilitaire pour obtenir le nom du mois à partir du numéro de mois
  String _getMonthName(int month) {
    const months = [
      'JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN',
      'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    return months[month - 1];
  }
}