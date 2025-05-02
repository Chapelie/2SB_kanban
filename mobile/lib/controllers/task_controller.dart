import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/task.dart';
import '../models/subtask.dart';
import '../models/team_member.dart';
import '../services/task_service.dart';

class TaskController with ChangeNotifier {
  final TaskService _taskService = TaskService();
  
  List<Task> _tasks = [];
  bool _isLoading = false;
  String? _error;
  
  List<Task> get tasks => _tasks;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  // Filtrer les tâches par statut
  List<Task> getTasksByStatus(TaskStatus status) {
    return _tasks.where((task) => task.status == status).toList();
  }
  
  // Filtrer les tâches par position Kanban
  List<Task> getTasksByKanbanStatus(String kanbanStatus) {
    return _tasks.where((task) => task.kanbanStatus == kanbanStatus).toList();
  }
  
  // Charger les tâches d'un projet
  Future<void> fetchTasks({String? projectId}) async {
    // Ne pas appeler notifyListeners() ici si vous êtes déjà dans un build
    if (!_isLoading) {
      _isLoading = true;
      notifyListeners();
    }
    
    try {
      if (projectId != null) {
        _tasks = await _taskService.getTasksByProject(projectId);
      } else {
        _tasks = await _taskService.getAllTasks();
      }
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Créer une nouvelle tâche
  Future<Task?> createTask({
    required String projectId,
    required String title,
    required String description,
    TaskPriority priority = TaskPriority.medium,
    TeamMember? assignedTo,
    String openedDate = '',
    String openedBy = '',
  }) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // Générer un numéro de tâche unique
      final taskNumber = _generateTaskNumber();
      
      final newTask = await _taskService.createTask(
        projectId: projectId,
        title: title,
        description: description,
        priority: priority,
        assignedTo: assignedTo,
        taskNumber: taskNumber,
        openedDate: openedDate.isEmpty 
            ? DateTime.now().toIso8601String()
            : openedDate,
        openedBy: openedBy,
      );
      
      _tasks = [..._tasks, newTask];
      _error = null;
      return newTask;
    } catch (e) {
      _error = e.toString();
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Générer un numéro de tâche unique (format #XXXXXX)
  String _generateTaskNumber() {
    final random = math.Random();
    return '#${random.nextInt(900000) + 100000}';
  }
  
  // Mettre à jour le statut d'une tâche
  Future<bool> updateTaskStatus(String taskId, TaskStatus newStatus) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // Trouver la tâche actuelle
      final taskIndex = _tasks.indexWhere((t) => t.id == taskId);
      if (taskIndex < 0) {
        _error = 'Tâche non trouvée';
        return false;
      }
      
      final currentTask = _tasks[taskIndex];
      
      // Déterminer le nouveau statut Kanban
      String newKanbanStatus = currentTask.kanbanStatus;
      switch (newStatus) {
        case TaskStatus.open:
          newKanbanStatus = 'backlog';
          break;
        case TaskStatus.inProgress:
          newKanbanStatus = 'in-progress';
          break;
        case TaskStatus.completed:
          newKanbanStatus = 'completed';
          break;
        case TaskStatus.canceled:
          // Le statut kanban reste inchangé pour les tâches annulées
          break;
      }
      
      // Créer une tâche mise à jour
      final updatedTask = Task(
        id: currentTask.id,
        title: currentTask.title,
        taskNumber: currentTask.taskNumber,
        openedDate: currentTask.openedDate,
        openedBy: currentTask.openedBy,
        status: newStatus,
        timeSpent: currentTask.timeSpent,
        assignedTo: currentTask.assignedTo,
        description: currentTask.description,
        comments: currentTask.comments,
        attachments: currentTask.attachments,
        projectId: currentTask.projectId,
        kanbanStatus: newKanbanStatus,
        priority: currentTask.priority,
      );
      
      final result = await _taskService.updateTaskStatus(taskId, newStatus, updatedTask);
      
      // Mettre à jour la liste locale
      _tasks[taskIndex] = result;
      
      _error = null;
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Mettre à jour la position kanban d'une tâche
  Future<bool> updateTaskKanbanStatus(String taskId, String newKanbanStatus) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // Trouver la tâche actuelle
      final taskIndex = _tasks.indexWhere((t) => t.id == taskId);
      if (taskIndex < 0) {
        _error = 'Tâche non trouvée';
        return false;
      }
      
      final currentTask = _tasks[taskIndex];
      
      // Déterminer le nouveau statut de la tâche
      TaskStatus newStatus = currentTask.status;
      switch (newKanbanStatus) {
        case 'backlog':
          newStatus = TaskStatus.open;
          break;
        case 'in-progress':
          newStatus = TaskStatus.inProgress;
          break;
        case 'completed':
          newStatus = TaskStatus.completed;
          break;
      }
      
      // Créer une tâche mise à jour
      final updatedTask = Task(
        id: currentTask.id,
        title: currentTask.title,
        taskNumber: currentTask.taskNumber,
        openedDate: currentTask.openedDate,
        openedBy: currentTask.openedBy,
        status: newStatus,
        timeSpent: currentTask.timeSpent,
        assignedTo: currentTask.assignedTo,
        description: currentTask.description,
        comments: currentTask.comments,
        attachments: currentTask.attachments,
        projectId: currentTask.projectId,
        kanbanStatus: newKanbanStatus,
        priority: currentTask.priority,
      );
      
      await _taskService.updateTask(updatedTask);
      
      // Mettre à jour la liste locale
      _tasks[taskIndex] = updatedTask;
      
      _error = null;
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Mettre à jour une tâche
  Future<bool> updateTask(Task updatedTask) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      await _taskService.updateTask(updatedTask);
      
      // Mettre à jour la liste locale
      final index = _tasks.indexWhere((t) => t.id == updatedTask.id);
      if (index >= 0) {
        _tasks[index] = updatedTask;
      }
      
      _error = null;
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Supprimer une tâche
  Future<bool> deleteTask(String taskId) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      await _taskService.deleteTask(taskId);
      
      // Retirer de la liste locale
      _tasks.removeWhere((t) => t.id == taskId);
      
      _error = null;
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Ajouter une sous-tâche
  Future<bool> addSubtask({
    required String taskId,
    required String title,
    required String description,
    SubtaskPriority priority = SubtaskPriority.medium,
    TeamMember? assignedTo,
  }) async {
    try {
      final subtask = Subtask(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: title,
        description: description,
        priority: priority,
        assignedTo: assignedTo,
        createdAt: DateTime.now().toIso8601String(),
        parentTaskId: taskId,
      );
      
      final updatedTask = await _taskService.addSubtask(taskId, subtask);
      
      // Mettre à jour la liste locale
      final index = _tasks.indexWhere((t) => t.id == taskId);
      if (index >= 0) {
        _tasks[index] = updatedTask;
      }
      
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    }
  }
  
  // Mettre à jour l'état d'une sous-tâche
  Future<bool> updateSubtaskStatus(
    String taskId,
    String subtaskId,
    SubtaskStatus status,
  ) async {
    try {
      final updatedTask = await _taskService.updateSubtaskStatus(
        taskId,
        subtaskId,
        status,
      );
      
      // Mettre à jour la liste locale
      final index = _tasks.indexWhere((t) => t.id == taskId);
      if (index >= 0) {
        _tasks[index] = updatedTask;
      }
      
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    }
  }
  
  // Obtenir une tâche par ID
  Task? getTaskById(String taskId) {
    try {
      return _tasks.firstWhere((task) => task.id == taskId);
    } catch (e) {
      return null;
    }
  }

}