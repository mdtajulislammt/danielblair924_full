import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/news/news.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class AllNewsScreen extends ConsumerWidget {
  const AllNewsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final newsAsync = ref.watch(newsListProvider);

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
          child: RefreshIndicator(
            onRefresh: () => ref.read(newsListProvider.notifier).loadNews(),
            color: context.scheme.primary,
            backgroundColor: AppColors.elevated,
            child: newsAsync.when(
              loading: () => Center(
                child: CircularProgressIndicator(color: context.scheme.primary),
              ),
              error: (err, _) => Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.error_outline, size: 48, color: AppColors.error),
                    12.height,
                    Text(
                      'Failed to load news: $err',
                      style: context.bodyMedium.copyWith(color: AppColors.white),
                      textAlign: TextAlign.center,
                    ),
                    16.height,
                    AppButton(
                      onPressed: () => ref.read(newsListProvider.notifier).loadNews(),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
              data: (articles) {
                if (articles.isEmpty) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.newspaper, size: 54, color: AppColors.subtleForeground),
                          16.height,
                          Text(
                            'No announcements yet',
                            style: context.titleMedium.copyWith(color: AppColors.white),
                          ),
                          8.height,
                          Text(
                            'Check back soon for club news and event updates.',
                            style: context.bodySmall.copyWith(color: AppColors.subtleForeground),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return FullHeightScrollView(
                  padding: EdgeInsets.only(
                    left: AppStyles.paddingScreenHorizontal,
                    right: AppStyles.paddingScreenHorizontal,
                    top: AppStyles.paddingScreenHorizontal,
                    bottom: Utils.bottomPaddingInset(context),
                  ),
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: articles.length,
                    separatorBuilder: (_, _) => SizedBox(height: 16.h),
                    itemBuilder: (context, index) {
                      final article = articles[index];
                      final imgProvider = _resolveCoverImage(article.coverImageUrl, index);

                      final cardData = FeaturedImageCardData(
                        imageProvider: imgProvider,
                        badgeText: article.badgeText,
                        title: article.title,
                        subtitle: article.date.isNotEmpty ? 'Published on ${article.date}' : 'Club Announcement',
                        description: article.body.length > 120
                            ? '${article.body.substring(0, 120)}...'
                            : article.body,
                      );

                      return FeaturedImageCard.news(
                        cardData,
                        onPressed: () {
                          context.push(
                            AppRoutes.newsAndAnnouncementsDetails,
                            extra: article,
                          );
                        },
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  ImageProvider _resolveCoverImage(String url, int index) {
    if (url.startsWith('http')) {
      return NetworkImage(url);
    }
    final fallbacks = [
      Assets.temp.sunset.path,
      Assets.temp.nightRun.path,
    ];
    return AssetImage(fallbacks[index % fallbacks.length]);
  }
}
