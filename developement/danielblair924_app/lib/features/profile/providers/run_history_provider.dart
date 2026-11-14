import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../home/models/submission_model.dart';
import '../widgets/run_history_list_filter.dart';

class RunHistoryState {
  final bool isLoading;
  final bool isRefreshing;
  final List<SubmissionItemModel> items;
  final String? errorMessage;
  final RunHistoryDateFilter selectedFilter;

  const RunHistoryState({
    this.isLoading = false,
    this.isRefreshing = false,
    this.items = const [],
    this.errorMessage,
    this.selectedFilter = RunHistoryDateFilter.allTime,
  });

  List<SubmissionItemModel> get filteredItems {
    final now = DateTime.now();
    switch (selectedFilter) {
      case RunHistoryDateFilter.thisMonth:
        return items.where((item) {
          if (item.createdAt != null) {
            final dt = DateTime.tryParse(item.createdAt!);
            if (dt != null) {
              return dt.year == now.year && dt.month == now.month;
            }
          }
          return true;
        }).toList();
      case RunHistoryDateFilter.byEvent:
        return items.where((item) {
          final act = item.activity.toLowerCase();
          return !act.contains('challenge') && !act.contains('journey');
        }).toList();
      case RunHistoryDateFilter.byChallenges:
        return items.where((item) {
          final act = item.activity.toLowerCase();
          return act.contains('challenge') || act.contains('journey');
        }).toList();
      case RunHistoryDateFilter.allTime:
      default:
        return items;
    }
  }

  RunHistoryState copyWith({
    bool? isLoading,
    bool? isRefreshing,
    List<SubmissionItemModel>? items,
    String? errorMessage,
    bool clearError = false,
    RunHistoryDateFilter? selectedFilter,
  }) {
    return RunHistoryState(
      isLoading: isLoading ?? this.isLoading,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      items: items ?? this.items,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      selectedFilter: selectedFilter ?? this.selectedFilter,
    );
  }
}

final runHistoryProvider =
    NotifierProvider<RunHistoryNotifier, RunHistoryState>(
  RunHistoryNotifier.new,
);

class RunHistoryNotifier extends Notifier<RunHistoryState> {
  ApiClient get _apiClient => ref.read(apiClientProvider);

  @override
  RunHistoryState build() {
    // Automatically trigger initial load
    Future.microtask(() => fetchMySubmissions());
    return const RunHistoryState(isLoading: true);
  }

  Future<void> fetchMySubmissions({bool isRefresh = false}) async {
    state = state.copyWith(
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      clearError: true,
    );

    try {
      final response = await _apiClient.get(
        ApiEndpoints.mySubmissions,
        queryParameters: {
          'page': 1,
          'limit': 50,
        },
      );

      final data = response.data;
      final List<SubmissionItemModel> loadedItems = [];

      if (data is Map<String, dynamic>) {
        final dataPayload = data['data'];
        if (dataPayload is Map<String, dynamic>) {
          final itemsList = dataPayload['items'];
          if (itemsList is List) {
            for (final raw in itemsList) {
              if (raw is Map<String, dynamic>) {
                loadedItems.add(SubmissionItemModel.fromJson(raw));
              }
            }
          }
        }
      }

      state = state.copyWith(
        isLoading: false,
        isRefreshing: false,
        items: loadedItems,
        clearError: true,
      );
    } on DioException catch (e) {
      final msg = e.response?.data?['message']?.toString() ??
          e.message ??
          'Failed to load run history';
      state = state.copyWith(
        isLoading: false,
        isRefreshing: false,
        errorMessage: msg,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        isRefreshing: false,
        errorMessage: e.toString(),
      );
    }
  }

  void setFilter(RunHistoryDateFilter filter) {
    state = state.copyWith(selectedFilter: filter);
  }
}

