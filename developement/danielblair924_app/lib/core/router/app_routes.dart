import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'routes/public_routes.dart';

abstract class AppRoutes {
  static const String splash = '/splash';
  static const String onboarding = '/onboarding';
  static const String userBottomStackView = '/userBottomStackView';

  // auth
  static const String signIn = '/signIn';
  static const String signUp = '/signUp';
  static const String signUpResult = '/signUpResult';
  static const String forgotPassword = '/forgotPassword';
  static const String forgotPasswordVarification =
      '/forgotPasswordVarification';
  static const String forgotPasswordReset = '/forgotPasswordReset';
  static const String forgotPasswordResult = '/forgotPasswordResult';

  // Home Tab Screen
  static const String submitRunPrompt = '/submitRunPrompt';
  static const String submitRunLog = '/submitRunLog';
  static const String submitRunProof = '/submitRunProof';
  static const String submitRunConfirm = '/submitRunConfirm';
  static const String submitRunStatus = '/submitRunStatus';

  // Events tab screen
  static const String eventSubmissionFeedback = '/eventSubmissionFeedback';

  // Challenge tab screen
  static const String fullJourney = '/fullJourney';
  static const String journeyLocationDetail = '/journeyLocationDetail';
  static const String journeyLocationLocked = '/journeyLocationLocked';

  // Leaderboard tab screen
  static const String rankUserDetails = '/rankUserDetails';
  static const String badgeProfile = '/badgeProfile';

  // Profile tab screen
  static const String profileRunningStats = '/profileRunningStats';
  static const String profileRunHistory = '/profileRunHistory';
  static const String profileRunHistoryDetails = '/profileRunHistoryDetails';
  static const String profileCompletedEvents = '/profileCompletedEvents';
  static const String profileAchivements = '/profileAchivements';
  static const String badgePreview = '/badgePreview';
  static const String mybadgePreview = '/mybadgePreview';

  // News
  static const String newsAndAnnouncements = '/newsAndAnnouncements';
  static const String newsAndAnnouncementsDetails =
      '/newsAndAnnouncements/details';

  // nfc
  static const String nfc = '/nfc';
  static const String nfcCheckedInStatus = '/nfc/checkedInStatus';

  static bool isPublicRoute(String location) {
    if (location == AppRoutes.splash) return false;

    return publicRoutePaths.contains(location);
  }

  static bool navToHomeIfAuthenticated(
    BuildContext context, {
    required authenticated,
  }) {
    if (!context.mounted || !authenticated) return false;

    context.go(AppRoutes.userBottomStackView);
    return true;
  }
}
