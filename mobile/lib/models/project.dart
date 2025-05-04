import 'team_member.dart';

enum ProjectStatus { offtrack, ontrack, completed }

class Project {
  final String id;
  final String title;
  final String description;
  final String dueDate;
  final ProjectStatus status; // enum pour faciliter l'utilisation
  final int issuesCount;
  final List<TeamMember> teamMembers;
  final DateTime createdAt;
  final String ownerId;
  final bool isFavorite; // Ajout du champ pour les projets favoris
  
  const Project({
    required this.id,
    required this.title,
    required this.description,
    required this.dueDate,
    this.status = ProjectStatus.ontrack,
    this.issuesCount = 0,
    this.teamMembers = const [],
    required this.createdAt,
    required this.ownerId,
    this.isFavorite = false, // Valeur par défaut
  });
  
  // Calcul des jours restants jusqu'à échéance
  int get daysRemaining {
    // Parse dueDate de format "JJ MOIS ANNÉE" à DateTime
    final parts = dueDate.split(' ');
    if (parts.length < 3) return 0;
    
    final day = int.tryParse(parts[0]) ?? 1;
    final month = _getMonthNumber(parts[1]);
    final year = int.tryParse(parts[2]) ?? DateTime.now().year;
    
    final dueDateTime = DateTime(year, month, day);
    return dueDateTime.difference(DateTime.now()).inDays;
  }
  
  // Helper pour convertir le nom du mois en numéro
  int _getMonthNumber(String month) {
    const months = {
      'JAN': 1, 'FEV': 2, 'MAR': 3, 'AVR': 4, 'MAI': 5, 'JUN': 6,
      'JUL': 7, 'AOU': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
    };
    return months[month.toUpperCase()] ?? 1;
  }
  
  // Convertir en JSON pour le stockage local
  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'dueDate': dueDate,
    'status': status.index,
    'issuesCount': issuesCount,
    'teamMembers': teamMembers.map((member) => member.toJson()).toList(),
    'createdAt': createdAt.toIso8601String(),
    'ownerId': ownerId,
    'isFavorite': isFavorite, // Inclure dans le JSON
  };
  
  // Créer un objet Project à partir de JSON
  factory Project.fromJson(Map<String, dynamic> json) {
    List<TeamMember> members = [];
    if (json['teamMembers'] != null) {
      members = (json['teamMembers'] as List)
          .map((memberJson) => TeamMember.fromJson(memberJson))
          .toList();
    }
    
    return Project(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      dueDate: json['dueDate'],
      status: ProjectStatus.values[json['status'] ?? 1],
      issuesCount: json['issuesCount'] ?? 0,
      teamMembers: members,
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : DateTime.now(),
      ownerId: json['ownerId'] ?? '',
      isFavorite: json['isFavorite'] ?? false, // Récupérer depuis le JSON
    );
  }
  
  // Créer une copie du projet avec des modifications
  Project copyWith({
    String? id,
    String? title,
    String? description,
    String? dueDate,
    ProjectStatus? status,
    int? issuesCount,
    List<TeamMember>? teamMembers,
    DateTime? createdAt,
    String? ownerId,
    bool? isFavorite,
  }) {
    return Project(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      dueDate: dueDate ?? this.dueDate,
      status: status ?? this.status,
      issuesCount: issuesCount ?? this.issuesCount,
      teamMembers: teamMembers ?? this.teamMembers,
      createdAt: createdAt ?? this.createdAt,
      ownerId: ownerId ?? this.ownerId,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}