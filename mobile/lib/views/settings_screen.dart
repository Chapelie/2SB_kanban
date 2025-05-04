import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/auth_controller.dart';
import '../providers/theme_provider.dart';
import '../widgets/settings/notification_setting_tile.dart';
import '../widgets/settings/notification_preference.dart';
import '../widgets/settings/main_settings_page.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  // Page active dans les paramètres
  String _activePage = 'main';
  bool _isDarkMode = false;
  String _selectedLanguage = 'fr';
  bool _emailNotifications = true;
  bool _pushNotifications = true;
  bool _twoFactorAuth = false;

  // Afficher une notification
  void _showNotification(String message, bool isSuccess) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isSuccess ? Colors.green : Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: _activePage == 'main'
          ? AppBar(
              title: const Text('Paramètres',
                  style: TextStyle(fontWeight: FontWeight.bold)),
              elevation: 0,
              actions: [
                IconButton(
                  icon: const Icon(Icons.account_circle),
                  onPressed: () => Navigator.pop(context),
                  tooltip: 'Retour au profil',
                ),
              ],
            )
          : AppBar(
              leading: IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => setState(() => _activePage = 'main'),
              ),
              title: Text(_getPageTitle(),
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              elevation: 0,
            ),
      body: Container(
        color: theme.scaffoldBackgroundColor,
        child: _renderActivePage(),
      ),
    );
  }

  Widget _renderActivePage() {
    switch (_activePage) {
      case 'profile':
        return _buildProfilePage();
      case 'notifications':
        return _buildNotificationsPage();
      case 'security':
        return _buildSecurityPage();
      case 'language':
        return _buildLanguagePage();
      case 'data':
        return _buildDataPage();
      case 'about':
        return _buildAboutPage();
      default:
        return MainSettingsPage(
          onNavigate: (page) => setState(() => _activePage = page),
        );
    }
  }

  String _getPageTitle() {
    switch (_activePage) {
      case 'profile':
        return 'Profil';
      case 'notifications':
        return 'Notifications';
      case 'security':
        return 'Sécurité';
      case 'language':
        return 'Langue';
      case 'data':
        return 'Données';
      case 'about':
        return 'À propos';
      default:
        return 'Paramètres';
    }
  }

  // Page de profil
  Widget _buildProfilePage() {
    final user = context.read<AuthController>().currentUser;
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    final nameController =
        TextEditingController(text: user?.name ?? 'Utilisateur');
    final emailController =
        TextEditingController(text: user?.email ?? 'utilisateur@example.com');
    final phoneController = TextEditingController(text: '+226 70 00 00 00');
    final locationController =
        TextEditingController(text: 'Bobo, Burkina Faso');

    return SingleChildScrollView(
      padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Photo de profil et informations de base
          Card(
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 16.0 : 24.0),
              child: Column(
                children: [
                  // Avatar
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: isSmallScreen ? 40 : 50,
                        backgroundColor: theme.primaryColor.withOpacity(0.2),
                        backgroundImage: user?.avatar != null
                            ? NetworkImage(user!.avatar)
                            : null,
                        child: user?.avatar == null
                            ? Icon(
                                Icons.person,
                                size: isSmallScreen ? 50 : 60,
                                color: theme.primaryColor,
                              )
                            : null,
                      ),
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: theme.primaryColor,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: theme.scaffoldBackgroundColor,
                              width: 2,
                            ),
                          ),
                          child: GestureDetector(
                            onTap: () => _showNotification(
                                'Changement de photo de profil à venir', false),
                            child: const Icon(
                              Icons.camera_alt,
                              size: 16,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Nom et statut
                  Text(
                    user?.name ?? 'Utilisateur',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 20 : 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user?.email ?? 'utilisateur@example.com',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 14 : 16,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: isSmallScreen ? 10 : 12,
                      vertical: isSmallScreen ? 4 : 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(
                        color: Colors.green.withOpacity(0.5),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Colors.green,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          'Actif',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: Colors.green,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Informations personnelles
          Card(
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Informations personnelles',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),

                  // Nom
                  _buildTextField(
                    controller: nameController,
                    label: 'Nom complet',
                    icon: Icons.person,
                    isSmallScreen: isSmallScreen,
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),

                  // Email
                  _buildTextField(
                    controller: emailController,
                    label: 'Email',
                    icon: Icons.email,
                    isSmallScreen: isSmallScreen,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),

                  // Téléphone
                  _buildTextField(
                    controller: phoneController,
                    label: 'Téléphone',
                    icon: Icons.phone,
                    isSmallScreen: isSmallScreen,
                    keyboardType: TextInputType.phone,
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),

                  // Lieu
                  _buildTextField(
                    controller: locationController,
                    label: 'Localisation',
                    icon: Icons.location_on,
                    isSmallScreen: isSmallScreen,
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Bouton de mise à jour
          Center(
            child: ElevatedButton.icon(
              onPressed: () async {
                // Utiliser le contrôleur d'authentification pour mettre à jour le profil
                final authController = context.read<AuthController>();
                final user = authController.currentUser;

                if (user != null) {
                  try {
                    final success = await authController.updateProfile(
                      name: nameController.text.trim(),
                      email: emailController.text.trim(),
                      location: locationController.text.trim(),
                    );

                    if (success) {
                      _showNotification('Profil mis à jour avec succès', true);
                    } else {
                      _showNotification(
                        authController.error ??
                            'Erreur lors de la mise à jour du profil',
                        false,
                      );
                    }
                  } catch (e) {
                    _showNotification(
                        'Erreur lors de la mise à jour du profil', false);
                  }
                } else {
                  _showNotification(
                      'Vous devez être connecté pour mettre à jour votre profil',
                      false);
                }
              },
              icon: Icon(Icons.save, size: isSmallScreen ? 18 : 20),
              label: Text(
                  isSmallScreen ? 'Enregistrer' : 'Mettre à jour le profil'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(isSmallScreen ? 150 : 200, 45),
                backgroundColor: theme.primaryColor,
              ),
            ),
          ),

          const SizedBox(height: 20),
        ],
      ),
    );
  }

  // Helper pour les champs de texte du profil
  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required bool isSmallScreen,
    TextInputType keyboardType = TextInputType.text,
  }) {
    final theme = Theme.of(context);

    return TextField(
      controller: controller,
      style: TextStyle(fontSize: isSmallScreen ? 14 : 16),
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(fontSize: isSmallScreen ? 14 : 16),
        prefixIcon: Icon(icon, color: theme.primaryColor),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: theme.primaryColor, width: 2),
        ),
        contentPadding: EdgeInsets.symmetric(
          horizontal: 16,
          vertical: isSmallScreen ? 12 : 16,
        ),
      ),
    );
  }

  // Page de notifications
  Widget _buildNotificationsPage() {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    return SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Notifications',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Notifications par email
                    NotificationSettingTile(
                      icon: Icons.email,
                      title: 'Notifications par email',
                      subtitle: 'Recevoir des notifications par email',
                      value: _emailNotifications,
                      onChanged: (value) {
                        setState(() {
                          _emailNotifications = value;
                        });
                        _showNotification(
                            'Paramètre de notification par email mis à jour',
                            true);
                      },
                      isSmallScreen: isSmallScreen,
                    ),

                    const Divider(),

                    // Notifications push
                    NotificationSettingTile(
                      icon: Icons.notifications,
                      title: 'Notifications push',
                      subtitle: 'Recevoir des notifications sur votre appareil',
                      value: _pushNotifications,
                      onChanged: (value) {
                        setState(() {
                          _pushNotifications = value;
                        });
                        _showNotification(
                            'Paramètre de notification push mis à jour', true);
                      },
                      isSmallScreen: isSmallScreen,
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: isSmallScreen ? 16 : 24),
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Types de notifications',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Types de notifications
                    NotificationPreference(
                      title: 'Nouvelles tâches assignées',
                      initialValue: true,
                      isSmallScreen: isSmallScreen,
                      onChanged: (value) => _showNotification(
                          'Préférence "Nouvelles tâches assignées" mise à jour',
                          true),
                    ),
                    NotificationPreference(
                      title: 'Mises à jour des tâches',
                      initialValue: true,
                      isSmallScreen: isSmallScreen,
                      onChanged: (value) => _showNotification(
                          'Préférence "Mises à jour des tâches" mise à jour',
                          true),
                    ),
                    NotificationPreference(
                      title: 'Commentaires sur les tâches',
                      initialValue: true,
                      isSmallScreen: isSmallScreen,
                      onChanged: (value) => _showNotification(
                          'Préférence "Commentaires sur les tâches" mise à jour',
                          true),
                    ),
                    NotificationPreference(
                      title: 'Nouveaux membres dans un projet',
                      initialValue: false,
                      isSmallScreen: isSmallScreen,
                      onChanged: (value) => _showNotification(
                          'Préférence "Nouveaux membres dans un projet" mise à jour',
                          true),
                    ),
                    NotificationPreference(
                      title: 'Rappels d\'échéance',
                      initialValue: true,
                      isSmallScreen: isSmallScreen,
                      onChanged: (value) => _showNotification(
                          'Préférence "Rappels d\'échéance" mise à jour', true),
                    ),
                  ],
                ),
              ),
            ),
            Card(
              margin: EdgeInsets.only(top: isSmallScreen ? 16 : 24),
              elevation: 2,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Fréquence',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Fréquence des notifications
                    RadioListTile<String>(
                      title: const Text('Immédiate'),
                      value: 'immediate',
                      groupValue: 'immediate',
                      onChanged: (value) {
                        _showNotification(
                            'Fréquence modifiée: Immédiate', true);
                      },
                      activeColor: theme.primaryColor,
                      contentPadding: EdgeInsets.zero,
                    ),
                    RadioListTile<String>(
                      title: const Text('Toutes les heures'),
                      value: 'hourly',
                      groupValue: 'immediate',
                      onChanged: (value) {
                        _showNotification('Option disponible bientôt', false);
                      },
                      activeColor: theme.primaryColor,
                      contentPadding: EdgeInsets.zero,
                    ),
                    RadioListTile<String>(
                      title: const Text('Quotidienne'),
                      value: 'daily',
                      groupValue: 'immediate',
                      onChanged: (value) {
                        _showNotification('Option disponible bientôt', false);
                      },
                      activeColor: theme.primaryColor,
                      contentPadding: EdgeInsets.zero,
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: isSmallScreen ? 20 : 24),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  _showNotification(
                      'Paramètres de notifications enregistrés', true);
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: Size(isSmallScreen ? 150 : 200, 45),
                  backgroundColor: theme.primaryColor,
                ),
                child: const Text('Enregistrer les modifications'),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // Page de sécurité
  Widget _buildSecurityPage() {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();

    return SingleChildScrollView(
      padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Changer le mot de passe
          Card(
            margin: EdgeInsets.only(bottom: isSmallScreen ? 12 : 16),
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Changer le mot de passe',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),

                  // Mot de passe actuel
                  _buildPasswordField(
                    controller: currentPasswordController,
                    label: 'Mot de passe actuel',
                    isSmallScreen: isSmallScreen,
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),

                  // Nouveau mot de passe
                  _buildPasswordField(
                    controller: newPasswordController,
                    label: 'Nouveau mot de passe',
                    isSmallScreen: isSmallScreen,
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),

                  // Confirmer le nouveau mot de passe
                  _buildPasswordField(
                    controller: confirmPasswordController,
                    label: 'Confirmer le mot de passe',
                    isSmallScreen: isSmallScreen,
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),

                  // Bouton pour changer le mot de passe
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        // Validation basique
                        if (currentPasswordController.text.isEmpty ||
                            newPasswordController.text.isEmpty ||
                            confirmPasswordController.text.isEmpty) {
                          _showNotification(
                              'Veuillez remplir tous les champs', false);
                          return;
                        }

                        if (newPasswordController.text !=
                            confirmPasswordController.text) {
                          _showNotification(
                              'Les nouveaux mots de passe ne correspondent pas',
                              false);
                          return;
                        }

                        // Simuler un changement de mot de passe
                        _showNotification(
                            'Mot de passe modifié avec succès', true);
                        currentPasswordController.clear();
                        newPasswordController.clear();
                        confirmPasswordController.clear();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.primaryColor,
                        padding: EdgeInsets.symmetric(
                          vertical: isSmallScreen ? 10 : 12,
                        ),
                      ),
                      child: Text(
                        'Changer le mot de passe',
                        style: TextStyle(
                          fontSize: isSmallScreen ? 14 : 16,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Authentification à deux facteurs
          Card(
            margin: EdgeInsets.only(bottom: isSmallScreen ? 12 : 16),
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Authentification à deux facteurs',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: const Text(
                          'Activez l\'authentification à deux facteurs pour une sécurité renforcée',
                          style: TextStyle(fontSize: 14),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Switch(
                        value: _twoFactorAuth,
                        activeColor: theme.primaryColor,
                        onChanged: (value) {
                          setState(() {
                            _twoFactorAuth = value;
                          });
                          if (value) {
                            _showNotification(
                              'L\'authentification à deux facteurs sera disponible dans une prochaine version',
                              false,
                            );
                            setState(() {
                              _twoFactorAuth = false;
                            });
                          }
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Sessions actives
          Card(
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Sessions actives',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),
                  _buildSessionItem(
                    device: 'Chrome sur Windows',
                    location: 'Bobo-Dioulasso, Burkina Faso',
                    time: 'Maintenant',
                    isCurrentDevice: true,
                    isSmallScreen: isSmallScreen,
                  ),
                  _buildSessionItem(
                    device: 'Application mobile',
                    location: 'Ouagadougou, Burkina Faso',
                    time: 'Il y a 2 jours',
                    isSmallScreen: isSmallScreen,
                  ),
                ],
              ),
            ),
          ),

          SizedBox(height: isSmallScreen ? 20 : 30),
        ],
      ),
    );
  }

  // Helper pour les champs de mot de passe
  Widget _buildPasswordField({
    required TextEditingController controller,
    required String label,
    required bool isSmallScreen,
  }) {
    return TextField(
      controller: controller,
      obscureText: true,
      style: TextStyle(fontSize: isSmallScreen ? 14 : 16),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(fontSize: isSmallScreen ? 14 : 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        contentPadding: EdgeInsets.symmetric(
          horizontal: 16,
          vertical: isSmallScreen ? 12 : 16,
        ),
      ),
    );
  }

  // Widget pour l'élément de session
  Widget _buildSessionItem({
    required String device,
    required String location,
    required String time,
    bool isCurrentDevice = false,
    required bool isSmallScreen,
  }) {
    final theme = Theme.of(context);

    return Container(
      margin: EdgeInsets.only(bottom: isSmallScreen ? 8 : 12),
      padding: EdgeInsets.all(isSmallScreen ? 8 : 12),
      decoration: BoxDecoration(
        color: isCurrentDevice
            ? theme.primaryColor.withOpacity(0.1)
            : Colors.grey.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(
            isCurrentDevice ? Icons.computer : Icons.phone_android,
            color: isCurrentDevice ? theme.primaryColor : Colors.grey[600],
            size: isSmallScreen ? 20 : 24,
          ),
          SizedBox(width: isSmallScreen ? 8 : 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  device + (isCurrentDevice ? ' (Cet appareil)' : ''),
                  style: TextStyle(
                    fontWeight:
                        isCurrentDevice ? FontWeight.bold : FontWeight.normal,
                    fontSize: isSmallScreen ? 13 : 14,
                  ),
                ),
                Text(
                  '$location • $time',
                  style: TextStyle(
                    fontSize: isSmallScreen ? 11 : 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () {
              if (isCurrentDevice) {
                _showNotification(
                    'Vous ne pouvez pas déconnecter votre session actuelle',
                    false);
              } else {
                _showNotification('Session déconnectée', true);
              }
            },
            child: Text(
              'Déconnecter',
              style: TextStyle(
                color: isCurrentDevice ? Colors.grey : Colors.red,
                fontSize: isSmallScreen ? 12 : 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Méthode pour définir le thème
  void _setTheme(ThemeProvider provider, String themeType) {
    provider.setThemeType(themeType);
    if (themeType == 'dark') {
      provider.setDarkMode(true);
    } else {
      provider.setDarkMode(false);
    }
    _showNotification('Thème $themeType appliqué!', true);
  }

  // Méthode pour comparer deux couleurs
  bool _compareColors(Color a, Color b) {
    return a.value == b.value;
  }

  // Page de langue
  Widget _buildLanguagePage() {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    // Liste des langues disponibles avec leurs drapeaux
    final languages = [
      {'code': 'fr', 'name': 'Français', 'flag': '🇫🇷'},
      {'code': 'en', 'name': 'English', 'flag': '🇬🇧'},
      {'code': 'es', 'name': 'Español', 'flag': '🇪🇸'},
      {'code': 'de', 'name': 'Deutsch', 'flag': '🇩🇪'},
      {'code': 'it', 'name': 'Italiano', 'flag': '🇮🇹'},
    ];

    return Padding(
      padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Choisissez votre langue',
            style: TextStyle(
              fontSize: isSmallScreen ? 16 : 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: isSmallScreen ? 6 : 8),
          Text(
            'L\'application sera affichée dans la langue sélectionnée.',
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: isSmallScreen ? 12 : 14,
            ),
          ),
          SizedBox(height: isSmallScreen ? 16 : 24),

          // Liste des langues
          Card(
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: languages.length,
              separatorBuilder: (context, index) => const Divider(height: 1),
              itemBuilder: (context, index) {
                final language = languages[index];
                final isSelected = language['code'] == _selectedLanguage;

                return RadioListTile(
                  title: Row(
                    children: [
                      Text(language['flag']!,
                          style: const TextStyle(fontSize: 22)),
                      SizedBox(width: isSmallScreen ? 12 : 16),
                      Text(
                        language['name']!,
                        style: TextStyle(
                          fontSize: isSmallScreen ? 14 : 16,
                        ),
                      ),
                    ],
                  ),
                  value: language['code']!,
                  groupValue: _selectedLanguage,
                  activeColor: theme.primaryColor,
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: isSmallScreen ? 12 : 16,
                    vertical: isSmallScreen ? 6 : 8,
                  ),
                  onChanged: (value) {
                    setState(() {
                      _selectedLanguage = value as String;
                    });
                  },
                );
              },
            ),
          ),

          SizedBox(height: isSmallScreen ? 20 : 24),
          Center(
            child: ElevatedButton(
              onPressed: () {
                final languageName = languages
                    .firstWhere((l) => l['code'] == _selectedLanguage)['name']!;
                _showNotification(
                  'Langue modifiée avec succès en $languageName',
                  true,
                );
              },
              style: ElevatedButton.styleFrom(
                minimumSize: Size(isSmallScreen ? 150 : 200, 45),
                backgroundColor: theme.primaryColor,
              ),
              child: const Text('Appliquer'),
            ),
          ),
        ],
      ),
    );
  }

  // Page de gestion des données
  Widget _buildDataPage() {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    return SingleChildScrollView(
      padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Exportation de données
          Card(
            margin: EdgeInsets.only(bottom: isSmallScreen ? 12 : 16),
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Exportation de données',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 8 : 16),
                  Text(
                    'Exportez vos données dans un format que vous pouvez utiliser en dehors de l\'application.',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: isSmallScreen ? 12 : 14,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () =>
                              _showNotification('Export CSV en cours...', true),
                          icon: const Icon(Icons.file_download),
                          label: Text(
                            'Exporter en CSV',
                            style: TextStyle(
                              fontSize: isSmallScreen ? 12 : 14,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: theme.primaryColor,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _showNotification(
                              'Export JSON en cours...', true),
                          icon: const Icon(Icons.file_download),
                          label: Text(
                            'Exporter en JSON',
                            style: TextStyle(
                              fontSize: isSmallScreen ? 12 : 14,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: theme.primaryColor,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Importation de données
          Card(
            margin: EdgeInsets.only(bottom: isSmallScreen ? 12 : 16),
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Importation de données',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 8 : 16),
                  Text(
                    'Importez des données à partir d\'un fichier externe.',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: isSmallScreen ? 12 : 14,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () => _showNotification(
                          'Sélectionnez un fichier à importer', true),
                      icon: const Icon(Icons.file_upload),
                      label: Text(
                        'Importer des données',
                        style: TextStyle(
                          fontSize: isSmallScreen ? 12 : 14,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(
                          vertical: isSmallScreen ? 10 : 12,
                        ),
                        backgroundColor: theme.colorScheme.secondary,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Suppression de données
          Card(
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.warning, color: Colors.red),
                      SizedBox(width: isSmallScreen ? 6 : 8),
                      Text(
                        'Zone de danger',
                        style: TextStyle(
                          fontSize: isSmallScreen ? 16 : 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.red,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: isSmallScreen ? 8 : 16),
                  Text(
                    'Ces actions sont irréversibles et pourraient entraîner une perte de données.',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: isSmallScreen ? 12 : 14,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),
                  OutlinedButton.icon(
                    onPressed: () =>
                        _showDeleteDataDialog('Effacer toutes les tâches'),
                    icon: const Icon(Icons.delete_forever),
                    label: const Text('Effacer toutes les tâches'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      minimumSize:
                          Size(double.infinity, isSmallScreen ? 40 : 45),
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 6 : 8),
                  OutlinedButton.icon(
                    onPressed: () =>
                        _showDeleteDataDialog('Effacer tous les projets'),
                    icon: const Icon(Icons.delete_forever),
                    label: const Text('Effacer tous les projets'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      minimumSize:
                          Size(double.infinity, isSmallScreen ? 40 : 45),
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 6 : 8),
                  OutlinedButton.icon(
                    onPressed: () =>
                        _showDeleteDataDialog('Supprimer mon compte'),
                    icon: const Icon(Icons.no_accounts),
                    label: const Text('Supprimer mon compte'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      minimumSize:
                          Size(double.infinity, isSmallScreen ? 40 : 45),
                    ),
                  ),
                ],
              ),
            ),
          ),

          SizedBox(height: isSmallScreen ? 20 : 30),
        ],
      ),
    );
  }

  // Boîte de dialogue de confirmation pour la suppression des données
  void _showDeleteDataDialog(String action) {
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Confirmation',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: isSmallScreen ? 18 : 20,
          ),
        ),
        content: Text(
          'Êtes-vous sûr de vouloir $action ? Cette action est irréversible.',
          style: TextStyle(
            fontSize: isSmallScreen ? 14 : 16,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _showNotification('Opération simulée pour démonstration', true);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('Confirmer'),
          ),
        ],
      ),
    );
  }

  // Page À propos
  Widget _buildAboutPage() {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    return SingleChildScrollView(
      padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logo et version
          Center(
            child: Column(
              children: [
                Container(
                  padding: EdgeInsets.all(isSmallScreen ? 16 : 24),
                  decoration: BoxDecoration(
                    color: theme.primaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.dashboard_rounded,
                    size: isSmallScreen ? 60 : 80,
                    color: theme.primaryColor,
                  ),
                ),
                SizedBox(height: isSmallScreen ? 12 : 16),
                Text(
                  '2SB Kanban',
                  style: TextStyle(
                    fontSize: isSmallScreen ? 24 : 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Version 1.0.0',
                  style: TextStyle(
                    fontSize: isSmallScreen ? 14 : 16,
                    color: theme.textTheme.bodyMedium?.color?.withOpacity(0.6),
                  ),
                ),
                SizedBox(height: isSmallScreen ? 20 : 30),
              ],
            ),
          ),

          // À propos de l'application
          Card(
            margin: EdgeInsets.only(bottom: isSmallScreen ? 12 : 16),
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'À propos de 2SB Kanban',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 8 : 12),
                  Text(
                    '2SB Kanban est une application de gestion de projets qui utilise la méthodologie Kanban pour vous aider à organiser vos tâches et suivre l\'avancement de vos projets.',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 13 : 14,
                      color: theme.textTheme.bodyMedium?.color,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 8 : 12),
                  Text(
                    'Développée par l\'équipe 2SB, cette application vise à simplifier la gestion de projets et à améliorer la productivité des équipes.',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 13 : 14,
                      color: theme.textTheme.bodyMedium?.color,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Équipe de développement
          Card(
            margin: EdgeInsets.only(bottom: isSmallScreen ? 12 : 16),
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Équipe de développement',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 8 : 12),
                  _buildDeveloperItem(
                    name: 'John Doe',
                    role: 'Développeur principal',
                    isSmallScreen: isSmallScreen,
                  ),
                  _buildDeveloperItem(
                    name: 'Jane Smith',
                    role: 'Designer UI/UX',
                    isSmallScreen: isSmallScreen,
                  ),
                  _buildDeveloperItem(
                    name: 'Mike Johnson',
                    role: 'Gestionnaire de projet',
                    isSmallScreen: isSmallScreen,
                  ),
                ],
              ),
            ),
          ),

          // Licences et mentions légales
          Card(
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Licences et mentions légales',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 8 : 12),
                  Text(
                    '© 2025 2SB Kanban. Tous droits réservés.',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 13 : 14,
                      color: theme.textTheme.bodyMedium?.color,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 8 : 12),
                  InkWell(
                    onTap: () =>
                        _showNotification('Conditions d\'utilisation', true),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Icon(
                            Icons.description,
                            size: isSmallScreen ? 16 : 18,
                            color: theme.primaryColor,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Conditions d\'utilisation',
                            style: TextStyle(
                              fontSize: isSmallScreen ? 13 : 14,
                              color: theme.primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () =>
                        _showNotification('Politique de confidentialité', true),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Icon(
                            Icons.privacy_tip,
                            size: isSmallScreen ? 16 : 18,
                            color: theme.primaryColor,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Politique de confidentialité',
                            style: TextStyle(
                              fontSize: isSmallScreen ? 13 : 14,
                              color: theme.primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () => _showNotification('Licences tierces', true),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Icon(
                            Icons.article,
                            size: isSmallScreen ? 16 : 18,
                            color: theme.primaryColor,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Licences tierces',
                            style: TextStyle(
                              fontSize: isSmallScreen ? 13 : 14,
                              color: theme.primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          SizedBox(height: isSmallScreen ? 20 : 30),
        ],
      ),
    );
  }

  // Helper pour l'élément développeur
  Widget _buildDeveloperItem({
    required String name,
    required String role,
    required bool isSmallScreen,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          CircleAvatar(
            radius: isSmallScreen ? 16 : 20,
            backgroundColor: Colors.grey[300],
            child: Text(
              name.substring(0, 1),
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: isSmallScreen ? 12 : 14,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name,
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: isSmallScreen ? 13 : 14,
                ),
              ),
              Text(
                role,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: isSmallScreen ? 12 : 13,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Page d'aide
  Widget _buildHelpPage() {
    final theme = Theme.of(context);
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 360;

    return SingleChildScrollView(
      padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // FAQ
          Card(
            margin: EdgeInsets.only(bottom: isSmallScreen ? 12 : 16),
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Foire aux questions',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),
                  _buildFaqItem(
                    question: 'Comment créer un nouveau projet ?',
                    answer:
                        'Pour créer un nouveau projet, accédez à l\'onglet Projets et appuyez sur le bouton + en bas à droite de l\'écran.',
                    isSmallScreen: isSmallScreen,
                  ),
                  _buildFaqItem(
                    question: 'Comment modifier une tâche ?',
                    answer:
                        'Appuyez sur une tâche pour l\'ouvrir, puis utilisez le bouton Modifier pour ajuster ses détails.',
                    isSmallScreen: isSmallScreen,
                  ),
                  _buildFaqItem(
                    question: 'Comment inviter des membres à mon projet ?',
                    answer:
                        'Ouvrez votre projet, accédez à l\'onglet Membres et utilisez le bouton Ajouter un membre.',
                    isSmallScreen: isSmallScreen,
                  ),
                ],
              ),
            ),
          ),

          // Tutoriels vidéo
          Card(
            margin: EdgeInsets.only(bottom: isSmallScreen ? 12 : 16),
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tutoriels vidéo',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),
                  _buildVideoTutorialItem(
                    title: 'Introduction à 2SB Kanban',
                    duration: '3:45',
                    thumbnail: Icons.play_circle_filled,
                    onTap: () =>
                        _showNotification('Lancement de la vidéo...', true),
                    isSmallScreen: isSmallScreen,
                  ),
                  _buildVideoTutorialItem(
                    title: 'Gérer vos projets efficacement',
                    duration: '5:12',
                    thumbnail: Icons.play_circle_filled,
                    onTap: () =>
                        _showNotification('Lancement de la vidéo...', true),
                    isSmallScreen: isSmallScreen,
                  ),
                  _buildVideoTutorialItem(
                    title: 'Collaboration en équipe',
                    duration: '4:30',
                    thumbnail: Icons.play_circle_filled,
                    onTap: () =>
                        _showNotification('Lancement de la vidéo...', true),
                    isSmallScreen: isSmallScreen,
                  ),
                ],
              ),
            ),
          ),

          // Centre d'aide
          Card(
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: EdgeInsets.all(isSmallScreen ? 12.0 : 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Centre d\'aide',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 16 : 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: isSmallScreen ? 12 : 16),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: theme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.support_agent,
                        color: theme.primaryColor,
                        size: isSmallScreen ? 20 : 24,
                      ),
                    ),
                    title: Text(
                      'Contacter le support',
                      style: TextStyle(
                        fontSize: isSmallScreen ? 14 : 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    subtitle: Text(
                      'Obtenez de l\'aide personnalisée',
                      style: TextStyle(
                        fontSize: isSmallScreen ? 12 : 14,
                      ),
                    ),
                    onTap: () => _showNotification(
                        'Redirection vers le support...', true),
                  ),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: theme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.menu_book,
                        color: theme.primaryColor,
                        size: isSmallScreen ? 20 : 24,
                      ),
                    ),
                    title: Text(
                      'Documentation',
                      style: TextStyle(
                        fontSize: isSmallScreen ? 14 : 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    subtitle: Text(
                      'Consultez notre guide détaillé',
                      style: TextStyle(
                        fontSize: isSmallScreen ? 12 : 14,
                      ),
                    ),
                    onTap: () => _showNotification(
                        'Redirection vers la documentation...', true),
                  ),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: theme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.forum,
                        color: theme.primaryColor,
                        size: isSmallScreen ? 20 : 24,
                      ),
                    ),
                    title: Text(
                      'Forum communautaire',
                      style: TextStyle(
                        fontSize: isSmallScreen ? 14 : 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    subtitle: Text(
                      'Échanger avec d\'autres utilisateurs',
                      style: TextStyle(
                        fontSize: isSmallScreen ? 12 : 14,
                      ),
                    ),
                    onTap: () =>
                        _showNotification('Redirection vers le forum...', true),
                  ),
                ],
              ),
            ),
          ),

          SizedBox(height: isSmallScreen ? 20 : 30),
        ],
      ),
    );
  }

  // Helper pour les éléments FAQ
  Widget _buildFaqItem({
    required String question,
    required String answer,
    required bool isSmallScreen,
  }) {
    return ExpansionTile(
      tilePadding: EdgeInsets.zero,
      title: Text(
        question,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: isSmallScreen ? 14 : 16,
        ),
      ),
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Text(
              answer,
              style: TextStyle(
                fontSize: isSmallScreen ? 13 : 14,
                color: Colors.grey[700],
              ),
            ),
          ),
        ),
      ],
    );
  }

  // Helper pour les tutoriels vidéo
  Widget _buildVideoTutorialItem({
    required String title,
    required String duration,
    required IconData thumbnail,
    required VoidCallback onTap,
    required bool isSmallScreen,
  }) {
    final theme = Theme.of(context);

    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Container(
        width: isSmallScreen ? 50 : 60,
        height: isSmallScreen ? 50 : 60,
        decoration: BoxDecoration(
          color: theme.primaryColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          thumbnail,
          color: theme.primaryColor,
          size: isSmallScreen ? 30 : 36,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: isSmallScreen ? 14 : 16,
        ),
      ),
      subtitle: Text(
        'Durée: $duration',
        style: TextStyle(
          fontSize: isSmallScreen ? 12 : 13,
        ),
      ),
      trailing: Icon(
        Icons.arrow_forward_ios,
        size: isSmallScreen ? 14 : 16,
        color: Colors.grey,
      ),
      onTap: onTap,
    );
  }
}
