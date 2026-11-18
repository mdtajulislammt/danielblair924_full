import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/app_colors.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/utils/utils.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class SubmissionFeedbackScreen extends StatelessWidget {
  final String? rejectionReason;
  final String? submittedImageUrl;

  const SubmissionFeedbackScreen({
    super.key,
    this.rejectionReason,
    this.submittedImageUrl,
  });

  @override
  Widget build(BuildContext context) {
    final reasonText = rejectionReason?.trim().isNotEmpty == true
        ? rejectionReason!
        : """Thanks for your submission!

We noticed that the screenshot provided does not clearly show the distance, duration, or pace.
Please upload a clear screenshot that includes both metrics along with the date.

Feel free to reach out if you have any questions. Keep it up!""";

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
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 32),
            child: Column(
              spacing: 16.h,
              children: [
                AppCard(
                  child: Column(
                    spacing: 12,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        spacing: 6,
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          Icon(
                            Icons.error_outline_rounded,
                            size: 24.0,
                            color: context.scheme.error,
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

                      Text(reasonText, style: context.bodyMedium),

                      if (submittedImageUrl != null && submittedImageUrl!.isNotEmpty) ...[
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
                            imgUrl: submittedImageUrl!,
                          ),
                        ),
                      ],
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
        child: AppButton(
          child: const Text('Resubmit Run'),
          onPressed: () {
            context.push(AppRoutes.submitRunPrompt);
          },
        ),
      ),
    );
  }
}
