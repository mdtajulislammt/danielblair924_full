# TASK-002: Prisma 7 Database Schema & PostgreSQL Migration

> **Status**: `DONE`  
> **Assignee**: `edith` (Backend & Data Specialist)  
> **Priority**: `P0` (Critical)  
> **Complexity Level**: `HEAVY` (Relational Data Architecture)  
> **Token Budget**: Medium (~2,500 tokens)  
> **Model Advice**: High Reasoning Model (Sonnet / Pro / R1 / GPT-4o)  
> **Dependencies**: `TASK-001`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend & Data Specialist (`edith`), implement the production Prisma 7 schema in `developement/danielblair924_backend/prisma/schema.prisma` matching the verified specifications in `docs/07-database-design.md`. The schema must support all models needed for both the Web Admin Dashboard and the Runner Mobile App (`User`, `Event`, `EventRequirements`, `Challenge`, `ChallengeParticipant`, `Submission`, `Badge`, `UserBadge`, `NewsPost`, `NotificationSettings`, `UserSession`).

---

## 2. Inputs & Context Documents
- **Database Blueprint**: [docs/07-database-design.md](../../docs/07-database-design.md)
- **API List & Field Specifications**: [docs/API_LIST.md](../../docs/API_LIST.md)
- **Prisma Configuration**: `developement/danielblair924_backend/prisma7.config.ts`

---

## 3. Step-by-Step Execution Plan
1. **Model Definition**: Add enums (`Role`, `UserStatus`, `EventStatus`, `ChallengeScope`, `ChallengeStatus`, `SubmissionStatus`, `ActivityType`, `BadgeTagType`) and models to `developement/danielblair924_backend/prisma/schema.prisma`.
2. **Relations & Indexing**: Establish foreign keys, cascade rules, and query indexes on `[status]`, `[email]`, `[userId]`.
3. **Format & Validate**: Run `prisma format` and `prisma generate` in `developement/danielblair924_backend/`.
4. **Verification**: Verify schema builds without syntax or relation errors, and NestJS build passes with `PrismaModule`.

---

## 4. Expected Outputs
- `developement/danielblair924_backend/prisma/schema.prisma` fully populated.
- Generated Prisma client in `developement/danielblair924_backend/src/generated/prisma`.
- `developement/danielblair924_backend/src/prisma/prisma.service.ts` and `prisma.module.ts` created and verified.

---

## 5. Acceptance Criteria
- [x] Schema contains all 11 required domain models (`User`, `Event`, `EventRequirements`, `Challenge`, `ChallengeParticipant`, `Submission`, `Badge`, `UserBadge`, `NewsPost`, `NotificationSettings`, `UserSession`).
- [x] Prisma 7 client generates cleanly with `@prisma/adapter-pg`.
- [x] No changes made to frontend code.
- [x] Verification gate passes via `bash scripts/verify-task.sh TASK-002`.

---

## 6. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-003 শুরু করো। [Tier: LEVEL_HEAVY]
```
