import 'dart:convert';
import 'dart:math';

import 'package:first_mile_club/core/theme/app_colors.dart';
import 'package:first_mile_club/core/widgets/svg_icon.dart';
import 'package:first_mile_club/features/challenge/challenge.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class ReusableWorldMap extends StatefulWidget {
  final double height;
  final List<MapRoute> routes;
  final ValueChanged<MapLocation>? onLocationTap;
  final String geoJsonAssetPath;
  final Color completedColor;
  final Color incompletedColor;
  final Color boundaryColor;
  final LatLng initialCenter;
  final double initialZoom;
  final MapController? mapController;

  const ReusableWorldMap({
    super.key,
    required this.height,
    required this.routes,
    this.onLocationTap,
    this.geoJsonAssetPath = 'assets/other/countries.geojson',
    this.completedColor = AppColors.primary,
    this.incompletedColor = AppColors.placeholder,
    this.boundaryColor = const Color(0x50BADA55),
    this.initialCenter = const LatLng(30.0, 50.0),
    this.initialZoom = 2.5,
    this.mapController,
  });

  @override
  State<ReusableWorldMap> createState() => _ReusableWorldMapState();
}

class _ReusableWorldMapState extends State<ReusableWorldMap> {
  List<Polyline> _countryBoundaries = [];
  bool _isLoading = true;
  late final MapController _mapController;

  @override
  void initState() {
    super.initState();
    _mapController = widget.mapController ?? MapController();
    _loadGeoJson();
  }

  /// Parses GeoJSON file into vector polylines outlines for countries
  Future<void> _loadGeoJson() async {
    try {
      final String response = await rootBundle.loadString(
        widget.geoJsonAssetPath,
      );
      final Map<String, dynamic> data = json.decode(response);

      List<Polyline> lines = [];

      for (var feature in data['features']) {
        var geometry = feature['geometry'];
        var type = geometry['type'];
        var coordinates = geometry['coordinates'];

        if (type == 'Polygon') {
          _addPolygon(coordinates, lines);
        } else if (type == 'MultiPolygon') {
          for (var polygon in coordinates) {
            _addPolygon(polygon, lines);
          }
        }
      }

      setState(() {
        _countryBoundaries = lines;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _addPolygon(List dynamicPolygon, List<Polyline> lines) {
    for (var ring in dynamicPolygon) {
      List<LatLng> points = [];
      for (var coord in ring) {
        points.add(LatLng(coord[1].toDouble(), coord[0].toDouble()));
      }
      lines.add(
        Polyline(points: points, strokeWidth: 0.8, color: widget.boundaryColor),
      );
    }
  }

  /// Calculates a quadratic Bezier curve arc between two coordinates
  List<LatLng> _calculateArc(LatLng start, LatLng end, {int pointCount = 50}) {
    List<LatLng> arcPoints = [];

    double midLat = (start.latitude + end.latitude) / 2;
    double midLng = (start.longitude + end.longitude) / 2;

    double distance = sqrt(
      pow(end.latitude - start.latitude, 2) +
          pow(end.longitude - start.longitude, 2),
    );
    double curveOffset = distance * 0.15;

    double controlLat = midLat + curveOffset;
    double controlLng = midLng;

    for (int i = 0; i <= pointCount; i++) {
      double t = i / pointCount;
      double lat =
          (1 - t) * (1 - t) * start.latitude +
          2 * (1 - t) * t * controlLat +
          t * t * end.latitude;
      double lng =
          (1 - t) * (1 - t) * start.longitude +
          2 * (1 - t) * t * controlLng +
          t * t * end.longitude;
      arcPoints.add(LatLng(lat, lng));
    }
    return arcPoints;
  }

  /// Generates polylines for all route segments across multi-point paths
  List<Polyline> _buildRoutePolylines() {
    List<Polyline> polylines = [];

    for (var route in widget.routes) {
      if (route.points.length < 2) continue;

      for (int i = 0; i < route.points.length - 1; i++) {
        final start = route.points[i].point;
        final end = route.points[i + 1].point;
        final arcPoints = _calculateArc(start, end);

        // Determine segment color hierarchy:
        // 1. Specific segment color if available in route.segmentColors
        // 2. Fallback route color if route.color is set
        // 3. Fallback default widget.lineColor
        Color segmentColor = widget.completedColor;
        if (route.segmentColors != null && i < route.segmentColors!.length) {
          segmentColor = route.segmentColors![i];
        } else if (route.color != null) {
          segmentColor = route.color!;
        }

        polylines.add(
          Polyline(
            points: arcPoints,
            strokeWidth: route.strokeWidth,
            color: segmentColor,
          ),
        );
      }
    }

    return polylines;
  }

  /// Extracts unique markers across all routes
  List<Marker> _buildLocationMarkers() {
    final Map<String, MapLocation> uniqueLocations = {};

    for (var route in widget.routes) {
      for (var location in route.points) {
        uniqueLocations[location.id] = location;
      }
    }

    return uniqueLocations.values.map((loc) => _buildMarker(loc)).toList();
  }

  Marker _buildMarker(MapLocation location) {
    final statusColor = location.completed
        ? widget.completedColor
        : widget.incompletedColor;
    return Marker(
      point: location.point,
      width: 120,
      height: 44,
      alignment: Alignment(0.75, -0.35),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          if (widget.onLocationTap != null) {
            widget.onLocationTap!(location);
          }
        },
        child: Row(
          crossAxisAlignment: .start,
          spacing: 2,
          children: [
            SvgIcon(
              Assets.icons.mapPin,
              size: 32,
              color: statusColor,
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: .start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    location.label.toUpperCase(),
                    overflow: .ellipsis,
                    style: TextStyle(
                      color: AppColors.white,
                      fontWeight: FontWeight.bold,
                      height: 1,
                      fontSize: 11,
                      shadows: const [
                        BoxShadow(color: Colors.black, blurRadius: 4),
                      ],
                    ),
                  ),
                  Text(
                    location.subtitle ?? (location.distanceRequired ?? 'Milestone'),
                    overflow: .ellipsis,
                    style: TextStyle(
                      color: statusColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                      shadows: const [
                        BoxShadow(
                          color: Colors.black,
                          blurRadius: 4,
                          offset: Offset(0, 1),
                        ),
                      ],
                    ),
                  ),
              
                  if (location.completed)
                    Icon(
                      Icons.check_circle,
                      size: 15,
                      color: widget.completedColor,
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return SizedBox(
        height: widget.height,
        child: Center(
          child: CircularProgressIndicator(color: widget.completedColor),
        ),
      );
    }

    return SizedBox(
      height: widget.height,
      child: FlutterMap(
        mapController: _mapController,
        options: MapOptions(
          backgroundColor: Colors.transparent,
          initialCenter: widget.initialCenter,
          initialZoom: widget.initialZoom,
          minZoom: 1.0,
          maxZoom: 8.0,
        ),
        children: [
          PolylineLayer(polylines: _countryBoundaries),
          PolylineLayer(polylines: _buildRoutePolylines()),
          MarkerLayer(markers: _buildLocationMarkers()),
        ],
      ),
    );
  }
}
