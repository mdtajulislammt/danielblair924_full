# TASK-003: Backend Core Auth & Runner Profile APIs

> **Status**: `DONE`  
> **Assignee**: `edith` (Backend & Data Specialist)  
> **Priority**: `P0` (Critical)  
> **Complexity Level**: `HEAVY` (Authentication, JWT/RBAC & Profile Domain)  
> **Token Budget**: Medium (~3,500 tokens)  
> **Model Advice**: High-Reasoning / CoT Model (Sonnet / Pro / R1 / GPT-4o)  
> **Dependencies**: `TASK-002`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend & Data Specialist (`edith`), implement the production authentication and user profile domain in `developement/danielblair924_backend/src/auth/` and `src/users/`. These modules provide JWT authentication with refresh tokens, password hashing via bcrypt, role-based access control (`SUPERADMIN`, `ADMIN`, `MEMBER`), and full runner profile management (including shipping recipient details) matching `docs/API_LIST.md` and `docs/08-api-contract.md`.

---

## 2. Inputs & Context Documents
- **Database Schema**: `developement/danielblair924_backend/prisma/schema.prisma`
- **Prisma Client**: `developement/danielblair924_backend/src/generated/prisma/client.js`
- **Database & Prisma Service**: `developement/danielblair924_backend/src/prisma/prisma.service.ts`
- **API List & Field Specifications**: [docs/API_LIST.md](../../docs/API_LIST.md)
- **API Contract**: [docs/08-api-contract.md](../../docs/08-api-contract.md)

---

## 3. Step-by-Step Execution Plan
1. **Package Manager Standardization**:
   - Conformed backend package manager to Yarn (`yarn.lock`) per developer directive.
   - Installed runtime dependencies: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcryptjs`, `class-validator`, `class-transformer`.
   - Installed dev dependencies: `@types/bcryptjs`, `@types/passport-jwt`.
2. **Auth Module Setup**:
   - Implemented `AuthService` & `AuthController`:
     - `POST /api/auth/register` (Member registration with hashed password).
     - `POST /api/auth/login` (Admin & Member login, issue JWT access + refresh tokens, records `UserSession`).
     - `POST /api/auth/refresh` (Refresh access token using valid session/refresh token).
     - `POST /api/auth/logout` (Revoke active session in `UserSession`).
     - `POST /api/auth/forgot-password` & `POST /api/auth/reset-password` / `PATCH /api/auth/reset-password`.
3. **Guards & Decorators**:
   - Implemented `JwtAuthGuard` and `RolesGuard` (`@Roles('ADMIN', 'SUPERADMIN', 'MEMBER')`).
   - Implemented `@CurrentUser()` decorator and `@Public()` bypass.
4. **Users & Profile Module**:
   - Implemented `UsersService` & `UsersController`:
     - `GET /api/user/me` & `GET /api/user/profile` (Current runner/admin profile).
     - `PATCH /api/user` & `PATCH /api/user/profile` (Profile details update).
     - `PUT /api/user/profile/shipping` (Shipping address update for medals/merchandise).
     - `PATCH /api/user/password` (Password change with current password validation).
     - `GET /api/user/profile/:username` (Public/Member runner profile).
     - `GET /api/user` & `GET /api/admin/members` (Admin paginated member table with status filtering).
     - `GET /api/user/:id` & `GET /api/admin/members/:id` (Admin member detailed view).
     - `PATCH /api/admin/members/:id/status` (Admin change member status).
     - `POST /api/user` & `POST /api/admin/members` (Admin provision member).
     - `DELETE /api/user/:id` & `DELETE /api/admin/members/:id` (Admin delete member).
     - `PATCH /api/user/:id/password` (Admin set/confirm member password).
5. **Verification**:
   - Unit tests written for `AuthService`, `UsersService`, `AuthController`, `UsersController`, and `AdminMembersController`.
   - 7 test suites passed, 32 tests passed (`yarn test`).
   - NestJS build clean (`yarn build`).
   - Verification gate passed (`bash scripts/verify-task.sh TASK-003`).

---

## 4. Expected Outputs
- `src/auth/` module fully implemented with DTOs, guards, strategies, controller, and service.
- `src/users/` module fully implemented with profile and admin management endpoints.
- All endpoints tested and verified.

---

## 5. Acceptance Criteria
- [x] JWT authentication with bcrypt password hashing working.
- [x] Role-based guards protect admin endpoints while allowing public/member access as required.
- [x] Runner profile & shipping details APIs conform strictly to `docs/API_LIST.md` and `docs/08-api-contract.md`.
- [x] NestJS builds cleanly (`yarn build`) and unit tests pass (`yarn test`).
- [x] Frontend code remains 100% untouched.
- [x] Verification gate passes via `bash scripts/verify-task.sh TASK-003`.

---

## 6. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-004 শুরু করো। [Tier: LEVEL_HEAVY]
```
