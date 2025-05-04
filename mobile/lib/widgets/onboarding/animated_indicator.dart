import 'package:flutter/material.dart';

class AnimatedIndicator extends StatelessWidget {
  final bool isActive;
  final Color color;

  const AnimatedIndicator({
    Key? key,
    required this.isActive,
    required this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      margin: const EdgeInsets.symmetric(horizontal: 4.0),
      height: 8,
      width: isActive ? 24.0 : 8.0,
      decoration: BoxDecoration(
        color: isActive ? color : color.withOpacity(0.4),
        borderRadius: BorderRadius.circular(4.0),
      ),
    );
  }
}