import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../widgets/distance_unit_switch.dart';
import '../screens/submit_run_prompt_screen.dart';

class RunSubmissionDraftState {
  final RunType? runType;
  final double distance;
  final DistanceUnit unit;
  final DateTime selectedDate;
  final String duration;
  final String pace;
  final String? eventId;
  final String? challengeId;
  final String linkedTitle;

  // Proof & Evidence
  final File? stravaFile;
  final File? gpsFile;
  final String? stravaImageUrl;
  final String? gpsImageUrl;
  final bool isUploadingProof;
  final String? uploadError;

  // Social & TikTok
  final bool postedOnTikTok;
  final String tiktokVideoUrl;
  final bool taggedClub;
  final bool usedHashtag;

  // Submission Status
  final bool isSubmitting;
  final String? submitError;
  final bool submissionSuccess;
  final String? createdSubmissionId;

  RunSubmissionDraftState({
    this.runType,
    this.distance = 0.0,
    this.unit = DistanceUnit.km,
    DateTime? selectedDate,
    this.duration = '',
    this.pace = '',
    this.eventId,
    this.challengeId,
    this.linkedTitle = '5K Community Run',
    this.stravaFile,
    this.gpsFile,
    this.stravaImageUrl,
    this.gpsImageUrl,
    this.isUploadingProof = false,
    this.uploadError,
    this.postedOnTikTok = false,
    this.tiktokVideoUrl = '',
    this.taggedClub = false,
    this.usedHashtag = false,
    this.isSubmitting = false,
    this.submitError,
    this.submissionSuccess = false,
    this.createdSubmissionId,
  }) : selectedDate = selectedDate ?? DateTime.now();

  double get distanceInKm {
    if (unit == DistanceUnit.mi) {
      return distance * 1.60934;
    }
    return distance;
  }

  RunSubmissionDraftState copyWith({
    RunType? runType,
    double? distance,
    DistanceUnit? unit,
    DateTime? selectedDate,
    String? duration,
    String? pace,
    String? eventId,
    String? challengeId,
    String? linkedTitle,
    File? stravaFile,
    bool clearStravaFile = false,
    File? gpsFile,
    bool clearGpsFile = false,
    String? stravaImageUrl,
    bool clearStravaImageUrl = false,
    String? gpsImageUrl,
    bool clearGpsImageUrl = false,
    bool? isUploadingProof,
    String? uploadError,
    bool clearUploadError = false,
    bool? postedOnTikTok,
    String? tiktokVideoUrl,
    bool? taggedClub,
    bool? usedHashtag,
    bool? isSubmitting,
    String? submitError,
    bool clearSubmitError = false,
    bool? submissionSuccess,
    String? createdSubmissionId,
  }) {
    return RunSubmissionDraftState(
      runType: runType ?? this.runType,
      distance: distance ?? this.distance,
      unit: unit ?? this.unit,
      selectedDate: selectedDate ?? this.selectedDate,
      duration: duration ?? this.duration,
      pace: pace ?? this.pace,
      eventId: eventId ?? this.eventId,
      challengeId: challengeId ?? this.challengeId,
      linkedTitle: linkedTitle ?? this.linkedTitle,
      stravaFile: clearStravaFile ? null : (stravaFile ?? this.stravaFile),
      gpsFile: clearGpsFile ? null : (gpsFile ?? this.gpsFile),
      stravaImageUrl: clearStravaImageUrl ? null : (stravaImageUrl ?? this.stravaImageUrl),
      gpsImageUrl: clearGpsImageUrl ? null : (gpsImageUrl ?? this.gpsImageUrl),
      isUploadingProof: isUploadingProof ?? this.isUploadingProof,
      uploadError: clearUploadError ? null : (uploadError ?? this.uploadError),
      postedOnTikTok: postedOnTikTok ?? this.postedOnTikTok,
      tiktokVideoUrl: tiktokVideoUrl ?? this.tiktokVideoUrl,
      taggedClub: taggedClub ?? this.taggedClub,
      usedHashtag: usedHashtag ?? this.usedHashtag,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      submitError: clearSubmitError ? null : (submitError ?? this.submitError),
      submissionSuccess: submissionSuccess ?? this.submissionSuccess,
      createdSubmissionId: createdSubmissionId ?? this.createdSubmissionId,
    );
  }
}

final runSubmissionProvider =
    NotifierProvider<RunSubmissionNotifier, RunSubmissionDraftState>(
  RunSubmissionNotifier.new,
);

class RunSubmissionNotifier extends Notifier<RunSubmissionDraftState> {
  ApiClient get _apiClient => ref.read(apiClientProvider);

  @override
  RunSubmissionDraftState build() {
    return RunSubmissionDraftState();
  }

  void setRunType(RunType type) {
    state = state.copyWith(
      runType: type,
      linkedTitle: type == RunType.event ? '5K Community Run' : 'RATW Global Journey',
    );
  }

  void setLinkedTarget({
    String? eventId,
    String? challengeId,
    String? linkedTitle,
  }) {
    state = state.copyWith(
      eventId: eventId,
      challengeId: challengeId,
      linkedTitle: linkedTitle ?? state.linkedTitle,
    );
  }

  void setLogDetails({
    required double distance,
    required DistanceUnit unit,
    required DateTime date,
    String? duration,
    String? pace,
    String? eventId,
    String? challengeId,
    String? linkedTitle,
  }) {
    final calculatedPace = (pace != null && pace.isNotEmpty)
        ? pace
        : _calculatePace(
            unit == DistanceUnit.mi ? distance * 1.60934 : distance,
            duration ?? '',
          );

    state = state.copyWith(
      distance: distance,
      unit: unit,
      selectedDate: date,
      duration: duration ?? '',
      pace: calculatedPace,
      eventId: eventId ?? state.eventId,
      challengeId: challengeId ?? state.challengeId,
      linkedTitle: linkedTitle ?? state.linkedTitle,
      clearSubmitError: true,
    );
  }

  void setStravaFile(File? file) {
    state = state.copyWith(
      stravaFile: file,
      clearStravaImageUrl: file == null,
      clearStravaFile: file == null,
      clearUploadError: true,
    );
  }

  void setGpsFile(File? file) {
    state = state.copyWith(
      gpsFile: file,
      clearGpsImageUrl: file == null,
      clearGpsFile: file == null,
      clearUploadError: true,
    );
  }

  // Backward compatibility alias for single evidence picker
  void setEvidenceFile(File? file) {
    setStravaFile(file);
  }

  Future<bool> uploadEvidence() async {
    if (state.stravaFile == null && state.gpsFile == null) return true;

    state = state.copyWith(
      isUploadingProof: true,
      clearUploadError: true,
    );

    try {
      String? stravaUrl = state.stravaImageUrl;
      String? gpsUrl = state.gpsImageUrl;

      if (state.stravaFile != null && (stravaUrl == null || stravaUrl.isEmpty)) {
        final response = await _apiClient.uploadFile(
          ApiEndpoints.upload,
          file: state.stravaFile!,
        );
        final data = response.data;
        if (data is Map<String, dynamic>) {
          if (data['data'] is Map<String, dynamic>) {
            stravaUrl = data['data']['url'] as String?;
          } else if (data['url'] is String) {
            stravaUrl = data['url'] as String?;
          }
        }
      }

      if (state.gpsFile != null && (gpsUrl == null || gpsUrl.isEmpty)) {
        final response = await _apiClient.uploadFile(
          ApiEndpoints.upload,
          file: state.gpsFile!,
        );
        final data = response.data;
        if (data is Map<String, dynamic>) {
          if (data['data'] is Map<String, dynamic>) {
            gpsUrl = data['data']['url'] as String?;
          } else if (data['url'] is String) {
            gpsUrl = data['url'] as String?;
          }
        }
      }

      state = state.copyWith(
        stravaImageUrl: stravaUrl,
        gpsImageUrl: gpsUrl,
        isUploadingProof: false,
      );
      return true;
    } on DioException catch (e) {
      final msg = e.response?.data?['message']?.toString() ??
          e.message ??
          'File upload failed';
      state = state.copyWith(
        isUploadingProof: false,
        uploadError: msg,
      );
      return false;
    } catch (e) {
      state = state.copyWith(
        isUploadingProof: false,
        uploadError: e.toString(),
      );
      return false;
    }
  }

  void setSocialProof({
    bool? postedOnTikTok,
    String? tiktokVideoUrl,
    bool? taggedClub,
    bool? usedHashtag,
  }) {
    state = state.copyWith(
      postedOnTikTok: postedOnTikTok ?? state.postedOnTikTok,
      tiktokVideoUrl: tiktokVideoUrl ?? state.tiktokVideoUrl,
      taggedClub: taggedClub ?? state.taggedClub,
      usedHashtag: usedHashtag ?? state.usedHashtag,
    );
  }

  Future<bool> submitRun() async {
    state = state.copyWith(
      isSubmitting: true,
      clearSubmitError: true,
    );

    try {
      // 1. Upload evidence images if selected and not yet uploaded
      if ((state.stravaFile != null && (state.stravaImageUrl == null || state.stravaImageUrl!.isEmpty)) ||
          (state.gpsFile != null && (state.gpsImageUrl == null || state.gpsImageUrl!.isEmpty))) {
        final uploadOk = await uploadEvidence();
        if (!uploadOk) {
          state = state.copyWith(
            isSubmitting: false,
            submitError: state.uploadError ?? 'Evidence upload failed',
          );
          return false;
        }
      }

      // 2. Validate real user input: distance must be strictly greater than 0
      final double distanceKm = double.parse(state.distanceInKm.toStringAsFixed(2));
      if (distanceKm <= 0.0) {
        state = state.copyWith(
          isSubmitting: false,
          submitError: 'Please enter a valid run distance greater than 0.',
        );
        return false;
      }

      final String duration = state.duration.trim();
      if (duration.isEmpty) {
        state = state.copyWith(
          isSubmitting: false,
          submitError: 'Please enter your actual run duration.',
        );
        return false;
      }

      final String pace = state.pace.isNotEmpty
          ? state.pace
          : _calculatePace(distanceKm, duration);

      final Map<String, dynamic> payload = {
        'distanceKm': distanceKm,
        'duration': duration,
        'pace': pace,
        'runDate': state.selectedDate.toIso8601String(),
        if (state.stravaImageUrl != null && state.stravaImageUrl!.isNotEmpty)
          'stravaImageUrl': state.stravaImageUrl,
        if (state.gpsImageUrl != null && state.gpsImageUrl!.isNotEmpty)
          'gpsImageUrl': state.gpsImageUrl,
        if (state.eventId != null && state.eventId!.isNotEmpty)
          'eventId': state.eventId,
        if (state.challengeId != null && state.challengeId!.isNotEmpty)
          'challengeId': state.challengeId,
        'postedOnTikTok': state.postedOnTikTok,
        'taggedClub': state.taggedClub,
        'usedHashtag': state.usedHashtag,
      };

      final response = await _apiClient.post(
        ApiEndpoints.submissions,
        data: payload,
      );

      String? subId;
      if (response.data is Map<String, dynamic>) {
        final respMap = response.data as Map<String, dynamic>;
        if (respMap['data'] is Map<String, dynamic>) {
          subId = respMap['data']['id']?.toString();
        }
      }

      // 3. If TikTok URL is present, call finalize endpoint and handle errors explicitly
      if (subId != null && state.tiktokVideoUrl.trim().isNotEmpty) {
        try {
          await _apiClient.post(
            '${ApiEndpoints.submissions}/$subId/finalize',
            data: {
              'postedOnTikTok': state.postedOnTikTok,
              'tiktokVideoUrl': state.tiktokVideoUrl.trim(),
              'taggedClub': state.taggedClub,
              'usedHashtag': state.usedHashtag,
            },
          );
        } on DioException catch (finalizeErr) {
          final finalizeMsg = finalizeErr.response?.data?['message']?.toString() ??
              finalizeErr.message ??
              'Failed to finalize social proof';
          state = state.copyWith(
            isSubmitting: false,
            submitError: 'Submission created, but finalize failed: $finalizeMsg',
          );
          return false;
        }
      }

      state = state.copyWith(
        isSubmitting: false,
        submissionSuccess: true,
        createdSubmissionId: subId,
      );
      return true;
    } on DioException catch (e) {
      final msg = e.response?.data?['message']?.toString() ??
          e.message ??
          'Failed to submit run proof';
      state = state.copyWith(
        isSubmitting: false,
        submitError: msg,
      );
      return false;
    } catch (e) {
      state = state.copyWith(
        isSubmitting: false,
        submitError: e.toString(),
      );
      return false;
    }
  }

  void resetDraft() {
    state = RunSubmissionDraftState();
  }

  static String _calculatePace(double distanceKm, String durationStr) {
    if (distanceKm <= 0) return '5:30 /km';
    try {
      int totalSeconds = 0;
      final parts = durationStr.split(':').map(int.tryParse).toList();
      if (parts.length == 3 && parts[0] != null && parts[1] != null && parts[2] != null) {
        totalSeconds = parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
      } else if (parts.length == 2 && parts[0] != null && parts[1] != null) {
        totalSeconds = parts[0]! * 60 + parts[1]!;
      }

      if (totalSeconds <= 0) return '5:30 /km';

      final secPerKm = totalSeconds / distanceKm;
      final paceMinutes = (secPerKm / 60).floor();
      final paceSeconds = (secPerKm % 60).round();
      final paddedSec = paceSeconds < 10 ? '0$paceSeconds' : '$paceSeconds';
      return '$paceMinutes:$paddedSec /km';
    } catch (_) {
      return '5:30 /km';
    }
  }
}

