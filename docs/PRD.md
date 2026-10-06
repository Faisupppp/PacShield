# PacShield Product Requirements Document

**Product:** PacShield — Scan safe. Pay safe.  
**Problem statement:** PS-01, Personal Finance and AI Assistant  
**Source baseline:** PacShield PRD draft 1.0, 5 October 2026; project brain, updated 6 October 2026  
**Document status:** Consolidated product requirements. Requirements below describe the intended product; the current Vercel deployment is a front-end demo, as called out in [current release status](#current-release-status).

## 1. Product summary

PacShield combines a personal money tracker with a safety check before a user hands an unfamiliar UPI QR payment to another app. The user scans the QR in PacShield, receives a deterministic safe, caution, or danger assessment, and can ask a trusted guardian to review a high-risk payment. A dashboard helps the user understand income, spending, and budgets.

**Rules decide; AI explains.** A deterministic rules engine owns the risk score, verdict, and reason codes. An optional AI service can put those reasons into short, accessible language, but it cannot approve payments, change the verdict, or query the database directly.

## 2. Problem and opportunity

An elderly or inexperienced UPI user may be pressured on a call to scan a QR code and pay an unknown recipient. UPI payment apps do not give the user enough personal context about the payee or amount, while most expense trackers only record spending after the fact. Families also need a consent-based way to help at the moment a payment looks unusual.

PacShield puts a deliberate pause before the handoff and provides a clear record of everyday spending. It is a safety assistant and tracker, not a payment service or guarantee of fraud detection.

## 3. Goals and non-goals

### Goals

1. Show a clear, explainable QR payment verdict before the user opens a UPI app; the proposed target is a verdict within one second, excluding optional AI wording.
2. Give plain-language warnings in English, Hindi, or Telugu, with voice support.
3. Give the user a consent-based route to ask a trusted family guardian to approve or block a high-risk payment.
4. Cover the PS-01 personal finance requirements: accounts, profiles, income and expenses, categories, budgets, history, dashboard, export, roles, and optional AI assistance.
5. Keep users in control through data export, data deletion, minimal AI disclosure, and clear limitations.

### Non-goals

- Move money, hold funds, or act as a UPI payment app.
- Intercept a QR scan made inside PhonePe, Google Pay, Paytm, or another app.
- Verify the payee’s bank-registered name without an authorized bank/NPCI capability.
- Guarantee that every scam will be detected or blocked.
- Request or store a UPI PIN, card number, or bank password.
- Make the AI an authority on payment approval or risk scoring.

## 4. Users and roles

| Role | Needs and allowed actions | Restrictions |
| --- | --- | --- |
| User | Main audience: everyday, older, or first-time UPI user. Scan and check QR codes, manage their own money and budgets, link/revoke a guardian, ask the assistant, export/delete their own data. | Cannot see another user’s data. |
| Guardian | Trusted relative invited by the user. Receive configured alerts and approve or block an alert. See a monthly summary only with user consent. | Cannot change the user’s settings or see unshared transactions. |
| Admin | Review scam reports, verify and manage blacklist entries, maintain default categories, inspect anonymous aggregate metrics and audit events. | Cannot view individual transactions or AI keys. |

### Primary persona

Ramesh is 68, retired, and uses UPI for everyday shopping and bills. He may be on a stressful call, speaks Telugu at home, and wants large controls, short sentences, a spoken warning, and an easy way to call his daughter. The interface must be usable without technical language or precise gestures.

## 5. Scope and release priorities

Priority definitions: **P0** required for the intended MVP; **P1** important follow-up; **P2** later enhancement.

### Accounts and profile

| ID | Requirement | Priority |
| --- | --- | --- |
| AUTH-01 | Register by email/password and verify by email or mobile OTP; hash passwords with Argon2id. | P0 |
| AUTH-02 | Use short-lived access credentials and rotating refresh tokens in secure, HTTP-only, SameSite cookies. | P0 |
| AUTH-03 | Rate-limit login and temporarily lock repeated failures. | P0 |
| PROF-01 | Store profile name, language, currency, timezone, monthly income, and personal alert limit. | P0 |
| AUTH-04 | Show sessions and allow sign-out from all devices. | P1 |
| AUTH-05 | Add optional TOTP, recommended for privileged roles. | P1 |

### QR shield and warnings

| ID | Requirement | Priority |
| --- | --- | --- |
| SCAN-01 | Decode camera QR in the browser; never upload the QR image. | P0 |
| SCAN-02 | Parse and validate UPI parameters; reject malformed, oversized, duplicate, or unknown forms. | P0 |
| SCAN-03 | Check a web URL in a QR with Safe Browsing and return a URL-specific warning without fetching the page. | P1 |
| SCAN-04 | Ask whether the user is on a phone call; include the answer as a strong risk signal. | P0 |
| SCAN-05 | Allow a gallery image and mark its source as a risk signal. | P1 |
| SCAN-06 | Show a clear verdict with Stop/report, Call family, and Continue actions; provide speech output. | P0 |
| SCAN-07 | Open the UPI app only after an explicit user action. Lock Continue on danger until guardian approval or typed user confirmation. | P0 |
| SCAN-08 | Record scan outcome and show blocked scam count and money saved. | P0 |
| SCAN-09 | Show India’s cybercrime helpline 1930 and cybercrime.gov.in in a danger warning. | P0 |

### High-amount checks

| ID | Requirement | Priority |
| --- | --- | --- |
| AMT-01 | Flag an amount above the user limit, above 3× the 30-day payment median, consuming over 50% of remaining category budget/over budget, or above safe-to-spend today. | P0 |
| AMT-02 | Explain the actual reasons and offer planned, family, cancel, or assistant actions. | P0 |
| AMT-03 | Combine reasons into one popup per scan and support planned large expenses. | P1 |
| AMT-04 | Apply the high-amount check to manually added/imported transactions. | P1 |

### Guardians

| ID | Requirement | Priority |
| --- | --- | --- |
| GUARD-01 | Link with user consent through a single-use, ten-minute Telegram deep-link token; allow revocation. | P0 |
| GUARD-02 | Alert the guardian on danger or configured limit breach; include payee, amount, reasons, and approve/block actions; expire after three minutes. | P0 |
| GUARD-03 | Validate webhook secret, linked chat ID, pending state, and expiry; apply the decision atomically and audit it. | P0 |
| GUARD-04 | Update the user’s waiting screen; on timeout, tell the user to call their family before paying. | P0 |
| GUARD-05 | Configure alert threshold, quiet hours, monthly summary sharing, and fallback channel. Red alerts bypass quiet hours. | P1 |

### Money tracking and administration

| ID | Requirement | Priority |
| --- | --- | --- |
| TXN-01 | Create, edit, and delete income/expense transactions; use integer paise. | P0 |
| TXN-02 | Ask whether a shielded payment completed, then log and categorize it. | P0 |
| CAT-01 | Categorize by merchant keyword first; optionally suggest with AI and learn from corrections. | P0 |
| BUD-01 | Support overall and category monthly budgets; alert at 80% and 100%. | P0 |
| BUD-02 | Optionally roll over unspent budget. | P2 |
| HIST-01 | Search/filter history by date, category, amount, and account; mark blocked/risky entries. | P0 |
| DASH-01 | Show income/expense trends, category breakdown, budget health, safe-to-spend, forecast, blocked scams, and money saved. | P0 |
| EXP-01 | Export personal data and monthly PDF statement using expiring signed download links; neutralize spreadsheet formula injection. | P0 |
| EXP-02 | Export Excel workbooks. | P1 |
| IMP-01 | Import bank CSV with duplicate detection. | P2 |
| REP-01 | Let users report a UPI ID with per-user rate limits. | P0 |
| ADM-01 | Require admin verification before a report enters the shared blacklist. | P0 |
| ADM-02 | Limit admin views to anonymous stats, health, reports, and audit data. | P0 |
| PRIV-01 | Let the user export or delete all of their own data. | P0 |

### AI assistant

- Explain a rule-engine verdict in short, language-appropriate text and support Web Speech API playback.
- Answer spending questions through a fixed server-side tool list: `get_spend_by_category`, `list_transactions`, `get_budget_status`, `compare_months`, `forecast_month_end`, and `find_recurring_charges`.
- Support a provider adapter for Gemini, Ollama, and user-provided optional providers. User keys are encrypted server-side and write-only from the UI.
- Treat QR text, payee names, and notes as untrusted data. No raw SQL, no AI database access, a maximum of four tool rounds, and a bounded timeout.
- Provide deterministic offline warning templates in English, Hindi, and Telugu. AI failure must not block a risk verdict.

## 6. Deterministic risk model

The proposed default score is the sum of weighted signals. A verified blacklist match overrides the sum to Danger.

| Signal | Points |
| --- | ---: |
| User says they are on a call | +40 |
| Pull request (`collect` or `mandate`) | +30 |
| First-time payee | +20 |
| Amount above 3× 30-day median | +20 |
| Personal account/no merchant code | +15 |
| Above personal limit | +15 |
| Pre-filled amount | +10 |
| Gallery image source | +10 |
| Local hour 23:00–04:59 | +10 |
| Previously paid known payee | −20 |
| Verified blacklist | Override: Danger |

Verdicts are **Safe** below 20, **Caution** from 20 through 49, and **Danger** at 50 or above. Clamp a non-blacklisted score at zero. Identical normalized input and context must return the same score, verdict, and reason codes.

For a scan, the high-amount check is true if any applicable personal limit, median, category-budget, or daily safe-to-spend condition is met. `safe_to_spend_today = max(0, (remaining_budget_month - committed_upcoming) // days_left)`.

## 7. Success measures

- Demo QR set produces expected safe/caution/danger outcomes.
- Measure time from local QR decode to rule verdict (target p95 under one second, excluding optional AI wording).
- Track whether users stop a danger payment, guardian response time, and money recorded as saved.
- Track first-week use of a budget and at least one logged transaction.
- Test accessibility with older and first-time UPI users; validate Hindi/Telugu wording with native speakers.

## 8. Limits and risk communication

- PacShield can only inspect a QR the user scans in PacShield; it cannot see a scan performed inside another payment app.
- QR payee name is user-supplied text, not a bank-verified identity.
- The blacklist begins with no verified entries and grows only after admin review; any preloaded demo entries must be labeled as demo data.
- Web-to-UPI handoff is most reliable on Android; iOS support is limited.
- Voice availability depends on the device/browser. Detection is imperfect.
- The interface must never imply the user is guaranteed safe or blame them for a scam.

## 9. Current release status

The current public Vercel build is a **static browser app**. It includes login/registration UI that stores a display name/email in local storage, manually entered income/expenses and budgets saved per email in that browser, live dashboard calculations, and one-time 80%/100% budget threshold popups. Ledger entries do not sync across browsers/devices and are not imported from a bank. QR scan scenarios and assistant replies remain demos. There is no production authentication, backend, real AI, Telegram delivery, verified payee lookup, exports, or admin service. The local-storage dashboard gate is not an authorization boundary; do not use real credentials or rely on this build to protect money.

## 10. Source documents

- `PACshield application security- PRD (4).pdf` — product requirements draft 1.0.
- `TRD.pdf` — technical design draft 1.0.
- `UI.pdf` — PacShield design brief draft 1.0.
- `webapp flow (1).pdf` — web application flow draft 1.0.
- `brain.md` — project decisions and demo scope, last updated 6 October 2026.

