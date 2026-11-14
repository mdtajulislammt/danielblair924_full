import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:pinput/pinput.dart';

class OtpInputField extends StatelessWidget {
  const OtpInputField({
    super.key,
    this.onCompleted,
    this.onChanged,
    this.validator,
    this.controller,
    this.focusNode,
    this.length = 6,
    this.autofocus = false,
  });

  final ValueChanged<String>? onCompleted;
  final ValueChanged<String>? onChanged;
  final String? Function(String?)? validator;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final int length;
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    // Base box — mirrors InputDecorationTheme (fill + 8px radius + inputBorder).
    final defaultPinTheme = PinTheme(
      width: 56,
      height: 56,
      textStyle: context.titleLarge.copyWith(
        fontWeight: FontWeight.w600,
        color: AppColors.inputForeground,
      ),
      decoration: BoxDecoration(
        color: AppColors.input,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.inputBorder),
      ),
    );

    // Focused state — mirrors focusedBorder (ring, 1.5px).
    final focusedPinTheme = defaultPinTheme.copyWith(
      decoration: defaultPinTheme.decoration?.copyWith(
        border: Border.all(color: AppColors.ring, width: 1.5),
      ),
    );

    // Submitted / filled state — keep input fill, highlight border subtly.
    final submittedPinTheme = defaultPinTheme.copyWith(
      decoration: defaultPinTheme.decoration?.copyWith(
        border: Border.all(color: AppColors.inputBorder),
      ),
    );

    // Following (empty, unfocused) state.
    final followingPinTheme = defaultPinTheme.copyWith(
      decoration: defaultPinTheme.decoration?.copyWith(
        border: Border.all(color: AppColors.inputBorder),
      ),
    );

    // Error state — mirrors errorBorder / focusedErrorBorder.
    final errorPinTheme = defaultPinTheme.copyWith(
      textStyle: defaultPinTheme.textStyle?.copyWith(
        color: AppColors.errorForeground,
      ),
      decoration: defaultPinTheme.decoration?.copyWith(
        border: Border.all(color: AppColors.error),
      ),
    );

    return Pinput(
      length: length,
      controller: controller,
      focusNode: focusNode,
      autofocus: autofocus,
      validator: validator,
      onChanged: onChanged,
      onCompleted: onCompleted,
      keyboardType: TextInputType.number,
      defaultPinTheme: defaultPinTheme,
      focusedPinTheme: focusedPinTheme,
      submittedPinTheme: submittedPinTheme,
      followingPinTheme: followingPinTheme,
      errorPinTheme: errorPinTheme,
      showCursor: true,
      cursor: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            width: 2,
            height: 22,
            color: AppColors.primary,
          ),
        ],
      ),
      separatorBuilder: (index) => const SizedBox(width: 8),
      errorTextStyle: context.bodySmall.copyWith(color: AppColors.error),
    );
  }
}
