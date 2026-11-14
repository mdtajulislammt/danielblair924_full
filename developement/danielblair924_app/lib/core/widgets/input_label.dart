import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class InputLabel extends StatelessWidget {
  const InputLabel(
    this.text, {
    super.key,
    this.isRequired = false,
    this.hintText,
    this.style,
  });

  final String text;
  final bool isRequired;
  final String? hintText;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final baseStyle = style ?? context.labelLarge;

    return Text.rich(
      TextSpan(
        text: text,
        style: baseStyle,
        children: [
          if (hintText != null)
            TextSpan(
              text: ' $hintText',
              style: TextStyle(
                color: AppColors.placeholder,
                fontWeight: FontWeight.normal,
              ),
            ),
          if (isRequired)
            const TextSpan(
              text: ' *',
              style: TextStyle(
                color: AppColors.destructive,
                fontSize: 20,
                height: 0.8,
              ),
            ),
        ],
      ),
    );
  }
}
