import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class TextDivider extends StatelessWidget {
  const TextDivider({
    this.text = 'OR',
    this.color,
    this.thickness = 1.0,
    this.spacing = 16.0,
    this.style,
    super.key,
  });

  final String text;
  final Color? color;
  final double thickness;
  final double spacing;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final dividerColor = color ?? context.scheme.outlineVariant;

    final defaultTextStyle = TextStyle(
      color: context.scheme.onTertiary,
      fontSize: 14.0,
      fontWeight: FontWeight.w600,
      letterSpacing: 1.1,
    );

    return Row(
      spacing: spacing,
      children: <Widget>[
        // Left Line
        Expanded(
          child: Divider(color: dividerColor, thickness: thickness),
        ),

        Text(text, style: style ?? defaultTextStyle),

        // Right Line
        Expanded(
          child: Divider(color: dividerColor, thickness: thickness),
        ),
      ],
    );
  }
}
