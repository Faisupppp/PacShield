# PacShield

**Scan safe. Pay safe.** A polished, accessible front-end demo for the PacShield personal finance and UPI QR safety assistant.

## Run it

Open `index.html` for sign in. After a valid demo sign-in, PacShield opens `home.html`. To use the protected dashboard locally, serve this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. Camera access requires HTTPS or localhost. The QR scanner library is loaded from a CDN only when the camera or image scanner is used. Demo payment scenarios and the dashboard work without a backend.

## What works in this demo

- Root `index.html` is the first page. Demo sign-in/registration goes to the protected `home.html` dashboard with a welcome popup; sign-out returns to login.
- Browser-only account name/email editing and sign-out, plus a PacShield guide popup with fixed demo replies.
- Manual income and expense entries saved per account in this browser; live monthly totals, category breakdown, and searchable recent activity.
- Three clickable scan demonstrations for safe, caution, and danger verdicts.
- Deterministic UPI QR parsing and local risk scoring for camera scans and QR images.
- Danger flow keeps payment locked until the user explicitly confirms, and always offers a prominent stop option.
- Browser text-to-speech for the warning.
- Editable overall and category budget limits with one-time popups at 80% and 100% usage.

## Honest product limits

The budget ledger is usable now for manual tracking and persists in this browser for each demo email. It does not sync across devices or connect to a bank; browser data can be lost if site storage is cleared. The site still does not include production authentication, a backend, Telegram guardian delivery, verified payee lookup, or real financial connections. A verdict is a safety signal, not a guarantee. PacShield cannot inspect or block a QR scanned in another UPI app. Never enter a UPI PIN into PacShield.
The sign-in and registration forms are UI previews only, not real authentication. A demo display name and email are saved in local browser storage so the dashboard can personalize; passwords are never saved or sent. The assistant popup uses fixed replies and is not connected to an AI service.

## Project files

- `index.html` — first-page sign-in and registration UI
- `home.html` — signed-in dashboard and dialogs
- `styles.css` — responsive visual design and subtle motion
- `app.js` — QR parsing, risk scoring, voice, and dashboard interactions
- `ledger.js` — browser-local income/expense ledger, monthly budgets, totals, and budget alerts
- `login.css`, `login.js` — sign-in and registration demo styles and behavior
- `account-assistant.css`, `account-assistant.js` — account editor and assistant popup interactions
## Product documents

- [Technical project and security documentation](docs/TECHNICAL_PROJECT_SECURITY_DOCUMENTATION.md) — consolidated project overview, workflow, architecture, features, security, validation, and deployment status in the supplied reference section order
- [PRD](docs/PRD.md) — product goals, roles, requirements, risk model, and current release status
- [TRD](docs/TRD.md) — target architecture, parser/risk contracts, API, and security design
- [Web app flow](docs/WEB_FLOW.md) — routes and user/guardian/admin workflows
- [UI/UX design](docs/UI_UX.md) — visual system, screen behavior, accessibility, and copy guidance
