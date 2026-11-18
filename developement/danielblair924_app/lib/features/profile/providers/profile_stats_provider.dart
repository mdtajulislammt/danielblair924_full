import 'package:dio/dio.dart';
import 'package:first_mile_club/core/network/api_client.dart';
import 'package:first_mile_club/core/network/api_endpoints.dart';
import 'package:first_mile_club/features/profile/models/profile_stats_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final profileStatsProvider = NotifierProvider.autoDispose<ProfileStatsNotifier, AsyncValue<ProfileStatsModel>>(() {
  return ProfileStatsNotifier();
});

class ProfileStatsNotifier extends AutoDisposeNotifier<AsyncValue<ProfileStatsModel>> {
  @override
  AsyncValue<ProfileStatsModel> build() {
    Future.microtask(() => loadStats());
    return const AsyncValue.loading();
  }

  Future<void> loadStats() async {
    state = const AsyncValue.loading();
    try {
      final apiClient = ref.read(apiClientProvider);
      final response = await apiClient.get<Map<String, dynamic>>(ApiEndpoints.myStats);
      final data = response.data?['data'] as Map<String, dynamic>? ?? {};
      final stats = ProfileStatsModel.fromJson(data);
      state = AsyncValue.data(stats);
    } on DioException catch (e, st) {
      final message = e.response?.data?['message']?.toString() ?? e.message ?? 'Failed to load stats';
      state = AsyncValue.error(message, st);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

