import 'package:flutter/material.dart';

/// Password Strength Levels
enum PasswordStrength {
  none(
    label: '',
    score: 0,
    color: Colors.transparent,
  ),
  weak(
    label: 'WEAK',
    score: 1,
    color: Color(0xFF8CE600), // Lime green accent
  ),
  fair(
    label: 'FAIR',
    score: 2,
    color: Color(0xFFFFB800), // Orange/Yellow accent
  ),
  good(
    label: 'GOOD',
    score: 3,
    color: Color(0xFF00E5FF), // Cyan accent
  ),
  strong(
    label: 'STRONG',
    score: 4,
    color: Color(0xFF00FF66), // Bright green accent
  );

  const PasswordStrength({
    required this.label,
    required this.score,
    required this.color,
  });

  final String label;
  final int score;
  final Color color;

  /// Helper to calculate password strength from input text
  factory PasswordStrength.calculate(String password) {
    if (password.isEmpty) return PasswordStrength.none;

    int score = 0;

    // Minimum length check
    if (password.length >= 8) score++;
    // Contains lowercase & uppercase letters
    if (password.contains(RegExp(r'(?=.*[a-z])(?=.*[A-Z])'))) score++;
    // Contains numbers
    if (password.contains(RegExp(r'[0-9]'))) score++;
    // Contains special characters
    if (password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) score++;

    switch (score) {
      case 1:
        return PasswordStrength.weak;
      case 2:
        return PasswordStrength.fair;
      case 3:
        return PasswordStrength.good;
      case 4:
        return PasswordStrength.strong;
      default:
        return PasswordStrength.weak;
    }
  }
}

class PasswordStrengthIndicator extends StatelessWidget {
  const PasswordStrengthIndicator({
    required this.strength,
    this.totalSegments = 4,
    super.key,
  });

  final PasswordStrength strength;
  final int totalSegments;

  @override
  Widget build(BuildContext context) {
    // Inactive segment background color (dark olive/gray tint)
    const inactiveColor = Color(0xFF2A2E21);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        // Header Text
        const Text(
          'PASSWORD STRENGTH',
          style: TextStyle(
            fontSize: 12.0,
            fontWeight: FontWeight.w600,
            color: Colors.white,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 12.0),

        // Segmented Strength Bar
        Row(
          children: List.generate(totalSegments, (index) {
            final isFilled = index < strength.score;

            return Expanded(
              child: Container(
                height: 4.0,
                margin: EdgeInsets.only(
                  right: index < totalSegments - 1 ? 8.0 : 0.0,
                ),
                decoration: BoxDecoration(
                  color: isFilled ? strength.color : inactiveColor,
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 8.0),

        // Dynamic Strength Label
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          child: Text(
            strength.label,
            key: ValueKey<String>(strength.label),
            style: TextStyle(
              fontSize: 12.0,
              fontWeight: FontWeight.w700,
              color: strength.color,
              letterSpacing: 1.0,
            ),
          ),
        ),
      ],
    );
  }
}
