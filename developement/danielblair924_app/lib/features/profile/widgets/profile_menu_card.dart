import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';

class ProfileMenuItem {
  final Widget leading;
  final String title;
  final Widget? trailing;
  final VoidCallback onTap;

  const ProfileMenuItem({
    required this.leading,
    required this.title,
    this.trailing,
    required this.onTap,
  });
}

class ProfileMenuCard extends StatelessWidget {
  final List<ProfileMenuItem> items;
  final Color? backgroundColor;
  final double minVerticalPadding;
  final EdgeInsetsGeometry dividerIndent;

  const ProfileMenuCard({
    super.key,
    required this.items,
    this.backgroundColor,
    this.minVerticalPadding = 24.0,
    this.dividerIndent = const EdgeInsets.symmetric(horizontal: 16.0),
  });

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();

    final titleStyle = context.titleLarge.copyWith(
      fontWeight: FontWeight.w600,
      color: context.scheme.onTertiary,
    );

    return AppCard(
      backgroundColor: backgroundColor ?? AppColors.elevated,
      padding: EdgeInsets.zero,
      child: Column(
        children: List.generate(items.length, (index) {
          final item = items[index];
          final isLast = index == items.length - 1;

          return Column(
            children: [
              ListTile(
                minVerticalPadding: minVerticalPadding,
                onTap: item.onTap,
                leading: item.leading,
                trailing: DefaultTextStyle(
                  style: context.titleLarge.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                  child:
                      item.trailing ??
                      SvgIcon(
                        Assets.icons.chevronRight,
                        color: AppColors.primary.withValues(alpha: 0.5),
                      ),
                ),
                title: Text(item.title, overflow: .ellipsis,),
                titleTextStyle: titleStyle,
                subtitleTextStyle: context.bodySmall,
              ),
              if (!isLast)
                Divider(
                  indent: dividerIndent.horizontal / 2,
                  endIndent: dividerIndent.horizontal / 2,
                  height: 0,
                ),
            ],
          );
        }),
      ),
    );
  }
}
