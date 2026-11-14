import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

@immutable
class StatTileItem {
  const StatTileItem({
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
}

class RunStatsCard extends StatelessWidget {
  const RunStatsCard({
    required this.items,
    super.key,
    this.dividerColor = const Color(0xFF2C4A08),
    this.backgroundColor = AppColors.card2,
    this.valueStyle,
    this.unitStyle,
    this.labelStyle,
  });

  final List<StatTileItem> items;
  final Color dividerColor;
  final Color backgroundColor;

  /// Common value text style for all items in this card
  final TextStyle? valueStyle;

  /// Common unit text style for all items in this card
  final TextStyle? unitStyle;

  /// Common label text style for all items in this card
  final TextStyle? labelStyle;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      backgroundColor: backgroundColor,
      child: IntrinsicHeight(
        child: Row(
          spacing: 8,
          crossAxisAlignment: .center,
          children: List.generate(items.length * 2 - 1, (index) {
            // Even indices render StatTiles, odd indices render Dividers
            if (index.isEven) {
              final itemIndex = index ~/ 2;
              return Expanded(
                child: StatTile(
                  item: items[itemIndex],
                  valueStyle: valueStyle,
                  unitStyle: unitStyle,
                  labelStyle: labelStyle,
                ),
              );
            } else {
              return _VerticalDivider(color: dividerColor);
            }
          }),
        ),
      ),
    );
  }
}

class StatTile extends StatelessWidget {
  const StatTile({
    super.key,
    required this.item,
    this.valueStyle,
    this.unitStyle,
    this.labelStyle,
  });

  final StatTileItem item;
  final TextStyle? valueStyle;
  final TextStyle? unitStyle;
  final TextStyle? labelStyle;

  @override
  Widget build(BuildContext context) {
    final effectiveLabelColor = item.labelColor ?? context.scheme.onTertiary;

    final defaultLabelStyle = context.bodySmall.copyWith(
      fontWeight: FontWeight.w600,
      color: effectiveLabelColor,
    );

    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (item.icon != null) ...[item.icon!, 6.height],

        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: StatValueUnitText(
            value: item.value,
            unit: item.unit,
            valueStyle: valueStyle,
            unitStyle: unitStyle,
            valueColor: item.valueColor,
          ),
        ),
        4.height,

        Text(
          item.label,
          style: labelStyle ?? defaultLabelStyle,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}

class _VerticalDivider extends StatelessWidget {
  const _VerticalDivider({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 36,
      margin: const EdgeInsets.symmetric(horizontal: 4),
      color: color,
    );
  }
}

class StatValueUnitText extends StatelessWidget {
  const StatValueUnitText({
    required this.value,
    super.key,
    this.unit,
    this.valueStyle,
    this.unitStyle,
    this.valueColor,
    this.unitColor,
    this.valueSize,
    this.unitSize,
  });

  final String value;
  final String? unit;
  final TextStyle? valueStyle;
  final TextStyle? unitStyle;
  final Color? valueColor;
  final double? valueSize;
  final double? unitSize;
  final Color? unitColor;

  @override
  Widget build(BuildContext context) {
    final effectiveColor = valueColor ?? AppColors.white;

    final defaultValueStyle = TextStyle(
      color: effectiveColor,
      fontSize: valueSize ?? 36.sp,
      fontWeight: FontWeight.w700,
      letterSpacing: -0.5,
      height: 1,
    );

    final defaultUnitStyle = TextStyle(
      color: unitColor ?? effectiveColor,
      fontSize: unitSize ?? 16.sp,
      fontWeight: FontWeight.w700,
      letterSpacing: -0.5,
    );

    return FittedBox(
      fit: BoxFit.scaleDown,
      child: Text.rich(
        TextSpan(
          text: value,
          style: valueStyle ?? defaultValueStyle,
          children: [
            if (unit != null)
              TextSpan(text: ' $unit', style: unitStyle ?? defaultUnitStyle),
          ],
        ),
      ),
    );
  }
}
