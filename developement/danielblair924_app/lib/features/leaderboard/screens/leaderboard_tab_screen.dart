import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/features/leaderboard/leaderboard.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class LeaderboardTabScreen extends ConsumerStatefulWidget {
  const LeaderboardTabScreen({super.key});

  @override
  ConsumerState<LeaderboardTabScreen> createState() => _LeaderboardTabScreenState();
}

class _LeaderboardTabScreenState extends ConsumerState<LeaderboardTabScreen> {
  DateFilter selectedFilter = DateFilter.thisMonth;

  @override
  Widget build(BuildContext context) {
    final leaderboardState = ref.watch(leaderboardProvider);
    final users = leaderboardState.users;

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Leaderboard'),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: () => ref.read(leaderboardProvider.notifier).loadLeaderboard(),
            color: context.scheme.primary,
            backgroundColor: AppColors.elevated,
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                SliverPadding(
                  padding: EdgeInsets.fromLTRB(
                    AppStyles.paddingScreenHorizontal,
                    0,
                    AppStyles.paddingScreenHorizontal,
                    24.h,
                  ),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Filter Tab Bar
                      LeaderboardListFilter(
                        selectedFilter: selectedFilter,
                        onFilterChanged: (filter) {
                          setState(() => selectedFilter = filter);
                          ref.read(leaderboardProvider.notifier).changeFilter(filter);
                        },
                      ),
                      SizedBox(height: 24.h),

                      // 1. Loading State
                      if (leaderboardState.isLoading && users.isEmpty)
                        Padding(
                          padding: EdgeInsets.symmetric(vertical: 60.h),
                          child: Center(
                            child: CircularProgressIndicator(
                              color: context.scheme.primary,
                            ),
                          ),
                        )
                      // 2. Error State
                      else if (leaderboardState.errorMessage != null && users.isEmpty)
                        AppCard(
                          padding: EdgeInsets.all(24.w),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.error_outline, size: 48, color: AppColors.error),
                              12.height,
                              Text(
                                leaderboardState.errorMessage!,
                                style: context.bodyMedium.copyWith(color: AppColors.white),
                                textAlign: TextAlign.center,
                              ),
                              16.height,
                              AppButton(
                                width: 140.w,
                                onPressed: () => ref.read(leaderboardProvider.notifier).loadLeaderboard(),
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        )
                      // 3. Empty State
                      else if (users.isEmpty)
                        AppCard(
                          padding: EdgeInsets.all(32.w),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.emoji_events_outlined, size: 54, color: AppColors.subtleForeground),
                              16.height,
                              Text(
                                'No runners on the leaderboard yet.',
                                style: context.titleMedium.copyWith(color: AppColors.white),
                                textAlign: TextAlign.center,
                              ),
                              8.height,
                              Text(
                                'Log your runs to claim the top podium spot!',
                                style: context.bodySmall.copyWith(color: AppColors.subtleForeground),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        )
                      // 4. Populated State
                      else ...[
                        // Podium Top 3 View (2nd - 1st - 3rd)
                        _buildPodium(context, users),
                        SizedBox(height: 24.h),

                        // List of Rank 4+ Items
                        _buildRankList(context, users),
                      ],
                    ]),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPodium(BuildContext context, List<LeaderboardUser> users) {
    final rank1 = users.isNotEmpty ? users[0] : null;
    final rank2 = users.length > 1 ? users[1] : null;
    final rank3 = users.length > 2 ? users[2] : null;

    if (rank1 == null) return const SizedBox.shrink();

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        // 2nd Place (Left)
        Expanded(
          child: rank2 != null
              ? LeaderboardPodiumItem(
                  onTap: () {
                    context.push(
                      AppRoutes.rankUserDetails,
                      extra: RankUserDetailsArgs(id: rank2.id),
                    );
                  },
                  user: PodiumUser(
                    rank: rank2.rank,
                    name: rank2.name,
                    score: rank2.score,
                    avatarUrl: rank2.avatarUrl,
                  ),
                )
              : const SizedBox.shrink(),
        ),

        // 1st Place (Center - Elevated)
        Expanded(
          child: LeaderboardPodiumItem(
            onTap: () {
              context.push(
                AppRoutes.rankUserDetails,
                extra: RankUserDetailsArgs(id: rank1.id),
              );
            },
            avatarRadius: 48,
            user: PodiumUser(
              rank: rank1.rank,
              name: rank1.name,
              score: rank1.score,
              avatarUrl: rank1.avatarUrl,
            ),
          ),
        ),

        // 3rd Place (Right)
        Expanded(
          child: rank3 != null
              ? LeaderboardPodiumItem(
                  onTap: () {
                    context.push(
                      AppRoutes.rankUserDetails,
                      extra: RankUserDetailsArgs(id: rank3.id),
                    );
                  },
                  user: PodiumUser(
                    rank: rank3.rank,
                    name: rank3.name,
                    score: rank3.score,
                    avatarUrl: rank3.avatarUrl,
                  ),
                )
              : const SizedBox.shrink(),
        ),
      ],
    );
  }

  Widget _buildRankList(BuildContext context, List<LeaderboardUser> users) {
    final listUsers = users.length > 3 ? users.sublist(3) : <LeaderboardUser>[];
    if (listUsers.isEmpty) return const SizedBox.shrink();

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: listUsers.length,
      separatorBuilder: (_, _) => SizedBox(height: 12.h),
      itemBuilder: (context, index) {
        final user = listUsers[index];
        return LeaderboardListItem(
          onTap: () {
            context.push(
              AppRoutes.rankUserDetails,
              extra: RankUserDetailsArgs(id: user.id),
            );
          },
          isMe: user.isMe,
          rank: user.rank,
          name: user.name,
          score: user.score,
          avatarUrl: user.avatarUrl,
          rankChange: user.rankChange,
        );
      },
    );
  }
}
