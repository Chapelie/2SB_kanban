import 'package:flutter/material.dart';

class TaskCountBadge extends StatelessWidget {
  final int count;
  final String label;
  final Color color;
  final IconData icon;
  final bool isDark;

  const TaskCountBadge({
    Key? key,
    required this.count,
    required this.label,
    required this.color,
    required this.icon,
    required this.isDark,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 12,
            color: color,
          ),
          const SizedBox(width: 4),
          Text(
            '$count $label',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w500,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}