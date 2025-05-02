import 'dart:convert';
import 'package:uuid/uuid.dart';
import '../models/task.dart';
import '../models/subtask.dart';
import '../models/team_member.dart';
import 'storage_service.dart';

class TaskService {
  // Récupérer toutes les tâches
  Future<List<Task>> getAllTasks() async {
    final tasksJson = StorageService.getAll('tasks');
    List<Task> tasks = [];

    for (var taskJson in tasksJson) {
      if (taskJson is String) {
        tasks.add(Task.fromJson(json.decode(taskJson)));
      }
    }

    return tasks;
  }

  // Récupérer les tâches d'un projet spécifique
  Future<List<Task>> getTasksByProject(String projectId) async {
    final allTasks = await getAllTasks();
    return allTasks.where((task) => task.projectId == projectId).toList();
  }

  // Récupérer une tâche spécifique
  Future<Task> getTaskById(String id) async {
    final taskJson = StorageService.get('tasks', id);
    if (taskJson == null) {
      throw Exception('Tâche non trouvée');
    }

    return Task.fromJson(json.decode(taskJson));
  }

  // Créer une nouvelle tâche
  Future<Task> createTask({
    required String projectId,
    required String title,
    required String description,
    TaskPriority priority = TaskPriority.medium,
    TeamMember? assignedTo,
    required String taskNumber,
    required String openedDate,
    required String openedBy,
  }) async {
    final id = const Uuid().v4();
    
    final task = Task(
      id: id,
      title: title,
      taskNumber: taskNumber,
      openedDate: openedDate,
      openedBy: openedBy,
      status: TaskStatus.open,
      timeSpent: '00:00:00',
      assignedTo: assignedTo,
      description: description,
      comments: 0,
      attachments: 0,
      projectId: projectId,
      kanbanStatus: 'backlog',
      priority: priority,
    );

    await StorageService.save('tasks', id, jsonEncode(task.toJson()));
    return task;
  }

  // Mettre à jour une tâche
  Future<Task> updateTask(Task task) async {
    await StorageService.save('tasks', task.id, jsonEncode(task.toJson()));
    return task;
  }

  // Mettre à jour le statut d'une tâche
  Future<Task> updateTaskStatus(String taskId, TaskStatus newStatus, Task updatedTask) async {
    await StorageService.save('tasks', taskId, jsonEncode(updatedTask.toJson()));
    return updatedTask;
  }

  // Supprimer une tâche
  Future<bool> deleteTask(String id) async {
    await StorageService.delete('tasks', id);
    return true;
  }

  // Ajouter une sous-tâche à une tâche
  Future<Task> addSubtask(String taskId, Subtask subtask) async {
    // Récupérer la tâche principale
    final taskJson = StorageService.get('tasks', taskId);
    if (taskJson == null) {
      throw Exception('Tâche non trouvée');
    }
    
    final task = Task.fromJson(json.decode(taskJson));
    
    // Ajouter la sous-tâche (on simule ceci, car notre modèle n'a pas de champ subtasks)
    // Dans une implémentation réelle, vous stockeriez les sous-tâches séparément
    
    // Pour l'exemple, nous allons stocker la sous-tâche dans une box dédiée
    await StorageService.save('subtasks', subtask.id, jsonEncode(subtask.toJson()));
    
    // Retourner la tâche mise à jour
    return task;
  }

  // Mettre à jour le statut d'une sous-tâche
  Future<Task> updateSubtaskStatus(
    String taskId,
    String subtaskId,
    SubtaskStatus status,
  ) async {
    // Récupérer la sous-tâche
    final subtaskJson = StorageService.get('subtasks', subtaskId);
    if (subtaskJson == null) {
      throw Exception('Sous-tâche non trouvée');
    }
    
    final subtask = Subtask.fromJson(json.decode(subtaskJson));
    
    // Créer une sous-tâche mise à jour
    final updatedSubtask = Subtask(
      id: subtask.id,
      title: subtask.title,
      description: subtask.description,
      status: status,
      priority: subtask.priority,
      timeSpent: subtask.timeSpent,
      assignedTo: subtask.assignedTo,
      createdAt: subtask.createdAt,
      dueDate: subtask.dueDate,
      comments: subtask.comments,
      attachments: subtask.attachments,
      parentTaskId: subtask.parentTaskId,
    );
    
    // Sauvegarder la sous-tâche mise à jour
    await StorageService.save('subtasks', subtaskId, jsonEncode(updatedSubtask.toJson()));
    
    // Récupérer la tâche principale
    final task = await getTaskById(taskId);
    
    return task;
  }
}