import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/token_storage.dart';
import '../models/auth_model.dart';

enum AuthStatus { loading, authenticated, unauthenticated }

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? errorMessage;
  final bool isSubmitting;

  const AuthState({
    required this.status,
    this.user,
    this.errorMessage,
    this.isSubmitting = false,
  });

  bool get isLoading => status == AuthStatus.loading;
  bool get isAuthenticated => status == AuthStatus.authenticated;

  AuthState copyWith({
    AuthStatus? status,
    UserModel? user,
    String? errorMessage,
    bool? isSubmitting,
    bool clearError = false,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isSubmitting: isSubmitting ?? this.isSubmitting,
    );
  }
}

final authStateProvider = NotifierProvider<AuthNotifier, AuthState>(
  AuthNotifier.new,
);

final currentUserProvider = Provider<UserModel?>((ref) {
  return ref.watch(authStateProvider).user;
});

class AuthNotifier extends Notifier<AuthState> {
  TokenStorage get _tokenStorage => ref.read(tokenStorageProvider);
  ApiClient get _apiClient => ref.read(apiClientProvider);

  @override
  AuthState build() {
    _initialize();
    return const AuthState(status: AuthStatus.loading);
  }

  Future<void> _initialize() async {
    final results = await Future.wait([
      _checkStoredToken(),
      Future.delayed(const Duration(milliseconds: 1000)),
    ]);

    final isAuthenticated = results[0] as bool;

    state = state.copyWith(
      status: isAuthenticated ? AuthStatus.authenticated : AuthStatus.unauthenticated,
    );
  }

  Future<bool> _checkStoredToken() async {
    try {
      final hasToken = await _tokenStorage.hasValidToken();
      if (!hasToken) {
        return false;
      }

      final response = await _apiClient.get(ApiEndpoints.me);
      if (response.statusCode == 200 && response.data != null) {
        final body = response.data;
        final rawUser = body is Map<String, dynamic> ? (body['data'] ?? body) : null;
        if (rawUser is Map<String, dynamic>) {
          final user = UserModel.fromJson(rawUser);
          state = AuthState(
            status: AuthStatus.authenticated,
            user: user,
          );
          return true;
        }
      }
      return false;
    } catch (e) {
      debugPrint('[AuthNotifier] Token check failed: $e');
      await _tokenStorage.clearAll();
      return false;
    }
  }

  Future<bool> login({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final response = await _apiClient.post(
        ApiEndpoints.login,
        data: {
          'email': email.trim(),
          'password': password,
        },
      );

      final body = response.data;
      if (body != null && body['data'] != null) {
        final data = body['data'] as Map<String, dynamic>;
        final accessToken = data['accessToken'] as String?;
        final refreshToken = data['refreshToken'] as String?;

        if (accessToken != null) {
          await _tokenStorage.saveTokens(
            accessToken: accessToken,
            refreshToken: refreshToken,
          );
        }

        UserModel? user;
        if (data['user'] != null && data['user'] is Map<String, dynamic>) {
          user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
          await _tokenStorage.saveUserMeta(id: user.id, email: user.email);
        }

        state = AuthState(
          status: AuthStatus.authenticated,
          user: user,
          isSubmitting: false,
        );
        return true;
      }

      state = state.copyWith(
        isSubmitting: false,
        errorMessage: 'Invalid login response from server',
      );
      return false;
    } on DioException catch (dioErr) {
      final msg = _extractErrorMessage(dioErr, 'Login failed');
      state = state.copyWith(isSubmitting: false, errorMessage: msg);
      return false;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: e.toString());
      return false;
    }
  }

  Future<bool> register({
    required String email,
    required String password,
    String? fullName,
    String? username,
  }) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      String? fname;
      String? lname;
      if (fullName != null && fullName.trim().isNotEmpty) {
        final parts = fullName.trim().split(RegExp(r'\s+'));
        fname = parts.first;
        if (parts.length > 1) {
          lname = parts.sublist(1).join(' ');
        }
      }

      final resolvedUsername = username ?? (email.contains('@') ? email.split('@').first : null);

      final response = await _apiClient.post(
        ApiEndpoints.register,
        data: {
          'email': email.trim(),
          'password': password,
          if (fname != null) 'fname': fname,
          if (lname != null) 'lname': lname,
          if (resolvedUsername != null) 'username': resolvedUsername,
        },
      );

      final body = response.data;
      if (body != null && body['data'] != null) {
        final data = body['data'] as Map<String, dynamic>;
        final accessToken = data['accessToken'] as String?;
        final refreshToken = data['refreshToken'] as String?;

        if (accessToken != null) {
          await _tokenStorage.saveTokens(
            accessToken: accessToken,
            refreshToken: refreshToken,
          );
        }

        UserModel? user;
        if (data['user'] != null && data['user'] is Map<String, dynamic>) {
          user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
          await _tokenStorage.saveUserMeta(id: user.id, email: user.email);
        }

        state = state.copyWith(
          isSubmitting: false,
          user: user,
        );
        return true;
      }

      state = state.copyWith(
        isSubmitting: false,
        errorMessage: 'Invalid registration response from server',
      );
      return false;
    } on DioException catch (dioErr) {
      final msg = _extractErrorMessage(dioErr, 'Registration failed');
      state = state.copyWith(isSubmitting: false, errorMessage: msg);
      return false;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: e.toString());
      return false;
    }
  }

  Future<String?> forgotPassword(String email) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final response = await _apiClient.post(
        ApiEndpoints.forgotPassword,
        data: {'email': email.trim()},
      );

      final body = response.data;
      String? resetToken;
      if (body != null && body['data'] is Map<String, dynamic>) {
        resetToken = body['data']['resetToken'] as String?;
      }

      state = state.copyWith(isSubmitting: false);
      return resetToken ?? 'mock-reset-token';
    } on DioException catch (dioErr) {
      final msg = _extractErrorMessage(dioErr, 'Failed to send reset link');
      state = state.copyWith(isSubmitting: false, errorMessage: msg);
      return null;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: e.toString());
      return null;
    }
  }

  Future<String?> verifyOtp({
    required String email,
    required String otp,
  }) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final response = await _apiClient.post(
        ApiEndpoints.verifyOtp,
        data: {
          'email': email.trim(),
          'otp': otp.trim(),
        },
      );

      final body = response.data;
      String? resetToken;
      if (body != null && body['data'] is Map<String, dynamic>) {
        resetToken = body['data']['resetToken'] as String?;
      }

      state = state.copyWith(isSubmitting: false);
      return resetToken ?? 'mock-reset-token';
    } on DioException catch (dioErr) {
      final msg = _extractErrorMessage(dioErr, 'Invalid or expired OTP');
      state = state.copyWith(isSubmitting: false, errorMessage: msg);
      return null;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: e.toString());
      return null;
    }
  }

  Future<bool> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final response = await _apiClient.post(
        ApiEndpoints.resetPassword,
        data: {
          'token': token,
          'password': newPassword,
        },
      );

      final body = response.data;
      final isSuccess = response.statusCode == 200 ||
          (body != null && body['status'] == 'success');

      state = state.copyWith(isSubmitting: false);
      return isSuccess;
    } on DioException catch (dioErr) {
      final msg = _extractErrorMessage(dioErr, 'Password reset failed');
      state = state.copyWith(isSubmitting: false, errorMessage: msg);
      return false;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: e.toString());
      return false;
    }
  }

  Future<void> logout() async {
    try {
      final refreshToken = await _tokenStorage.getRefreshToken();
      await _apiClient.post(
        '/auth/logout',
        data: {if (refreshToken != null) 'refreshToken': refreshToken},
      );
    } catch (_) {
      // Ignore network errors on logout
    } finally {
      await _tokenStorage.clearAll();
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  String _extractErrorMessage(DioException dioErr, String fallback) {
    if (dioErr.response?.data != null) {
      final data = dioErr.response!.data;
      if (data is Map<String, dynamic>) {
        if (data['message'] != null) {
          if (data['message'] is List) {
            return (data['message'] as List).join(', ');
          }
          return data['message'].toString();
        }
      }
    }
    return dioErr.message ?? fallback;
  }
}
