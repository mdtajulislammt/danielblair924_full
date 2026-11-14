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
import '../widgets/auth_prompt.dart';

class ForgotPasswordVerificationScreen extends ConsumerStatefulWidget {
  const ForgotPasswordVerificationScreen({
    super.key,
    this.email,
  });

  final String? email;

  @override
  ConsumerState<ForgotPasswordVerificationScreen> createState() =>
      _ForgotPasswordVerificationScreenState();
}

class _ForgotPasswordVerificationScreenState
    extends ConsumerState<ForgotPasswordVerificationScreen> {
  final _otpController = TextEditingController();
  String _otpCode = '';

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _handleVerifyOtp() async {
    final code = _otpCode.isNotEmpty ? _otpCode : _otpController.text.trim();
    if (code.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter the full verification code.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final email = widget.email ?? 'runner@firstmileclub.com';
    final resetToken = await ref.read(authStateProvider.notifier).verifyOtp(
          email: email,
          otp: code,
        );

    if (!mounted) return;

    if (resetToken != null) {
      context.push(
        AppRoutes.forgotPasswordReset,
        extra: resetToken,
      );
    } else {
      final errorMsg = ref.read(authStateProvider).errorMessage ??
          'Verification failed. Invalid or expired code.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMsg),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  Future<void> _handleResend() async {
    final email = widget.email;
    if (email == null || email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No email provided to resend code.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final token = await ref.read(authStateProvider.notifier).forgotPassword(email);
    if (!mounted) return;

    if (token != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Verification code has been resent to your email.'),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final displayEmail = widget.email ?? 'runner@firstmileclub.com';

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      appBar: AppBar(backgroundColor: Colors.transparent),
      body: AppGradientBackground(
        child: SafeArea(
          child: FullHeightScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              spacing: 12,
              children: [
                Column(
                  children: [
                    GlowIconWrapper(
                      margin: const EdgeInsets.only(top: 32, bottom: 52),
                      child: SvgIcon(
                        Assets.icons.openMail,
                        color: context.scheme.primary,
                      ),
                    ),
                    const SectionIntro(
                      title: 'CHECK YOUR EMAIL',
                      subtitle: "We've sent an OTP code to",
                    ),
                    Text(
                      displayEmail,
                      textAlign: TextAlign.center,
                      style: context.titleSmall,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),

                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: OtpInputField(
                    controller: _otpController,
                    onChanged: (val) {
                      _otpCode = val;
                    },
                    onCompleted: (val) {
                      _otpCode = val;
                      _handleVerifyOtp();
                    },
                  ),
                ),
                SizedBox(height: 16.h),

                AuthPrompt(
                  prompt: "Didn't get the email?",
                  child: const Text("Resend"),
                  onPressed: authState.isSubmitting ? null : _handleResend,
                ),
                SizedBox(height: 62.h),

                AppButton(
                  width: double.infinity,
                  isLoading: authState.isSubmitting,
                  onPressed: authState.isSubmitting ? null : _handleVerifyOtp,
                  child: const Text("Continue"),
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
    );
  }
}
