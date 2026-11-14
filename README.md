# 🛡️ FMC (First Mile Club): Client Requirements & Project Brief

> 🚀 **Quick Navigation & Usage Guides**:
> - 📖 **Developer Guide / How to Use (English)**: [HOW_TO_USE_EN.md](HOW_TO_USE_EN.md)
> - 🔄 **Existing Project Adoption Guide (English)**: [HOW_TO_USE_IN_EXISTING_PROJECT_EN.md](HOW_TO_USE_IN_EXISTING_PROJECT_EN.md)
> - 🇧🇩 **ব্যবহার নির্দেশিকা (বাংলা গাইড)**: [HOW_TO_USE_BN.md](HOW_TO_USE_BN.md)
> - 🔄 **চলমান প্রজেক্টে ব্যবহারের গাইড (বাংলা)**: [HOW_TO_USE_IN_EXISTING_PROJECT_BN.md](HOW_TO_USE_IN_EXISTING_PROJECT_BN.md)
> - 📚 **ফোল্ডার ও ফাইল পরিচিতি (A to Z Guide)**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
> - 🤖 **Global Agent Rules**: [AGENTS.md](AGENTS.md)
> - ⚙️ **Project Tech Stack Config**: [project.config.md](project.config.md)
> - 📋 **Existing Project Audit**: [docs/EXISTING_PROJECT_SUMMARY.md](docs/EXISTING_PROJECT_SUMMARY.md)
> - 🔌 **Comprehensive API List**: [docs/API_LIST.md](docs/API_LIST.md)
>
> ⚡ **সেশন কন্টিনিউয়েশন প্রম্পট (Next Session Command)**:
> নতুন চ্যাট উইন্ডো খুলে শুধু এই এক লাইন বলুন:
> ```text
> planning/updateplanning.md পড়ে পরবর্তী টাস্ক শুরু করো।
> ```
>
> **Avengerse Protocol — Source of Truth**:
> 1. This document (`README.md`) is the **Single Source of Truth** for client requirements.
> 2. Fill out the sections below to describe the client's project. The Chief Orchestrator (`iron_man`) will read this file to coordinate Jarvis, Friday, Edith, Thor, Thanos, and Ultron.
> 3. **Zero-Assumption Policy**: AI agents must never invent client requirements. Unanswered details must be preserved under **Section 8 (Open Questions)** and tracked in `planning/open-questions.md`.

---

## 1. Project Information

- **Project Name**: FMC (First Mile Club) Platform
- **Project Description**: An athletic running community platform consisting of a Web Admin Dashboard and REST APIs supporting both the dashboard and the runner mobile application. The system handles member profiles, distance running events, community challenges (such as "Run Around The World" / RATW), run evidence submissions (Strava/GPS proofs and TikTok social tag verification), achievement badges/gamification, news announcements, and admin controls.
- **Business Domain**: Sports & Athletics, Running Community, Gamified Fitness & Social Verification.
- **Client / Company Information**: First Mile Club (Client File: `danielblair924_FO41C03DAA584_$400_Techvee`)
- **Target Audience**: 
  - **Club Administrators**: Managing members, vetting running proofs, configuring events, creating badges and publishing news.
  - **Club Runners / Members**: Submitting runs, earning badges, participating in community/individual challenges, tracking lifetime distance.
- **Business Objectives**:
  - Automate and streamline run proof verification with TikTok social media proofing and Strava/GPS upload checks.
  - Power real-time community engagement with collective distance goals (e.g. RATW milestone destination unlocking).
  - Provide a scalable NestJS backend API serving both the Web Admin Dashboard and the Runner Mobile Application.

---

## 2. Functional Requirements

### 2.1 Web Admin Dashboard Requirements
- **REQ-F-001 (Admin Authentication)**: Secure JWT login for administrators (`/login`), cookie-based token persistence, session management.
- **REQ-F-002 (Dashboard Analytics Overview)**: Top-level KPI stat cards (Active Members, Pending Submissions, Upcoming Events, Upcoming Challenges), visual chart trends, recent activity stream.
- **REQ-F-003 (Member Directory & Profiles)**: Paginated table with search, status filtering, member detail sidebar, lifetime distance, completed events count, earned badges, and activity history.
- **REQ-F-004 (Run Submission Review & Moderation)**:
  - Review queue for submitted runs with status (`Pending`, `Approved`, `Rejected`).
  - Evidence review modal: Strava screenshot, GPS route screenshot.
  - Requirements verification checklist: TikTok post confirmation, `@FirstMileClub` tag check, mandatory hashtag check (e.g., `#RunForLife2026`).
  - Approval flow and Rejection flow with custom rejection reasons sent to member.
- **REQ-F-005 (Event Management)**:
  - Multi-step event creation and editing: Step 1 (Title, description, distance type, date, cover image), Step 2 (Verification rules checklist).
- **REQ-F-006 (Challenges & RATW Progress)**:
  - Community-wide and Individual challenges with target distance (e.g. 500 km).
  - Destination milestone tracking (e.g. Rome unlocked/locked).
- **REQ-F-007 (Gamification & Badges)**:
  - Badge catalog with active toggle, icon upload (PNG/JPG <= 2MB), earned counts, category tags (`event` vs `ratw`).
- **REQ-F-008 (News & Announcements)**:
  - Rich text article authoring (`Jodit`/`Quill`), cover image upload (<= 5MB), publish date scheduling, draft vs publish status.
- **REQ-F-009 (Admin Settings & Security)**:
  - Update admin credentials (name, email, password change with confirmation).
  - Notification alert toggles (new submission, new registration, weekly email, event published, badge earned).
  - Active security session inspection and device revocation.

### 2.2 Mobile Runner App API Requirements
- **REQ-M-001 (Member Authentication & Onboarding)**: Register, Login, Create/Confirm password, Forgot password.
- **REQ-M-002 (Runner Profile & Stats)**: Fetch profile, total lifetime distance (`KM LIFETIME`), rank, active badges, avatar upload.
- **REQ-M-003 (Run Proof Submission)**:
  - Step 1: Submit activity details (Distance, duration, pace, run date, associated event/challenge).
  - Step 2: Upload evidence images (Strava screenshot, GPS route screenshot).
  - Step 3: Social proof links/flags (TikTok video link/confirmation, hashtag verification).
- **REQ-M-004 (Challenge & Event Participation)**: Browse events, join challenges, track individual contribution towards community goals.
- **REQ-M-005 (Badge Showcase & Finisher Cards)**: View unlocked and locked badges, download/share finisher cards.
- **REQ-M-006 (Community Leaderboard)**: View top runners by distance and recent community achievements.

---

## 3. Non-Functional Requirements

- **Performance**: P95 API response time < 150ms for cached stats, fast file uploads.
- **Scalability**: Horizontal scalability with NestJS and PostgreSQL connection pooling via Prisma 7.
- **Security**: JWT authentication, role guards (`SUPERADMIN`, `ADMIN`, `MEMBER`), Argon2/Bcrypt password hashing, CORS whitelist.
- **Reliability & Auditability**: Status changes on submissions logged with reviewer ID, timestamp, and rejection reason.
- **Codebase Integrity**: **Strict zero-touch policy on existing frontend source code without explicit human developer approval**.

---

## 4. Technology Preferences

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI Primitives, Yarn Berry 4.
  - Path: `developement/danielblair924_dashboard_front-end/`
- **Backend**: NestJS 11, TypeScript (ESM), Modular Domain Architecture, PNPM.
  - Path: `developement/danielblair924_backend/`
- **Database**: PostgreSQL 15+
- **ORM**: Prisma ORM 7.10.0 (`@prisma/client`, `@prisma/adapter-pg`, `prisma7.config.ts`)
- **Cache & Queue**: Redis (Session storage & rate limiting)
- **Containerization**: Docker, Docker Compose

---

## 5. Design References

- **Figma URL**: [Figma Design File: danielblair924_FO41C03DAA584_$400_Techvee](https://www.figma.com/design/44IYnCMfDkGxvdiLDhTUSl/danielblair924_FO41C03DAA584_-400_Techvee--Client-File-?node-id=16-2&p=f&t=ZAgWEUicJlhuWhA4-0)
- **Design System**: Dark Neon Athletic Aesthetic
  - **Primary Neon**: `#A1F400` (Lime Green)
  - **Secondary**: `#D6AE29` (Gold / Amber)
  - **Dark Backgrounds**: `#131B04` (Dark Olive/Green Tint), `#070A03` (Deep Black Card Background), `#0D1402`
  - **Borders & Dividers**: `#344217` / `#435916`
  - **Muted Text**: `#C8C7C7` / `#C9C8C8` / `#807C7C`
  - **Typography**: `Figtree` (Bold 700, SemiBold 600, Medium 500, Regular 400)

---

## 6. External Integrations

- **Evidence Uploads**: Cloudflare R2 / AWS S3 / Local Multer storage for Strava & GPS screenshots.
- **Social Media Verification**: TikTok post verification & hashtag detection (`#RunForLife2026`, `#RATW2026`).
- **Fitness Trackers (Future)**: Strava API, Apple Health, Google Fit.

---

## 7. Working Agreements & Human Approval Gates

1. **Frontend Safety Gate**: Frontend code is largely complete. **Never modify or refactor frontend code without checking and notifying the user first**.
2. **Backend API Readiness**: Build all REST endpoints with clean NestJS controllers, services, DTOs, and Prisma models to support both the Admin Dashboard and the Mobile App.
3. **Manual Git Control**: Never run automatic git commits or pushes.
