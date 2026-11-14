import 'package:first_mile_club/core/extensions/sizedbox_extension.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/news/models/news_article_model.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';

class NewsDetailsScreen extends StatelessWidget {
  const NewsDetailsScreen({super.key, this.article});

  final NewsArticleModel? article;

  @override
  Widget build(BuildContext context) {
    final title = article?.title ?? 'Mountain Trail Challenge 2025';
    final date = article?.date ?? 'May 18, 2025';
    final author = article?.authorName ?? 'Admin Team';
    final body = article?.body ??
        '''
The Mountain Trail Challenge 2025 is back, bigger and better! This year, we’re taking things to a whole new level with tougher trails, more breathtaking views, and exciting new rewards.
Whether you’re a seasoned athlete or just starting your journey, this challenge is designed to bring out the best in you.
Lace up, hit the trails, and be part of an unforgettable adventure. Are you ready to conquer the mountains?

Event Highlights:
• Multiple trail distances for all fitness levels.
• Stunning mountain routes & scenic checkpoints
• Finisher medals & exclusive FMC rewards
• Community vibes and unforgettable moments

Mark your calendar and get ready. The mountains are calling!
        ''';

    final ImageProvider imageProvider = (article?.coverImageUrl.startsWith('http') == true)
        ? NetworkImage(article!.coverImageUrl)
        : AssetImage(Assets.temp.nightRun.path);

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('News & Announcements'),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          bottom: false,
          child: FullHeightScrollView(
            padding: EdgeInsets.only(
              left: AppStyles.paddingScreenHorizontal,
              right: AppStyles.paddingScreenHorizontal,
              top: AppStyles.paddingScreenHorizontal,
              bottom: Utils.bottomPaddingInset(context),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FeaturedImageCard(
                  imageProvider: imageProvider,
                  badgeWidget: PillBadge(text: article?.badgeText ?? 'Update'),
                ),

                16.height,

                Text(
                  title,
                  style: context.headlineSmall.copyWith(fontWeight: FontWeight.w600),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),

                4.height,

                Text(
                  '$date • $author',
                  style: context.bodyLarge.copyWith(
                    color: AppColors.subtleForeground,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),

                16.height,

                Text(
                  body,
                  style: context.bodyMedium.copyWith(
                    color: AppColors.white,
                    height: 1.6,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
