import 'package:first_mile_club/core/extensions/sizedbox_extension.dart';
import 'package:first_mile_club/core/theme/app_colors.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/shapes/app_rounded_border.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

typedef DynamicTextOrWidget = dynamic;

class CustomListTileCard extends StatelessWidget {
  const CustomListTileCard({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
    this.padding = const EdgeInsets.all(12),
    this.borderRadius = 12,
    this.backgroundColor,
  });

  /// Primary content of the tile (String or Widget)
  final DynamicTextOrWidget title;

  /// Secondary content displayed below title (String or Widget)
  final DynamicTextOrWidget? subtitle;

  /// Optional widget displayed before the title (e.g., SvgIcon, Image, Avatar)
  final Widget? leading;

  /// Optional widget displayed after the title (Defaults to chevron icon)
  final Widget? trailing;

  /// Call-back when card is pressed
  final VoidCallback? onTap;

  /// Internal padding for the card content
  final EdgeInsetsGeometry padding;

  /// Corner radius for the card
  final double borderRadius;

  /// Custom background color override
  final Color? backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: backgroundColor ?? AppColors.card2,
      elevation: 0,
      clipBehavior: Clip.antiAlias,
      shape: AppRoundedBorder(radius: borderRadius),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(borderRadius),
        child: Padding(
          padding: padding,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ?leading,
              12.width,
              Expanded(
                child: Column(
                  spacing: 2,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildTextOrWidget(
                      context,
                      title,
                      style: context.bodyMedium.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (subtitle != null) ...[
                      _buildTextOrWidget(
                        context,
                        subtitle!,
                        style: context.bodySmall,
                      ),
                    ],
                  ],
                ),
              ),
              8.width,
              ?trailing,
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextOrWidget(
    BuildContext context,
    dynamic content, {
    required TextStyle style,
  }) {
    if (content is Widget) return content;
    if (content is String) {
      return Text(content, style: style);
    }
    return const SizedBox.shrink();
  }
}
