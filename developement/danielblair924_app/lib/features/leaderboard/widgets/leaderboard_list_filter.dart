import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';

enum DateFilter { thisMonth, allTime, byEvent }

class LeaderboardListFilter extends StatelessWidget {
  const LeaderboardListFilter({
    required this.selectedFilter,
    required this.onFilterChanged,
    super.key,
  });

  final DateFilter selectedFilter;
  final ValueChanged<DateFilter> onFilterChanged;

  @override
  Widget build(BuildContext context) {
    return AppButtonGroup<DateFilter>(
      selectedValue: selectedFilter,
      onSelected: onFilterChanged,
      unselectedSide: const BorderSide(color: AppColors.inputBorder),
      items: const [
        AppButtonGroupItem(value: DateFilter.thisMonth, label: 'This Month'),
        AppButtonGroupItem(value: DateFilter.allTime, label: 'All-Time'),
        AppButtonGroupItem(value: DateFilter.byEvent, label: 'By Event'),
      ],
    );
  }
}
