# TASK-007: Backend News Articles & Media Upload APIs

> **Status**: `DONE`  
> **Assignee**: `edith` (Backend & Data Specialist)  
> **Priority**: `P1` (High)  
> **Complexity Level**: `STANDARD`  
> **Token Budget**: Medium (~2,500 tokens)  
> **Model Advice**: Standard Coding Model (Flash / Sonnet / V3 / 4o)  
> **Dependencies**: `TASK-003`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend & Data Specialist (`edith`), implement production-grade REST APIs for news articles and rich-text announcements (`NewsPost` model), supporting Jodit/Quill rich text HTML body storage, multipart/form-data cover image and media uploads, scheduled publishing dates, admin management CRUD, public runner news reader feeds, and mobile app news endpoints conforming to `docs/API_LIST.md` and `docs/08-api-contract.md`.

---

## 2. Inputs & Context Documents
- **Database Schema**: [developement/danielblair924_backend/prisma/schema.prisma](../../developement/danielblair924_backend/prisma/schema.prisma) (`NewsPost` model)
- **API Catalog**: [docs/API_LIST.md](../../docs/API_LIST.md) (Section 4.7)
- **API Contract**: [docs/08-api-contract.md](../../docs/08-api-contract.md) (Section 9)
- **Frontend Dashboard News Schema**: `developement/danielblair924_dashboard_front-end/components/Dashboard/news/postSchema.ts` & `NewsTable.tsx`

---

## 3. Step-by-Step Execution Plan
1. **Prisma Schema Update**:
   - Added `status` (`@default("PUBLISHED")`) with index `@@index([status])` to `NewsPost`.
   - Re-generated Prisma 7 client via `npx prisma generate`.
2. **DTOs & Validation**:
   - `CreateNewsDto`: `title` (3-120 chars), `body` (min 10 chars HTML), `publishDate`, `coverImageUrl`/`coverImage`, `status`, `isDraft`.
   - `UpdateNewsDto`: Partial updates for article fields.
   - `NewsQueryDto`: Paginated search with `page`, `limit`, `search` (case-insensitive in title or body), `status`, and `sort`.
3. **MediaService (`src/news/media.service.ts`)**:
   - Disk storage handling under `uploads/news` and `uploads/media`.
   - Supported MIME types (JPG, PNG, WEBP, GIF, SVG) with max 5MB validation.
   - Unique filename generation via `randomUUID()`.
   - Static asset serving via NestJS Express static assets (`/uploads/`).
4. **NewsService (`src/news/news.service.ts`)**:
   - `findAll`: Filter published articles for runners (`status: 'PUBLISHED'`, `publishDate <= now()`) or full filter for admins. Formats output with `id`, `title`, `body`, `icon`, `date` ("Aug 20, 2025"), `status` ("Published" | "Draft"), and author details.
   - `findById`: Single article details with full HTML reader view.
   - `create`: Creates article, uploads cover image if file attached, sets status/draft.
   - `update`: Updates title, HTML body, cover image, status, and publish date.
   - `delete`: Deletes news post.
5. **Controllers**:
   - `AdminNewsController` (`/api/admin/news`): Protected CRUD with `FileInterceptor('coverImage')`.
   - `NewsController` (`/api/news`): Public list/reader endpoints and admin mutation routes.
   - `AppNewsController` (`/api/app/news`): Mobile runner news feed.
   - `MediaController` (`/api/media/upload`, `/api/upload`, `/api/admin/media/upload`): Standalone image upload for Jodit rich text editor.
6. **Testing & Verification**:
   - 6 test suites with 42 unit tests covering all services, media handling, and controllers.
   - Total backend test suite: 24 test suites, 203 tests passing.

---

## 4. Expected Outputs
- `src/news/dto/create-news.dto.ts`
- `src/news/dto/update-news.dto.ts`
- `src/news/dto/news-query.dto.ts`
- `src/news/media.service.ts` & `src/news/media.service.spec.ts`
- `src/news/news.service.ts` & `src/news/news.service.spec.ts`
- `src/news/admin-news.controller.ts` & `src/news/admin-news.controller.spec.ts`
- `src/news/news.controller.ts` & `src/news/news.controller.spec.ts`
- `src/news/app-news.controller.ts` & `src/news/app-news.controller.spec.ts`
- `src/news/media.controller.ts` & `src/news/media.controller.spec.ts`
- `src/news/news.module.ts`

---

## 5. Acceptance Criteria
- [x] Admin can list, view, create, edit, and delete news articles (`/api/admin/news`).
- [x] Public runners can only view published articles with `publishDate <= now` (`/api/news`, `/api/app/news`).
- [x] Supports rich text HTML body storage from Jodit/Quill editor.
- [x] Supports cover image uploads via `multipart/form-data` and JSON image URLs.
- [x] Dedicated media upload endpoint (`/api/media/upload`, `/api/upload`) for inline rich text editor images.
- [x] Full unit test coverage for all endpoints and business logic (203/203 tests passing).
- [x] NestJS clean compilation (`yarn build`).
- [x] Automated verification gate passed (`bash scripts/verify-task.sh TASK-007`).

---

## 6. Verification Evidence (Thanos)
- **Command**: `bash scripts/verify-task.sh TASK-007`
- **Status**: `PASSED`
- **Output Log**:
```text
========================================================
🛡️  THANOS VERIFICATION GATE: TASK-007
========================================================
🔍 1. Checking Backend API & Schemas (Edith)...
  ✔ Prisma schema verified (developement/danielblair924_backend/prisma/schema.prisma).
  ✔ Backend contracts checked (developement/danielblair924_backend).
🔍 2. Checking Frontend Web & Components (Friday)...
  ✔ API client verified.
  ✔ Core UI primitives verified.
  ✔ Frontend component standards checked (developement/danielblair924_dashboard_front-end).
🔍 3. Checking Mobile App (Thor)...
  ℹ Mobile scope inactive or not configured (Skipped).
--------------------------------------------------------
✅ VERIFICATION PASSED: Task TASK-007 meets all criteria.
Status: READY TO MARK AS DONE
```

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-008 শুরু করো। [Tier: LEVEL_STANDARD]
```
