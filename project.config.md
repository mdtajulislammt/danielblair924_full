# ⚙️ Project Configuration: FMC (First Mile Club)

> **Version**: 2.0  
> **Codename**: Avengers Protocol  
> **Primary AI Environment**: Antigravity & Compatible Multi-Agent Assistants  
> **Architecture**: Modular Full-Stack Web + Backend System  
> **Chief Orchestrator**: `iron_man`  

---

> [!NOTE]
> **Developer Directive**:  
> This file is the **Single Source of Truth** for technical stack configuration.  
> `iron_man`, `jarvis`, `friday`, `edith`, `thor`, `thanos`, and `ultron` strictly read this file to determine what libraries, frameworks, databases, and architectural patterns to implement.

---

## 1. Project Information & Metadata

- **Project Name**: FMC (First Mile Club) Platform
- **Project Type**: Full-Stack Web Admin Dashboard + Backend REST API
- **Project Status**: `existing`
- **Client Requirements Source**: [README.md](README.md) & [docs/EXISTING_PROJECT_SUMMARY.md](docs/EXISTING_PROJECT_SUMMARY.md)
- **Problem & Product Summary**: First Mile Club (FMC) is an athletic and running community platform. The admin dashboard manages members, distance events, running challenges (e.g. Run Around The World / RATW), submission verification (Strava/GPS proofs and TikTok social tags), achievement badges, news announcements, and admin settings.
- **Target Audience / End Users**: Club Administrators, Race Directors, and Community Operations Managers.
- **Target Delivery / Milestones**: Active Existing Codebase — Stabilization, Backend API Implementation & Contract Synchronization.

---

## 1.1 AI Engine & Universal Model Profile (Model-Agnostic)

> [!TIP]
> **Universal Compatibility**: This template works across **any AI assistant, editor, or model** (Cursor, Claude, Gemini, DeepSeek, OpenAI, Ollama/Llama, VS Code).

- **Workflow Mode**: `flexible`
- **Developer AI Environment**: Antigravity (Gemini 2.5 / 3.0 / Pro / Flash)
- **Active Model Setup Note**: Model-agnostic; adheres to capability-based context choking.
- **Capability Tier Reference**:
  - `LEVEL: HEAVY` (Deep Reasoning): System architecture (`docs/`), relational DB schema design, JWT/auth security, complex business logic.
  - `LEVEL: STANDARD` (General Coding): UI components, Next.js pages, NestJS CRUD APIs, DTOs, Docker config.
  - `LEVEL: LIGHT` (Fast Execution / Token-Saver): Verification scripts, status updates (`planning/`), minor typo/CSS fixes.

---

## 2. Avengers Multi-Agent Roster & System Mapping

| Agent Name | Hero Identity | Primary Domain | Configuration File | Target Directory |
|---|---|---|---|---|
| **`nick_fury`** | **Client Advocate & PM** | Requirement Discovery, Client Interview, Scope Boundary | `.codex/agents/nick_fury.toml` | Root, `planning/open-questions.md`, `README.md` |
| **`iron_man`** | **Chief Orchestrator** | Planning, Delegation, Work Breakdown & Verification | `.codex/agents/iron_man.toml` | Root, `planning/`, `docs/` |
| **`jarvis`** | **UI/UX & Design** | Design Tokens, Neon Dark Theme, UI Primitives, 6 UI States | `.codex/agents/jarvis.toml` | `developement/danielblair924_dashboard_front-end/components/`, `app/globals.css` |
| **`friday`** | **Frontend Web** | Next.js 16, React 19, TypeScript, Forms, Client State | `.codex/agents/friday.toml` | `developement/danielblair924_dashboard_front-end/` |
| **`edith`** | **Backend & Data** | NestJS 11, Prisma 7, PostgreSQL, REST APIs | `.codex/agents/edith.toml` | `developement/danielblair924_backend/` |
| **`thor`** | **Mobile Specialist** | Flutter, Dart, Riverpod, Mobile Integration | `.codex/agents/thor.toml` | `developement/danielblair924_app/` |
| **`thanos`** | **QA & Verification** | Unit, Integration, E2E, Contract Acceptance, Bug Snapping | `.codex/agents/thanos.toml` | Test suites across backend & frontend |
| **`loki`** | **Chaos & Security Tester** | Edge-Case Fuzzing, Adversarial Attacks, Input Validation | `.codex/agents/loki.toml` | Test suites, API security |
| **`ultron`** | **DevOps & Security** | Docker, Nginx, CI/CD, Containerization | `.codex/agents/ultron.toml` | `developement/danielblair924_dashboard_front-end/Dockerfile`, `docker-compose.yml`, `scripts/` |

---

## 3. Technology Stack Specification

### 3.1 Frontend Configuration (`developement/danielblair924_dashboard_front-end/`)
> *Friday and Jarvis strictly adhere to these frontend choices.*
- **Directory**: `developement/danielblair924_dashboard_front-end/`
- **Framework**: `Next.js 16 (App Router)` (`next: ^16.2.4`, `react: ^19.2.3`, `react-dom: ^19.2.3`)
- **Language**: `TypeScript` (Strict Mode, TS ^5)
- **Styling**: `Tailwind CSS v4` (`@tailwindcss/postcss: ^4.0.9`, `tailwindcss: ^4.0.9`, `tw-animate-css`)
- **Design Aesthetic**: Dark neon theme (Primary: `#a1f400` / lime green, Background: `#131b04` & `#070a03`, Border: `#344217` / `#435916`)
- **UI Primitives**: Radix UI (`@radix-ui/react-*`), `vaul` (drawer), `lucide-react`, `react-icons`
- **Client UI State**: React State & Custom Hooks (`useUser`), `localStorage` for multi-step creation workflows
- **Server State / Networking**: Custom `Fetch` wrapper (`lib/Fetch.ts` around `axios` ^1.8.1), `nookies` & cookie helper for JWT authentication
- **Form & Validation**: `react-hook-form` (^7.87.0) + `zod` (^3.24.3) + `@hookform/resolvers`
- **Rich Text & Editors**: `jodit-react`, `react-quill` (`react-quill-new`), `katex`, `quill-delta`
- **Data Visualization & Charts**: `chart.js` (^4.4.8), `react-chartjs-2`, `d3-scale`, `react-simple-maps`
- **Real-Time**: `socket.io-client` (^4.8.1)
- **Package Manager**: `yarn` (v4.18.0 Modern Berry, `yarn.lock`)
- **Default Dev Port**: `http://localhost:3000` (`yarn dev` via Turbopack)
- **Target Backend API**: `http://localhost:4000/api` (configured in `config/app.config.ts`)

### 3.2 Backend Configuration (`developement/danielblair924_backend/`)
> *Edith strictly adheres to these backend choices.*
- **Directory**: `developement/danielblair924_backend/`
- **Framework**: `NestJS 11 (Modular Domain Architecture)` (`@nestjs/core: ^11.0.1`, `@nestjs/common: ^11.0.1`, `@nestjs/platform-express: ^11.0.1`)
- **Language**: `TypeScript` (ES Modules `"type": "module"`, Strict Mode, TS 5.7.3)
- **ORM / Database Client**: `Prisma ORM 7` (`prisma: ^7.10.0`, `@prisma/client: ^7.10.0`, `@prisma/adapter-pg: ^7.10.0`, `pg: ^8.23.0`)
- **Prisma Configuration**: `prisma7.config.ts` (`defineConfig` with `schema: prisma/schema.prisma`, `migrations: prisma/migrations`)
- **Primary Database**: `PostgreSQL (v15+)` (`DATABASE_URL="postgresql://postgres:root@127.0.0.1:5432/testdb?schema=public"`)
- **Cache & Queue**: `Redis` (planned for session storage and rate limiting)
- **API Architecture**: REST APIs with global prefix `/api` (configured for Port `4000`)
- **Validation**: `class-validator` + `class-transformer`
- **Testing**: `Jest` (`ts-jest: ^29.2.5`), `Supertest` (^7.0.0)
- **Package Manager**: `yarn` (`yarn.lock`)
- **Default Dev Command**: `yarn start:dev`

### 3.3 Mobile Configuration (`developement/danielblair924_app/`)
> *Thor strictly adheres to these mobile choices.*
- **Enabled**: `true`
- **Directory**: `developement/danielblair924_app/`
- **Framework**: `Flutter 3.13+` (Dart `^3.13.2`)
- **State Management**: `flutter_riverpod` (`^3.4.2`)
- **Navigation / Router**: `go_router` (`^18.0.1`)
- **Networking Client**: `dio` (`^5.8.0`) with custom interceptors for Bearer token injection and 401 handling
- **Token Persistence**: `flutter_secure_storage` (`^9.2.2`)
- **UI & Design Tokens**: `flutter_screenutil` (`^5.9.3`), `flutter_svg` (`^2.3.0`), Google Fonts, custom neon dark theme
- **Maps & Charts**: `flutter_map` (`^8.3.2`), `latlong2` (`^0.10.1`), `fl_chart` (`^1.2.0`)
- **Target Backend API**: 
  - Android Emulator: `http://10.0.2.2:4000/api`
  - Real Device / Local Network / iOS / Web: `http://localhost:4000/api` or machine IP
- **Package Manager**: `flutter pub`

### 3.4 Infrastructure & DevOps
> *Ultron strictly adheres to these infrastructure choices.*
- **Docker**: `developement/danielblair924_dashboard_front-end/Dockerfile` & `docker-compose.yml`
- **Port Mappings**: Frontend `3000:3000`, Backend `4000:4000`
- **Package Managers**: `yarn` (backend & frontend)
- **Runtime Environment**: `Node.js >= 20.x LTS` (tested with Node 22.x)

---

## 4. Shared Project Contracts & Directory Mapping

| Artifact Type | File / Path | Primary Agent Responsibility |
|---|---|---|
| **Client Intent / Brief** | [README.md](README.md) | Single Source of Truth filled by Developer/Client |
| **Existing System Baseline** | [docs/EXISTING_PROJECT_SUMMARY.md](docs/EXISTING_PROJECT_SUMMARY.md) | Comprehensive audit of legacy code and current state |
| **Database Design** | [docs/07-database-design.md](docs/07-database-design.md) | Prisma 7 schema and PostgreSQL data model maintained by `edith` |
| **API Contract** | [docs/08-api-contract.md](docs/08-api-contract.md) | Shared bridge between `edith` and `friday` |
| **Context Routing Map** | [docs/context-map.md](docs/context-map.md) | Token-efficient context boundaries for all agents |
| **Task Management** | [planning/task.md](planning/task.md) | Work breakdown with `Assignee` tags |
| **Session Continuity** | [planning/updateplanning.md](planning/updateplanning.md) | Checkpoints, test evidence, and active task state |
| **Frontend Application** | [developement/danielblair924_dashboard_front-end/](developement/danielblair924_dashboard_front-end/) | Owned by `friday` & `jarvis` |
| **Backend Application** | [developement/danielblair924_backend/](developement/danielblair924_backend/) | Owned by `edith` |

---

## 5. Working Agreements & Human Approval Gates

1. **Human Approval Gates (Strict Authorization Required)**:
   - ⚠️ Destructive database migrations (dropping tables, altering production data).
   - ⚠️ Live production deployments or publishing releases.
   - ⚠️ Altering production secrets, API keys, or environment files (`.env`).
   - ⚠️ Major architectural deviations from `docs/` or `project.config.md`.
2. **Zero-Assumption Policy**: Unconfirmed requirements must be recorded in `planning/open-questions.md`.
3. **Context Isolation**: Every agent loads only the specific files required for its current task to ensure **minimum token usage and maximum output quality**.
4. **Evidence-Based Verification**: No task is marked `DONE` without verification by `thanos` with actual test execution evidence.
