import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/router/app_routes.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/faded_line.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/auth/providers/auth_provider.dart';
import 'package:first_mile_club/features/profile/profile.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class MyBadgePreviewScreen extends ConsumerWidget {
  const MyBadgePreviewScreen({super.key, this.badgeTitle});

  final String? badgeTitle;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final title = badgeTitle ?? '10K FINISHER';
    final user = ref.watch(currentUserProvider);
    final runnerName = user?.fullName?.toUpperCase() ?? 'CLUB RUNNER';

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(backgroundColor: Colors.transparent),
      body: AppGradientBackground(
        child: SafeArea(
          bottom: false,
          child: FullHeightScrollView(
            padding: EdgeInsets.only(
              left: AppStyles.paddingScreenHorizontal,
              right: AppStyles.paddingScreenHorizontal,
              bottom: Utils.bottomPaddingInset(context),
            ),
            child: Column(
              children: [
                AppCard(
                  padding: EdgeInsets.symmetric(vertical: 32.h, horizontal: 16),
                  backgroundColor: Colors.black,
                  borderColor: context.scheme.primary,
                  width: double.infinity,
                  child: Column(
                    children: [
                      Assets.icons.fmcTextIcon.image(height: 30),
                      16.height,
                      FlankingTextHeader(text: 'FINISHER CERTIFICATE'),
                      FittedBox(
                        child: Text(
                          title.toUpperCase(),
                          style: context.headlineLarge.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      12.height,

                      Assets.temp.badge10k.image(fit: BoxFit.cover, width: 132),

                      12.height,
                      FlankingTextHeader(text: 'AWARDED TO'),
                      FittedBox(
                        child: Text(
                          runnerName,
                          style: context.headlineLarge.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),

                      12.height,
                      FadedLine(),
                      12.height,
                      MyBadgeStatGroup(
                        items: const [
                          MyBadgeStatGroupItem(
                            label: 'DISTANCE',
                            value: '10.0',
                            unit: 'KM',
                          ),
                          MyBadgeStatGroupItem(
                            label: 'STATUS',
                            value: 'VERIFIED',
                          ),
                          MyBadgeStatGroupItem(
                            label: 'CLUB',
                            value: 'FMC\nOFFICIAL',
                          ),
                        ],
                      ),

                      32.height,
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Assets.temp.eventBadge01.image(width: 44, height: 44),
                          const SizedBox(
                            height: 32,
                            child: VerticalDivider(
                              color: AppColors.inputBorder,
                            ),
                          ),
                          12.width,
                          Assets.temp.wordJoournewBadge01.image(width: 44, height: 44),
                        ],
                      ),
                    ],
                  ),
                ),
                32.height,
                AppButton(
                  width: double.infinity,
                  child: const Text('Back to Achievements'),
                  onPressed: () => context.pop(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
