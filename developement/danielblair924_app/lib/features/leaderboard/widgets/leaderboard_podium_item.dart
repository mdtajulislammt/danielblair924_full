import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';

@immutable
class PodiumUser {
  const PodiumUser({
    required this.rank,
    required this.name,
    required this.score,
    required this.avatarUrl,
  });

  final int rank;
  final String name;
  final String score;
  final String avatarUrl;
}

class LeaderboardPodiumItem extends StatelessWidget {
  const LeaderboardPodiumItem({
    required this.user,
    this.avatarRadius = 34.0,
    this.avatarBorder,
    this.rankTextStyle,
    this.nameTextStyle,
    this.scoreTextStyle,
    this.spacing = 2.0,
    this.onTap,
    super.key,
  });

  /// User dynamic data for the podium slot
  final PodiumUser user;

  /// Radius of the circular avatar (default is 36.0 -> 72x72 box size)
  final double avatarRadius;

  /// Custom border configuration for the avatar
  final BoxBorder? avatarBorder;

  /// Custom text style overrides
  final TextStyle? rankTextStyle;
  final TextStyle? nameTextStyle;
  final TextStyle? scoreTextStyle;

  /// Vertical space between element blocks
  final double spacing;

  /// Optional callback when tapping the item
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;
    final isWinner = user.rank == 1;

    final effectiveRankStyle =
        rankTextStyle ??
        textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.bold,
          height: 0.9,
          fontSize: 20.0,
          color: user.rank == 3 ? Color(0xff917070) : Colors.white,
        );

    final effectiveNameStyle =
        nameTextStyle ??
        textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w600);

    final effectiveScoreStyle = scoreTextStyle ?? textTheme.bodyMedium;

    final effectiveBorder =
        avatarBorder ??
        Border.all(
          color: isWinner ? AppColors.primary : AppColors.white,
          width: 2.0,
        );

    final content = Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: .center,
      children: <Widget>[
        isWinner
            ? Assets.icons.crown.image(width: 32)
            : Text(user.rank.toString(), style: effectiveRankStyle),
        2.height,
        Avatar(
          border: effectiveBorder,
          radius: avatarRadius,
          imageUrl: user.avatarUrl,
        ),
        SizedBox(height: spacing),
        Text(
          user.name,
          style: effectiveNameStyle,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        SizedBox(height: spacing),
        Text(
          user.score,
          style: effectiveScoreStyle,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );

    if (onTap == null) return content;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: content,
    );
  }
}
