import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

export 'system/log.dart';

class Utils {
  static double bottomPaddingInset(BuildContext context) {
    final bottomInset = MediaQuery.paddingOf(context).bottom;
    final isAndroid =
        !kIsWeb && defaultTargetPlatform == TargetPlatform.android;
    return bottomInset + (isAndroid ? 10 : 0);
  }
}
