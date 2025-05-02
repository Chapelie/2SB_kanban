import 'team_member.dart';

enum SubtaskStatus { open, inProgress, completed }
enum SubtaskPriority { low, medium, high }

class Subtask {
  final String id;
  final String title;
  final String description;
  final SubtaskStatus status;
  final SubtaskPriority priority;
  final String timeSpent;
  final TeamMember? assignedTo;
  final String createdAt;
  final String? dueDate;
  final int comments;
  final int attachments;
  final String parentTaskId;
  
  const Subtask({
    required this.id,
    required this.title,
    required this.description,
    this.status = SubtaskStatus.open,
    this.priority = SubtaskPriority.medium,
    this.timeSpent = '00:00:00',
    this.assignedTo,
    required this.createdAt,
    this.dueDate,
    this.comments = 0,
    this.attachments = 0,
    required this.parentTaskId,
  });
  
  // Convertir en JSON pour le stockage local
  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'status': status.index,
    'priority': priority.index,
    'timeSpent': timeSpent,
    'assignedTo': assignedTo?.toJson(),
    'createdAt': createdAt,
    'dueDate': dueDate,
    'comments': comments,
    'attachments': attachments,
    'parentTaskId': parentTaskId,
  };
  
  // Créer un objet Subtask à partir de JSON
  factory Subtask.fromJson(Map<String, dynamic> json) {
    return Subtask(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      status: SubtaskStatus.values[json['status'] ?? 0],
      priority: SubtaskPriority.values[json['priority'] ?? 1],
      timeSpent: json['timeSpent'] ?? '00:00:00',
      assignedTo: json['assignedTo'] != null 
          ? TeamMember.fromJson(json['assignedTo']) 
          : null,
      createdAt: json['createdAt'],
      dueDate: json['dueDate'],
      comments: json['comments'] ?? 0,
      attachments: json['attachments'] ?? 0,
      parentTaskId: json['parentTaskId'],
    );
  }
}