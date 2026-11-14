import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class AppTheme {
  const AppTheme._();

  static ThemeData get light {
    return ThemeData(useMaterial3: true, brightness: Brightness.light);
  }

  static ThemeData get dark {
    final colorScheme = ColorScheme.dark(
      // Main brand
      primary: AppColors.primary,
      onPrimary: AppColors.primaryForeground,

      // Secondary
      secondary: AppColors.secondary,
      onSecondary: AppColors.secondaryForeground,

      // Secondary
      tertiary: AppColors.disabled,
      onTertiary: AppColors.subtleForeground,

      // Error
      error: AppColors.error,
      onError: AppColors.errorForeground,

      // Main surfaces
      surface: AppColors.background,
      onSurface: AppColors.foreground,

      // Containers
      surfaceContainerLowest: AppColors.background,
      surfaceContainerLow: AppColors.card,
      surfaceContainer: AppColors.card,
      surfaceContainerHigh: AppColors.elevated,
      surfaceContainerHighest: AppColors.elevated,

      inverseSurface: AppColors.foreground,
      onInverseSurface: AppColors.background,
      inversePrimary: AppColors.primary,

      // Borders / focus
      outline: AppColors.outline,
      outlineVariant: AppColors.border,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: colorScheme,

      scaffoldBackgroundColor: AppColors.background,

      // ─────────────────────────────────────────────
      // App Bar
      // ─────────────────────────────────────────────
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.foreground,
        surfaceTintColor: AppColors.transparent,
        elevation: 0,
      ),

      // ─────────────────────────────────────────────
      // Text
      // ─────────────────────────────────────────────
      textTheme: AppTypography.dark,

      // ─────────────────────────────────────────────
      // Cards
      // ─────────────────────────────────────────────
      cardTheme: CardThemeData(
        color: AppColors.card,
        surfaceTintColor: AppColors.transparent,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: AppColors.cardBorder),
        ),
      ),

      // ─────────────────────────────────────────────
      // Input
      // ─────────────────────────────────────────────
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        prefixIconColor: AppColors.inputIcon,
        suffixIconColor: AppColors.inputIcon,
        fillColor: AppColors.input,
        hintStyle: const TextStyle(
          color: AppColors.placeholder,
          fontSize: 16,
          fontWeight: .w500,
        ),
        labelStyle: const TextStyle(color: AppColors.subtleForeground),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.inputBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.inputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.ring, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.error, width: 1.5),
        ),
      ),

      // ─────────────────────────────────────────────
      // Elevated Button
      // ─────────────────────────────────────────────
      iconTheme: IconThemeData(color: Color(0xff807C7C)),

      actionIconTheme: ActionIconThemeData(
        closeButtonIconBuilder: (BuildContext context) {
          return Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Theme.of(context).colorScheme.outline,
                width: 1.5,
              ),
            ),
            child: const Icon(Icons.close, size: 20.0),
          );
        },
        backButtonIconBuilder: (BuildContext context) {
          return Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Theme.of(context).colorScheme.outline,
                width: 1.5,
              ),
            ),
            child: const Icon(Icons.arrow_back_rounded, size: 20.0),
          );
        },
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.primaryForeground,
          disabledBackgroundColor: AppColors.disabled,
          disabledForegroundColor: AppColors.disabledForeground,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),

      // ─────────────────────────────────────────────
      // Outlined Button
      // ─────────────────────────────────────────────
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.foreground,
          side: const BorderSide(color: AppColors.outline),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),

      // ─────────────────────────────────────────────
      // Text Button
      // ─────────────────────────────────────────────
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),

      // ─────────────────────────────────────────────
      // Divider
      // ─────────────────────────────────────────────
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),

      // ─────────────────────────────────────────────
      // Checkbox
      // ─────────────────────────────────────────────
      checkboxTheme: CheckboxThemeData(
        side: const BorderSide(color: AppColors.outline),
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.primary;
          }

          return AppColors.transparent;
        }),
        checkColor: WidgetStatePropertyAll(AppColors.primaryForeground),
      ),

      // ─────────────────────────────────────────────
      // Switch
      // ─────────────────────────────────────────────
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.primaryForeground;
          }

          return AppColors.subtleForeground;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.primary;
          }

          return AppColors.card;
        }),
      ),

      // ─────────────────────────────────────────────
      // Progress Indicator
      // ─────────────────────────────────────────────
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.primary,
      ),
    );
  }
}
