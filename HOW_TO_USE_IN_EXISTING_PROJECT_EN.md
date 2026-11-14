# 🛡️ Avengers Protocol — Existing Project Adoption Guide

> **Version**: 2.0  
> **Philosophy**: Integrate multi-agent AI orchestration into your ongoing project **without modifying or rearranging any existing source files**. Fully automated project scanning, auto-configuration, gap analysis, and disciplined execution.

---

## 🧭 End-to-End Workflow Overview (4-Step Flow)

```text
┌─────────────────────────┐
│ 1. Inject Protocol Files│ ──► Paste the 5 orchestration items or run `npx tajul-avengers init`
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 2. Run Command 1        │ ──► AI auto-detects tech stack, updates project.config.md,
│    (Auto-Discovery)     │     and generates docs/EXISTING_PROJECT_SUMMARY.md baseline
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 3. Write Your Plan      │ ──► Outline your new feature or bugfix in planning/new-plan.md
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 4. Run Command 2        │ ──► AI runs Gap Analysis against existing code, breaks work into
│    (Planning & Exec)    │     isolated tasks (task.md), and executes with 95% token efficiency
└─────────────────────────┘
```

---

## Step 1: Inject Protocol Files into Your Existing Project

Run the CLI directly inside your existing project root:

```bash
npx tajul-avengers init
```

*Or manually copy the following items from the template into your project root:*

1. **`AGENTS.md`** (Global multi-agent rules & context protocol)
2. **`project.config.md`** (Centralized configuration — AI auto-populates this)
3. **`planning/`** (Task tracking directory containing `new-plan.md`)
4. **`docs/`** (Token policy and technical architecture specifications)
5. **`.agents/`** (Specialized agent skills)
6. *(Optional)* **`scripts/`** (Validation scripts and clean test runners)

> 💡 **Note**: Your existing source code (`src/`, `client/`, `server/`, `prisma/`, etc.) remains untouched. You do not need to manually edit `project.config.md`.

---

## Step 2: Run Command 1 (Auto-Discovery & Baseline Audit)

Open your AI coding assistant (Cursor, Claude Code, Antigravity, etc.) and execute the following prompt:

```text
Iron Man, adapt our Avengers Protocol to this existing codebase:
1. Scan the full codebase to detect the frontend, backend, database ORM, package manager, and folder paths, then automatically update project.config.md.
2. Thoroughly analyze what features, database schemas, and APIs currently exist, and document them in docs/EXISTING_PROJECT_SUMMARY.md.
3. Establish accurate system baselines in docs/07-database-design.md, docs/08-api-contract.md, and docs/context-map.md.
4. Do not modify or refactor any existing source code. Only generate the documentation baselines and configurations.
```

### ⚡ What Happens Behind the Scenes?
1. **Auto-Configuration (`project.config.md`)**: The AI scans manifest files (`package.json`, `requirements.txt`, etc.) and sets the exact framework and directory mappings automatically.
2. **Existing System Audit (`docs/EXISTING_PROJECT_SUMMARY.md`)**: All existing models, routes, controllers, and pages are indexed into a clean baseline document.
3. **Context Baselines Established**: Technical contracts (`docs/07-database-design.md`, `docs/08-api-contract.md`) reflect your actual database and endpoints.
4. **95% Token Efficiency**: During future coding sessions, the AI references these concise summary files instead of re-reading thousands of lines of legacy code.

---

## Step 3: Write Your Feature Request in `planning/new-plan.md`

Once Command 1 finishes, open:  
📄 **`planning/new-plan.md`**

Describe the new feature or bugfix you want to implement:

```markdown
# 📝 New Plan / Feature Request

## 1. Feature Title:
User Profile Avatar Upload with Cloudinary Integration.

## 2. Description & Requirements:
- Users should be able to upload a profile picture from their settings page.
- Create backend endpoint: POST /api/users/avatar
- Store images in Cloudinary and save the image URL in the User table (`avatarUrl`).
- Ensure no existing authentication or profile endpoints are broken.

## 3. Acceptance Criteria:
- [ ] Avatar upload saves URL to database
- [ ] Frontend displays image preview
- [ ] Verification tests pass via Thanos
```

---

## Step 4: Run Command 2 (Gap Analysis, Task Breakdown & Execution)

Once your plan is written, submit this command to your AI assistant:

```text
Iron Man, deeply analyze docs/EXISTING_PROJECT_SUMMARY.md (existing baseline) and planning/new-plan.md (new feature):
1. Perform a Gap Analysis (what already exists vs. what needs to be created). Avoid duplicate models or endpoints.
2. Deconstruct the feature into isolated sub-tasks with Task IDs ([TASK-001], [TASK-002]) in planning/task.md assigned to specialist agents (Edith, Friday, Thanos).
3. Update planning/updateplanning.md.
4. Begin task-by-task execution under the Avengers Protocol and context policy.
```

### 🚀 What Happens During Execution?
1. **Gap Analysis**: Iron Man verifies existing code to prevent duplicate migrations, models, or conflicting routes.
2. **Structured Task Breakdown (`planning/task.md`)**:
   - `[TASK-001]`: Edith — Database schema migration (`avatarUrl`).
   - `[TASK-002]`: Edith — Cloudinary service & upload controller.
   - `[TASK-003]`: Friday — Frontend avatar upload UI & state management.
   - `[TASK-004]`: Thanos — E2E test verification and bug snapping.
3. **Context-Isolated Execution**: Each specialist reads only its assigned contracts and writes minimal, maintainable code following YAGNI principles.
4. **Verification Report**: Thanos runs tests and reports evidence before marking tasks as `DONE`.

---

## 🔄 Continuous Development Loop for Future Features

Whenever you want to add another feature:
1. Open `planning/new-plan.md`, replace previous contents with your new requirements.
2. Run **Command 2**:
   ```text
   Iron Man, analyze docs/EXISTING_PROJECT_SUMMARY.md and planning/new-plan.md, update planning/task.md and updateplanning.md, and begin execution.
   ```
3. The AI maintains historical context and safely appends new functionality without breaking legacy code.

---

## 🛡️ Golden Rules for Existing Projects

1. **Manual Git Control**: Never allow AI to automatically execute `git commit` or `git push`. Always review diffs manually.
2. **Fresh Session Handoff**: Avoid long, slow chat threads. After completing a major task, open a fresh session and enter:
   ```text
   Read planning/updateplanning.md and continue with the next task.
   ```
3. **Zero-Destructive Policy**: Never drop tables, alter production data, or remove working legacy endpoints without explicit human confirmation.

