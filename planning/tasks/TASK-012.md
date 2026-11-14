# TASK-012: Frontend API Integration — Members & Runner Management

> **Status**: `DONE`  
> **Assignee**: `friday` (Frontend Web Specialist)  
> **Priority**: `P1` (High)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,000 tokens)  
> **Dependencies**: `TASK-011`  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `friday`, connect the Members Management module in the Admin Dashboard (`components/Dashboard/memberPage/`) with the NestJS backend API:
- Fetch paginated list of registered runners with search and filtering.
- Display lifetime KM, total runs, joined date, and badges count.
- Open runner profile drawer/sidebar showing personal bio, city, country, earned badges, and submissions history.

---

## 2. API Contracts & Service
- **Service**: `service/member/member.service.ts`
- **Endpoints**:
  - `GET /api/admin/members?page=1&limit=10&search=&status=`
  - `GET /api/admin/members/:id`
  - `GET /api/admin/members/:id/badges`
  - `GET /api/admin/members/:id/submissions`
  - `PATCH /api/admin/members/:id/status`

---

## 3. UI Components Wired
1. `components/Dashboard/memberPage/MembersTable.tsx`
2. `components/Dashboard/memberPage/UserProfileSidebar.tsx`
3. `components/Dashboard/memberPage/ActivityPage.tsx`
4. `components/Dashboard/memberPage/SubmissionsPage.tsx`
5. `components/Dashboard/memberPage/BadgesPage.tsx`
6. `components/Dashboard/DashboardUserTable.tsx`
7. `service/member/member.service.ts`

---

## 4. Acceptance Criteria
- [x] Member table renders real runners from `GET /api/admin/members`.
- [x] Search input queries runner names, emails, and usernames with debouncing.
- [x] Status filters (`All`, `Active`, `Inactive`) query live backend statuses.
- [x] Clicking a runner opens profile with live details, lifetime distance, contact info, and status toggling (Suspend/Activate).
- [x] Runner tabs (Activity, Submissions, Badges) fetch live individual records.
- [x] Dashboard recent submissions table displays real runner runs.
- [x] All Figma dark athletic design tokens, pagination, and loading skeletons preserved.
- [x] Thanos verification passes: `bash scripts/verify-task.sh TASK-012`.

