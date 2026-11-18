import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../../auth/providers/auth_provider.dart';
import '../../challenge/challenge.dart';
import '../home.dart';

class HomeTabScreen extends ConsumerStatefulWidget {
  const HomeTabScreen({super.key});

  @override
  ConsumerState<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends ConsumerState<HomeTabScreen> {
  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider);
    final challengeState = ref.watch(challengeProvider);
    final currentMilestone = challengeState.currentMilestone;
    final nextMilestone = challengeState.nextMilestone;
    final activeChallenge = challengeState.activeChallenge;

    final displayName = user?.fname?.trim().isNotEmpty == true
        ? user!.fname!
        : (user?.username ?? 'Runner');

    return Scaffold(
      appBar: AppBar(
        leading: Padding(
          padding: const EdgeInsets.all(4),
          child: Avatar(
            imageUrl: user?.avatarUrl,
            name: displayName,
          ),
        ),

        title: Row(
          spacing: 8,
          children: [
            Text('Hey, $displayName'),
            Assets.icons.hiSign.image(width: 24, height: 24),
          ],
        ),
        titleTextStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 24),
        centerTitle: false,

        actions: [
          IconButton(
            icon: SvgIcon(Assets.icons.notificationBellDot, themeColor: false),
            onPressed: () {},
          ),
        ],

        backgroundColor: Colors.transparent,
      ),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 32),
            child: Column(
              spacing: 16.h,
              children: [
                RunProgressCard(
                  headerTitle: 'RUN AROUND THE WORLD',
                  backgroudImage: Assets.temp.romeMapPin.path,
                  cityName: currentMilestone?.destination ?? 'ROME',
                  progressValue: (activeChallenge?.progressPercent ?? 3.5) / 100.0,
                  completedKmText: challengeState.currentCollectiveKm.toInt().toString(),
                  targetKmText: (activeChallenge?.targetProgress.toInt() ?? 40075).toString(),
                  nextStopLabel: 'km to ${nextMilestone?.destination ?? "next stop"}',
                  footerTitle: "You've contributed: ${activeChallenge?.userIndividualKm.toInt() ?? 0} km",
                ),
                RunStatsCard(
                  items: [
                    const StatTileItem(value: '12', label: 'YOUR RUNS'),
                    StatTileItem(
                      value: '${activeChallenge?.userIndividualKm.toInt() ?? 84}',
                      unit: 'KM',
                      label: 'LIFETIME',
                    ),
                    StatTileItem(
                      value: '#7',
                      label: 'RANK',
                      valueColor: context.scheme.primary,
                    ),
                  ],
                ),
                AppButton(
                  prefixIcon: const Icon(Icons.add, size: 26),
                  width: double.infinity,
                  height: 56.h,
                  child: const Text('SUBMIT A RUN'),
                  onPressed: () => context.push(AppRoutes.submitRunPrompt),
                ),

                const HomeGridActions(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
