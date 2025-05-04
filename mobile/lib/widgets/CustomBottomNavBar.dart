import 'package:flutter/material.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    // Couleurs adaptées au thème
    final backgroundColor = isDarkMode
        ? Color.alphaBlend(
            theme.cardColor.withOpacity(0.2), Colors.grey.shade900)
        : Colors.white;

    final shadowColor = isDarkMode
        ? Colors.black.withOpacity(0.2)
        : Colors.black.withOpacity(0.06);

    final borderColor = isDarkMode ? Colors.grey.shade800 : Colors.transparent;

    return Container(
      height: 80,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(30),
        border: isDarkMode ? Border.all(color: borderColor) : null,
        boxShadow: [
          BoxShadow(
            color: shadowColor,
            blurRadius: 12,
            offset: const Offset(0, 5),
            spreadRadius: isDarkMode ? 1 : 0,
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildNavItem(
            context: context,
            index: 0,
            icon: Icons.dashboard,
            label: 'Accueil',
            isActive: currentIndex == 0,
            isDarkMode: isDarkMode,
          ),
          _buildNavItem(
            context: context,
            index: 1,
            icon: Icons.folder,
            label: 'Projets',
            isActive: currentIndex == 1,
            isDarkMode: isDarkMode,
          ),
          _buildNavItem(
            context: context,
            index: 2,
            icon: Icons.task,
            label: 'Tâches',
            isActive: currentIndex == 2,
            isDarkMode: isDarkMode,
          ),
          _buildNavItem(
            context: context,
            index: 3,
            icon: Icons.person,
            label: 'Profil',
            isActive: currentIndex == 3,
            isDarkMode: isDarkMode,
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required int index,
    required IconData icon,
    required String label,
    required bool isActive,
    required bool isDarkMode,
  }) {
    final theme = Theme.of(context);
    final Color activeColor = theme.colorScheme.primary;
    final Color inactiveColor =
        isDarkMode ? Colors.grey.shade500 : Colors.grey.shade400;

    // Couleurs adaptées au thème
    final itemBackgroundColor = isActive
        ? activeColor
        : (isDarkMode ? Colors.transparent : Colors.white);

    final itemBorderColor = isActive
        ? activeColor
        : (isDarkMode ? Colors.grey.shade700 : Colors.grey.shade200);

    final labelColor = isActive
        ? activeColor
        : (isDarkMode ? Colors.grey.shade400 : inactiveColor);

    final iconColor = isActive
        ? Colors.white
        : (isDarkMode ? Colors.grey.shade400 : inactiveColor);

    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Conteneur avec l'icône - lumineux pour tous les éléments actifs
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: itemBackgroundColor,
              shape: BoxShape.circle,
              border: Border.all(
                color: itemBorderColor,
                width: 2,
              ),
              boxShadow: isActive
                  ? [
                      BoxShadow(
                        color: activeColor.withOpacity(isDarkMode ? 0.4 : 0.3),
                        blurRadius: 10,
                        spreadRadius: isDarkMode ? 1 : 2,
                      ),
                    ]
                  : null,
            ),
            child: Icon(
              icon,
              color: iconColor,
              size: 24,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: labelColor,
              fontSize: 12,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
