import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/widgets.dart';
import '../../../features/home/home.dart';
import '../../../shared/widgets/widgets.dart';
import '../challenge.dart';

class ChallengeTabScreen extends ConsumerStatefulWidget {
  const ChallengeTabScreen({super.key});

  @override
  ConsumerState<ChallengeTabScreen> createState() => _ChallengeTabScreenState();
}

class _ChallengeTabScreenState extends ConsumerState<ChallengeTabScreen> {
  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.sizeOf(context).height;
    final mapHeight = height * 0.32;
    final challengeState = ref.watch(challengeProvider);

    final currentMilestone = challengeState.currentMilestone;
    final nextMilestone = challengeState.nextMilestone;
    final activeChallenge = challengeState.activeChallenge;

    final initialCenter = currentMilestone?.coordinates ??
        (challengeState.routes.isNotEmpty && challengeState.routes.first.points.isNotEmpty
            ? challengeState.routes.first.points.first.point
            : const LatLng(41.9028, 12.4964));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Run Around the World'),
        backgroundColor: Colors.transparent,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => ref.read(challengeProvider.notifier).fetchChallengeData(),
          ),
        ],
      ),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        child: SafeArea(
          child: RefreshIndicator(
            color: AppColors.primary,
            backgroundColor: const Color(0xFF1E2117),
            onRefresh: () async {
              await ref.read(challengeProvider.notifier).fetchChallengeData();
            },
            child: SizedBox(
              height: height,
              child: Stack(
                children: [
                  ReusableWorldMap(
                    initialCenter: initialCenter,
                    height: mapHeight,
                    routes: challengeState.routes,
                    onLocationTap: (MapLocation? location) {
                      if (location == null) return;
                      if (location.status == 'Locked') {
                        context.push(
                          AppRoutes.journeyLocationLocked,
                          extra: location,
                        );
                      } else {
                        context.push(
                          AppRoutes.journeyLocationDetail,
                          extra: location,
                        );
                      }
                    },
                  ),

                  SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(height: mapHeight - 70),

                        // Dynamic Run Progress Card
                        RunProgressCard(
                          backgroundColor: AppColors.elevated.withValues(alpha: 0.92),
                          headerTitle: 'RUN AROUND THE WORLD',
                          cityName: currentMilestone?.destination ?? 'ROME',
                          progressValue: (activeChallenge?.progressPercent ?? 3.5) / 100.0,
                          completedKmText: challengeState.currentCollectiveKm.toInt().toString(),
                          targetKmText: (activeChallenge?.targetProgress.toInt() ?? 40075).toString(),
                          nextStopLabel: 'km to ${nextMilestone?.destination ?? "next stop"}',
                          footerTitle: "You've contributed: ${activeChallenge?.userIndividualKm.toInt() ?? 0} km",
                        ),
                        16.verticalSpace,

                        // View Full Map button
                        AppButton.outlined(
                          width: double.infinity,
                          child: const Text('View Full Map'),
                          onPressed: () => context.push(AppRoutes.fullJourney),
                        ),
                        20.verticalSpace,

                        // Recent Milestones Header
                        SectionHeader(
                          title: 'Recent Milestones',
                          actions: [
                            AppButton.text(
                              spacing: 0,
                              padding: const EdgeInsets.only(left: 4),
                              borderRadius: 5,
                              height: 32,
                              suffixIcon: const Icon(
                                Icons.chevron_right_rounded,
                                size: 20,
                              ),
                              child: Text(
                                'View full map',
                                style: context.labelLarge.copyWith(
                                  color: context.scheme.primary,
                                ),
                              ),
                              onPressed: () => context.push(AppRoutes.fullJourney),
                            ),
                          ],
                        ),
                        12.verticalSpace,

                        // Horizontal Milestone Cards
                        RecentMileStoneList(
                          destinations: challengeState.destinations,
                          selectedIndex: challengeState.selectedMilestoneIndex,
                          onMilestoneTap: (index) {
                            ref.read(challengeProvider.notifier).selectMilestone(index);
                          },
                          onDestinationTap: (dest) {
                            final mapLoc = dest.toMapLocation();
                            if (dest.isLocked) {
                              context.push(
                                AppRoutes.journeyLocationLocked,
                                extra: mapLoc,
                              );
                            } else {
                              context.push(
                                AppRoutes.journeyLocationDetail,
                                extra: mapLoc,
                              );
                            }
                          },
                        ),
                        24.verticalSpace,

                        // Top Contributors Section
                        if (challengeState.participants.isNotEmpty) ...[
                          SectionHeader(title: 'TOP CONTRIBUTORS'),
                          12.verticalSpace,
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: challengeState.participants.map((p) {
                                return Padding(
                                  padding: EdgeInsets.only(right: 12.w),
                                  child: UserAvatarBadgeItem(
                                    imageUrl: p.avatarUrl,
                                    badgeText: p.rank.toString(),
                                    subtitle: '${p.individualKm.toInt()} km',
                                    subtitleStyle: context.titleMedium,
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                          32.verticalSpace,
                        ],
                      ],
                    ),
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
