import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SvgIcon extends StatelessWidget {
  const SvgIcon(
    this.path, {
    this.color,
    this.size,
    this.height,
    this.width,
    this.fit = BoxFit.contain,
    this.alignment = Alignment.center,
    this.semanticsLabel,
    super.key,
    this.themeColor = false,
  });

  final String path;
  final Color? color;
  final bool themeColor;

  /// Shorthand — sets both height and width equally
  final double? size;
  final double? height;
  final double? width;
  final BoxFit fit;
  final Alignment alignment;
  final String? semanticsLabel;

  @override
  Widget build(BuildContext context) {
    final iconTheme = IconTheme.of(context);

    // Fallbacks to match standard Flutter Icon behavior
    final double effectiveSize = size ?? iconTheme.size ?? 24.0;
    final Color? effectiveColor =
        color ?? (themeColor ? iconTheme.color : null);

    return SvgPicture.asset(
      path,
      height: height ?? effectiveSize,
      width: width ?? effectiveSize,
      fit: fit,
      alignment: alignment,
      semanticsLabel: semanticsLabel,
      colorFilter: effectiveColor != null
          ? ColorFilter.mode(effectiveColor, BlendMode.srcIn)
          : null,
    );
  }
}
