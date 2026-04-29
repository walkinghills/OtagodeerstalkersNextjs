# Otago Deerstalkers Website – CLAUDE.md

## Project Overview

Static HTML/CSS/JS website for the NZDA Otago Branch (otagodeerstalkers.co.nz).
Hosted on **Vercel**, source on **GitHub** (`walkinghills/otago-deerstalkers`, branch: `main`).
Vercel auto-deploys on every push to `main`.

## Repository Structure

```
index.html              Home page
range.html              Chaz Forsyth Rifle Range (rifle range)
lodge.html              Blue Mountains Lodge
club-hunts.html         Club Hunts
hunts-course.html       HUNTS Course (hunter education)
competitions.html       Competitions
contact.html            Contact page
join.html               Join/membership page
404.html                Custom 404 page
favicon.svg
robots.txt
sitemap.xml

css/styles.css          All site styles (single file)
js/main.js              Mobile nav toggle and minor UI
images/hero-bg.svg

newsletters/
  index.html            Newsletter archive listing
  2026-03.html          March 2026 edition
  2026-03-sample.html   Sample edition

scripts/
  generate_timetable.py   Parses Google Sheets CSV → injects HTML into range.html
  generate_newsletter.py  Generates newsletter HTML from plain text
  range_timetable.csv     Snapshot of Google Sheets timetable (for diff comparison)

.github/workflows/
  sync-timetable.yml      Monthly cron (1st of month, 11:00 UTC) — syncs range timetable
  publish-newsletter.yml  Manual/repository_dispatch — publishes a new newsletter edition

cloudflare-worker/
  email-worker.js         Cloudflare Email Worker: receives inbound email → triggers GitHub Action

config/
  .env                    API key storage (placeholder)

vercel.json               Vercel config: cleanUrls, trailingSlash:false, security headers
```

## Vercel Configuration

- `cleanUrls: true` — `.html` extension is stripped from URLs
- `trailingSlash: false` — no trailing slashes on URLs
- **Critical:** All pages inside `newsletters/` must use **absolute paths** (e.g. `/index.html`, `/newsletters/2026-03`) not relative paths. Relative paths resolve incorrectly from subdirectory pages with `trailingSlash: false`.

## Key Content Facts

- **Rifle range:** Chaz Forsyth Rifle Range, Leith Valley Road, Dunedin
  - Google Maps pin: `https://maps.app.goo.gl/N8Eh2acjfGkaandNA`
  - Open most Saturdays 1–4pm | Members $5, non-members $10
  - Facebook group for closure notices: `https://www.facebook.com/groups/1195200207197835/`
- **Lodge:** Blue Mountains Lodge, 65 Rongahere Road, Beaumont 9591
  - ~1hr 20min from Dunedin via SH1 south; 1 min south of Beaumont Bridge on left
  - Members $10/night; Other NZDA $15; Non-members $20; Family rate $25 (Dec–Jan)
  - Children under 16 free
  - Keys must be returned within 48 hours (24 hours during April)
- **Clubrooms:** 53 Malvern Street, Woodhaugh, Dunedin 9010
- **Meetings:** 2nd Monday of every month, 7:30pm (no meeting January or April)
- **HUNTS Course coordinator:** Frans Laas — 027 230 7157
- **Central Otago lodge contact:** Tony Alexander — 027 447 9398

## Lodge Key Pickup Locations (Dunedin)

| Retailer | Address |
|---|---|
| Elio's Gun Shop | 219 King Edward Street, South Dunedin |
| Hunting and Fishing | 18 Maclaggan Street, Dunedin |
| Gun City Dunedin | 96 Cumberland Street, Central Dunedin |
| Central Otago | Tony Alexander, 027 447 9398 |

## Timetable System

- Google Sheet ID: `1QSI53iZrA_tE4fka7oV2PJufCzZvv1Z0x1YFD_EjU84`
- Sheet must be publicly shared (View, no login) for the workflow to fetch CSV
- `scripts/generate_timetable.py` injects HTML between `<!-- TIMETABLE_START -->` and `<!-- TIMETABLE_END -->` markers in `range.html`
- `scripts/range_timetable.csv` is the stored snapshot; the workflow diffs against it and only updates if changed
- To run locally: `python3 scripts/generate_timetable.py` (uses snapshot) or `python3 scripts/generate_timetable.py --csv /path/to/new.csv`
- Date format in CSV: `DD-MMM-YYYY` (e.g. `01-Mar-2026`)
- Status values: `open`, `closed`, `close`
- Uses `str(dt.day)` not `%-d` (Windows-compatible)

## Newsletter System

- New editions triggered via GitHub Actions `publish-newsletter.yml`
- Input: `ISSUE_NUMBER`, `TITLE`, `DATE` (YYYY-MM-DD), body text at `/tmp/newsletter_content.txt`
- Output: `newsletters/YYYY-MM.html` + updated `newsletters/index.html`
- Archive marker in index: `<!-- ARCHIVE_START -->`
- Duplicate guard: skips if slug already present in index
- Inbound email pipeline: Cloudflare Email Worker (`cloudflare-worker/email-worker.js`) → GitHub `repository_dispatch`

## GitHub Actions Notes

- Env var: `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` (suppresses Node.js deprecation warnings)
- All GitHub expression values (`${{ }}`) used in shell must be passed via `env:` block, not inline
- Both workflows do `git pull --rebase origin main` before pushing to avoid rejection if repo advanced

## CSS & Design

- Single stylesheet: `css/styles.css`
- Fonts: Merriweather (headings), system sans-serif (body)
- Palette: green/tan/cream — CSS variables in `:root`
- Breakpoint for mobile nav: `720px`
- Nav: `white-space: nowrap` on `.nav-links a` prevents multi-word items wrapping
- **`detail-list` items:** Always wrap text content in a `<div>` after the `.di` icon span, so wrapped text aligns to text start not the icon. Pattern:
  ```html
  <li><span class="di">✓</span><div>Text content here</div></li>
  ```

## Commit Convention

- No `Co-Authored-By` lines in commits
- Push directly to `main`; Vercel deploys automatically

## Links That Must NOT Be Changed

- `https://maps.google.com/?q=53+Malvern+Street+Woodhaugh+Dunedin` — clubrooms (contact.html, index.html)
- `https://maps.google.com/?q=65+Rongahere+Road+Beaumont+9591+New+Zealand` — lodge (lodge.html)

## GitHub PAT Location

`c:\Users\User\Projects AI\Github key.txt`
