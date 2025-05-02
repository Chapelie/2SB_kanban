import 'package:flutter/material.dart';
import '../../models/project.dart';
import '../../config/app_routes.dart';
import 'team_avatars.dart';

class ProjectCard extends StatelessWidget {
  final Project project;
  
  const ProjectCard({
    Key? key,
    required this.project,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Calculer le pourcentage de progression (simulé pour la démo)
    final progressPercent = project.id == 'sample1' ? 80 : 65;
    
    // Déterminer la couleur du statut
    Color statusColor;
    String statusText;
    switch (project.status) {
      case ProjectStatus.completed:
        statusColor = Colors.green;
        statusText = 'Terminé';
        break;
      case ProjectStatus.offtrack:
        statusColor = Colors.red;
        statusText = 'En retard';
        break;
      case ProjectStatus.ontrack:
        statusColor = Colors.blue;
        statusText = 'En cours';
        break;
    }
    
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(
          context, 
          AppRoutes.projectDetail,
          arguments: project.id,
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    project.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    statusText,
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              project.description,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  Icons.access_time,
                  size: 16,
                  color: Colors.grey[600],
                ),
                const SizedBox(width: 4),
                Text(
                  'Échéance: ${project.dueDate}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(width: 12),
                if (project.issuesCount > 0)
                  Row(
                    children: [
                      Icon(
                        Icons.warning_amber,
                        size: 16,
                        color: Colors.amber[700],
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${project.issuesCount} problèmes',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.amber[700],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Avatars de l'équipe
                TeamMemberAvatars(members: project.teamMembers),
                
                // Progression circulaire
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: _getProgressColor(progressPercent),
                      width: 3,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      '$progressPercent%',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _getProgressColor(progressPercent),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Obtenir la couleur en fonction du pourcentage
  Color _getProgressColor(int percent) {
    if (percent < 30) {
      return Colors.red;
    } else if (percent < 70) {
      return Colors.orange;
    } else {
      return Colors.green;
    }
  }
}