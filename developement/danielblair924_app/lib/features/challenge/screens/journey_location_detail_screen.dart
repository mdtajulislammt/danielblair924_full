import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../../core/theme/theme.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../challenge.dart';

class JourneyLocationDetailScreen extends ConsumerWidget {
  const JourneyLocationDetailScreen({super.key, required this.args});
  final MapLocation? args;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final challengeState = ref.watch(challengeProvider);

    final title = args?.label ?? 'Rome';
    final heroPath = args?.heroImagePath ?? Assets.temp.rome.path;
    final quote = args?.quote ??
        "Rome wasn't built in a day. But every step brings us closer!";

    final totalKm = args?.distanceRequiredKm?.toInt() ?? 500;
    final completedKm = args?.completed == true
        ? totalKm
        : (challengeState.currentCollectiveKm.toInt()).clamp(0, totalKm);
    final remainingKm = (totalKm - completedKm).clamp(0, totalKm);
    final unlockText = args?.completed == true
        ? 'Milestone Unlocked!'
        : '$remainingKm km to unlock';
    final progress = totalKm > 0 ? (completedKm / totalKm).clamp(0.0, 1.0) : 1.0;

    final participants = challengeState.participants;

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: Colors.transparent,
      ),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            child: Column(
              spacing: 16,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                JourneyLocationHeroImage(imagePath: heroPath),
                Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: AppStyles.paddingScreenHorizontal,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: 16,
                    children: [
                      CityHeaderTitle(
                        title: title,
                      ),

                      JourneyQuoteCard(
                        message: quote,
                      ),

                      JourneyProgressCard(
                        completedKm: completedKm,
                        totalKm: totalKm,
                        progress: progress,
                        unlockText: unlockText,
                      ),
                    ],
                  ),
                ),

                SectionHeader(
                  title: 'TOP CONTRIBUTORS',
                  padding: EdgeInsets.symmetric(
                    horizontal: AppStyles.paddingScreenHorizontal,
                  ),
                ),

                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: EdgeInsets.symmetric(
                    horizontal: AppStyles.paddingScreenHorizontal,
                  ),
                  child: Row(
                    spacing: 12.w,
                    children: participants.isNotEmpty
                        ? participants.map((p) {
                            return UserAvatarBadgeItem(
                              imageUrl: p.avatarUrl ?? '',
                              badgeText: p.rank.toString(),
                              subtitle: '${p.individualKm.toInt()} km',
                              subtitleStyle: context.titleMedium,
                            );
                          }).toList()
                        : [
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 8.0),
                              child: Text(
                                'No runners reached this milestone yet.',
                                style: context.bodySmall.copyWith(
                                  color: AppColors.subtleForeground,
                                ),
                              ),
                            ),
                          ],
                  ),
                ),
                32.verticalSpace,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
