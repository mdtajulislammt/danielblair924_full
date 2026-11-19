import 'package:flutter/widgets.dart';

import 'local_file_image_stub.dart'
    if (dart.library.io) 'local_file_image_io.dart' as local_file_image_impl;

/// Renders a device file path. Mobile uses `dart:io`; web falls back to a
/// network/blob URL so the library can be compiled for the web.
class LocalFileImage extends StatelessWidget {
  const LocalFileImage({
    super.key,
    required this.path,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.errorBuilder,
  });

  final String path;
  final double? width;
  final double? height;
  final BoxFit fit;
  final ImageErrorWidgetBuilder? errorBuilder;

  @override
  Widget build(BuildContext context) {
    return local_file_image_impl.buildLocalFileImage(
      path: path,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: errorBuilder,
    );
  }
}
