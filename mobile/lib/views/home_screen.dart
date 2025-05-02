import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/auth_controller.dart';
import '../controllers/project_controller.dart';
import '../widgets/CustomBottomNavBar.dart';
import 'dashboard_screen.dart';
import 'my_tasks_screen.dart';
import 'profile_screen.dart';
import 'project_list_screen.dart';
import '../models/project.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const ProjectListScreen(),
    const MyTasksScreen(),
    const ProfileScreen(),
  ];

  final List<String> _titles = [
    'Tableau de bord',
    'Mes Projets',
    'Mes Tâches',
    'Profil'
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
      floatingActionButton: _currentIndex == 1
          ? FloatingActionButton(
            heroTag: 'fab_unique_tag_1',
              onPressed: () {
                _showAddProjectDialog(context);
              },
              backgroundColor: Colors.indigo[700],
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  // Dialogue d'ajout de projet amélioré
  void _showAddProjectDialog(BuildContext context) {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    
    // Par défaut, date d'échéance à 1 mois
    final now = DateTime.now();
    final defaultDueDate = DateTime(now.year, now.month + 1, now.day);
    
    // Formater la date pour l'affichage et le stockage
    final dueDateController = TextEditingController(
      text: '${defaultDueDate.day} ${_getMonthName(defaultDueDate.month)} ${defaultDueDate.year}'
    );
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nouveau projet'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  labelText: 'Titre',
                  hintText: 'ex: Refonte du site web',
                  prefixIcon: Icon(Icons.title),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText: 'ex: Mise à jour complète du site avec les dernières fonctionnalités',
                  prefixIcon: Icon(Icons.description),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              // Champ pour la date d'échéance
              TextField(
                controller: dueDateController,
                decoration: const InputDecoration(
                  labelText: 'Date d\'échéance',
                  prefixIcon: Icon(Icons.calendar_today),
                ),
                readOnly: true,
                onTap: () async {
                  final pickedDate = await showDatePicker(
                    context: context,
                    initialDate: defaultDueDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime(2030),
                  );
                  
                  if (pickedDate != null) {
                    dueDateController.text = 
                        '${pickedDate.day} ${_getMonthName(pickedDate.month)} ${pickedDate.year}';
                  }
                },
              ),
              const SizedBox(height: 16),
              // Statut du projet (par défaut "En cours")
              const Text(
                'Statut initial:',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.blue, width: 1),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.check_circle, size: 16, color: Colors.blue),
                    SizedBox(width: 8),
                    Text(
                      'En cours', 
                      style: TextStyle(color: Colors.blue, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Annuler',
              style: TextStyle(color: Colors.grey[700]),
            ),
          ),
          Consumer<AuthController>(
            builder: (context, authController, _) {
              return ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo[700],
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: () async {
                  if (titleController.text.isNotEmpty) {
                    final userId = authController.currentUser?.id;
                    if (userId != null) {
                      // Afficher un indicateur de chargement
                      showDialog(
                        context: context,
                        barrierDismissible: false,
                        builder: (context) => const Center(
                          child: CircularProgressIndicator(),
                        ),
                      );
                      
                      try {
                        final project = await context.read<ProjectController>().createProject(
                          title: titleController.text,
                          description: descriptionController.text,
                          ownerId: userId,
                          dueDate: dueDateController.text,
                          status: ProjectStatus.ontrack,
                        );

                        if (mounted) {
                          // Fermer l'indicateur de chargement
                          Navigator.pop(context);
                          
                          // Fermer le dialogue
                          Navigator.pop(context);
                          
                          // Afficher un message de succès
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Projet "${titleController.text}" créé avec succès'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        }
                      } catch (e) {
                        if (mounted) {
                          // Fermer l'indicateur de chargement
                          Navigator.pop(context);
                          
                          // Afficher un message d'erreur
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Erreur: ${e.toString()}'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      }
                    }
                  } else {
                    // Afficher un message d'erreur si le titre est vide
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Le titre du projet est requis'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                },
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                  child: Text('Créer le projet'),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
  
  // Utilitaire pour obtenir le nom du mois à partir du numéro
  String _getMonthName(int month) {
    const months = [
      'JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN',
      'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    return months[month - 1];
  }
}