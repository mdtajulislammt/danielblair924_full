import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/auth/auth.dart';
import 'package:first_mile_club/features/profile/profile.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class ProfileTabScreen extends ConsumerWidget {
  const ProfileTabScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final statsAsync = ref.watch(profileStatsProvider);
    final displayName = user?.fullName ?? 'Runner';
    final memberEmail = user?.email ?? 'Member';

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: () => ref.read(profileStatsProvider.notifier).loadStats(),
            color: context.scheme.primary,
            backgroundColor: AppColors.elevated,
            child: FullHeightScrollView(
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
                        imageUrl: user?.avatarUrl ?? 'https://i.pravatar.cc/150?img=5',
                      ),
                      Text(
                        displayName,
                        style: context.displaySmall,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      2.height,
                      Text(
                        memberEmail,
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
                          statsAsync.when(
                            data: (stats) => '#${stats.currentRank}',
                            loading: () => '#1',
                            error: (_, __) => '#1',
                          ),
                          style: context.titleMedium.copyWith(
                            color: AppColors.black,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),

                  statsAsync.when(
                    data: (stats) => RunStatsCard(
                      backgroundColor: AppColors.black,
                      items: [
                        StatTileItem(
                          value: stats.lifetimeDistanceKm.toStringAsFixed(1),
                          unit: 'KM',
                          label: 'LIFETIME',
                        ),
                        StatTileItem(
                          value: '${stats.eventsJoined}',
                          label: 'EVENTS',
                        ),
                        StatTileItem(
                          value: '${stats.badgesEarned}',
                          label: 'BADGES',
                          valueColor: context.scheme.primary,
                        ),
                      ],
                    ),
                    loading: () => RunStatsCard(
                      backgroundColor: AppColors.black,
                      items: [
                        StatTileItem(value: '--', unit: 'KM', label: 'LIFETIME'),
                        StatTileItem(value: '--', label: 'EVENTS'),
                        StatTileItem(
                          value: '--',
                          label: 'BADGES',
                          valueColor: context.scheme.primary,
                        ),
                      ],
                    ),
                    error: (_, __) => RunStatsCard(
                      backgroundColor: AppColors.black,
                      items: [
                        StatTileItem(value: '0.0', unit: 'KM', label: 'LIFETIME'),
                        StatTileItem(value: '0', label: 'EVENTS'),
                        StatTileItem(
                          value: '0',
                          label: 'BADGES',
                          valueColor: context.scheme.primary,
                        ),
                      ],
                    ),
                  ),

                  ProfileMenuCard(
                    items: [
                      ProfileMenuItem(
                        title: 'Running Stats',
                        leading: SvgIcon(
                          Assets.icons.chart02,
                          size: 32,
                          themeColor: true,
                        ),
                        onTap: () => context.push(AppRoutes.profileRunningStats),
                      ),
                      ProfileMenuItem(
                        title: 'Run History',
                        leading: SvgIcon(
                          Assets.icons.clipboard,
                          size: 32,
                          themeColor: true,
                        ),
                        onTap: () => context.push(AppRoutes.profileRunHistory),
                      ),
                      ProfileMenuItem(
                        title: 'Completed Events',
                        leading: SvgIcon(
                          Assets.icons.medal,
                          size: 32,
                          themeColor: true,
                        ),
                        onTap: () =>
                            context.push(AppRoutes.profileCompletedEvents),
                      ),
                      ProfileMenuItem(
                        title: 'Achievements',
                        leading: SvgIcon(
                          Assets.icons.trophy,
                          size: 32,
                          themeColor: true,
                        ),
                        onTap: () => context.push(AppRoutes.profileAchivements),
                      ),
                      ProfileMenuItem(
                        title: 'Log Out',
                        leading: const Icon(
                          Icons.logout,
                          size: 28,
                          color: AppColors.error,
                        ),
                        onTap: () async {
                          final confirm = await showDialog<bool>(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              backgroundColor: AppColors.elevated,
                              title: const Text('Log Out'),
                              content: const Text('Are you sure you want to log out?'),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.of(ctx).pop(false),
                                  child: const Text('Cancel'),
                                ),
                                TextButton(
                                  onPressed: () => Navigator.of(ctx).pop(true),
                                  child: const Text(
                                    'Log Out',
                                    style: TextStyle(color: AppColors.error),
                                  ),
                                ),
                              ],
                            ),
                          );
                          if (confirm == true) {
                            await ref.read(authStateProvider.notifier).logout();
                            if (context.mounted) {
                              context.go(AppRoutes.signIn);
                            }
                          }
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
