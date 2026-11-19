import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';

class StravaSyncState {
  final bool isLoading;
  final bool isConnecting;
  final bool isDisconnecting;
  final bool isConnected;
  final String? athleteId;
  final String? errorMessage;
  final String? successMessage;

  const StravaSyncState({
    this.isLoading = false,
    this.isConnecting = false,
    this.isDisconnecting = false,
    this.isConnected = false,
    this.athleteId,
    this.errorMessage,
    this.successMessage,
  });

  StravaSyncState copyWith({
    bool? isLoading,
    bool? isConnecting,
    bool? isDisconnecting,
    bool? isConnected,
    String? athleteId,
    String? errorMessage,
    String? successMessage,
    bool clearError = false,
    bool clearSuccess = false,
    bool clearAthleteId = false,
  }) {
    return StravaSyncState(
      isLoading: isLoading ?? this.isLoading,
      isConnecting: isConnecting ?? this.isConnecting,
      isDisconnecting: isDisconnecting ?? this.isDisconnecting,
      isConnected: isConnected ?? this.isConnected,
      athleteId: clearAthleteId ? null : (athleteId ?? this.athleteId),
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      successMessage: clearSuccess ? null : (successMessage ?? this.successMessage),
    );
  }
}

final stravaSyncProvider =
    NotifierProvider.autoDispose<StravaSyncNotifier, StravaSyncState>(
  StravaSyncNotifier.new,
);

class StravaSyncNotifier extends Notifier<StravaSyncState> {
  ApiClient get _apiClient => ref.read(apiClientProvider);

  @override
  StravaSyncState build() {
    // Initial fetch on mount
    Future.microtask(() => fetchStatus());
    return const StravaSyncState(isLoading: true);
  }

  Future<void> fetchStatus() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final response = await _apiClient.get(ApiEndpoints.stravaStatus);
      final data = response.data;
      if (data is Map<String, dynamic> && data['data'] is Map<String, dynamic>) {
        final info = data['data'] as Map<String, dynamic>;
        state = state.copyWith(
          isLoading: false,
          isConnected: info['isConnected'] == true,
          athleteId: info['athleteId']?.toString(),
        );
      } else {
        state = state.copyWith(isLoading: false);
      }
    } catch (_) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<bool> connectStrava() async {
    state = state.copyWith(isConnecting: true, clearError: true);
    try {
      final response = await _apiClient.get(ApiEndpoints.stravaAuthUrl);
      final data = response.data;
      String? authUrl;
      if (data is Map<String, dynamic>) {
        authUrl = data['url']?.toString();
      }

      if (authUrl == null || authUrl.isEmpty) {
        state = state.copyWith(
          isConnecting: false,
          errorMessage: 'Unable to retrieve Strava authorization URL',
        );
        return false;
      }

      final uri = Uri.parse(authUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        state = state.copyWith(
          isConnecting: false,
          successMessage: 'Connecting Strava in browser... Please return here after authorizing.',
        );
        return true;
      } else {
        state = state.copyWith(
          isConnecting: false,
          errorMessage: 'Could not open Strava authorization URL',
        );
        return false;
      }
    } catch (e) {
      final msg = e is DioException
          ? (e.response?.data?['message']?.toString() ?? e.message ?? 'Strava connect failed')
          : e.toString();
      state = state.copyWith(
        isConnecting: false,
        errorMessage: msg,
      );
      return false;
    }
  }

  Future<bool> disconnectStrava() async {
    state = state.copyWith(isDisconnecting: true, clearError: true);
    try {
      final response = await _apiClient.post(ApiEndpoints.stravaDisconnect);
      final msg = response.data?['message']?.toString() ?? 'Strava disconnected successfully';

      state = state.copyWith(
        isDisconnecting: false,
        isConnected: false,
        clearAthleteId: true,
        successMessage: msg,
      );
      return true;
    } catch (e) {
      final msg = e is DioException
          ? (e.response?.data?['message']?.toString() ?? e.message ?? 'Failed to disconnect Strava')
          : e.toString();
      state = state.copyWith(
        isDisconnecting: false,
        errorMessage: msg,
      );
      return false;
    }
  }

  void clearMessages() {
    state = state.copyWith(clearError: true, clearSuccess: true);
  }
}

