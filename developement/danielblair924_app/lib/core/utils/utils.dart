import 'dart:io';

import 'package:flutter/material.dart';

export 'system/log.dart';

class Utils {
  static double bottomPaddingInset(BuildContext context) {
    final bottomInset = MediaQuery.paddingOf(context).bottom;
    return bottomInset + (Platform.isAndroid ? 10 : 0);
  }
}
