import 'package:dio/dio.dart';
import 'package:first_mile_club/core/network/api_client.dart';
import 'package:first_mile_club/core/network/api_endpoints.dart';
import 'package:first_mile_club/features/profile/models/badge_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final myBadgesProvider = NotifierProvider.autoDispose<MyBadgesNotifier, AsyncValue<MyBadgesModel>>(() {
  return MyBadgesNotifier();
});

class MyBadgesNotifier extends AutoDisposeNotifier<AsyncValue<MyBadgesModel>> {
  @override
  AsyncValue<MyBadgesModel> build() {
    Future.microtask(() => loadBadges());
    return const AsyncValue.loading();
  }

  Future<void> loadBadges() async {
    state = const AsyncValue.loading();
    try {
      final apiClient = ref.read(apiClientProvider);
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

