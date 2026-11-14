import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/profile/profile.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class AchivementsScreen extends ConsumerWidget {
  const AchivementsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final badgesAsync = ref.watch(myBadgesProvider);

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: Column(
          spacing: 1,
          children: [
            const Text('Achievements'),
            badgesAsync.when(
              data: (data) => Text(
                '${data.totalEarned} of ${data.totalAvailable} earned',
                style: context.bodyMedium.copyWith(
                  color: context.scheme.onTertiary,
                ),
              ),
              loading: () => Text(
                'Loading...',
                style: context.bodyMedium.copyWith(
                  color: context.scheme.onTertiary,
                ),
              ),
              error: (_, __) => const SizedBox.shrink(),
            ),
          ],
        ),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          bottom: false,
          child: badgesAsync.when(
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
                    'Failed to load achievements',
                    style: context.bodyMedium.copyWith(color: AppColors.white),
                  ),
                  16.height,
                  AppButton(
                    onPressed: () => ref.read(myBadgesProvider.notifier).loadBadges(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
            data: (myBadges) {
              final allBadges = myBadges.badges;
              final eventBadges = allBadges.where((b) => b.tagType != 'RATW').toList();
              final journeyBadges = allBadges.where((b) => b.tagType == 'RATW').toList();

              // Fallback if no backend badges yet
              final displayedEventBadges = eventBadges.isNotEmpty ? eventBadges : allBadges;

              return RefreshIndicator(
                onRefresh: () => ref.read(myBadgesProvider.notifier).loadBadges(),
                color: context.scheme.primary,
                backgroundColor: AppColors.elevated,
                child: FullHeightScrollView(
                  padding: EdgeInsets.only(
                    top: 16.h,
                    left: AppStyles.paddingScreenHorizontal,
                    right: AppStyles.paddingScreenHorizontal,
                    bottom: Utils.bottomPaddingInset(context),
                  ),
                  child: Column(
                    spacing: 16.h,
                    children: [
                      SectionHeader(
                        title: 'EVENT BADGES',
                        titleStyle: context.titleMedium.copyWith(
                          color: Colors.transparent,
                          fontSize: 18,
                          shadows: <Shadow>[
                            Shadow(
                              offset: const Offset(0, -5),
                              color: context.scheme.onSurface,
                            ),
                          ],
                          decoration: TextDecoration.underline,
                          decorationStyle: TextDecorationStyle.solid,
                          decorationColor: context.scheme.primary,
                          decorationThickness: 1,
                        ),
                      ),
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        padding: EdgeInsets.only(bottom: 16.h),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          mainAxisSpacing: 8.h,
                          crossAxisSpacing: 8.w,
                          childAspectRatio: 3 / 4,
                        ),
                        itemCount: displayedEventBadges.length,
                        itemBuilder: (context, index) {
                          final badge = displayedEventBadges[index];
                          final badgeImg = _resolveBadgeAsset(index, badge.iconUrl, false);
                          final earnedStr = badge.earnedAt != null
                              ? '${badge.earnedAt!.month}/${badge.earnedAt!.day}/${badge.earnedAt!.year}'
                              : (badge.isUnlocked ? 'Earned' : 'Locked');

                          return BadgeCard(
                            achieved: badge.isUnlocked,
                            title: badge.name,
                            subtitle: earnedStr,
                            badge: badgeImg,
                            onPressed: (achieved) {
                              if (!achieved) return;
                              context.push(AppRoutes.badgePreview, extra: badge.name);
                            },
                          );
                        },
                      ),

                      if (journeyBadges.isNotEmpty) ...[
                        SectionHeader(
                          title: 'WORLD JOURNEY BADGES',
                          titleStyle: context.titleMedium.copyWith(
                            color: Colors.transparent,
                            fontSize: 18,
                            shadows: <Shadow>[
                              Shadow(
                                offset: const Offset(0, -5),
                                color: context.scheme.onSurface,
                              ),
                            ],
                            decoration: TextDecoration.underline,
                            decorationStyle: TextDecorationStyle.solid,
                            decorationColor: context.scheme.primary,
                            decorationThickness: 1,
                          ),
                        ),
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          padding: EdgeInsets.zero,
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            mainAxisSpacing: 8.h,
                            crossAxisSpacing: 8.w,
                            childAspectRatio: 3 / 4,
                          ),
                          itemCount: journeyBadges.length,
                          itemBuilder: (context, index) {
                            final badge = journeyBadges[index];
                            final badgeImg = _resolveBadgeAsset(index, badge.iconUrl, true);
                            final earnedStr = badge.earnedAt != null
                                ? '${badge.earnedAt!.month}/${badge.earnedAt!.day}/${badge.earnedAt!.year}'
                                : (badge.isUnlocked ? 'Earned' : 'Locked');

                            return BadgeCard(
                              achieved: badge.isUnlocked,
                              title: badge.name,
                              subtitle: earnedStr,
                              badge: badgeImg,
                              onPressed: (achieved) {
                                if (!achieved) return;
                                context.push(AppRoutes.badgePreview, extra: badge.name);
                              },
                            );
                          },
                        ),
                      ],
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  String _resolveBadgeAsset(int index, String iconUrl, bool isJourney) {
    if (iconUrl.startsWith('http')) return iconUrl;
    if (isJourney) {
      final assets = [
        Assets.temp.wordJoournewBadge01.path,
        Assets.temp.wordJoournewBadge02.path,
        Assets.temp.wordJoournewBadge03.path,
        Assets.temp.wordJoournewBadge04.path,
      ];
      return assets[index % assets.length];
    } else {
      final assets = [
        Assets.temp.eventBadge01.path,
        Assets.temp.eventBadge02.path,
        Assets.temp.eventBadge03.path,
        Assets.temp.eventBadge04.path,
      ];
      return assets[index % assets.length];
    }
  }
}
