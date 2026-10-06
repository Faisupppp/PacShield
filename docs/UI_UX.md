# PacShield UI/UX Design Brief

**Source baseline:** PacShield Design Brief draft 1.0, 6 October 2026.  
**Product principle:** Calm, clear, trustworthy. Make the scan result popup the most carefully designed screen.

## 1. Design outcomes

1. Let a hurried user see the right next action in under three seconds.
2. Let an older or non-technical user scan, understand, and decide without assistance.
3. Make spending feel lighter than a spreadsheet; answer “How much can I spend today?” quickly.
4. Give a guardian the payee, amount, and reason in a two-line alert with two clear actions.
5. Give admins an efficient report review while never showing private transaction data.

## 2. Users and contexts

| Audience | Context | Design consequence |
| --- | --- | --- |
| Older/first-time UPI user | Phone in one hand; may be on a call, anxious, and wearing reading glasses. | Large text and touch controls, one decision per screen, spoken warning, short non-technical copy. |
| Everyday tracker user | Checks spending, budgets, and occasional QR scans. | Fast dashboard, clear charts, searchable history, keyboard support. |
| Guardian | Reads a Telegram alert at work and needs a quick decision. | Payee/amount/reason are prominent; large Approve/Block controls; no unnecessary login during the brief alert action. |
| Admin | Reviews scam reports on desktop. | Dense but readable report table, clear evidence, explicit verify/reject, visible audit history. |

Design first for Android Chrome at 360–430 CSS px, then desktop dashboard/admin. Support low-end phones and weak networks.

## 3. Principles

- **Calm before clever:** clear headings, familiar controls, restrained animation; never flash or shame.
- **One main decision:** especially on the verdict sheet; put actions where a thumb can reach.
- **Trust is explicit:** distinguish what is known from what came from unverified QR text. Explain that the payee’s real bank name is not checked.
- **No color-only meaning:** pair semantic color with text, icon, and shape.
- **Progressive detail:** show the short reason first; keep the full signal/evidence available when asked.
- **Use plain words:** say what will happen, then what the user can do. Buttons use verbs: “Stop and report”, “Call my family”, “Continue to UPI app”.
- **Rules stay visible:** assistant wording may explain a verdict but never sounds like an approval from PacShield.

## 4. Visual language and tokens

The supplied design brief defines the primary palette below. Status colors must pass contrast checks and are always paired with labels/shapes.

| Token | Value | Use |
| --- | --- | --- |
| Ink blue | `#17375E` | Headings and primary text. |
| Brand blue | `#2F5D8F` | Links, focus, primary controls. |
| Accent blue | `#2E9BD6` | Highlights, charts, badges. |
| Mist | `#EAF4FB` | Calm panels and secondary surfaces. |
| Safe green | `#1F7A4C` | Safe state, always paired with a check and “Safe”. |
| Caution amber | `#B87500` | Caution state, always paired with a triangle and “Check”. |
| Danger red | `#C0392B` | Danger state, always paired with stop/octagon and “Stop”. |

- Use a high-legibility sans-serif. The design brief calls for Atkinson Hyperlegible; verify availability/licensing and use a local/system fallback. Keep the currently deployed Manrope/DM Sans pairing as a demo styling choice until the design system is adopted consistently.
- Use generous spacing, white surfaces, light borders, subtle shadows, and short transitions. Do not make motion necessary to understand state.
- Charts use the brand-blue family plus one highlight. Direct-label important values and provide a readable text/table alternative.

## 5. Navigation and key screens

### Entry, sign-in, and setup

- Root is the sign-in/create-account screen. Keep account form labels visible, show password controls explicitly, and state whether a submission succeeded.
- Real product onboarding verifies email/mobile, then asks for language, income, budgets, alert limit, and optional guardian. Explain consent before linking anyone.
- After login route by role: User to Home; Admin to admin console. Keep sign-out discoverable in account settings and the main signed-in account menu.
- In the current static demo, the root form is not server-authenticated. Copy must continue to say the account is a browser demo and passwords are not stored/sent.

### Home/dashboard

- Lead with safe-to-spend today, available budget, and the scan action.
- Present income/spending summary, trends, category breakdown, budget health, recent activity, and shield counts without crowding the main safety action.
- Show zero/empty states until a user records data. Label the current manual ledger as browser-saved and never imply a bank account is connected.
- Keep Scan as a prominent action and the assistant as an optional floating entry, not a required navigation step.

### Scan and verdict

- Scanner opens a camera or gallery picker. Include the text “Your QR image is read on this device and never uploaded.” Ask “Are you on a phone call right now?” before showing a verdict.
- The verdict is a full-screen sheet, not a small dialog, so accidental taps cannot dismiss a danger warning.
- Maximum three short sentences before the actions. Show real payee/amount and “as written in the QR” provenance.
- Safe: check icon/circle, “Safe”, short caveat, Continue primary.
- Caution: triangle, “Take a moment”, short reasons, Confirm/Ask family.
- Danger: stop shape, “Stop. Do not pay.” Red is paired with icon and title; reasons shown as chips; Stop and report first and largest; Call my family available; Continue locked until guardian approval or typed confirmation; 1930 visible.
- Danger never uses countdown pressure, guilt, or a hidden cancel. Guardian wait may show a calm, explained timer because the alert itself expires.
- Voice is off by default until enabled; when a user turns it on, include replay. All spoken copy remains visible as text. Haptics are optional and must not be the only signal.

### Money, budgets, account, assistant, admin

- **Money:** short list rows, recognizable category labels, search, date/category/amount/account filters, clear risky/blocked markers.
- **Budgets:** progress bars with both percentage and exact spent/remaining values; explain 80%/100% alerts. The current browser app opens a modal on the first crossing of either threshold for each monthly limit.
- **Account/privacy:** language/text-size controls, alert limit, guardian sharing and revocation, AI provider/key state, export/delete, and sessions.
- **Ask PacShield:** conversational layout with suggested prompts, message provenance, and a reminder when an answer uses an AI provider. Keep demo/local replies labeled as demos.
- **Admin:** report evidence, submitter count, verify/reject actions, audit event. Never expose a transaction viewer or secret key.

## 6. Copy and voice

- Use brief, reassuring sentences; avoid bank/engineering jargon.
- State the real amount and QR-provided payee plainly. Do not present a QR name as a verified identity.
- Suggested danger headline: **“Stop. Do not pay.”** Explain that scanning and entering a UPI PIN sends money out.
- Say what happens, then one concrete next step. Do not blame the user or imply a guarantee.
- Provide English, Hindi, and Telugu fixed templates for every reason code so a warning remains available when AI is offline. Ask native speakers to review Hindi/Telugu before the demo.
- Browser speech voices vary; do not promise that every phone has a Telugu/Hindi voice.

## 7. Accessibility and responsive behavior

- Target WCAG 2.2 AA. Use semantic headings/forms, keyboard operation, visible focus, accessible names, and readable error summaries.
- Design brief target: 18 px base text for the primary older-user experience, three text-size steps, high contrast, and zoom to 200%. The current prototype’s compact dashboard typography should be enlarged in a production accessibility pass.
- Touch targets should be at least 48 px; primary actions live in the lower thumb-reachable area on mobile.
- Do not communicate verdict, budget progress, or validation by color alone. Include labels/icons and accessible text.
- Support reduced motion; animations are brief fades/slides only. Respect keyboard focus and return it to the initiating control after a dialog closes.
- Screen-reader charts must have a concise summary or equivalent data list/table. All audio has visible text.

## 8. Interaction states and errors

| State | User feedback |
| --- | --- |
| Camera denied/unavailable | Offer image selection or demo QR, explain that camera needs HTTPS/localhost. |
| QR unreadable/invalid | Plain reason, no automatic payment handoff, retry action. |
| Safe Browsing unavailable | Say the URL could not be checked; do not claim it is safe. |
| AI unavailable | Preserve rule verdict and show fixed template. |
| Guardian waiting | Show who was alerted, what happens next, expiry, and option to call family. |
| Guardian timeout | Tell the user there is no response and recommend calling before paying. |
| Network/API failure | Preserve user-entered values when safe; retry/exit options; never silently report a transaction as saved. |
| Empty history/budget | Encourage the next useful step without fake metrics. Explain that entries and limits are saved in this browser. |
| Session expired | Explain that sign-in is needed; do not lose a draft transaction. |

## 9. Usability acceptance checks

- Older user can identify “Stop” on a danger screen within three seconds and reach it without scrolling.
- User can explain why a QR received a caution/danger verdict from the visible reason labels.
- User can tell when a payee identity is unverified and that PacShield cannot see scans inside other payment apps.
- Keyboard-only user can sign in, navigate the dashboard, scan via upload where possible, and dismiss/complete dialogs.
- Screen reader announces heading, verdict, reason, and primary action in the expected order.
- Verify at 360 px, 430 px, tablet, desktop, 200% zoom, reduced motion, high contrast, and with missing optional AI/camera/voice capabilities.

