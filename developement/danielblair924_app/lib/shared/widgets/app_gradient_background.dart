import 'dart:math';

import 'package:flutter/material.dart';

class AppGradientBackground extends StatelessWidget {
  const AppGradientBackground({
    super.key,
    required this.child,
    this.topColors = const <Color>[
      Color(0xFFA6E22E),
      Color(0xFF6B9B1E),
      Colors.transparent,
    ],
    this.bottomColors = const <Color>[
      Color(0xFFA6E22E),
      Color(0xFF557C17),
      Colors.transparent,
    ],
    this.topStops = const <double>[0.0, 0.4, 1.0],
    this.bottomStops = const <double>[0.0, 0.4, 1.0],
  });

  final Widget child;
  final List<Color> topColors;
  final List<Color> bottomColors;
  final List<double>? topStops;
  final List<double>? bottomStops;

  @override
  Widget build(BuildContext context) {
    final topHeight = MediaQuery.sizeOf(context).height * 0.6;
    final bottomHeight = MediaQuery.sizeOf(context).height * 0.6;

    return SizedBox(
      width: double.infinity,
      child: Stack(
        children: <Widget>[
          // 1. Particle Layer (Small specks at the top)
          Positioned.fill(child: const ParticlePainter()),

          // 2. The Top-Center Radial Glow
          Positioned(
            top: -150,
            left: 0,
            right: 0,
            height: topHeight,
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.topCenter,
                  radius: 0.9,
                  colors: topColors,
                  stops: topStops,
                ),
              ),
            ),
          ),

          // 3. The Bottom-Center Radial Glow
          Positioned(
            bottom: -100,
            left: 0,
            right: 0,
            height: bottomHeight,
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.bottomCenter,
                  radius: 0.8,
                  colors: bottomColors,
                  stops: bottomStops,
                ),
              ),
            ),
          ),

          child,
        ],
      ),
    );
  }
}

// Custom Painter to generate the tiny particle specks seen in the top gradient
class ParticlePainter extends StatelessWidget {
  const ParticlePainter({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(painter: SpecklePainter());
  }
}

class SpecklePainter extends CustomPainter {
  const SpecklePainter();

  @override
  void paint(Canvas canvas, Size size) {
    // Pass a fixed seed so particle positions stay static across rebuilds
    final Random random = Random(42);

    final Paint paint = Paint()
      ..strokeWidth = 1.0
      ..strokeCap = StrokeCap.round;

    const double maxParticleHeight = 400.0;
    final double particlesBottom = size.height < maxParticleHeight
        ? size.height
        : maxParticleHeight;

    const int particleCount = 70;
    final double centerX = size.width / 2;

    for (int i = 0; i < particleCount; i++) {
      // Generate a Gaussian distribution centered at 0 (values roughly between -3.0 and 3.0)
      final double gaussian = _getGaussian(random);

      // Scale spread: standard deviation is ~18% of screen width around center
      final double standardDeviation = size.width * 0.18;
      double x = centerX + (gaussian * standardDeviation);

      // Clamp x to remain within screen bounds
      x = x.clamp(0.0, size.width);

      final double y = random.nextDouble() * particlesBottom;
      final double particleRadius = random.nextDouble() * 1.5 + 0.5;

      // Particles fade slightly more towards the bottom edge of the maxParticleHeight boundary
      final double opacityFactor = (1.0 - (y / particlesBottom)).clamp(
        0.2,
        1.0,
      );
      final double baseOpacity = random.nextDouble() * 0.5 + 0.1;

      paint.color = const Color(0xFFA6E22E)
          .withValues(alpha: (baseOpacity * opacityFactor).clamp(0.0, 1.0));

      canvas.drawCircle(Offset(x, y), particleRadius, paint);
    }
  }

  /// Box-Muller transform to generate standard normal random values (mean=0, stdDev=1)
  double _getGaussian(Random random) {
    double u1 = random.nextDouble();
    double u2 = random.nextDouble();

    // Prevent log(0) error
    while (u1 <= 1e-15) {
      u1 = random.nextDouble();
    }

    return sqrt(-2.0 * log(u1)) * cos(2.0 * pi * u2);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
