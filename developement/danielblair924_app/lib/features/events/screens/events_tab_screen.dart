import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/widgets.dart';
import '../../../shared/widgets/widgets.dart';
import '../models/event_model.dart';
import '../providers/events_provider.dart';
import '../widgets/activity_card.dart';
import '../widgets/club_event_card.dart';

class EventsTabScreen extends ConsumerStatefulWidget {
  const EventsTabScreen({super.key});

  @override
  ConsumerState<EventsTabScreen> createState() => _EventsTabScreenState();
}

class _EventsTabScreenState extends ConsumerState<EventsTabScreen> {
  int _activeTab = 0; // 0 = Club Events, 1 = My Submissions

  final List<String> _filters = ['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'];

  @override
  Widget build(BuildContext context) {
    final eventsState = ref.watch(eventsProvider);

    // Listen for feedback messages
    ref.listen(eventsProvider, (prev, next) {
      if (next.actionMessage != null && prev?.actionMessage != next.actionMessage) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.actionMessage!),
            backgroundColor: AppColors.primary,
            behavior: SnackBarBehavior.floating,
          ),
        );
        ref.read(eventsProvider.notifier).clearMessages();
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Club Events'),
        backgroundColor: Colors.transparent,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => ref.read(eventsProvider.notifier).fetchEvents(),
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
              await ref.read(eventsProvider.notifier).fetchEvents();
            },
            child: FullHeightScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Tab Switcher: Club Events vs My Submissions
                  _buildTabSwitcher(context),
                  16.verticalSpace,

                  if (_activeTab == 0) ...[
                    // Filter Pills
                    _buildFilterRow(eventsState),
                    16.verticalSpace,

                    // Events Content
                    if (eventsState.isLoading && eventsState.events.isEmpty)
                      _buildLoadingSkeleton()
                    else if (eventsState.errorMessage != null && eventsState.events.isEmpty)
                      _buildErrorState(eventsState.errorMessage!)
                    else if (eventsState.filteredEvents.isEmpty)
                      _buildEmptyState()
                    else
                      ...eventsState.filteredEvents.map(
                        (event) => Padding(
                          padding: EdgeInsets.only(bottom: 16.h),
                          child: ClubEventCard(
                            event: event,
                            isJoining: eventsState.isJoining &&
                                eventsState.joiningEventId == event.id,
                            onJoin: () {
                              ref.read(eventsProvider.notifier).joinEvent(event.id);
                            },
                          ),
                        ),
                      ),
                  ] else ...[
                    // My Event Submissions / Activities Tab
                    _buildMyActivitiesTab(context),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTabSwitcher(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              onTap: () => setState(() => _activeTab = 0),
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _activeTab == 0 ? AppColors.card2 : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: Text(
                  'Upcoming Events',
                  style: context.titleSmall.copyWith(
                    color: _activeTab == 0 ? AppColors.primary : AppColors.subtleForeground,
                    fontWeight: _activeTab == 0 ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: InkWell(
              onTap: () => setState(() => _activeTab = 1),
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _activeTab == 1 ? AppColors.card2 : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: Text(
                  'My Submissions',
                  style: context.titleSmall.copyWith(
                    color: _activeTab == 1 ? AppColors.primary : AppColors.subtleForeground,
                    fontWeight: _activeTab == 1 ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterRow(EventsState state) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _filters.map((filter) {
          final isSelected = state.selectedFilter == filter;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () => ref.read(eventsProvider.notifier).setFilter(filter),
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : AppColors.card2,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected ? AppColors.primary : AppColors.border,
                  ),
                ),
                child: Text(
                  filter,
                  style: TextStyle(
                    color: isSelected ? Colors.black : AppColors.foreground,
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildLoadingSkeleton() {
    return Column(
      children: List.generate(
        3,
        (index) => Container(
          margin: EdgeInsets.only(bottom: 16.h),
          height: 160.h,
          decoration: BoxDecoration(
            color: AppColors.card2.withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: const Center(
            child: CircularProgressIndicator(color: AppColors.primary),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(vertical: 48.h, horizontal: 24.w),
      decoration: BoxDecoration(
        color: AppColors.card2.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.event_busy_rounded, size: 48, color: AppColors.subtleForeground),
          16.verticalSpace,
          Text(
            'No Events Found',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.foreground),
          ),
          8.verticalSpace,
          Text(
            'There are no events matching the selected filter. Check back soon for new club runs!',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: AppColors.subtleForeground),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: AppColors.destructive.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.destructive.withValues(alpha: 0.4)),
      ),
      child: Column(
        children: [
          const Icon(Icons.error_outline_rounded, size: 36, color: AppColors.destructive),
          12.verticalSpace,
          Text(
            'Unable to load events',
            style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.foreground),
          ),
          6.verticalSpace,
          Text(
            error,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: AppColors.subtleForeground),
          ),
          16.verticalSpace,
          AppButton.outlined(
            size: AppButtonSize.sm,
            child: const Text('Retry'),
            onPressed: () => ref.read(eventsProvider.notifier).fetchEvents(),
          ),
        ],
      ),
    );
  }

  Widget _buildMyActivitiesTab(BuildContext context) {
    final historyState = ref.watch(runHistoryProvider);
    final items = historyState.items;

    if (historyState.isLoading && items.isEmpty) {
      return Padding(
        padding: EdgeInsets.symmetric(vertical: 40.h),
        child: const Center(child: CircularProgressIndicator()),
      );
    }

    if (items.isEmpty) {
      return Padding(
        padding: EdgeInsets.symmetric(vertical: 40.h),
        child: Center(
          child: Column(
            children: [
              Icon(Icons.directions_run, size: 48, color: AppColors.mutedForeground),
              SizedBox(height: 12.h),
              Text(
                'No Run Submissions Yet',
                style: context.bodyLarge.copyWith(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 6.h),
              Text(
                'Log your first run to see your activities and status here!',
                style: context.bodySmall.copyWith(color: AppColors.mutedForeground),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      separatorBuilder: (_, _) => SizedBox(height: 16.h),
      itemBuilder: (context, index) {
        final item = items[index];
        final isApproved = item.status.toLowerCase() == 'approved';
        final isRejected = item.status.toLowerCase() == 'rejected';

        ActivityBadgeStatus badgeStatus = ActivityBadgeStatus.pending;
        if (isApproved) {
          badgeStatus = ActivityBadgeStatus.approved;
        } else if (isRejected) {
          badgeStatus = ActivityBadgeStatus.rejected;
        }

        return ActivityCard(
          title: item.activity,
          dateTimeText: item.date,
          status: badgeStatus,
          stats: <StatItem>[
            StatItem(label: 'DISTANCE', value: item.distance),
            StatItem(label: 'DURATION', value: item.duration),
            StatItem(label: 'PACE', value: item.pace),
          ],
          linkedTitle: item.activity,
          onTap: () {
            if (isRejected) {
              context.push(
                AppRoutes.eventSubmissionFeedback,
                extra: {
                  'rejectionReason': item.status,
                  'submittedImageUrl': item.imageUrl,
                },
              );
            }
          },
          onLinkedTap: () {},
        );
      },
    );
  }
}
