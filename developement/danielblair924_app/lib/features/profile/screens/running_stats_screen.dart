import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/profile/profile.dart';
import 'package:first_mile_club/features/profile/providers/profile_stats_provider.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class RunningStatsScreen extends ConsumerWidget {
  const RunningStatsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(profileStatsProvider);

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Running Stats'),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          bottom: false,
          child: statsAsync.when(
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
                    'Failed to load running stats',
                    style: context.bodyMedium.copyWith(color: AppColors.white),
                  ),
                  16.height,
                  AppButton(
                    onPressed: () => ref.read(profileStatsProvider.notifier).loadStats(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
            data: (stats) {
              final items = [
                StatTileItem(
                  value: stats.averagePace,
                  label: 'AVERAGE PACE',
                  unit: '/KM',
                ),
                StatTileItem(
                  value: stats.longestRun.toStringAsFixed(1),
                  label: 'LONGEST RUN',
                  unit: 'KM',
                ),
                StatTileItem(
                  value: '${stats.totalRuns}',
                  label: 'TOTAL RUNS',
                  unit: 'RUNS',
                ),
                StatTileItem(
                  value: stats.thisMonthKm.toStringAsFixed(1),
                  label: 'THIS MONTH',
                  unit: 'KM',
                ),
              ];

              return FullHeightScrollView(
                padding: EdgeInsets.only(
                  left: AppStyles.paddingScreenHorizontal,
                  right: AppStyles.paddingScreenHorizontal,
                  bottom: Utils.bottomPaddingInset(context),
                ),
                child: Column(
                  spacing: 20.h,
                  children: [
                    AppCard(
                      height: 124,
                      width: double.infinity,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'TOTAL DISTANCE',
                                  style: context.bodyMedium.copyWith(
                                    color: context.scheme.onTertiary,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                StatValueUnitText(
                                  value: stats.lifetimeDistanceKm.toStringAsFixed(1),
                                  unit: 'KM',
                                  valueSize: 64.0,
                                ),
                              ],
                            ),
                          ),
                          Assets.images.runningStatDecoration.image(),
                        ],
                      ),
                    ),
                    GridView.count(
                      shrinkWrap: true,
                      padding: EdgeInsets.zero,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      mainAxisSpacing: 20.h,
                      crossAxisSpacing: 16.w,
                      childAspectRatio: 7 / 4,
                      children: items
                          .map(
                            (item) => AppCard(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    item.label,
                                    style: context.bodyMedium.copyWith(
                                      color: context.scheme.primary,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  StatValueUnitText(
                                    value: item.value,
                                    unit: item.unit,
                                    unitColor: AppColors.disabledForeground,
                                  ),
                                ],
                              ),
                            ),
                          )
                          .toList(),
                    ),
                    MonthlyBreakdownChart(
                      monthlyValues: stats.monthlyBreakdown,
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
