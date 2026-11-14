import 'package:flutter/foundation.dart';

@immutable
class BadgeModel {
  const BadgeModel({
    required this.id,
    required this.slug,
    required this.name,
    required this.description,
    required this.iconUrl,
    required this.tagType,
    required this.earnedCount,
    this.isUnlocked = false,
    this.earnedAt,
  });

  final String id;
  final String slug;
  final String name;
  final String description;
  final String iconUrl;
  final String tagType;
  final int earnedCount;
  final bool isUnlocked;
  final DateTime? earnedAt;

  factory BadgeModel.fromJson(Map<String, dynamic> json) {
    return BadgeModel(
      id: json['id']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Badge',
      description: json['description']?.toString() ?? '',
      iconUrl: json['iconUrl']?.toString() ?? json['icon']?.toString() ?? '',
      tagType: json['tagType']?.toString() ?? 'EVENT',
      earnedCount: (json['earnedCount'] as num?)?.toInt() ?? 0,
      isUnlocked: json['isUnlocked'] == true,
      earnedAt: json['earnedAt'] != null ? DateTime.tryParse(json['earnedAt'].toString()) : null,
    );
  }
}

@immutable
class MyBadgesModel {
  const MyBadgesModel({
    this.totalEarned = 0,
    this.totalAvailable = 0,
    this.completionPercentage = 0,
    this.unlocked = const [],
    this.locked = const [],
    this.badges = const [],
  });

  final int totalEarned;
  final int totalAvailable;
  final int completionPercentage;
  final List<BadgeModel> unlocked;
  final List<BadgeModel> locked;
  final List<BadgeModel> badges;

  factory MyBadgesModel.fromJson(Map<String, dynamic> json) {
    final unlockedList = (json['unlocked'] as List? ?? [])
        .map((e) => BadgeModel.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
    final lockedList = (json['locked'] as List? ?? [])
        .map((e) => BadgeModel.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
    final allList = (json['badges'] as List? ?? [])
        .map((e) => BadgeModel.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();

    return MyBadgesModel(
      totalEarned: (json['totalEarned'] as num?)?.toInt() ?? unlockedList.length,
      totalAvailable: (json['totalAvailable'] as num?)?.toInt() ?? (unlockedList.length + lockedList.length),
      completionPercentage: (json['completionPercentage'] as num?)?.toInt() ?? 0,
      unlocked: unlockedList,
      locked: lockedList,
      badges: allList.isNotEmpty ? allList : [...unlockedList, ...lockedList],
    );
  }
}

