import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../models/event_model.dart';

class EventsState {
  final bool isLoading;
  final bool isJoining;
  final String? joiningEventId;
  final List<EventItemModel> events;
  final String selectedFilter; // 'ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED'
  final String? errorMessage;
  final String? actionMessage;

  const EventsState({
    this.isLoading = false,
    this.isJoining = false,
    this.joiningEventId,
    this.events = const [],
    this.selectedFilter = 'ALL',
    this.errorMessage,
    this.actionMessage,
  });

  EventsState copyWith({
    bool? isLoading,
    bool? isJoining,
    String? joiningEventId,
    List<EventItemModel>? events,
    String? selectedFilter,
    String? errorMessage,
    String? actionMessage,
  }) {
    return EventsState(
      isLoading: isLoading ?? this.isLoading,
      isJoining: isJoining ?? this.isJoining,
      joiningEventId: joiningEventId ?? this.joiningEventId,
      events: events ?? this.events,
      selectedFilter: selectedFilter ?? this.selectedFilter,
      errorMessage: errorMessage,
      actionMessage: actionMessage,
    );
  }

  List<EventItemModel> get filteredEvents {
    if (selectedFilter == 'ALL') return events;
    return events.where((e) => e.status == selectedFilter).toList();
  }
}

class EventsNotifier extends Notifier<EventsState> {
  @override
  EventsState build() {
    // Initial fetch on initialization
    Future.microtask(() => fetchEvents());
    return const EventsState(isLoading: true);
  }

  Future<void> fetchEvents({String? status, String? category}) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final queryParams = <String, dynamic>{
        'limit': 50,
      };
      if (status != null && status != 'ALL') {
        queryParams['status'] = status;
      }
      if (category != null && category.isNotEmpty) {
        queryParams['category'] = category;
      }

      final response = await ApiClient.instance.get(
        ApiEndpoints.events,
        queryParameters: queryParams,
      );

      final data = response.data;
      List<EventItemModel> fetchedItems = [];

      if (data is Map<String, dynamic>) {
        if (data['data'] is Map<String, dynamic> &&
            data['data']['items'] is List) {
          final itemsList = data['data']['items'] as List;
          fetchedItems = itemsList
              .map((item) => EventItemModel.fromJson(item as Map<String, dynamic>))
              .toList();
        } else if (data['data'] is List) {
          fetchedItems = (data['data'] as List)
              .map((item) => EventItemModel.fromJson(item as Map<String, dynamic>))
              .toList();
        }
      }

      // If backend has no events yet, provide sensible initial defaults
      if (fetchedItems.isEmpty) {
        fetchedItems = _getFallbackEvents();
      }

      state = state.copyWith(
        isLoading: false,
        events: fetchedItems,
        errorMessage: null,
      );
    } catch (e) {
      // In offline / dev mode, show fallback events with a note
      state = state.copyWith(
        isLoading: false,
        events: state.events.isEmpty ? _getFallbackEvents() : state.events,
        errorMessage: e is DioException
            ? (e.response?.data?['message']?.toString() ?? 'Failed to load events from server')
            : e.toString(),
      );
    }
  }

  Future<bool> joinEvent(String eventId) async {
    state = state.copyWith(
      isJoining: true,
      joiningEventId: eventId,
      actionMessage: null,
      errorMessage: null,
    );

    try {
      final response = await ApiClient.instance.post(
        ApiEndpoints.joinEvent(eventId),
      );

      final message = response.data?['message']?.toString() ??
          'Successfully registered for event!';

      // Optimistically update the event in state
      final updatedEvents = state.events.map((ev) {
        if (ev.id == eventId) {
          return ev.copyWith(
            isJoined: true,
            registeredCount: ev.registeredCount + 1,
          );
        }
        return ev;
      }).toList();

      state = state.copyWith(
        isJoining: false,
        joiningEventId: null,
        events: updatedEvents,
        actionMessage: message,
      );

      return true;
    } catch (e) {
      final errorMsg = e is DioException
          ? (e.response?.data?['message']?.toString() ?? 'Failed to join event')
          : e.toString();

      state = state.copyWith(
        isJoining: false,
        joiningEventId: null,
        errorMessage: errorMsg,
      );

      return false;
    }
  }

  void setFilter(String filter) {
    state = state.copyWith(selectedFilter: filter);
  }

  void clearMessages() {
    state = state.copyWith(actionMessage: null, errorMessage: null);
  }

  List<EventItemModel> _getFallbackEvents() {
    return [
      EventItemModel(
        id: 'event-5k-comm',
        title: '5K Community Run',
        description: 'Join runners worldwide for our weekly 5K community run. Complete the distance, record your pace, and share your evidence on TikTok!',
        eventDate: DateTime.now().add(const Duration(days: 3)),
        distanceType: '5KM',
        category: 'General',
        status: 'ACTIVE',
        registeredCount: 42,
        submissionsCount: 18,
        requirements: const EventRequirementsModel(
          completeDistance: true,
          uploadRunningEvidence: true,
          postOnTikTok: true,
          tiktokCaptionInstructions: 'Tag @FirstMileClub and include #FirstMile5K',
          specificHashtag: '#FirstMile5K',
        ),
      ),
      EventItemModel(
        id: 'event-sunset-10k',
        title: 'Sunset City Run 10K',
        description: 'Golden hour pacing through the city skyline. Capture the sunset on your run and submit your evidence.',
        eventDate: DateTime.now().add(const Duration(days: 9)),
        distanceType: '10KM',
        category: 'City',
        status: 'UPCOMING',
        registeredCount: 34,
        submissionsCount: 0,
        requirements: const EventRequirementsModel(
          completeDistance: true,
          uploadRunningEvidence: true,
          postOnTikTok: true,
          tiktokCaptionInstructions: 'Tag @FirstMileClub and use #SunsetCityRun',
          specificHashtag: '#SunsetCityRun',
        ),
      ),
      EventItemModel(
        id: 'event-trail-15k',
        title: 'Trailblazer 15K Challenge',
        description: 'Conquer the rugged trails and push your endurance to the next level.',
        eventDate: DateTime.now().add(const Duration(days: 15)),
        distanceType: '15KM',
        category: 'Trail',
        status: 'UPCOMING',
        registeredCount: 22,
        submissionsCount: 0,
        requirements: const EventRequirementsModel(
          completeDistance: true,
          uploadRunningEvidence: true,
          postOnTikTok: true,
          tiktokCaptionInstructions: 'Share your trail photos and tag #Trailblazer15K',
          specificHashtag: '#Trailblazer15K',
        ),
      ),
      EventItemModel(
        id: 'event-night-5k',
        title: 'Night Hawk 5K',
        description: 'Official night run event between 10 PM and 4 AM.',
        eventDate: DateTime.now().subtract(const Duration(days: 7)),
        distanceType: '5KM',
        category: 'Special',
        status: 'COMPLETED',
        registeredCount: 56,
        submissionsCount: 49,
        isJoined: true,
        hasSubmitted: true,
        requirements: const EventRequirementsModel(
          completeDistance: true,
          uploadRunningEvidence: true,
          postOnTikTok: true,
        ),
      ),
    ];
  }
}

final eventsProvider = NotifierProvider<EventsNotifier, EventsState>(
  EventsNotifier.new,
);

