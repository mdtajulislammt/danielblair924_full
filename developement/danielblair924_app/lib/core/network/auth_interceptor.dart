import 'package:dio/dio.dart';
import 'token_storage.dart';

class AuthInterceptor extends Interceptor {
  final TokenStorage _tokenStorage;
  final void Function()? _onUnauthorized;

  AuthInterceptor({
    required TokenStorage tokenStorage,
    void Function()? onUnauthorized,
  })  : _tokenStorage = tokenStorage,
        _onUnauthorized = onUnauthorized;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Skip injecting auth token for public authentication routes
    final publicPaths = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/verify-otp',
      '/auth/reset-password',
    ];

    final isPublic = publicPaths.any((path) => options.path.contains(path));

    if (!isPublic) {
      final token = await _tokenStorage.getAccessToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    }

    return handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401 && !err.requestOptions.path.contains('/auth/')) {
      final refreshToken = await _tokenStorage.getRefreshToken();
      if (refreshToken != null && refreshToken.isNotEmpty) {
        try {
          final refreshDio = Dio(BaseOptions(
            baseUrl: err.requestOptions.baseUrl,
            headers: {'Content-Type': 'application/json'},
          ));

          final refreshRes = await refreshDio.post(
            '/auth/refresh',
            data: {'refreshToken': refreshToken},
          );

          final newTokens = refreshRes.data?['data'];
          final newAccess = newTokens?['accessToken'] as String?;
          final newRefresh = newTokens?['refreshToken'] as String?;

          if (newAccess != null && newAccess.isNotEmpty) {
            await _tokenStorage.saveTokens(
              accessToken: newAccess,
              refreshToken: newRefresh ?? refreshToken,
            );

            // Retry the original failed request with the fresh token
            final opts = err.requestOptions;
            opts.headers['Authorization'] = 'Bearer $newAccess';
            final cloneReq = await refreshDio.fetch(opts);
            return handler.resolve(cloneReq);
          }
        } catch (_) {
          // Refresh failed, proceed to revoke local session
        }
      }

      // Clear local session on unauthorized responses
      await _tokenStorage.clearAll();
      _onUnauthorized?.call();
    }

    return handler.next(err);
  }
}

