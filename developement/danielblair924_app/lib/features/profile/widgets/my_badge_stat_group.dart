import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class MyBadgeStatGroup extends StatelessWidget {
  const MyBadgeStatGroup({
    super.key,
    required this.items,
    this.dividerHeight = 60.0,
    this.dividerColor = AppColors.inputBorder,
    this.dividerThickness = 1.0,
  });

  final List<MyBadgeStatGroupItem> items;
  final double dividerHeight;
  final Color dividerColor;
  final double dividerThickness;

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: List.generate((items.length * 2) - 1, (index) {
        if (index.isEven) {
          final itemIndex = index ~/ 2;
          return Expanded(child: items[itemIndex]);
        } else {
          return SizedBox(
            height: dividerHeight,
            child: VerticalDivider(
              color: dividerColor,
              thickness: dividerThickness,
            ),
          );
        }
      }),
    );
  }
}

class MyBadgeStatGroupItem extends StatelessWidget {
  const MyBadgeStatGroupItem({
    super.key,
    required this.value,
    required this.label,
    this.unit,
    this.icon,
    this.valueColor,
    this.labelColor,
  });

  final String value;
  final String label;
  final String? unit;

  /// Optional icon placed directly above the label
  final Widget? icon;

  /// Backward-compatible value color fallback
  final Color? valueColor;
  final Color? labelColor;

  @override
  Widget build(BuildContext context) {
    final defaultLabelColor = labelColor ?? AppColors.subtleForeground;
    final defaultValueColor = valueColor ?? AppColors.white;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: .center,
      children: [
        if (icon != null) ...[icon!, const SizedBox(height: 4)],
        Text(
          label.toUpperCase(),
          style: TextStyle(
            color: defaultLabelColor,
            fontSize: 12,
            fontWeight: FontWeight.w400,
            letterSpacing: 1.2,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        Text(
          value,
          style: TextStyle(
            color: defaultValueColor,
            fontSize: 22,
            fontWeight: FontWeight.bold,
            height: 1.1,
          ),
          textAlign: TextAlign.center,
        ),
        if (unit != null && unit!.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(
            unit!.toUpperCase(),
            style: TextStyle(
              color: defaultLabelColor,
              fontSize: 12,
              fontWeight: FontWeight.w400,
              letterSpacing: 1.0,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ],
    );
  }
}
