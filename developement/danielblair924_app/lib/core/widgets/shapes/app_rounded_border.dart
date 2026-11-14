import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';

class AppRoundedBorder extends RoundedRectangleBorder {
  AppRoundedBorder({
    Color color = AppColors.inputBorder,
    double width = AppStyles.cardBorderWidth,
    double radius = AppStyles.cardBorderRadius,
  }) : super(
         side: BorderSide(color: color, width: width),
         borderRadius: BorderRadius.all(Radius.circular(radius)),
       );
}
