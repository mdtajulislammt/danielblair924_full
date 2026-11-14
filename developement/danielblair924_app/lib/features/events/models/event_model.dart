class EventRequirementsModel {
  final bool completeDistance;
  final bool uploadRunningEvidence;
  final bool postOnTikTok;
  final String? tiktokCaptionInstructions;
  final bool tagFirstMileClub;
  final bool tagCollaboratingPage;
  final String? collaboratingPageName;
  final bool useSpecificHashtag;
  final String? specificHashtag;

  const EventRequirementsModel({
    this.completeDistance = true,
    this.uploadRunningEvidence = true,
    this.postOnTikTok = true,
    this.tiktokCaptionInstructions,
    this.tagFirstMileClub = true,
    this.tagCollaboratingPage = false,
    this.collaboratingPageName,
    this.useSpecificHashtag = true,
    this.specificHashtag,
  });

  factory EventRequirementsModel.fromJson(Map<String, dynamic> json) {
    return EventRequirementsModel(
      completeDistance: json['completeDistance'] as bool? ?? true,
      uploadRunningEvidence: json['uploadRunningEvidence'] as bool? ?? true,
      postOnTikTok: json['postOnTikTok'] as bool? ?? true,
      tiktokCaptionInstructions: json['tiktokCaptionInstructions'] as String?,
      tagFirstMileClub: json['tagFirstMileClub'] as bool? ?? true,
      tagCollaboratingPage: json['tagCollaboratingPage'] as bool? ?? false,
      collaboratingPageName: json['collaboratingPageName'] as String?,
      useSpecificHashtag: json['useSpecificHashtag'] as bool? ?? true,
      specificHashtag: json['specificHashtag'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'completeDistance': completeDistance,
      'uploadRunningEvidence': uploadRunningEvidence,
      'postOnTikTok': postOnTikTok,
      'tiktokCaptionInstructions': tiktokCaptionInstructions,
      'tagFirstMileClub': tagFirstMileClub,
      'tagCollaboratingPage': tagCollaboratingPage,
      'collaboratingPageName': collaboratingPageName,
      'useSpecificHashtag': useSpecificHashtag,
      'specificHashtag': specificHashtag,
    };
  }
}

class EventItemModel {
  final String id;
  final String title;
  final String? description;
  final DateTime? eventDate;
  final String? distanceType;
  final String? coverImageUrl;
  final String status; // 'UPCOMING', 'ACTIVE', 'COMPLETED', 'DRAFT'
  final String category;
  final int registeredCount;
  final int submissionsCount;
  final EventRequirementsModel? requirements;
  final bool isJoined;
  final bool hasSubmitted;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const EventItemModel({
    required this.id,
    required this.title,
    this.description,
    this.eventDate,
    this.distanceType,
    this.coverImageUrl,
    this.status = 'ACTIVE',
    this.category = 'General',
    this.registeredCount = 0,
    this.submissionsCount = 0,
    this.requirements,
    this.isJoined = false,
    this.hasSubmitted = false,
    this.createdAt,
    this.updatedAt,
  });

  factory EventItemModel.fromJson(Map<String, dynamic> json) {
    DateTime? parseDate(dynamic val) {
      if (val == null) return null;
      if (val is DateTime) return val;
      return DateTime.tryParse(val.toString());
    }

    return EventItemModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? json['eventName']?.toString() ?? 'Unnamed Event',
      description: json['description'] as String?,
      eventDate: parseDate(json['eventDate']),
      distanceType: json['distanceType'] as String? ?? '5KM',
      coverImageUrl: json['coverImageUrl'] as String?,
      status: (json['status']?.toString() ?? 'ACTIVE').toUpperCase(),
      category: json['category']?.toString() ?? 'General',
      registeredCount: (json['registeredCount'] as num?)?.toInt() ?? 0,
      submissionsCount: (json['submissionsCount'] as num?)?.toInt() ?? 0,
      requirements: json['requirements'] is Map<String, dynamic>
          ? EventRequirementsModel.fromJson(json['requirements'] as Map<String, dynamic>)
          : null,
      isJoined: json['isJoined'] as bool? ?? false,
      hasSubmitted: json['hasSubmitted'] as bool? ?? false,
      createdAt: parseDate(json['createdAt']),
      updatedAt: parseDate(json['updatedAt']),
    );
  }

  EventItemModel copyWith({
    String? id,
    String? title,
    String? description,
    DateTime? eventDate,
    String? distanceType,
    String? coverImageUrl,
    String? status,
    String? category,
    int? registeredCount,
    int? submissionsCount,
    EventRequirementsModel? requirements,
    bool? isJoined,
    bool? hasSubmitted,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return EventItemModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      eventDate: eventDate ?? this.eventDate,
      distanceType: distanceType ?? this.distanceType,
      coverImageUrl: coverImageUrl ?? this.coverImageUrl,
      status: status ?? this.status,
      category: category ?? this.category,
      registeredCount: registeredCount ?? this.registeredCount,
      submissionsCount: submissionsCount ?? this.submissionsCount,
      requirements: requirements ?? this.requirements,
      isJoined: isJoined ?? this.isJoined,
      hasSubmitted: hasSubmitted ?? this.hasSubmitted,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  String get formattedDate {
    if (eventDate == null) return 'TBA';
    final d = eventDate!;
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final month = months[d.month - 1];
    final hour = d.hour % 12 == 0 ? 12 : d.hour % 12;
    final minute = d.minute.toString().padLeft(2, '0');
    final ampm = d.hour >= 12 ? 'PM' : 'AM';
    return '$month ${d.day}, ${d.year} • $hour:$minute $ampm';
  }
}

class EventPaginationModel {
  final List<EventItemModel> items;
  final int total;
  final int page;
  final int limit;
  final int totalPages;

  const EventPaginationModel({
    required this.items,
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
  });

  factory EventPaginationModel.fromJson(Map<String, dynamic> json) {
    final rawItems = json['items'] as List<dynamic>? ?? [];
    final pagination = json['pagination'] as Map<String, dynamic>? ?? {};

    return EventPaginationModel(
      items: rawItems
          .map((i) => EventItemModel.fromJson(i as Map<String, dynamic>))
          .toList(),
      total: (pagination['total'] as num?)?.toInt() ?? rawItems.length,
      page: (pagination['page'] as num?)?.toInt() ?? 1,
      limit: (pagination['limit'] as num?)?.toInt() ?? 10,
      totalPages: (pagination['totalPages'] as num?)?.toInt() ?? 1,
    );
  }
}

