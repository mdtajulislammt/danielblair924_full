# TASK-011: Frontend API Integration — Run Submissions Moderation Queue

> **Status**: `DONE`  
> **Assignee**: `friday` (Frontend Web Specialist)  
> **Priority**: `P1` (High)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,500 tokens)  
> **Dependencies**: `TASK-010` (Approved)  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `friday`, connect the Run Submissions Moderation Queue in the Next.js Admin Dashboard (`components/Dashboard/Submission/`) with the NestJS backend API:
- Fetch live submissions list with status filtering (`PENDING`, `APPROVED`, `REJECTED`) and pagination.
- View individual submission proof details (Strava screenshot, GPS route, runner pace, TikTok post tag).
- Execute **Approve** and **Reject** moderation actions with live updates.

---

## 2. API Contracts & Service
- **Service**: `service/submission/submission.service.ts`
- **Endpoints**:
  - `GET /api/admin/submissions?status=PENDING&page=1&limit=50`
  - `GET /api/admin/submissions/:id`
  - `PATCH /api/admin/submissions/:id/approve`
  - `PATCH /api/admin/submissions/:id/reject` (`{ reason: string }`)

---

## 3. UI Components Wired
1. `components/Dashboard/Submission/SubmissionPage.tsx`
2. `components/Dashboard/Submission/SubmissionDetailPage.tsx`
3. `components/Dashboard/Submission/SubmissionModal.tsx`
4. `service/submission/submission.service.ts`

---

## 4. Acceptance Criteria
- [x] Submissions table displays live runner submissions instead of mock data.
- [x] Filter tabs (`Pending`, `Approved`, `Rejected`) fetch corresponding statuses from API.
- [x] Approve button calls `PATCH /api/admin/submissions/:id/approve`.
- [x] Reject button prompts for reason and calls `PATCH /api/admin/submissions/:id/reject` with `{ reason: string }`.
- [x] Preserves all Figma styling, dark neon glow, and 6 mandatory UI states (loading skeleton, empty state, errors).
- [x] Thanos verification passes: `bash scripts/verify-task.sh TASK-011`.
