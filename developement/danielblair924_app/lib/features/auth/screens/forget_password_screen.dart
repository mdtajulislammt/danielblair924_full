import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';

class ForgetPasswordScreen extends ConsumerStatefulWidget {
  const ForgetPasswordScreen({super.key});

  @override
  ConsumerState<ForgetPasswordScreen> createState() => _ForgetPasswordScreenState();
}

class _ForgetPasswordScreenState extends ConsumerState<ForgetPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _handleForgotPassword() async {
    if (!_formKey.currentState!.validate()) return;

    final email = _emailController.text.trim();
    final resetToken = await ref.read(authStateProvider.notifier).forgotPassword(email);

    if (!mounted) return;

    if (resetToken != null) {
      context.push(
        AppRoutes.forgotPasswordVarification,
        extra: email,
      );
    } else {
      final errorMsg = ref.read(authStateProvider).errorMessage ??
          'Failed to send reset code. Please try again.';
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
                    title: 'FORGOT PASSWORD?',
                    subtitle: "No worries, it happens. Enter your email\nand we'll send you a reset link.",
                  ),
                  SizedBox(height: 80.h),

                  AppFormField(
                    label: 'EMAIL',
                    controller: _emailController,
                    hintText: 'Enter your email',
                    prefixIcon: SvgIcon(Assets.icons.email),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Email is required';
                      }
                      if (!value.contains('@') || !value.contains('.')) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),

                  SizedBox(height: 16.h),

                  AppButton(
                    width: double.infinity,
                    isLoading: authState.isSubmitting,
                    onPressed: authState.isSubmitting ? null : _handleForgotPassword,
                    child: const Text("SEND RESET LINK"),
                  ),

                  AppButton.text(
                    width: double.infinity,
                    onPressed: () => context.go(AppRoutes.signIn),
                    child: const Text("Back to Login"),
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
