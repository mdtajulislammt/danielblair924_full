import 'package:flutter/material.dart';

class AppFormField extends StatelessWidget {
  const AppFormField({
    super.key,
    required this.label,
    this.hintText,
    this.prefixIcon,
    this.validator,
    this.controller,
    this.sufixIcon,
    this.obscureText = false,
    this.onChanged,
  });

  AppFormField.password({
    super.key,
    required this.label,
    required this.obscureText,
    this.hintText,
    this.prefixIcon,
    this.onChanged,
    this.validator,
    this.controller,
    VoidCallback? onToggleVisibility,
  }) : sufixIcon = onToggleVisibility != null
           ? _PasswordSuffixIcon(
               obscureText: obscureText,
               onToggle: onToggleVisibility,
             )
           : null;

  final String label;
  final String? hintText;
  final Widget? prefixIcon;
  final Widget? sufixIcon;
  final bool obscureText;
  final void Function(String)? onChanged;
  final String? Function(String?)? validator;
  final TextEditingController? controller;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 8,
      children: [
        Text(label, style: Theme.of(context).textTheme.labelLarge),
        TextFormField(
          onChanged: onChanged,
          obscureText: obscureText,
          controller: controller,
          decoration: InputDecoration(
            hintText: hintText,
            prefixIcon: prefixIcon != null
                ? Padding(
                    padding: const EdgeInsetsDirectional.only(
                      start: 12.0,
                      end: 4.0,
                    ),
                    child: prefixIcon,
                  )
                : null,
            prefixIconConstraints: prefixIcon != null ? BoxConstraints() : null,
            suffixIconConstraints: sufixIcon != null ? BoxConstraints() : null,
            suffixIcon: sufixIcon != null
                ? Padding(
                    padding: const EdgeInsetsDirectional.only(
                      end: 12.0,
                      start: 4.0,
                    ),
                    child: sufixIcon,
                  )
                : null,
          ),
          validator: validator,
        ),
      ],
    );
  }
}

class _PasswordSuffixIcon extends StatelessWidget {
  const _PasswordSuffixIcon({
    required this.obscureText,
    required this.onToggle,
  });

  final bool obscureText;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(
        obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined,
        color: Colors.white70,
      ),
      onPressed: onToggle,
    );
  }
}
