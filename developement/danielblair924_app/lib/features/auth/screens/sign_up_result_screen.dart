import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class SignUpResultScreen extends StatefulWidget {
  const SignUpResultScreen({super.key});

  @override
  State<SignUpResultScreen> createState() => _SignUpResultScreenState();
}

class _SignUpResultScreenState extends State<SignUpResultScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(backgroundColor: Colors.transparent),
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
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
                  title: "YOU'RE IN!",
                  subtitle: "Welcome to First Mile Club.\nLet's get moving.",
                ),
                SizedBox(height: 44.h),
                SlidingTextBanner(
                  items: const <String>['WELCOME', "LET'S RUN", 'FIRST MILE'],
                ),
                SizedBox(height: 100.h),

                Padding(
                  padding: .symmetric(horizontal: 16),
                  child: AppButton(
                    width: double.infinity,
                    onPressed: () => context.go(AppRoutes.signIn),
                    child: Text("LET'S GO"),
                  ),
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
