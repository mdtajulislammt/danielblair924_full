import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/app_colors.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class SubmissionFeedbackScreen extends StatelessWidget {
  const SubmissionFeedbackScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Submission feedback'),
        centerTitle: false,
        backgroundColor: Colors.transparent,
      ),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: .symmetric(horizontal: 16, vertical: 32),
            child: Column(
              spacing: 16.h,
              children: [
                AppCard(
                  child: Column(
                    spacing: 12,
                    crossAxisAlignment: .start,
                    children: [
                      Row(
                        spacing: 6,
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          Icon(
                            Icons.error_outline_rounded,
                            size: 24.0,
                            color: context.scheme.onSurface,
                          ),
                          Flexible(
                            child: Text(
                              'Why your run was not approved',
                              style: context.titleMedium,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),

                      Text("""
Thanks for your submission!

We noticed that the screenshot provided
doesn't clearly show the distance and time.
Please upload a screenshot that includes both
metrics along with the date.

Feel free to reach out if you have any questions.

Keep it up!""", style: context.bodyMedium),

                      const Divider(color: AppColors.border),

                      Row(
                        spacing: 6,
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          Flexible(
                            child: Text(
                              'Your submitted screenshot',
                              style: context.titleMedium,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),

                      AspectRatio(
                        aspectRatio: 1.7777777778,
                        child: CachedImage(
                          borderRadius: 12,
                          imgUrl: "https://picsum.photos/seed/picsum/300/200",
                        ),
                      ),
                      24.height,
                    ],
                  ),
                ),
              ],
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
        child: AppButton(child: Text('Resubmit Run'), onPressed: () {}),
      ),
    );
  }
}
