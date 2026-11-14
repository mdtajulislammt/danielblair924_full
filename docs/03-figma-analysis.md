# 03 — Figma & UI Screen Inventory: FMC Platform

> **Maintained by**: `jarvis` (UI/UX Specialist)  
> **Source Figma URL**: [danielblair924_FO41C03DAA584_$400_Techvee](https://www.figma.com/design/44IYnCMfDkGxvdiLDhTUSl/danielblair924_FO41C03DAA584_-400_Techvee--Client-File-?node-id=16-2&p=f&t=ZAgWEUicJlhuWhA4-0)  
> **Node ID**: `16:2`  
> **Theme Aesthetic**: Dark Neon Athletic & Cyber-Runner Style  

---

## 1. Design Overview & Screen Architecture

The Figma file encompasses two synchronized products under the First Mile Club ecosystem:
1. **Web Admin Dashboard**: High-density operations dashboard for club admins to moderate submissions, publish events, monitor KPIs, and manage members.
2. **Mobile Runner Application**: Athletic mobile companion for runners to track lifetime kilometers, submit Strava/GPS proofs, verify TikTok social posts, earn badges, and participate in RATW (Run Around The World).

---

## 2. Screen & Workflow Inventory

### 2.1 Mobile Runner App Screens
| Screen ID | Screen Name | Key UI Elements | API / Data Dependencies |
|---|---|---|---|
| `MOB-001` | **Runner Login & Password Creation** | Email, Password inputs, "LOG IN", "Create a password", "Confirm your password" | `POST /api/auth/login`, `PATCH /api/user/:id/password` |
| `MOB-002` | **Runner Home & Lifetime Distance** | Huge KM counter (`84 KM LIFETIME`), Active event card (`5K COMMUNITY RUN`), Recent activities list (`8.24 KM`, `12.60 KM`) | `GET /api/user/me`, `GET /api/user/stats`, `GET /api/user/activities` |
| `MOB-003` | **Run Proof Submission — Step 1** | Activity details: Distance (`5.2 KM`), Duration (`29:57`), Pace (`5:45 /km`), Run date | `POST /api/submissions/draft` |
| `MOB-004` | **Run Proof Submission — Step 2** | Image dropzone: "Add your proof", "Tap to upload" Strava Screenshot / GPS Route | `POST /api/submissions/upload-proof` (multipart/form-data) |
| `MOB-005` | **Run Proof Submission — Step 3** | Social verification: Complete 5K (REQUIRED), TikTok post check, Tag `@FirstMileClub`, Hashtag `#RunForLife2026` | `POST /api/submissions/submit` |
| `MOB-006` | **Run Submission Success / Finisher Card** | Celebration graphic, "Added to your collection", "View Finisher Card", "View My Badges" | `GET /api/submissions/:id/finisher-card` |
| `MOB-007` | **Badges Showcase** | Grid of unlocked & locked badges (`Ultra Finisher`, `5K Finisher`, `RATW Champion`, etc.) | `GET /api/badges/my-badges` |
| `MOB-008` | **Community Leaderboard & RATW Map** | "View Full Map", Destination milestones (Rome unlocked/locked), Leaderboard (`Rakib S. - 198.7 KM`) | `GET /api/challenges/ratw/destinations`, `GET /api/leaderboard` |

### 2.2 Web Admin Dashboard Screens
| Screen ID | Route / Page | Key UI Elements | Existing Frontend Status |
|---|---|---|---|
| `ADM-001` | `/(auth)/login` | Email & password inputs, password visibility toggle, neon submit button | Implemented (`LoginForm.tsx`) |
| `ADM-002` | `/` (Dashboard) | 4 Stat Cards (Active Members, Pending Submissions, Upcoming Events, Upcoming Challenges), User Table, Recent Activity | Implemented (`DashboardPage.tsx`) |
| `ADM-003` | `/dashboard/members` | Dynamic member table (Name, Join Date, Distance, Events, Badges, Status), pagination | Implemented (`MembersTable.tsx`) |
| `ADM-004` | `/dashboard/members/[id]` | Member detail sidebar (Avatar, email, phone, location, join date, distance), tabs for Badges, Submissions, Activity | Implemented (`UserProfileSidebar.tsx`) |
| `ADM-005` | `/dashboard/submissions` | Submissions moderation queue, Neon world map, status badges (`Pending`, `Approved`, `Rejected`) | Implemented (`SubmissionPage.tsx`) |
| `ADM-006` | `/dashboard/submissions/[id]` | Proof verification cards: Strava screenshot, GPS screenshot, TikTok verification checklist, Approve & Reject modal | Implemented (`SubmissionDetailPage.tsx`, `SubmissionModal.tsx`) |
| `ADM-007` | `/dashboard/events` | Event cards catalog, Step 1 details form (`/edite`), Step 2 rules checklist (`/edite/step-two`) | Implemented (`EventDetailsForm.tsx`, `EventRequirementsForm.tsx`) |
| `ADM-008` | `/dashboard/challenges` | Challenge catalog, RATW progress bar (`0/500 km`), creation wizard, destinations table, participants roster | Implemented (`ChallengePage.tsx`, `ChallengeDetailsForm.tsx`) |
| `ADM-009` | `/dashboard/badges` | Badges grid, Create Badge form (`/create`), Edit Badge form (`/edit/[id]`), file upload | Implemented (`Badges.tsx`, `CreateBadges.tsx`, `EditBadges.tsx`) |
| `ADM-010` | `/dashboard/news` | News table, Create News form (`/create`), rich text editor (`Jodit`), cover image upload | Implemented (`News.tsx`, `CreatePost.tsx`, `EditPost.tsx`) |
| `ADM-011` | `/dashboard/settings` | Admin account update form, notification toggles, active login session list | Implemented (`AdminAccountSection.tsx`, `NotificationsSection.tsx`, `SecuritySection.tsx`) |

---

## 3. Responsive Breakpoints & Ambient Lighting
- **Radial Ambient Glows**:
  - Green neon atmospheric lights placed in corners of cards and modals:
  - `radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)`
- **Breakpoints**:
  - Mobile (`< 640px`): Single column cards, collapsible drawers.
  - Tablet (`640px - 1024px`): 2-column grid for stat cards and submissions.
  - Desktop (`> 1024px`): Full dashboard layout with fixed sidebar, multi-column grids, and extensive data tables.
