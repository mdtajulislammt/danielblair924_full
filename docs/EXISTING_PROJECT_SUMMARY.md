# 📋 Existing Project Audit & Summary: FMC (First Mile Club)

> **Version**: 2.0  
> **Status**: Completed Initial Scan & Baseline Audit  
> **Chief Orchestrator**: `iron_man`  
> **Audited Directories**:  
> - Frontend: `developement/danielblair924_dashboard_front-end/`  
> - Backend: `developement/danielblair924_backend/`  

---

## 1. Executive Summary & Project Identification

### 1.1 Project Identity & Domain
- **Project Name**: FMC (First Mile Club) Platform
- **Application Type**: Athletic Running Community & Operations Admin Dashboard with Backend REST API.
- **Core Domain**: Distance running challenges, event management, run verification (GPS / Strava proof & TikTok social media proof), achievement badge gamification, community news, and member profile management.

### 1.2 Repository Structure
The codebase is structured under the `developement/` workspace directory:
```text
developement/
├── danielblair924_backend/               # NestJS 11 REST API Backend
│   ├── prisma/
│   │   └── schema.prisma                 # Prisma 7 schema definition
│   ├── src/
│   │   ├── app.controller.ts             # Default root controller
│   │   ├── app.module.ts                 # Root NestJS application module
│   │   ├── app.service.ts                # Default application service
│   │   └── main.ts                       # Entrypoint (bootstrap)
│   ├── .env.example                      # PostgreSQL connection string blueprint
│   ├── nest-cli.json                     # NestJS CLI configuration
│   ├── package.json                      # Backend dependencies (NestJS 11, Prisma 7, pg)
│   ├── pnpm-lock.yaml                    # Package manager: PNPM
│   ├── prisma7.config.ts                 # Prisma 7 modern configuration
│   └── tsconfig.json                     # TypeScript ES Module config
│
└── danielblair924_dashboard_front-end/   # Next.js 16 Admin Dashboard Web App
    ├── app/                              # Next.js App Router (16.2.4)
    │   ├── (auth)/login/                 # Admin Login & Authentication
    │   ├── (admin)/                      # Authenticated Admin Dashboard Layout & Pages
    │   │   ├── page.tsx                  # Primary Dashboard KPI & Activity Overview
    │   │   └── dashboard/
    │   │       ├── members/              # Member directory & detailed profile views
    │   │       ├── submissions/          # Run evidence review, verification & rejection
    │   │       ├── events/               # Event creation, editing & requirement rules
    │   │       ├── challenges/           # Running challenges (RATW & Individual)
    │   │       ├── badges/               # Gamification badge creation & catalog
    │   │       ├── news/                 # Rich text news article editor & publishing
    │   │       └── settings/             # Account credentials, notifications & security
    │   └── globals.css                   # Tailwind CSS v4 styling & Neon theme tokens
    ├── components/                       # Dashboard UI, forms, tables, modals, charts
    ├── config/                           # Application configuration (`app.config.ts`)
    ├── helper/                           # Cookie, string, date & utility helpers
    ├── hooks/                            # Custom React hooks (`useUser.ts`)
    ├── lib/                              # HTTP client (`Fetch.ts`), socket, toast utilities
    ├── public/demoData/                  # Mock domain data, icons & static assets
    ├── service/user/                     # Frontend user service & API endpoint bindings
    ├── package.json                      # Frontend dependencies (Next 16, React 19, Radix UI)
    ├── yarn.lock                         # Package manager: Yarn (v4 Berry)
    └── Dockerfile & docker-compose.yml   # Containerization blueprints
```

---

## 2. Frontend Web Application Audit (`danielblair924_dashboard_front-end`)

### 2.1 Core Framework & Libraries
- **Framework**: Next.js 16.2.4 (App Router) + React 19.2.3 + React DOM 19.2.3
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss: ^4.0.9`, `tailwindcss: ^4.0.9`, `tw-animate-css: ^1.2.8`)
- **Theme & Aesthetic**:
  - Primary Neon Accent: `--color-primaryColor: #a1f400` (Lime Green)
  - Secondary: `--color-secondaryColor: #d6ae29`
  - Dark Theme Backgrounds: `--color-bgColor: #131b04`, Card/Modal Background: `#070a03` / `#0A0D05`
  - Border Accents: `--color-borderColor: #435916` / `#344217`
  - Muted Text: `--color-descriptionColor: #c9c8c8`
- **UI Primitives**: Radix UI (`accordion`, `checkbox`, `dialog`, `dropdown-menu`, `label`, `popover`, `radio-group`, `select`, `slider`, `slot`, `tabs`), Vaul (Drawer), Lucide React (`^0.503.0`), React Icons (`^5.5.0`)
- **Forms & Validation**: `react-hook-form` (^7.87.0) with `zod` (^3.24.3) and `@hookform/resolvers`
- **Rich Text Editing**: `jodit-react` (^5.5.3), `react-quill` (via `react-quill-new` ^3.8.3), `katex`, `quill-delta`
- **Visualizations & Charts**: `chart.js` (^4.4.8), `react-chartjs-2` (^5.3.0), `d3-scale`, `react-simple-maps` (^3.0.0)
- **Networking & Real-time**: Custom `Fetch` wrapper (`lib/Fetch.ts` around `axios` ^1.8.1), `socket.io-client` (^4.8.1), `nookies`
- **Package Manager**: Yarn Berry 4.18.0 (`yarn.lock`, `.yarnrc.yml`)

### 2.2 Functional Pages & Component Inventory
| Route Path | Page Description | Associated Components & Schemas |
|---|---|---|
| `/(auth)/login` | Admin login page | `LoginForm.tsx`, reactive password toggle, email validation |
| `/` | Main Admin Dashboard | `DashboardPage.tsx`, `StatCards.tsx`, `DashboardUserTable.tsx`, `RecentActivityCard.tsx` |
| `/dashboard/members` | Members catalog table | `MembersTable.tsx`, `DynamicTable.tsx`, `PaginationPage.tsx` |
| `/dashboard/members/[id]` | Member profile & activity overview | `UserProfileSidebar.tsx`, `ProfileTabsContainer.tsx`, `ActivityPage.tsx` |
| `/dashboard/members/[id]/badges` | Member earned badges tab | `BadgesPage.tsx` |
| `/dashboard/members/[id]/submissions` | Member submitted runs tab | `SubmissionsPage.tsx` |
| `/dashboard/submissions` | Submissions review queue | `SubmissionPage.tsx`, `NeonWorldMap.tsx`, `DynamicTable.tsx` |
| `/dashboard/submissions/[id]` | Submission inspection & decision | `SubmissionDetailPage.tsx`, `SubmissionModal.tsx` (rejection reason dialog) |
| `/dashboard/events` | Running events catalog | Event cards, category filters (`10K`, `5K Community Run`, etc.) |
| `/dashboard/events/[id]/edite` | Event edit step 1 (Details) | `EventDetailsForm.tsx` (Name, Description, Date, Distance Type, Cover) |
| `/dashboard/events/[id]/edite/step-two` | Event edit step 2 (Rules) | `EventRequirementsForm.tsx` (Distance, Evidence, TikTok, Hashtags) |
| `/dashboard/challenges` | Challenges overview | `ChallengePage.tsx`, RATW (Run Around The World) & Individual cards |
| `/dashboard/challenges/create-challenge` | Challenge creation step 1 | `ChallengeDetailsForm.tsx` (Name, Scope, Description, Cover Image) |
| `/dashboard/challenges/create-challenge/step-two` | Challenge creation step 2 | `EventRequirementsForm.tsx` (Reused requirements engine) |
| `/dashboard/challenges/[id]` | Challenge detail & progress | `ChallengeTabsNav.tsx`, `ChallengeDestinationsTable.tsx` |
| `/dashboard/challenges/[id]/requirements` | Challenge requirements tab | `ChallengeRequirementsList.tsx` |
| `/dashboard/challenges/[id]/participants` | Challenge participants tab | Dynamic participants roster |
| `/dashboard/badges` | Gamification badges list | `Badges.tsx`, `BadgeCard.tsx`, `badgesData.ts` |
| `/dashboard/badges/create` | Create new badge | `CreateBadges.tsx`, `badgeSchema.ts` (Name, Description, Icon, Active) |
| `/dashboard/badges/edit/[id]` | Edit existing badge | `EditBadges.tsx`, `badgeInitialData.json` |
| `/dashboard/news` | News & announcements feed | `News.tsx`, `NewsTable.tsx` |
| `/dashboard/news/create` | Create news post | `CreatePost.tsx`, `postSchema.ts`, `JoditEditorWrapper.tsx` |
| `/dashboard/news/edit/[id]` | Edit news post | `EditPost.tsx`, `postInitialData.json` |
| `/dashboard/settings` | Admin account settings | `AdminAccountSection.tsx`, `adminAccountSchema.ts`, `SettingsNav.tsx` |
| `/dashboard/settings/notifications` | Notification alerts toggles | `NotificationsSection.tsx`, `notificationSchema.ts` |
| `/dashboard/settings/security` | 2FA & Active session management | `SecuritySection.tsx`, session revocation |

### 2.3 Client-Side Service & API Client Analysis
- **API Client Utility (`lib/Fetch.ts`)**:
  - Encapsulates Axios with fallback to native Fetch.
  - Base URL resolved via `AppConfig().app.apiUrl` (`process.env.NEXT_PUBLIC_API_ENDPOINT || "http://127.0.0.1:4000"`) + `/api`.
- **Existing User Service (`service/user/user.service.ts`)**:
  - `login`: `POST /api/auth/login` (email, password)
  - `register`: `POST /api/auth/register` (username, email, password)
  - `getUserDetails`: `GET /api/user/me` (Bearer token auth)
  - `findAll`: `GET /api/user`
  - `findOne`: `GET /api/user/:id`
  - `findOneByUsername`: `GET /api/user/profile/:username`
  - `update`: `PATCH /api/user` (profile details, address, organization)
  - `updateAvatar`: `PATCH /api/user/avatar` (`multipart/form-data`)
  - `create`: `POST /api/user` (admin user provision)
  - `confirm`: `PATCH /api/user/:id/password` (token-based password set)

---

## 3. Backend Application Audit (`danielblair924_backend`)

### 3.1 Core Framework & Infrastructure
- **Framework**: NestJS 11.0.1 (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`)
- **Language**: TypeScript 5.7.3 with ECMAScript Modules (`"type": "module"`)
- **Package Manager**: PNPM (`pnpm-lock.yaml`)
- **Testing**: Jest 30.0.0 + ts-jest 29.2.5 + Supertest 7.0.0
- **Database Engine**: PostgreSQL 15+
- **ORM / Database Adapter**: Prisma ORM 7.10.0 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg: ^8.23.0`)
- **Configuration**:
  - `prisma7.config.ts`: Modern Prisma 7 config defining `schema: prisma/schema.prisma`, `migrations: prisma/migrations`, and `DATABASE_URL` from `.env`.
  - `.env.example`: Provides `DATABASE_URL="postgresql://postgres:root@127.0.0.1:5432/testdb?schema=public"`.

### 3.2 Current Backend State & Implementation Gap
- **Current Code**:
  - `src/main.ts`: Default NestFactory bootstrap listening on `process.env.PORT ?? 3000`.
  - `src/app.module.ts`: Root module importing empty arrays.
  - `src/app.controller.ts`: Only handles root `GET /` returning `"Hello World!"`.
  - `src/app.service.ts`: Helper returning `"Hello World!"`.
  - `prisma/schema.prisma`: Contains only generator client and datasource postgresql. No data models have been declared or migrated yet.
- **Immediate Requirements for Edith (Backend Specialist)**:
  1. Define domain models in `prisma/schema.prisma` matching FMC's requirements.
  2. Implement modular NestJS domain architecture (`AuthModule`, `UserModule`, `EventModule`, `ChallengeModule`, `SubmissionModule`, `BadgeModule`, `NewsModule`, `AdminSettingsModule`).
  3. Align backend listening port to `4000` (or `PORT` env) with global prefix `api` to seamlessly connect with Friday's frontend.

---

## 4. Reverse-Engineered Domain Models (From Codebase Evidence)

From the frontend components, validation schemas, and demo data, the following domain models are required:

```mermaid
erDiagram
    User ||--o{ Submission : submits
    User ||--o{ UserBadge : earns
    User ||--o{ ChallengeParticipant : joins
    User ||--o{ UserSession : has
    User ||--o| NotificationSettings : configures
    Event ||--|| EventRequirements : specifies
    Event ||--o{ Submission : contains
    Challenge ||--o{ ChallengeParticipant : includes
    Challenge ||--o{ Submission : tracks
    Badge ||--o{ UserBadge : awarded_in

    User {
        string id PK
        string email UK
        string username UK
        string passwordHash
        string fname
        string lname
        string role
        string status
        float totalDistance
        string avatarUrl
    }

    Event {
        string id PK
        string title
        string description
        datetime eventDate
        string distanceType
        string status
        string coverImageUrl
    }

    EventRequirements {
        string id PK
        string eventId FK
        boolean completeDistance
        boolean uploadRunningEvidence
        boolean postOnTikTok
        string tiktokCaptionInstructions
        boolean tagFirstMileClub
        boolean tagCollaboratingPage
        string collaboratingPageName
        boolean useSpecificHashtag
        string specificHashtag
    }

    Submission {
        string id PK
        string userId FK
        string eventId FK
        string challengeId FK
        string status
        float distance
        string duration
        datetime runDate
        string stravaImageUrl
        string gpsImageUrl
        boolean postedOnTikTok
        boolean taggedClub
        boolean usedHashtag
        string rejectionReason
    }

    Challenge {
        string id PK
        string title
        string scope
        string description
        string status
        float currentProgress
        float targetProgress
        string progressUnit
    }

    Badge {
        string id PK
        string name
        string description
        string iconUrl
        string tagType
        boolean isActive
        int earnedCount
    }

    NewsPost {
        string id PK
        string title
        string body
        string coverImageUrl
        datetime publishDate
    }
```

---

## 5. Architectural Alignment & Integration Plan

### 5.1 Port & Network Configuration
- **Frontend Expectation**: `http://127.0.0.1:4000/api`
- **Backend Adjustment**: In `developement/danielblair924_backend/src/main.ts`, configure:
  ```typescript
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  await app.listen(process.env.PORT ?? 4000);
  ```

### 5.2 Package Managers & Execution
- Backend: Run via `pnpm` (`pnpm run start:dev`, `pnpm run test`, `pnpm dlx prisma migrate dev`)
- Frontend: Run via `yarn` (`yarn dev`, `yarn build`, `yarn lint`)

### 5.3 Safety & Preservation Guarantee
- In accordance with the Avengers Protocol and user instructions, **no existing code has been refactored or modified**.
- Future tasks will safely scaffold backend modules and integrate frontend components via canonical contracts without breaking changes.
