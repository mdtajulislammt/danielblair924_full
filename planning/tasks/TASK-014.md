# TASK-014: Frontend API Integration — Badges, News & Admin Settings

> **Status**: `DONE`  
> **Assignee**: `friday` (Frontend Web Specialist)  
> **Priority**: `P2` (Normal)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,000 tokens)  
> **Dependencies**: `TASK-013`  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `friday`, connect Badges creation, News publishing, and Admin Account Settings with the NestJS backend:
- Badges grid with upload icon, title, description, and required KM criteria.
- News article manager with rich text (`JoditEditorWrapper`) and publish status.
- Admin profile update, notification toggles, and active security sessions list.

---

## 2. API Contracts & Service
- **Services**:
  - `service/badge/badge.service.ts`
  - `service/news/news.service.ts`
  - `service/settings/settings.service.ts`
- **Endpoints**:
  - `GET /api/badges`, `POST /api/badges`, `PATCH /api/badges/:id`, `DELETE /api/badges/:id`
  - `GET /api/admin/news`, `POST /api/admin/news`, `PATCH /api/admin/news/:id`, `DELETE /api/admin/news/:id`
  - `PATCH /api/admin/settings/account`
  - `PATCH /api/admin/settings/notifications`
  - `GET /api/admin/settings/sessions`, `DELETE /api/admin/settings/sessions/:id`

---

## 3. UI Components Wired
1. `components/Dashboard/badges/Badges.tsx`, `BadgeCard.tsx`, `CreateBadges.tsx`, `EditBadges.tsx`
2. `components/Dashboard/news/News.tsx`, `NewsTable.tsx`, `CreatePost.tsx`, `EditPost.tsx`
3. `components/Dashboard/settings/AdminAccountSection.tsx`, `NotificationsSection.tsx`, `SecuritySection.tsx`

---

## 4. Acceptance Criteria
- [x] Badges page loads real badges and supports creating, editing, and deleting them with 6 UI states.
- [x] News articles can be published, drafted, listed, and edited with rich text (`JoditEditorWrapper`).
- [x] Admin settings update account info, password, notification preferences, and revoke login sessions.
- [x] Thanos verification passes: `bash scripts/verify-task.sh TASK-014`.
