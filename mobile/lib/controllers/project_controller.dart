import 'package:flutter/material.dart';
import '../models/project.dart';
import '../models/team_member.dart';
import '../services/project_service.dart';

class ProjectController with ChangeNotifier {
  final ProjectService _projectService = ProjectService();

  List<Project> _projects = [];
  Project? _selectedProject;
  bool _isLoading = false;
  String? _error;

  List<Project> get projects => _projects;
  Project? get selectedProject => _selectedProject;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Charger tous les projets
Future<void> fetchProjects() async {
    if (!_isLoading) {
      _isLoading = true;
      notifyListeners();
    }
  
    try {
      _projects = await _projectService.getAllProjects();
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Charger un projet spécifique
  Future<void> fetchProjectById(String projectId) async {
    if (!_isLoading) {
      _isLoading = true;
      notifyListeners();
    }
  
    try {
      final project = await _projectService.getProjectById(projectId);
      _selectedProject = project;
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Obtenir un projet par son ID (à partir de la liste locale)
  Project? getProjectById(String projectId) {
    return _projects.firstWhere(
      (project) => project.id == projectId,
      orElse: () => null as Project, // Obligé de caster null pour satisfaire le type de retour
    );
  }

  // Créer un nouveau projet
  Future<Project?> createProject({
    required String title,
    required String description,
    required String ownerId,
    String dueDate = '',
    ProjectStatus status = ProjectStatus.ontrack,
    List<TeamMember> teamMembers = const [],
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final newProject = await _projectService.createProject(
        title: title,
        description: description,
        ownerId: ownerId,
        dueDate: dueDate,
        status: status,
        teamMembers: teamMembers,
      );
      _projects = [..._projects, newProject];
      _error = null;
      return newProject;
    } catch (e) {
      _error = e.toString();
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Mettre à jour un projet
  Future<bool> updateProject(Project updatedProject) async {
    _isLoading = true;
    notifyListeners();

    try {
      final result = await _projectService.updateProject(updatedProject);

      // Mettre à jour la liste locale
      final index = _projects.indexWhere((p) => p.id == updatedProject.id);
      if (index >= 0) {
        _projects[index] = updatedProject;
      }

      // Mettre à jour le projet sélectionné si nécessaire
      if (_selectedProject?.id == updatedProject.id) {
        _selectedProject = updatedProject;
      }

      _error = null;
      return result;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Supprimer un projet
  Future<bool> deleteProject(String projectId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final result = await _projectService.deleteProject(projectId);

      // Retirer de la liste locale
      _projects.removeWhere((p) => p.id == projectId);

      // Réinitialiser le projet sélectionné si nécessaire
      if (_selectedProject?.id == projectId) {
        _selectedProject = null;
      }

      _error = null;
      return result;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Ajouter un membre à un projet
  Future<bool> addMemberToProject(String projectId, TeamMember member) async {
    try {
      final updatedProject = await _projectService.addMemberToProject(
        projectId,
        member,
      );

      // Mettre à jour la liste locale
      final index = _projects.indexWhere((p) => p.id == projectId);
      if (index >= 0) {
        _projects[index] = updatedProject;
      }

      // Mettre à jour le projet sélectionné si nécessaire
      if (_selectedProject?.id == projectId) {
        _selectedProject = updatedProject;
      }

      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    }
  }

  // Supprimer un membre d'un projet
  Future<bool> removeMemberFromProject(String projectId, String memberId) async {
    try {
      final updatedProject = await _projectService.removeMemberFromProject(
        projectId,
        memberId,
      );

      // Mettre à jour la liste locale
      final index = _projects.indexWhere((p) => p.id == projectId);
      if (index >= 0) {
        _projects[index] = updatedProject;
      }

      // Mettre à jour le projet sélectionné si nécessaire
      if (_selectedProject?.id == projectId) {
        _selectedProject = updatedProject;
      }

      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    }
  }
  
  // Mettre à jour le statut d'un projet
  Future<bool> updateProjectStatus(String projectId, ProjectStatus status) async {
    try {
      // Trouver le projet actuel
      final projectIndex = _projects.indexWhere((p) => p.id == projectId);
      if (projectIndex < 0) {
        _error = 'Projet non trouvé';
        return false;
      }
      
      final currentProject = _projects[projectIndex];
      
      // Créer un projet mis à jour avec le nouveau statut
      final updatedProject = Project(
        id: currentProject.id,
        title: currentProject.title,
        description: currentProject.description,
        dueDate: currentProject.dueDate,
        status: status,
        issuesCount: currentProject.issuesCount,
        teamMembers: currentProject.teamMembers,
        createdAt: currentProject.createdAt,
        ownerId: currentProject.ownerId,
      );
      
      // Appeler la méthode de mise à jour
      return await updateProject(updatedProject);
    } catch (e) {
      _error = e.toString();
      return false;
    }
  }

  // Retourne les projets en fonction de leur statut
  List<Project> getProjectsByStatus(ProjectStatus status) {
    return _projects.where((project) => project.status == status).toList();
  }
}