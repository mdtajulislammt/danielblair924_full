import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

/// Lightweight card used to display a short motivational message.
class JourneyQuoteCard extends StatelessWidget {
  const JourneyQuoteCard({super.key, required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        spacing: 8,
        crossAxisAlignment: .start,
        children: [
          Icon(Icons.info_outlined),
          Flexible(child: Text(message)),
        ],
      ),
    );
  }
}
