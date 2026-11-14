import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

/// Card showing journey progress towards the next milestone.
class JourneyProgressCard extends StatelessWidget {
  const JourneyProgressCard({
    super.key,
    required this.completedKm,
    required this.totalKm,
    required this.unlockText,
    this.progress = 0.7,
  });

  final int completedKm;
  final int totalKm;
  final String unlockText;
  final double progress;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      width: .infinity,
      child: Column(
        spacing: 6,
        crossAxisAlignment: .start,
        mainAxisSize: .min,
        children: [
          RichText(
            text: TextSpan(
              style: context.bodySmall,
              children: <TextSpan>[
                TextSpan(
                  text: '$completedKm',
                  style: context.headlineLarge.copyWith(fontWeight: .bold),
                ),
                TextSpan(
                  text: ' / $totalKm km',
                  style: context.titleMedium.copyWith(
                    color: context.scheme.onTertiary,
                  ),
                ),
              ],
            ),
          ),

          LinearProgressIndicator(
            value: progress,
            backgroundColor: AppColors.outline,
            minHeight: 10,
            borderRadius: BorderRadius.circular(4.0),
          ),

          Text(
            unlockText,
            style: context.bodySmall,
            overflow: .ellipsis,
          ),
        ],
      ),
    );
  }
}
