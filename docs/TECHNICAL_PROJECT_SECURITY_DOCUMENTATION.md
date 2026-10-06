# PacShield Technical Project and Security Documentation

**PS-01 FinTrack: Personal Finance and AI Assistant**  
**Team:** HIJACK  
**Members:** Faisal Rahaman (26P6A6710); Thulsi Ram (25P61A6772)  
**Domain:** FinTech  
**Repository:** https://github.com/Faisupppp/PacShield  
**Public demo:** https://pacshield.vercel.app/  
**Document status:** Product and security target design. The current public site is a static browser demo with browser-local finance tracking; implementation status is identified in Section 8.

## 1. Project Overview

### Problem

Personal finance tools often depend on users manually remembering and entering every transaction. That creates gaps in expense history and weakens budget insights. QR-based UPI payments also create a moment when users can be pressured into paying an unknown or misleading payee. PacShield combines personal-finance tracking with a deliberate safety review before a user chooses to hand off to a UPI app.

### Proposed solution

PacShield is a responsive web app/PWA for recording income and expenses, categorizing transactions, tracking budgets, reviewing financial summaries, and exporting personal data. Its QR Shield decodes QR content on the device, validates supported UPI payment details, applies deterministic risk and high-amount/budget rules, and explains warnings before the user chooses any external payment handoff. Optional AI can explain spending patterns and rules-based warnings using read-only tools scoped to the signed-in user. A consent-based guardian can review eligible high-risk alerts.

PacShield does not move funds, monitor phone calls, intercept third-party UPI apps, verify a bank-registered payee name, or guarantee scam prevention. The risk score is an advisory signal, not a fraud probability.

## 2. Team Roles and Contributions

| Member | Identifier | Proposed responsibility | Accountable areas |
|---|---|---|---|
| Faisal Rahaman | 26P6A6710 | Product and frontend lead | Finance dashboard, transaction and budget UX, responsive integration |
| Thulsi Ram | 25P61A6772 | Security and platform lead | QR safety flow, threat model, API/data protection design, security documentation |

These are proposed documentation responsibilities; actual implementation contributions should be recorded by the team. Organizer team ID and member emails were not supplied and are not inferred here.

## 3. Project Workflow

### Target user flow

1. User registers and verifies contact details, sets locale/currency and optional alert thresholds, and chooses separate AI and guardian consent settings.
2. User records income/expenses, assigns categories, creates budgets, reviews searchable history, and views dashboard/estimates.
3. User opens QR Shield, grants camera access, and scans a code. The browser reads and validates the QR locally; PacShield displays payee and amount and asks whether the user is on a call as an optional self-report.
4. Deterministic rules produce Safe/Caution/Danger with reasons. High-amount and budget conditions are combined into one alert with each triggering threshold shown.
5. User cancels, marks a planned expense, or requests a consented guardian review. A danger state keeps continuation locked until explicit acknowledgement or valid guardian approval.
6. Only after a separate user action can a validated UPI handoff be offered. On return, user confirms whether payment completed before a transaction is recorded.
7. User may ask the optional AI assistant about their own spending through fixed read-only tools. AI may explain but cannot change a rule verdict or initiate/modify a transaction.

### Flow diagram

~~~mermaid
flowchart TD
  A[Register or sign in] --> B[Consent and profile setup]
  B --> C[Dashboard]
  C --> D[Transactions, budgets, insights, export]
  C --> E[QR Shield]
  E --> F[Local decode and strict UPI validation]
  F --> G[Deterministic risk and amount rules]
  G --> H{Risk result}
  H -->|Safe or caution| I[Show reasons and choices]
  H -->|Danger| J[Lock continuation]
  J --> K[Cancel, report, or consented guardian review]
  K --> I
  I --> L{User explicitly chooses handoff?}
  L -->|No| M[End safely]
  L -->|Yes| N[Open external UPI app]
  N --> O[Ask user to confirm outcome]
  O --> P[Record only user-confirmed transaction]
~~~

## 4. Technical Architecture

### Current state

The repository currently contains a static HTML/CSS/JavaScript demo. The sign-in/registration UI stores a display name and email in browser storage; passwords are not saved or sent, and the account gate is not authentication. The dashboard supports manual income/expense entries, browser-local budgets, totals, search, and threshold popups. QR scans and assistant responses remain demo features. The public site has no API, database, cross-device sync, bank/UPI integration, production authentication, Telegram guardian delivery, verified payee lookup, or server-side security enforcement. Browser storage can be erased and must not be treated as protected financial storage.

### Proposed target architecture

~~~mermaid
flowchart LR
  U[Browser / PWA] --> Q[Local QR decode and validation]
  Q --> R[Deterministic risk rules]
  U -->|HTTPS REST / SSE| EDGE[TLS edge and rate limits]
  EDGE --> API[FastAPI API]
  API --> AUTH[Authentication and role checks]
  API --> FIN[Finance, budgets, dashboard]
  API --> SHIELD[QR analysis and guardian workflow]
  API --> AI[Fixed read-only AI tools]
  API --> EXP[Export and admin services]
  AUTH --> DB[(PostgreSQL with row-level security)]
  FIN --> DB
  SHIELD --> DB
  EXP --> DB
  API --> REDIS[(Redis rate limits and short-lived state)]
  EXP --> JOBS[Background export workers]
  SHIELD --> TG[Telegram guardian integration]
  AI --> PROVIDER[Provider adapter or local model]
~~~

### Proposed technology choices

| Layer | Proposed technology | Purpose |
|---|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui | Responsive finance app and PWA |
| Client data and charts | TanStack Query, Recharts | API state, dashboard charts and summaries |
| QR and voice | jsQR or html5-qrcode; Web Speech API | On-device QR decode and optional spoken warnings |
| Backend | FastAPI, Pydantic, SQLAlchemy, Alembic | Validated APIs, business rules, migrations |
| Database | PostgreSQL with row-level security | User-scoped finance and security records |
| Queue/cache | Redis and Celery | Rate limits, short-lived approvals, export jobs |
| AI | Gemini/Claude/OpenAI adapter or local Ollama | Read-only explanations and user-scoped finance answers |
| Notifications | Telegram Bot API, optional email fallback | Consent-based guardian alerts |
| Deployment | Docker and CI; provider to be selected after review | Reproducible release and deployment |

These are proposed selections from the supplied PRD, not technologies verified in the public deployment.

## 5. Key Features and Implementation

| Feature | Target behavior and acceptance |
|---|---|
| Registration, login, profile | Demo registration/sign-in UI and browser-local name/email personalization exist. Production contact verification, secure password hashing, profile/preferences and server sessions remain target requirements. |
| Income and expense management | Manual income/expense entry and dashboard totals work in browser-local storage. Production persistence, server ownership and exact minor-unit storage remain target requirements. |
| Expense categories | Default and user categories; controlled categorization and searchable selection. |
| Budgets | Browser-local overall/category budget limits and one-time 80%/100% threshold popups exist. Cross-device persistence and server-side alerts are not implemented. |
| History/search/filter | Recent activity search is present in the demo. Full date/category/account/direction/amount filtering and server-owned history remain target requirements. |
| Dashboard/summaries | Demo calculates monthly totals and category summaries from browser-local entries. Production safe-to-spend and clearly sourced estimates remain target requirements. |
| Export/download | Target user-scoped CSV/monthly statement with expiring links and formula-injection protection; not implemented in the current demo. |
| Roles | User, consent-limited guardian, and admin; per-object ownership checks. Admin cannot read personal transactions or AI keys. |
| QR Shield | Demo includes safe/caution/danger scenarios and browser-side QR parsing/risk scoring. Production verification, backend checks, and third-party payment blocking are not provided. |
| High-amount/budget alert | Combine conditions: personal limit, >3x 30-day median, >50% remaining category budget or over budget, above safe-to-spend today. Show each triggered comparison. |
| Optional AI | The demo assistant uses fixed replies and is not connected to an AI service. Proposed read-only tools are server-scoped; AI cannot change verdicts or write transactions. |
| Guardian support | Consent, limited sharing, expiring link, revocation, and approval are target design only; live delivery is not implemented. |

## 6. Security Implementation

### Security approach

Security is part of the end-to-end flow: identity and consent, local QR parsing, deterministic server/client validation, server-side ownership enforcement, minimized integrations, safe exports, and auditable administration. Controls below are target requirements and must not be represented as implemented until tested in the actual application.

### Core controls

- **Authentication:** Argon2 password hashes; OTP contact verification; rate limits and temporary lockout; short-lived access tokens, rotating refresh cookies with `HttpOnly`, `Secure`, and `SameSite`; optional TOTP for privileged roles.
- **Authorization:** server-derived user identity, role checks, owner-filtered queries on every operation, PostgreSQL row-level security as a second boundary, negative tests for IDOR/BOLA.
- **Data protection:** TLS/HSTS, restrictive CSP/CORS, CSRF defenses for cookie-authenticated mutations, secrets outside source control, encrypt user AI keys with AES-256-GCM and a separately managed key, minimize retention.
- **QR validation:** local image decode; supported schemes/fields only; size and format limits; untrusted text treated as data; no auto-launch, no UPI PIN collection, and no claim to intercept third-party apps.
- **Risk and amount checks:** deterministic, explainable rules; confirmed admin-verified blacklist override; show exact reasons/thresholds; danger requires acknowledgement or eligible guardian approval. AI cannot change verdicts.
- **Guardian:** separately consented scope; single-use 10-minute linking token; alert expires after three minutes; validate webhook secret, linked chat ID, pending state, expiry, and replay status.
- **AI:** fixed read-only tools (`get_spend_by_category`, `list_transactions`, `get_budget_status`, `compare_months`, `forecast_month_end`, `find_recurring_charges`); authenticated user ID bound on server; no model-generated SQL; minimal provider context; metadata-only logs.
- **Exports and audit:** user-scoped short-lived links (target 10 minutes), CSV formula escaping, temporary-file expiry; audit metadata only, excluding passwords, tokens, full financial payloads and AI conversation bodies.
- **Admin:** verifies scam reports before shared blacklist updates; sees aggregate service metrics and audit events, not private ledger or provider secrets.

### High-amount rule outline

One alert is raised when any condition is met: above the user’s personal limit; above three times the median payment in the last 30 days; consumes over half the remaining category budget or exceeds the budget; or exceeds safe-to-spend today. The UI shows the specific values and each trigger. A retrospective transaction warning is never described as payment interception.

### Security flow

~~~text
Untrusted QR -> local bounded decode -> strict scheme/field validation
  -> deterministic rules and threshold comparisons -> verdict + reasons
  -> optional consented guardian / AI explanation (cannot change verdict)
  -> explicit user decision -> optional external UPI handoff
  -> user-confirmed outcome only -> scoped record and metadata audit
~~~

## 7. Testing and Validation

### Required verification plan

| Test area | Example validation | Current status |
|---|---|---|
| Authentication | Password hashing, OTP, throttling, refresh rotation, logout/revocation | Not verified; server auth not evidenced by demo |
| Authorization | User A cannot read/update User B; guardian scopes; admin cannot access personal ledger | Not run; no backend source present |
| QR parser and risk rules | Malformed/oversized/unsupported URI, collect request, thresholds, exact reasons and deterministic outputs | Demo examples observed; automated rules/tests not verified |
| High-amount/budget alerts | Personal limit, >3x median, >50% remaining budget, over-budget, safe-to-spend; combined reasons | Requirement specified; implementation not verified |
| Guardian callbacks | Invalid secret/chat, expired token, replay, timeout, revoked consent | Not run; integration not verified |
| AI isolation | Prompt injection, cross-user data, fixed-tool allowlist, provider outage, no verdict override | Not run; AI behavior not verified |
| Export/privacy | Owner scope, expiry, deletion, CSV formula injection, sensitive-log scan | Not run; export service not verified |
| Usability/accessibility | Keyboard, screen reader, contrast, mobile reflow, warning comprehension | Design criteria specified; not audited |

No tests, scans, penetration testing, or backend security review are claimed as completed. Before release, add unit/API/e2e tests and security checks for the controls in the TRD; retain evidence and unresolved findings.

## 8. Deployment and Final Validation

- **Repository:** https://github.com/Faisupppp/PacShield
- **Public demo:** https://pacshield.vercel.app/
- **Current deployment evidence:** the public static app has sign-in/registration UI, browser-local manual ledger and budget alerts, dashboard calculations, QR demo/scoring, and fixed assistant replies. The live sign-in notice explicitly says it is not server-verified.
- **Current implementation validation:** browser-local finance features work in the current browser, but no backend, database, cross-device sync, bank connection, guardian callback, production authentication, secure export, or server-side authorization is deployed. Do not use real credentials or rely on this demo to protect funds.
- **Production deployment path:** choose and document frontend/API/database providers; configure TLS, secrets, migrations, backups, monitoring and rate limits; deploy a staging environment; run all acceptance and security tests; resolve findings; then promote and record the exact commit and release evidence.
- **Limitations:** no direct connection to user UPI account or transaction feed is evidenced. QR Shield can advise before a user-initiated handoff but cannot block a payment inside another UPI application. No real bank-name verification, call monitoring, guaranteed scam detection, or production guardian approval should be claimed.
- **Competition timing:** the Build Secure 24 freeze was October 6, 2026 at 11:00 IST. This documentation update occurs after the deadline and is not represented as a pre-freeze submission change.

## 9. Final Summary

PacShield’s distinct product direction connects everyday finance management with an explainable QR payment safety check and threshold-based high-amount/budget alerts. The PRD preserves all eight PS-01 requirements, while the TRD defines a proposed backend and layered security design, and the web flow/UI/UX specifications make the user decisions and consent boundaries concrete. The live deployment currently supports demo UI states only; production authentication, persistence, payment integrations, guardian workflows, and security controls remain to be implemented and validated.

### Supporting specifications

- [Product Requirements Document](PRD.md)
- [Technical Requirements Document](TRD.md)
- [Web Flow](WEB_FLOW.md)
- [UI/UX Design Specification](UI_UX.md)
