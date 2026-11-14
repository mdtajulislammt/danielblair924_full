class SubmissionItemModel {
  final String id;
  final String activity;
  final String distance;
  final double distanceKm;
  final String date;
  final String duration;
  final String pace;
  final String status;
  final String type;
  final String? stravaImageUrl;
  final String? gpsImageUrl;
  final String? createdAt;

  const SubmissionItemModel({
    required this.id,
    required this.activity,
    required this.distance,
    required this.distanceKm,
    required this.date,
    required this.duration,
    required this.pace,
    required this.status,
    required this.type,
    this.stravaImageUrl,
    this.gpsImageUrl,
    this.createdAt,
  });

  factory SubmissionItemModel.fromJson(Map<String, dynamic> json) {
    return SubmissionItemModel(
      id: json['id'] as String? ?? '',
      activity: json['activity'] as String? ?? 'Community Run',
      distance: json['distance'] as String? ?? '0.0 km',
      distanceKm: (json['distanceKm'] as num?)?.toDouble() ?? 0.0,
      date: json['date'] as String? ?? '',
      duration: json['duration'] as String? ?? '00:00:00',
      pace: json['pace'] as String? ?? '5:30 /km',
      status: json['status'] as String? ?? 'PENDING',
      type: json['type'] as String? ?? 'Pending',
      stravaImageUrl: json['stravaImageUrl'] as String?,
      gpsImageUrl: json['gpsImageUrl'] as String?,
      createdAt: json['createdAt'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity': activity,
      'distance': distance,
      'distanceKm': distanceKm,
      'date': date,
      'duration': duration,
      'pace': pace,
      'status': status,
      'type': type,
      'stravaImageUrl': stravaImageUrl,
      'gpsImageUrl': gpsImageUrl,
      'createdAt': createdAt,
    };
  }

  bool get isApproved => status.toUpperCase() == 'APPROVED';
  bool get isRejected => status.toUpperCase() == 'REJECTED';
  bool get isPending => status.toUpperCase() == 'PENDING';
}

class SubmissionPaginationModel {
  final int totalItems;
  final int currentPage;
  final int totalPages;
  final int itemsPerPage;

  const SubmissionPaginationModel({
    required this.totalItems,
    required this.currentPage,
    required this.totalPages,
    required this.itemsPerPage,
  });

  factory SubmissionPaginationModel.fromJson(Map<String, dynamic> json) {
    return SubmissionPaginationModel(
      totalItems: json['totalItems'] as int? ?? 0,
      currentPage: json['currentPage'] as int? ?? 1,
      totalPages: json['totalPages'] as int? ?? 1,
      itemsPerPage: json['itemsPerPage'] as int? ?? 10,
    );
  }
}

