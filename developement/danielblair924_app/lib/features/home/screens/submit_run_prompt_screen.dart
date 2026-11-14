import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/router.dart';
import '../../../core/utils/utils.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../providers/submission_provider.dart';
import '../widgets/selectable_event_list_tile.dart';

enum RunType { event, challenge }

class SubmitRunPromptScreen extends ConsumerStatefulWidget {
  const SubmitRunPromptScreen({super.key});

  @override
  ConsumerState<SubmitRunPromptScreen> createState() =>
      _SubmitRunPromptScreenState();
}

class _SubmitRunPromptScreenState extends ConsumerState<SubmitRunPromptScreen> {
  RunType? _selectedType;

  @override
  void initState() {
    super.initState();
    final draft = ref.read(runSubmissionProvider);
    _selectedType = draft.runType ?? RunType.event;
  }

  void _onContinue() {
    if (_selectedType == null) return;
    ref.read(runSubmissionProvider.notifier).setRunType(_selectedType!);
    context.push(AppRoutes.submitRunLog);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('What are you running for?'),
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
                SelectableEventListTile(
                  leadingIcon: SvgIcon(Assets.icons.promptEvent, size: 44),
                  title: 'Event',
                  subtitle: '5K, 10K, 15K, Half Marathon',
                  isSelected: _selectedType == RunType.event,
                  onTap: () {
                    setState(() {
                      _selectedType = RunType.event;
                    });
                  },
                ),
                SelectableEventListTile(
                  leadingIcon: SvgIcon(Assets.icons.promptChallenge, size: 44),
                  title: 'Challenge',
                  subtitle: 'Contribute to the community journey',
                  isSelected: _selectedType == RunType.challenge,
                  onTap: () {
                    setState(() {
                      _selectedType = RunType.challenge;
                    });
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
          isDisabled: _selectedType == null,
          onPressed: _selectedType == null ? null : _onContinue,
          child: const Text('Continue'),
        ),
      ),
    );
  }
}
