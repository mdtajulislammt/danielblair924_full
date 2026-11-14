import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/theme.dart';
import '../../../core/utils/utils.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../providers/submission_provider.dart';

class SubmitRunStatusScreen extends ConsumerStatefulWidget {
  const SubmitRunStatusScreen({super.key});

  @override
  ConsumerState<SubmitRunStatusScreen> createState() =>
      _SubmitRunStatusScreenState();
}

class _SubmitRunStatusScreenState extends ConsumerState<SubmitRunStatusScreen> {
  void _onBackToHome() {
    ref.read(runSubmissionProvider.notifier).resetDraft();
    context.go(AppRoutes.userBottomStackView);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: Column(
                spacing: 12,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GlowIconWrapper(
                    margin: const EdgeInsets.only(bottom: 48),
                    child: SvgIcon(
                      Assets.icons.badgeChecked,
                      color: context.scheme.primary,
                    ),
                  ),
                  SizedBox(height: 12.h),
                  const SectionIntro(
                    title: 'Submitted!',
                    subtitle:
                        "Your run is awaiting admin review.\nYou'll be notified once\nit's approved.",
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          bottom: Utils.bottomPaddingInset(context),
        ),
        child: AppButton(
          onPressed: _onBackToHome,
          child: const Text('Back to Home'),
        ),
      ),
    );
  }
}
