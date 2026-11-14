import 'package:flutter/foundation.dart';

@immutable
class NewsArticleModel {
  const NewsArticleModel({
    required this.id,
    required this.title,
    required this.body,
    required this.coverImageUrl,
    required this.date,
    required this.publishDate,
    this.authorName = 'Admin Team',
    this.badgeText = 'Update',
  });

  final String id;
  final String title;
  final String body;
  final String coverImageUrl;
  final String date;
  final String publishDate;
  final String authorName;
  final String badgeText;

  factory NewsArticleModel.fromJson(Map<String, dynamic> json) {
    String author = 'Admin Team';
    if (json['author'] is Map) {
      final a = json['author'] as Map;
      author = a['name']?.toString() ?? a['username']?.toString() ?? 'Admin Team';
    }

    return NewsArticleModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      body: json['body']?.toString() ?? '',
      coverImageUrl: json['coverImageUrl']?.toString() ?? '',
      date: json['date']?.toString() ?? '',
      publishDate: json['publishDate']?.toString() ?? '',
      authorName: author,
      badgeText: 'Update',
    );
  }
}

