import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';

class FlankingTextHeader extends StatelessWidget {
  const FlankingTextHeader({
    super.key,
    required this.text,
    this.textStyle,
    this.flankingAsset,
    this.lineWidth = 40.0,
    this.lineHeight = 12.0,
    this.spacing = 16.0,
  });

  final String text;
  final TextStyle? textStyle;
  final String? flankingAsset;
  final double lineWidth;
  final double lineHeight;
  final double spacing;

  @override
  Widget build(BuildContext context) {
    final defaultAsset = Assets.icons.flankingLine;
    final defaultTextStyle = context.bodyMedium.copyWith(
      color: context.scheme.primary,
      fontWeight: FontWeight.w500,
    );

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(
          width: lineWidth,
          child: SvgIcon(flankingAsset ?? defaultAsset, height: lineHeight),
        ),
        SizedBox(width: spacing),
        Text(text, style: textStyle ?? defaultTextStyle),
        SizedBox(width: spacing),
        SizedBox(
          width: lineWidth,
          child: SvgIcon(flankingAsset ?? defaultAsset, height: lineHeight),
        ),
      ],
    );
  }
}
