import 'package:cross_file/cross_file.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../constants/app_config.dart';
import 'auth_interceptor.dart';
import 'token_storage.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  final tokenStorage = ref.watch(tokenStorageProvider);
  final client = ApiClient(tokenStorage: tokenStorage);
  ApiClient.instance = client;
  return client;
});

final dioProvider = Provider<Dio>((ref) {
  return ref.watch(apiClientProvider).dio;
});

class ApiClient {
  static ApiClient? _instance;
  static ApiClient get instance => _instance ??= ApiClient(tokenStorage: TokenStorage());
  static set instance(ApiClient client) => _instance = client;

  final Dio dio;
  final TokenStorage tokenStorage;

  ApiClient({
    required this.tokenStorage,
    String? baseUrl,
    void Function()? onUnauthorized,
  }) : dio = Dio(
          BaseOptions(
            baseUrl: baseUrl ?? _resolveBaseUrl(),
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 15),
            sendTimeout: const Duration(seconds: 15),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          ),
        ) {
    dio.interceptors.add(
      AuthInterceptor(
        tokenStorage: tokenStorage,
        onUnauthorized: onUnauthorized,
      ),
    );

    if (kDebugMode) {
      dio.interceptors.add(
        LogInterceptor(
          requestBody: true,
          responseBody: true,
          requestHeader: false,
          responseHeader: false,
          error: true,
        ),
      );
    }
  }

  static String _resolveBaseUrl() {
    try {
      final url = AppConfig.serverBaseUrl;
      return url.endsWith('/') ? url.substring(0, url.length - 1) : url;
    } catch (_) {
      return 'http://localhost:4000/api';
    }
  }

  // HTTP GET
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.get<T>(
      path,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }

  // HTTP POST
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.post<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }

  // HTTP PUT
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.put<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }

  // HTTP PATCH
  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.patch<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }

  // HTTP DELETE
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    return dio.delete<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
      cancelToken: cancelToken,
    );
  }

  // File Upload Helper (Multipart)
  Future<Response<T>> uploadFile<T>(
    String path, {
    required XFile file,
    String fileFieldName = 'file',
    Map<String, dynamic>? extraData,
    void Function(int sent, int total)? onSendProgress,
  }) async {
    final bytes = await file.readAsBytes();
    final fileName = file.name.trim().isNotEmpty
        ? file.name
        : file.path.split(RegExp(r'[/\\]')).last;
    final formData = FormData.fromMap({
      fileFieldName: MultipartFile.fromBytes(
        bytes,
        filename: fileName,
      ),
      if (extraData != null) ...extraData,
    });

    return dio.post<T>(
      path,
      data: formData,
      options: Options(
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      ),
      onSendProgress: onSendProgress,
    );
  }
}

