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
  bool _isSubmitting = false;
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadAvailableMembers();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _addSelectedMembers() async {
    if (_selectedMembers.isEmpty) return;

    setState(() {
      _isSubmitting = true;
    });

    try {
      final controller = Provider.of<ProjectController>(context, listen: false);

      // Ajout des membres sélectionnés au projet
      await controller.addMembersToProject(
        widget.projectId,
        _selectedMembers,
      );

      if (mounted) {
        // Animation de succès avant de fermer
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 12),
                Text(
                  '${_selectedMembers.length} membre${_selectedMembers.length > 1 ? 's' : ''} ajouté${_selectedMembers.length > 1 ? 's' : ''} avec succès !',
                ),
              ],
            ),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 2),
            behavior: SnackBarBehavior.floating,
          ),
        );

        // Fermer le dialogue avec succès
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        // Afficher une erreur mais ne pas fermer le dialogue
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors de l\'ajout des membres: $e'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );

        setState(() {
          _isSubmitting = false;
        });
      }
    }
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
        const TeamMember(
          id: 'user6',
          name: 'Sophie Bernard',
          email: 'sophie@example.com',
          location: 'Nice',
          avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
          initials: 'SB',
        ),
        const TeamMember(
          id: 'user7',
          name: 'Pierre Dubois',
          email: 'pierre@example.com',
          location: 'Strasbourg',
          avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
          initials: 'PD',
        ),
      ];

      // Filtrer les membres déjà dans l'équipe
      final currentMemberIds = widget.currentMembers.map((m) => m.id).toSet();
      _availableMembers = allUsers
          .where((user) => !currentMemberIds.contains(user.id))
          .toList();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors du chargement des utilisateurs: $e'),
            behavior: SnackBarBehavior.floating,
          ),
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

  List<TeamMember> _getFilteredMembers() {
    if (_searchQuery.isEmpty) return _availableMembers;

    return _availableMembers.where((member) {
      final lowerQuery = _searchQuery.toLowerCase();
      return member.name.toLowerCase().contains(lowerQuery) ||
          member.email.toLowerCase().contains(lowerQuery) ||
          member.location.toLowerCase().contains(lowerQuery);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;
    final filteredMembers = _getFilteredMembers();

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        width: isSmall ? double.maxFinite : 600,
        constraints: BoxConstraints(
          maxWidth: 600,
          maxHeight: mediaQuery.size.height * 0.8,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.person_add_alt_1,
                        color: Colors.white,
                        size: 24,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Ajouter des membres',
                        style: theme.textTheme.titleLarge?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sélectionnez les membres que vous souhaitez ajouter à votre projet',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),

            // Recherche
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Rechercher un membre...',
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear),
                          onPressed: () {
                            _searchController.clear();
                            setState(() {
                              _searchQuery = '';
                            });
                          },
                        )
                      : null,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
              ),
            ),

            // Statut de sélection
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      _selectedMembers.isEmpty
                          ? 'Aucun membre sélectionné'
                          : '${_selectedMembers.length} membre${_selectedMembers.length > 1 ? 's' : ''} sélectionné${_selectedMembers.length > 1 ? 's' : ''}',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w500,
                        color: _selectedMembers.isEmpty
                            ? theme.hintColor
                            : theme.colorScheme.primary,
                      ),
                    ),
                  ),
                  if (_selectedMembers.isNotEmpty)
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          _selectedMembers.clear();
                        });
                      },
                      icon: const Icon(Icons.clear_all, size: 16),
                      label: const Text('Tout désélectionner'),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                      ),
                    ),
                ],
              ),
            ),

            const Divider(),

            // Liste des membres
            Expanded(
              child: _isLoading
                  ? Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const CircularProgressIndicator(),
                          const SizedBox(height: 16),
                          Text(
                            'Chargement des membres...',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.hintColor,
                            ),
                          ),
                        ],
                      ),
                    )
                  : filteredMembers.isEmpty
                      ? _buildEmptyState(theme)
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          itemCount: filteredMembers.length,
                          itemBuilder: (context, index) {
                            final member = filteredMembers[index];
                            final isSelected =
                                _selectedMembers.contains(member);

                            return _buildMemberTile(member, isSelected, theme);
                          },
                        ),
            ),

            const Divider(),

            // Actions
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  OutlinedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                    label: const Text('Annuler'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 12),
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: _selectedMembers.isEmpty || _isSubmitting
                        ? null
                        : _addSelectedMembers,
                    icon: _isSubmitting
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Icon(Icons.check),
                    label:
                        Text(_isSubmitting ? 'Ajout en cours...' : 'Ajouter'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 12),
                      disabledBackgroundColor:
                          theme.colorScheme.primary.withOpacity(0.3),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(ThemeData theme) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _searchQuery.isEmpty ? Icons.people_alt_outlined : Icons.search_off,
            size: 64,
            color: theme.hintColor,
          ),
          const SizedBox(height: 16),
          Text(
            _searchQuery.isEmpty
                ? 'Aucun membre disponible'
                : 'Aucun résultat pour "$_searchQuery"',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            _searchQuery.isEmpty
                ? 'Tous les utilisateurs sont déjà membres de ce projet'
                : 'Essayez avec un autre terme de recherche',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.hintColor,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildMemberTile(TeamMember member, bool isSelected, ThemeData theme) {
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;
    final isVerySmall = mediaQuery.size.width < 400;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      child: Card(
        margin: EdgeInsets.zero,
        elevation: isSelected ? 2 : 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: isSelected ? theme.colorScheme.primary : theme.dividerColor,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: InkWell(
          onTap: () {
            setState(() {
              if (isSelected) {
                _selectedMembers.remove(member);
              } else {
                _selectedMembers.add(member);
              }
            });
          },
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: EdgeInsets.symmetric(
                horizontal: 12, vertical: isSmall ? 8 : 12),
            child: Row(
              children: [
                // Case à cocher
                Container(
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? theme.colorScheme.primary
                          : theme.disabledColor,
                      width: 2,
                    ),
                    color: isSelected
                        ? theme.colorScheme.primary
                        : Colors.transparent,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(2.0),
                    child: isSelected
                        ? const Icon(
                            Icons.check,
                            size: 16.0,
                            color: Colors.white,
                          )
                        : const SizedBox(width: 16, height: 16),
                  ),
                ),

                // Avatar avec animation de sélection
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  curve: Curves.easeInOut,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? theme.colorScheme.primary
                          : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: CircleAvatar(
                    radius: isVerySmall ? 20 : 24,
                    backgroundColor: theme.colorScheme.primary.withOpacity(0.2),
                    backgroundImage: member.avatar.isNotEmpty
                        ? NetworkImage(member.avatar)
                        : null,
                    child: member.avatar.isEmpty
                        ? Text(
                            member.initials,
                            style: TextStyle(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: isVerySmall ? 12 : 14,
                            ),
                          )
                        : null,
                  ),
                ),

                const SizedBox(width: 12),

                // Informations utilisateur
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        member.name,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight:
                              isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: isVerySmall ? 14 : 16,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        member.email,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontSize: isVerySmall ? 12 : 14,
                          color: theme.hintColor,
                        ),
                      ),
                      if (!isVerySmall && member.location.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.location_on_outlined,
                                size: 14,
                                color: theme.disabledColor,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                member.location,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: theme.disabledColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),

                // Badge de sélection
                if (isSelected && !isVerySmall)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Sélectionné',
                      style: TextStyle(
                        color: theme.colorScheme.primary,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
