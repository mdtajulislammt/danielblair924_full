import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

class AuthPrompt extends StatelessWidget {
  const AuthPrompt({
    super.key,
    required this.prompt,
    required this.child,
    this.onPressed,
  });
  final String prompt;
  final Widget child;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: 2,
      crossAxisAlignment: .center,
      mainAxisAlignment: .center,
      children: [
        Text(
          prompt,
          style: TextStyle(
            color: context.scheme.onTertiary,
            fontWeight: FontWeight.w400,
            fontSize: 16.0,
            letterSpacing: 1.2,
          ),
        ),

        AppButton.text(
          padding: .symmetric(horizontal: 6),
          onPressed: onPressed,
          borderRadius: 6,
          height: 44,
          child: child,
        ),
      ],
    );
  }
}
