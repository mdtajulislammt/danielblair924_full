# TASK-017: Mobile Authentication & Session Flow Integration

> **Status**: `DONE`  
> **Assignee**: `thor` (Mobile Specialist)  
> **Priority**: `P0` (Critical)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,500 tokens)  
> **Dependencies**: `TASK-016`  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `thor`, wire the mobile authentication screens to the live NestJS backend Auth API (`/api/auth/*`):
- Connect `SignInScreen` to `POST /api/auth/login`. Store JWT in `flutter_secure_storage` and update `authStateProvider`.
- Connect `SignUpScreen` to `POST /api/auth/register`. Navigate to `SignUpResultScreen` on success.
- Connect `ForgetPasswordScreen` to `POST /api/auth/forgot-password`.
- Connect `ForgotPasswordVerificationScreen` to `POST /api/auth/verify-otp`.
- Connect `ForgetPasswordResetScreen` to `POST /api/auth/reset-password`.
- Implement `_checkStoredToken()` in `AuthNotifier` to fetch `/api/auth/me` and restore active session during splash.
- Implement logout action to clear secure storage and navigate to `/sign-in`.

---

## 2. Acceptance Criteria
- [x] Sign In authenticates against live backend and saves JWT token securely.
- [x] Sign Up registers runner successfully in database.
- [x] OTP verification and password reset flows communicate with backend.
- [x] Cold restart automatically restores session if valid token is found.
- [x] Automated verification passes: `bash scripts/verify-task.sh TASK-017`.
