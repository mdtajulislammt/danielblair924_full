# TASK-019: Mobile Events & RATW Interactive Map Integration

> **Status**: `DONE`  
> **Assignee**: `thor` (Mobile Specialist)  
> **Priority**: `P1` (High)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,500 tokens)  
> **Dependencies**: `TASK-018`  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `thor`, wire the Events and Run Around The World (RATW) Challenges screens to live backend APIs:
- Wire `EventsTabScreen` to `GET /api/events`. Render active/upcoming club events.
- Allow runners to join events via `POST /api/events/:id/join`.
- Wire `ChallengeTabScreen` to `GET /api/challenges`. Display community cumulative distance and progress percentage.
- Wire `JourneyFullMapScreen` to `GET /api/challenges/:id/destinations` and render interactive route milestones (lat/lng coordinates on `flutter_map`).
- Wire `JourneyLocationDetailScreen` and `JourneyLocationLockedScreen` with real destination data.

---

## 2. Acceptance Criteria
- [x] Events list populated from live backend (`EventsNotifier`, `GET /api/events`, filter tabs).
- [x] Runners can join events via live API (`POST /api/events/:id/join`) with optimistic UI update and snackbar feedback.
- [x] Challenge collective distance and progress bar reflect database milestones (`ChallengeNotifier`, `GET /api/challenges`).
- [x] Full map screen renders destination pins dynamically (`ReusableWorldMap` with dynamic `MapRoute` segments and milestone pins).
- [x] Milestone detail and locked screens receive dynamic destination data with coordinates, quote, badge icon, and required distance.
- [x] Automated verification passes: `bash scripts/verify-task.sh TASK-019`.
