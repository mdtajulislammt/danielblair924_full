import 'package:flutter/widgets.dart';

Widget buildLocalFileImage({
  required String path,
  double? width,
  double? height,
  BoxFit fit = BoxFit.cover,
  ImageErrorWidgetBuilder? errorBuilder,
}) {
  return Image.network(
    path,
    width: width,
    height: height,
    fit: fit,
    errorBuilder: errorBuilder,
  );
}
