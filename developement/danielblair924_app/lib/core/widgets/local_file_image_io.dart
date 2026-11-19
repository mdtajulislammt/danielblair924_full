import 'dart:io';

import 'package:flutter/widgets.dart';

Widget buildLocalFileImage({
  required String path,
  double? width,
  double? height,
  BoxFit fit = BoxFit.cover,
  ImageErrorWidgetBuilder? errorBuilder,
}) {
  if (path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('blob:')) {
    return Image.network(
      path,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: errorBuilder,
    );
  }

  return Image.file(
    File(path),
    width: width,
    height: height,
    fit: fit,
    errorBuilder: errorBuilder,
  );
}
