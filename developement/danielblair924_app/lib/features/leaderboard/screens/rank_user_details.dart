import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/leaderboard/leaderboard.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class RankUserDetailsArgs {
  final String id;
  const RankUserDetailsArgs({required this.id});
}

class RankUserDetails extends ConsumerWidget {
  const RankUserDetails({super.key, required this.args});

  final RankUserDetailsArgs args;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final memberAsync = ref.watch(memberDetailsProvider(args.id));

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Rank Details'),
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
                'Failed to load member profile: $err',
                style: context.bodyMedium.copyWith(color: AppColors.error),
              ),
            ),
            data: (member) {
              final fname = member['fname']?.toString() ?? '';
              final lname = member['lname']?.toString() ?? '';
              final name = fname.isNotEmpty || lname.isNotEmpty
                  ? '$fname $lname'.trim()
                  : member['username']?.toString() ?? 'Runner';
              final avatar = member['avatarUrl']?.toString() ?? 'https://i.pravatar.cc/150?img=5';
              final totalDist = (member['totalDistanceKm'] as num?)?.toDouble() ?? 0.0;
              final city = member['city']?.toString() ?? 'Community';

              return FullHeightScrollView(
                padding: EdgeInsets.symmetric(
                  horizontal: AppStyles.paddingScreenHorizontal,
                ),
                child: Column(
                  spacing: 20,
                  children: [
                    AppCard(
                      margin: const EdgeInsets.only(top: 12),
                      padding: const EdgeInsets.symmetric(
                        vertical: 32.0,
                        horizontal: 16.0,
                      ),
                      backgroundColor: AppColors.elevated,
                      width: double.infinity,
                      child: Column(
                        children: [
                          Avatar(
                            radius: 50,
                            imageUrl: avatar,
                          ),
                          12.height,
                          Text(
                            name,
                            style: context.displaySmall,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          4.height,
                          Text(
                            city,
                            style: context.bodyMedium.copyWith(color: AppColors.subtleForeground),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          8.height,
                          FittedBox(
                            child: Text(
                              '${totalDist.toStringAsFixed(1)} KM',
                              style: TextStyle(
                                height: 0.8,
                                fontSize: 64,
                                fontWeight: FontWeight.bold,
                                color: context.scheme.primary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          8.height,
                          Text(
                            'total verified distance',
                            style: context.bodyLarge,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),

                    AppCard(
                      backgroundColor: AppColors.black,
                      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 0),
                      child: Column(
                        children: [
                          ListTile(
                            leading: AppIconBox(
                              size: 50,
                              child: SvgIcon(Assets.icons.location04, size: 32),
                            ),
                            title: const Padding(
                              padding: EdgeInsets.only(bottom: 4),
                              child: Text('LIFETIME DISTANCE'),
                            ),
                            subtitle: Text('${totalDist.toStringAsFixed(1)} KM'),
                            titleTextStyle: context.bodySmall,
                            subtitleTextStyle: context.titleMedium,
                          ),
                          const Divider(indent: 16, endIndent: 16),
                          ListTile(
                            leading: AppIconBox(
                              size: 50,
                              child: SvgIcon(Assets.icons.medal, size: 32),
                            ),
                            title: const Padding(
                              padding: EdgeInsets.only(bottom: 4),
                              child: Text('BADGES EARNED'),
                            ),
                            subtitle: Text('${(member['badges'] as List? ?? []).length} Badges'),
                            titleTextStyle: context.bodySmall,
                            subtitleTextStyle: context.titleMedium,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.only(
          left: AppStyles.paddingScreenHorizontal,
          right: AppStyles.paddingScreenHorizontal,
          bottom: Utils.bottomPaddingInset(context),
        ),
        child: AppButton.outlined(
          backgroundColor: AppColors.elevated,
          prefixIcon: SvgIcon(Assets.icons.medal, size: 24),
          child: const Text('View Badges'),
          onPressed: () {
            context.push(
              AppRoutes.badgeProfile,
              extra: BadgeProfileScreenArgs(id: args.id),
            );
          },
        ),
      ),
    );
  }
}
