import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';

class NavBarTabItem extends GButton {
  NavBarTabItem({
    super.key,
    required int index,
    required int selectedIndex,
    IconData? icon,
    String? activeIcon,
    String? inactiveIcon,
    Color activeColor = AppColors.background,
    Color inactiveColor = AppColors.white,
    required super.text,
  }) : super(
         leading: activeIcon != null && inactiveIcon != null
             ? SvgIcon(
                 index == selectedIndex ? activeIcon : inactiveIcon,
                 color: index == selectedIndex ? activeColor : inactiveColor,
               )
             : null,
         icon: icon ?? Icons.circle,
       );
}

class FloatingPillNavBar extends StatelessWidget {
  const FloatingPillNavBar({
    super.key,
    this.onTabChange,
    required this.selectedIndex,
    required this.tabs,
  });

  final void Function(int)? onTabChange;
  final int selectedIndex;
  final List<GButton> tabs;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: AppStyles.paddingScreenHorizontal,
        ),

        // Outer Floating Pill Container
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.elevated, // Dark Navy Background
            borderRadius: BorderRadius.circular(40),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.15),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: GNav(
            tabBackgroundColor: AppColors.primary, // Active tab background
            activeColor: AppColors.primaryForeground,
            color: Colors.white, // Inactive icon color
            rippleColor: Colors.white12,
            hoverColor: Colors.white12,
            gap: 2,
            iconSize: 24,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            duration: const Duration(milliseconds: 300),
            selectedIndex: selectedIndex,
            onTabChange: onTabChange,
            tabs: tabs,
          ),
        ),
      ),
    );
  }
}
