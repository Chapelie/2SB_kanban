import 'dart:convert';
import 'package:uuid/uuid.dart';
import '../models/project.dart';
import '../models/team_member.dart';
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
  
  // Utilitaire pour obtenir le nom du mois à partir du numéro de mois
  String _getMonthName(int month) {
    const months = [
      'JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN',
      'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    return months[month - 1];
  }
}