import 'package:dio/dio.dart';
import 'package:first_mile_club/core/network/api_client.dart';
import 'package:first_mile_club/core/network/api_endpoints.dart';
import 'package:first_mile_club/features/profile/models/badge_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final myBadgesProvider = StateNotifierProvider.autoDispose<MyBadgesNotifier, AsyncValue<MyBadgesModel>>((ref) {
  return MyBadgesNotifier(ref);
});

class MyBadgesNotifier extends StateNotifier<AsyncValue<MyBadgesModel>> {
  MyBadgesNotifier(this._ref) : super(const AsyncValue.loading()) {
    loadBadges();
  }

  final Ref _ref;

  Future<void> loadBadges() async {
    state = const AsyncValue.loading();
    try {
      final apiClient = _ref.read(apiClientProvider);
      final response = await apiClient.get<Map<String, dynamic>>(ApiEndpoints.myBadges);
      final data = response.data?['data'] as Map<String, dynamic>? ?? {};
      final model = MyBadgesModel.fromJson(data);
      state = AsyncValue.data(model);
    } on DioException catch (e, st) {
      final message = e.response?.data?['message']?.toString() ?? e.message ?? 'Failed to load badges';
      state = AsyncValue.error(message, st);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

