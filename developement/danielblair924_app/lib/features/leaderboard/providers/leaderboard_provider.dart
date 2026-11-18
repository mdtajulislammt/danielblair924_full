import 'package:dio/dio.dart';
import 'package:first_mile_club/core/network/api_client.dart';
import 'package:first_mile_club/core/network/api_endpoints.dart';
import 'package:first_mile_club/features/auth/providers/auth_provider.dart';
import 'package:first_mile_club/features/leaderboard/models/leaderboard_model.dart';
import 'package:first_mile_club/features/leaderboard/widgets/leaderboard_list_filter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final leaderboardProvider = NotifierProvider.autoDispose<LeaderboardNotifier, LeaderboardState>(() {
  return LeaderboardNotifier();
});

class LeaderboardNotifier extends AutoDisposeNotifier<LeaderboardState> {
  DateFilter _filter = DateFilter.thisMonth;

  DateFilter get currentFilter => _filter;

  @override
  LeaderboardState build() {
    // Trigger load on initialize
    Future.microtask(() => loadLeaderboard());
    return const LeaderboardState(isLoading: true);
  }

  Future<void> changeFilter(DateFilter filter) async {
    if (_filter == filter && !state.isLoading) return;
    _filter = filter;
    await loadLeaderboard();
  }

  Future<void> loadLeaderboard() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final apiClient = ref.read(apiClientProvider);
      final currentUser = ref.read(currentUserProvider);

      String filterParam = 'thisMonth';
      if (_filter == DateFilter.allTime) {
        filterParam = 'allTime';
      } else if (_filter == DateFilter.byEvent) {
        filterParam = 'byEvent';
      }

      final response = await apiClient.get<Map<String, dynamic>>(
        ApiEndpoints.leaderboard,
        queryParameters: {
          'filter': filterParam,
          'limit': 50,
        },
      );

      final data = response.data?['data'];
      final rawList = data is Map ? (data['items'] as List? ?? []) : (data as List? ?? []);

      final users = rawList.map((item) {
        return LeaderboardUser.fromJson(
          Map<String, dynamic>.from(item as Map),
          currentUserId: currentUser?.id,
        );
      }).toList();

      LeaderboardUser? me;
      if (data is Map && data['currentUser'] != null) {
        me = LeaderboardUser.fromJson(
          Map<String, dynamic>.from(data['currentUser'] as Map),
          currentUserId: currentUser?.id,
        );
      } else if (users.isNotEmpty) {
        me = users.firstWhere((u) => u.isMe, orElse: () => users.first);
      }

      state = state.copyWith(
        isLoading: false,
        users: users,
        currentUser: me,
      );
    } on DioException catch (e) {
      final message = e.response?.data?['message']?.toString() ?? e.message ?? 'Failed to load leaderboard';
      state = state.copyWith(isLoading: false, errorMessage: message);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

final memberDetailsProvider = FutureProvider.family<Map<String, dynamic>, String>((ref, id) async {
  final apiClient = ref.read(apiClientProvider);
  final response = await apiClient.get<Map<String, dynamic>>(ApiEndpoints.memberProfile(id));
  return Map<String, dynamic>.from(response.data?['data'] as Map? ?? {});
});

