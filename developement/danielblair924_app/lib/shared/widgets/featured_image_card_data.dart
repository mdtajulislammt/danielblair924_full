import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'featured_image_card_data.freezed.dart';

@freezed
abstract class FeaturedImageCardData with _$FeaturedImageCardData {
  const factory FeaturedImageCardData({
    required ImageProvider imageProvider,
    required String title,
    required String subtitle,
    required String badgeText,
    String? badgeHighlightText,
    String? description,
  }) = _FeaturedImageCardData;
}

/// Card widget to display completed event details over a blurred background image.
class FeaturedImageCard extends StatelessWidget {
  const FeaturedImageCard({
    super.key,
    required this.imageProvider,
    this.aspectRatio = 16 / 9,
    this.title,
    this.subtitle,
    this.description,
    this.badgeWidget,
    this.actionWidget,
    this.onPressed,
  });

  final String? title;
  final String? subtitle;
  final Widget? badgeWidget;
  final Widget? actionWidget;
  final ImageProvider imageProvider;
  final double aspectRatio;
  final String? description;
  final VoidCallback? onPressed;

  /// Factory constructor to render directly from [FeaturedImageCardData].
  factory FeaturedImageCard.completedEvent(
    FeaturedImageCardData data, {
    Key? key,
    double aspectRatio = 16 / 9,
    VoidCallback? onPressed,
  }) {
    return FeaturedImageCard(
      key: key,
      imageProvider: data.imageProvider,
      title: data.title,
      subtitle: data.subtitle,
      aspectRatio: aspectRatio,
      actionWidget: AppButton.text(
        size: AppButtonSize.sm,
        suffixIcon: const Icon(Icons.arrow_forward_rounded),
        onPressed: onPressed,
        child: Text('View Finisher Card'),
      ),
      badgeWidget: CompletedEventBadgeHeaderText(
        badgeText: data.badgeText,
        badgeHighlightText: data.badgeHighlightText ?? '',
      ),
    );
  }

  factory FeaturedImageCard.news(
    FeaturedImageCardData data, {
    Key? key,
    double aspectRatio = 16 / 9,
    VoidCallback? onPressed,
  }) {
    return FeaturedImageCard(
      badgeWidget: PillBadge(text: data.badgeText),
      key: key,
      imageProvider: data.imageProvider,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      aspectRatio: aspectRatio,
      onPressed: onPressed,
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlurredImageCard(
      imageProvider: imageProvider,
      aspectRatio: aspectRatio,
      onTap: onPressed,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: <Widget>[
          ?badgeWidget,

          if (title != null || subtitle != null || description != null)
            Spacer(),

          // Bottom Info Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            spacing: 8,
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    if (title != null)
                      Text(
                        title!,
                        style: context.titleMedium,
                        overflow: TextOverflow.ellipsis,
                      ),
                    if (subtitle != null)
                      Text(
                        subtitle!,
                        style: context.bodySmall,
                        overflow: TextOverflow.ellipsis,
                      ),

                    if (description != null) ...[
                      4.height,
                      Text(
                        description!,
                        maxLines: 3,
                        style: context.bodySmall,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ],
                ),
              ),

              ?actionWidget,
            ],
          ),
        ],
      ),
    );
  }
}

class PillBadge extends StatelessWidget {
  const new({super.key, required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: .symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: .circular(2),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11,
          fontWeight: .w600,
          color: AppColors.primaryForeground,
          height: 0,
        ),
      ),
    );
  }
}

/// Header badge text displayed at the top of [FeaturedImageCard].
///
/// Renders [badgeText] with [badgeHighlightText] appended in the primary color.
class CompletedEventBadgeHeaderText extends StatelessWidget {
  const CompletedEventBadgeHeaderText({
    required this.badgeText,
    this.badgeHighlightText = '',
    super.key,
  });

  /// Header text block (e.g., 'SUNSET\nCITY RUN\n').
  final String badgeText;
  final String badgeHighlightText;

  @override
  Widget build(BuildContext context) {
    return RichText(
      text: TextSpan(
        style: context.displaySmall.copyWith(fontWeight: FontWeight.bold),
        children: <TextSpan>[
          TextSpan(text: badgeText),
          TextSpan(
            text: badgeHighlightText,
            style: TextStyle(color: context.scheme.primary),
          ),
        ],
      ),
    );
  }
}
