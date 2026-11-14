import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';

/// Represents a single map point location
class MapLocation {
  final String id;
  final String label;
  final LatLng point;
  final bool completed;
  final String? subtitle;
  final String? status; // 'Unlocked', 'Current', 'Locked'
  final double? distanceRequiredKm;
  final String? distanceRequired;
  final String? badgeName;
  final String? badgeIcon;
  final String? heroImagePath;
  final String? countryCode;
  final String? quote;

  const MapLocation({
    required this.id,
    required this.label,
    required this.point,
    this.completed = false,
    this.subtitle,
    this.status,
    this.distanceRequiredKm,
    this.distanceRequired,
    this.badgeName,
    this.badgeIcon,
    this.heroImagePath,
    this.countryCode,
    this.quote,
  });

  MapLocation copyWith({
    String? id,
    String? label,
    LatLng? point,
    bool? completed,
    String? subtitle,
    String? status,
    double? distanceRequiredKm,
    String? distanceRequired,
    String? badgeName,
    String? badgeIcon,
    String? heroImagePath,
    String? countryCode,
    String? quote,
  }) {
    return MapLocation(
      id: id ?? this.id,
      label: label ?? this.label,
      point: point ?? this.point,
      completed: completed ?? this.completed,
      subtitle: subtitle ?? this.subtitle,
      status: status ?? this.status,
      distanceRequiredKm: distanceRequiredKm ?? this.distanceRequiredKm,
      distanceRequired: distanceRequired ?? this.distanceRequired,
      badgeName: badgeName ?? this.badgeName,
      badgeIcon: badgeIcon ?? this.badgeIcon,
      heroImagePath: heroImagePath ?? this.heroImagePath,
      countryCode: countryCode ?? this.countryCode,
      quote: quote ?? this.quote,
    );
  }
}

/// Represents a route composed of sequential location steps (e.g. A -> B or C -> D -> E)
class MapRoute {
  final List<MapLocation> points;

  /// List of colors for individual segments.
  /// Length should ideally be `points.length - 1`.
  /// Index 0 = Segment A -> B, Index 1 = Segment B -> C, etc.
  final List<Color>? segmentColors;

  /// Fallback color for all segments if `segmentColors` is not provided
  final Color? color;

  final double strokeWidth;

  const MapRoute({
    required this.points,
    this.segmentColors,
    this.color,
    this.strokeWidth = 2.0,
  });
}
