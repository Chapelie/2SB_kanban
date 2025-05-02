import 'package:flutter/material.dart';
import 'package:mobile/widgets/dashboard_widgets/progress_ring.dart';
import 'package:provider/provider.dart';
import '../controllers/auth_controller.dart';
import '../models/project.dart';
import '../models/task.dart';
import '../models/team_member.dart';
import 'dart:math' as math;
import '../config/app_routes.dart';
import '../widgets/dashboard_widgets/activity_item.dart';
import '../widgets/dashboard_widgets/project_card.dart';
import '../widgets/dashboard_widgets/task_item.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = false;
  String _selectedFilter = 'Cette semaine';

  @override
  void initState() {
    super.initState();
    // Charger les données au démarrage avec un léger délai pour permettre à l'interface de se construire
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshData();
    });
  }

  // Méthode pour rafraîchir les données
  Future<void> _refreshData() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // En mode frontend uniquement, on simule un délai pour donner l'impression d'un chargement
      await Future.delayed(const Duration(milliseconds: 1500));

      // Pour une implémentation complète, décommentez ces lignes
      // final projectController = Provider.of<ProjectController>(context, listen: false);
      // final taskController = Provider.of<TaskController>(context, listen: false);
      // await Future.wait([
      //   projectController.fetchProjects(),
      //   taskController.fetchTasks(),
      // ]);
    } catch (e) {
      // Afficher une erreur si nécessaire
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors du chargement des données: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthController>(builder: (context, authController, _) {
      final user = authController.currentUser;

      // Simulation de données pour le mode frontend
      // Dans une implémentation réelle, ces données viendraient des contrôleurs
      final List<TeamMember> sampleMembers = [
        const TeamMember(
          id: 'user1',
          name: 'John Doe',
          email: 'user1@example.com',
          location: 'Paris',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          initials: 'JD',
        ),
        const TeamMember(
          id: 'user2',
          name: 'Jane Smith',
          email: 'user2@example.com',
          location: 'Lyon',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          initials: 'JS',
        ),
        const TeamMember(
          id: 'user3',
          name: 'Robert Brown',
          email: 'user3@example.com',
          location: 'Marseille',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          initials: 'RB',
        ),
        const TeamMember(
          id: 'user4',
          name: 'Maria Garcia',
          email: 'user4@example.com',
          location: 'Nantes',
          avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
          initials: 'MG',
        ),
      ];

      // Statistiques des projets
      const int donePercent = 41;
      const int todoPercent = 23;
      const int pendingPercent = 35;
      const int totalProjects = 26;

      // Projets de démonstration
      final List<Project> projectsToDisplay = [
        Project(
          id: 'sample1',
          title: 'Refonte du site vitrine',
          description:
              'Développement du nouveau site avec une expérience utilisateur améliorée et une interface moderne.',
          dueDate: '15 JUIN 2025',
          status: ProjectStatus.ontrack,
          issuesCount: 3,
          teamMembers: [sampleMembers[0], sampleMembers[1]],
          createdAt: DateTime.now().subtract(const Duration(days: 30)),
          ownerId: user?.id ?? 'unknown',
        ),
        Project(
          id: 'sample2',
          title: 'Application mobile e-commerce',
          description:
              'Développement d\'une application native pour iOS et Android permettant aux clients de consulter et commander nos produits.',
          dueDate: '20 JUIL 2025',
          status: ProjectStatus.offtrack,
          issuesCount: 7,
          teamMembers: [sampleMembers[2], sampleMembers[3], sampleMembers[0]],
          createdAt: DateTime.now().subtract(const Duration(days: 45)),
          ownerId: user?.id ?? 'unknown',
        ),
      ];

      return Scaffold(
        body: RefreshIndicator(
          onRefresh: _refreshData,
          child: Stack(
            children: [
              // Utiliser ConstrainedBox pour garantir une hauteur minimale
              SizedBox(
                height: MediaQuery.of(context).size.height,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(16.0, 35.0, 16.0, 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // En-tête du tableau de bord
                      const Row(
                        children: [
                          Expanded(
                            child: Text(
                              'Tableau de bord',
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12), // Augmenter l'espacement

                      // Ligne de bienvenue et filtre
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (user != null)
                            Text(
                              'Bonjour, ${user.name.split(' ').first}',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[600],
                              ),
                            ),
                          _buildFilterDropdown(),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // Section graphique de progression
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withOpacity(0.1),
                              spreadRadius: 1,
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Row(
                          // ... reste du code existant
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            // Graphique circulaire
                            ProgressRing(
                              donePercent: donePercent,
                              todoPercent: todoPercent,
                              pendingPercent: pendingPercent,
                              totalProjects: totalProjects,
                            ),

                            // Légendes
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                LegendItem(
                                    color: Colors.indigo,
                                    percent: donePercent,
                                    label: 'Terminés'),
                                SizedBox(height: 12),
                                LegendItem(
                                    color: Colors.amber,
                                    percent: todoPercent,
                                    label: 'À faire'),
                                SizedBox(height: 12),
                                LegendItem(
                                    color: Colors.orange,
                                    percent: pendingPercent,
                                    label: 'En cours'),
                              ],
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Section projets récents
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Projets récents',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pushNamed(
                                context, AppRoutes.projectList),
                            child: Text(
                              'Voir tous',
                              style: TextStyle(
                                color: Colors.indigo[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      // Cartes des projets
                      LayoutBuilder(
                        builder: (context, constraints) {
                          if (constraints.maxWidth < 600) {
                            return Column(
                              children: projectsToDisplay
                                  .map((project) => Padding(
                                        padding:
                                            const EdgeInsets.only(bottom: 16.0),
                                        child: ProjectCard(project: project),
                                      ))
                                  .toList(),
                            );
                          } else {
                            return Row(
                              children: [
                                for (var i = 0;
                                    i < math.min(projectsToDisplay.length, 2);
                                    i++)
                                  Expanded(
                                    child: Padding(
                                      padding: EdgeInsets.only(
                                        left: i == 1 ? 8.0 : 0,
                                        right: i == 0 ? 8.0 : 0,
                                      ),
                                      child: ProjectCard(
                                        project: projectsToDisplay[i],
                                      ),
                                    ),
                                  ),
                              ],
                            );
                          }
                        },
                      ),

                      const SizedBox(height: 24),

                      // Section tâches à compléter
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Tâches à compléter',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pushNamed(context, AppRoutes.home,
                                  arguments: {'initialTab': 1});
                            },
                            child: Text(
                              'Voir toutes',
                              style: TextStyle(
                                color: Colors.indigo[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      // Liste des tâches à compléter
                      Container(
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
                        child: Column(
                          children: [
                            const TaskItem(
                              title: 'Finaliser maquettes UI',
                              project: 'Refonte du site vitrine',
                              dueDate: '3 jours restants',
                              priority: TaskPriority.high,
                            ),
                            Divider(height: 1, color: Colors.grey[200]),
                            const TaskItem(
                              title: 'Intégration API paiement',
                              project: 'Application mobile e-commerce',
                              dueDate: '1 jour restant',
                              priority: TaskPriority.medium,
                            ),
                            Divider(height: 1, color: Colors.grey[200]),
                            const TaskItem(
                              title: 'Tests d\'utilisabilité',
                              project: 'Refonte du site vitrine',
                              dueDate: '5 jours restants',
                              priority: TaskPriority.low,
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Section activité récente
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Activité récente',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text(
                                        'Historique d\'activité - Fonctionnalité à venir')),
                              );
                            },
                            child: Text(
                              'Voir tout',
                              style: TextStyle(
                                color: Colors.indigo[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 16),

                      // Liste d'activités récentes
                      Container(
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
                        child: Column(
                          children: [
                            ActivityItem(
                              avatar: sampleMembers[0].avatar,
                              initials: sampleMembers[0].initials,
                              name: sampleMembers[0].name,
                              action: 'a créé une nouvelle tâche',
                              target: 'Intégration API paiement',
                              time: 'Il y a 2 heures',
                            ),
                            Divider(height: 1, color: Colors.grey[200]),
                            ActivityItem(
                              avatar: sampleMembers[1].avatar,
                              initials: sampleMembers[1].initials,
                              name: sampleMembers[1].name,
                              action: 'a terminé',
                              target: 'Design de la page d\'accueil',
                              time: 'Il y a 3 heures',
                            ),
                            Divider(height: 1, color: Colors.grey[200]),
                            ActivityItem(
                              avatar: sampleMembers[2].avatar,
                              initials: sampleMembers[2].initials,
                              name: sampleMembers[2].name,
                              action: 'a été assigné à',
                              target: 'Tests d\'utilisabilité',
                              time: 'Il y a 5 heures',
                            ),
                          ],
                        ),
                      ),

                      // Espace en bas pour éviter que le contenu soit coupé
                      const SizedBox(height: 80),
                    ],
                  ),
                ),
              ),

              // Indicateur de chargement
              if (_isLoading)
                Container(
                  width: double.infinity,
                  height: double.infinity,
                  color: Colors.black.withOpacity(0.1),
                  child: const Center(
                    child: CircularProgressIndicator(),
                  ),
                ),
            ],
          ),
        ),
      );
    });
  }

  // Widget pour le menu déroulant des filtres
  Widget _buildFilterDropdown() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(20),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedFilter,
          icon: Icon(Icons.keyboard_arrow_down,
              size: 18, color: Colors.grey[600]),
          elevation: 2,
          isDense: true,
          style: TextStyle(
            color: Colors.grey[800],
            fontWeight: FontWeight.w500,
            fontSize: 14,
          ),
          onChanged: (String? newValue) {
            if (newValue != null) {
              setState(() {
                _selectedFilter = newValue;
                // Implémenter la logique de filtrage ici
              });
            }
          },
          items: ['Cette semaine', 'Ce mois', 'Cette année', 'Globale']
              .map<DropdownMenuItem<String>>((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
        ),
      ),
    );
  }
}
