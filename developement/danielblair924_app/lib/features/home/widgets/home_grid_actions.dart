import 'package:first_mile_club/core/navigation/navigation.dart';
import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/home/home.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class HomeGridActions extends StatelessWidget {
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),

      crossAxisCount: 2,
      mainAxisSpacing: 8.h,
      crossAxisSpacing: 8.w,
      childAspectRatio: 2.1,

      children: [
        Consumer(
          builder: (context, ref, child) {
            return CustomListTileCard(
              leading: SvgIcon(
                Assets.icons.calendar,
                themeColor: false,
                size: 28,
              ),
              title: 'My Events',
              subtitle: '2 upcoming',
              trailing: const Icon(Icons.chevron_right_rounded),
              onTap: () {
                ref.read(bottomStackViewProvider.notifier).goTo(1);
                // Handle tap event
              },
            );
          },
        ),
        CustomListTileCard(
          leading: SvgIcon(Assets.icons.medal, themeColor: false, size: 28),
          title: 'Latest\nBadge',
          onTap: () {
            // Handle tap event
          },
        ),
        CustomListTileCard(
          leading: SvgIcon(Assets.icons.campaign, themeColor: false, size: 28),
          title: 'NEWS & \nANNOUNCE',
          subtitle: 'Stay updated',
          onTap: () => context.push(AppRoutes.newsAndAnnouncements),
        ),
        CustomListTileCard(
          leading: SvgIcon(Assets.icons.nfcCard, themeColor: false, size: 28),
          title: 'NFC',
          subtitle: 'Tap to view',
          onTap: () => context.push(AppRoutes.nfc),
        ),
      ],
    );
  }
}
