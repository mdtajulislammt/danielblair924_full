part of 'app_router.dart';

// Log Icons Summary
// ⏳ — Auth state is still loading / holding on splash screen.
// 🌐 — Unauthenticated user accessing an allowed public route.
// 🚫 — Access denied for a protected route, redirecting to Sign In.
// 👤 — Authenticated user on Sign In screen awaiting role-based routing.
// 🚀 — Authenticated user redirected away from guest/splash screens to main app.
// ✅ — Authenticated user accessing an allowed protected route.

String? authRedirect(Ref ref, GoRouterState state) {
  final authState = ref.read(authStateProvider);
  final location = state.matchedLocation;
  final isPublicRoute = AppRoutes.isPublicRoute(location);
  final isSplash = location == AppRoutes.splash;
  final isSignIn = location == AppRoutes.signIn;

  // 1. Auth state is still loading / Initializing
  if (authState.isLoading) {
    if (isSplash) {
      debugPrint(
        '⏳ [AuthRedirect] Auth state loading. Holding on Splash screen.',
      );
      return null;
    }
    debugPrint(
      '⏳ [AuthRedirect] Auth state loading. Redirecting "$location" -> ${AppRoutes.splash}',
    );
    return AppRoutes.splash;
  }

  // 2. Unauthenticated user
  if (!authState.isAuthenticated) {
    if (isPublicRoute) {
      debugPrint(
        '🌐 [AuthRedirect] Unauthenticated user accessing public route "$location". Access granted.',
      );
      return null;
    }

    debugPrint(
      '🚫 [AuthRedirect] Access denied for protected route "$location". Redirecting -> ${AppRoutes.signIn}',
    );
    return AppRoutes.signIn;
  }

  // 3. Authenticated user
  if (authState.isAuthenticated) {
    // Custom check: User is on SignIn screen and waiting for role-based navigation logic
    if (isSignIn) {
      debugPrint(
        '👤 [AuthRedirect] Authenticated user on SignIn screen. Holding for role-based route resolution.',
      );
      return null;
    }

    // Prevent authenticated users from staying on Splash or other public/guest screens
    if (isPublicRoute || isSplash) {
      debugPrint(
        '🚀 [AuthRedirect] Authenticated user on guest route "$location". Redirecting -> ${AppRoutes.userBottomStackView}',
      );
      return AppRoutes.userBottomStackView;
    }
  }

  // 4. Default: Allow access to target protected route
  debugPrint(
    '✅ [AuthRedirect] Authenticated user accessing allowed route "$location". Proceeding.',
  );
  return null;
}
