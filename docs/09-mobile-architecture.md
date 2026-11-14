# 09 — Mobile Architecture (Flutter / Thor)

> Owned and maintained by `thor`.  
> **Status**: Active (`developement/danielblair924_app/`).

---

## 1. Directory Structure (`developement/danielblair924_app/`)

```text
developement/danielblair924_app/
├── lib/
│   ├── core/                          # Cross-cutting foundational modules
│   │   ├── constants/                 # AppConfig, API endpoints, environment keys
│   │   ├── extensions/                # String, SizedBox, Currency extensions
│   │   ├── navigation/                # BottomStackView (5 persistent tabs)
│   │   ├── network/                   # Dio client, Auth interceptor, error mapper
│   │   ├── router/                    # GoRouter configuration & route guards
│   │   ├── theme/                     # AppColors, Typography, Dark Neon Theme
│   │   ├── utils/                     # Formatters, loggers, validation helpers
│   │   └── widgets/                   # Core design primitives (Buttons, Inputs, Cards)
│   ├── features/                      # Feature-First Modular Domains
│   │   ├── auth/                      # Login, Register, OTP verification, Reset Password
│   │   ├── home/                      # Dashboard stats, Multi-step Run Submission
│   │   ├── events/                    # Club running events & participation
│   │   ├── challenge/                 # Run Around The World (RATW), Flutter Map, Destinations
│   │   ├── leaderboard/               # Podium rankings, User public stats, Filters
│   │   ├── profile/                   # Lifetime stats, History, FlChart graphs, Badges
│   │   ├── news/                      # Club announcements & rich article reader
│   │   └── nfc/                       # NFC physical event tap-in check-in
│   ├── shared/                        # Shared composite widgets & background effects
│   ├── gen/                           # FlutterGen generated assets & icons
│   └── main.dart                      # Application bootstrap & ProviderScope
├── assets/                            # SVG icons, raster images, world map vectors
├── pubspec.yaml                       # Dependencies & Flutter configuration
└── .env.example                       # Base URL configuration (Dev & Prod)
```

---

## 2. Architectural Patterns & Conventions

### 2.1 State Management (Flutter Riverpod)
- All shared states use `NotifierProvider` / `AsyncNotifierProvider` (`flutter_riverpod` v3).
- Feature providers cleanly encapsulate asynchronous network state transitions (`AsyncLoading`, `AsyncData`, `AsyncError`).
- Global authentication state is managed via `authStateProvider` that drives router redirection.

### 2.2 Networking Layer (`Dio` + Interceptors)
- Centralized `ApiClient` configured with `baseUrl` from `.env` via `AppConfig`.
- **Bearer Token Interceptor**: Automatically attaches `Authorization: Bearer <token>` to all authenticated requests.
- **401 Interceptor**: Clears local session on unauthorized responses and routes user safely to `/sign-in`.
- **Multipart Form Upload**: Standardized helper for Strava/GPS image proofs and avatar uploads.

### 2.3 Local Storage & Session Persistence
- JWT `accessToken` stored securely via `flutter_secure_storage`.
- On cold boot (`SplashScreen`), `AuthNotifier` validates token persistence and triggers auto-login before routing.

### 2.4 UI & Theme Consistency
- Strictly maintains the Dark Neon design system defined by `jarvis`:
  - Background: `#080A04` / `#131B04`
  - Accent / Primary: `#A1F400` (Electric Lime)
  - Border: `#344217` / `#232E0E`
- 34 UI views fully responsive using `flutter_screenutil`.

---

## 3. Feature-to-API Contract Mapping

| Feature Module | Mobile Screen | Backend API Endpoint | HTTP Method |
|---|---|---|---|
| **Auth** | `SignInScreen` | `/api/auth/login` | `POST` |
| **Auth** | `SignUpScreen` | `/api/auth/register` | `POST` |
| **Auth** | `ForgotPasswordVerificationScreen` | `/api/auth/verify-otp` | `POST` |
| **Auth** | `ForgetPasswordResetScreen` | `/api/auth/reset-password` | `POST` |
| **Auth** | Cold boot restore | `/api/auth/me` | `GET` |
| **Home** | `HomeTabScreen` | `/api/members/me/stats` | `GET` |
| **Submissions** | `SubmitRunProofScreen` | `/api/upload` (Multipart) | `POST` |
| **Submissions** | `SubmitRunConfirmScreen` | `/api/submissions` | `POST` |
| **Events** | `EventsTabScreen` | `/api/events` | `GET` |
| **Events** | Event details / Join | `/api/events/:id/join` | `POST` |
| **Challenges** | `ChallengeTabScreen` | `/api/challenges` | `GET` |
| **Challenges** | `JourneyFullMapScreen` | `/api/challenges/:id/destinations` | `GET` |
| **Leaderboard** | `LeaderboardTabScreen` | `/api/members/leaderboard` | `GET` |
| **Profile** | `ProfileTabScreen`, `RunningStatsScreen` | `/api/members/me/stats` | `GET` |
| **Profile** | `RunHistoryScreen` | `/api/submissions/my` | `GET` |
| **Profile** | `AchivementsScreen`, `BadgePreviewScreen` | `/api/badges/my` | `GET` |
| **News** | `AllNewsScreen`, `NewsDetailsScreen` | `/api/news` | `GET` |
