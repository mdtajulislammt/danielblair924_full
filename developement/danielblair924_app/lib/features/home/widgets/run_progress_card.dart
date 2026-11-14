import 'package:first_mile_club/core/extensions/extensions.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:flutter/material.dart';

class RunProgressCard extends StatelessWidget {
  const RunProgressCard({
    super.key,
    this.backgroudImage,
    this.headerTitle,
    this.footerTitle,
    this.backgroundColor = AppColors.card2,
    this.cityName = 'ROME',
    this.progressValue = 0.7,
    this.completedKmText = '342',
    this.targetKmText = '500',
    this.nextStopLabel = 'km to next stop',
  });

  final String? backgroudImage;
  final String? headerTitle;
  final String? footerTitle;
  final Color backgroundColor;
  final String cityName;
  final double progressValue;
  final String completedKmText;
  final String targetKmText;
  final String nextStopLabel;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      backgroundColor: backgroundColor,
      padding: .zero,
      child: Container(
        decoration: BoxDecoration(
          image: backgroudImage == null
              ? null
              : DecorationImage(
                  image: AssetImage(backgroudImage!),
                  fit: BoxFit.cover,
                ),
        ),
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 6,
          children: [
            if (headerTitle != null)
              Text(
                headerTitle!,
                style: context.labelSmall.copyWith(
                  color: context.scheme.primary,
                ),
              ),

            Text('CURRENTLY IN:', style: context.bodyMedium),
            FittedBox(
              child: Text(
                cityName.toUpperCase(),
                style: context.displayMedium.copyWith(fontWeight: .w900),
              ),
            ),
            6.height,

            LinearProgressIndicator(
              value: progressValue.clamp(0.0, 1.0),
              backgroundColor: AppColors.outline,
              minHeight: 10,
              borderRadius: BorderRadius.circular(4.0),
            ),

            RichText(
              text: TextSpan(
                style: TextStyle(
                  fontSize: 14.0,
                  color: context.scheme.onTertiary,
                  letterSpacing: 0.1,
                ),
                children: <TextSpan>[
                  TextSpan(
                    text: '$completedKmText / $targetKmText',
                    style: const TextStyle(
                      color: AppColors.foreground,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  TextSpan(text: ' $nextStopLabel'),
                ],
              ),
            ),

            if (footerTitle != null)
              Text(
                footerTitle!,
                style: context.titleSmall.copyWith(
                  color: context.scheme.primary,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
