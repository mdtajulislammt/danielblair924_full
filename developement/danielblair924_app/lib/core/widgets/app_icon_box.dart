import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class AppIconBox extends StatelessWidget {
  final Widget child;
  final double size;
  final Color? backgroundColor;
  final Color borderColor;
  final double borderWidth;
  final double borderRadius;
  final EdgeInsetsGeometry padding;

  static const EdgeInsets defaultPadding = EdgeInsets.all(8.0);

  const AppIconBox({
    super.key,
    required this.child,
    this.size = 40.0,
    this.backgroundColor,
    this.borderColor = AppColors.inputBorder,
    this.borderWidth = 1.2,
    this.borderRadius = 100.0, // Default to a circle
    this.padding = defaultPadding,
  });

  @override
  Widget build(BuildContext context) {
    final Color effectiveBgColor = backgroundColor ?? AppColors.card2;

    return SizedBox(
      width: size,
      height: size,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: effectiveBgColor,
          borderRadius: BorderRadius.circular(borderRadius),
          border: borderWidth > 0
              ? Border.all(color: borderColor, width: borderWidth)
              : null,
        ),
        child: Padding(
          padding: padding,
          child: Center(child: child),
        ),
      ),
    );
  }
}

