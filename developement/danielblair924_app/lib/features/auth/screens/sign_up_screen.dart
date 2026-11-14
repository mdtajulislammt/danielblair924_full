import 'package:first_mile_club/core/router/router.dart';
import 'package:first_mile_club/core/theme/theme.dart';
import 'package:first_mile_club/core/widgets/widgets.dart';
import 'package:first_mile_club/features/auth/auth.dart';
import 'package:first_mile_club/gen/assets.gen.dart';
import 'package:first_mile_club/shared/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class SignUpScreen extends ConsumerStatefulWidget {
  const SignUpScreen({super.key});

  @override
  ConsumerState<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends ConsumerState<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  var _obscurePasswordText = true;
  void _togglePasswordVisibility() {
    setState(() {
      _obscurePasswordText = !_obscurePasswordText;
    });
  }

  var _agreedToTermsAndConditions = false;
  void _toggleTermsAndConditions(bool? checked) {
    if (checked == null) return;

    setState(() {
      _agreedToTermsAndConditions = checked;
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignUp() async {
    if (!_formKey.currentState!.validate()) return;

    if (!_agreedToTermsAndConditions) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please accept the Terms of Service & Privacy Policy to proceed.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final success = await ref.read(authStateProvider.notifier).register(
          email: _emailController.text,
          password: _passwordController.text,
          fullName: _nameController.text,
        );

    if (!mounted) return;

    if (success) {
      context.push(AppRoutes.signUpResult);
    } else {
      final errorMsg = ref.read(authStateProvider).errorMessage ??
          'Registration failed. Please check your details and try again.';
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
                    title: 'CREATE YOUR ACCOUNT',
                    subtitle: 'Join First Mile Club and start your journey',
                  ),

                  SizedBox(height: 80.h),

                  AppFormField(
                    label: 'FULL NAME',
                    controller: _nameController,
                    hintText: 'Enter your full name',
                    prefixIcon: SvgIcon(Assets.icons.person),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Full name is required';
                      }
                      return null;
                    },
                  ),

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

                  AppFormField.password(
                    label: 'PASSWORD',
                    controller: _passwordController,
                    hintText: 'Create a password',
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

                  Padding(
                    padding: EdgeInsets.only(top: 6, bottom: 24.h),
                    child: TermsAndPrivacyCheckbox(
                      value: _agreedToTermsAndConditions,
                      onChanged: _toggleTermsAndConditions,
                      onTermsTap: () {},
                      onPrivacyTap: () {},
                    ),
                  ),

                  AppButton(
                    width: double.infinity,
                    isLoading: authState.isSubmitting,
                    onPressed: authState.isSubmitting ? null : _handleSignUp,
                    child: const Text("CREATE ACCOUNT"),
                  ),

                  SizedBox(height: 2.h),
                  const TextDivider(text: 'OR'),
                  SizedBox(height: 2.h),

                  AuthPrompt(
                    prompt: 'Already have an account?',
                    child: const Text("Login"),
                    onPressed: () => context.go(AppRoutes.signIn),
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
