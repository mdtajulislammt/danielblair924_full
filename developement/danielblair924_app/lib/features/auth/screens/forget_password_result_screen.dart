import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class ForgetPasswordResultScreen extends StatefulWidget {
  const ForgetPasswordResultScreen({super.key});

  @override
  State<ForgetPasswordResultScreen> createState() =>
      _ForgetPasswordResultScreenState();
}

class _ForgetPasswordResultScreenState
    extends State<ForgetPasswordResultScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(backgroundColor: Colors.transparent),
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: .symmetric(horizontal: 16),
            child: Column(
              spacing: 12,
              mainAxisAlignment: .center,
              children: [
                GlowIconWrapper(
                  margin: .only(bottom: 48),
                  child: SvgIcon(
                    Assets.icons.badgeChecked,
                    color: context.scheme.primary,
                  ),
                ),
                SectionIntro(
                  title: 'PASSWORD UPDATED!',
                  subtitle: "You're all set. Log in with your new password.",
                ),
                SizedBox(height: 100.h),

                AppButton(
                  width: double.infinity,
                  onPressed: () => context.go(AppRoutes.signIn),
                  child: Text("LOG IN"),
                ),

                // SizedBox(height: 2.h),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
