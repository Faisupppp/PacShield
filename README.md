# PacShield

**Scan safe. Pay safe.** A polished, accessible front-end demo for the PacShield personal finance and UPI QR safety assistant.

## Run it

Open `index.html` in a browser, or serve this folder locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. Camera access requires HTTPS or localhost. The QR scanner library is loaded from a CDN only when the camera or image scanner is used. Demo payment scenarios and the dashboard work without a backend.

## What works in this demo

- Responsive finance dashboard with spending, budgets, safety totals, and searchable recent activity.
- Three clickable scan demonstrations for safe, caution, and danger verdicts.
- Deterministic UPI QR parsing and local risk scoring for camera scans and QR images.
- Danger flow keeps payment locked until the user explicitly confirms, and always offers a prominent stop option.
- Browser text-to-speech for the warning.
- Local activity updates after a successful demo payment handoff.

## Honest product limits

This is a front-end demo with sample data. It does not include production authentication, a backend, Telegram guardian delivery, verified payee lookup, or real financial connections. A verdict is a safety signal, not a guarantee. PacShield cannot inspect or block a QR scanned in another UPI app. Never enter a UPI PIN into PacShield.

## Project files

- `index.html` — app structure and dialogs
- `styles.css` — responsive visual design and subtle motion
- `app.js` — dashboard rendering, QR parsing, risk scoring, voice, and interactions
