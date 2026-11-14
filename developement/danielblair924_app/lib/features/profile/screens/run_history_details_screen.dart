import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/constants/app_config.dart';
import '../../../core/extensions/sizedbox_extension.dart';
import '../../../core/extensions/theme_extensions.dart';
import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/utils/utils.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../../home/models/submission_model.dart';
import '../widgets/run_history_list_filter.dart';

class RunHistoryDetailsScreen extends StatefulWidget {
  final SubmissionItemModel? submission;

  const RunHistoryDetailsScreen({super.key, this.submission});

  @override
  State<RunHistoryDetailsScreen> createState() =>
      _RunHistoryDetailsScreenState();
}

class _RunHistoryDetailsScreenState extends State<RunHistoryDetailsScreen> {
  RunHistoryDateFilter selectedFilter = RunHistoryDateFilter.allTime;

  HistoryBadgeStatus _mapStatus(String? status) {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return HistoryBadgeStatus.approved;
      case 'REJECTED':
        return HistoryBadgeStatus.rejected;
      case 'PENDING':
      default:
        return HistoryBadgeStatus.pending;
    }
  }

  String _resolveImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    final baseUrl = AppConfig.serverBaseUrl.replaceAll('/api', '');
    return '$baseUrl$path';
  }

  @override
  Widget build(BuildContext context) {
    final sub = widget.submission;
    final displayDate = sub?.date ?? 'May 18, 2026';
    final displayDistance =
        sub != null ? '${sub.distanceKm.toStringAsFixed(2)} km' : '8.24 km';
    final displayDuration = sub?.duration ?? '52:48';
    final displayActivity = sub?.activity ?? '5K Community Run';
    final status = _mapStatus(sub?.status);
    final imageUrl = _resolveImageUrl(sub?.stravaImageUrl ?? sub?.gpsImageUrl);

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: Text(displayDate),
        backgroundColor: Colors.transparent,
      ),
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: EdgeInsets.symmetric(
              horizontal: AppStyles.paddingScreenHorizontal,
            ),
            child: Column(
              children: [
                AspectRatio(
                  aspectRatio: 4 / 3,
                  child: AppCard(
                    padding: EdgeInsets.zero,
                    width: double.infinity,
                    child: imageUrl.isNotEmpty
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(
                              AppStyles.cardBorderRadius,
                            ),
                            child: Image.network(
                              imageUrl,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => _buildPlaceholder(),
                            ),
                          )
                        : _buildPlaceholder(),
                  ),
                ),
                16.height,
                ProfileMenuCard(
                  items: [
                    ProfileMenuItem(
                      title: 'Distance',
                      leading: SvgIcon(
                        Assets.icons.distance,
                        size: 32,
                        themeColor: true,
                      ),
                      trailing: Text(displayDistance),
                      onTap: () => context.push(AppRoutes.profileRunningStats),
                    ),
                    ProfileMenuItem(
                      title: 'Date',
                      leading: SvgIcon(
                        Assets.icons.calendar,
                        size: 32,
                        themeColor: true,
                      ),
                      trailing: Text(displayDate),
                      onTap: () => context.push(AppRoutes.profileRunHistory),
                    ),
                    ProfileMenuItem(
                      title: 'Duration',
                      leading: SvgIcon(
                        Assets.icons.clock,
                        size: 32,
                        themeColor: true,
                      ),
                      trailing: Text(displayDuration),
                      onTap: () =>
                          context.push(AppRoutes.profileCompletedEvents),
                    ),
                    ProfileMenuItem(
                      title: 'Linked to',
                      leading: SvgIcon(
                        Assets.icons.link,
                        size: 32,
                        themeColor: true,
                      ),
                      trailing: SizedBox(
                        width: 200,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Flexible(
                              child: Text(
                                displayActivity,
                                style: context.bodyMedium.copyWith(
                                  fontWeight: FontWeight.w600,
                                  color: context.scheme.primary,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            SvgIcon(
                              Assets.icons.chevronRight,
                              color: AppColors.primary,
                              size: 20,
                            ),
                          ],
                        ),
                      ),
                      onTap: () => context.push(AppRoutes.profileAchivements),
                    ),
                    ProfileMenuItem(
                      title: 'Status',
                      leading: SvgIcon(
                        Assets.icons.shieldCheckd,
                        size: 32,
                        themeColor: true,
                      ),
                      trailing: AppStatusBadge.fromHistoryStatus(status),
                      onTap: () => context.push(AppRoutes.profileAchivements),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          bottom: Utils.bottomPaddingInset(context),
        ),
        child: AppButton(
          prefixIcon: SvgIcon(Assets.icons.pool),
          variant: .primaryReverse,
          isDisabled: sub != null && !sub.isApproved,
          child: Text(
            sub != null && !sub.isApproved
                ? 'Under Moderation'
                : 'View Finisher Card',
          ),
          onPressed: () {
            if (sub != null && sub.isApproved) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Finisher card is ready for download'),
                ),
              );
            }
          },
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SvgIcon(
            Assets.icons.medal,
            size: 48,
            color: AppColors.primary,
          ),
          8.height,
          Text(
            'GPS Run Evidence',
            style: TextStyle(
              color: AppColors.subtleForeground,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
