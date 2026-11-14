import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../core/router/router.dart';
import '../../../core/theme/theme.dart';
import '../../../core/utils/utils.dart';
import '../../../core/widgets/widgets.dart';
import '../../../gen/assets.gen.dart';
import '../../../shared/widgets/app_gradient_background.dart';
import '../challenge.dart';

class JourneyFullMapScreen extends ConsumerStatefulWidget {
  const JourneyFullMapScreen({super.key});

  @override
  ConsumerState<JourneyFullMapScreen> createState() => _JourneyFullMapScreenState();
}

class _JourneyFullMapScreenState extends ConsumerState<JourneyFullMapScreen> {
  late final MapController _mapController = MapController();

  void _zoomBy(int delta) {
    final camera = _mapController.camera;
    final zoom = (camera.zoom + delta).clamp(1.0, 18.0).toDouble();
    _mapController.move(camera.center, zoom);
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.sizeOf(context).height;
    final challengeState = ref.watch(challengeProvider);

    final currentMilestone = challengeState.currentMilestone;
    final nextMilestone = challengeState.nextMilestone;

    final initialCenter = currentMilestone?.coordinates ??
        (challengeState.routes.isNotEmpty && challengeState.routes.first.points.isNotEmpty
            ? challengeState.routes.first.points.first.point
            : const LatLng(41.9028, 12.4964));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Run Around the World'),
        backgroundColor: Colors.transparent,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => ref.read(challengeProvider.notifier).fetchChallengeData(),
          ),
        ],
      ),
      extendBody: true,
      extendBodyBehindAppBar: true,
      body: AppGradientBackground(
        child: SafeArea(
          child: Stack(
            children: [
              ReusableWorldMap(
                initialCenter: initialCenter,
                height: height,
                mapController: _mapController,
                routes: challengeState.routes,
                onLocationTap: (MapLocation? location) {
                  if (location == null) return;
                  if (location.status == 'Locked') {
                    context.push(
                      AppRoutes.journeyLocationLocked,
                      extra: location,
                    );
                  } else {
                    context.push(
                      AppRoutes.journeyLocationDetail,
                      extra: location,
                    );
                  }
                },
              ),

              Positioned(
                bottom: 20,
                right: 0,
                child: Column(
                  children: [
                    IconButton(
                      onPressed: () => _zoomBy(1),
                      icon: AppIconBox(
                        backgroundColor: const Color(0xff2A3219),
                        child: Icon(
                          Icons.add,
                          color: AppColors.subtleForeground,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () => _zoomBy(-1),
                      icon: AppIconBox(
                        backgroundColor: const Color(0xff2A3219),
                        child: Icon(
                          Icons.remove,
                          color: AppColors.subtleForeground,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),

      bottomNavigationBar: Padding(
        padding: EdgeInsets.only(
          left: AppStyles.paddingScreenHorizontal,
          right: AppStyles.paddingScreenHorizontal,
          bottom: Utils.bottomPaddingInset(context),
        ),
        child: AppCard(
          onTap: () {
            if (currentMilestone != null) {
              _mapController.move(currentMilestone.coordinates, 4.0);
            }
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                spacing: 12,
                children: [
                  AppIconBox(child: SvgIcon(Assets.icons.location04)),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        RichText(
                          text: TextSpan(
                            style: context.titleMedium,
                            children: <TextSpan>[
                              TextSpan(
                                text: '${challengeState.currentCollectiveKm.toInt()}',
                              ),
                              TextSpan(
                                text: ' / ${nextMilestone?.distanceRequiredKm.toInt() ?? (challengeState.activeChallenge?.targetProgress.toInt() ?? 40075)} km',
                                style: context.bodySmall,
                              ),
                            ],
                          ),
                        ),
                        Text(
                          'to next stop: ${nextMilestone?.destination ?? "Global Finish"}',
                          style: context.bodySmall,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),

                  AppIconBox(child: SvgIcon(Assets.icons.chevronUp)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
