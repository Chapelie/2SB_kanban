import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/project_controller.dart';
import '../../models/team_member.dart';

class TeamMembersSheet extends StatelessWidget {
  final Function() onAddMember;
  final Function(String, TeamMember) onRemoveMember;

  const TeamMembersSheet({
    Key? key,
    required this.onAddMember,
    required this.onRemoveMember,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<ProjectController>(
      builder: (context, projectController, _) {
        final project = projectController.selectedProject;
        if (project == null) {
          return const Center(child: Text('Projet non trouvé'));
        }
        
        return DraggableScrollableSheet(
          initialChildSize: 0.6,
          minChildSize: 0.4,
          maxChildSize: 0.9,
          expand: false,
          builder: (context, scrollController) {
            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Barre d'en-tête
                  Center(
                    child: Container(
                      width: 40,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Titre
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Membres de l\'équipe',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.person_add),
                        onPressed: () {
                          Navigator.pop(context);
                          onAddMember();
                        },
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Liste des membres
                  Expanded(
                    child: project.teamMembers.isEmpty
                        ? const Center(
                            child: Text('Aucun membre dans l\'équipe'),
                          )
                        : ListView.builder(
                            controller: scrollController,
                            itemCount: project.teamMembers.length,
                            itemBuilder: (context, index) {
                              final member = project.teamMembers[index];
                              return ListTile(
                                leading: CircleAvatar(
                                  radius: 20,
                                  backgroundColor: Colors.indigo.withOpacity(0.2),
                                  backgroundImage: member.avatar.isNotEmpty
                                      ? NetworkImage(member.avatar)
                                      : null,
                                  child: member.avatar.isEmpty
                                      ? Text(
                                          member.initials,
                                          style: const TextStyle(
                                            color: Colors.indigo,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        )
                                      : null,
                                ),
                                title: Text(member.name),
                                subtitle: Text(member.location),
                                trailing: IconButton(
                                  icon: const Icon(Icons.remove_circle_outline, color: Colors.red),
                                  onPressed: () async {
                                    Navigator.pop(context);
                                    final confirmed = await _showRemoveMemberConfirmation(context, member);
                                    if (confirmed) {
                                      onRemoveMember(project.id, member);
                                    }
                                  },
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Future<bool> _showRemoveMemberConfirmation(BuildContext context, TeamMember member) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Retirer le membre'),
            content: Text(
                'Êtes-vous sûr de vouloir retirer ${member.name} de l\'équipe du projet ?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Annuler'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Retirer'),
              ),
            ],
          ),
        ) ??
        false;
  }
}