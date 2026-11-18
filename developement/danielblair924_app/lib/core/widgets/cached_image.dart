import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../gen/assets.gen.dart';
import '../constants/app_config.dart';
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

  String get _resolvedUrl {
    final trimmed = imgUrl.trim();
    if (trimmed.isEmpty) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    // Make relative URL absolute using backend server base URL
    try {
      final base = AppConfig.serverBaseUrl.replaceAll(RegExp(r'/api/?$'), '');
      final cleanBase = base.endsWith('/') ? base.substring(0, base.length - 1) : base;
      final cleanPath = trimmed.startsWith('/') ? trimmed : '/$trimmed';
      return '$cleanBase$cleanPath';
    } catch (_) {
      return trimmed;
    }
  }

  bool get _isSvg => _resolvedUrl.toLowerCase().contains('.svg');

  BorderRadiusGeometry get _computedRadius =>
      specificBorderRadius ?? BorderRadius.circular(borderRadius ?? 0);

  @override
  Widget build(BuildContext context) {
    final finalUrl = _resolvedUrl;
    if (finalUrl.isEmpty) {
      return ClipRRect(
        borderRadius: _computedRadius,
        child: _buildErrorWidget(),
      );
    }

    return ClipRRect(
      borderRadius: _computedRadius,
      child: _isSvg ? _svgImage(finalUrl) : _cachedImage(finalUrl),
    );
  }

  Widget _svgImage(String url) {
    return SvgPicture.network(
      url,
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

  Widget _cachedImage(String url) {
    return CachedNetworkImage(
      imageUrl: url,
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
