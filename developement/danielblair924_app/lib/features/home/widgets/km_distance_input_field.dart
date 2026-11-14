import 'package:first_mile_club/features/home/home.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class KmDistanceInputField extends StatelessWidget {
  const KmDistanceInputField({
    required this.controller,
    required this.unit,
    this.onChanged,
    required this.onUnitChanged,
    super.key,
    this.maxKm = 100000.0,
  });

  final double maxKm;
  final ValueChanged<double>? onChanged;
  final ValueChanged<DistanceUnit> onUnitChanged;
  final TextEditingController controller;
  final DistanceUnit unit;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [
            FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}')),
          ],
          decoration: InputDecoration(
            hintText: '0.00',
            suffixIcon: Padding(
              padding: const EdgeInsets.all(6.0),
              child: DistanceUnitSwitch(value: unit, onChanged: onUnitChanged),
            ),
          ),
          onChanged: (text) {
            final val = double.tryParse(text) ?? 0.0;
            if (val <= maxKm) {
              onChanged?.call(val);
            }
          },
        ),
      ],
    );
  }
}
