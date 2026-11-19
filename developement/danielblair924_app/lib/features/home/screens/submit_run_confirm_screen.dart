import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../core/extensions/extensions.dart';
import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/utils/utils.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../../profile/providers/run_history_provider.dart';
import '../providers/submission_provider.dart';
import '../widgets/distance_unit_switch.dart';

class SubmitRunConfirmScreen extends ConsumerStatefulWidget {
  const SubmitRunConfirmScreen({super.key});

  @override
  ConsumerState<SubmitRunConfirmScreen> createState() =>
      _SubmitRunConfirmScreenState();
}

class _SubmitRunConfirmScreenState extends ConsumerState<SubmitRunConfirmScreen> {
  late final TextEditingController _tiktokUrlController;

  @override
  void initState() {
    super.initState();
    final draft = ref.read(runSubmissionProvider);
    _tiktokUrlController = TextEditingController(text: draft.tiktokVideoUrl);
  }

  @override
  void dispose() {
    _tiktokUrlController.dispose();
    super.dispose();
  }

  Future<void> _onSubmit() async {
    final notifier = ref.read(runSubmissionProvider.notifier);

    // Save current TikTok inputs to provider
    notifier.setSocialProof(
      tiktokVideoUrl: _tiktokUrlController.text.trim(),
    );

    final success = await notifier.submitRun();

    if (mounted) {
      if (success) {
        // Refresh run history cache so new submission appears immediately
        ref.read(runHistoryProvider.notifier).fetchMySubmissions(isRefresh: true);
        context.push(AppRoutes.submitRunStatus);
      } else {
        final err = ref.read(runSubmissionProvider).submitError ??
            'Failed to submit run proof. Please check your connection and try again.';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(err),
            backgroundColor: AppColors.destructive,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final draft = ref.watch(runSubmissionProvider);
    final distanceUnitStr = draft.unit == DistanceUnit.km ? 'KM' : 'MI';
    final formattedDate = DateFormat('MMM dd, yyyy').format(draft.selectedDate);
    final formattedDuration =
        draft.duration.trim().isNotEmpty ? draft.duration.trim() : '00:00:00';
    final formattedPace =
        draft.pace.isNotEmpty ? draft.pace : '0:00 /km';

    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: EdgeInsets.symmetric(
              horizontal: AppStyles.paddingScreenHorizontal,
            ),
            child: Column(
              spacing: 16.h,
              children: [
                const Center(
                  child: Padding(
                    padding: EdgeInsets.only(bottom: 8),
                    child: SectionIntro(
                      title: 'Review Submission',
                      subtitle: 'Review before submitting',
                    ),
                  ),
                ),

                // Screenshot Preview Card
                AspectRatio(
                  aspectRatio: 7 / 5,
                  child: AppCard(
                    padding: EdgeInsets.zero,
                    child: (draft.stravaFile != null || draft.gpsFile != null)
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(
                              AppStyles.cardBorderRadius,
                            ),
                            child: XFileImage(
                              file: (draft.stravaFile ?? draft.gpsFile)!,
                              fit: BoxFit.cover,
                              width: double.infinity,
                            ),
                          )
                        : Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SvgIcon(
                                  Assets.icons.medal,
                                  size: 48,
                                  color: AppColors.primary,
                                ),
                                8.height,
                                Text(
                                  'GPS Run Evidence Attached',
                                  style: context.bodyMedium.copyWith(
                                    color: AppColors.subtleForeground,
                                  ),
                                ),
                              ],
                            ),
                          ),
                  ),
                ),

                12.height,

                // Run Metrics Summary
                AppCard(
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Distance',
                            style: context.bodyMedium.copyWith(
                              color: AppColors.subtleForeground,
                            ),
                          ),
                          Text(
                            '${draft.distance.toStringAsFixed(2)} $distanceUnitStr',
                            style: context.titleMedium.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Date',
                            style: context.bodyMedium.copyWith(
                              color: AppColors.subtleForeground,
                            ),
                          ),
                          Text(
                            formattedDate,
                            style: context.titleMedium.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Duration',
                            style: context.bodyMedium.copyWith(
                              color: AppColors.subtleForeground,
                            ),
                          ),
                          Text(
                            formattedDuration,
                            style: context.titleMedium.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Estimated Pace',
                            style: context.bodyMedium.copyWith(
                              color: AppColors.subtleForeground,
                            ),
                          ),
                          Text(
                            formattedPace,
                            style: context.titleMedium.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Linked to',
                            style: context.bodyMedium.copyWith(
                              color: AppColors.subtleForeground,
                            ),
                          ),
                          Flexible(
                            child: Text(
                              draft.linkedTitle,
                              style: context.titleMedium.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w600,
                              ),
                              overflow: TextOverflow.ellipsis,
                              textAlign: TextAlign.end,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Step 3: TikTok & Social Evidence Card
                AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.video_camera_back_outlined,
                                color: context.scheme.primary,
                                size: 22,
                              ),
                              8.width,
                              Text(
                                'TikTok Post Evidence',
                                style: context.titleMedium.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          Switch.adaptive(
                            value: draft.postedOnTikTok,
                            activeColor: AppColors.primary,
                            onChanged: (val) {
                              ref
                                  .read(runSubmissionProvider.notifier)
                                  .setSocialProof(postedOnTikTok: val);
                            },
                          ),
                        ],
                      ),
                      if (draft.postedOnTikTok) ...[
                        12.height,
                        TextField(
                          controller: _tiktokUrlController,
                          decoration: InputDecoration(
                            hintText: 'https://www.tiktok.com/@runner/video/...',
                            labelText: 'TikTok Video URL',
                            prefixIcon: const Icon(
                              Icons.link,
                              color: AppColors.primary,
                              size: 20,
                            ),
                          ),
                        ),
                        8.height,
                        CheckboxListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(
                            'Tagged @FirstMileClub',
                            style: context.bodyMedium,
                          ),
                          value: draft.taggedClub,
                          activeColor: AppColors.primary,
                          onChanged: (val) {
                            ref
                                .read(runSubmissionProvider.notifier)
                                .setSocialProof(taggedClub: val ?? false);
                          },
                        ),
                        CheckboxListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(
                            'Included #FirstMileClub hashtag',
                            style: context.bodyMedium,
                          ),
                          value: draft.usedHashtag,
                          activeColor: AppColors.primary,
                          onChanged: (val) {
                            ref
                                .read(runSubmissionProvider.notifier)
                                .setSocialProof(usedHashtag: val ?? false);
                          },
                        ),
                      ],
                    ],
                  ),
                ),

                if (draft.submitError != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4.0),
                    child: Text(
                      draft.submitError!,
                      style: context.bodySmall.copyWith(
                        color: AppColors.destructive,
                      ),
                      textAlign: TextAlign.center,
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
          isDisabled: draft.isSubmitting,
          onPressed: draft.isSubmitting ? null : _onSubmit,
          child: draft.isSubmitting
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.black),
                  ),
                )
              : const Text('Submit Run'),
        ),
      ),
    );
  }
}
