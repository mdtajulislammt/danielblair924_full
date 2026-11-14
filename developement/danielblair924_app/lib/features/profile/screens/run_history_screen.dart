import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../../../core/extensions/extensions.dart';
import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../../home/models/submission_model.dart';
import '../providers/run_history_provider.dart';
import '../widgets/run_history_list_filter.dart';

class RunHistoryScreen extends ConsumerStatefulWidget {
  const RunHistoryScreen({super.key});

  @override
  ConsumerState<RunHistoryScreen> createState() => _RunHistoryScreenState();
}

class _RunHistoryScreenState extends ConsumerState<RunHistoryScreen> {
  HistoryBadgeStatus _mapStatus(String status) {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return HistoryBadgeStatus.approved;
      case 'REJECTED':
        return HistoryBadgeStatus.rejected;
      case 'PENDING':
      default:
        return HistoryBadgeStatus.pending;
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(runHistoryProvider);
    final items = state.filteredItems;

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Run History'),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: () => ref
                .read(runHistoryProvider.notifier)
                .fetchMySubmissions(isRefresh: true),
            color: AppColors.primary,
            child: FullHeightScrollView(
              padding: EdgeInsets.symmetric(
                horizontal: AppStyles.paddingScreenHorizontal,
              ),
              child: Column(
                children: [
                  RunHistoryListFilter(
                    selectedFilter: state.selectedFilter,
                    onFilterChanged: (filter) {
                      ref.read(runHistoryProvider.notifier).setFilter(filter);
                    },
                  ),

                  24.height,

                  // Loading State
                  if (state.isLoading && !state.isRefreshing)
                    const Padding(
                      padding: EdgeInsets.only(top: 64.0),
                      child: Center(
                        child: CircularProgressIndicator(
                          valueColor:
                              AlwaysStoppedAnimation<Color>(AppColors.primary),
                        ),
                      ),
                    )
                  // Error State
                  else if (state.errorMessage != null && items.isEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 64.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.error_outline,
                            size: 48,
                            color: AppColors.destructive,
                          ),
                          12.height,
                          Text(
                            state.errorMessage!,
                            style: context.bodyMedium.copyWith(
                              color: AppColors.subtleForeground,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          16.height,
                          AppButton(
                            width: 140,
                            height: 40,
                            child: const Text('Try Again'),
                            onPressed: () => ref
                                .read(runHistoryProvider.notifier)
                                .fetchMySubmissions(),
                          ),
                        ],
                      ),
                    )
                  // Empty State
                  else if (items.isEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 64.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          AppIconBox(
                            size: 64,
                            child: SvgIcon(
                              Assets.icons.medal,
                              size: 40,
                              color: AppColors.primary,
                            ),
                          ),
                          16.height,
                          Text(
                            'No Run Submissions Yet',
                            style: context.titleLarge.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          8.height,
                          Text(
                            'Log and submit your first run to start tracking your progress!',
                            style: context.bodyMedium.copyWith(
                              color: AppColors.subtleForeground,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          24.height,
                          AppButton(
                            width: 180,
                            child: const Text('Submit a Run'),
                            onPressed: () =>
                                context.push(AppRoutes.submitRunPrompt),
                          ),
                        ],
                      ),
                    )
                  // Populated List
                  else
                    Material(
                      color: Colors.transparent,
                      child: ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: items.length,
                        separatorBuilder: (_, _) => SizedBox(height: 12.h),
                        itemBuilder: (context, index) {
                          final item = items[index];
                          final badgeStatus = _mapStatus(item.status);

                          return ListTile(
                            shape: AppRoundedBorder(),
                            tileColor: AppColors.card2,
                            onTap: () => context.push(
                              AppRoutes.profileRunHistoryDetails,
                              extra: item,
                            ),
                            leading: AppIconBox(
                              size: 50,
                              child: SvgIcon(Assets.icons.medal, size: 32),
                            ),
                            title: RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: item.distanceKm.toStringAsFixed(2),
                                    style: context.headlineMedium.copyWith(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  TextSpan(
                                    text: ' KM',
                                    style: context.titleSmall.copyWith(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            subtitle: Text('${item.activity} • ${item.date}'),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              spacing: 12,
                              children: [
                                AppStatusBadge.fromHistoryStatus(badgeStatus),
                                SvgIcon(
                                  Assets.icons.chevronRight,
                                  color: AppColors.primary.withValues(alpha: 0.5),
                                ),
                              ],
                            ),
                            titleTextStyle: context.titleLarge.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                            subtitleTextStyle: context.bodySmall,
                          );
                        },
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
