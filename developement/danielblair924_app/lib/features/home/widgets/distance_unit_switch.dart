import 'package:first_mile_club/core/theme/extensions/app_theme_extensions.dart';
import 'package:flutter/material.dart';

enum DistanceUnit { km, miles }

class DistanceUnitSwitch extends StatelessWidget {
  const DistanceUnitSwitch({
    required this.value,
    required this.onChanged,
    super.key,
    this.width = 132.0,
    this.height = 44.0,
    this.activeColor = const Color(0xFFA3FF00), // Lime green from image
    this.backgroundColor = const Color(0xFF141714), // Dark container background
    this.borderColor = const Color(0xFF232823),
  });

  final DistanceUnit value;
  final ValueChanged<DistanceUnit> onChanged;
  final double width;
  final double height;
  final Color activeColor;
  final Color backgroundColor;
  final Color borderColor;

  @override
  Widget build(BuildContext context) {
    final isKm = value == DistanceUnit.km;

    return GestureDetector(
      onTap: () {
        onChanged(isKm ? DistanceUnit.miles : DistanceUnit.km);
      },
      child: Container(
        width: width,
        height: height,
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: borderColor, width: 1.5),
        ),
        child: Stack(
          children: [
            // Sliding Active Background Thumb
            AnimatedAlign(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              alignment: isKm ? Alignment.centerLeft : Alignment.centerRight,
              child: FractionallySizedBox(
                widthFactor: 0.5,
                heightFactor: 1.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: activeColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ),

            // Labels Row
            Row(
              children: [
                // KM Label
                Expanded(
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: context.bodyMedium.copyWith(
                        fontWeight: FontWeight.bold,
                        color: isKm ? Colors.black : Colors.white,
                      ),
                      child: const Text('KM'),
                    ),
                  ),
                ),

                // Miles Label
                Expanded(
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: context.bodyMedium.copyWith(
                        fontWeight: FontWeight.bold,
                        color: !isKm ? Colors.black : Colors.white,
                      ),
                      child: const Text('Miles'),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
