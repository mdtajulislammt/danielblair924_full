import 'package:flutter/foundation.dart';

@immutable
class ProfileStatsModel {
  const ProfileStatsModel({
    this.lifetimeDistanceKm = 0.0,
    this.eventsJoined = 0,
    this.badgesEarned = 0,
    this.currentRank = 1,
    this.averagePace = '5:30',
    this.longestRun = 0.0,
    this.totalRuns = 0,
    this.thisMonthKm = 0.0,
    this.monthlyBreakdown = const [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  final double lifetimeDistanceKm;
  final int eventsJoined;
  final int badgesEarned;
  final int currentRank;
  final String averagePace;
  final double longestRun;
  final int totalRuns;
  final double thisMonthKm;
  final List<double> monthlyBreakdown;

  factory ProfileStatsModel.fromJson(Map<String, dynamic> json) {
    final breakdownRaw = json['monthlyBreakdown'] as List? ?? [];
    final List<double> breakdown = breakdownRaw.map((v) => (v as num).toDouble()).toList();
    while (breakdown.length < 12) {
      breakdown.add(0.0);
    }

    return ProfileStatsModel(
      lifetimeDistanceKm: (json['lifetimeDistanceKm'] as num?)?.toDouble() ?? 0.0,
      eventsJoined: (json['eventsJoined'] as num?)?.toInt() ?? 0,
      badgesEarned: (json['badgesEarned'] as num?)?.toInt() ?? 0,
      currentRank: (json['currentRank'] as num?)?.toInt() ?? 1,
      averagePace: json['averagePace']?.toString() ?? '5:30',
      longestRun: (json['longestRun'] as num?)?.toDouble() ?? 0.0,
      totalRuns: (json['totalRuns'] as num?)?.toInt() ?? 0,
      thisMonthKm: (json['thisMonthKm'] as num?)?.toDouble() ?? 0.0,
      monthlyBreakdown: breakdown,
    );
  }
}

