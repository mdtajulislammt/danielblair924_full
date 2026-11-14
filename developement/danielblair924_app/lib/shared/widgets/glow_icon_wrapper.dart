import 'package:flutter/material.dart';

class GlowIconWrapper extends StatelessWidget {
  const GlowIconWrapper({
    required this.child,
    this.size = 100.0,
    this.margin,
    this.glowColor = const Color(0xFF415E05),
    this.shadowColor = const Color(0xFF000000),
    super.key,
  });

  final Widget child;
  final double size;
  final EdgeInsetsGeometry? margin;
  final Color glowColor;
  final Color shadowColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      margin: margin,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: <BoxShadow>[
          BoxShadow(color: glowColor, blurRadius: 20.0, spreadRadius: 31.0),
          BoxShadow(color: shadowColor, blurRadius: 46.0, spreadRadius: 9.0),
        ],
      ),
      child: child,
    );
  }
}
