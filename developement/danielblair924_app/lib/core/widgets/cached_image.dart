import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../gen/assets.gen.dart';
import 'shimmer_loading.dart';

class CachedImage extends StatelessWidget {
  const CachedImage({
    super.key,
    required this.imgUrl,
    this.height,
    this.width,
    this.fit,
    this.borderRadius,
    this.specificBorderRadius,
    this.errorWidget,
  });

  final String imgUrl;
  final double? height;
  final double? width;
  final BoxFit? fit;
  final double? borderRadius;
  final BorderRadiusGeometry? specificBorderRadius;
  final Widget? errorWidget;

  bool get _isSvg => imgUrl.toLowerCase().contains('.svg');

  BorderRadiusGeometry get _computedRadius =>
      specificBorderRadius ?? BorderRadius.circular(borderRadius ?? 0);

  @override
  Widget build(BuildContext context) {
    if (imgUrl.isEmpty) {
      return ClipRRect(
        borderRadius: _computedRadius,
        child: _buildErrorWidget(),
      );
    }

    return ClipRRect(
      borderRadius: _computedRadius,
      child: _isSvg ? _svgImage() : _cachedImage(),
    );
  }

  Widget _svgImage() {
    return SvgPicture.network(
      imgUrl,
      height: height,
      width: width,
      fit: fit ?? BoxFit.contain,
      placeholderBuilder: (_) => ShimmerBox(
        height: height,
        width: width,
        borderRadius: _computedRadius,
      ),
      // Gracefully handles network/parsing errors for SVG
      errorBuilder: (_, _, _) => _buildErrorWidget(),
    );
  }

  Widget _cachedImage() {
    return CachedNetworkImage(
      imageUrl: imgUrl,
      width: width,
      height: height,
      fit: fit ?? BoxFit.cover,
      placeholder: (_, _) => ShimmerBox(
        height: height,
        width: width,
        borderRadius: _computedRadius,
      ),
      errorWidget: (_, _, _) => _buildErrorWidget(),
    );
  }

  Widget _buildErrorWidget() {
    return errorWidget ??
        Image.asset(
          Assets.images.placeholderImage.path,
          height: height,
          width: width,
          fit: fit ?? BoxFit.cover,
        );
  }
}
