import 'package:first_mile_club/core/theme/app_colors.dart';
import 'package:flutter/material.dart';

// AppTypography
class AppTypography {
  const AppTypography._();

  static TextTheme get dark {
    return TextTheme(
      // Display
      displayLarge: TextStyle(
        color: AppColors.foreground,
        fontSize: 57,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.25,
      ),
      displayMedium: TextStyle(
        color: AppColors.foreground,
        fontSize: 36,
        fontWeight: FontWeight.w600,
      ),
      displaySmall: TextStyle(
        color: AppColors.foreground,
        fontSize: 28, //36
        fontWeight: FontWeight.w400,
      ),

      // Headline
      headlineLarge: TextStyle(
        color: AppColors.foreground,
        fontSize: 32,
        fontWeight: FontWeight.w400,
      ),
      headlineMedium: TextStyle(
        color: AppColors.foreground,
        fontSize: 28,
        fontWeight: FontWeight.w400,
      ),
      headlineSmall: TextStyle(
        color: AppColors.foreground,
        fontSize: 24,
        fontWeight: FontWeight.w400,
      ),

      // Title
      titleLarge: TextStyle(
        color: AppColors.foreground,
        fontSize: 20,
        fontWeight: FontWeight.w400,
      ),
      titleMedium: TextStyle(
        color: AppColors.foreground,
        fontSize: 16,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.15,
      ),
      titleSmall: TextStyle(
        color: AppColors.foreground,
        fontSize: 14,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.1,
      ),

      // Body
      bodyLarge: TextStyle(
        color: AppColors.foreground,
        fontSize: 16,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.5,
      ),
      bodyMedium: TextStyle(
        color: AppColors.foreground,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.25,
      ),
      bodySmall: TextStyle(
        color: AppColors.subtleForeground,
        fontSize: 12,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.4,
      ),

      // Label
      labelLarge: TextStyle(
        color: AppColors.foreground,
        fontSize: 16,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.1,
      ),
      labelMedium: TextStyle(
        color: AppColors.subtleForeground,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
      ),
      labelSmall: TextStyle(
        color: AppColors.subtleForeground,
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
      ),
    );
  }
}
