import 'package:first_mile_club/features/challenge/challenge.dart';
import 'package:first_mile_club/features/events/events.dart';
import 'package:first_mile_club/features/home/home.dart';
import 'package:first_mile_club/features/leaderboard/leaderboard.dart';
import 'package:first_mile_club/features/profile/profile.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/widgets/widgets.dart';

final bottomStackViewProvider =
    NotifierProvider<BottomStackViewController, int>(
      BottomStackViewController.new,
    );

class BottomStackViewController extends Notifier<int> {
  @override
  int build() => 0;

  void goTo(int index) => state = index;
}

class UserBottomStackView extends ConsumerWidget {
  const UserBottomStackView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndex = ref.watch(bottomStackViewProvider);

    return Scaffold(
      extendBodyBehindAppBar: true,
      extendBody: true,
      body: IndexedStack(
        index: selectedIndex,
        children: [
          HomeTabScreen(),
          EventsTabScreen(),
          ChallengeTabScreen(),
          LeaderboardTabScreen(),
          ProfileTabScreen(),
        ],
      ),
      bottomNavigationBar: FloatingPillNavBar(
        selectedIndex: selectedIndex,
        onTabChange: (index) =>
            ref.read(bottomStackViewProvider.notifier).goTo(index),
        tabs: [
          NavBarTabItem(
            index: 0,
            selectedIndex: selectedIndex,
            activeIcon: Assets.icons.home,
            inactiveIcon: Assets.icons.home,
            text: 'HOME',
          ),
          NavBarTabItem(
            index: 1,
            selectedIndex: selectedIndex,
            activeIcon: Assets.icons.calendar,
            inactiveIcon: Assets.icons.calendar,
            text: 'Events',
          ),
          NavBarTabItem(
            index: 2,
            selectedIndex: selectedIndex,
            activeIcon: Assets.icons.trophy,
            inactiveIcon: Assets.icons.trophy,
            text: 'CHALLENGE',
          ),
          NavBarTabItem(
            index: 3,
            selectedIndex: selectedIndex,
            activeIcon: Assets.icons.hierarchySquare,
            inactiveIcon: Assets.icons.hierarchySquare,
            text: 'LEADERBOARD',
          ),
          NavBarTabItem(
            index: 4,
            selectedIndex: selectedIndex,
            activeIcon: Assets.icons.person,
            inactiveIcon: Assets.icons.person,
            text: 'PROFILE',
          ),
        ],
      ),
    );
  }
}
