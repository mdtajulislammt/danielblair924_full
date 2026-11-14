# 08 — API Contracts: FMC Platform (Backend & Frontend Bridge)

> **Maintained by**: `edith` (Backend Specialist)  
> **Consulted by**: `friday` (Frontend Web Specialist)  
> **Status**: Production Baseline (Derived from Existing Codebase Audit)  
> **Base URL**: `http://localhost:4000/api`  
> **Frontend Client**: `developement/danielblair924_dashboard_front-end/lib/Fetch.ts` & `service/user/user.service.ts`  

---

## 1. Global Conventions & Protocol

### 1.1 Headers
- Standard Request Headers:
  - `Content-Type: application/json` (or `multipart/form-data` for file uploads)
  - `Authorization: Bearer <access_token>` (for authenticated routes)

### 1.2 Standard Success Response Envelope
All successful responses conform to the standard structure expected by the frontend:
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### 1.3 Standard Error Response Envelope
```json
{
  "statusCode": 400,
  "message": "Validation failed / Invalid input",
  "error": "Bad Request",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address."
    }
  ]
}
```

---

## 2. Authentication & User Profile APIs

### 2.1 User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@fmc.com",
  "password": "SecurePassword123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": "u-1234-5678",
      "email": "admin@fmc.com",
      "fname": "Admin",
      "lname": "User",
      "role": "ADMIN"
    }
  }
}
```

### 2.2 User Registration
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "username": "runner_john",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### 2.3 Get Current User Profile (`getUserDetails`)
- **Endpoint**: `GET /api/user/me`
- **Access**: Authenticated (`Bearer <token>`)
- **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "id": "u-1234-5678",
    "email": "admin@fmc.com",
    "username": "admin",
    "fname": "Admin",
    "lname": "User",
    "role": "ADMIN",
    "avatarUrl": "/profile.png"
  }
}
```

### 2.4 Update Current User Profile
- **Endpoint**: `PATCH /api/user`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "fname": "Rafi",
  "lname": "Ahmed",
  "date_of_birth": "1995-08-21",
  "city": "Dhaka",
  "country": "Bangladesh",
  "organization": "First Mile Club",
  "recipient_name": "Rafi Ahmed",
  "recipient_zip_code": "1205",
  "recipient_country": "Bangladesh",
  "recipient_state": "Dhaka",
  "recipient_city": "Dhaka",
  "recipient_address": "House 12, Road 4, Dhanmondi",
  "recipient_phone_number": "+880 1712 345678"
}
```

### 2.5 Update User Avatar
- **Endpoint**: `PATCH /api/user/avatar`
- **Access**: Authenticated
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `avatar` (image file).

### 2.6 Admin Provision User
- **Endpoint**: `POST /api/user`
- **Access**: Admin only
- **Request Body**:
```json
{
  "fname": "Nadia",
  "lname": "Islam",
  "username": "nadia_runs",
  "email": "nadia@example.com",
  "role_id": 2
}
```

### 2.7 Set/Confirm User Password
- **Endpoint**: `PATCH /api/user/:id/password`
- **Access**: Public / Token-authenticated
- **Request Body**:
```json
{
  "id": "u-1234",
  "token": "reset-or-activation-token",
  "email": "user@example.com",
  "password": "NewSecurePassword123!"
}
```

---

## 3. Dashboard Analytics APIs

### 3.1 Overview KPI Metrics
- **Endpoint**: `GET /api/admin/dashboard/stats`
- **Access**: Admin
- **Success Response (200 OK)**:
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

### 3.2 Recent Submissions & Activity Feed
- **Endpoint**: `GET /api/admin/dashboard/recent-activity`
- **Access**: Admin
- **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "sub-1",
      "member": "Rafi Ahmed",
      "activity": "Running",
      "date": "Aug 21",
      "status": "PENDING"
    }
  ]
}
```

---

## 4. Members Management APIs

### 4.1 List Members (Paginated)
- **Endpoint**: `GET /api/admin/members`
- **Query Parameters**:
  - `page`: default `1`
  - `limit`: default `10`
  - `search`: string filter by name/email
  - `status`: `ACTIVE` | `INACTIVE`
  - `sortBy`: `name` | `joinDate` | `totalDistance` | `events` | `badges`
- **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "m-1",
        "name": "Rafi Ahmed",
        "email": "rafi.ahmed@email.com",
        "avatarBg": "bg-[#2563eb]",
        "initials": "RA",
        "joinDate": "Jan 12, 2025",
        "totalDistance": "284 km",
        "events": 8,
        "badges": 5,
        "status": "Active"
      }
    ],
    "pagination": {
      "totalItems": 1284,
      "currentPage": 1,
      "totalPages": 129,
      "itemsPerPage": 10
    }
  }
}
```

### 4.2 Member Detailed Profile
- **Endpoint**: `GET /api/admin/members/:id`
- **Endpoint**: `GET /api/admin/members/:id/badges` (List earned badges)
- **Endpoint**: `GET /api/admin/members/:id/submissions` (List run submissions)
- **Endpoint**: `GET /api/admin/members/:id/activities` (List activity logs)

---

## 5. Run Submissions & Verification APIs

### 5.1 Submissions Queue
- **Endpoint**: `GET /api/admin/submissions`
- **Query Parameters**: `status=PENDING | APPROVED | REJECTED`, `page=1`, `limit=10`
- **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "sub-1",
        "member": "Rafi Ahmed",
        "event": "Run For Life 2026",
        "distance": "12.4 km",
        "date": "August 21, 2025",
        "duration": "1h 08m",
        "status": "Pending",
        "submittedAt": "August 21, 2025 · 9:42 AM"
      }
    ]
  }
}
```

### 5.2 Single Submission Detail
- **Endpoint**: `GET /api/admin/submissions/:id`
- **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "id": "sub-1",
    "member": "Rafi Ahmed",
    "submittedAt": "August 21, 2025 · 9:42 AM",
    "event": "Run For Life 2026",
    "distance": "12.4 km",
    "date": "August 21, 2025",
    "duration": "1h 08m",
    "stravaImageUrl": "/uploads/strava-1.png",
    "gpsImageUrl": "/uploads/gps-1.png",
    "postedOnTikTok": true,
    "taggedClub": true,
    "usedHashtag": true,
    "status": "PENDING"
  }
}
```

### 5.3 Approve Submission
- **Endpoint**: `PATCH /api/admin/submissions/:id/approve`
- **Access**: Admin

### 5.4 Reject Submission
- **Endpoint**: `PATCH /api/admin/submissions/:id/reject`
- **Access**: Admin
- **Request Body**:
```json
{
  "reason": "TikTok post does not include the required hashtag #RunForLife2026."
}
```

---

## 6. Events Management APIs

### 6.1 List Events
- **Endpoint**: `GET /api/events`
- **Query Parameters**: `status=Published | Draft`, `category=10K | 5K`

### 6.2 Create Event (with Requirements)
- **Endpoint**: `POST /api/events`
- **Content-Type**: `application/json` (or `multipart/form-data`)
- **Request Body**:
```json
{
  "eventName": "Run For Life 2026",
  "description": "Annual community 10K running challenge.",
  "eventDate": "2026-09-10T08:00:00Z",
  "distanceType": "10K",
  "requirements": {
    "completeDistance": true,
    "uploadRunningEvidence": true,
    "postOnTikTok": true,
    "tiktokCaptionInstructions": "Tag @firstmileclub in your post",
    "tagFirstMileClub": true,
    "tagCollaboratingPage": false,
    "useSpecificHashtag": true,
    "specificHashtag": "#RunForLife2026"
  }
}
```

### 6.3 Update Event
- **Endpoint**: `PATCH /api/events/:id`

---

## 7. Challenges Management APIs

### 7.1 List Challenges
- **Endpoint**: `GET /api/challenges`
- **Query Parameters**: `scope=Community-wide | Individual`, `status=Active | Ended | Draft`

### 7.2 Create Challenge
- **Endpoint**: `POST /api/challenges`
- **Request Body**:
```json
{
  "challengeName": "Run Around the World",
  "type": "Community-wide",
  "description": "Together we conquer 500 kilometers across the community.",
  "targetProgress": 500,
  "progressUnit": "km",
  "requirements": {
    "completeDistance": true,
    "uploadRunningEvidence": true,
    "postOnTikTok": true,
    "tagFirstMileClub": true,
    "useSpecificHashtag": true,
    "specificHashtag": "#RATW2026"
  }
}
```

### 7.3 Get Challenge Destinations & Progress
- **Endpoint**: `GET /api/challenges/:id/destinations`
- **Endpoint**: `GET /api/challenges/:id/participants`

---

## 8. Badges & Gamification APIs

### 8.1 List Badges
- **Endpoint**: `GET /api/badges`
- **Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "first-5k",
      "name": "First 5K",
      "description": "Awarded for completing your first 5K run.",
      "iconUrl": "/badges/first-5k.png",
      "tagType": "EVENT",
      "isActive": true,
      "earnedCount": 284
    }
  ]
}
```

### 8.2 Create Badge
- **Endpoint**: `POST /api/badges`
- **Content-Type**: `multipart/form-data`
- **Form Fields**: `name`, `description`, `isActive` (`true`|`false`), `icon` (file <= 2MB).

### 8.3 Update / Edit Badge
- **Endpoint**: `PATCH /api/badges/:id`

---

## 9. News & Announcements APIs

### 9.1 List News Posts
- **Endpoint**: `GET /api/news`

### 9.2 Create News Post
- **Endpoint**: `POST /api/news`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `title`: string (min 3, max 120 chars)
  - `body`: string (HTML rich text content)
  - `publishDate`: ISO 8601 string
  - `coverImage`: image file (max 5MB)

### 9.3 Update News Post
- **Endpoint**: `PATCH /api/news/:id`

---

## 10. Admin Settings & Security APIs

### 10.1 Get Settings
- **Endpoint**: `GET /api/admin/settings`
- **Returns**: Account details, notification toggles, active sessions.

### 10.2 Update Admin Account Credentials
- **Endpoint**: `PATCH /api/admin/settings/account`
- **Request Body**:
```json
{
  "name": "Super Admin",
  "email": "admin@fmc.com",
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword456!",
  "confirmNewPassword": "NewSecurePassword456!"
}
```

### 10.3 Update Notification Toggles
- **Endpoint**: `PATCH /api/admin/settings/notifications`
- **Request Body**:
```json
{
  "newSubmissionAlert": true,
  "newRegistrationAlert": true,
  "weeklySummaryEmail": false,
  "eventPublishedConfirmation": true,
  "badgeEarnedNotifications": false
}
```

### 10.4 List & Revoke Active Sessions
- **Endpoint**: `GET /api/admin/settings/sessions`
- **Endpoint**: `DELETE /api/admin/settings/sessions/:id`
