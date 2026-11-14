import 'dart:ui';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

class BlurredImageCard extends StatelessWidget {
  const BlurredImageCard({
    required this.imageProvider,
    required this.child,
    super.key,
    this.aspectRatio = 16 / 9,
    this.padding = const EdgeInsets.all(16.0),
    this.blurSigma = 12.0,
    this.onTap,
    this.blurStops = const <double>[0.0, 0.35, 0.70],
    this.darkOverlayColors = const <Color>[
      Color(0xC0000000), // ~75% opacity black at bottom
      Color(0x4D000000), // ~30% opacity black at top
    ],
    this.darkOverlayStops = const <double>[0.0, 0.60],
  });

  /// The image to display as the background (e.g. `AssetImage`, `NetworkImage`).
  final ImageProvider imageProvider;

  /// Content to overlay on top of the card.
  final Widget child;

  /// Optional tap handler forwarded to the underlying [AppCard].
  final VoidCallback? onTap;

  /// Aspect ratio for the overall card card container. Defaults to 16/9.
  final double aspectRatio;

  /// Content padding around [child]. Defaults to 16.0 on all sides.
  final EdgeInsetsGeometry padding;

  /// Gaussian blur intensity (sigmaX & sigmaY).
  final double blurSigma;

  /// Gradient stops for controlling the blur transition from bottom to top.
  final List<double> blurStops;

  /// Colors for the background dark gradient overlay.
  final List<Color> darkOverlayColors;

  /// Stops for the background dark gradient overlay.
  final List<double> darkOverlayStops;

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: aspectRatio,
      child: AppCard(
        padding: EdgeInsets.zero,
        onTap: onTap,
        child: Stack(
          fit: StackFit.expand,
          children: <Widget>[
            // 1. Base Sharp Background Image
            Image(
              image: imageProvider,
              fit: BoxFit.cover,
            ),

            // 2. Blurred Image Layer (Masked from Bottom to Center)
            ShaderMask(
              blendMode: BlendMode.dstIn,
              shaderCallback: (Rect bounds) {
                return LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: const <Color>[
                    Colors.black,       // Full blur strength at bottom
                    Colors.black,       // Sustained blur near lower third
                    Colors.transparent, // Smooth transition to sharp image
                  ],
                  stops: blurStops,
                ).createShader(bounds);
              },
              child: ImageFiltered(
                imageFilter: ImageFilter.blur(
                  sigmaX: blurSigma,
                  sigmaY: blurSigma,
                ),
                child: Image(
                  image: imageProvider,
                  fit: BoxFit.cover,
                ),
              ),
            ),

            // 3. Combined Dark Overlay + Gradient
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: darkOverlayColors,
                  stops: darkOverlayStops,
                ),
              ),
            ),

            // 4. Card Content Layer
            Padding(
              padding: padding,
              child: child,
            ),
          ],
        ),
      ),
    );
  }
}
