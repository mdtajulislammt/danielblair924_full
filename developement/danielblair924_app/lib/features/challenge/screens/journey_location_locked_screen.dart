import 'package:flutter/material.dart';

import '../../../core/theme/theme.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/widgets.dart';
import '../models/map_route_models.dart';
import '../widgets/city_header_title.dart';
import '../widgets/journey_location_hero_image.dart';

class JourneyLocationLockedScreen extends StatelessWidget {
  const JourneyLocationLockedScreen({super.key, required this.args});
  final MapLocation? args;

  @override
  Widget build(BuildContext context) {
    final title = (args?.label ?? 'PARIS').toUpperCase();
    final heroPath = args?.heroImagePath ?? Assets.temp.eifellTower.path;
    final distanceText = args?.distanceRequired ??
        '${args?.distanceRequiredKm?.toInt() ?? 500} km';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Coming Up'),
        backgroundColor: Colors.transparent,
      ),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        topColors: const <Color>[
          Color(0xFFD6D6D6),
          Color(0xFF424242),
          Colors.transparent,
        ],
        bottomColors: const <Color>[Colors.black, Colors.black, Colors.black],
        child: SafeArea(
          child: FullHeightScrollView(
            child: Column(
              spacing: 16,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    JourneyLocationHeroImage(
                      imagePath: heroPath,
                      isGrayscale: true,
                    ),
                    Positioned.fill(
                      child: Center(
                        child: AppIconBox(
                          borderColor: AppColors.subtleForeground,
                          size: 64,
                          padding: const EdgeInsets.all(10),
                          child: SvgIcon(
                            Assets.icons.lock,
                            size: 38,
                            color: AppColors.subtleForeground,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: AppStyles.paddingScreenHorizontal,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CityHeaderTitle(
                        title: title,
                        subtitle: 'Unlocks as community distance increases',
                      ),

                      const Divider(height: 32),

                      Text(
                        'DISTANCE REQUIRED',
                        style: context.bodyLarge.copyWith(
                          color: AppColors.subtleForeground,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),

                      const SizedBox(height: 6),

                      Text(
                        '$distanceText total',
                        style: context.headlineSmall.copyWith(
                          color: AppColors.subtleForeground,
                          fontWeight: FontWeight.w600,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),

                      if (args?.badgeName != null) ...[
                        const SizedBox(height: 24),
                        Text(
                          'UNLOCKABLE REWARD',
                          style: context.bodySmall.copyWith(
                            color: context.scheme.primary,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.1,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.military_tech_rounded,
                                color: AppColors.primary, size: 24),
                            const SizedBox(width: 8),
                            Text(
                              args!.badgeName!,
                              style: context.titleMedium,
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
