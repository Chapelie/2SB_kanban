import 'package:flutter/material.dart';
import 'dart:math' as math;

class AnimatedCard extends StatelessWidget {
  final AnimationController controller;
  final IconData iconData;
  final Color color;
  final double size;

  const AnimatedCard({
    Key? key,
    required this.controller,
    required this.iconData,
    required this.color,
    required this.size,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        final value = controller.value;
        
        return Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.3),
                blurRadius: 20 * value,
                spreadRadius: 5 * value,
              ),
            ],
          ),
          child: Center(
            child: Transform.rotate(
              angle: (1 - value) * math.pi / 6, // Rotation légère
              child: Icon(
                iconData,
                size: size * 0.5,
                color: color,
              ),
            ),
          ),
        );
      },
    );
  }
}