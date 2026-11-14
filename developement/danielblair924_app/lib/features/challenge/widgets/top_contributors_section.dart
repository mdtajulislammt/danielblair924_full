import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

/// Horizontal row of avatars representing top contributors.
class TopContributorsSection extends StatelessWidget {
  const TopContributorsSection({
    super.key,
    required this.title,
    required this.contributors,
  });

  final String title;

  /// The [UserAvatarBadgeItem] widgets shown for each contributor.
  final List<Widget> contributors;

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: 16,
      children: [
        SectionHeader(
          title: title,
          padding: EdgeInsets.symmetric(
            horizontal: AppStyles.paddingScreenHorizontal,
          ),
        ),
        SingleChildScrollView(
          scrollDirection: .horizontal,
          padding: EdgeInsets.symmetric(
            horizontal: AppStyles.paddingScreenHorizontal,
          ),
          child: Row(
            spacing: 12.w,
            children: contributors,
          ),
        ),
      ],
    );
  }
}
