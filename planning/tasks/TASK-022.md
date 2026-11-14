# Task Specification: TASK-022

> **Task ID**: `TASK-022`  
> **Title**: Direct Strava API Auto-Sync & Automated Run Verification  
> **Assignee**: `edith` (Backend) & `thor` (Mobile)  
> **Status**: `READY`  
> **Priority**: `P1`  
> **Complexity Tier**: `HEAVY`  
> **Dependencies**: `TASK-021` (Mobile System Integration - DONE)  

---

## 1. Context & Objective
Client Daniel requested direct Strava integration to simplify the runner flow and remove the requirement of manual submission approvals. When runners complete activities on Strava, FMC should automatically pull the activity, verify challenge rules, and credit kilometers directly into the member profile and RATW global map.

---

## 2. Scope & Technical Architecture

### 2.1 Database Schema Extensions (`edith` - Prisma)
* Extend `User` model:
  - `stravaAthleteId`: String? @unique
  - `stravaAccessToken`: String?
  - `stravaRefreshToken`: String?
  - `stravaTokenExpiresAt`: DateTime?
  - `isStravaConnected`: Boolean @default(false)
* Extend `Submission` model:
  - `stravaActivityId`: String? @unique
  - `source`: SubmissionSource @default(MANUAL) // MANUAL | STRAVA_AUTO

### 2.2 Backend Strava Module (`src/strava/`)
* `GET /api/strava/auth-url`: Generates Strava OAuth authorize URL with scopes `read,activity:read_all`.
* `GET /api/strava/callback`: Handles OAuth redirect, exchanges authorization code for tokens, and links to user profile.
* `GET /api/strava/status`: Returns whether user has an active Strava connection and athlete profile.
* `POST /api/strava/disconnect`: Revokes/disconnects Strava account.
* `POST /api/strava/webhook`: Strava event subscription endpoint:
  - Listens for `activity:create` events.
  - Fetches activity details (distance, moving time, average speed, polyline map).
  - Automatically creates an `APPROVED` submission.
  - Updates user cumulative kilometers, streaks, active events, and RATW global pool.

### 2.3 Mobile Client UI & Flow (`thor` - Flutter)
* Profile / Settings: Add "Connect Strava" branded CTA button (`#FC5200`).
* OAuth in-app browser redirect flow using `url_launcher` / custom tabs.
* Connection status indicator on runner profile: "Strava Connected (Auto-Sync Active)".
* Information banner on Submit Run screen explaining auto-sync benefits.

---

## 3. Acceptance Criteria
- [ ] Prisma schema updated and migrations applied cleanly.
- [ ] OAuth token exchange and automatic refresh token rotation implemented.
- [ ] Webhook receiver parses Strava activity payload and records verified run.
- [ ] Runner lifetime distance and RATW map automatically increment without manual admin intervention.
- [ ] Unit tests for StravaService and StravaController passing at 100%.
- [ ] Mobile UI displays clear connection status and handles connect/disconnect flows.

