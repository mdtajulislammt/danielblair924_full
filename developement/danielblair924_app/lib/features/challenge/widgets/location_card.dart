import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

class LocationCard extends StatelessWidget {
  final String imagePath;
  final String title;
  final String subtitle;
  final bool isSelected;
  final VoidCallback? onTap;
  final double cardWidth;
  final double cardHeight;
  final double borderRadius;

  const LocationCard({
    super.key,
    required this.imagePath,
    required this.title,
    required this.subtitle,
    this.isSelected = false,
    this.onTap,
    this.cardWidth = 84.0,
    this.cardHeight = 116.0,
    this.borderRadius = 8.0,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 8,
          children: [
            AppCard(
              backgroundImage: DecorationImage(
                image: AssetImage(imagePath),
                fit: .cover,
              ),
              onTap: onTap,
              borderRadius: borderRadius,
              padding: EdgeInsets.zero,
              height: cardHeight,
              width: cardWidth,
              child: Stack(
                children: [
                  if (isSelected)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Icon(
                        Icons.check_circle_rounded,
                        color: context.scheme.primary,
                        size: 20,
                      ),
                    ),
                ],
              ),
            ),
            GestureDetector(
              onTap: onTap,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: context.titleSmall,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    subtitle,
                    style: context.bodySmall,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
