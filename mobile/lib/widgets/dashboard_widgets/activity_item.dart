import 'package:flutter/material.dart';

class ActivityItem extends StatelessWidget {
  final String avatar;
  final String initials;
  final String name;
  final String action;
  final String target;
  final String time;
  
  const ActivityItem({
    Key? key,
    required this.avatar,
    required this.initials,
    required this.name,
    required this.action,
    required this.target,
    required this.time,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      leading: avatar.isNotEmpty && avatar.startsWith('http')
          ? CircleAvatar(
              radius: 18,
              backgroundImage: NetworkImage(avatar),
              onBackgroundImageError: (_, __) {
                // Fallback en cas d'erreur de chargement de l'image
              },
            )
          : CircleAvatar(
              radius: 18,
              backgroundColor: Colors.indigo,
              child: Text(
                initials,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
      title: RichText(
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
        text: TextSpan(
          style: const TextStyle(fontSize: 14, color: Colors.black),
          children: [
            TextSpan(
              text: name,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            TextSpan(
              text: ' $action ',
              style: const TextStyle(color: Colors.black87),
            ),
            TextSpan(
              text: target,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.indigo[700],
              ),
            ),
          ],
        ),
      ),
      subtitle: Padding(
        padding: const EdgeInsets.only(top: 4),
        child: Text(
          time,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ),
    );
  }
}