# TASK-016: Mobile Networking Foundation & API Client Setup

> **Status**: `DONE`  
> **Assignee**: `thor` (Mobile Specialist)  
> **Priority**: `P0` (Critical)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,000 tokens)  
> **Dependencies**: `TASK-015`  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `thor`, configure the foundational networking and session storage infrastructure for the Flutter mobile application (`developement/danielblair924_app/`):
- Add required networking and storage dependencies (`dio`, `flutter_secure_storage`) to `pubspec.yaml`.
- Implement centralized `ApiClient` (`lib/core/network/api_client.dart`) with configurable `baseUrl` from `.env`.
- Implement `AuthInterceptor` (`lib/core/network/auth_interceptor.dart`) for automatic `Authorization: Bearer <token>` injection.
- Implement 401 handling to clear secure storage and trigger logout redirection.
- Implement `TokenStorage` service (`lib/core/network/token_storage.dart`) to read/write JWT access tokens securely.
- Ensure `.env` is loaded on app startup with local development backend URL (`http://10.0.2.2:4000/api` or `http://localhost:4000/api`).

---

## 2. Files to Inspect / Modify
- `developement/danielblair924_app/pubspec.yaml`
- `developement/danielblair924_app/.env` & `.env.example`
- `developement/danielblair924_app/lib/core/network/api_client.dart`
- `developement/danielblair924_app/lib/core/network/auth_interceptor.dart`
- `developement/danielblair924_app/lib/core/network/token_storage.dart`
- `developement/danielblair924_app/lib/core/network/api_endpoints.dart`
- `developement/danielblair924_app/lib/core/network/network.dart`
- `developement/danielblair924_app/lib/main.dart`

---

## 3. Acceptance Criteria
- [x] `dio` and `flutter_secure_storage` dependencies configured in `pubspec.yaml`.
- [x] Centralized `ApiClient` created with base URL resolution, connection timeouts, and JSON headers.
- [x] `AuthInterceptor` injects Bearer token on all requests if token exists.
- [x] 401 Unauthorized handler clears tokens and resets auth state.
- [x] Automated verification passes: `bash scripts/verify-task.sh TASK-016`.


