import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/auth_controller.dart';
import '../../config/app_routes.dart';
import 'settings_card.dart';

class MainSettingsPage extends StatelessWidget {
  final Function(String) onNavigate;

  const MainSettingsPage({
    Key? key,
    required this.onNavigate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    // Couleurs adaptées au thème sombre
    final sectionBgColor = isDarkMode
        ? theme.primaryColor.withOpacity(0.25)
        : theme.primaryColor.withOpacity(0.1);

    final sectionBorderColor = isDarkMode
        ? theme.primaryColor.withOpacity(0.5)
        : theme.primaryColor.withOpacity(0.2);

    final sectionTextColor =
        isDarkMode ? Colors.white.withOpacity(0.9) : theme.primaryColor;

    final helpBoxBgColor = isDarkMode
        ? Color.alphaBlend(
            theme.primaryColor.withOpacity(0.2), Colors.grey.shade900)
        : theme.primaryColor.withOpacity(0.05);

    final helpIconBgColor = isDarkMode
        ? theme.primaryColor.withOpacity(0.3)
        : theme.primaryColor.withOpacity(0.1);

    final normalTextColor =
        isDarkMode ? Colors.white.withOpacity(0.8) : Colors.grey.shade700;

    final secondaryTextColor = isDarkMode ? Colors.grey.shade300 : Colors.grey;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            decoration: BoxDecoration(
              color: sectionBgColor,
              borderRadius: BorderRadius.circular(12),
              border: isDarkMode
                  ? Border.all(color: sectionBorderColor, width: 1.5)
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
            child: Text(
              'Paramètres personnels',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: sectionTextColor,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Cartes pour paramètres personnels - on passe le mode sombre
          SettingsCard(
            title: 'Profil',
            description: 'Gérer vos informations personnelles',
            icon: Icons.person,
            onTap: () => onNavigate('profile'),
            isDarkMode: isDarkMode,
          ),
          SettingsCard(
            title: 'Notifications',
            description: 'Configurer les paramètres de notifications',
            icon: Icons.notifications,
            onTap: () => onNavigate('notifications'),
            isDarkMode: isDarkMode,
          ),
          SettingsCard(
            title: 'Sécurité',
            description: 'Gérer la sécurité de votre compte',
            icon: Icons.security,
            onTap: () => onNavigate('security'),
            isDarkMode: isDarkMode,
          ),

          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            decoration: BoxDecoration(
              color: sectionBgColor,
              borderRadius: BorderRadius.circular(12),
              border: isDarkMode
                  ? Border.all(color: sectionBorderColor, width: 1.5)
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
            child: Text(
              'Paramètres de l\'application',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: sectionTextColor,
              ),
            ),
          ),
          const SizedBox(height: 16),

          SettingsCard(
            title: 'Langue',
            description: 'Changer la langue de l\'application',
            icon: Icons.language,
            onTap: () => onNavigate('language'),
            isDarkMode: isDarkMode,
          ),
          SettingsCard(
            title: 'Données',
            description: 'Gérer vos données et exportations',
            icon: Icons.storage,
            onTap: () => onNavigate('data'),
            isDarkMode: isDarkMode,
          ),

          const SizedBox(height: 24),

          // Section d'aide - améliorée pour le mode sombre
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: helpBoxBgColor,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: sectionBorderColor,
                width: isDarkMode ? 1.5 : 1,
              ),
              boxShadow: isDarkMode
                  ? [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 4,
                        spreadRadius: 0,
                      )
                    ]
                  : null,
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: helpIconBgColor,
                    borderRadius: BorderRadius.circular(12),
                    border: isDarkMode
                        ? Border.all(
                            color: theme.primaryColor.withOpacity(0.5),
                            width: 1.5,
                          )
                        : null,
                  ),
                  child: Icon(
                    Icons.help,
                    color: isDarkMode
                        ? theme.primaryColor.withOpacity(0.9)
                        : theme.primaryColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Besoin d\'aide ?',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDarkMode ? Colors.white : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Si vous avez des questions sur les paramètres, consultez notre centre d\'aide.',
                        style: TextStyle(color: normalTextColor),
                      ),
                      const SizedBox(height: 8),
                      GestureDetector(
                        onTap: () => _showNotification(context,
                            'Redirection vers le centre d\'aide', true),
                        child: Text(
                          'Visiter le centre d\'aide',
                          style: TextStyle(
                            color: theme.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Informations sur l'application - avec meilleure visibilité en mode sombre
          Center(
            child: Column(
              children: [
                Text(
                  '2SB Kanban - Version 1.0.0',
                  style: TextStyle(
                    color: secondaryTextColor,
                    fontSize: 12,
                    fontWeight:
                        isDarkMode ? FontWeight.w500 : FontWeight.normal,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '© 2025 2SB Kanban. Tous droits réservés.',
                  style: TextStyle(
                    color: secondaryTextColor,
                    fontSize: 12,
                    fontWeight:
                        isDarkMode ? FontWeight.w500 : FontWeight.normal,
                  ),
                ),
                const SizedBox(height: 16),
                TextButton.icon(
                  onPressed: () {
                    context.read<AuthController>().logout();
                    Navigator.pushReplacementNamed(context, AppRoutes.login);
                  },
                  icon: Icon(
                    Icons.logout,
                    color: Colors.red.shade400,
                    size: 20,
                  ),
                  label: Text(
                    'Se déconnecter',
                    style: TextStyle(
                      color: Colors.red.shade400,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 10,
                    ),
                    backgroundColor: isDarkMode
                        ? Colors.red.withOpacity(0.1)
                        : Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                      side: isDarkMode
                          ? BorderSide(color: Colors.red.withOpacity(0.3))
                          : BorderSide.none,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showNotification(BuildContext context, String message, bool isSuccess) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isSuccess ? Colors.green : Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }
}
