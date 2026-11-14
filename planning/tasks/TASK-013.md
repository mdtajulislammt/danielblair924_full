# TASK-013: Frontend API Integration — Events & RATW Challenges

> **Status**: `DONE`  
> **Assignee**: `friday` (Frontend Web Specialist)  
> **Priority**: `P2` (Normal)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,000 tokens)  
> **Dependencies**: `TASK-012`  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `friday`, connect Events and Challenges (RATW) modules in the Admin Dashboard with the NestJS backend:
- Display active and upcoming running events list.
- Multi-step event creation wizard (`/dashboard/events/edite`) with dates, distance, rules, and cover images.
- RATW (Run Around The World) challenge catalog, target KM progress bar, and destination milestones.

---

## 2. API Contracts & Service
- **Services**: `service/event/event.service.ts` & `service/event/challenge.service.ts`
- **Endpoints**:
  - `GET /api/admin/events`, `POST /api/admin/events`, `PATCH /api/admin/events/:id`, `DELETE /api/admin/events/:id`
  - `GET /api/admin/challenges`, `POST /api/admin/challenges`, `GET /api/admin/challenges/:id/destinations`, `GET /api/admin/challenges/:id/participants`
  - `POST /api/admin/media/upload`

---

## 3. UI Components Wired
1. `app/(admin)/dashboard/events/page.tsx` — Dynamic database events grid with search, status filters, and loading skeletons.
2. `components/Dashboard/event/EventDetailsForm.tsx` & `EventRequirementsForm.tsx` — Multi-step wizard with live media upload, prefill for edit mode, and database persistence.
3. `components/Dashboard/event/EventMemberPage.tsx` — Event participants list with status badges and pagination.
4. `components/Dashboard/challenges/ChallengePage.tsx` — RATW community and individual challenges with progress bar and scope badges.
5. `components/Dashboard/challenges/ChallengeDetailsForm.tsx` — Multi-step challenge wizard with goal target and image upload.
6. `app/(admin)/dashboard/challenges/[id]/page.tsx` & `ChallengeDestinationsTable.tsx` — Live overview metrics, interactive neon world map, and country milestones with medals.
7. `components/Dashboard/challenges/ChallengeParticipantsTable.tsx` & `ChallengeRequirementsList.tsx` — Leaderboard and verification criteria.

---

## 4. Acceptance Criteria
- [x] Events page shows real database events.
- [x] Creating an event successfully posts payload and uploads cover image.
- [x] Challenges page shows RATW targets and destinations.
- [x] Thanos verification passes: `bash scripts/verify-task.sh TASK-013`.
