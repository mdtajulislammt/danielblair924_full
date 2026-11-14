import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class BadgePreviewScreen extends StatelessWidget {
  const BadgePreviewScreen({super.key, this.badgeTitle});

  final String? badgeTitle;

  @override
  Widget build(BuildContext context) {
    final topInset = MediaQuery.paddingOf(context).top;
    final title = badgeTitle ?? '10K FINISHER';

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(backgroundColor: Colors.transparent),
      body: AppGradientBackground(
        child: SafeArea(
          top: false,
          bottom: false,
          child: FullHeightScrollView(
            padding: EdgeInsets.only(
              top: topInset,
              bottom: Utils.bottomPaddingInset(context),
            ),
            child: Column(
              children: [
                Stack(
                  clipBehavior: .none,
                  alignment: .center,
                  children: [
                    Positioned(
                      child: Assets.images.badgeConfetti.image(
                        fit: .cover,
                        width: .infinity,
                      ),
                    ),
                    Assets.images.badgeConfettiGlow.image(
                      fit: .cover,
                      width: 350,
                    ),
                    Assets.temp.badge10k.image(fit: .cover, width: 210),
                  ],
                ),
                16.height,

                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppStyles.paddingScreenHorizontal,
                  ),
                  child: Column(
                    children: [
                      Text(
                        'BADGE UNLOCKED!',
                        style: context.titleLarge.copyWith(
                          color: context.scheme.primary,
                          fontWeight: .w600,
                        ),
                      ),
                      FittedBox(
                        child: Text(
                          title.toUpperCase(),
                          style: TextStyle(
                            fontSize: 44.sp,
                            color: context.scheme.onSurface,
                            fontWeight: .bold,
                          ),
                          overflow: .ellipsis,
                        ),
                      ),
                      Text(
                        'Added to your collection',
                        style: context.bodyLarge.copyWith(
                          color: context.scheme.onTertiary,
                        ),
                      ),
                      64.height,
                      AppButton(
                        width: .infinity,
                        prefixIcon: SvgIcon(
                          Assets.icons.medal,
                          themeColor: true,
                        ),
                        child: Text('View My Badges'),
                        onPressed: () =>
                            context.pushReplacement(AppRoutes.mybadgePreview, extra: title),
                      ),
                      8.height,
                      AppButton.text(
                        variant: .muted,
                        width: .infinity,
                        child: Text('Done'),
                        onPressed: () => context.pop(),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
