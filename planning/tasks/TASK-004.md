# TASK-004: Backend Run Submissions & Moderation APIs

> **Status**: `DONE`  
> **Assignee**: `edith` (Backend & Data Architect)  
> **Priority**: `P0` (Critical)  
> **Complexity Level**: `HEAVY` (Run Proof Telemetry, Multi-step Verification, Moderation Workflows & Gamification Engine)  
> **Token Budget**: High (~4,000 tokens)  
> **Dependencies**: `TASK-003`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend & Data Specialist (`edith`), implement the complete Run Proof Submissions and Moderation lifecycle:
1. Runner draft creation with telemetry metrics (distance, duration, pace calculation, run date, event/challenge linking).
2. Proof uploads (Strava screenshot & GPS route screenshot URLs).
3. TikTok verification finalization with club tagging and hashtag checks.
4. Admin Moderation Queue (`GET /api/admin/submissions`), inspection detail (`GET /api/admin/submissions/:id`), approval with distance accretion & automated milestone badge unlocking (`PATCH /api/admin/submissions/:id/approve`), and rejection with explanation modal (`PATCH /api/admin/submissions/:id/reject`).
5. Dynamic Finisher Card generator (`GET /api/submissions/:id/finisher-card`).
6. Runner Dashboard KPIs (`GET /api/runner/dashboard` and `GET /api/runner/activities`).
7. Admin Dashboard KPIs & Activity Feed (`GET /api/admin/dashboard/stats`, `GET /api/admin/dashboard/recent-activity`).
8. Member past submissions & telemetry activities (`GET /api/admin/members/:id/submissions`, `GET /api/admin/members/:id/activities`).

---

## 2. Inputs & Context Documents
- **API List & Specification**: [docs/API_LIST.md](../../docs/API_LIST.md) (Sections 3.1, 3.2, 4.1, 4.3)
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- **Database Schema**: [developement/danielblair924_backend/prisma/schema.prisma](../../developement/danielblair924_backend/prisma/schema.prisma)
- **Frontend Source Audit**:
  - `developement/danielblair924_dashboard_front-end/components/Dashboard/Submission/SubmissionPage.tsx`
  - `developement/danielblair924_dashboard_front-end/components/Dashboard/Submission/SubmissionDetailPage.tsx`
  - `developement/danielblair924_dashboard_front-end/components/Dashboard/Submission/SubmissionModal.tsx`
  - `developement/danielblair924_dashboard_front-end/components/Dashboard/memberPage/SubmissionsPage.tsx`

---

## 3. Implementation Summary
- **DTOs Created with Strict `class-validator` & `class-transformer`**:
  - `CreateSubmissionDto` (`eventId`, `challengeId`, `activityType`, `distanceKm`, `duration`, `pace`, `runDate`, `stravaImageUrl`, `gpsImageUrl`).
  - `UploadProofImagesDto` (`stravaImageUrl`, `gpsImageUrl`).
  - `FinalizeSubmissionDto` (`postedOnTikTok`, `tiktokVideoUrl`, `taggedClub`, `usedHashtag`, `specificHashtagUsed`).
  - `RejectSubmissionDto` (`reason`).
  - `SubmissionQueryDto` (`page`, `limit`, `status`, `search`, `activityType`).
- **Core Services & Controllers**:
  - `SubmissionsService`:
    - Anti-fragile pace calculator (supports `1h 08m`, `29:57`, `01:08:00`, raw minutes).
    - Multi-step draft -> proof upload -> finalize lifecycle.
    - Finisher Card generator with motivational badges and celebration messages.
    - Admin approval workflow with automatic runner distance accretion and challenge progress updating.
    - Automated Gamification Engine checking milestone badges (`first-run`, `5k-finisher`, `10k-finisher`, `half-marathon`, `100k-club`, `global-explorer`).
    - Robust rejection workflow that safely rolls back credited distance if a previously approved submission is rejected.
  - `SubmissionsController`:
    - `POST /api/submissions/draft` & `POST /api/submissions`
    - `POST /api/submissions/:id/proof-images`
    - `POST /api/submissions/:id/finalize`
    - `GET /api/submissions/my`
    - `GET /api/submissions/:id`
    - `GET /api/submissions/:id/finisher-card`
  - `RunnerController`:
    - `GET /api/runner/dashboard`
    - `GET /api/runner/activities`
  - `AdminSubmissionsController`:
    - `GET /api/admin/submissions` (moderation queue)
    - `GET /api/admin/submissions/:id` (detail page)
    - `PATCH /api/admin/submissions/:id/approve`
    - `PATCH /api/admin/submissions/:id/reject`
  - `AdminDashboardController`:
    - `GET /api/admin/dashboard/stats`
    - `GET /api/admin/dashboard/recent-activity`
  - `AdminMembersController`:
    - `GET /api/admin/members/:id/submissions`
    - `GET /api/admin/members/:id/activities`

---

## 4. Verification Evidence (Thanos Gate)
- **Automated Verification**: `bash scripts/verify-task.sh TASK-004` (Passed)
- **Unit Test Suites**:
  - `submissions.service.spec.ts` (14 tests passed)
  - `submissions.controller.spec.ts` (6 tests passed)
  - `runner.controller.spec.ts` (3 tests passed)
  - `admin-submissions.controller.spec.ts` (5 tests passed)
  - `admin-dashboard.controller.spec.ts` (3 tests passed)
  - `admin-members.controller.spec.ts` (6 tests passed)
  - All existing test suites verified (12 suites, 74 tests passing cleanly).
- **TypeScript Compilation**: Clean NestJS build via `yarn build`.

---

## 5. Fresh Session Handoff
```text
planning/updateplanning.md পড়ে TASK-005 শুরু করো। [Tier: LEVEL_STANDARD]
```
