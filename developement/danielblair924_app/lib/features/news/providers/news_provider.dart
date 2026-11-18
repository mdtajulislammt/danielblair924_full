import 'package:dio/dio.dart';
import 'package:first_mile_club/core/network/api_client.dart';
import 'package:first_mile_club/core/network/api_endpoints.dart';
import 'package:first_mile_club/features/news/models/news_article_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final newsListProvider = NotifierProvider.autoDispose<NewsListNotifier, AsyncValue<List<NewsArticleModel>>>(() {
  return NewsListNotifier();
});

class NewsListNotifier extends AutoDisposeNotifier<AsyncValue<List<NewsArticleModel>>> {
  @override
  AsyncValue<List<NewsArticleModel>> build() {
    Future.microtask(() => loadNews());
    return const AsyncValue.loading();
  }

  Future<void> loadNews() async {
    state = const AsyncValue.loading();
    try {
      final apiClient = ref.read(apiClientProvider);
      final response = await apiClient.get<Map<String, dynamic>>(
        ApiEndpoints.news,
        queryParameters: {
          'limit': 20,
        },
      );

      final data = response.data?['data'];
      final rawList = data is Map ? (data['items'] as List? ?? []) : (data as List? ?? []);

      final list = rawList.map((item) {
        return NewsArticleModel.fromJson(Map<String, dynamic>.from(item as Map));
      }).toList();

      state = AsyncValue.data(list);
    } on DioException catch (e, st) {
      final message = e.response?.data?['message']?.toString() ?? e.message ?? 'Failed to load news';
      state = AsyncValue.error(message, st);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final newsDetailProvider = FutureProvider.family<NewsArticleModel, String>((ref, id) async {
  final apiClient = ref.read(apiClientProvider);
  final response = await apiClient.get<Map<String, dynamic>>(ApiEndpoints.newsDetails(id));
  final data = response.data?['data'] as Map<String, dynamic>? ?? {};
  return NewsArticleModel.fromJson(data);
});

