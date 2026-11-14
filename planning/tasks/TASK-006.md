# TASK-006: Backend Badges & Gamification APIs

> **Status**: `DONE`  
> **Assignee**: `edith` (Backend & Data Architect)  
> **Priority**: `P1` (High)  
> **Complexity Level**: `STANDARD` (CRUD, Dynamic Unlocked/Locked Gamification Engine, File & Icon Uploads)  
> **Token Budget**: Medium (~3,000 tokens)  
> **Model Advice**: Standard Model (Sonnet / Flash / GPT-4o)  
> **Dependencies**: `TASK-003`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend and Data Specialist (`edith`), implement the Badges and Gamification domain APIs for both the Web Admin Dashboard and the Mobile Runner App:
1. **Admin Badges Management**:
   - `GET /api/admin/badges` / `GET /api/badges`: List badges with active/inactive toggles, tag types (`EVENT`, `RATW`, `SPECIAL`), and earned counts matching `Badges.tsx`.
   - `GET /api/admin/badges/:id` / `GET /api/badges/:idOrSlug`: Retrieve single badge details.
   - `POST /api/admin/badges` / `POST /api/badges`: Create badge with validation (`name`, `description`, `iconUrl` / icon upload, `tagType`, `isActive`).
   - `PATCH /api/admin/badges/:id` / `PATCH /api/badges/:id`: Edit badge details, toggle active status, or replace icon.
   - `DELETE /api/admin/badges/:id` / `DELETE /api/badges/:id`: Archive / delete badge.
   - `POST /api/admin/badges/:id/award`: Manually award badge to a member.
   - `DELETE /api/admin/badges/:id/revoke/:userId`: Revoke awarded badge from a member.
   - `GET /api/admin/members/:id/badges`: Member's earned badges tab matching `BadgesPage.tsx` (`id`, `badge`, `name`, `earnedOn`).
2. **Mobile Runner Gamification Showcase (`MOB-007`)**:
   - `GET /api/app/badges/my-badges`: Runner's unlocked badges with timestamps, progress, and locked badges.
   - `GET /api/app/badges/:slug`: Single badge details, requirements, community earned count, and user unlocked status.
3. **Automated Gamification Hooks**:
   - Seamless interoperability with `SubmissionsService.approveSubmission` for milestone badges.

---

## 2. Inputs & Context Documents
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- **API Directory**: [docs/API_LIST.md](../../docs/API_LIST.md)
- **Figma Specs**: [docs/03-figma-analysis.md](../../docs/03-figma-analysis.md) (`MOB-007`, `ADM-009`)
- **Prisma Models**: `Badge`, `UserBadge` in [development/backend/prisma/schema.prisma](../../developement/danielblair924_backend/prisma/schema.prisma)
- **Frontend Dashboard Reference**: `Badges.tsx`, `badgeSchema.ts`, `badgesData.ts`, `BadgesPage.tsx`

---

## 3. Step-by-Step Execution Plan
1. [x] Create `BadgesModule` in `src/badges/`.
2. [x] Implement DTOs: `CreateBadgeDto`, `UpdateBadgeDto`, `BadgeQueryDto`, `AwardBadgeDto`.
3. [x] Implement `BadgesService`:
   - CRUD operations for badges.
   - Seed default initial badges from `BADGES_DATA` if database table is empty.
   - `getMyBadges(userId)` computing unlocked vs locked badges.
   - `awardBadge` and `revokeBadge` with atomic `earnedCount` counter updates.
4. [x] Implement `BadgesController` (`/api/badges`), `AdminBadgesController` (`/api/admin/badges`), and `AppBadgesController` (`/api/app/badges`).
5. [x] Wire `GET /api/admin/members/:id/badges` in `AdminMembersController` and `UsersService`.
6. [x] Write unit tests for `BadgesService`, `BadgesController`, `AdminBadgesController`, `AppBadgesController`, and `AdminMembersController`.
7. [x] Verify build (`yarn build`) and run `bash scripts/verify-task.sh TASK-006`.

---

## 4. Expected Outputs
- `src/badges/` containing complete Badges & Gamification logic.
- Comprehensive unit tests covering all endpoints (18 test suites, 161 tests passing).
- Clean NestJS build with zero type errors.

---

## 5. Acceptance Criteria
- [x] Admin can list, create, update, and delete badges.
- [x] Runner can view their earned badges and locked badges list with `MOB-007` contract.
- [x] Admin can view a member's earned badges matching `BadgesPage.tsx` format.
- [x] Badge creation validates name (2-50 chars) and description (5-250 chars).
- [x] Slugs are automatically generated or uniquely validated.
- [x] All unit tests pass and NestJS compiles cleanly.

---

## 6. Verification Evidence (Thanos)
- **Command**: `bash scripts/verify-task.sh TASK-006`
- **Status**: `PASSED`
- **Output Log**:
```text
========================================================
🛡️  THANOS VERIFICATION GATE: TASK-006
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
✅ VERIFICATION PASSED: Task TASK-006 meets all criteria.
Status: READY TO MARK AS DONE
```
- **Jest Results**: 18 passed, 161 tests total.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-007 শুরু করো। [Tier: LEVEL_STANDARD]
```
