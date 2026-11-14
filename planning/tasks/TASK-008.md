# TASK-008: Backend Admin Settings, Notifications & Sessions

> **Status**: `DONE`  
> **Assignee**: `edith` (Backend & Data Specialist)  
> **Priority**: `P1` (High)  
> **Complexity Level**: `STANDARD`  
> **Token Budget**: Medium (~2,500 tokens)  
> **Model Advice**: Standard Coding Model (Flash / Sonnet / V3 / 4o)  
> **Dependencies**: `TASK-003`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend & Data Specialist (`edith`), implement production-grade REST APIs for Administrator Settings, Notification Preferences (`NotificationSettings` model), and Active Browser Device Sessions (`UserSession` model), allowing admins to view and manage account credentials, toggle alert preferences (e.g., `newSubmissionAlert`), view active devices, and remotely revoke sessions, conforming to `docs/API_LIST.md` (Section 4.8) and `docs/08-api-contract.md`.

---

## 2. Inputs & Context Documents
- **Database Schema**: [developement/danielblair924_backend/prisma/schema.prisma](../../developement/danielblair924_backend/prisma/schema.prisma) (`NotificationSettings`, `UserSession` models)
- **API Catalog**: [docs/API_LIST.md](../../docs/API_LIST.md) (Section 4.8)
- **API Contract**: [docs/08-api-contract.md](../../docs/08-api-contract.md) (Section 10)
- **Frontend Admin Settings**: `developement/danielblair924_dashboard_front-end/components/Dashboard/settings/`

---

## 3. Step-by-Step Execution Plan
1. **DTOs & Validation**:
   - `UpdateAdminAccountDto`: `name`, `email`, `currentPassword`, `newPassword`, `confirmNewPassword`.
   - `UpdateNotificationSettingsDto`: `newSubmissionAlert`, `eventMilestoneAlert`, `systemDigestAlert`.
2. **SettingsService (`src/settings/settings.service.ts`)**:
   - `getAdminSettings`: Returns profile info, notification preferences, and list of active sessions.
   - `updateAdminAccount`: Validates current password, checks email uniqueness, hashes new password, updates User.
   - `updateNotifications`: Upserts `NotificationSettings` record.
   - `getActiveSessions`: Queries `UserSession` records ordered by `lastActive: desc`.
   - `revokeSession`: Deletes/revokes specific session by ID.
3. **AdminSettingsController (`src/settings/admin-settings.controller.ts`)**:
   - Protected with `JwtAuthGuard`, `RolesGuard`, `@Roles('ADMIN', 'SUPERADMIN')`.
   - Routes:
     - `GET /api/admin/settings`
     - `PATCH /api/admin/settings/account`
     - `PATCH /api/admin/settings/notifications`
     - `GET /api/admin/settings/sessions`
     - `DELETE /api/admin/settings/sessions/:id`
4. **Testing & Verification**:
   - Unit tests covering all controller routes, credential validations, and session management.
   - NestJS clean compilation (`yarn build`) and Thanos verification gate.

---

## 4. Expected Outputs
- `src/settings/dto/update-admin-account.dto.ts`
- `src/settings/dto/update-notifications.dto.ts`
- `src/settings/settings.service.ts` & `src/settings/settings.service.spec.ts`
- `src/settings/admin-settings.controller.ts` & `src/settings/admin-settings.controller.spec.ts`
- `src/settings/settings.module.ts`

---

## 5. Acceptance Criteria
- [x] Admin can retrieve account summary, notification toggles, and session list.
- [x] Updating account validates current password before accepting new password.
- [x] Notification toggles persist accurately in `NotificationSettings`.
- [x] Active device sessions list device type, IP address, and last active time.
- [x] Revoking a session deletes it from the database.
- [x] Unit tests pass cleanly and NestJS builds with zero errors.

---

## 6. Verification Evidence (Thanos)
- **Command**: `bash scripts/verify-task.sh TASK-008`
- **Status**: `PASSED`
- **Output Log**:
  - `Test Suites`: 26 passed, 26 total
  - `Tests`: 228 passed, 228 total
  - `Build`: NestJS build completed cleanly (`yarn build` in 4.12s)
  - `Verification Gate`: Passed (Prisma schema & backend contracts verified)

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-009 শুরু করো। [Tier: LEVEL_LIGHT]
```
