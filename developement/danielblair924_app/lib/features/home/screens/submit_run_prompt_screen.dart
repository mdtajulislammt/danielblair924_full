import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/extensions/sizedbox_extension.dart';
import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/utils/utils.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../../challenge/providers/challenge_provider.dart';
import '../../events/providers/events_provider.dart';
import '../../profile/providers/strava_sync_provider.dart';
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
  String? _selectedEventId;
  String? _selectedEventTitle;
  String? _selectedChallengeId;
  String? _selectedChallengeTitle;

  @override
  void initState() {
    super.initState();
    final draft = ref.read(runSubmissionProvider);
    _selectedType = draft.runType ?? RunType.event;
    _selectedEventId = draft.eventId;
    _selectedEventTitle = draft.eventId != null ? draft.linkedTitle : null;
    _selectedChallengeId = draft.challengeId;
    _selectedChallengeTitle = draft.challengeId != null ? draft.linkedTitle : null;

    // Fetch live events and challenge data
    Future.microtask(() {
      ref.read(eventsProvider.notifier).fetchEvents();
      ref.read(challengeProvider.notifier).fetchChallengeData();
    });
  }

  void _onContinue() {
    if (_selectedType == null) return;
    final notifier = ref.read(runSubmissionProvider.notifier);
    notifier.setRunType(_selectedType!);

    if (_selectedType == RunType.event) {
      notifier.setLinkedTarget(
        eventId: _selectedEventId,
        challengeId: null,
        linkedTitle: _selectedEventTitle ?? 'Community Event Run',
      );
    } else {
      notifier.setLinkedTarget(
        eventId: null,
        challengeId: _selectedChallengeId,
        linkedTitle: _selectedChallengeTitle ?? 'Run Around The World (RATW)',
      );
    }

    context.push(AppRoutes.submitRunLog);
  }

  @override
  Widget build(BuildContext context) {
    final eventsState = ref.watch(eventsProvider);
    final challengeState = ref.watch(challengeProvider);
    final stravaState = ref.watch(stravaSyncProvider);

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
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (stravaState.isConnected) ...[
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFC5200).withOpacity(0.12),
                      border: Border.all(color: const Color(0xFFFC5200).withOpacity(0.3)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.sync_rounded,
                          color: Color(0xFFFC5200),
                          size: 22,
                        ),
                        10.width,
                        Expanded(
                          child: Text(
                            'Strava Auto-Sync is Active. Outdoor runs recorded on Strava credit to your profile automatically.',
                            style: context.bodySmall.copyWith(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
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
                12.height,
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
                24.height,

                // Detailed picker based on selected type
                if (_selectedType == RunType.event) ...[
                  Text(
                    'Select Event',
                    style: context.titleMedium.copyWith(fontWeight: FontWeight.bold),
                  ),
                  8.height,
                  if (eventsState.isLoading)
                    const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Center(child: CircularProgressIndicator()),
                    )
                  else if (eventsState.events.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'No scheduled events found. A general event run will be logged.',
                        style: context.bodyMedium.copyWith(color: AppColors.subtleForeground),
                      ),
                    )
                  else
                    ...eventsState.events.map((ev) {
                      final isSelected = _selectedEventId == ev.id;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: InkWell(
                          onTap: () {
                            setState(() {
                              _selectedEventId = ev.id;
                              _selectedEventTitle = ev.title;
                            });
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? context.scheme.primary.withOpacity(0.15)
                                  : Colors.white.withOpacity(0.05),
                              border: Border.all(
                                color: isSelected
                                    ? context.scheme.primary
                                    : Colors.white.withOpacity(0.1),
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                                  color: isSelected ? context.scheme.primary : AppColors.subtleForeground,
                                  size: 20,
                                ),
                                12.width,
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        ev.title,
                                        style: context.bodyMedium.copyWith(
                                          fontWeight: FontWeight.w600,
                                          color: isSelected ? Colors.white : AppColors.subtleForeground,
                                        ),
                                      ),
                                      if (ev.distanceType != null && ev.distanceType!.isNotEmpty)
                                        Text(
                                          ev.distanceType!,
                                          style: context.bodySmall.copyWith(
                                            color: AppColors.subtleForeground.withOpacity(0.7),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),
                ] else if (_selectedType == RunType.challenge) ...[
                  Text(
                    'Select Challenge',
                    style: context.titleMedium.copyWith(fontWeight: FontWeight.bold),
                  ),
                  8.height,
                  if (challengeState.isLoading)
                    const Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Center(child: CircularProgressIndicator()),
                    )
                  else ...[
                    Builder(
                      builder: (ctx) {
                        final active = challengeState.activeChallenge;
                        final cid = active?.id;
                        final title = active?.title ?? 'Run Around The World (RATW)';
                        final isSelected = _selectedChallengeId == cid || _selectedChallengeId == null;
                        return InkWell(
                          onTap: () {
                            setState(() {
                              _selectedChallengeId = cid;
                              _selectedChallengeTitle = title;
                            });
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? context.scheme.primary.withOpacity(0.15)
                                  : Colors.white.withOpacity(0.05),
                              border: Border.all(
                                color: isSelected
                                    ? context.scheme.primary
                                    : Colors.white.withOpacity(0.1),
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                                  color: isSelected ? context.scheme.primary : AppColors.subtleForeground,
                                  size: 20,
                                ),
                                12.width,
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        title,
                                        style: context.bodyMedium.copyWith(
                                          fontWeight: FontWeight.w600,
                                          color: isSelected ? Colors.white : AppColors.subtleForeground,
                                        ),
                                      ),
                                      Text(
                                        'All distances automatically advance the community collective progress',
                                        style: context.bodySmall.copyWith(
                                          color: AppColors.subtleForeground.withOpacity(0.7),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ],
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
