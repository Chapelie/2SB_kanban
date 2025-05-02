import 'package:flutter/material.dart';
import '../models/project.dart';

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
      case ProjectStatus.offtrack:
        return Colors.red;
      case ProjectStatus.ontrack:
        return Colors.blue;
      case ProjectStatus.completed:
        return Colors.green;
    }
  }

  String _getStatusText() {
    switch (project.status) {
      case ProjectStatus.offtrack:
        return 'En retard';
      case ProjectStatus.ontrack:
        return 'En cours';
      case ProjectStatus.completed:
        return 'Terminé';
    }
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Taille disponible pour la carte
        final maxWidth = constraints.maxWidth;
        final isSmallCard = maxWidth < 300;
        final isMediumCard = maxWidth >= 300 && maxWidth < 400;
        final isLargeCard = maxWidth >= 400;

        // Ajuster la taille du texte en fonction de la largeur disponible
        final titleStyle = isSmallCard
            ? Theme.of(context)
                .textTheme
                .titleSmall
                ?.copyWith(fontWeight: FontWeight.bold)
            : isMediumCard
                ? Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold)
                : Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.bold);

        final descriptionStyle = isSmallCard
            ? Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 11)
            : isMediumCard
                ? Theme.of(context).textTheme.bodySmall
                : Theme.of(context).textTheme.bodyMedium;

        return GestureDetector(
          onTap: onTap ??
              () {
                // Si onTap n'est pas fourni, utilisez une navigation par défaut
                Navigator.pushNamed(
                  context,
                  'project_detail',
                  arguments: project.id,
                );
              },
          child: Card(
            elevation: 4,
            clipBehavior: Clip.antiAlias,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Barre de couleur en haut de la carte
                Container(
                  height: 8,
                  color: _getStatusColor(),
                ),

                // Contenu principal avec badge de jours restants
                Stack(
                  children: [
                    // Contenu principal
                    Padding(
                      padding: EdgeInsets.all(isSmallCard ? 12.0 : 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Titre du projet
                          Text(
                            'Projet',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      fontWeight: FontWeight.bold,
                                      fontSize: isSmallCard ? 10 : 12,
                                    ),
                          ),
                          SizedBox(height: isSmallCard ? 2 : 4),
                          Text(
                            project.title,
                            style: titleStyle,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(height: isSmallCard ? 6 : 8),

                          // Badge de statut
                          if (maxWidth >= 320) _buildStatusBadge(isSmallCard),
                          SizedBox(height: isSmallCard ? 12 : 16),

                          // Description du projet
                          Text(
                            project.description,
                            style: descriptionStyle,
                            maxLines: isSmallCard ? 1 : 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(height: isSmallCard ? 16 : 24),

                          // Infos en bas de la carte
                          Row(
                            children: [
                              // Avatars des membres
                              if (maxWidth >=
                                  300) // Cacher les avatars sur très petits écrans
                                _buildTeamAvatars(isSmallCard),

                              const Spacer(),

                              // Nombre de problèmes - adapté pour les petits écrans
                              if (project.issuesCount > 0)
                                _buildIssuesBadge(isSmallCard),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // Badge de jours restants
                    if (project.daysRemaining <= 7 && project.daysRemaining > 0)
                      _buildDaysRemainingBadge(isSmallCard),

                    // Badge de jours en retard
                    if (project.daysRemaining < 0)
                      _buildOverdueBadge(isSmallCard),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatusBadge(bool isSmallCard) {
    final Color color = _getStatusColor();
    final String text = _getStatusText();

    return Container(
      padding: EdgeInsets.symmetric(
          horizontal: isSmallCard ? 6 : 8, vertical: isSmallCard ? 3 : 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: isSmallCard ? 5 : 6,
            height: isSmallCard ? 5 : 6,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          SizedBox(width: isSmallCard ? 3 : 4),
          Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: isSmallCard ? 9 : 10,
              fontWeight: FontWeight.bold,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildTeamAvatars(bool isSmallCard) {
    final int maxDisplay = isSmallCard ? 2 : 3;

    return Row(
      children: [
        for (int i = 0;
            i < project.teamMembers.length.clamp(0, maxDisplay);
            i++)
          Container(
            margin: EdgeInsets.only(left: i == 0 ? 0 : -8),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2),
            ),
            child: CircleAvatar(
              radius: isSmallCard ? 12 : 14,
              backgroundColor: Colors.indigo.withOpacity(0.2),
              backgroundImage: project.teamMembers[i].avatar.isNotEmpty
                  ? NetworkImage(project.teamMembers[i].avatar)
                  : null,
              child: project.teamMembers[i].avatar.isEmpty
                  ? Text(
                      project.teamMembers[i].initials,
                      style: TextStyle(
                        color: Colors.indigo,
                        fontSize: isSmallCard ? 8 : 10,
                        fontWeight: FontWeight.bold,
                      ),
                    )
                  : null,
            ),
          ),
        if (project.teamMembers.length > maxDisplay)
          Container(
            margin: const EdgeInsets.only(left: -8),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2),
            ),
            child: CircleAvatar(
              radius: isSmallCard ? 12 : 14,
              backgroundColor: Colors.grey.shade300,
              child: Text(
                '+${project.teamMembers.length - maxDisplay}',
                style: TextStyle(
                  color: Colors.grey.shade800,
                  fontSize: isSmallCard ? 8 : 10,
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildIssuesBadge(bool isSmallCard) {
    return Container(
      padding: EdgeInsets.symmetric(
          horizontal: isSmallCard ? 6 : 8, vertical: isSmallCard ? 3 : 4),
      decoration: BoxDecoration(
        color: Colors.red.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.warning_amber_rounded,
            color: Colors.red,
            size: isSmallCard ? 12 : 16,
          ),
          SizedBox(width: isSmallCard ? 2 : 4),
          Text(
            isSmallCard
                ? '${project.issuesCount}'
                : '${project.issuesCount} issues',
            style: TextStyle(
              color: Colors.red,
              fontSize: isSmallCard ? 10 : 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDaysRemainingBadge(bool isSmallCard) {
    return Positioned(
      top: isSmallCard ? 4 : 8,
      right: isSmallCard ? 4 : 8,
      child: Container(
        padding: EdgeInsets.symmetric(
            horizontal: isSmallCard ? 6 : 10, vertical: isSmallCard ? 4 : 6),
        decoration: BoxDecoration(
          color: Colors.orange,
          borderRadius: BorderRadius.circular(isSmallCard ? 6 : 8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.calendar_today,
              color: Colors.white,
              size: isSmallCard ? 10 : 14,
            ),
            SizedBox(width: isSmallCard ? 2 : 4),
            Text(
              isSmallCard
                  ? '${project.daysRemaining}j'
                  : '${project.daysRemaining} jours',
              style: TextStyle(
                color: Colors.white,
                fontSize: isSmallCard ? 10 : 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOverdueBadge(bool isSmallCard) {
    return Positioned(
      top: isSmallCard ? 4 : 8,
      right: isSmallCard ? 4 : 8,
      child: Container(
        padding: EdgeInsets.symmetric(
            horizontal: isSmallCard ? 6 : 10, vertical: isSmallCard ? 4 : 6),
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(isSmallCard ? 6 : 8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.calendar_today,
              color: Colors.white,
              size: isSmallCard ? 10 : 14,
            ),
            SizedBox(width: isSmallCard ? 2 : 4),
            Text(
              isSmallCard
                  ? '-${project.daysRemaining.abs()}j'
                  : 'Dépassé de ${project.daysRemaining.abs()} j',
              style: TextStyle(
                color: Colors.white,
                fontSize: isSmallCard ? 10 : 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
