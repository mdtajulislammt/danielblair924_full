import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/profile/profile.dart';
import 'package:first_mile_club/features/profile/providers/run_history_provider.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CompletedEventsScreen extends ConsumerWidget {
  const CompletedEventsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyState = ref.watch(runHistoryProvider);
    final approvedSubmissions = historyState.items
        .where((s) => s.status.toLowerCase() == 'approved')
        .toList();

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Completed Events'),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          bottom: false,
          child: FullHeightScrollView(
            padding: EdgeInsets.only(
              left: AppStyles.paddingScreenHorizontal,
              right: AppStyles.paddingScreenHorizontal,
              bottom: Utils.bottomPaddingInset(context),
            ),
            child: approvedSubmissions.isEmpty
                ? Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 40.h),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.emoji_events_outlined, size: 64, color: AppColors.mutedForeground),
                          SizedBox(height: 16.h),
                          Text(
                            'No Completed Events Yet',
                            style: context.bodyLarge.copyWith(fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 8.h),
                          Text(
                            'Complete and verify your event runs to showcase them here!',
                            style: context.bodySmall.copyWith(color: AppColors.mutedForeground),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: approvedSubmissions.length,
                    separatorBuilder: (_, _) => SizedBox(height: 16.h),
                    itemBuilder: (context, index) {
                      final item = approvedSubmissions[index];
                      final cardData = FeaturedImageCardData(
                        imageProvider: AssetImage(Assets.temp.sunset.path),
                        badgeText: '${item.activity.toUpperCase()}\n',
                        badgeHighlightText: item.distance,
                        title: item.activity,
                        subtitle: 'Completed • ${item.date}',
                      );
                      return FeaturedImageCard.completedEvent(cardData);
                    },
                  ),
          ),
        ),
      ),
    );
  }
}
