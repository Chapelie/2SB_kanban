import 'package:flutter/material.dart';
import '../../models/project.dart';

class ProjectHeader extends StatelessWidget {
  final Project project;

  const ProjectHeader({
    Key? key,
    required this.project,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Description du projet
          Text(
            project.description,
            style: TextStyle(
              color: Colors.grey[700],
              fontSize: 14,
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Informations du projet
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Membres de l'équipe
              Row(
                children: [
                  const Icon(Icons.people_outline, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'Équipe: ${project.teamMembers.length} membre(s)',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              
              // Date d'échéance
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'Échéance: ${project.dueDate}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              
              // Statut du projet
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _getStatusColor(project.status).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: _getStatusColor(project.status).withOpacity(0.5),
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      _getStatusIcon(project.status),
                      size: 16,
                      color: _getStatusColor(project.status),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _getStatusText(project.status),
                      style: TextStyle(
                        color: _getStatusColor(project.status),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(ProjectStatus status) {
    switch (status) {
      case ProjectStatus.offtrack:
        return Colors.red;
      case ProjectStatus.ontrack:
        return Colors.blue;
      case ProjectStatus.completed:
        return Colors.green;
    }
  }

  IconData _getStatusIcon(ProjectStatus status) {
    switch (status) {
      case ProjectStatus.offtrack:
        return Icons.error_outline;
      case ProjectStatus.ontrack:
        return Icons.sync;
      case ProjectStatus.completed:
        return Icons.check_circle_outline;
    }
  }

  String _getStatusText(ProjectStatus status) {
    switch (status) {
      case ProjectStatus.offtrack:
        return 'En retard';
      case ProjectStatus.ontrack:
        return 'En cours';
      case ProjectStatus.completed:
        return 'Terminé';
    }
  }
}