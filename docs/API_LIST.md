# 📡 FMC (First Mile Club) Complete API List & Specifications

> **Target Architecture**: NestJS 11 REST API  
> **Backend Directory**: `developement/danielblair924_backend/`  
> **Base URL**: `http://localhost:4000/api`  
> **Global Prefix**: `/api`  
> **Consumers**:
> 1. 🖥️ **Web Admin Dashboard** (`developement/danielblair924_dashboard_front-end`)
> 2. 📱 **Mobile Runner Application** (FMC Mobile App)

---

## 📑 Table of Contents

1. [Global Response & Error Standards](#1-global-response--error-standards)
2. [Authentication & Account APIs (Shared / Mobile / Admin)](#2-authentication--account-apis)
3. [Runner Mobile App APIs](#3-runner-mobile-app-apis)
   - [3.1 Runner Profile & Lifetime Stats](#31-runner-profile--lifetime-stats)
   - [3.2 Run Proof Submission Workflow](#32-run-proof-submission-workflow)
   - [3.3 Events & Challenge Participation](#33-events--challenge-participation)
   - [3.4 Gamification Badges & Finisher Cards](#34-gamification-badges--finisher-cards)
   - [3.5 Community Leaderboard & RATW Progress](#35-community-leaderboard--ratw-progress)
4. [Web Admin Dashboard APIs](#4-web-admin-dashboard-apis)
   - [4.1 Dashboard Analytics & KPIs](#41-dashboard-analytics--kpis)
   - [4.2 Members Management](#42-members-management)
   - [4.3 Run Submissions Moderation](#43-run-submissions-moderation)
   - [4.4 Events Management](#44-events-management)
   - [4.5 Challenges & RATW Management](#45-challenges--ratw-management)
   - [4.6 Badges & Gamification Management](#46-badges--gamification-management)
   - [4.7 News & Announcements](#47-news--announcements)
   - [4.8 Admin Settings & Security Sessions](#48-admin-settings--security-sessions)

---

## 1. Global Response & Error Standards

### Success Envelope (Standard)
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

### Paginated List Envelope
```json
{
  "status": "success",
  "data": {
    "items": [ ... ],
    "pagination": {
      "totalItems": 1284,
      "currentPage": 1,
      "totalPages": 129,
      "itemsPerPage": 10
    }
  }
}
```

### Error Envelope
```json
{
  "statusCode": 400,
  "message": "Invalid credentials / validation error",
  "error": "Bad Request",
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

---

## 2. Authentication & Account APIs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user (Admin or Member) and return JWT access token |
| `POST` | `/api/auth/register` | Public | Register new runner account with username, email, password |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token via email |
| `PATCH` | `/api/auth/reset-password` | Public | Reset password using verified token |
| `GET` | `/api/user/me` | Authenticated | Retrieve authenticated user's profile and roles |
| `PATCH` | `/api/user/profile` | Authenticated | Update user personal details, location, and shipping address |
| `PATCH` | `/api/user/avatar` | Authenticated | Upload and update profile picture (`multipart/form-data`) |
| `PATCH` | `/api/user/password` | Authenticated | Change current password |

---

## 3. Runner Mobile App APIs

### 3.1 Runner Profile & Lifetime Stats

#### `GET /api/runner/dashboard`
- **Access**: Runner (`Bearer Token`)
- **Purpose**: Loads the mobile home screen header (`84 KM LIFETIME`), active challenges, and pinned events.
- **Response**:
```json
{
  "status": "success",
  "data": {
    "lifetimeDistanceKm": 84.0,
    "eventsJoined": 8,
    "badgesEarned": 5,
    "currentRank": 12,
    "activeChallenge": {
      "id": "ch-ratw-1",
      "title": "Run Around the World",
      "currentProgress": 342,
      "targetProgress": 500,
      "progressUnit": "km"
    },
    "recentActivities": [
      {
        "id": "sub-1",
        "distance": "8.24 KM",
        "date": "May 18, 2026",
        "status": "Approved"
      },
      {
        "id": "sub-2",
        "distance": "12.60 KM",
        "date": "May 16, 2026",
        "status": "Pending"
      }
    ]
  }
}
```

#### `GET /api/runner/activities`
- **Query Params**: `page=1`, `limit=10`
- **Purpose**: Paginated list of runner's past runs.

---

### 3.2 Run Proof Submission Workflow

#### `POST /api/submissions/draft`
- **Access**: Runner
- **Purpose**: Step 1 — Initialize run submission with telemetry metrics.
- **Request Body**:
```json
{
  "eventId": "evt-5k-1",
  "challengeId": "ch-ratw-1",
  "activityType": "RUNNING",
  "distanceKm": 5.2,
  "duration": "29:57",
  "pace": "5:45 /km",
  "runDate": "2026-08-17T07:18:00Z"
}
```

#### `POST /api/submissions/:id/proof-images`
- **Access**: Runner
- **Content-Type**: `multipart/form-data`
- **Purpose**: Step 2 — Upload Strava screenshot and/or GPS route screenshot.
- **Fields**:
  - `stravaImage`: File (PNG/JPG <= 5MB)
  - `gpsImage`: File (PNG/JPG <= 5MB)

#### `POST /api/submissions/:id/finalize`
- **Access**: Runner
- **Purpose**: Step 3 — Submit social media verification tags and mark as PENDING moderation.
- **Request Body**:
```json
{
  "postedOnTikTok": true,
  "tiktokVideoUrl": "https://www.tiktok.com/@runner/video/123456789",
  "taggedClub": true,
  "usedHashtag": true,
  "specificHashtagUsed": "#RunForLife2026"
}
```

#### `GET /api/submissions/:id/finisher-card`
- **Access**: Runner
- **Purpose**: Retrieve verified run finisher summary card with distance, pace, and congratulations badge.

---

### 3.3 Events & Challenge Participation

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/app/events` | Runner | List upcoming and active running events open for registration |
| `GET` | `/api/app/events/:id` | Runner | Event details, rules, required hashtags, and distance requirements |
| `POST` | `/api/app/events/:id/join` | Runner | Register for an upcoming event |
| `GET` | `/api/app/challenges` | Runner | List community-wide (RATW) and individual challenges |
| `GET` | `/api/app/challenges/:id` | Runner | Challenge milestones, current collective kilometers, destination map |
| `POST` | `/api/app/challenges/:id/join`| Runner | Opt into a challenge |

---

### 3.4 Gamification Badges & Finisher Cards

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/app/badges/my-badges` | Runner | List all earned badges with timestamps and locked badges |
| `GET` | `/api/app/badges/:slug` | Runner | Badge details, requirements, and total community members who earned it |

---

### 3.5 Community Leaderboard & RATW Progress

#### `GET /api/app/leaderboard`
- **Query Params**: `timeframe=weekly|monthly|all-time`, `limit=50`
- **Response**: Top runners ranked by distance (`Rakib S. - 198.7 KM`, etc.).

#### `GET /api/app/challenges/ratw/destinations`
- **Response**: List of global destination milestones (e.g. Rome, Paris, Tokyo) with status (`unlocked`, `locked`, `current`).

---

## 4. Web Admin Dashboard APIs

### 4.1 Dashboard Analytics & KPIs

#### `GET /api/admin/dashboard/stats`
- **Response**:
```json
{
  "status": "success",
  "data": {
    "activeMembers": 1284,
    "pendingSubmissions": 24,
    "upcomingEvents": 7,
    "upcomingChallenges": 12
  }
}
```

#### `GET /api/admin/dashboard/recent-activity`
- **Response**: Real-time stream of latest submissions, approvals, and new registrations.

---

### 4.2 Members Management

| Method | Endpoint | Query / Body | Purpose |
|---|---|---|---|
| `GET` | `/api/admin/members` | `page`, `limit`, `search`, `status`, `sortBy` | Paginated directory matching `MembersTable.tsx` |
| `GET` | `/api/admin/members/:id` | `id` | Member profile matching `UserProfileSidebar.tsx` |
| `GET` | `/api/admin/members/:id/badges` | `id` | Member's earned badges tab |
| `GET` | `/api/admin/members/:id/submissions` | `id` | Member's run submissions history |
| `GET` | `/api/admin/members/:id/activities` | `id` | Member's telemetry activities |
| `PATCH` | `/api/admin/members/:id/status` | `{ "status": "ACTIVE" \| "INACTIVE" }` | Deactivate/Activate member account |
| `POST` | `/api/admin/members` | `{ "fname", "lname", "email", "username", "role" }` | Admin provision member |

---

### 4.3 Run Submissions Moderation

| Method | Endpoint | Query / Body | Purpose |
|---|---|---|---|
| `GET` | `/api/admin/submissions` | `status=PENDING\|APPROVED\|REJECTED`, `page`, `limit` | Moderation queue |
| `GET` | `/api/admin/submissions/:id` | `id` | Detail inspection matching `SubmissionDetailPage.tsx` |
| `PATCH` | `/api/admin/submissions/:id/approve` | None | Approve run, increment user distance, unlock eligible badges |
| `PATCH` | `/api/admin/submissions/:id/reject` | `{ "reason": string }` | Reject run with explanation modal (`SubmissionModal.tsx`) |

---

### 4.4 Events Management

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/admin/events` | List all events with draft/published state and participant counts |
| `GET` | `/api/admin/events/:id` | Get event details, cover image, and step-two requirements |
| `POST` | `/api/admin/events` | Create new event with verification requirements |
| `PATCH` | `/api/admin/events/:id` | Edit event details, schedule date, or distance rules |
| `DELETE` | `/api/admin/events/:id` | Soft-delete / Archive event |

---

### 4.5 Challenges & RATW Management

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/admin/challenges` | List challenges with progress (`0/500 km`, `342/500 km`) |
| `GET` | `/api/admin/challenges/:id` | Challenge overview, requirements, and participant roster |
| `POST` | `/api/admin/challenges` | Create new challenge (Community-wide or Individual) |
| `PATCH` | `/api/admin/challenges/:id` | Update target distance, status (`DRAFT`, `ACTIVE`, `ENDED`) |
| `GET` | `/api/admin/challenges/:id/destinations` | Milestone destination check table |

---

### 4.6 Badges & Gamification Management

| Method | Endpoint | Content-Type | Purpose |
|---|---|---|---|
| `GET` | `/api/admin/badges` | `application/json` | List badges with earned counts and active toggles |
| `POST` | `/api/admin/badges` | `multipart/form-data` | Create badge (`name`, `description`, `icon`, `isActive`, `tagType`) |
| `PATCH` | `/api/admin/badges/:id` | `multipart/form-data` | Edit badge details or replace icon |
| `DELETE` | `/api/admin/badges/:id` | `application/json` | Archive badge |

---

### 4.7 News & Announcements

| Method | Endpoint | Content-Type | Purpose |
|---|---|---|---|
| `GET` | `/api/admin/news` | `application/json` | List published & draft articles |
| `GET` | `/api/admin/news/:id` | `application/json` | Get single news article with rich text HTML body |
| `POST` | `/api/admin/news` | `multipart/form-data` | Publish news post (`title`, `body`, `coverImage`, `publishDate`) |
| `PATCH` | `/api/admin/news/:id` | `multipart/form-data` | Edit news article |
| `DELETE` | `/api/admin/news/:id` | `application/json` | Delete news post |

---

### 4.8 Admin Settings & Security Sessions

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/admin/settings` | Get admin account details, notification toggles, active sessions |
| `PATCH` | `/api/admin/settings/account` | Update admin profile & password with validation |
| `PATCH` | `/api/admin/settings/notifications` | Update alert toggles (`newSubmissionAlert`, etc.) |
| `GET` | `/api/admin/settings/sessions` | List active logged-in browser devices |
| `DELETE` | `/api/admin/settings/sessions/:id` | Revoke a remote browser session |

