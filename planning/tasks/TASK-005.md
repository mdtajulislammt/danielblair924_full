# TASK-005: Backend Events & Challenges (RATW) APIs

> **Status**: `DONE`  
> **Assignee**: `edith` (Backend & Data Architect)  
> **Priority**: `P1` (High)  
> **Complexity Level**: `STANDARD` (CRUD, Dynamic Verification Requirements & RATW Progression)  
> **Token Budget**: Medium (~2,500 tokens)  
> **Dependencies**: `TASK-004`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend & Data Specialist (`edith`), implement the Events and Challenges domain APIs for both the Web Admin Dashboard and the Mobile Runner App:
1. **Admin Events Management**:
   - `GET /api/events` / `GET /api/admin/events` (paginated list with category, status, and distance filters).
   - `GET /api/events/:id` / `GET /api/admin/events/:id` (detailed event view).
   - `GET /api/admin/events/:id/participants` (event participants roster matching `EventMemberPage.tsx`).
   - `POST /api/events` / `POST /api/admin/events` (create event with dynamic verification checklist: distance, photo evidence, TikTok post, custom hashtags, collaborative page tags).
   - `PATCH /api/events/:id` / `PATCH /api/admin/events/:id` (update event details and requirements).
   - `DELETE /api/events/:id` / `DELETE /api/admin/events/:id` (cancel or delete event).
2. **Runner Mobile Events**:
   - `GET /api/app/events` (list upcoming & active events open for runners).
   - `GET /api/app/events/:id` (event requirements, banner, distance details).
   - `POST /api/app/events/:id/join` (register runner for an upcoming event).
3. **Challenges & RATW (Run Around The World)**:
   - `GET /api/challenges` / `GET /api/admin/challenges` (list community-wide & individual challenges).
   - `POST /api/challenges` / `POST /api/admin/challenges` (create community or individual challenges).
   - `PATCH /api/challenges/:id` / `PATCH /api/admin/challenges/:id` (update challenge).
   - `GET /api/admin/challenges/:id` (challenge overview and requirements).
   - `GET /api/admin/challenges/:id/destinations` (destinations table matching `ChallengeDestinationsTable.tsx`).
   - `GET /api/admin/challenges/:id/participants` (participant leaderboard roster).
   - `GET /api/app/challenges` (mobile runner active challenges with participation status).
   - `GET /api/app/challenges/:id` (challenge milestones, collective kilometers progress, user progress).
   - `POST /api/app/challenges/:id/join` (opt-in runner to challenge).
   - `GET /api/app/challenges/ratw/destinations` (global milestone destinations e.g. Bangladesh, India, Nepal, China, Rome, Paris, Tokyo with dynamic unlock status).

---

## 2. Inputs & Context Documents
- **API List & Specification**: [docs/API_LIST.md](../../docs/API_LIST.md) (Sections 3.3, 3.5, 4.4, 4.5)
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md) (Sections 6, 7)
- **Database Schema**: [developement/danielblair924_backend/prisma/schema.prisma](../../developement/danielblair924_backend/prisma/schema.prisma) (`Event`, `EventRequirements`, `Challenge`, `ChallengeParticipant`)

---

## 3. Implementation Summary
- **DTOs**:
  - `EventRequirementsDto`: Full dynamic verification checklist.
  - `CreateEventDto`, `UpdateEventDto`, `EventQueryDto`: Comprehensive event validation.
  - `CreateChallengeDto`, `UpdateChallengeDto`, `ChallengeQueryDto`: Support for community-wide and individual challenges with target progress.
- **Events Domain (`src/events/`)**:
  - `EventsService`: Creation, pagination with filtering, retrieval, updating with nested requirement upserts, deletion, registration, and participant rosters.
  - `EventsController`, `AdminEventsController`, `AppEventsController`: Role-guarded endpoints (`JwtAuthGuard`, `RolesGuard`, `Roles('ADMIN', 'SUPERADMIN')`).
- **Challenges Domain (`src/challenges/`)**:
  - `ChallengesService`: CRUD, dynamic progress calculation, leaderboard ranking, opt-in join workflow (`ChallengeParticipant`), and milestone destination progression engine (`STATIC_DESTINATIONS`).
  - `ChallengesController`, `AdminChallengesController`, `AppChallengesController`: Public, admin, and runner endpoints.
- **Module Registration**: Wired into `AppModule`.
- **Testing & Quality**:
  - 16 test suites passing, 129 unit tests passing (`yarn test`).
  - Clean NestJS production compilation (`yarn build`).

---

## 4. Verification Evidence (Thanos)
- **Command**: `bash scripts/verify-task.sh TASK-005`
- **Output**:
  ```text
  ========================================================
  🛡️  THANOS VERIFICATION GATE: TASK-005
  ========================================================
  🔍 1. Checking Backend API & Schemas (Edith)...
    ✔ Prisma schema verified (developement/danielblair924_backend/prisma/schema.prisma).
    ✔ Backend contracts checked (developement/danielblair924_backend).
  🔍 2. Checking Frontend Web & Components (Friday)...
    ✔ API client verified.
    ✔ Core UI primitives verified.
    ✔ Frontend component standards checked (developement/danielblair924_dashboard_front-end).
  🔍 3. Checking Mobile App (Thor)...
    ℹ Mobile scope inactive or not configured (Skipped).
  --------------------------------------------------------
  ✅ VERIFICATION PASSED: Task TASK-005 meets all criteria.
  Status: READY TO MARK AS DONE
  ```
- **Test Status**: 16/16 Test Suites Passed, 129/129 Tests Passed (`yarn test`).
- **Build Status**: Clean build (`yarn build` in 3.17s).
- **Status**: `DONE`

---

## 5. Fresh Session Handoff
```text
planning/updateplanning.md পড়ে TASK-006 শুরু করো। [Tier: LEVEL_STANDARD]
```
