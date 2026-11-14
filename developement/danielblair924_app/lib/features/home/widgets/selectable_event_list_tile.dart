import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';

class SelectableEventListTile extends StatelessWidget {
  const SelectableEventListTile({
    required this.title,
    required this.subtitle,
    required this.isSelected,
    required this.onTap,
    super.key,
    this.leadingIcon,
    this.selectedColor = AppColors.primary, // Adjust to match your app theme
    this.unselectedColor = Colors.grey,
  });

  final String title;
  final String subtitle;
  final bool isSelected;
  final VoidCallback onTap;
  final Widget? leadingIcon;
  final Color selectedColor;
  final Color unselectedColor;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      tileColor: AppColors.elevated,
      shape: AppRoundedBorder(color: AppColors.elevatedBorder),
      onTap: onTap,
      leading: leadingIcon,
      title: Text(title, overflow: TextOverflow.ellipsis),
      subtitle: Padding(
        padding: const EdgeInsets.only(top: 6),
        child: Text(subtitle, overflow: TextOverflow.ellipsis),
      ),
      titleTextStyle: context.titleLarge.copyWith(fontWeight: FontWeight.w600),
      subtitleTextStyle: context.bodySmall,
      trailing: Icon(
        isSelected ? Icons.check_circle : Icons.radio_button_unchecked,
        color: isSelected ? selectedColor : unselectedColor,
        size: 24,
      ),
    );
  }
}
