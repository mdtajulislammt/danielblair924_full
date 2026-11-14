import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class SectionIntro extends StatelessWidget {
  const SectionIntro({required this.title, this.subtitle, super.key});

  final String title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      spacing: 4,
      children: [
        Text(
          title.toUpperCase(),
          textAlign: TextAlign.center,
          style: context.displaySmall,
        ),

        if (subtitle != null)
          Text(
            subtitle!,
            textAlign: TextAlign.center,
            style: context.titleSmall.copyWith(
              color: context.scheme.onTertiary,
            ),
          ),
      ],
    );
  }
}
