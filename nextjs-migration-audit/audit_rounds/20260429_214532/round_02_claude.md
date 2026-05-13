---
role: builder
round: 3
status: REVISED_PLAN
proposed_resolutions:
  - ref: "A001 static export artifact shape is wrong"
    proposed_status: addressed
    action: "Pinned artifact shape: with `trailingSlash: false` + `output: 'export'`, Next emits flat `out/<page>.html` files (e.g. `out/range.html`, `out/newsletters.html`, `out/newsletters/2026-03.html`). Updated T01, T22 expected output, and pass criteria #1 to enumerate the exact filenames. Removed all `/index.html` artifact assumptions."
  - ref: "A002 exact URL preservation contradicted by redirects"
    proposed_status: addressed
    action: "Reversed redirect strategy per D002. T23 now: NO redirects from `/<page>.html`. Vercel serves `/range.html` as 200 (the actual artifact) and `cleanUrls: true` makes `/range` also serve 200 from the same file. Added explicit pass criteria #3a (every legacy `*.html` URL returns 200, not 308) and #3b (`/`, `/newsletters`, `/newsletters/2026-03` also return 200). Added curl matrix in T29 covering both shapes for all 10 pages plus newsletter slugs."
  - ref: "A005 CSP check is insufficient"
    proposed_status: addressed
    action: "Replaced hash-free CSP claim. T23 now sets a static-export-compatible CSP: `script-src 'self' 'unsafe-inline'` (justified: Next emits inline bootstrap `<script>` for App Router hydration on static export; nonces require runtime which static export lacks). T28 runs Playwright against the preview URL with `page.on('console')` failing the test on any CSP violation, plus the existing hamburger assertion. Documented the `'unsafe-inline'` decision and follow-up (move to hashed CSP) in README and as D004."
  - ref: "A010 missing Python dependency contract"
    proposed_status: addressed
    action: "Added T18a: create `scripts/requirements.txt` pinning `jsonschema==4.23.0` and (removed `bleach` per A011 resolution) `markdown-it-py==3.0.0` for the raw-token rejection check. Updated T20 and T21 workflows to run `python -m pip install -r scripts/requirements.txt` before invoking generators. Added pass criteria #15: `pip install -r scripts/requirements.txt` succeeds on a clean Python 3.12 environment."
  - ref: "A011 newsletter sanitization behavior is contradictory"
    proposed_status: addressed
    action: "Adopted single policy: strict CommonMark/GFM, no raw HTML. T15 renderer uses `react-markdown` + `remark-gfm` ONLY (no `rehype-raw`, no `rehype-sanitize` needed because raw HTML is dropped by default). T19 generator parses content with `markdown-it-py` and rejects any `html_block` or `html_inline` tokens, exiting non-zero before any commit. Removed `bleach`. T21 pass criteria: malicious input (`<script>`, `<img onerror>`, `<iframe>`) causes generator exit code ≠ 0 and produces no MDX file and no commit. Renamed `content/newsletters/*.mdx` → `content/newsletters/*.md` everywhere (T14, T15, T16, T19, T21, T27). Removed `@next/mdx`, `mdx-components.tsx`, and MDX from `pageExtensions` in T17."
  - ref: "A012 preview test execution is not wired"
    proposed_status: addressed
    action: "Added T30: `vercel pull --yes --environment=preview && vercel build && vercel deploy --prebuilt --token=$VERCEL_TOKEN > .preview-url`. Exports `PLAYWRIGHT_BASE_URL=$(cat .preview-url)` and `LIGHTHOUSE_URL=$(cat .preview-url)`. T28 (Playwright CSP + nav), T29 (curl URL matrix), and T31 (Lighthouse CI against preview URL) all consume that env var. Pass criteria #9, #10, #16 reference the preview URL captured by T30. Production promotion (T25) gated on T28–T31 green."
new_decisions:
  - id: D_TEMP_4
    decision: "CSP for static export uses `script-src 'self' 'unsafe-inline'`; nonce/hash CSP is deferred."
    rationale: "Next App Router with `output: 'export'` injects an inline hydration script per route at build time. Without a runtime, nonces are impossible; precomputing hashes for every Next-generated inline script is fragile across Next minor versions. `'unsafe-inline'` is the documented escape hatch and the site has no third-party scripts. Tracked as a follow-up in README."
  - id: D_TEMP_5
    decision: "Newsletter format is `.md` (CommonMark + GFM) rendered by `react-markdown`. No MDX, no raw HTML."
    rationale: "Email-sourced content is untrusted. Dropping MDX removes the JS-execution surface entirely; dropping raw HTML removes the XSS surface. Renderer escapes any HTML it sees. Generator rejects raw HTML tokens at write time as defense-in-depth."
  - id: D_TEMP_6
    decision: "Legacy `.html` URLs are preserved as the actual served artifact (HTTP 200), not redirected."
    rationale: "Constraint: 'Must preserve all existing URLs exactly.' Static export naturally emits `out/range.html`. With `cleanUrls: true`, both `/range` and `/range.html` serve the same file with 200. No redirect, no URL change visible to clients or crawlers."
open_questions: []
---

### Scope
Unchanged. Goal, constraints, and success criteria carry forward from round 0.

### Open Decisions

**A001 — CONCEDE.** Pinned artifacts under `trailingSlash: false`:
```
out/index.html
out/range.html
out/lodge.html
out/club-hunts.html
out/hunts-course.html
out/competitions.html
out/join.html
out/contact.html
out/404.html
out/newsletters.html
out/newsletters/2026-03.html
out/newsletters/2026-03-sample.html
```
No `/index.html` for subpages. Pass criterion #1 rewritten to assert this exact list.

**A002 — CONCEDE.** No redirects on legacy URLs. `vercel.json` strips redirects entirely. `cleanUrls: true` aliases `/range` → `/range.html` (200), and `/range.html` itself remains a 200. T23 only retains `cleanUrls: true`, `trailingSlash: false`, and security headers. Pass criteria split: #3a legacy `.html` returns 200; #3b clean URL returns 200; #3c both serve identical body bytes.

**A005 — CONCEDE.** Static export cannot use nonces. Adopted `script-src 'self' 'unsafe-inline'` (D_TEMP_4) with Playwright enforcement against the preview deploy. The earlier "hash-free `'self'`" claim is withdrawn — Next's hydration script is inline.

**A010 — CONCEDE.** Added `scripts/requirements.txt` and pip install steps in both workflows. See T18a.

**A011 — CONCEDE.** One policy, one format. `.md` only, no raw HTML, generator rejects, renderer escapes. The MDX/markdown contradiction is removed by deleting MDX from the plan entirely.

**A012 — CONCEDE.** Added T30 to materialize a preview URL and feed it to T28/T29/T31.

### Steelman Risks (additions only)

- **R11 (new, from A011 resolution):** Existing newsletter HTML in `2026-03.html` contains real anchor tags and `<strong>`/`<em>` that must survive conversion. Mitigation: T16 conversion script translates HTML → Markdown via `markdownify` once at migration time (dev-only dependency, not in `requirements.txt`); output is hand-reviewed; result contains zero raw HTML tokens (verified by T19's same rejection check run against converted files).
- **R12 (new, from A005 resolution):** `'unsafe-inline'` weakens CSP. Mitigation: site has no user input rendered to HTML, no third-party scripts, no eval. Documented residual risk in README; D_TEMP_4 is explicit follow-up.
- **R13 (new, from A002 resolution):** Two URL shapes serving the same content can split SEO signal. Mitigation: `<link rel="canonical">` in `app/layout.tsx` points to clean URL only; `sitemap.xml` lists clean URLs only.

### Build Plan (deltas from round 0)

| task-id | file(s) | what changes | tests required |
|---|---|---|---|
| T01 (revised) | `next.config.ts` | `output: 'export'`, `trailingSlash: false`, `images.unoptimized: true`. Remove MDX from `pageExtensions`. | `npm run build` produces the pinned artifact list above |
| T14 (revised) | `app/newsletters/page.tsx`, `lib/newsletters.ts` | Reads `content/newsletters/*.md` with `gray-matter` for frontmatter | Listing matches md directory |
| T15 (revised) | `app/newsletters/[slug]/page.tsx` | Renders body with `react-markdown` + `remark-gfm`. No `rehype-raw`. No `rehype-sanitize` (raw HTML dropped by default). | `<script>` in body renders as escaped text, not executed (Vitest) |
| T16 (revised) | `content/newsletters/2026-03.md`, `content/newsletters/2026-03-sample.md` | Convert legacy HTML to Markdown; verify zero raw HTML tokens | T19 rejection check passes against converted files |
| T17 (revised) | `next.config.ts` | Remove `@next/mdx` config. `pageExtensions` defaults to `ts,tsx`. | `next build` succeeds |
| T18a (new) | `scripts/requirements.txt` | Pin `jsonschema==4.23.0`, `markdown-it-py==3.0.0` | `pip install -r scripts/requirements.txt` succeeds in clean venv |
| T19 (revised) | `scripts/generate_newsletter.py` | Parse content with `markdown-it-py`; if any `html_block` or `html_inline` token present, exit 1 before write. Emit `content/newsletters/YYYY-MM.md` with frontmatter. | Malicious input fixtures (`<script>`, `<img onerror>`, `<iframe>`) all produce exit 1, no file written, no commit |
| T20 (revised) | `.github/workflows/sync-timetable.yml` | Add `python -m pip install -r scripts/requirements.txt` before generator | Workflow run installs deps, generator succeeds |
| T21 (revised) | `.github/workflows/publish-newsletter.yml` | Add pip install step. Commit only on generator exit 0. Path: `content/newsletters/*.md` | Malicious dispatch produces no commit (workflow fails at generator step) |
| T23 (revised) | `vercel.json` | `{ "cleanUrls": true, "trailingSlash": false, "headers": [{ "source": "/(.*)", "headers": [{ "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'" }, { "key": "X-Frame-Options", "value": "DENY" }, { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }] }] }`. NO `redirects` block. | Headers present on `/`, `/range`, `/range.html` (curl); CSP enforced (Playwright) |
| T28 (revised) | `tests/e2e/csp-and-nav.spec.ts` | Playwright spec runs against `process.env.PLAYWRIGHT_BASE_URL`; fails on any CSP `console.error` matching `Content Security Policy`; asserts hamburger toggle at 360px viewport | `npx playwright test` exits 0 against preview |
| T29 (revised) | `tests/url-matrix.sh` | `curl -sI` for every URL: `/`, `/index.html`, `/range`, `/range.html`, `/lodge`, `/lodge.html`, `/club-hunts`, `/club-hunts.html`, `/hunts-course`, `/hunts-course.html`, `/competitions`, `/competitions.html`, `/join`, `/join.html`, `/contact`, `/contact.html`, `/newsletters`, `/newsletters.html`, `/newsletters/2026-03`, `/newsletters/2026-03.html`, `/newsletters/2026-03-sample`, `/newsletters/2026-03-sample.html`, `/robots.txt`, `/sitemap.xml`. All must return 200. Pairs (clean vs `.html`) must serve byte-identical bodies. | Script exits 0 |
| T30 (new) | `scripts/deploy-preview.sh` | `vercel pull --yes --environment=preview && vercel build && PREVIEW_URL=$(vercel deploy --prebuilt --token=$VERCEL_TOKEN)`. Writes URL to `.preview-url`. | Script exits 0; `.preview-url` is a valid HTTPS URL |
| T31 (new) | `.lighthouserc.json`, `tests/lighthouse.sh` | Lighthouse CI against `$LIGHTHOUSE_URL` for `/` and `/range`. Assertions: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. | LHCI exits 0 |
| T25 (revised) | Vercel project settings + promotion gate | Production promotion requires T28, T29, T31 all green against the preview URL from T30. | Manual gate documented in README |
| T27 (revised) | Cleanup | Delete `*.html`, `css/`, `js/` from repo root. Old newsletter HTML deleted after T16 conversion verified. | `git ls-files | grep -E '\.html$' | grep -v node_modules` returns empty |

All other tasks (T02–T13, T22, T24, T26) carry forward from round 0 unchanged.

### Pass Criteria (revised, full list)

1. `npm run build` exits 0 and produces exactly: `out/index.html`, `out/range.html`, `out/lodge.html`, `out/club-hunts.html`, `out/hunts-course.html`, `out/competitions.html`, `out/join.html`, `out/contact.html`, `out/404.html`, `out/newsletters.html`, `out/newsletters/2026-03.html`, `out/newsletters/2026-03-sample.html`, plus `out/robots.txt`, `out/sitemap.xml`, `out/favicon.svg`, `out/images/hero-bg.svg`.
2. Every clean URL resolves on the preview with HTTP 200: `/`, `/range`, `/lodge`, `/club-hunts`, `/hunts-course`, `/competitions`, `/join`, `/contact`, `/newsletters`, `/newsletters/2026-03`, `/newsletters/2026-03-sample`.
3a. Every legacy URL resolves with HTTP 200 (NOT 308): `/index.html`, `/range.html`, `/lodge.html`, `/club-hunts.html`, `/hunts-course.html`, `/competitions.html`, `/join.html`, `/contact.html`, `/newsletters.html`, `/newsletters/2026-03.html`, `/newsletters/2026-03-sample.html`.
3b. Each clean/`.html` pair serves byte-identical response bodies (T29 diff).
3c. `<link rel="canonical">` on every page points to the clean URL.
4. `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` headers present on `/`, `/range`, `/range.html` (curl `-I` check).
5. `data/timetable.json` validates against the JSON Schema generated from the zod source of truth (D003).
6. `scripts/generate_timetable.py` run locally with the snapshot CSV produces byte-identical `data/timetable.json` to the committed copy.
7. `scripts/generate_newsletter.py` with valid input produces `content/newsletters/YYYY-MM.md` with frontmatter `{title, date, issue}`.
7a. Same script with malicious inputs (`<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`, `<iframe src=javascript:alert(1)>`) exits non-zero and writes no file.
8. Archive page `/newsletters` lists every `.md` file under `content/newsletters/` sorted by date desc.
9. Playwright (T28) against `$PLAYWRIGHT_BASE_URL`: zero CSP console violations across all 12 routes; hamburger toggles at 360px width; menu closes on link click.
10. Lighthouse (T31) on `/` and `/range` against `$LIGHTHOUSE_URL`: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
11. `/robots.txt` and `/sitemap.xml` return 200; sitemap lists clean URLs only.
12. Both Google Maps links from CLAUDE.md "Links That Must NOT Be Changed" present byte-for-byte in rendered HTML of `contact` and `lodge` pages (grep test).
13. GitHub Actions: timetable workflow commits `data/timetable.json` only when CSV diff exists; newsletter workflow commits `content/newsletters/*.md` only on generator exit 0; neither workflow modifies any other tracked file.
14. No `Co-Authored-By` lines in any migration commit.
15. `python -m pip install -r scripts/requirements.txt` succeeds on a clean Python 3.12 venv (CI assertion).
16. T30 produces a reachable preview URL (HTTP 200 on `/`); T28, T29, T31 all run against that URL and exit 0 before any production promotion.

### Not Claimed / Deferred

Carries forward from round 0, plus:
- Hashed/nonced CSP (D_TEMP_4 follow-up). Tracked in README.
- Markdown→HTML migration of newsletters older than `2026-03` (none currently exist in repo).
- Automated detection of new Next minor-version inline-script changes affecting CSP. Manual re-check on Next upgrades.