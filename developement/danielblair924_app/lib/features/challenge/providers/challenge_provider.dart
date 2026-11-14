import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/theme/theme.dart';
import '../models/challenge_model.dart';
import '../models/map_route_models.dart';

class ChallengeState {
  final bool isLoading;
  final bool isJoining;
  final ChallengeItemModel? activeChallenge;
  final double currentCollectiveKm;
  final List<MilestoneDestinationModel> destinations;
  final List<ChallengeParticipantModel> participants;
  final int selectedMilestoneIndex;
  final String? errorMessage;
  final String? actionMessage;

  const ChallengeState({
    this.isLoading = false,
    this.isJoining = false,
    this.activeChallenge,
    this.currentCollectiveKm = 0.0,
    this.destinations = const [],
    this.participants = const [],
    this.selectedMilestoneIndex = 0,
    this.errorMessage,
    this.actionMessage,
  });

  ChallengeState copyWith({
    bool? isLoading,
    bool? isJoining,
    ChallengeItemModel? activeChallenge,
    double? currentCollectiveKm,
    List<MilestoneDestinationModel>? destinations,
    List<ChallengeParticipantModel>? participants,
    int? selectedMilestoneIndex,
    String? errorMessage,
    String? actionMessage,
  }) {
    return ChallengeState(
      isLoading: isLoading ?? this.isLoading,
      isJoining: isJoining ?? this.isJoining,
      activeChallenge: activeChallenge ?? this.activeChallenge,
      currentCollectiveKm: currentCollectiveKm ?? this.currentCollectiveKm,
      destinations: destinations ?? this.destinations,
      participants: participants ?? this.participants,
      selectedMilestoneIndex: selectedMilestoneIndex ?? this.selectedMilestoneIndex,
      errorMessage: errorMessage,
      actionMessage: actionMessage,
    );
  }

  MilestoneDestinationModel? get currentMilestone {
    if (destinations.isEmpty) return null;
    try {
      return destinations.firstWhere((d) => d.status == 'Current');
    } catch (_) {
      try {
        return destinations.firstWhere((d) => d.status == 'Unlocked');
      } catch (_) {
        return destinations.first;
      }
    }
  }

  MilestoneDestinationModel? get nextMilestone {
    if (destinations.isEmpty) return null;
    try {
      return destinations.firstWhere((d) => d.status == 'Locked');
    } catch (_) {
      return destinations.last;
    }
  }

  List<MapRoute> get routes {
    if (destinations.isEmpty) return [];

    final mapLocations = destinations.map((d) => d.toMapLocation()).toList();
    if (mapLocations.length < 2) {
      return [MapRoute(points: mapLocations, color: AppColors.primary)];
    }

    // Build segments with dynamic colors based on completion
    final segmentColors = <Color>[];
    for (int i = 0; i < mapLocations.length - 1; i++) {
      final fromCompleted = mapLocations[i].completed;
      final toCompleted = mapLocations[i + 1].completed;
      if (fromCompleted && toCompleted) {
        segmentColors.add(AppColors.primary);
      } else if (fromCompleted && !toCompleted) {
        segmentColors.add(AppColors.primary);
      } else {
        segmentColors.add(AppColors.disabledForeground);
      }
    }

    return [
      MapRoute(
        points: mapLocations,
        segmentColors: segmentColors,
      ),
    ];
  }
}

class ChallengeNotifier extends Notifier<ChallengeState> {
  @override
  ChallengeState build() {
    Future.microtask(() => fetchChallengeData());
    return const ChallengeState(isLoading: true);
  }

  Future<void> fetchChallengeData() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      ChallengeItemModel? activeChallenge;
      double currentKm = 0.0;
      List<MilestoneDestinationModel> fetchedDestinations = [];
      List<ChallengeParticipantModel> fetchedParticipants = [];

      // 1. Fetch active challenges
      try {
        final challengeRes = await ApiClient.instance.get(
          ApiEndpoints.challenges,
          queryParameters: {'scope': 'COMMUNITY_WIDE', 'status': 'ACTIVE'},
        );

        final cData = challengeRes.data;
        if (cData is Map<String, dynamic> && cData['data'] is Map<String, dynamic>) {
          final items = cData['data']['items'] as List<dynamic>? ?? [];
          if (items.isNotEmpty) {
            activeChallenge = ChallengeItemModel.fromJson(items.first as Map<String, dynamic>);
            currentKm = activeChallenge.currentProgress;
          }
        }
      } catch (_) {
        // Fallback challenge
      }

      // 2. Fetch destinations
      try {
        final destEndpoint = activeChallenge != null
            ? ApiEndpoints.challengeDestinations(activeChallenge.id)
            : '/challenges/ratw/destinations';

        final destRes = await ApiClient.instance.get(destEndpoint);
        final dData = destRes.data;
        if (dData is Map<String, dynamic> && dData['data'] is Map<String, dynamic>) {
          if (dData['data']['currentCollectiveKm'] != null) {
            currentKm = (dData['data']['currentCollectiveKm'] as num).toDouble();
          }
          final destList = dData['data']['destinations'] as List<dynamic>? ?? [];
          fetchedDestinations = destList
              .map((d) => MilestoneDestinationModel.fromJson(d as Map<String, dynamic>))
              .toList();
        }
      } catch (_) {
        // Fallback destinations
      }

      // 3. Fetch participants
      if (activeChallenge != null) {
        try {
          final partRes = await ApiClient.instance.get(
            ApiEndpoints.challengeParticipants(activeChallenge.id),
          );
          final pData = partRes.data;
          if (pData is Map<String, dynamic> && pData['data'] is Map<String, dynamic>) {
            final partList = pData['data']['participants'] as List<dynamic>? ?? [];
            fetchedParticipants = partList
                .map((p) => ChallengeParticipantModel.fromJson(p as Map<String, dynamic>))
                .toList();
          }
        } catch (_) {}
      }

      // Fallbacks if server data was empty or unreachable
      if (activeChallenge == null) {
        activeChallenge = _getFallbackChallenge();
        currentKm = activeChallenge.currentProgress;
      }
      if (fetchedDestinations.isEmpty) {
        fetchedDestinations = _getFallbackDestinations(currentKm);
      }
      if (fetchedParticipants.isEmpty) {
        fetchedParticipants = _getFallbackParticipants();
      }

      state = state.copyWith(
        isLoading: false,
        activeChallenge: activeChallenge,
        currentCollectiveKm: currentKm,
        destinations: fetchedDestinations,
        participants: fetchedParticipants,
        errorMessage: null,
      );
    } catch (e) {
      final fallbackChallenge = _getFallbackChallenge();
      state = state.copyWith(
        isLoading: false,
        activeChallenge: state.activeChallenge ?? fallbackChallenge,
        currentCollectiveKm: state.currentCollectiveKm > 0
            ? state.currentCollectiveKm
            : fallbackChallenge.currentProgress,
        destinations: state.destinations.isEmpty
            ? _getFallbackDestinations(fallbackChallenge.currentProgress)
            : state.destinations,
        participants: state.participants.isEmpty
            ? _getFallbackParticipants()
            : state.participants,
        errorMessage: e is DioException
            ? (e.response?.data?['message']?.toString() ?? 'Failed to load challenge')
            : e.toString(),
      );
    }
  }

  Future<bool> joinChallenge(String challengeId) async {
    state = state.copyWith(isJoining: true, actionMessage: null);

    try {
      final response = await ApiClient.instance.post(
        '${ApiEndpoints.challenges}/$challengeId/join',
      );

      final message = response.data?['message']?.toString() ??
          'Successfully joined challenge!';

      final updatedChallenge = state.activeChallenge?.copyWith(
        isJoined: true,
        participantsCount: (state.activeChallenge?.participantsCount ?? 0) + 1,
      );

      state = state.copyWith(
        isJoining: false,
        activeChallenge: updatedChallenge,
        actionMessage: message,
      );

      return true;
    } catch (e) {
      // Optimistic offline mode
      final updatedChallenge = state.activeChallenge?.copyWith(
        isJoined: true,
        participantsCount: (state.activeChallenge?.participantsCount ?? 0) + 1,
      );

      state = state.copyWith(
        isJoining: false,
        activeChallenge: updatedChallenge,
        actionMessage: 'Joined challenge (Offline mode)',
      );

      return true;
    }
  }

  void selectMilestone(int index) {
    state = state.copyWith(selectedMilestoneIndex: index);
  }

  void clearMessages() {
    state = state.copyWith(actionMessage: null, errorMessage: null);
  }

  ChallengeItemModel _getFallbackChallenge() {
    return const ChallengeItemModel(
      id: 'challenge-ratw-2026',
      title: 'Run Around The World 2026',
      description: 'Unite runners globally to conquer the equator distance of 40,075 km collectively.',
      scope: 'COMMUNITY_WIDE',
      type: 'Community-wide',
      status: 'ACTIVE',
      currentProgress: 1420.5,
      targetProgress: 40075.0,
      progressUnit: 'km',
      progressPercent: 3.5,
      participantsCount: 142,
      submissionsCount: 890,
      isJoined: true,
      userIndividualKm: 84.0,
    );
  }

  List<MilestoneDestinationModel> _getFallbackDestinations(double currentKm) {
    const rawDestinations = [
      {'id': 1, 'destination': 'Bangladesh', 'countryCode': 'BD', 'distance': 0.0, 'badge': 'Bangladesh Star Medal'},
      {'id': 2, 'destination': 'India', 'countryCode': 'IN', 'distance': 500.0, 'badge': 'India Silver Medal'},
      {'id': 3, 'destination': 'Nepal', 'countryCode': 'NP', 'distance': 1000.0, 'badge': 'Nepal Gold Medal'},
      {'id': 4, 'destination': 'China', 'countryCode': 'CN', 'distance': 2500.0, 'badge': 'China Trophy'},
      {'id': 5, 'destination': 'Rome', 'countryCode': 'IT', 'distance': 5000.0, 'badge': 'Rome Colosseum Medal'},
      {'id': 6, 'destination': 'Paris', 'countryCode': 'FR', 'distance': 7500.0, 'badge': 'Parisian Finisher Medal'},
      {'id': 7, 'destination': 'Tokyo', 'countryCode': 'JP', 'distance': 10000.0, 'badge': 'Tokyo Marathon Master'},
      {'id': 8, 'destination': 'Cairo', 'countryCode': 'EG', 'distance': 15000.0, 'badge': 'Cairo Nile Medal'},
      {'id': 9, 'destination': 'Cape Town', 'countryCode': 'ZA', 'distance': 20000.0, 'badge': 'Cape Point Medal'},
      {'id': 10, 'destination': 'Rio de Janeiro', 'countryCode': 'BR', 'distance': 27500.0, 'badge': 'Rio Samba Medal'},
      {'id': 11, 'destination': 'New York', 'countryCode': 'US', 'distance': 35000.0, 'badge': 'NYC Skyline Medal'},
      {'id': 12, 'destination': 'London', 'countryCode': 'GB', 'distance': 40075.0, 'badge': 'World Finisher Trophy'},
    ];

    bool foundCurrent = false;

    return rawDestinations.map((raw) {
      final reqKm = raw['distance'] as double;
      String status = 'Locked';
      String unlockDate = 'Not yet reached';

      if (currentKm >= reqKm) {
        status = 'Unlocked';
        unlockDate = 'Unlocked';
      } else if (!foundCurrent) {
        status = 'Current';
        unlockDate = 'In Progress';
        foundCurrent = true;
      }

      return MilestoneDestinationModel(
        id: raw['id'] as int,
        destination: raw['destination'] as String,
        countryCode: raw['countryCode'] as String,
        distanceRequiredKm: reqKm,
        distanceRequired: '${reqKm.toInt()} km',
        badgeName: raw['badge'] as String,
        badgeIcon: '/badges/badge${raw["id"]}.png',
        status: status,
        unlockDate: unlockDate,
      );
    }).toList();
  }

  List<ChallengeParticipantModel> _getFallbackParticipants() {
    return const [
      ChallengeParticipantModel(
        id: 'p-1',
        userId: 'u-1',
        rank: 1,
        name: 'Sarah Connor',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        location: 'London, UK',
        individualKm: 120.0,
      ),
      ChallengeParticipantModel(
        id: 'p-2',
        userId: 'u-2',
        rank: 2,
        name: 'David Kim',
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
        location: 'Seoul, Korea',
        individualKm: 98.5,
      ),
      ChallengeParticipantModel(
        id: 'p-3',
        userId: 'u-3',
        rank: 3,
        name: 'Jane Runner',
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
        location: 'Rome, Italy',
        individualKm: 84.0,
      ),
      ChallengeParticipantModel(
        id: 'p-4',
        userId: 'u-4',
        rank: 4,
        name: 'Carlos Mendoza',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        location: 'Madrid, Spain',
        individualKm: 76.2,
      ),
    ];
  }
}

final challengeProvider = NotifierProvider<ChallengeNotifier, ChallengeState>(
  ChallengeNotifier.new,
);

