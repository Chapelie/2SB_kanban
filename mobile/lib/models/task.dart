import 'team_member.dart';

enum TaskStatus { open, inProgress, completed, canceled }
enum TaskPriority { low, medium, high }

class Task {
  final String id;
  final String title;
  final String taskNumber;
  final String openedDate;
  final String openedBy;
  final TaskStatus status;
  final String timeSpent;
  final TeamMember? assignedTo;
  final String description;
  final int comments;
  final int attachments;
  final String projectId;
  final String kanbanStatus; // 'backlog', 'in-progress', 'completed'
  final TaskPriority priority;
  
  const Task({
    required this.id,
    required this.title,
    required this.taskNumber,
    required this.openedDate,
    required this.openedBy,
    this.status = TaskStatus.open,
    this.timeSpent = '00:00:00',
    this.assignedTo,
    required this.description,
    this.comments = 0,
    this.attachments = 0,
    required this.projectId,
    this.kanbanStatus = 'backlog',
    this.priority = TaskPriority.medium,
  });
  
  // Calculer le nombre de jours depuis l'ouverture
  int get openedDaysAgo {
    final opened = DateTime.parse(openedDate);
    return DateTime.now().difference(opened).inDays;
  }
  
  // Convertir en JSON pour le stockage local
  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'taskNumber': taskNumber,
    'openedDate': openedDate,
    'openedBy': openedBy,
    'status': status.index,
    'timeSpent': timeSpent,
    'assignedTo': assignedTo?.toJson(),
    'description': description,
    'comments': comments,
    'attachments': attachments,
    'projectId': projectId,
    'kanbanStatus': kanbanStatus,
    'priority': priority.index,
  };
  
  // Créer un objet Task à partir de JSON
  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      title: json['title'],
      taskNumber: json['taskNumber'],
      openedDate: json['openedDate'],
      openedBy: json['openedBy'],
      status: TaskStatus.values[json['status'] ?? 0],
      timeSpent: json['timeSpent'] ?? '00:00:00',
      assignedTo: json['assignedTo'] != null 
          ? TeamMember.fromJson(json['assignedTo']) 
          : null,
      description: json['description'],
      comments: json['comments'] ?? 0,
      attachments: json['attachments'] ?? 0,
      projectId: json['projectId'],
      kanbanStatus: json['kanbanStatus'] ?? 'backlog',
      priority: TaskPriority.values[json['priority'] ?? 1],
    );
  }
}