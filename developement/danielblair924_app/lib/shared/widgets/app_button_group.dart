import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

class AppButtonGroupItem<T> {
  const AppButtonGroupItem({
    required this.value,
    required this.label,
    this.prefixIcon,
    this.suffixIcon,
    this.flex = 1,
  });

  final T value;
  final String label;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final int flex;
}

class AppButtonGroup<T> extends StatelessWidget {
  const AppButtonGroup({
    required this.items,
    required this.selectedValue,
    required this.onSelected,
    this.size = AppButtonSize.sm,
    this.spacing = 12.0,
    this.selectedSide,
    this.unselectedSide = const BorderSide(color: AppColors.inputBorder),
    super.key,
  });

  /// List of items to display in the group
  final List<AppButtonGroupItem<T>> items;

  /// Currently selected item value
  final T selectedValue;

  /// Callback triggered when a tab is tapped
  final ValueChanged<T> onSelected;

  /// Button size preset for all items
  final AppButtonSize size;

  /// Spacing between buttons
  final double spacing;

  /// Optional border side when selected
  final BorderSide? selectedSide;

  /// Default border side when unselected
  final BorderSide? unselectedSide;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: spacing,
      children: items.map((item) {
        final isSelected = item.value == selectedValue;

        return Expanded(
          flex: item.flex,
          child: AppButton(
            variant: isSelected
                ? AppButtonVariant.primary
                : AppButtonVariant.primaryReverse,
            size: size,
            side: isSelected ? selectedSide : unselectedSide,
            prefixIcon: item.prefixIcon,
            suffixIcon: item.suffixIcon,
            onPressed: () => onSelected(item.value),
            child: Text(item.label, maxLines: 1, softWrap: false),
          ),
        );
      }).toList(),
    );
  }
}
