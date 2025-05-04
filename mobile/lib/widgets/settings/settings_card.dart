import 'package:flutter/material.dart';

class SettingsCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final VoidCallback onTap;
  final bool isDarkMode;

  const SettingsCard({
    Key? key,
    required this.title,
    required this.description,
    required this.icon,
    required this.onTap,
    this.isDarkMode = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Couleurs adaptées au thème sombre
    final cardColor = isDarkMode
        ? Color.alphaBlend(
            theme.cardColor.withOpacity(0.2), Colors.grey.shade900)
        : theme.cardColor;

    final titleColor = isDarkMode ? Colors.white : Colors.black87;

    final descriptionColor =
        isDarkMode ? Colors.grey.shade300 : Colors.grey.shade700;

    final iconBgColor = isDarkMode
        ? theme.primaryColor.withOpacity(0.3)
        : theme.primaryColor.withOpacity(0.1);

    final iconColor =
        isDarkMode ? theme.primaryColor.withOpacity(0.9) : theme.primaryColor;

    final arrowColor =
        isDarkMode ? theme.primaryColor.withOpacity(0.8) : theme.primaryColor;

    final borderColor =
        isDarkMode ? theme.dividerColor.withOpacity(0.2) : Colors.transparent;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      elevation: isDarkMode ? 3 : 2,
      shadowColor: isDarkMode ? Colors.black45 : Colors.black12,
      color: cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: borderColor),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: iconBgColor,
                  borderRadius: BorderRadius.circular(12),
                  border: isDarkMode
                      ? Border.all(
                          color: theme.primaryColor.withOpacity(0.4),
                          width: 1.5,
                        )
                      : null,
                  boxShadow: isDarkMode
                      ? [
                          BoxShadow(
                            color: theme.primaryColor.withOpacity(0.1),
                            blurRadius: 4,
                            spreadRadius: 0,
                          )
                        ]
                      : null,
                ),
                child: Icon(
                  icon,
                  color: iconColor,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: titleColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      description,
                      style: TextStyle(
                        color: descriptionColor,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios, size: 16, color: arrowColor),
            ],
          ),
        ),
      ),
    );
  }
}
