import 'package:flutter/material.dart';
import '../../models/project.dart';
import '../../config/themes.dart';

class ProjectHeader extends StatelessWidget {
  final Project project;

  const ProjectHeader({
    Key? key,
    required this.project,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkTheme = theme.brightness == Brightness.dark;

    return LayoutBuilder(
      builder: (context, constraints) {
        // Détection responsive
        final isSmallScreen = constraints.maxWidth < 360;
        final isMediumScreen = constraints.maxWidth < 500 && !isSmallScreen;

        return Container(
          padding: EdgeInsets.all(isSmallScreen ? 14 : 16),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(16),
              bottomRight: Radius.circular(16),
            ),
            boxShadow: [
              BoxShadow(
                color: isDarkTheme
                    ? Colors.black.withOpacity(0.2)
                    : Colors.black.withOpacity(0.05),
                offset: const Offset(0, 2),
                blurRadius: 4,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Description avec style amélioré
              Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                    width: 1,
                  ),
                ),
                child: Text(
                  project.description,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontSize: isSmallScreen ? 13 : 14,
                    height: 1.5,
                    letterSpacing: 0.2,
                  ),
                ),
              ),

              SizedBox(height: isSmallScreen ? 14 : 18),

              // Layout adaptatif pour les informations
              if (isSmallScreen)
                _buildSmallScreenInfo(context, theme)
              else if (isMediumScreen)
                _buildMediumScreenInfo(context, theme)
              else
                _buildLargeScreenInfo(context, theme),
            ],
          ),
        );
      },
    );
  }

  // Petit écran: Layout vertical
  Widget _buildSmallScreenInfo(BuildContext context, ThemeData theme) {
    return Column(
      children: [
        // Ligne 1: Membres
        _buildInfoRow(
          context,
          icon: Icons.people_outline,
          title: 'Équipe',
          value:
              '${project.teamMembers.length} membre${project.teamMembers.length > 1 ? 's' : ''}',
          theme: theme,
        ),

        const SizedBox(height: 12),

        // Ligne 2: Échéance
        _buildInfoRow(
          context,
          icon: Icons.calendar_today,
          title: 'Échéance',
          value: project.dueDate,
          theme: theme,
        ),

        const SizedBox(height: 12),

        // Ligne 3: Statut (centré)
        Center(child: _buildStatusBadge(context, theme, false)),
      ],
    );
  }

  // Écran moyen: 2 lignes
  Widget _buildMediumScreenInfo(BuildContext context, ThemeData theme) {
    return Column(
      children: [
        // Ligne 1: Membres et Échéance
        Row(
          children: [
            // Membres (50%)
            Expanded(
              child: _buildInfoRow(
                context,
                icon: Icons.people_outline,
                title: 'Équipe',
                value:
                    '${project.teamMembers.length} membre${project.teamMembers.length > 1 ? 's' : ''}',
                theme: theme,
              ),
            ),

            const SizedBox(width: 16),

            // Échéance (50%)
            Expanded(
              child: _buildInfoRow(
                context,
                icon: Icons.calendar_today,
                title: 'Échéance',
                value: project.dueDate,
                theme: theme,
              ),
            ),
          ],
        ),

        const SizedBox(height: 14),

        // Ligne 2: Statut (centré)
        Center(child: _buildStatusBadge(context, theme, false)),
      ],
    );
  }

  // Grand écran: Layout horizontal
  Widget _buildLargeScreenInfo(BuildContext context, ThemeData theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Membres de l'équipe
        _buildInfoItem(
          context,
          icon: Icons.people_outline,
          text:
              '${project.teamMembers.length} membre${project.teamMembers.length > 1 ? 's' : ''}',
          theme: theme,
        ),

        // Date d'échéance
        _buildInfoItem(
          context,
          icon: Icons.calendar_today,
          text: project.dueDate,
          theme: theme,
        ),

        // Statut
        _buildStatusBadge(context, theme, true),
      ],
    );
  }

  // Widget d'information avec icône et texte pour les grands écrans
  Widget _buildInfoItem(
    BuildContext context, {
    required IconData icon,
    required String text,
    required ThemeData theme,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            size: 20,
            color: theme.colorScheme.primary,
          ),
        ),
        const SizedBox(width: 10),
        Text(
          text,
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  // Ligne d'information avec titre et valeur pour les petits écrans
  Widget _buildInfoRow(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String value,
    required ThemeData theme,
  }) {
    return Row(
      children: [
        // Icône dans un cercle
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            size: 18,
            color: theme.colorScheme.primary,
          ),
        ),
        const SizedBox(width: 12),

        // Texte et valeur
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                color: theme.textTheme.bodySmall?.color,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }

  // Badge de statut amélioré
  Widget _buildStatusBadge(
      BuildContext context, ThemeData theme, bool isLarge) {
    final statusColor = _getStatusColor(project.status);

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isLarge ? 12 : 14,
        vertical: 8,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            statusColor.withOpacity(0.8),
            statusColor,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: statusColor.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _getStatusIcon(project.status),
            size: isLarge ? 16 : 14,
            color: Colors.white,
          ),
          const SizedBox(width: 6),
          Text(
            _getStatusText(project.status),
            style: TextStyle(
              color: Colors.white,
              fontSize: isLarge ? 13 : 12,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.3,
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(ProjectStatus status) {
    switch (status) {
      case ProjectStatus.offtrack:
        return Colors.red.shade600;
      case ProjectStatus.ontrack:
        return Colors.blue.shade600;
      case ProjectStatus.completed:
        return Colors.green.shade600;
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
