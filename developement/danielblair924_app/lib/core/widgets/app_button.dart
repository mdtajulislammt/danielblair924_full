import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Text Style Presets for Button Sizes
const _lgButtonTextStyle = TextStyle(
  fontSize: 16.0,
  fontWeight: FontWeight.w700,
  letterSpacing: 1.2,
);

const _mdButtonTextStyle = TextStyle(
  fontSize: 14.0,
  fontWeight: FontWeight.w700,
  letterSpacing: 1.2,
);

const _smButtonTextStyle = TextStyle(
  fontSize: 12.0,
  fontWeight: FontWeight.w600,
  letterSpacing: 1.0,
);

/// Button Size Options using enum constructor
enum AppButtonSize {
  sm(
    height: 36.0,
    padding: EdgeInsets.symmetric(horizontal: 10.0),
    spacing: 6.0,
    textStyle: _smButtonTextStyle,
  ),
  md(
    height: 44.0,
    padding: EdgeInsets.symmetric(horizontal: 12.0),
    spacing: 8.0,
    textStyle: _mdButtonTextStyle,
  ),
  lg(
    height: 52.0,
    padding: EdgeInsets.symmetric(horizontal: 16.0),
    spacing: 8.0,
    textStyle: _lgButtonTextStyle,
  );

  const AppButtonSize({
    required this.height,
    required this.padding,
    required this.spacing,
    required this.textStyle,
  });

  final double height;
  final EdgeInsetsGeometry padding;
  final double spacing;
  final TextStyle textStyle;
}

/// Theme/Color Data
enum AppButtonVariant {
  primary,
  destructive,
  primaryReverse,
  muted;

  /// Resolves theme colors dynamically from BuildContext
  ButtonColors resolveColors(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    switch (this) {
      case AppButtonVariant.primary:
        return ButtonColors(
          background: colorScheme.primary,
          foreground: colorScheme.onPrimary,
          border: colorScheme.primary,

          disabledBackground: colorScheme.surfaceContainerHighest.withValues(alpha: 0.39),
          disabledForeground: colorScheme.primary.withValues(alpha: 0.50),
          disabledBorder: colorScheme.primary.withValues(alpha: 0.39),
        );
      case AppButtonVariant.destructive:
        return ButtonColors(
          background: colorScheme.error,
          foreground: colorScheme.onError,
          border: colorScheme.error,
        );
      case AppButtonVariant.muted:
        return ButtonColors(
          background: colorScheme.onTertiary,
          foreground: colorScheme.tertiary,
          border: colorScheme.onTertiary,
        );
      case AppButtonVariant.primaryReverse:
        return ButtonColors(
          background: colorScheme.surfaceContainerHighest,
          foreground: colorScheme.primary,
          border: colorScheme.primary,
        );
    }
  }
}

@immutable
class ButtonColors {
  const ButtonColors({
    required this.background,
    required this.foreground,
    required this.border,
    this._disabledBackground,
    this._disabledForeground,
    this._disabledBorder,
  });

  final Color background;
  final Color foreground;
  final Color border;

  final Color? _disabledBackground;
  final Color? _disabledForeground;
  final Color? _disabledBorder;

  Color get disabledBackground =>
      _disabledBackground ?? background.withValues(alpha: 0.39);

  Color get disabledForeground =>
      _disabledForeground ?? foreground.withValues(alpha: 0.50);

  Color get disabledBorder => _disabledBorder ?? border.withValues(alpha: 0.39);
}

enum _AppButtonType { primary, outlined, text }

class AppButton extends StatelessWidget {
  // Base private constructor holding all defaults
  const AppButton._({
    required this.child,
    required this.onPressed,
    required this._type,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.lg,
    this.isLoading = false,
    this.isDisabled = false,
    this.enableHapticFeedback = false,
    this.prefixIcon,
    this.suffixIcon,
    this.width,
    this.height,
    this.borderRadius = 100.0,
    this.padding,
    this.spacing,
    this.textStyle,
    this.side,
    this.backgroundColor,
    super.key,
  });

  /// Filled / Primary Button Constructor
  const AppButton({
    required Widget child,
    required VoidCallback? onPressed,
    AppButtonVariant variant = AppButtonVariant.primary,
    AppButtonSize size = AppButtonSize.lg,
    bool isLoading = false,
    bool isDisabled = false,
    bool enableHapticFeedback = false,
    Widget? prefixIcon,
    Widget? suffixIcon,
    double? width,
    double? height,
    double borderRadius = 100.0,
    EdgeInsetsGeometry? padding,
    double? spacing,
    TextStyle? textStyle,
    BorderSide? side,
    Key? key,
  }) : this._(
         key: key,
         child: child,
         onPressed: onPressed,
         type: _AppButtonType.primary,
         variant: variant,
         size: size,
         isLoading: isLoading,
         isDisabled: isDisabled,
         enableHapticFeedback: enableHapticFeedback,
         prefixIcon: prefixIcon,
         suffixIcon: suffixIcon,
         width: width,
         height: height,
         borderRadius: borderRadius,
         padding: padding,
         spacing: spacing,
         textStyle: textStyle,
         side: side,
       );

  /// Outlined Button Variant Constructor
  const AppButton.outlined({
    required Widget child,
    required VoidCallback? onPressed,
    AppButtonVariant variant = AppButtonVariant.primary,
    AppButtonSize size = AppButtonSize.lg,
    bool isLoading = false,
    bool isDisabled = false,
    bool enableHapticFeedback = false,
    Widget? prefixIcon,
    Widget? suffixIcon,
    double? width,
    double? height,
    double borderRadius = 100.0,
    EdgeInsetsGeometry? padding,
    double? spacing,
    TextStyle? textStyle,
    BorderSide? side,
    Color? backgroundColor,
    Key? key,
  }) : this._(
         key: key,
         child: child,
         onPressed: onPressed,
         type: _AppButtonType.outlined,
         variant: variant,
         size: size,
         isLoading: isLoading,
         isDisabled: isDisabled,
         enableHapticFeedback: enableHapticFeedback,
         prefixIcon: prefixIcon,
         suffixIcon: suffixIcon,
         width: width,
         height: height,
         borderRadius: borderRadius,
         padding: padding,
         spacing: spacing,
         textStyle: textStyle,
         side: side,
         backgroundColor: backgroundColor,
       );

  /// Text Only Button Variant Constructor
  const AppButton.text({
    required Widget child,
    required VoidCallback? onPressed,
    AppButtonVariant variant = AppButtonVariant.primary,
    AppButtonSize size = AppButtonSize.lg,
    bool isLoading = false,
    bool isDisabled = false,
    bool enableHapticFeedback = false,
    Widget? prefixIcon,
    Widget? suffixIcon,
    double? width,
    double? height,
    double? spacing,
    double borderRadius = 100.0,
    EdgeInsetsGeometry? padding,
    TextStyle? textStyle,
    BorderSide? side,
    Key? key,
  }) : this._(
         key: key,
         child: child,
         onPressed: onPressed,
         type: _AppButtonType.text,
         variant: variant,
         size: size,
         isLoading: isLoading,
         isDisabled: isDisabled,
         enableHapticFeedback: enableHapticFeedback,
         prefixIcon: prefixIcon,
         suffixIcon: suffixIcon,
         width: width,
         height: height,
         borderRadius: borderRadius,
         padding: padding,
         spacing: spacing,
         textStyle: textStyle,
         side: side,
       );

  final Widget child;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool isLoading;
  final bool isDisabled;
  final bool enableHapticFeedback;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final double? spacing;
  final double? width;
  final double? height;
  final double borderRadius;
  final EdgeInsetsGeometry? padding;
  final TextStyle? textStyle;
  final BorderSide? side;
  final Color? backgroundColor;
  final _AppButtonType _type;

  void _handleTap() {
    if (onPressed == null) return;

    if (enableHapticFeedback) {
      if (variant == AppButtonVariant.destructive) {
        HapticFeedback.mediumImpact();
      } else {
        HapticFeedback.lightImpact();
      }
    }

    onPressed!();
  }

  @override
  Widget build(BuildContext context) {
    final bool effectiveDisabled = isDisabled || isLoading || onPressed == null;
    final colors = variant.resolveColors(context);
    final effectiveHeight = height ?? size.height;

    return SizedBox(
      width: width,
      height: effectiveHeight,
      child: _buildButton(effectiveDisabled, colors),
    );
  }

  Widget _buildButton(bool disabled, ButtonColors colors) {
    final VoidCallback? tapCallback = disabled ? null : _handleTap;
    final shape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(borderRadius),
    );

    final effectivePadding = padding ?? size.padding;
    final effectiveSpacing = spacing ?? size.spacing;
    final effectiveTextStyle = textStyle ?? size.textStyle;

    final buttonChild = _ButtonChild(
      spacing: effectiveSpacing,
      isLoading: isLoading,
      prefixIcon: prefixIcon,
      suffixIcon: suffixIcon,
      child: child,
    );

    switch (_type) {
      case _AppButtonType.primary:
        final defaultPrimaryBorder = BorderSide(
          color: disabled ? colors.disabledBorder : colors.border,
          width: 1.5,
        );

        return ElevatedButton(
          onPressed: tapCallback,
          style: ElevatedButton.styleFrom(
            backgroundColor: colors.background,
            foregroundColor: colors.foreground,
            disabledBackgroundColor: colors.disabledBackground,
            disabledForegroundColor: colors.disabledForeground,
            textStyle: effectiveTextStyle,
            elevation: 0,
            shape: shape,
            padding: effectivePadding,
            side: side ?? defaultPrimaryBorder,
          ),
          child: buttonChild,
        );

      case _AppButtonType.outlined:
        final defaultOutlineBorder = BorderSide(
          color: disabled ? colors.disabledBorder : colors.border,
          width: 1.5,
        );

        return OutlinedButton(
          onPressed: tapCallback,
          style: OutlinedButton.styleFrom(
            backgroundColor: backgroundColor,
            foregroundColor: colors.border,
            disabledForegroundColor: colors.disabledBorder,
            textStyle: effectiveTextStyle,
            side: side ?? defaultOutlineBorder,
            shape: shape,
            padding: effectivePadding,
          ),
          child: buttonChild,
        );

      case _AppButtonType.text:
        return TextButton(
          onPressed: tapCallback,
          style: TextButton.styleFrom(
            foregroundColor: colors.border,
            disabledForegroundColor: colors.disabledBorder,
            textStyle: effectiveTextStyle,
            shape: shape,
            padding: effectivePadding,
            side: side,
          ),
          child: buttonChild,
        );
    }
  }
}

class _ButtonChild extends StatelessWidget {
  const _ButtonChild({
    required this.child,
    required this.isLoading,
    this.prefixIcon,
    this.suffixIcon,
    required this.spacing,
  });

  final Widget child;
  final bool isLoading;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final double spacing;

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      final currentColor = DefaultTextStyle.of(context).style.color;

      return SizedBox(
        height: 20,
        width: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          valueColor: AlwaysStoppedAnimation<Color>(
            currentColor ?? Colors.white,
          ),
        ),
      );
    }

    if (prefixIcon != null || suffixIcon != null) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        spacing: spacing,
        children: <Widget>[?prefixIcon, child, ?suffixIcon],
      );
    }

    return child;
  }
}
