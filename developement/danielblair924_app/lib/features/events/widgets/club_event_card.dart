import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../models/event_model.dart';

class ClubEventCard extends StatelessWidget {
  final EventItemModel event;
  final VoidCallback onJoin;
  final bool isJoining;

  const ClubEventCard({
    super.key,
    required this.event,
    required this.onJoin,
    this.isJoining = false,
  });

  Color _getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return AppColors.primary;
      case 'UPCOMING':
        return const Color(0xFF3B82F6);
      case 'COMPLETED':
        return AppColors.subtleForeground;
      default:
        return AppColors.outline;
    }
  }

  void _showEventDetailsModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xFF1E2117),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
          ),
          padding: EdgeInsets.fromLTRB(20.w, 16.h, 20.w, 32.h),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 48.w,
                  height: 4.h,
                  margin: EdgeInsets.only(bottom: 16.h),
                  decoration: BoxDecoration(
                    color: AppColors.outline,
                    borderRadius: BorderRadius.circular(2.0),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      event.title,
                      style: context.titleLarge.copyWith(fontWeight: FontWeight.bold),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(event.status).withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: _getStatusColor(event.status)),
                    ),
                    child: Text(
                      event.status,
                      style: context.labelSmall.copyWith(
                        color: _getStatusColor(event.status),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              8.verticalSpace,
              Text(
                event.formattedDate,
                style: context.bodyMedium.copyWith(color: AppColors.subtleForeground),
              ),
              16.verticalSpace,
              if (event.description != null && event.description!.isNotEmpty) ...[
                Text(
                  event.description!,
                  style: context.bodyMedium,
                ),
                16.verticalSpace,
              ],
              Text(
                'REQUIREMENTS & CHECKLIST',
                style: context.labelMedium.copyWith(
                  color: context.scheme.primary,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1,
                ),
              ),
              10.verticalSpace,
              _buildRequirementRow(
                context,
                Icons.straighten_rounded,
                'Complete ${event.distanceType ?? "5KM"} distance',
                event.requirements?.completeDistance ?? true,
              ),
              _buildRequirementRow(
                context,
                Icons.photo_camera_rounded,
                'Upload running screenshot / proof',
                event.requirements?.uploadRunningEvidence ?? true,
              ),
              _buildRequirementRow(
                context,
                Icons.videocam_rounded,
                'Post on TikTok with ${event.requirements?.specificHashtag ?? "#FirstMileClub"}',
                event.requirements?.postOnTikTok ?? true,
              ),
              if (event.requirements?.tiktokCaptionInstructions != null) ...[
                8.verticalSpace,
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline, size: 18, color: AppColors.primary),
                      10.horizontalSpace,
                      Expanded(
                        child: Text(
                          event.requirements!.tiktokCaptionInstructions!,
                          style: context.bodySmall,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              24.verticalSpace,
              if (event.isJoined)
                AppButton(
                  width: double.infinity,
                  child: const Text('SUBMIT RUN FOR THIS EVENT'),
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    context.push(AppRoutes.submitRunPrompt);
                  },
                )
              else
                AppButton(
                  width: double.infinity,
                  onPressed: isJoining
                      ? null
                      : () {
                          Navigator.of(ctx).pop();
                          onJoin();
                        },
                  child: isJoining
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('JOIN EVENT NOW'),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildRequirementRow(
    BuildContext context,
    IconData icon,
    String label,
    bool isRequired,
  ) {
    if (!isRequired) return const SizedBox.shrink();
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4.h),
      child: Row(
        children: [
          Icon(Icons.check_circle, size: 18, color: context.scheme.primary),
          10.horizontalSpace,
          Expanded(
            child: Text(label, style: context.bodySmall),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      width: double.infinity,
      onTap: () => _showEventDetailsModal(context),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AppIconBox(
                child: SvgIcon(Assets.icons.calendar),
              ),
              12.horizontalSpace,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      event.title,
                      style: context.titleMedium.copyWith(fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    4.verticalSpace,
                    Text(
                      event.formattedDate,
                      style: context.bodySmall.copyWith(color: AppColors.subtleForeground),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: _getStatusColor(event.status).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _getStatusColor(event.status)),
                ),
                child: Text(
                  event.status,
                  style: context.labelSmall.copyWith(
                    color: _getStatusColor(event.status),
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),

          14.verticalSpace,
          const Divider(height: 1, color: AppColors.border),
          12.verticalSpace,

          // Stats / Info Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      event.distanceType ?? '5KM',
                      style: context.labelSmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  8.horizontalSpace,
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      event.category,
                      style: context.labelSmall.copyWith(
                        color: AppColors.subtleForeground,
                      ),
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  const Icon(Icons.people_outline, size: 16, color: AppColors.subtleForeground),
                  4.horizontalSpace,
                  Text(
                    '${event.registeredCount} joined',
                    style: context.bodySmall.copyWith(color: AppColors.subtleForeground),
                  ),
                ],
              ),
            ],
          ),

          16.verticalSpace,

          // Bottom Action
          if (event.isJoined)
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.primary),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.check_circle_rounded, size: 16, color: AppColors.primary),
                        6.horizontalSpace,
                        Text(
                          'REGISTERED',
                          style: context.labelMedium.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                10.horizontalSpace,
                AppButton(
                  size: AppButtonSize.sm,
                  onPressed: () => context.push(AppRoutes.submitRunPrompt),
                  child: const Text('SUBMIT RUN'),
                ),
              ],
            )
          else
            AppButton(
              width: double.infinity,
              size: AppButtonSize.sm,
              onPressed: isJoining ? null : onJoin,
              child: isJoining
                  ? const SizedBox(
                      height: 18,
                      width: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('JOIN EVENT'),
            ),
        ],
      ),
    );
  }
}

