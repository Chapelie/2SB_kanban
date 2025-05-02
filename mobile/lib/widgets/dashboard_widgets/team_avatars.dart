import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../models/team_member.dart';

class TeamMemberAvatars extends StatelessWidget {
  final List<TeamMember> members;
  
  const TeamMemberAvatars({
    Key? key,
    required this.members,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (members.isEmpty) {
      return _buildAvatarPlaceholder();
    }
    
    // Calculer la largeur totale basée sur le nombre de membres
    final double containerWidth = members.length > 1 ? 
        (members.length > 2 ? 75.0 : 55.0) : 35.0;
        
    return Container(
      height: 32,
      width: containerWidth,
      child: Stack(
        children: [
          for (int i = 0; i < math.min(members.length, 3); i++)
            Positioned(
              left: i * 20.0,
              child: _buildTeamMemberAvatar(members[i]),
            ),
          if (members.length > 3)
            Positioned(
              left: 3 * 20.0,
              child: Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: Center(
                  child: Text(
                    '+${members.length - 3}',
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTeamMemberAvatar(TeamMember member) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
      ),
      child: member.avatar.isNotEmpty && member.avatar.startsWith('http')
          ? CircleAvatar(
              radius: 15,
              backgroundImage: NetworkImage(member.avatar),
              onBackgroundImageError: (_, __) {
                // Fallback en cas d'erreur de chargement de l'image
              },
            )
          : CircleAvatar(
              radius: 15,
              backgroundColor: Colors.indigo,
              child: Text(
                member.initials,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 10,
                ),
              ),
            ),
    );
  }
  
  Widget _buildAvatarPlaceholder() {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
      ),
      child: CircleAvatar(
        radius: 15,
        backgroundColor: Colors.grey[300],
        child: Icon(
          Icons.person_outline,
          size: 18,
          color: Colors.grey[600],
        ),
      ),
    );
  }
}