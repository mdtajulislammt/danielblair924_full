import 'package:flutter/foundation.dart';

@immutable
class LeaderboardUser {
  const LeaderboardUser({
    required this.id,
    required this.rank,
    required this.name,
    required this.score,
    required this.avatarUrl,
    this.distanceKm = 0.0,
    this.rankChange = 0,
    this.isMe = false,
  });

  final String id;
  final int rank;
  final String name;
  final String score;
  final double distanceKm;
  final String avatarUrl;
  final int rankChange;
  final bool isMe;

  factory LeaderboardUser.fromJson(Map<String, dynamic> json, {String? currentUserId}) {
    final id = json['id']?.toString() ?? '';
    final distance = (json['distanceKm'] as num?)?.toDouble() ?? 0.0;
    final scoreStr = json['score']?.toString() ?? '${distance.toStringAsFixed(1)} KM';
    final isMeFlag = json['isMe'] == true || (currentUserId != null && id == currentUserId);

    return LeaderboardUser(
      id: id,
      rank: (json['rank'] as num?)?.toInt() ?? 0,
      name: json['name']?.toString() ?? 'Runner',
      score: scoreStr,
      distanceKm: distance,
      avatarUrl: json['avatarUrl']?.toString() ?? '',
      rankChange: (json['rankChange'] as num?)?.toInt() ?? 0,
      isMe: isMeFlag,
    );
  }
}

@immutable
class LeaderboardState {
  const LeaderboardState({
    this.isLoading = false,
    this.errorMessage,
    this.users = const [],
    this.currentUser,
  });

  final bool isLoading;
  final String? errorMessage;
  final List<LeaderboardUser> users;
  final LeaderboardUser? currentUser;

  LeaderboardState copyWith({
    bool? isLoading,
    String? errorMessage,
    List<LeaderboardUser>? users,
    LeaderboardUser? currentUser,
  }) {
    return LeaderboardState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      users: users ?? this.users,
      currentUser: currentUser ?? this.currentUser,
    );
  }
}

