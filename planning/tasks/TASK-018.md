# TASK-018: Mobile Run Submissions & Multi-Step Evidence Flow

> **Status**: `DONE`  
> **Assignee**: `thor` (Mobile Specialist)  
> **Priority**: `P0` (Critical)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,500 tokens)  
> **Dependencies**: `TASK-017`  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `thor`, connect the multi-step run submission workflow to the live NestJS backend:
- Wire Step 1 (`SubmitRunLogScreen`): Capture distance (km), duration, pace, and date into Riverpod submission state.
- Wire Step 2 (`SubmitRunProofScreen`): Handle image selection and upload Strava / GPS screenshot via `POST /api/upload` (multipart) or base64.
- Wire Step 3: TikTok post link input and hashtag confirmation.
- Wire Step 4 (`SubmitRunConfirmScreen`): Post final submission payload to `POST /api/submissions`.
- Route to `SubmitRunStatusScreen` showing submission success feedback (`Pending Approval`).
- Display submitted runs in `RunHistoryScreen` from `GET /api/submissions/my`.

---

## 2. Acceptance Criteria
- [x] Run log details captured accurately in state.
- [x] Evidence screenshot upload uploads file and receives image URL.
- [x] Final submission successfully posted to `POST /api/submissions`.
- [x] Submission immediately appears in Admin Dashboard moderation review queue.
- [x] Automated verification passes: `bash scripts/verify-task.sh TASK-018`.

