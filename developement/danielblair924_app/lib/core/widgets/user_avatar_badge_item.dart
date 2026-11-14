import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

class UserAvatarBadgeItem extends StatelessWidget {
  const UserAvatarBadgeItem({
    super.key,
    required this.imageUrl,
    required this.badgeText,
    required this.subtitle,
    this.avatarRadius = 36.0,
    this.badgeRadius = 12.0,
    this.badgeBottomOffset = -8.0,
    this.spacing = 12.0,
    this.subtitleStyle,
  });

  final String imageUrl;
  final String badgeText;
  final String subtitle;
  final double avatarRadius;
  final double badgeRadius;
  final double badgeBottomOffset;
  final double spacing;
  final TextStyle? subtitleStyle;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      spacing: spacing,
      children: <Widget>[
        Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.bottomCenter,
          children: <Widget>[
            Avatar(radius: avatarRadius, imageUrl: imageUrl),
            Positioned(
              bottom: badgeBottomOffset,
              child: CircleAvatar(
                radius: badgeRadius,
                child: FittedBox(child: Text(badgeText)),
              ),
            ),
          ],
        ),
        Text(
          subtitle,
          style: subtitleStyle ?? Theme.of(context).textTheme.titleMedium,
        ),
      ],
    );
  }
}
