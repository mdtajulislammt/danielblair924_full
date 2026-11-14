# 07 — Database Design & Prisma Schema: FMC Platform

> **Owner**: `edith` (Backend & Data Specialist)  
> **Status**: Production Baseline (Derived from Codebase Discovery)  
> **Target Database Engine**: PostgreSQL 15+  
> **ORM Version**: Prisma ORM 7.10.0 (`@prisma/client`, `@prisma/adapter-pg`, `pg: ^8.23.0`)  
> **Prisma Configuration**: `developement/danielblair924_backend/prisma7.config.ts`  
> **Schema Location**: `developement/danielblair924_backend/prisma/schema.prisma`  

---

## 1. Database Architecture & Conventions

- **Naming Conventions**:
  - Tables: Pluralized `snake_case` using Prisma `@@map("table_name")`.
  - Columns: `snake_case` in SQL database mapped via `@map("column_name")`.
  - Prisma Models & Fields: PascalCase for models (`User`, `Event`), camelCase for fields (`firstName`, `totalDistance`).
- **Primary Keys**: UUID v4 (`String @id @default(uuid())`) or Auto-increment BigInt/Int where appropriate. To guarantee distributed consistency, UUID v4 is standard across all entities.
- **Timestamps**: Every table contains `createdAt DateTime @default(now()) @map("created_at")` and `updatedAt DateTime @updatedAt @map("updated_at")`.
- **Soft Deletion**: Status enums (`INACTIVE`, `DRAFT`, `ENDED`, `REJECTED`) are used rather than physical deletion where data history is vital.

---

## 2. Prisma 7 Modern Configuration (`prisma7.config.ts`)

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

---

## 3. Comprehensive Prisma Schema Blueprint

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

// ----------------------------------------------------
// ENUMS
// ----------------------------------------------------

enum Role {
  SUPERADMIN
  ADMIN
  MEMBER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum EventStatus {
  DRAFT
  PUBLISHED
  COMPLETED
  CANCELLED
}

enum ChallengeScope {
  COMMUNITY_WIDE
  INDIVIDUAL
}

enum ChallengeStatus {
  DRAFT
  ACTIVE
  ENDED
}

enum SubmissionStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ActivityType {
  RUNNING
  WALKING
  CYCLING
}

enum BadgeTagType {
  EVENT
  RATW
  SPECIAL
}

// ----------------------------------------------------
// MODELS
// ----------------------------------------------------

/// User model represents club members and administrators.
model User {
  id                    String        @id @default(uuid())
  email                 String        @unique
  username              String?       @unique
  passwordHash          String        @map("password_hash")
  fname                 String?       @map("fname")
  lname                 String?       @map("lname")
  dateOfBirth           String?       @map("date_of_birth")
  city                  String?
  country               String?
  organization          String?
  avatarUrl             String?       @map("avatar_url")
  role                  Role          @default(MEMBER)
  status                UserStatus    @default(ACTIVE)
  totalDistanceKm       Float         @default(0.0) @map("total_distance_km")
  joinDate              DateTime      @default(now()) @map("join_date")
  
  // Recipient / Shipping Profile
  recipientName         String?       @map("recipient_name")
  recipientZipCode      String?       @map("recipient_zip_code")
  recipientCountry      String?       @map("recipient_country")
  recipientState        String?       @map("recipient_state")
  recipientCity         String?       @map("recipient_city")
  recipientAddress      String?       @map("recipient_address")
  recipientPhoneNumber  String?       @map("recipient_phone_number")
  
  // Relations
  submissions           Submission[]
  badges                UserBadge[]
  challengeEntries      ChallengeParticipant[]
  sessions              UserSession[]
  notificationSettings  NotificationSettings?
  newsPosts             NewsPost[]    @relation("AuthorNews")
  
  createdAt             DateTime      @default(now()) @map("created_at")
  updatedAt             DateTime      @updatedAt @map("updated_at")

  @@index([email])
  @@index([username])
  @@index([status])
  @@map("users")
}

/// Running events created by administrators (e.g. 5K, 10K, Half Marathon).
model Event {
  id              String             @id @default(uuid())
  title           String             @map("title")
  description     String             @db.Text
  eventDate       DateTime?          @map("event_date")
  distanceType    String?            @map("distance_type") // e.g., "5K", "10K", "Half Marathon"
  coverImageUrl   String?            @map("cover_image_url")
  status          EventStatus        @default(DRAFT)
  category        String?            @default("General")
  registeredCount Int                @default(0) @map("registered_count")
  
  // Relations
  requirements    EventRequirements?
  submissions     Submission[]
  
  createdAt       DateTime           @default(now()) @map("created_at")
  updatedAt       DateTime           @updatedAt @map("updated_at")

  @@index([status])
  @@index([eventDate])
  @@map("events")
}

/// Dynamic requirements and verification checklist for events and challenges.
model EventRequirements {
  id                          String    @id @default(uuid())
  eventId                     String?   @unique @map("event_id")
  challengeId                 String?   @unique @map("challenge_id")
  
  completeDistance            Boolean   @default(true) @map("complete_distance")
  uploadRunningEvidence       Boolean   @default(true) @map("upload_running_evidence")
  postOnTikTok                Boolean   @default(true) @map("post_on_tiktok")
  tiktokCaptionInstructions   String?   @db.Text @map("tiktok_caption_instructions")
  tagFirstMileClub            Boolean   @default(true) @map("tag_first_mile_club")
  tagCollaboratingPage        Boolean   @default(false) @map("tag_collaborating_page")
  collaboratingPageName       String?   @map("collaborating_page_name")
  useSpecificHashtag          Boolean   @default(true) @map("use_specific_hashtag")
  specificHashtag             String?   @map("specific_hashtag") // e.g. "#RunForLife2026"
  
  event                       Event?    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  challenge                   Challenge? @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  
  createdAt                   DateTime  @default(now()) @map("created_at")
  updatedAt                   DateTime  @updatedAt @map("updated_at")

  @@map("event_requirements")
}

/// Challenges (Community-wide like RATW - Run Around The World, or Individual).
model Challenge {
  id              String                 @id @default(uuid())
  title           String
  scope           ChallengeScope         @default(COMMUNITY_WIDE)
  description     String                 @db.Text
  coverImageUrl   String?                @map("cover_image_url")
  status          ChallengeStatus        @default(DRAFT)
  currentProgress Float                  @default(0.0) @map("current_progress")
  targetProgress  Float                  @default(500.0) @map("target_progress")
  progressUnit    String                 @default("km") @map("progress_unit")
  startDate       DateTime?              @map("start_date")
  endDate         DateTime?              @map("end_date")
  
  // Relations
  requirements    EventRequirements?
  participants    ChallengeParticipant[]
  submissions     Submission[]
  
  createdAt       DateTime               @default(now()) @map("created_at")
  updatedAt       DateTime               @updatedAt @map("updated_at")

  @@index([status])
  @@index([scope])
  @@map("challenges")
}

/// Participation records for challenges.
model ChallengeParticipant {
  id              String     @id @default(uuid())
  challengeId     String     @map("challenge_id")
  userId          String     @map("user_id")
  individualKm    Float      @default(0.0) @map("individual_km")
  joinedAt        DateTime   @default(now()) @map("joined_at")
  
  challenge       Challenge  @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  user            User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([challengeId, userId])
  @@map("challenge_participants")
}

/// Proof submissions for run verifications.
model Submission {
  id              String           @id @default(uuid())
  userId          String           @map("user_id")
  eventId         String?          @map("event_id")
  challengeId     String?          @map("challenge_id")
  
  activityType    ActivityType     @default(RUNNING) @map("activity_type")
  distanceKm      Float            @map("distance_km")
  duration        String           // e.g. "1h 08m"
  pace            String?          // e.g. "5:30/km"
  runDate         DateTime         @map("run_date")
  
  // Proofs & Evidence
  stravaImageUrl  String?          @map("strava_image_url")
  gpsImageUrl     String?          @map("gps_image_url")
  postedOnTikTok  Boolean          @default(false) @map("posted_on_tiktok")
  taggedClub      Boolean          @default(false) @map("tagged_club")
  usedHashtag     Boolean          @default(false) @map("used_hashtag")
  
  // Verification State
  status          SubmissionStatus @default(PENDING)
  rejectionReason String?          @db.Text @map("rejection_reason")
  reviewedAt      DateTime?        @map("reviewed_at")
  reviewedById    String?          @map("reviewed_by_id")
  
  // Relations
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  event           Event?           @relation(fields: [eventId], references: [id], onDelete: SetNull)
  challenge       Challenge?       @relation(fields: [challengeId], references: [id], onDelete: SetNull)
  
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @updatedAt @map("updated_at")

  @@index([userId])
  @@index([status])
  @@index([eventId])
  @@index([challengeId])
  @@map("submissions")
}

/// Achievement badges for gamification.
model Badge {
  id          String        @id @default(uuid())
  slug        String        @unique // e.g. "first-5k", "ratw-champion"
  name        String
  description String        @db.Text
  iconUrl     String        @map("icon_url")
  tagType     BadgeTagType  @default(EVENT) @map("tag_type")
  isActive    Boolean       @default(true) @map("is_active")
  earnedCount Int           @default(0) @map("earned_count")
  
  // Relations
  userBadges  UserBadge[]
  
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  @@index([slug])
  @@index([isActive])
  @@map("badges")
}

/// Join table for awarded badges.
model UserBadge {
  id        String    @id @default(uuid())
  userId    String    @map("user_id")
  badgeId   String    @map("badge_id")
  earnedAt  DateTime  @default(now()) @map("earned_at")
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge     Badge     @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
  @@map("user_badges")
}

/// Rich text news articles published by administrators.
model NewsPost {
  id            String    @id @default(uuid())
  title         String
  body          String    @db.Text // HTML from Jodit/Quill editor
  coverImageUrl String?   @map("cover_image_url")
  publishDate   DateTime  @default(now()) @map("publish_date")
  authorId      String?   @map("author_id")
  
  author        User?     @relation("AuthorNews", fields: [authorId], references: [id], onDelete: SetNull)
  
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@index([publishDate])
  @@map("news_posts")
}

/// Admin notification preferences.
model NotificationSettings {
  id                          String    @id @default(uuid())
  userId                      String    @unique @map("user_id")
  newSubmissionAlert          Boolean   @default(true) @map("new_submission_alert")
  newRegistrationAlert        Boolean   @default(true) @map("new_registration_alert")
  weeklySummaryEmail          Boolean   @default(false) @map("weekly_summary_email")
  eventPublishedConfirmation  Boolean   @default(true) @map("event_published_confirmation")
  badgeEarnedNotifications    Boolean   @default(false) @map("badge_earned_notifications")
  
  user                        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt                   DateTime  @default(now()) @map("created_at")
  updatedAt                   DateTime  @updatedAt @map("updated_at")

  @@map("notification_settings")
}

/// Active security sessions for monitoring and revocation.
model UserSession {
  id           String    @id @default(uuid())
  userId       String    @map("user_id")
  device       String    // e.g. "Chrome on macOS"
  location     String?   // e.g. "Dhaka, BD"
  isCurrent    Boolean   @default(false) @map("is_current")
  refreshToken String?   @map("refresh_token")
  expiresAt    DateTime  @map("expires_at")
  
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  @@index([userId])
  @@map("user_sessions")
}
```

---

## 4. Query Optimization & Indexing Guidelines

1. **Composite Indexes**:
   - `User`: Index on `[email]`, `[username]`, and `[status]`.
   - `Submission`: Index on `[userId]`, `[status]`, `[eventId]`, and `[challengeId]` for instantaneous filtering by review status.
   - `Event` & `Challenge`: Index on `[status]` for fast retrieval of published and active items.
2. **Cursor-Based Pagination**:
   - For all large tables (`MembersTable`, `SubmissionPage`, `NewsTable`), use Prisma cursor queries:
     ```typescript
     prisma.submission.findMany({
       take: limit,
       skip: 1,
       cursor: { id: cursorId },
       where: { status },
       orderBy: { createdAt: 'desc' },
     });
     ```
3. **Cascading Deletions**:
   - User relations (`UserBadge`, `ChallengeParticipant`, `NotificationSettings`, `UserSession`) cascade on user deletion.
   - Event and Challenge requirements cascade on deletion of the parent entity.
   - Historical submissions retain reference with `onDelete: SetNull` or soft-delete.
