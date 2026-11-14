import 'package:flutter/material.dart';

class SlidingTextBanner extends StatefulWidget {
  const SlidingTextBanner({
    required this.items,
    this.height = 44.0,
    this.backgroundColor = const Color(0xFF415E05),
    this.textStyle = const TextStyle(
      fontSize: 14.0,
      fontWeight: FontWeight.w800,
      fontStyle: FontStyle.italic,
      color: Colors.black,
      letterSpacing: 1.2,
    ),
    this.separator = ' • ',
    this.velocity = 40.0, // pixels per second
    this.fadeWidth = 32.0, // width of the edge blur/fade
    super.key,
  });

  final List<String> items;
  final double height;
  final Color backgroundColor;
  final TextStyle textStyle;
  final String separator;
  final double velocity;
  final double fadeWidth;

  @override
  State<SlidingTextBanner> createState() => _SlidingTextBannerState();
}

class _SlidingTextBannerState extends State<SlidingTextBanner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Format full repeated string
    final String textContent =
        widget.items.join(widget.separator) + widget.separator;

    return Container(
      height: widget.height,
      color: widget.backgroundColor,
      width: double.infinity,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final double fadeFraction = (widget.fadeWidth / constraints.maxWidth)
              .clamp(0.0, 0.2);

          return ShaderMask(
            shaderCallback: (Rect bounds) {
              return LinearGradient(
                colors: const <Color>[
                  Colors.transparent,
                  Colors.black,
                  Colors.black,
                  Colors.transparent,
                ],
                stops: <double>[0.0, fadeFraction, 1.0 - fadeFraction, 1.0],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ).createShader(bounds);
            },
            blendMode: BlendMode.dstIn,
            child: AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return OverflowBox(
                  maxWidth: double.infinity,
                  alignment: Alignment.centerLeft,
                  child: Transform.translate(
                    offset: Offset(
                      -_controller.value * 300,
                      0,
                    ), // Adjust scroll distance
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: List.generate(
                        10, // Duplicate list items to create seamless loop
                        (index) => Text(textContent, style: widget.textStyle),
                      ),
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
