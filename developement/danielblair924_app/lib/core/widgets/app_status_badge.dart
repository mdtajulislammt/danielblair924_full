import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';

/// Status scope for Activity Badges
enum ActivityBadgeStatus { pending, approved, rejected, inProgress }

/// Status scope specifically for History Badges
enum HistoryBadgeStatus { pending, approved, rejected }

/// Unified UI style representation for status mapping
class BadgeStyle {
  final String label;
  final String? svgPath;
  final Color borderColor;
  final Color textColor;
  final Color backgroundColor;
  final double borderRadius;

  const BadgeStyle({
    required this.label,
    this.svgPath,
    required this.borderColor,
    required this.textColor,
    this.backgroundColor = AppColors.transparent,
    this.borderRadius = 6.0,
  });
}

class AppStatusBadge extends StatelessWidget {
  final String label;
  final String? svgPath;
  final Widget? icon;
  final Color textColor;
  final Color borderColor;
  final Color? backgroundColor;
  final double borderRadius;
  final double iconSize;

  /// Default constructor for full manual control
  const AppStatusBadge({
    super.key,
    required this.label,
    this.svgPath,
    this.icon,
    required this.textColor,
    required this.borderColor,
    this.backgroundColor = AppColors.transparent,
    this.borderRadius = 6.0,
    this.iconSize = 16.0,
  });

  /// Resolves styles automatically from `BadgeStatus`
  factory AppStatusBadge.fromActivityStatus(
    ActivityBadgeStatus status, {
    Key? key,
    String? customLabel,
    String? customSvgPath,
    Widget? customIcon,
    Color? backgroundColor,
    double? borderRadius,
    double iconSize = 16.0,
  }) {
    final style = _getActivityStyle(status);

    return AppStatusBadge(
      key: key,
      label: customLabel ?? style.label,
      svgPath: customIcon == null ? (customSvgPath ?? style.svgPath) : null,
      icon: customIcon,
      borderColor: style.borderColor,
      textColor: style.textColor,
      backgroundColor: backgroundColor ?? style.backgroundColor,
      borderRadius: borderRadius ?? style.borderRadius,
      iconSize: iconSize,
    );
  }

  /// Resolves styles automatically from `HistoryBadgeStatus` (icons omitted by default)
  factory AppStatusBadge.fromHistoryStatus(
    HistoryBadgeStatus status, {
    Key? key,
    String? customLabel,
    String? customSvgPath,
    Widget? customIcon,
    Color? backgroundColor,
    double? borderRadius,
    double iconSize = 16.0,
  }) {
    final style = _getHistoryStyle(status);

    return AppStatusBadge(
      key: key,
      label: customLabel ?? style.label,
      svgPath: customIcon == null ? (customSvgPath ?? style.svgPath) : null,
      icon: customIcon,
      borderColor: style.borderColor,
      textColor: style.textColor,
      backgroundColor: backgroundColor ?? style.backgroundColor,
      borderRadius: borderRadius ?? style.borderRadius,
      iconSize: iconSize,
    );
  }

  /// Map ActivityBadgeStatus (Activity) to UI Styles
  static BadgeStyle _getActivityStyle(ActivityBadgeStatus status) {
    switch (status) {
      case ActivityBadgeStatus.pending:
        return BadgeStyle(
          label: 'PENDING',
          svgPath: Assets.icons.clock,
          borderColor: AppColors.elevatedBorder,
          textColor: AppColors.cardForeground,
          borderRadius: 6.0,
        );
      case ActivityBadgeStatus.approved:
        return BadgeStyle(
          label: 'APPROVED',
          svgPath: Assets.icons.badgeArrroved,
          borderColor: AppColors.success,
          textColor: AppColors.background,
          backgroundColor: AppColors.success,
          borderRadius: 6.0,
        );
      case ActivityBadgeStatus.rejected:
        return BadgeStyle(
          label: 'REJECTED',
          svgPath: Assets.icons.clock,
          borderColor: AppColors.elevatedBorder,
          textColor: AppColors.destructive,
          borderRadius: 6.0,
        );
      case ActivityBadgeStatus.inProgress:
        return BadgeStyle(
          label: 'IN PROGRESS',
          svgPath: Assets.icons.clock,
          borderColor: AppColors.elevatedBorder,
          textColor: AppColors.info,
          borderRadius: 6.0,
        );
    }
  }

  /// Map HistoryBadgeStatus to UI Styles (No icons configured)
  static BadgeStyle _getHistoryStyle(HistoryBadgeStatus status) {
    final borderRadius = 32.0;
    switch (status) {
      case HistoryBadgeStatus.pending:
        return BadgeStyle(
          label: 'PENDING',
          borderColor: AppColors.mutedForeground,
          textColor: AppColors.cardForeground,
          borderRadius: borderRadius,
        );
      case HistoryBadgeStatus.approved:
        return BadgeStyle(
          label: 'APPROVED',
          borderColor: AppColors.success,
          textColor: AppColors.black,
          backgroundColor: AppColors.success,
          borderRadius: borderRadius,
        );
      case HistoryBadgeStatus.rejected:
        return BadgeStyle(
          label: 'REJECTED',
          borderColor: AppColors.destructive,
          textColor: AppColors.destructive,
          backgroundColor: AppColors.destructive.withAlpha(70),
          borderRadius: borderRadius,
        );
    }
  }

  Widget? _buildIcon() {
    if (icon != null) return icon;

    if (svgPath != null && svgPath!.isNotEmpty) {
      return SvgIcon(
        svgPath!,
        width: iconSize,
        height: iconSize,
        color: textColor,
      );
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    final Widget? effectiveIcon = _buildIcon();

    return SizedBox(
      height: 30,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(borderRadius),
          border: Border.all(color: borderColor, width: 1.2),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            spacing: 6,
            children: <Widget>[
              ?effectiveIcon,
              Text(
                label,
                style: context.bodySmall.copyWith(
                  color: textColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
