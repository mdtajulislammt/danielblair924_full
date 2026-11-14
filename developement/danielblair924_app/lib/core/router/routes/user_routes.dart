import 'package:first_mile_club/core/navigation/navigation.dart';
import 'package:first_mile_club/features/challenge/challenge.dart';
import 'package:first_mile_club/features/events/events.dart';
import 'package:first_mile_club/features/home/home.dart';
import 'package:first_mile_club/features/leaderboard/leaderboard.dart';
import 'package:first_mile_club/features/news/news.dart';
import 'package:first_mile_club/features/nfc/nfc.dart';
import 'package:first_mile_club/features/profile/profile.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../router.dart';

final userRoutes = [
  GoRoute(
    path: AppRoutes.userBottomStackView,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const UserBottomStackView(),
    ),
  ),

  GoRoute(
    path: AppRoutes.submitRunPrompt,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const SubmitRunPromptScreen(),
    ),
  ),
  GoRoute(
    path: AppRoutes.submitRunLog,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const SubmitRunLogScreen(),
    ),
  ),
  GoRoute(
    path: AppRoutes.submitRunProof,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const SubmitRunProofScreen(),
    ),
  ),
  GoRoute(
    path: AppRoutes.submitRunConfirm,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const SubmitRunConfirmScreen(),
    ),
  ),
  GoRoute(
    path: AppRoutes.submitRunStatus,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const SubmitRunStatusScreen(),
    ),
  ),

  GoRoute(
    path: AppRoutes.eventSubmissionFeedback,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const SubmissionFeedbackScreen(),
    ),
  ),
  GoRoute(
    path: AppRoutes.fullJourney,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const JourneyFullMapScreen(),
    ),
  ),
  GoRoute(
    path: AppRoutes.journeyLocationDetail,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: JourneyLocationDetailScreen(args: state.extra as MapLocation?),
    ),
  ),
  GoRoute(
    path: AppRoutes.journeyLocationLocked,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: JourneyLocationLockedScreen(args: state.extra as MapLocation?),
    ),
  ),

  GoRoute(
    path: AppRoutes.rankUserDetails,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: RankUserDetails(args: state.extra as RankUserDetailsArgs),
    ),
  ),
  GoRoute(
    path: AppRoutes.badgeProfile,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: BadgeProfileScreen(args: state.extra as BadgeProfileScreenArgs),
    ),
  ),

  GoRoute(
    path: AppRoutes.profileRunningStats,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: RunningStatsScreen()),
  ),
  GoRoute(
    path: AppRoutes.profileRunHistory,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: RunHistoryScreen()),
  ),
  GoRoute(
    path: AppRoutes.profileRunHistoryDetails,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: RunHistoryDetailsScreen(
        submission: state.extra as SubmissionItemModel?,
      ),
    ),
  ),
  GoRoute(
    path: AppRoutes.profileCompletedEvents,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: CompletedEventsScreen()),
  ),
  GoRoute(
    path: AppRoutes.profileAchivements,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: AchivementsScreen()),
  ),
  GoRoute(
    path: AppRoutes.badgePreview,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      fullscreenDialog: true,
      child: BadgePreviewScreen(badgeTitle: state.extra as String?),
    ),
  ),
  GoRoute(
    path: AppRoutes.mybadgePreview,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: MyBadgePreviewScreen(badgeTitle: state.extra as String?)),
  ),

  GoRoute(
    path: AppRoutes.newsAndAnnouncements,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: const AllNewsScreen()),
  ),
  GoRoute(
    path: AppRoutes.newsAndAnnouncementsDetails,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: NewsDetailsScreen(article: state.extra as NewsArticleModel?),
    ),
  ),
  GoRoute(
    path: AppRoutes.nfc,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: const NfcScreen()),
  ),
  GoRoute(
    path: AppRoutes.nfcCheckedInStatus,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      fullscreenDialog: true,
      child: NfcCheckedInStatusScreen(
        args: state.extra as NfcCheckedInStatusScreenArgs,
      ),
    ),
  ),
];
