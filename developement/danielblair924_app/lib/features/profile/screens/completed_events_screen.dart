import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/profile/profile.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CompletedEventsScreen extends StatelessWidget {
  const CompletedEventsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      FeaturedImageCardData(
        imageProvider: AssetImage(Assets.temp.sunset.path),
        badgeText: 'SUNSET\nCITY RUN\n',
        badgeHighlightText: '10K',
        title: 'Sunset City Run 10K',
        subtitle: 'Completed on May 18, 2026',
      ),
      FeaturedImageCardData(
        imageProvider: AssetImage(Assets.temp.nightRun.path),
        badgeText: 'NIGHT\nRUN ',
        badgeHighlightText: '5k',
        title: 'Night Run 5K',
        subtitle: 'Completed on May 18, 2026',
      ),

      FeaturedImageCardData(
        imageProvider: AssetImage(Assets.temp.sunset.path),
        badgeText: 'Trail\nChallenge\n',
        badgeHighlightText: '15K',
        title: 'Trail Challenge 15K',
        subtitle: 'Completed on May 18, 2026',
      ),

      FeaturedImageCardData(
        imageProvider: AssetImage(Assets.temp.nightRun.path),
        badgeText: 'OCEAN\nBREEZE RUN\n',
        badgeHighlightText: '7K',
        title: 'OCEAN BREEZE RUN',
        subtitle: 'Completed on May 18, 2026',
      ),
    ];

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
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: items.length,
              separatorBuilder: (_, _) => SizedBox(height: 16.h),
              itemBuilder: (context, index) {
                final item = items[index];
                return FeaturedImageCard.completedEvent(item);
              },
            ),
          ),
        ),
      ),
    );
  }
}
