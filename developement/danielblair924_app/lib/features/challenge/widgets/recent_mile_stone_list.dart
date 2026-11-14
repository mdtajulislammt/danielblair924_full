import 'package:flutter/material.dart';

import '../../../../gen/assets.gen.dart';
import '../models/challenge_model.dart';
import 'location_card.dart';

class RecentMileStoneList extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onMilestoneTap;
  final List<MilestoneDestinationModel>? destinations;
  final ValueChanged<MilestoneDestinationModel>? onDestinationTap;

  const RecentMileStoneList({
    super.key,
    required this.selectedIndex,
    required this.onMilestoneTap,
    this.destinations,
    this.onDestinationTap,
  });

  @override
  Widget build(BuildContext context) {
    if (destinations != null && destinations!.isNotEmpty) {
      return SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          spacing: 12,
          children: destinations!.asMap().entries.map((entry) {
            final idx = entry.key;
            final item = entry.value;
            final isSelected = selectedIndex == idx;
            return LocationCard(
              imagePath: item.heroImage,
              title: item.destination.toUpperCase(),
              subtitle: item.distanceRequired,
              isSelected: isSelected,
              onTap: () {
                onMilestoneTap(idx);
                if (onDestinationTap != null) {
                  onDestinationTap!(item);
                }
              },
            );
          }).toList(),
        ),
      );
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        spacing: 12,
        children: [
          LocationCard(
            imagePath: Assets.temp.paris.path,
            title: 'PARIS',
            subtitle: '1,050 km',
            isSelected: selectedIndex == 0,
            onTap: () => onMilestoneTap(0),
          ),
          LocationCard(
            imagePath: Assets.temp.london.path,
            title: 'LONDON',
            subtitle: '1,050 km',
            isSelected: selectedIndex == 1,
            onTap: () => onMilestoneTap(1),
          ),
          LocationCard(
            imagePath: Assets.temp.london.path,
            title: 'BERLIN',
            subtitle: '1,050 km',
            isSelected: selectedIndex == 2,
            onTap: () => onMilestoneTap(2),
          ),
          LocationCard(
            imagePath: Assets.temp.london.path,
            title: 'MADRID',
            subtitle: '1,050 km',
            isSelected: selectedIndex == 3,
            onTap: () => onMilestoneTap(3),
          ),
          LocationCard(
            imagePath: Assets.temp.rome.path,
            title: 'ROME',
            subtitle: '1,050 km',
            isSelected: selectedIndex == 4,
            onTap: () => onMilestoneTap(4),
          ),
        ],
      ),
    );
  }
}
