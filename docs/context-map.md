# Avengers Task-to-Context Map: FMC Platform

> **Context Routing Guide**: Use this map to pick the smallest sufficient context. Each specialist loads ONLY its specific assigned documents and target directory files to preserve maximum token efficiency (under 5,000 tokens per task).

---

## 1. Specialist Context Boundaries & Directory Routing

| Agent | Task Domain | Read First (Primary Context) | Inspect Only When Needed (Secondary Context) |
|---|---|---|---|
| **`iron_man`** | Project Discovery, Planning & Delegation | `docs/EXISTING_PROJECT_SUMMARY.md`, `project.config.md`, `planning/task.md` | `planning/open-questions.md`, `planning/decisions.md` |
| **`jarvis`** | UI/UX & Design Tokens | `docs/04-design-system.md`, `developement/danielblair924_dashboard_front-end/app/globals.css` | `developement/danielblair924_dashboard_front-end/components/ui/`, `public/demoData/Icons.tsx` |
| **`friday`** | Frontend Web Components, Forms & Pages | Assigned task entry, `docs/08-api-contract.md`, target component/page | `developement/danielblair924_dashboard_front-end/lib/Fetch.ts`, `service/user/` |
| **`edith`** | Database Schema & Prisma Migrations | Assigned task entry, `docs/07-database-design.md` | `developement/danielblair924_backend/prisma/schema.prisma`, `prisma7.config.ts` |
| **`edith`** | Backend NestJS APIs & Domain Services | Assigned task entry, `docs/08-api-contract.md`, target controller/service | `developement/danielblair924_backend/src/`, `docs/07-database-design.md` |
| **`thor`** | Flutter Mobile Application | *Scope Inactive* (Mobile is currently disabled in `project.config.md`) | N/A |
| **`thanos`** | QA, Verification & Acceptance Testing | Assigned task entry, `docs/08-api-contract.md`, test failure stack traces | `developement/danielblair924_backend/test/`, `scripts/verify-task.sh` |
| **`loki`** | Chaos, Security & Adversarial Testing | Assigned task entry, target DTO validation schema | `developement/danielblair924_dashboard_front-end/components/Dashboard/**/schemas.ts` |
| **`ultron`** | Docker, Nginx, CI/CD & Infrastructure | Assigned task entry, `developement/danielblair924_dashboard_front-end/docker-compose.yml` | `developement/danielblair924_dashboard_front-end/Dockerfile`, `scripts/` |

---

## 2. Strict Context Expansion Rule
- Never load the entire repository or deep recursive directory trees.
- For all new tasks, agents must reference `docs/EXISTING_PROJECT_SUMMARY.md` instead of re-reading raw legacy files.
- If a cross-domain dependency is identified, pause and ask `iron_man` to delegate the dependency to the responsible specialist agent.
