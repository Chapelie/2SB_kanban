import 'package:flutter/material.dart';

class NotificationSettingTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final Function(bool) onChanged;
  final bool isSmallScreen;

  const NotificationSettingTile({
    Key? key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
    required this.isSmallScreen,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.zero,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: EdgeInsets.all(isSmallScreen ? 8 : 10),
            decoration: BoxDecoration(
              color: theme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: theme.primaryColor,
              size: isSmallScreen ? 18 : 24,
            ),
          ),
          SizedBox(width: isSmallScreen ? 8 : 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: isSmallScreen ? 14 : 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: isSmallScreen ? 2 : 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: isSmallScreen ? 12 : 14,
                    color: Colors.grey[600],
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 2,
                ),
              ],
            ),
          ),
          Transform.scale(
            scale: isSmallScreen ? 0.8 : 1.0,
            child: Switch(
              value: value,
              activeColor: theme.primaryColor,
              onChanged: onChanged,
            ),
          ),
        ],
      ),
    );
  }
}