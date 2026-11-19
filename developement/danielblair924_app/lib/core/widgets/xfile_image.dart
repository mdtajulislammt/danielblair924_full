import 'dart:typed_data';

import 'package:cross_file/cross_file.dart';
import 'package:flutter/material.dart';

/// Displays a picked image on mobile and web without `dart:io`.
class XFileImage extends StatefulWidget {
  const XFileImage({
    super.key,
    required this.file,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
  });

  final XFile file;
  final BoxFit fit;
  final double? width;
  final double? height;

  @override
  State<XFileImage> createState() => _XFileImageState();
}

class _XFileImageState extends State<XFileImage> {
  late Future<Uint8List> _bytes;

  @override
  void initState() {
    super.initState();
    _bytes = widget.file.readAsBytes();
  }

  @override
  void didUpdateWidget(XFileImage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.file.path != widget.file.path ||
        oldWidget.file.name != widget.file.name) {
      _bytes = widget.file.readAsBytes();
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Uint8List>(
      future: _bytes,
      builder: (context, snapshot) {
        final bytes = snapshot.data;
        if (bytes == null || bytes.isEmpty) {
          return SizedBox(width: widget.width, height: widget.height);
        }
        return Image.memory(
          bytes,
          fit: widget.fit,
          width: widget.width,
          height: widget.height,
        );
      },
    );
  }
}
