import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class CityHeaderTitle extends StatelessWidget {
  const CityHeaderTitle({
    super.key,
    required this.title,
    this.flag,
    this.textStyle,
    this.spacing = 8.0,
    this.subtitle,
  });

  final String title;
  final String? subtitle;
  final String? flag;
  final TextStyle? textStyle;
  final double spacing;

  @override
  Widget build(BuildContext context) {
    final effectiveStyle =
        textStyle ?? Theme.of(context).textTheme.displayMedium;

    return Column(
      mainAxisSize: .min,
      crossAxisAlignment: .start,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          spacing: spacing,
          children: <Widget>[
            Flexible(
              child: Text(
                title,
                style: effectiveStyle,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (flag != null)
              Text(
                flag!,
                style: effectiveStyle,
                overflow: TextOverflow.ellipsis,
              ),
          ],
        ),

        if (subtitle != null)
          Flexible(
            child: Text(
              subtitle!,
              style: context.bodyLarge.copyWith(
                color: AppColors.subtleForeground,
                fontWeight: .w600,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
      ],
    );
  }
}
