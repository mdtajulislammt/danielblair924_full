import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';

enum RunHistoryDateFilter { allTime, thisMonth, byEvent, byChallenges }

class RunHistoryListFilter extends StatelessWidget {
  const RunHistoryListFilter({
    required this.selectedFilter,
    required this.onFilterChanged,
    super.key,
  });

  final RunHistoryDateFilter selectedFilter;
  final ValueChanged<RunHistoryDateFilter> onFilterChanged;

  @override
  Widget build(BuildContext context) {
    return AppButtonGroup<RunHistoryDateFilter>(
      selectedValue: selectedFilter,
      onSelected: onFilterChanged,
      items: const [
        AppButtonGroupItem(
          flex: 5,
          value: RunHistoryDateFilter.allTime,
          label: 'All',
        ),
        AppButtonGroupItem(
          flex: 6,
          value: RunHistoryDateFilter.thisMonth,
          label: 'This Month',
        ),
        AppButtonGroupItem(
          flex: 5,
          value: RunHistoryDateFilter.byEvent,
          label: 'Events',
        ),
        AppButtonGroupItem(
          flex: 5,
          value: RunHistoryDateFilter.byChallenges,
          label: 'Challenge',
        ),
      ],
    );
  }
}
