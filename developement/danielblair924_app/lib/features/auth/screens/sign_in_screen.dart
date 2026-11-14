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

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({super.key});

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  var _obscurePasswordText = true;
  void _togglePasswordVisibility() {
    setState(() {
      _obscurePasswordText = !_obscurePasswordText;
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authStateProvider.notifier).login(
          email: _emailController.text,
          password: _passwordController.text,
        );

    if (!mounted) return;

    if (success) {
      AppRoutes.navToHomeIfAuthenticated(
        context,
        authenticated: true,
      );
    } else {
      final errorMsg = ref.read(authStateProvider).errorMessage ??
          'Login failed. Please check your credentials.';
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
                    title: 'WELCOME BACK',
                    subtitle: 'Log in to continue your journey',
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

                  Column(
                    spacing: 4,
                    children: [
                      AppFormField.password(
                        label: 'PASSWORD',
                        controller: _passwordController,
                        hintText: 'Enter your password',
                        prefixIcon: SvgIcon(Assets.icons.lock),
                        obscureText: _obscurePasswordText,
                        onToggleVisibility: _togglePasswordVisibility,
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
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          AppButton.text(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            onPressed: () => context.push(AppRoutes.forgotPassword),
                            borderRadius: 6,
                            height: 44,
                            child: Text(
                              "Forgot password?",
                              style: TextStyle(
                                fontSize: 14,
                                letterSpacing: 0.6,
                                fontWeight: FontWeight.w500,
                                decoration: TextDecoration.underline,
                                decorationColor: context.scheme.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  AppButton(
                    width: double.infinity,
                    isLoading: authState.isSubmitting,
                    onPressed: authState.isSubmitting ? null : _handleLogin,
                    child: const Text("LOGIN"),
                  ),

                  SizedBox(height: 2.h),
                  const TextDivider(text: 'OR'),
                  SizedBox(height: 2.h),

                  AuthPrompt(
                    prompt: 'New Here?',
                    child: const Text("Sign Up"),
                    onPressed: () => context.push(AppRoutes.signUp),
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
