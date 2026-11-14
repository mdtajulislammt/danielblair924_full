import 'package:first_mile_club/features/auth/auth.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../router.dart';

final publicRoutePaths = {
  AppRoutes.splash,
  AppRoutes.onboarding,
  AppRoutes.signIn,
  AppRoutes.signUp,
  AppRoutes.signUpResult,
  AppRoutes.forgotPassword,
  AppRoutes.forgotPasswordVarification,
  AppRoutes.forgotPasswordReset,
  AppRoutes.forgotPasswordResult,
};

final publicRoutes = [
  GoRoute(
    path: AppRoutes.splash,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: const SplashScreen()),
  ),
  GoRoute(
    path: AppRoutes.onboarding,
    builder: (context, state) =>
        const Scaffold(body: Center(child: Text('onboarding'))),
  ),
  GoRoute(
    path: AppRoutes.signIn,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: const SignInScreen()),
  ),
  GoRoute(
    path: AppRoutes.signUp,
    pageBuilder: (context, state) =>
        MaterialPage<void>(key: state.pageKey, child: const SignUpScreen()),
  ),
  GoRoute(
    path: AppRoutes.signUpResult,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const SignUpResultScreen(),
    ),
  ),
  GoRoute(
    path: AppRoutes.forgotPassword,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const ForgetPasswordScreen(),
    ),
  ),
  GoRoute(
    path: AppRoutes.forgotPasswordVarification,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: ForgotPasswordVerificationScreen(
        email: state.extra as String?,
      ),
    ),
  ),
  GoRoute(
    path: AppRoutes.forgotPasswordReset,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: ForgetPasswordResetScreen(
        resetToken: state.extra as String?,
      ),
    ),
  ),
  GoRoute(
    path: AppRoutes.forgotPasswordResult,
    pageBuilder: (context, state) => MaterialPage<void>(
      key: state.pageKey,
      child: const ForgetPasswordResultScreen(),
    ),
  ),
];
