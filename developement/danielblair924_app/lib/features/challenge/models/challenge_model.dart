import 'package:latlong2/latlong.dart';
import '../../../../gen/assets.gen.dart';
import 'map_route_models.dart';

class ChallengeItemModel {
  final String id;
  final String title;
  final String? description;
  final String scope;
  final String type;
  final String status;
  final double currentProgress;
  final double targetProgress;
  final String progressUnit;
  final double progressPercent;
  final String? coverImageUrl;
  final DateTime? startDate;
  final DateTime? endDate;
  final int participantsCount;
  final int submissionsCount;
  final bool isJoined;
  final double userIndividualKm;

  const ChallengeItemModel({
    required this.id,
    required this.title,
    this.description,
    this.scope = 'COMMUNITY_WIDE',
    this.type = 'Community-wide',
    this.status = 'ACTIVE',
    this.currentProgress = 0.0,
    this.targetProgress = 40075.0,
    this.progressUnit = 'km',
    this.progressPercent = 0.0,
    this.coverImageUrl,
    this.startDate,
    this.endDate,
    this.participantsCount = 0,
    this.submissionsCount = 0,
    this.isJoined = false,
    this.userIndividualKm = 0.0,
  });

  factory ChallengeItemModel.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic val) {
      if (val == null) return null;
      if (val is DateTime) return val;
      return DateTime.tryParse(val.toString());
    }

    final target = (json['targetProgress'] as num?)?.toDouble() ?? 40075.0;
    final current = (json['currentProgress'] as num?)?.toDouble() ?? 0.0;
    final calcPercent = target > 0
        ? ((current / target) * 100).clamp(0.0, 100.0)
        : 0.0;

    return ChallengeItemModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? json['challengeName']?.toString() ?? 'Run Around The World',
      description: json['description'] as String?,
      scope: json['scope']?.toString() ?? 'COMMUNITY_WIDE',
      type: json['type']?.toString() ?? 'Community-wide',
      status: (json['status']?.toString() ?? 'ACTIVE').toUpperCase(),
      currentProgress: current,
      targetProgress: target,
      progressUnit: json['progressUnit']?.toString() ?? 'km',
      progressPercent: (json['progressPercent'] as num?)?.toDouble() ??
          double.parse(calcPercent.toStringAsFixed(1)),
      coverImageUrl: json['coverImageUrl'] as String?,
      startDate: parseDate(json['startDate']),
      endDate: parseDate(json['endDate']),
      participantsCount: (json['participantsCount'] as num?)?.toInt() ?? 0,
      submissionsCount: (json['submissionsCount'] as num?)?.toInt() ?? 0,
      isJoined: json['isJoined'] as bool? ?? false,
      userIndividualKm: (json['userIndividualKm'] as num?)?.toDouble() ?? 0.0,
    );
  }

  ChallengeItemModel copyWith({
    String? id,
    String? title,
    String? description,
    String? scope,
    String? type,
    String? status,
    double? currentProgress,
    double? targetProgress,
    String? progressUnit,
    double? progressPercent,
    String? coverImageUrl,
    DateTime? startDate,
    DateTime? endDate,
    int? participantsCount,
    int? submissionsCount,
    bool? isJoined,
    double? userIndividualKm,
  }) {
    return ChallengeItemModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      scope: scope ?? this.scope,
      type: type ?? this.type,
      status: status ?? this.status,
      currentProgress: currentProgress ?? this.currentProgress,
      targetProgress: targetProgress ?? this.targetProgress,
      progressUnit: progressUnit ?? this.progressUnit,
      progressPercent: progressPercent ?? this.progressPercent,
      coverImageUrl: coverImageUrl ?? this.coverImageUrl,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      participantsCount: participantsCount ?? this.participantsCount,
      submissionsCount: submissionsCount ?? this.submissionsCount,
      isJoined: isJoined ?? this.isJoined,
      userIndividualKm: userIndividualKm ?? this.userIndividualKm,
    );
  }
}

class MilestoneDestinationModel {
  final int id;
  final String destination;
  final String countryCode;
  final double distanceRequiredKm;
  final String distanceRequired;
  final String badgeName;
  final String badgeIcon;
  final String status; // 'Unlocked', 'Current', 'Locked'
  final String unlockDate;

  const MilestoneDestinationModel({
    required this.id,
    required this.destination,
    required this.countryCode,
    required this.distanceRequiredKm,
    required this.distanceRequired,
    required this.badgeName,
    required this.badgeIcon,
    this.status = 'Locked',
    this.unlockDate = 'Not yet reached',
  });

  factory MilestoneDestinationModel.fromJson(Map<String, dynamic> json) {
    return MilestoneDestinationModel(
      id: (json['id'] as num?)?.toInt() ?? 0,
      destination: json['destination']?.toString() ?? '',
      countryCode: json['countryCode']?.toString() ?? '',
      distanceRequiredKm: (json['distanceRequiredKm'] as num?)?.toDouble() ?? 0.0,
      distanceRequired: json['distanceRequired']?.toString() ??
          '${(json['distanceRequiredKm'] as num?)?.toInt() ?? 0} km',
      badgeName: json['badgeName']?.toString() ?? '',
      badgeIcon: json['badgeIcon']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Locked',
      unlockDate: json['unlockDate']?.toString() ?? 'Not yet reached',
    );
  }

  bool get isUnlocked => status == 'Unlocked';
  bool get isCurrent => status == 'Current';
  bool get isLocked => status == 'Locked';

  LatLng get coordinates {
    final destLower = destination.toLowerCase().trim();
    if (destLower.contains('rome')) return const LatLng(41.9028, 12.4964);
    if (destLower.contains('paris')) return const LatLng(48.8566, 2.3522);
    if (destLower.contains('cairo')) return const LatLng(30.0444, 31.2357);
    if (destLower.contains('cape town')) return const LatLng(-33.9249, 18.4241);
    if (destLower.contains('new york')) return const LatLng(40.7128, -74.0060);
    if (destLower.contains('rio')) return const LatLng(-22.9068, -43.1729);
    if (destLower.contains('tokyo')) return const LatLng(35.6762, 139.6503);
    if (destLower.contains('london')) return const LatLng(51.5074, -0.1278);
    if (destLower.contains('bangladesh') || destLower.contains('dhaka')) {
      return const LatLng(23.6850, 90.3563);
    }
    if (destLower.contains('india') || destLower.contains('delhi')) {
      return const LatLng(20.5937, 78.9629);
    }
    if (destLower.contains('nepal') || destLower.contains('kathmandu')) {
      return const LatLng(28.3949, 84.1240);
    }
    if (destLower.contains('china') || destLower.contains('beijing')) {
      return const LatLng(35.8617, 104.1954);
    }
    if (destLower.contains('berlin')) return const LatLng(52.5200, 13.4050);
    if (destLower.contains('madrid')) return const LatLng(40.4168, -3.7038);
    return const LatLng(41.9028, 12.4964);
  }

  String get heroImage {
    final destLower = destination.toLowerCase().trim();
    if (destLower.contains('rome')) return Assets.temp.rome.path;
    if (destLower.contains('paris')) return Assets.temp.paris.path;
    if (destLower.contains('london')) return Assets.temp.london.path;
    if (destLower.contains('cairo')) return Assets.temp.sunset.path;
    if (destLower.contains('tokyo')) return Assets.temp.nightRun.path;
    return Assets.temp.rome.path;
  }

  String get inspiringQuote {
    final destLower = destination.toLowerCase().trim();
    if (destLower.contains('rome')) {
      return "Rome wasn't built in a day. But every step brings us closer!";
    }
    if (destLower.contains('paris')) {
      return "Paris is always a good idea. Keep pushing across the continent!";
    }
    if (destLower.contains('london')) {
      return "Through the historic streets of London, our community journey continues!";
    }
    if (destLower.contains('tokyo')) {
      return "Fast pace and neon lights in Tokyo. Unstoppable together!";
    }
    if (destLower.contains('bangladesh')) {
      return "Starting the journey where perseverance begins.";
    }
    return "Every kilometer completed brings the world closer together!";
  }

  MapLocation toMapLocation() {
    return MapLocation(
      id: destination.toLowerCase().replaceAll(' ', '_'),
      label: destination,
      point: coordinates,
      completed: isUnlocked,
      subtitle: distanceRequired,
      status: status,
      distanceRequiredKm: distanceRequiredKm,
      distanceRequired: distanceRequired,
      badgeName: badgeName,
      badgeIcon: badgeIcon,
      heroImagePath: heroImage,
      countryCode: countryCode,
      quote: inspiringQuote,
    );
  }
}

class ChallengeParticipantModel {
  final String id;
  final String userId;
  final int rank;
  final String name;
  final String? email;
  final String? avatarUrl;
  final String? location;
  final double individualKm;
  final DateTime? joinedAt;

  const ChallengeParticipantModel({
    required this.id,
    required this.userId,
    required this.rank,
    required this.name,
    this.email,
    this.avatarUrl,
    this.location,
    required this.individualKm,
    this.joinedAt,
  });

  factory ChallengeParticipantModel.fromJson(Map<String, dynamic> json) {
    return ChallengeParticipantModel(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? '',
      rank: (json['rank'] as num?)?.toInt() ?? 1,
      name: json['name']?.toString() ?? 'Runner',
      email: json['email'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      location: json['location'] as String?,
      individualKm: (json['individualKm'] as num?)?.toDouble() ?? 0.0,
      joinedAt: json['joinedAt'] != null
          ? DateTime.tryParse(json['joinedAt'].toString())
          : null,
    );
  }
}

