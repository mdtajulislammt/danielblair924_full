import 'package:flutter/material.dart';

class JourneyLocationHeroImage extends StatelessWidget {
  const JourneyLocationHeroImage({
    super.key,
    required this.imagePath,
    this.isGrayscale = false,
  });

  final String imagePath;
  final bool isGrayscale;

  // dart format off
  static const ColorFilter _darkGrayscaleFilter = ColorFilter.matrix(<double>[
    0.1382, 0.4649, 0.0469, 0, 0,
    0.1382, 0.4649, 0.0469, 0, 0,
    0.1382, 0.4649, 0.0469, 0, 0,
    0,      0,      0,      1, 0,
  ]);
  // dart format on

  @override
  Widget build(BuildContext context) {
    Widget imageWidget = Image.asset(imagePath, fit: BoxFit.cover);

    if (isGrayscale) {
      imageWidget = ColorFiltered(
        colorFilter: _darkGrayscaleFilter,
        child: imageWidget,
      );
    }

    return AspectRatio(
      aspectRatio: 8 / 5,
      child: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          imageWidget,
          if (isGrayscale)
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  // dart format off
                  colors: <Color>[
                    Colors.black.withValues(alpha: 0.90), 
                    Colors.black.withValues(alpha: 0.70),
                    Colors.black.withValues(alpha: 0.45),
                    Colors.black.withValues( alpha: 0.45),
                    Colors.black.withValues(alpha: 0.50),
                    Colors.black.withValues(alpha: 0.70),
                    Colors.black.withValues(alpha: 0.70),
                  ],
                  stops: const <double>[0.0, 0.18, 0.35, 0.50, 0.68, 0.85, 1.0],
                  // dart format: on
                ),
              ),
            ),
        ],
      ),
    );
  }
}
