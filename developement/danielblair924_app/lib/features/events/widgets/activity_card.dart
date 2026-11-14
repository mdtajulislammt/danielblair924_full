import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';

class ActivityCard extends StatelessWidget {
  final String title;
  final String dateTimeText;
  final ActivityBadgeStatus status;
  final String? statusLabel;
  final List<StatItem> stats;
  final String? linkedTitle;
  final VoidCallback? onLinkedTap;
  final VoidCallback? onTap;
  final Widget? headerIcon;
  final IconData linkedIcon;

  const ActivityCard({
    super.key,
    required this.title,
    required this.dateTimeText,
    required this.status,
    this.statusLabel,
    required this.stats,
    this.linkedTitle,
    this.onLinkedTap,
    this.onTap,
    this.headerIcon,
    this.linkedIcon = Icons.map_rounded,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      width: double.infinity,
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Header Row
          Row(
            spacing: 12.0,
            children: <Widget>[
              AppIconBox(
                child: headerIcon ?? SvgIcon(Assets.icons.runningStickman),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      title,
                      style: context.titleMedium,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2.0),
                    Text(
                      dateTimeText,
                      style: context.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              AppStatusBadge.fromActivityStatus(status, customLabel: statusLabel),
            ],
          ),

          const Divider(height: 32.0, color: AppColors.border),

          // Stats Section
          ActivityStatsRow(stats: stats),

          // Optional Linked Item Section
          if (linkedTitle != null && linkedTitle!.isNotEmpty) ...<Widget>[
            const Divider(height: 32.0, color: AppColors.border),
            InkWell(
              onTap: onLinkedTap,
              borderRadius: BorderRadius.circular(8.0),
              child: Row(
                spacing: 12.0,
                children: <Widget>[
                  AppIconBox(
                    borderRadius: 8.0,
                    child: Icon(
                      linkedIcon,
                      color: context.scheme.primary,
                      size: 20.0,
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text('Linked to', style: context.bodySmall),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            Flexible(
                              child: Text(
                                linkedTitle!,
                                style: context.titleMedium.copyWith(
                                  color: context.scheme.primary,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 4.0),
                            Icon(
                              Icons.chevron_right_rounded,
                              size: 18.0,
                              color: context.scheme.primary,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
