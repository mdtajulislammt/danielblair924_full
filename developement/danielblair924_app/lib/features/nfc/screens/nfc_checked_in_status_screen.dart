import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NfcCheckedInStatusScreenArgs {
  final String? eventTitle;
  final String? checkedInAt;

  const NfcCheckedInStatusScreenArgs({
    this.eventTitle,
    this.checkedInAt,
  });
}

class NfcCheckedInStatusScreen extends StatelessWidget {
  const NfcCheckedInStatusScreen({super.key, required this.args});

  final NfcCheckedInStatusScreenArgs args;

  @override
  Widget build(BuildContext context) {
    final title = args.eventTitle ?? 'Mountain Trail Challenge 2025';
    final timeStr = args.checkedInAt != null
        ? DateTime.tryParse(args.checkedInAt!)?.toLocal().toString().substring(0, 16) ?? args.checkedInAt!
        : 'Official FMC Check-in verified';

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
              top: AppStyles.paddingScreenHorizontal,
              bottom: Utils.bottomPaddingInset(context),
            ),
            child: Column(
              children: [
                Assets.images.nfcConnectOk.image(),
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    spacing: 4,
                    children: [
                      SectionIntro(
                        title: 'Checked in!',
                        subtitle: 'Welcome to $title,\n$timeStr',
                      ),

                      32.height,

                      AppButton(
                        width: double.infinity,
                        onPressed: () => context.pop(),
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        suffixIcon: SvgIcon(
                          Assets.icons.checkCircleOutlined,
                          color: AppColors.primaryForeground,
                        ),
                        child: const Text('Done'),
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
