import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class FadedLine extends StatelessWidget {
  const FadedLine({
    super.key,
    this.height = 1.0,
    this.width,
    this.color = AppColors.inputBorder,
  });

  final double height;
  final double? width;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width ?? double.infinity,
      height: height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withValues(alpha: 0.0),
            color.withValues(alpha: 0.5),
            color.withValues(alpha: 0.8),
            color.withValues(alpha: 0.5),
            color.withValues(alpha: 0.0),
          ],
          stops: const [0.0, 0.1, 0.5, 0.9, 1.0],
        ),
      ),
    );
  }
}
