import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class TermsAndPrivacyCheckbox extends StatefulWidget {
  const TermsAndPrivacyCheckbox({
    required this.value,
    required this.onChanged,
    required this.onTermsTap,
    required this.onPrivacyTap,
    super.key,
  });

  final bool value;
  final ValueChanged<bool?> onChanged;
  final VoidCallback onTermsTap;
  final VoidCallback onPrivacyTap;

  @override
  State<TermsAndPrivacyCheckbox> createState() =>
      _TermsAndPrivacyCheckboxState();
}

class _TermsAndPrivacyCheckboxState extends State<TermsAndPrivacyCheckbox> {
  late final TapGestureRecognizer _termsRecognizer;
  late final TapGestureRecognizer _privacyRecognizer;

  @override
  void initState() {
    super.initState();
    _termsRecognizer = TapGestureRecognizer()..onTap = widget.onTermsTap;
    _privacyRecognizer = TapGestureRecognizer()..onTap = widget.onPrivacyTap;
  }

  @override
  void dispose() {
    _termsRecognizer.dispose();
    _privacyRecognizer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const limeColor = Color(0xFF8CE600); // Matching lime green accent color

    return Row(
      crossAxisAlignment: .center,
      spacing: 6,
      children: <Widget>[
        // Custom Styled Checkbox
        SizedBox(
          height: 24.0,
          width: 24.0,
          child: Checkbox(
            value: widget.value,
            onChanged: widget.onChanged,
            activeColor: limeColor,
            checkColor: Colors.black,
            side: const BorderSide(color: Colors.white54, width: 1.5),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(4.0),
            ),
          ),
        ),

        // Rich Text with Clickable Spans
        Expanded(
          child: RichText(
            text: TextSpan(
              style: const TextStyle(
                fontSize: 14.0,
                color: Colors.white,
                letterSpacing: 0.1,
              ),
              children: <TextSpan>[
                const TextSpan(text: 'I agree to the '),
                TextSpan(
                  text: 'Terms of Service',
                  recognizer: _termsRecognizer,
                  style: const TextStyle(
                    color: limeColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const TextSpan(text: ' and '),
                TextSpan(
                  text: 'Privacy Policy',
                  recognizer: _privacyRecognizer,
                  style: const TextStyle(
                    color: limeColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
