import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/app_colors.dart';
import 'package:first_mile_club/core/theme/extensions/app_theme_extensions.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';

class BadgeCard extends StatelessWidget {
  const BadgeCard({
    super.key,
    this.achieved = false,
    required this.badge,
    required this.title,
    required this.subtitle,
    this.onPressed,
  });

  final bool achieved;
  final String badge;
  final String title;
  final String subtitle;
  final Function(bool)? onPressed;

  // dart format off
  // Grayscale matrix that strips RGB saturation
  static const List<double> _grayscaleMatrix = <double>[
    0.2126, 0.7152, 0.0722, 0, 0,
    0.2126, 0.7152, 0.0722, 0, 0,
    0.2126, 0.7152, 0.0722, 0, 0,
    0,      0,      0,      1, 0,
  ];
  // dart format on

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: () => onPressed?.call(achieved),
      backgroundColor: AppColors.black,
      child: Column(
        children: <Widget>[
          Stack(
            children: [
              ColorFiltered(
                colorFilter: achieved
                    ? const ColorFilter.mode(Colors.transparent, BlendMode.dst)
                    : const ColorFilter.matrix(_grayscaleMatrix),
                child: Opacity(
                  opacity: achieved
                      ? 1.0
                      : 0.5, // Optional: slightly dim Unachieved badges
                  child: badge.startsWith('http')
                      ? Image.network(
                          badge,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Image.asset(
                            Assets.temp.eventBadge01.path,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        )
                      : Image.asset(
                          badge.isNotEmpty ? badge : Assets.temp.eventBadge01.path,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                ),
              ),

              if (!achieved)
                Positioned(
                  right: 2,
                  bottom: 2,
                  child: AppIconBox(
                    size: 28,
                    padding: .zero,
                    borderColor: Color(0xff8C8C8C),
                    child: SvgIcon(
                      Assets.icons.lock,
                      size: 18,
                      color: AppColors.white,
                    ),
                  ),
                ),
            ],
          ),
          8.height,
          Text(
            title,
            style: context.titleMedium.copyWith(
              color: !achieved ? AppColors.disabledForeground : null,
            ),
            overflow: .ellipsis,
          ),
          Text(
            subtitle,
            style: context.bodySmall.copyWith(
              color: !achieved ? AppColors.disabledForeground : null,
            ),
            overflow: .ellipsis,
          ),
        ],
      ),
    );
  }
}
