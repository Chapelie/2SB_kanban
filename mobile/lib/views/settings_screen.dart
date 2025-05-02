import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/auth_controller.dart';
import '../config/app_routes.dart';

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
      case 'appearance':
        return _buildAppearancePage();
      case 'language':
        return _buildLanguagePage();
      case 'data':
        return _buildDataPage();
      default:
        return _buildMainPage();
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
      case 'appearance':
        return 'Apparence';
      case 'language':
        return 'Langue';
      case 'data':
        return 'Données';
      default:
        return 'Paramètres';
    }
  }

  // Page principale des paramètres
  Widget _buildMainPage() {
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            decoration: BoxDecoration(
              color: theme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              'Paramètres personnels',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.primaryColor,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Cartes pour paramètres personnels
          _buildSettingsCard(
            title: 'Profil',
            description: 'Gérer vos informations personnelles',
            icon: Icons.person,
            onTap: () => setState(() => _activePage = 'profile'),
          ),
          _buildSettingsCard(
            title: 'Notifications',
            description: 'Configurer les paramètres de notifications',
            icon: Icons.notifications,
            onTap: () => setState(() => _activePage = 'notifications'),
          ),
          _buildSettingsCard(
            title: 'Sécurité',
            description: 'Gérer la sécurité de votre compte',
            icon: Icons.security,
            onTap: () => setState(() => _activePage = 'security'),
          ),

          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            decoration: BoxDecoration(
              color: theme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              'Paramètres de l\'application',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.primaryColor,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Cartes pour paramètres de l'application
          _buildSettingsCard(
            title: 'Apparence',
            description: 'Personnaliser l\'interface utilisateur',
            icon: Icons.palette,
            onTap: () => setState(() => _activePage = 'appearance'),
          ),
          _buildSettingsCard(
            title: 'Langue',
            description: 'Changer la langue de l\'application',
            icon: Icons.language,
            onTap: () => setState(() => _activePage = 'language'),
          ),
          _buildSettingsCard(
            title: 'Données',
            description: 'Gérer et exporter vos données',
            icon: Icons.storage,
            onTap: () => setState(() => _activePage = 'data'),
          ),

          const SizedBox(height: 24),

          // Section d'aide
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.primaryColor.withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: theme.primaryColor.withOpacity(0.2),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.help,
                    color: theme.primaryColor,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Besoin d\'aide ?',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Si vous avez des questions sur les paramètres, consultez notre centre d\'aide.',
                        style: TextStyle(color: Colors.grey),
                      ),
                      const SizedBox(height: 8),
                      GestureDetector(
                        onTap: () => _showNotification(
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

          // Informations sur l'application
          Center(
            child: Column(
              children: [
                const Text(
                  '2SB Kanban - Version 1.0.0',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
                const SizedBox(height: 4),
                const Text(
                  '© 2025 2SB Kanban. Tous droits réservés.',
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                ),
                const SizedBox(height: 16),
                TextButton.icon(
                  onPressed: () {
                    context.read<AuthController>().logout();
                    Navigator.pushReplacementNamed(context, AppRoutes.login);
                  },
                  icon: const Icon(Icons.logout, color: Colors.red),
                  label: const Text(
                    'Se déconnecter',
                    style: TextStyle(color: Colors.red),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Carte de paramètres
  Widget _buildSettingsCard({
    required String title,
    required String description,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      elevation: 2,
      shadowColor: Colors.black12,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
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
                  color: theme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: theme.primaryColor,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      description,
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios,
                  size: 16, color: theme.primaryColor),
            ],
          ),
        ),
      ),
    );
  }

  // Page de profil
  Widget _buildProfilePage() {
    final user = context.read<AuthController>().currentUser;
    final theme = Theme.of(context);
    final nameController =
        TextEditingController(text: user?.name ?? 'Utilisateur');
    final emailController =
        TextEditingController(text: user?.email ?? 'utilisateur@example.com');
    final phoneController = TextEditingController(text: '+226 70 00 00 00');
    final locationController =
        TextEditingController(text: 'Bobo, Burkina Faso');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Photo de profil et infos basiques
          Center(
            child: Column(
              children: [
                Stack(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: theme.primaryColor.withOpacity(0.1),
                      child: Text(
                        (user?.name?.isNotEmpty == true)
                            ? user!.name.substring(0, 1)
                            : 'U',
                        style: TextStyle(
                          fontSize: 40,
                          color: theme.primaryColor,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: theme.primaryColor,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.camera_alt,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  user?.name ?? 'Utilisateur',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  user?.role ?? 'Utilisateur',
                  style: const TextStyle(
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Formulaire du profil
          Column(
            children: [
              _buildProfileTextField(
                controller: nameController,
                label: 'Nom complet',
                prefixIcon: Icons.person,
              ),
              _buildProfileTextField(
                controller: emailController,
                label: 'Adresse e-mail',
                prefixIcon: Icons.email,
                keyboardType: TextInputType.emailAddress,
              ),
              _buildProfileTextField(
                controller: phoneController,
                label: 'Numéro de téléphone',
                prefixIcon: Icons.phone,
                keyboardType: TextInputType.phone,
              ),
              _buildProfileTextField(
                controller: locationController,
                label: 'Localisation',
                prefixIcon: Icons.location_on,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Bouton de mise à jour
          ElevatedButton(
            onPressed: () {
              // Simuler la mise à jour du profil
              _showNotification('Profil mis à jour avec succès', true);
            },
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              backgroundColor: theme.primaryColor,
            ),
            child: const Text('Mettre à jour le profil'),
          ),

          const SizedBox(height: 24),
          const Divider(),
          const SizedBox(height: 24),

          // Informations du compte
          const Text(
            'Informations du compte',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                _buildAccountInfoRow('ID Utilisateur', user?.id ?? '12345'),
                const Divider(),
                _buildAccountInfoRow('Rôle', user?.role ?? 'Utilisateur'),
                const Divider(),
                _buildAccountInfoRow('Date de création', '12 janvier 2023'),
                const Divider(),
                _buildAccountInfoRow(
                    'Dernière connexion', 'Aujourd\'hui à 10:25'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileTextField({
    required TextEditingController controller,
    required String label,
    required IconData prefixIcon,
    TextInputType? keyboardType,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(prefixIcon),
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }

  Widget _buildAccountInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        Text(
          value,
          style: const TextStyle(color: Colors.grey),
        ),
      ],
    );
  }

  Widget _buildNotificationsPage() {
    return Center(
      child: Text('Notifications Page'),
    );
  }

  Widget _buildSecurityPage() {
    return Center(
      child: Text('Security Page'),
    );
  }

  Widget _buildAppearancePage() {
    return Center(
      child: Text('Appearance Page'),
    );
  }

  Widget _buildLanguagePage() {
    return Center(
      child: Text('Language Page'),
    );
  }

  Widget _buildDataPage() {
    return Center(
      child: Text('Data Page'),
    );
  }
}
