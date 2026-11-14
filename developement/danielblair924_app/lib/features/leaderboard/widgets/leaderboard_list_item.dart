import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

/// Represents rank change trend direction
enum RankTrend {
  up,
  down,
  same;

  factory RankTrend.fromChange(int change) {
    if (change > 0) return RankTrend.up;
    if (change < 0) return RankTrend.down;
    return RankTrend.same;
  }
}

class LeaderboardListItem extends StatelessWidget {
  const LeaderboardListItem({
    required this.rank,
    required this.name,
    required this.score,
    required this.avatarUrl,
    this.isMe = false,
    this.rankChange = 0,
    this.avatarRadius = 18.0,
    this.backgroundColor = AppColors.elevated,
    this.padding = const EdgeInsets.symmetric(vertical: 6.0, horizontal: 12.0),
    this.onTap,
    super.key,
  });

  /// Display rank number (e.g., 1 -> "#1")
  final int rank;

  /// User display name
  final String name;

  /// User score formatted string (e.g., "145.2 KM")
  final String score;

  /// User image URL
  final String avatarUrl;

  /// Highlights item if it represents the current user
  final bool isMe;

  /// Rank movement magnitude (e.g. +2 for up 2, -1 for down 1, 0 for same)
  final int rankChange;

  /// Avatar circle radius
  final double avatarRadius;

  /// Background color of the card
  final Color backgroundColor;

  /// Internal card padding
  final EdgeInsetsGeometry padding;

  /// Optional tap handler
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final trend = RankTrend.fromChange(rankChange);

    final card = AppCard(
      backgroundColor: backgroundColor,
      padding: padding,
      onTap: onTap,
      child: Row(
        spacing: 12.w,
        children: <Widget>[
          Text('#$rank', style: context.titleMedium),
          Avatar(
            border: Border.all(width: 0),
            imageUrl: avatarUrl,
            radius: avatarRadius,
          ),
          Expanded(
            child: Text(
              name,
              style: context.titleMedium,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          _RankTrendIndicator(trend: trend, changeAmount: rankChange.abs()),
          Text(score, style: context.titleMedium),
        ],
      ),
    );

    if (!isMe) return card;

    return Container(
      foregroundDecoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppStyles.cardBorderRadius),
        border: Border(
          left: BorderSide(color: context.scheme.primary, width: 4.0),
          top: BorderSide(
            color: context.scheme.primary,
            width: AppStyles.cardBorderWidth,
          ),
          bottom: BorderSide(
            color: context.scheme.primary,
            width: AppStyles.cardBorderWidth,
          ),
          right: BorderSide(
            color: context.scheme.primary,
            width: AppStyles.cardBorderWidth,
          ),
        ),
      ),
      child: card,
    );
  }
}

class _RankTrendIndicator extends StatelessWidget {
  const _RankTrendIndicator({required this.trend, required this.changeAmount});

  final RankTrend trend;
  final int changeAmount;

  @override
  Widget build(BuildContext context) {
    switch (trend) {
      case RankTrend.up:
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            SvgIcon(Assets.icons.chevronUp, color: AppColors.primary),
            Text(
              '$changeAmount',
              style: context.titleMedium.copyWith(color: AppColors.primary),
            ),
          ],
        );

      case RankTrend.down:
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            SvgIcon(Assets.icons.chevronDown, color: AppColors.error),
            Text(
              '$changeAmount',
              style: context.titleMedium.copyWith(color: AppColors.error),
            ),
          ],
        );

      case RankTrend.same:
        return Text(
          '--',
          style: context.titleMedium.copyWith(
            color: context.titleMedium?.color?.withValues(alpha: 0.5),
          ),
        );
    }
  }
}
