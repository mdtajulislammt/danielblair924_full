import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/leaderboard/leaderboard.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BadgeProfileScreenArgs {
  final String id;
  const BadgeProfileScreenArgs({required this.id});
}

class BadgeProfileScreen extends ConsumerWidget {
  const BadgeProfileScreen({super.key, required this.args});

  final BadgeProfileScreenArgs args;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final memberAsync = ref.watch(memberDetailsProvider(args.id));

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          child: memberAsync.when(
            loading: () => Center(
              child: CircularProgressIndicator(color: context.scheme.primary),
            ),
            error: (err, _) => Center(
              child: Text(
                'Failed to load profile',
                style: context.bodyMedium.copyWith(color: AppColors.error),
              ),
            ),
            data: (member) {
              final fname = member['fname']?.toString() ?? '';
              final lname = member['lname']?.toString() ?? '';
              final name = fname.isNotEmpty || lname.isNotEmpty
                  ? '$fname $lname'.trim()
                  : member['username']?.toString() ?? 'Runner';
              final avatar = member['avatarUrl']?.toString();
              final totalDist = (member['totalDistanceKm'] as num?)?.toDouble() ?? 0.0;
              final joinDate = member['joinDate'] != null
                  ? member['joinDate'].toString().substring(0, 10)
                  : 'FMC Member';
              final badgesList = member['badges'] as List? ?? [];

              return FullHeightScrollView(
                padding: EdgeInsets.symmetric(
                  horizontal: AppStyles.paddingScreenHorizontal,
                ),
                child: Column(
                  spacing: 20,
                  children: [
                    Column(
                      children: [
                        Avatar(
                          radius: 50,
                          imageUrl: avatar,
                        ),
                        Text(
                          name,
                          style: context.displaySmall,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        2.height,
                        Text(
                          'Joined $joinDate',
                          style: context.bodySmall,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        8.height,
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 12),
                          decoration: BoxDecoration(
                            color: context.scheme.primary,
                            borderRadius: BorderRadius.circular(32),
                          ),
                          child: Text(
                            'Runner',
                            style: context.titleMedium.copyWith(
                              color: AppColors.black,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),

                    RunStatsCard(
                      backgroundColor: AppColors.black,
                      valueStyle: context.titleLarge.copyWith(fontWeight: FontWeight.w600),
                      labelStyle: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 10,
                        color: context.scheme.primary,
                      ),
                      unitStyle: context.titleSmall,
                      items: [
                        StatTileItem(
                          value: totalDist.toStringAsFixed(1),
                          unit: 'KM',
                          label: 'LIFETIME DISTANCE',
                          icon: AppIconBox(
                            size: 48,
                            child: SvgIcon(Assets.icons.route02, size: 24),
                          ),
                        ),
                        StatTileItem(
                          value: '${badgesList.length}',
                          label: 'BADGES EARNED',
                          icon: AppIconBox(
                            size: 48,
                            child: SvgIcon(Assets.icons.medal, size: 24),
                          ),
                        ),
                      ],
                    ),

                    SectionHeader(title: 'EARNED BADGES'),

                    if (badgesList.isEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 24),
                        child: Center(
                          child: Text(
                            'No badges unlocked yet.',
                            style: context.bodyMedium.copyWith(color: AppColors.subtleForeground),
                          ),
                        ),
                      )
                    else
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          childAspectRatio: 0.85,
                        ),
                        itemCount: badgesList.length,
                        itemBuilder: (context, index) {
                          final item = badgesList[index];
                          final badge = item['badge'] as Map? ?? {};
                          final badgeName = badge['name']?.toString() ?? 'Badge';
                          return AppCard(
                            padding: const EdgeInsets.all(8),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SvgIcon(Assets.icons.medal, size: 36, themeColor: true),
                                8.height,
                                Text(
                                  badgeName,
                                  style: context.bodySmall.copyWith(fontWeight: FontWeight.w600),
                                  textAlign: TextAlign.center,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
