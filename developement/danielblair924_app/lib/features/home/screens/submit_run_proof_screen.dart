import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/utils/utils.dart';
import '../../../core/widgets/widgets.dart';
import '../../../shared/widgets/widgets.dart';
import '../providers/submission_provider.dart';

class SubmitRunProofScreen extends ConsumerStatefulWidget {
  const SubmitRunProofScreen({super.key});

  @override
  ConsumerState<SubmitRunProofScreen> createState() =>
      _SubmitRunProofScreenState();
}

class _SubmitRunProofScreenState extends ConsumerState<SubmitRunProofScreen> {
  File? _uploadedImage;

  @override
  void initState() {
    super.initState();
    final draft = ref.read(runSubmissionProvider);
    _uploadedImage = draft.evidenceFile;
  }

  Future<void> _onNext() async {
    final draft = ref.read(runSubmissionProvider);

    // If an image was picked and not yet uploaded, trigger upload
    if (_uploadedImage != null && (draft.stravaImageUrl == null || draft.stravaImageUrl!.isEmpty)) {
      final success = await ref.read(runSubmissionProvider.notifier).uploadEvidence();
      if (!success && mounted) {
        final err = ref.read(runSubmissionProvider).uploadError ?? 'Failed to upload proof image';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(err),
            backgroundColor: AppColors.destructive,
          ),
        );
        return;
      }
    }

    if (mounted) {
      context.push(AppRoutes.submitRunConfirm);
    }
  }

  @override
  Widget build(BuildContext context) {
    final draft = ref.watch(runSubmissionProvider);

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
                  child: SectionIntro(
                    title: 'Add your proof',
                    subtitle: 'Upload a Strava screenshot or GPX file',
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: DashedImagePicker(
                    onImageSelected: (file) {
                      setState(() {
                        _uploadedImage = file;
                      });
                      ref.read(runSubmissionProvider.notifier).setEvidenceFile(file);
                    },
                  ),
                ),

                if (draft.uploadError != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Text(
                      draft.uploadError!,
                      style: context.bodySmall.copyWith(
                        color: AppColors.destructive,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),

                SizedBox(height: 2.h),
                const TextDivider(text: 'OR'),
                SizedBox(height: 2.h),

                AppButton.text(
                  child: Text(
                    'Upload GPX file instead',
                    style: TextStyle(
                      decoration: TextDecoration.underline,
                      decorationColor: context.scheme.primary,
                    ),
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('GPX upload will be supported in upcoming release'),
                      ),
                    );
                  },
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
          isDisabled: draft.isUploadingProof,
          onPressed: draft.isUploadingProof ? null : _onNext,
          child: draft.isUploadingProof
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.black),
                  ),
                )
              : const Text('Next'),
        ),
      ),
    );
  }
}
