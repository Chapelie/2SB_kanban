import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/project_controller.dart';
import '../../models/team_member.dart';

class AddMemberDialog extends StatefulWidget {
  final String projectId;
  final List<TeamMember> currentMembers;

  const AddMemberDialog({
    Key? key,
    required this.projectId,
    required this.currentMembers,
  }) : super(key: key);

  @override
  State<AddMemberDialog> createState() => _AddMemberDialogState();
}

class _AddMemberDialogState extends State<AddMemberDialog> {
  List<TeamMember> _availableMembers = [];
  List<TeamMember> _selectedMembers = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAvailableMembers();
  }

  Future<void> _loadAvailableMembers() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // En situation réelle, nous ferions un appel API pour obtenir tous les utilisateurs
      // Pour cet exemple, nous utiliserons une liste fictive
      final allUsers = [
        const TeamMember(
          id: 'user1', 
          name: 'John Doe', 
          email: 'john@example.com',
          location: 'Paris',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          initials: 'JD',
        ),
        const TeamMember(
          id: 'user2', 
          name: 'Jane Smith', 
          email: 'jane@example.com',
          location: 'Lyon',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          initials: 'JS',
        ),
        const TeamMember(
          id: 'user3', 
          name: 'Robert Johnson', 
          email: 'robert@example.com',
          location: 'Marseille',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          initials: 'RJ',
        ),
        const TeamMember(
          id: 'user4', 
          name: 'Emily Brown', 
          email: 'emily@example.com',
          location: 'Nantes',
          avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
          initials: 'EB',
        ),
        const TeamMember(
          id: 'user5', 
          name: 'Thomas Martin', 
          email: 'thomas@example.com',
          location: 'Toulouse',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          initials: 'TM',
        ),
      ];

      // Filtrer les membres déjà dans l'équipe
      final currentMemberIds = widget.currentMembers.map((m) => m.id).toSet();
      _availableMembers = allUsers.where((user) => !currentMemberIds.contains(user.id)).toList();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors du chargement des utilisateurs: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Ajouter des membres'),
      content: SizedBox(
        width: double.maxFinite,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (_isLoading)
              const Center(
                child: CircularProgressIndicator(),
              )
            else if (_availableMembers.isEmpty)
              const Center(
                child: Text('Aucun autre membre disponible'),
              )
            else
              Flexible(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Sélectionnez les membres à ajouter:',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: ListView.builder(
                        shrinkWrap: true,
                        itemCount: _availableMembers.length,
                        itemBuilder: (context, index) {
                          final member = _availableMembers[index];
                          final isSelected = _selectedMembers.contains(member);
                          
                          return CheckboxListTile(
                            title: Text(member.name),
                            subtitle: Text(member.email),
                            secondary: CircleAvatar(
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
                            value: isSelected,
                            onChanged: (bool? value) {
                              setState(() {
                                if (value == true) {
                                  _selectedMembers.add(member);
                                } else {
                                  _selectedMembers.remove(member);
                                }
                              });
                            },
                          );
                        },
                      ),
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
          child: const Text('Annuler'),
        ),
        ElevatedButton(
          onPressed: _selectedMembers.isEmpty
              ? null
              : () {
                  for (final member in _selectedMembers) {
                    context
                        .read<ProjectController>()
                        .addMemberToProject(widget.projectId, member);
                  }
                  Navigator.pop(context);
                },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigo,
            foregroundColor: Colors.white,
          ),
          child: Text('Ajouter ${_selectedMembers.length} membre(s)'),
        ),
      ],
    );
  }
}