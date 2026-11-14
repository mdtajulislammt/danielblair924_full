import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/shapes/app_rounded_border.dart';
import 'package:flutter/material.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final Color? backgroundColor;
  final double elevation;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final Color borderColor;
  final double borderWidth;
  final double borderRadius;
  final DecorationImage? backgroundImage;
  final VoidCallback? onTap;
  final ShapeBorder? shape;

  static const EdgeInsets defaultPadding = EdgeInsets.symmetric(
    vertical: 12.0,
    horizontal: 16.0,
  );

  const AppCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.backgroundColor,
    this.elevation = 0.0,
    this.padding = defaultPadding,
    this.margin = EdgeInsets.zero,
    this.borderColor = AppColors.inputBorder,
    this.borderWidth = AppStyles.cardBorderWidth,
    this.borderRadius = AppStyles.cardBorderRadius,
    this.backgroundImage,
    this.onTap,
    this.shape,
  });

  @override
  Widget build(BuildContext context) {
    final Color effectiveColor = backgroundColor ?? AppColors.card2;
    final ShapeBorder effectiveBorderShape =
        shape ??
        AppRoundedBorder(
          color: borderColor,
          width: borderWidth,
          radius: borderRadius,
        );

    Widget content = Padding(padding: padding, child: child);

    if (backgroundImage != null) {
      content = Ink(
        decoration: BoxDecoration(image: backgroundImage),
        child: content,
      );
    }

    Widget result = Material(
      color: effectiveColor,
      elevation: elevation,
      shape: effectiveBorderShape,
      clipBehavior: Clip.antiAlias,
      child: onTap != null ? InkWell(onTap: onTap, child: content) : content,
    );

    if (width != null || height != null) {
      result = SizedBox(width: width, height: height, child: result);
    }

    if (margin != EdgeInsets.zero) {
      result = Padding(padding: margin, child: result);
    }

    return result;
  }
}
