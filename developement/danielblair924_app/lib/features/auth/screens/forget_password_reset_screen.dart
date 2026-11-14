import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';
import '../widgets/password_strength_indicator.dart';

class ForgetPasswordResetScreen extends ConsumerStatefulWidget {
  const ForgetPasswordResetScreen({
    super.key,
    this.resetToken,
  });

  final String? resetToken;

  @override
  ConsumerState<ForgetPasswordResetScreen> createState() =>
      _ForgetPasswordResetScreenState();
}

class _ForgetPasswordResetScreenState
    extends ConsumerState<ForgetPasswordResetScreen> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  var _obscurePasswordText = true;
  void _togglePasswordVisibility() {
    setState(() {
      _obscurePasswordText = !_obscurePasswordText;
    });
  }

  PasswordStrength _strength = PasswordStrength.none;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _onPasswordChanged(String password) {
    setState(() {
      _strength = PasswordStrength.calculate(password);
    });
  }

  Future<void> _handleResetPassword() async {
    if (!_formKey.currentState!.validate()) return;

    final token = widget.resetToken ?? 'mock-reset-token';
    final success = await ref.read(authStateProvider.notifier).resetPassword(
          token: token,
          newPassword: _passwordController.text,
        );

    if (!mounted) return;

    if (success) {
      context.push(AppRoutes.forgotPasswordResult);
    } else {
      final errorMsg = ref.read(authStateProvider).errorMessage ??
          'Password reset failed. Please request a new link.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMsg),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(backgroundColor: Colors.transparent),
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Form(
              key: _formKey,
              child: Column(
                spacing: 12,
                children: [
                  const SectionIntro(
                    title: 'SET A NEW PASSWORD',
                    subtitle: "Make it strong — at least 8 characters",
                  ),
                  SizedBox(height: 16.h),
                  SizedBox(height: 28.h),

                  AppFormField.password(
                    label: 'PASSWORD',
                    controller: _passwordController,
                    hintText: 'Create a password',
                    prefixIcon: SvgIcon(Assets.icons.lock),
                    obscureText: _obscurePasswordText,
                    onToggleVisibility: _togglePasswordVisibility,
                    onChanged: _onPasswordChanged,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Password is required';
                      }
                      if (value.length < 6) {
                        return 'Password must be at least 6 characters';
                      }
                      return null;
                    },
                  ),

                  AppFormField.password(
                    label: 'CONFIRM PASSWORD',
                    controller: _confirmPasswordController,
                    hintText: 'Confirm your password',
                    prefixIcon: SvgIcon(Assets.icons.lock),
                    obscureText: _obscurePasswordText,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please confirm your password';
                      }
                      if (value != _passwordController.text) {
                        return 'Passwords do not match';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 16.h),

                  // Strength Indicator Widget
                  PasswordStrengthIndicator(strength: _strength),

                  SizedBox(height: 28.h),

                  AppButton(
                    width: double.infinity,
                    isLoading: authState.isSubmitting,
                    onPressed: authState.isSubmitting ? null : _handleResetPassword,
                    child: const Text("RESET PASSWORD"),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
