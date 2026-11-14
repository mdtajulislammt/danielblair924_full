import 'dart:io';

import 'package:first_mile_club/core/theme/app_colors.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'cached_image.dart';

// border: .all(width: 1, color: context.scheme.primary),
class Avatar extends StatelessWidget {
  const Avatar({
    super.key,
    this.imageUrl,
    this.localImagePath,
    this.name,
    this.radius,
    this.backgroundColor,
    this.textColor,
    this.textStyle,
    this.border,
    this.onTap,
  });

  /// Remote URL (HTTP/HTTPS) or SVG Network URL
  final String? imageUrl;

  /// Local asset path (e.g. 'assets/images/user.png') or File path (e.g. '/path/to/file.jpg')
  final String? localImagePath;

  /// Full name used to generate fallback initials (e.g., "Hasan Mahmud" -> "HM")
  final String? name;

  /// Diameter = radius * 2. Defaults to 24.r (48x48 total size)
  final double? radius;

  /// Background color for the fallback initials container
  final Color? backgroundColor;

  /// Text color for the fallback initials
  final Color? textColor;

  /// Custom TextStyle for initials (overrides [textColor] if specified)
  final TextStyle? textStyle;

  /// Optional border surrounding the entire avatar
  final BoxBorder? border;

  /// Callback when avatar is tapped
  final VoidCallback? onTap;

  /// Extracts up to 2 uppercase initials from a name string
  String get _initials {
    if (name == null || name!.trim().isEmpty) return '?';
    final parts = name!.trim().split(RegExp(r'\s+'));
    if (parts.length == 1) {
      return parts.first.substring(0, 1).toUpperCase();
    }
    return '${parts.first.substring(0, 1)}${parts.last.substring(0, 1)}'
        .toUpperCase();
  }

  bool get _hasNetworkImage => imageUrl != null && imageUrl!.trim().isNotEmpty;

  bool get _hasLocalImage =>
      localImagePath != null && localImagePath!.trim().isNotEmpty;

  @override
  Widget build(BuildContext context) {
    final effectiveRadius = radius ?? 24.r;
    final effectiveBorder =
        border ?? Border.all(width: 2, color: context.scheme.primary);
    final size = effectiveRadius * 2;

    final avatarContent = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: effectiveBorder,
      ),
      child: ClipOval(child: _buildAvatarContent(size, effectiveRadius)),
    );

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: avatarContent);
    }

    return avatarContent;
  }

  Widget _buildAvatarContent(double size, double radius) {
    // 1. Priority: Network Image (Uses CachedImage with Initials Fallback)
    if (_hasNetworkImage) {
      return CachedImage(
        imgUrl: imageUrl!,
        width: size,
        height: size,
        fit: BoxFit.cover,
        borderRadius: radius,
        errorWidget: _buildInitialsFallback(size),
      );
    }

    // 2. Priority: Local Image (Asset or File)
    if (_hasLocalImage) {
      return _buildLocalImage(size);
    }

    // 3. Fallback: Show User Initials
    return _buildInitialsFallback(size);
  }

  Widget _buildLocalImage(double size) {
    final path = localImagePath!;

    // Check if it's an asset or a local File
    final isAsset = path.startsWith('assets/') || path.startsWith('lib/');

    if (isAsset) {
      return Image.asset(
        path,
        width: size,
        height: size,
        fit: BoxFit.cover,
        errorBuilder: (_, _, _) => _buildInitialsFallback(size),
      );
    }

    // Local File Path
    return Image.file(
      File(path),
      width: size,
      height: size,
      fit: BoxFit.cover,
      errorBuilder: (_, _, _) => _buildInitialsFallback(size),
    );
  }

  Widget _buildInitialsFallback(double size) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      color: backgroundColor ?? AppColors.primary.withAlpha(30),
      child: Text(
        _initials,
        style:
            textStyle ??
            TextStyle(
              color: textColor ?? AppColors.primary,
              fontSize: size * 0.4, // Auto-scales text with radius
              fontWeight: FontWeight.bold,
            ),
      ),
    );
  }
}
