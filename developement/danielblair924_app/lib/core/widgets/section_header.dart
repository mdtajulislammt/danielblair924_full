import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class SectionHeader extends StatelessWidget {
  const SectionHeader({
    required this.title,
    super.key,
    this.subtitle,
    this.actions,
    this.padding = EdgeInsets.zero,
    this.titleStyle,
    this.subtitleStyle,
  });

  final String title;
  final String? subtitle;
  final List<Widget>? actions;
  final EdgeInsetsGeometry padding;
  final TextStyle? titleStyle;
  final TextStyle? subtitleStyle;

  @override
  Widget build(BuildContext context) {
    final TextStyle effectiveTitleStyle =
        titleStyle ?? context.titleMedium.copyWith(fontSize: 18);

    final TextStyle effectiveSubtitleStyle =
        subtitleStyle ??
        context.bodyMedium.copyWith(color: context.scheme.onTertiary);

    return Padding(
      padding: padding,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              spacing: 4,
              children: <Widget>[
                Text(
                  title,
                  style: effectiveTitleStyle,
                  overflow: TextOverflow.ellipsis,
                ),
                if (subtitle != null && subtitle!.isNotEmpty)
                  Text(subtitle!, style: effectiveSubtitleStyle),
              ],
            ),
          ),

          // Right-side actions
          if (actions != null && actions!.isNotEmpty) ...<Widget>[
            const SizedBox(width: 8),
            Row(mainAxisSize: MainAxisSize.min, children: actions!),
          ],
        ],
      ),
    );
  }
}
