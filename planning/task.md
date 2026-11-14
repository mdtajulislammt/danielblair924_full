# Avengers Task Board: FMC Platform

> **Statuses**: `BACKLOG` | `READY` | `IN_PROGRESS` | `BLOCKED` | `IN_REVIEW` | `FAILED` | `DONE` | `CANCELLED`  
> **Priorities**: `P0` (Critical) | `P1` (High) | `P2` (Normal) | `P3` (Low)  
> **Rule**: A task is `READY` only when all dependencies are `DONE`. A task is `DONE` only when acceptance criteria are met and Thanos has verified the actual test execution.  
> ⚠️ **Zero-Touch Policy**: Frontend source code is largely complete and must NOT be touched or refactored without explicit user approval.

---

## Active Task Board

| Task ID | Task Title | Assignee | Dependencies | Status | Priority | Complexity Tier | Verification |
|---|---|---|---|---|---|---|---|
| [`TASK-001`](tasks/TASK-001.md) | Scan Codebase, Baseline Audit & Figma Extraction | `iron_man` | None | `DONE` | `P0` | `STANDARD` | Passed |
| [`TASK-002`](tasks/TASK-002.md) | Prisma 7 Database Schema & PostgreSQL Migration | `edith` | `TASK-001` | `DONE` | `P0` | `HEAVY` | Passed |
| [`TASK-003`](tasks/TASK-003.md) | Backend Core Auth & Runner Profile APIs | `edith` | `TASK-002` | `DONE` | `P0` | `HEAVY` | Passed |
| [`TASK-004`](tasks/TASK-004.md) | Backend Run Submissions & Moderation APIs | `edith` | `TASK-003` | `DONE` | `P0` | `HEAVY` | Passed |
| [`TASK-005`](tasks/TASK-005.md) | Backend Events & Challenges (RATW) APIs | `edith` | `TASK-004` | `DONE` | `P1` | `STANDARD` | Passed |
| [`TASK-006`](tasks/TASK-006.md) | Backend Badges & Gamification APIs | `edith` | `TASK-003` | `DONE` | `P1` | `STANDARD` | Passed |
| [`TASK-007`](tasks/TASK-007.md) | Backend News Articles & Media Upload APIs | `edith` | `TASK-003` | `DONE` | `P1` | `STANDARD` | Passed |
| [`TASK-008`](tasks/TASK-008.md) | Backend Admin Settings, Notifications & Sessions | `edith` | `TASK-003` | `DONE` | `P1` | `STANDARD` | Passed |
| [`TASK-009`](tasks/TASK-009.md) | Comprehensive API Verification & Thanos Test Suite | `thanos` | `TASK-004`–`008` | `DONE` | `P0` | `LIGHT` | Passed |
| [`TASK-010`](tasks/TASK-010.md) | Frontend API Integration Review (Requires Approval) | `friday` | `TASK-009` | `DONE` | `P2` | `STANDARD` | Passed |
| [`TASK-011`](tasks/TASK-011.md) | Frontend API Integration: Submissions Moderation Queue | `friday` | `TASK-010` | `DONE` | `P1` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-012`](tasks/TASK-012.md) | Frontend API Integration: Members & Runner Management | `friday` | `TASK-011` | `DONE` | `P1` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-013`](tasks/TASK-013.md) | Frontend API Integration: Events & RATW Challenges | `friday` | `TASK-012` | `DONE` | `P2` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-014`](tasks/TASK-014.md) | Frontend API Integration: Badges, News & Admin Settings | `friday` | `TASK-013` | `DONE` | `P2` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-015`](tasks/TASK-015.md) | End-to-End System Integration & Production Readiness Audit | `thanos` / `ultron` | `TASK-014` | `DONE` | `P1` | `LIGHT` | Passed (`verify-task.sh`) |
| [`TASK-016`](tasks/TASK-016.md) | Mobile Networking Foundation & API Client Setup | `thor` | `TASK-015` | `DONE` | `P0` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-017`](tasks/TASK-017.md) | Mobile Authentication & Session Flow Integration | `thor` | `TASK-016` | `DONE` | `P0` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-018`](tasks/TASK-018.md) | Mobile Run Submissions & Multi-Step Evidence Flow | `thor` | `TASK-017` | `DONE` | `P0` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-019`](tasks/TASK-019.md) | Mobile Events & RATW Interactive Map Integration | `thor` | `TASK-018` | `DONE` | `P1` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-020`](tasks/TASK-020.md) | Mobile Leaderboard, Profile Stats & News Feed | `thor` | `TASK-019` | `DONE` | `P1` | `STANDARD` | Passed (`verify-task.sh`) |
| [`TASK-021`](tasks/TASK-021.md) | Mobile End-to-End System Integration & QA Audit | `thanos` / `thor` | `TASK-020` | `DONE` | `P0` | `LIGHT` | Passed (`verify-task.sh`) |
| [`TASK-022`](tasks/TASK-022.md) | Direct Strava API Auto-Sync & Automated Run Verification | `edith` / `thor` | `TASK-021` | `READY` | `P1` | `HEAVY` | Pending |
| [`TASK-023`](tasks/TASK-023.md) | Real-Time Community Live Chat Room (WebSocket) | `edith` / `thor` | `TASK-021` | `READY` | `P2` | `STANDARD` | Pending |
| [`TASK-024`](tasks/TASK-024.md) | Club Merchandise & Product Showcase Catalog | `edith` / `friday` / `thor` | `TASK-021` | `READY` | `P2` | `STANDARD` | Pending |

---

## Task Roadmap Summary

1. **Phase 1 (Completed)**: System Discovery, Baseline Generation, Figma Analysis, Design System, API Contract & List in `docs/API_LIST.md`.
2. **Phase 2 (Completed)**: Edith builds the backend NestJS domain architecture and Prisma 7 database schema to make all APIs ready for both the Admin Dashboard and the Mobile App.
3. **Phase 3 (Completed)**: Thanos executes rigorous test suites ensuring 100% contract compliance with `docs/API_LIST.md` (240/240 tests passing).
4. **Phase 4 (Completed)**: Friday connects all Frontend Web pages (Submissions, Members, Events/Challenges, Badges, News, Admin Settings) with live NestJS APIs and preserves all Figma UI styling.
5. **Phase 5 (Completed)**: Full End-to-End System Integration, Verification & Production Readiness Audit (`TASK-015`). All 15 web & backend platform tasks complete.
6. **Phase 6 (Completed)**: Mobile Client API Integration & System QA Audit (`TASK-016` to `TASK-021`). Thor connects all 34 Flutter screens with live NestJS REST APIs, implementing secure storage, multipart proof uploads, interactive challenge map synchronization, and real-time runner profile stats. All 21 core platform tasks 100% completed.
7. **Phase 7 (Active / In Progress)**: Client Add-on Integrations & Final Deployment (`TASK-022` to `TASK-024`):
   - `TASK-022`: Direct Strava API Auto-Sync & Automated Run Verification.
   - `TASK-023`: Real-Time Community Live Chat Room (WebSocket Gateway).
   - `TASK-024`: Club Merchandise & Product Showcase Catalog (Admin + Mobile).
