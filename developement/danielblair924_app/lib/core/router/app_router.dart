import 'package:first_mile_club/features/auth/auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'app_routes.dart';
import 'routes/public_routes.dart';
import 'routes/user_routes.dart';

part 'auth_redirect.dart';

final _allRoutes = [...publicRoutes, ...userRoutes];

class AuthRouterNotifier extends ChangeNotifier {
  void refresh() => notifyListeners();
}

final _rootNavigatorKey = GlobalKey<NavigatorState>();

final goRouterProvider = Provider<GoRouter>((ref) {
  final authNotifier = AuthRouterNotifier();

  ref.listen(authStateProvider, (_, _) {
    authNotifier.refresh();
  });

  ref.onDispose(authNotifier.dispose);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: AppRoutes.splash,
    refreshListenable: authNotifier,
    redirect: (context, state) => authRedirect(ref, state),
    routes: _allRoutes,
  );
});
