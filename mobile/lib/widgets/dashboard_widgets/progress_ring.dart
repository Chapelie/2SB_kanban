import 'package:flutter/material.dart';
import 'dart:math' as math;

class ProgressRing extends StatelessWidget {
  final int donePercent;
  final int todoPercent;
  final int pendingPercent;
  final int totalProjects;

  const ProgressRing({
    Key? key,
    required this.donePercent,
    required this.todoPercent,
    required this.pendingPercent,
    required this.totalProjects,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 150,
      height: 150,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Cercle de progression
          CustomPaint(
            size: const Size(150, 150),
            painter: ProgressRingPainter(
              donePercent: donePercent / 100,
              todoPercent: todoPercent / 100,
              pendingPercent: pendingPercent / 100,
            ),
          ),
          
          // Texte central
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '$totalProjects',
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'Projets totaux',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class LegendItem extends StatelessWidget {
  final Color color;
  final int percent;
  final String label;

  const LegendItem({
    Key? key, 
    required this.color, 
    required this.percent, 
    required this.label
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '$percent%',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 14,
          ),
        ),
      ],
    );
  }
}

class ProgressRingPainter extends CustomPainter {
  final double donePercent;
  final double todoPercent;
  final double pendingPercent;

  ProgressRingPainter({
    required this.donePercent,
    required this.todoPercent,
    required this.pendingPercent,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = math.min(size.width, size.height) / 2;
    const strokeWidth = 15.0;
    final innerRadius = radius - strokeWidth;
    
    // Arc background
    final bgPaint = Paint()
      ..color = Colors.grey.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    canvas.drawCircle(center, innerRadius, bgPaint);

    // Sections
    double startAngle = -math.pi / 2; // Start at the top

    // Indigo section (Done)
    final indigoPaint = Paint()
      ..color = Colors.indigo
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final indigoAngle = 2 * math.pi * donePercent;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: innerRadius),
      startAngle,
      indigoAngle,
      false,
      indigoPaint,
    );
    startAngle += indigoAngle;

    // Yellow section (To Do)
    final yellowPaint = Paint()
      ..color = Colors.amber
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final yellowAngle = 2 * math.pi * todoPercent;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: innerRadius),
      startAngle,
      yellowAngle,
      false,
      yellowPaint,
    );
    startAngle += yellowAngle;

    // Orange section (Pending)
    final orangePaint = Paint()
      ..color = Colors.orange
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final orangeAngle = 2 * math.pi * pendingPercent;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: innerRadius),
      startAngle,
      orangeAngle,
      false,
      orangePaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}