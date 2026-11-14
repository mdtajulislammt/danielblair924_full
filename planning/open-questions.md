# Open Questions & Client Clarifications

> **Rule**: When requirements, business logic, permissions, edge cases, or UX flows are ambiguous, Iron Man and all agents must log them here rather than inventing assumptions.

---

## Active Questions

| Question ID | Date Logged | Domain | Question Description | Impacted Agent | Status | Resolution |
|---|---|---|---|---|---|---|
| `Q-003` | 2026-11-02 | Deployment | Target production hosting environment (VPS vs AWS vs Railway/Vercel)? | `ultron` | `RESOLVED` | Client purchased Hostinger KVM 2 VPS (2-year plan) and Domain. Ultron configuring Ubuntu 24.04 Dockerized stack. |
| `Q-004` | 2026-11-11 | Integration | Strava API Developer App Credentials (`CLIENT_ID`, `CLIENT_SECRET`) | `edith` | `IN_PROGRESS` | Developing StravaModule with mock/local credentials awaiting client Strava App registration. |

---

## Resolved Questions Log

| Question ID | Date Resolved | Domain | Question Description | Resolution Summary |
|---|---|---|---|---|
| `Q-001` | 2026-11-08 | Security / Auth | What is the client's preferred authentication strategy? | **Resolved**: Standard Bearer token JWT authentication with refresh token rotation. Verified from frontend `Fetch.ts` and `docs/08-api-contract.md`. |
| `Q-002` | 2026-11-08 | Mobile | Is a mobile application required for this project? | **Resolved**: Mobile runner screens analyzed in `docs/03-figma-analysis.md`. Backend APIs in `docs/API_LIST.md` are unified to serve both Web Admin & Mobile App. Flutter client implementation scheduled under Thor. |
