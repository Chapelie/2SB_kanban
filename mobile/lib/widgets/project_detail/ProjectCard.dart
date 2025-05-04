import 'package:flutter/material.dart';
import '../../models/project.dart';
import '../../config/app_routes.dart';

class ProjectCard extends StatelessWidget {
  final Project project;
  final VoidCallback? onTap;

  const ProjectCard({
    Key? key,
    required this.project,
    this.onTap,
  }) : super(key: key);

  Color _getStatusColor() {
    switch (project.status) {
      case ProjectStatus.ontrack:
        return Colors.green;
      case ProjectStatus.offtrack:
        return Colors.red;
      case ProjectStatus.completed:
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  String _getStatusText() {
    switch (project.status) {
      case ProjectStatus.ontrack:
        return 'En cours';
      case ProjectStatus.offtrack:
        return 'En retard';
      case ProjectStatus.completed:
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  }

  // Méthode protégée contre les erreurs dans la génération des avatars
  Widget _buildTeamMembersAvatars(bool isSmallCard) {
    // Protection contre null ou liste vide
    if (project.teamMembers == null || project.teamMembers.isEmpty) {
      return Container(); // Retourner un widget vide
    }

    try {
      // Adaptation au responsive: moins d'avatars sur petits écrans
      final displayCount = isSmallCard
          ? (project.teamMembers.length > 2 ? 2 : project.teamMembers.length)
          : (project.teamMembers.length > 3 ? 3 : project.teamMembers.length);
      final remainingCount = project.teamMembers.length - displayCount;

      return Row(
        mainAxisSize:
            MainAxisSize.min, // Pour n'occuper que l'espace nécessaire
        children: [
          ...project.teamMembers.take(displayCount).map((member) {
            // Vérification sécurisée pour chaque membre
            return Padding(
              padding: const EdgeInsets.only(right: 4),
              child: CircleAvatar(
                radius: isSmallCard ? 10 : 12, // Taille adaptative
                backgroundColor: Colors.grey[300],
                backgroundImage: _getAvatarImage(member),
                child: _shouldShowInitial(member)
                    ? Text(_getInitial(member),
                        style: TextStyle(fontSize: isSmallCard ? 8 : 10))
                    : null,
              ),
            );
          }).toList(),
          if (remainingCount > 0)
            CircleAvatar(
              radius: isSmallCard ? 10 : 12, // Taille adaptative
              backgroundColor: Colors.grey[300],
              child: Text(
                '+$remainingCount',
                style: TextStyle(
                    fontSize: isSmallCard ? 8 : 10, color: Colors.grey[700]),
              ),
            ),
        ],
      );
    } catch (e) {
      // En cas d'erreur, retourner un widget vide
      return Container();
    }
  }

  // Méthodes utilitaires pour éviter les erreurs lors de la génération des avatars
  ImageProvider? _getAvatarImage(dynamic member) {
    try {
      if (member.avatar != null && member.avatar.isNotEmpty) {
        return NetworkImage(member.avatar);
      } else {
        return const AssetImage('assets/images/default_avatar.png');
      }
    } catch (e) {
      return const AssetImage('assets/images/default_avatar.png');
    }
  }

  bool _shouldShowInitial(dynamic member) {
    try {
      return (member.avatar == null || member.avatar.isEmpty) &&
          member.name != null &&
          member.name.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  String _getInitial(dynamic member) {
    try {
      return member.name[0].toUpperCase();
    } catch (e) {
      return '?';
    }
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Détection de la taille de la carte pour le responsive
        final isSmallCard = constraints.maxWidth < 200;
        final isMediumCard = constraints.maxWidth < 300 && !isSmallCard;

        // Protection contre les erreurs dans daysRemaining
        int daysRemaining;
        try {
          daysRemaining = project.daysRemaining;
        } catch (e) {
          daysRemaining = 0; // Valeur par défaut en cas d'erreur
        }

        final statusColor = _getStatusColor();

        return Card(
          // Marges adaptatives selon la taille disponible
          margin: EdgeInsets.symmetric(
              horizontal: isSmallCard ? 4 : 8, vertical: isSmallCard ? 4 : 8),
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: InkWell(
            onTap: onTap ??
                () {
                  try {
                    Navigator.pushNamed(
                      context,
                      AppRoutes.projectDetail,
                      arguments: project.id,
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Erreur de navigation: $e')),
                    );
                  }
                },
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: EdgeInsets.all(isSmallCard ? 12 : 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header with title and favorite icon
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          project.title,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: isSmallCard ? 14 : 16,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      // Correction pour éviter l'erreur si isFavorite est null
                      if (project.isFavorite)
                        Icon(Icons.star,
                            color: Colors.amber, size: isSmallCard ? 16 : 20),
                    ],
                  ),

                  SizedBox(height: isSmallCard ? 8 : 12),

                  // Description with limited lines
                  Expanded(
                    child: Text(
                      project.description,
                      style: TextStyle(
                        fontSize: isSmallCard ? 12 : 14,
                        color: Colors.grey[600],
                        height: 1.3,
                      ),
                      maxLines: isSmallCard ? 2 : 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),

                  SizedBox(height: isSmallCard ? 8 : 16),

                  // Layout adaptatif selon la taille
                  isSmallCard
                      ? _buildCompactBottomSection(
                          statusColor, daysRemaining, isSmallCard)
                      : _buildFullBottomSection(statusColor, daysRemaining,
                          isSmallCard, isMediumCard),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  // Version compacte pour les petites cartes
  Widget _buildCompactBottomSection(
      Color statusColor, int daysRemaining, bool isSmallCard) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Status indicator
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
          decoration: BoxDecoration(
            color: statusColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: statusColor.withOpacity(0.3), width: 1),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircleAvatar(
                radius: 3,
                backgroundColor: statusColor,
              ),
              const SizedBox(width: 4),
              Text(
                _getStatusText(),
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  color: statusColor,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 8),

        // Footer en mode compact - CORRECTION ICI
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Date/échéance en format compact
            if (project.dueDate.isNotEmpty)
              Flexible(
                // Ajout de Flexible pour permettre l'adaptation
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.calendar_today,
                        size: 10, color: Colors.grey[600]),
                    const SizedBox(width: 2),
                    Flexible(
                      // Ajout de Flexible pour permettre au texte de rétrécir
                      child: Text(
                        project.dueDate,
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey[700],
                        ),
                        overflow: TextOverflow
                            .ellipsis, // Ajouter l'ellipse pour les textes trop longs
                        maxLines: 1,
                      ),
                    ),
                  ],
                ),
              ),

            // Un peu d'espace entre la date et les avatars
            const SizedBox(width: 4),

            // Avatars en version compacte
            if (project.teamMembers.isNotEmpty)
              _buildTeamMembersAvatars(isSmallCard),
          ],
        ),
      ],
    );
  }

  // Version complète pour les cartes de taille normale
  Widget _buildFullBottomSection(Color statusColor, int daysRemaining,
      bool isSmallCard, bool isMediumCard) {
    return Column(
      children: [
        // Project metadata and progress indicators
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Due date and days remaining
            Flexible(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Date d'échéance - vérification qu'elle n'est pas null ou vide
                  if (project.dueDate.isNotEmpty)
                    Row(
                      children: [
                        Icon(Icons.calendar_today,
                            size: isMediumCard ? 12 : 14,
                            color: Colors.grey[600]),
                        const SizedBox(width: 4),
                        Text(
                          project.dueDate,
                          style: TextStyle(
                            fontSize: isMediumCard ? 10 : 12,
                            color: Colors.grey[700],
                          ),
                        ),
                      ],
                    ),

                  if (project.dueDate != null && project.dueDate.isNotEmpty)
                    const SizedBox(height: 4),

                  // Jours restants avec texte adaptatif
                  Text(
                    isMediumCard
                        ? (daysRemaining > 0
                            ? '$daysRemaining j'
                            : daysRemaining == 0
                                ? "Aujourd'hui"
                                : '${daysRemaining.abs()} j retard')
                        : (daysRemaining > 0
                            ? 'Dans $daysRemaining jours'
                            : daysRemaining == 0
                                ? "Aujourd'hui"
                                : 'En retard de ${daysRemaining.abs()} jours'),
                    style: TextStyle(
                      fontSize: isMediumCard ? 10 : 12,
                      fontWeight: FontWeight.w500,
                      color: daysRemaining < 0
                          ? Colors.red
                          : daysRemaining < 3
                              ? Colors.orange
                              : Colors.grey[700],
                    ),
                  ),
                ],
              ),
            ),

            // Status indicator
            Container(
              padding: EdgeInsets.symmetric(
                  horizontal: isMediumCard ? 6 : 8,
                  vertical: isMediumCard ? 3 : 4),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border:
                    Border.all(color: statusColor.withOpacity(0.3), width: 1),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircleAvatar(
                    radius: 3,
                    backgroundColor: statusColor,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    _getStatusText(),
                    style: TextStyle(
                      fontSize: isMediumCard ? 10 : 12,
                      fontWeight: FontWeight.w500,
                      color: statusColor,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),

        const SizedBox(height: 12),

        // Footer with team members and issues count
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Team members
            if (project.teamMembers.isNotEmpty)
              _buildTeamMembersAvatars(isSmallCard),

            // Issues count if any
            if (project.issuesCount != null && project.issuesCount > 0)
              Container(
                padding: EdgeInsets.symmetric(
                    horizontal: isMediumCard ? 6 : 8,
                    vertical: isMediumCard ? 2 : 3),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.error_outline,
                        size: isMediumCard ? 12 : 14, color: Colors.grey[700]),
                    const SizedBox(width: 4),
                    Text(
                      '${project.issuesCount}',
                      style: TextStyle(
                        fontSize: isMediumCard ? 10 : 12,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey[700],
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ],
    );
  }
}
