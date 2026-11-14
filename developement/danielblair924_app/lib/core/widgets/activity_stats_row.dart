import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class StatItem {
  final String label;
  final String value;

  const StatItem({required this.label, required this.value});
}

class ActivityStatsRow extends StatelessWidget {
  final List<StatItem> stats;

  const ActivityStatsRow({super.key, required this.stats});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: stats.map((StatItem stat) {
        return Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            spacing: 2,
            children: <Widget>[
              Text(stat.label.toUpperCase(), style: context.bodySmall),
              Text(stat.value, style: context.titleMedium),
            ],
          ),
        );
      }).toList(),
    );
  }
}
