# TASK-020: Mobile Leaderboard, Profile Stats & News Feed

> **Status**: `DONE`  
> **Assignee**: `thor` (Mobile Specialist)  
> **Priority**: `P1` (High)  
> **Complexity Level**: `LEVEL: STANDARD`  
> **Token Budget**: Medium (<2,500 tokens)  
> **Dependencies**: `TASK-019`  
> **Master Board**: [planning/task.md](../task.md)  

---

## 1. Objective & User Story
As `thor`, wire the Leaderboard, Profile, Badges, and News screens to live NestJS APIs:
- Wire `LeaderboardTabScreen` to `GET /api/members/leaderboard`. Populate Podium (1st, 2nd, 3rd) and paginated list.
- Wire `ProfileTabScreen` and `RunningStatsScreen` to `GET /api/members/me/stats`. Display lifetime km, chart trends, and badges.
- Wire `AchivementsScreen` & `BadgePreviewScreen` to `GET /api/badges/my`.
- Wire `AllNewsScreen` & `NewsDetailsScreen` to `GET /api/news` and `GET /api/news/:id`.
- Wire `NfcScreen` & `NfcCheckedInStatusScreen` to check-in endpoints.

---

## 2. Acceptance Criteria
- [x] Leaderboard displays top runners by distance with podium rank.
- [x] Profile stats display verified lifetime kilometers and earned badges.
- [x] News articles rendered with title, cover image, and full content.
- [x] Automated verification passes: `bash scripts/verify-task.sh TASK-020`.
