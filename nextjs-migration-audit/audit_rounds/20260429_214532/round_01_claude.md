---
role: builder
round: 1
status: REVISED_PLAN
proposed_resolutions:
  - ref: A001
    proposed_status: addressed
    action: "Conceded. With `output: 'export'` + `trailingSlash: false` (default), Next emits `out/range.html`, `out/newsletters/2026-03.html`, etc. — not `out/range/index.html`. Pass #1 file list rewritten and `vercel dev` curl tests updated."
  - ref: A002
    proposed_status: addressed
    action: "Conceded. Existing production URLs are `.html` (e.g. `/range.html`, `/newsletters/2026-03.html`). New plan: serve those with HTTP 200 (no redirect) by keeping the `.html` artifacts that static export emits, and *additionally* expose clean URLs via `cleanUrls: true`. T23 drops the wildcard 308. Special-cased `/index.html` and `/newsletters/index.html` to 200 (not redirected)."
  - ref: A003
    proposed_status: addressed
    action: "Conceded. Newsletter content path switched from `.mdx` → `.md` (CommonMark only, no JSX/expressions/ESM). Renderer is `react-markdown` + `remark-gfm` + `rehype-sanitize` with allowlist. New T19a adds malicious-newsletter fixture (script tag, `onerror`, `javascript:` URL, MDX-style `import`, `{expression}`) that must render as inert text. Worker contract unchanged."
  - ref: A004
    proposed_status: addressed
    action: "Conceded. Split into `components/Header.tsx` (server, no hooks) and `components/NavLinks.tsx` (`'use client'`, owns `usePathname` + active styling). `MobileNav` stays client. Acceptance: `next build` passes."
  - ref: A005
    proposed_status: addressed
    action: "Conceded. New T28 adds Playwright suite that loads every route on Vercel preview with CSP enforced, asserts zero `Content-Security-Policy` console violations, asserts hydration (hamburger toggles), and asserts JS-driven nav close on link click. CSP updated to permit Next runtime via documented `script-src 'self'` (Next App Router static export emits same-origin scripts only) plus `style-src 'self' 'unsafe-inline'` for Next inlined critical CSS. Pass #4 rewritten."
  - ref: A006
    proposed_status: addressed
    action: "Conceded. T01 now installs `zod`. New `lib/timetable.ts` exports `TimetableSchema` (zod) and a derived JSON Schema via `zod-to-json-schema` written to `schemas/timetable.schema.json`. `scripts/generate_timetable.py` validates its output against that JSON Schema with `jsonschema`. New `npm run validate:timetable` parses `data/timetable.json` through `TimetableSchema`. Both run in CI."
  - ref: A007
    proposed_status: addressed
    action: "Conceded. T20/T21 rewritten: generate → validate → `npm ci && npm run build` → only then `git commit && git push`. On failure: upload generated file as workflow artifact, exit nonzero, no commit. Both jobs run on `ubuntu-latest` with Node 20 + Python 3.12 cached."
  - ref: A008
    proposed_status: addressed
    action: "Conceded. New T02a: grep `app/globals.css` for `url(` and rewrite every match to root-absolute (`url('/images/hero-bg.svg')`, `url('/fonts/...')`). T28 Playwright suite asserts hero background image loads (computed style `background-image` resolves to a 200-status URL via `page.waitForResponse`)."
  - ref: A009
    proposed_status: addressed
    action: "Conceded. New T29 defines visual regression: Playwright `toHaveScreenshot` against baselines captured from current production (`https://otagodeerstalkers.org.nz`) at 360x800 and 1280x900 for every migrated route. Threshold: `maxDiffPixelRatio: 0.02`. Masks: timetable `<tbody>` on `/range` only. Baselines committed under `tests/visual/__screenshots__/`. CI fails on diff."
new_decisions:
  - id: D_TEMP_1
    decision: "Newsletter content format is sanitized Markdown (`.md`), not MDX."
    rationale: "Email-sourced content is untrusted. MDX compiles to JS; Markdown + rehype-sanitize cannot."
  - id: D_TEMP_2
    decision: "Existing `.html` URLs return 200; clean URLs are added, not substituted."
    rationale: "Constraint says preserve every existing URL exactly. A 308 is not preservation."
  - id: D_TEMP_3
    decision: "Shared validation contract is a JSON Schema generated from a zod source of truth."
    rationale: "Python script and TypeScript app must agree without duplicating definitions."
open_questions: []

---

### Scope
Unchanged. Goal, constraints, and success criteria from round 0 stand. Auditor exposed implementation errors, not scope errors.

### Open Decisions

All nine issues conceded. Defenses-by-evidence were not warranted; the auditor's claims are correct on each point. Specific corrections recorded in `proposed_resolutions` and reflected in the revised Build Plan and Pass Criteria below.

### Steelman Risks (new, post-audit)

- **R11 — `cleanUrls: true` interaction with `.html` artifacts.** Vercel's `cleanUrls` may itself 308 `/range.html` → `/range`. Mitigation: T23 sets `cleanUrls: false` and uses explicit `rewrites` so both `/range` and `/range.html` serve `out/range.html` with 200. Verified by `curl -I` returning `HTTP/2 200` for both.
- **R12 — `react-markdown` strips legitimate styling from existing newsletter HTML.** Existing `2026-03` content uses inline `<style>` and class-based markup. Mitigation: T16 audit converts to plain Markdown + a fixed allowlist of components rendered via `react-markdown`'s `components` prop. Snapshot pinned.
- **R13 — `zod-to-json-schema` output drifts between versions.** Mitigation: pin exact version in `package.json`; commit generated schema; CI step regenerates and `git diff --exit-code`s.
- **R14 — Production baseline screenshots capture transient content (timetable rows update weekly).** Mitigation: mask `/range` `<tbody>`; rebaseline script `npm run visual:update` documented in README.

### Build Plan (revised — only changed/added tasks shown; round 0 tasks not listed remain unchanged)

| task-id | file(s) | what changes | tests required |
|---|---|---|---|
| T01 (rev) | `package.json`, `next.config.ts` | As round 0 plus add deps: `zod`, `zod-to-json-schema`, `react-markdown`, `remark-gfm`, `rehype-sanitize`, `gray-matter`, `@playwright/test`, `vitest`. Remove `@next/mdx`. | `npm run build` exits 0. |
| T02a (new) | `app/globals.css` | Rewrite every `url(...)` to root-absolute (`/images/...`, `/fonts/...`). | `grep -E "url\((?!['\"]?/)" app/globals.css` returns nothing. |
| T04 (rev) | `components/Header.tsx`, `components/NavLinks.tsx`, `components/MobileNav.tsx` | `Header` is a Server Component composing `<NavLinks/>` (client, `usePathname`, active class) and `<MobileNav/>` (client, toggle). | `next build` passes; RTL test for active link + hamburger. |
| T14 (rev) | `app/newsletters/page.tsx`, `lib/newsletters.ts` | Reads `content/newsletters/*.md` (not `.mdx`); parses frontmatter via gray-matter. | Listing matches directory. |
| T15 (rev) | `app/newsletters/[slug]/page.tsx` | Renders body via `react-markdown` with `[remarkGfm]` and `[rehypeSanitize, defaultSchema]` plus a strict allowlist (no `script`, no `iframe`, no `on*` attrs, no `javascript:` href, no raw HTML besides allowlist). | Malicious fixture (T19a) renders all hostile tokens as escaped text. |
| T16 (rev) | `content/newsletters/2026-03.md`, `2026-03-sample.md` | Convert HTML → CommonMark + GFM. Frontmatter `{title, date, issue}`. | Snapshot matches old page body within text-content equality. |
| T17 (rev) | `next.config.ts` | Drop MDX wiring. `pageExtensions: ['ts','tsx']`. | `next build` succeeds. |
| T18 (rev) | `scripts/generate_timetable.py`, `schemas/timetable.schema.json`, `lib/timetable.ts` | Python validates output against `schemas/timetable.schema.json` (`jsonschema`); fails nonzero on invalid. JSON Schema generated from `TimetableSchema` (zod) by `npm run schemas:build`. | `python scripts/generate_timetable.py` on snapshot CSV produces JSON identical to committed copy; schema validation passes. |
| T19 (rev) | `scripts/generate_newsletter.py` | Emits `content/newsletters/YYYY-MM.md` (CommonMark) with frontmatter. Body passed through `bleach` allowlist before write (defense-in-depth before sanitizer at render). | Sample run emits valid `.md` parsed by `gray-matter`. |
| T19a (new) | `tests/fixtures/newsletter-malicious.md`, `tests/newsletter.sanitize.test.ts` | Fixture contains `<script>`, `<img onerror>`, `[x](javascript:alert(1))`, MDX-style `import`, `{2+2}`, raw `<iframe>`. Vitest renders via the production newsletter component. | Rendered HTML contains zero `<script>`, zero `on*=`, zero `javascript:` URLs, zero `<iframe>`; all hostile tokens appear as text only. |
| T20 (rev) | `.github/workflows/sync-timetable.yml` | Order: setup Python+Node → run generator → `python -m jsonschema -i data/timetable.json schemas/timetable.schema.json` → `npm ci` → `npm run validate:timetable` → `npm run build` → commit only on success; on failure upload `data/timetable.json` artifact, exit 1. | Manual workflow run with bad CSV does not commit; with good CSV commits and Vercel preview rebuilds. |
| T21 (rev) | `.github/workflows/publish-newsletter.yml` | Order: generate `.md` → run sanitizer test on new file → `npm ci` → `npm run build` → commit on success only. | `repository_dispatch` test with malicious body fails the workflow without committing. |
| T23 (rev) | `vercel.json` | `{ "cleanUrls": false, "trailingSlash": false, "rewrites": [{"source":"/:path","destination":"/:path.html"},{"source":"/newsletters/:slug","destination":"/newsletters/:slug.html"}], "headers":[/* CSP per T28, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, X-Content-Type-Options nosniff */] }`. **No redirects.** Existing `.html` URLs serve 200 from emitted artifacts; clean URLs serve 200 via rewrite. | `curl -I` returns 200 for `/range`, `/range.html`, `/`, `/index.html`, `/newsletters`, `/newsletters/index.html`, `/newsletters/2026-03`, `/newsletters/2026-03.html`. No 3xx for any current-site URL. |
| T28 (new) | `tests/csp.spec.ts` | Playwright: load every route on preview deploy; fail if any console message matches `/Content Security Policy/i`; assert hamburger opens menu; click first nav link → menu closed; assert hero background image responds 200. | `npx playwright test tests/csp.spec.ts` green against preview URL. |
| T29 (new) | `tests/visual.spec.ts`, `tests/visual/__screenshots__/**` | Playwright `toHaveScreenshot` per route × {360x800, 1280x900}; baselines from current prod; `maxDiffPixelRatio: 0.02`; mask `/range tbody`. `npm run visual` and `npm run visual:update` documented. | CI runs `npm run visual` against preview; fails on diff above threshold. |

### Pass Criteria (revised)

1. `npm run build` exits 0 and `out/` contains: `index.html`, `range.html`, `lodge.html`, `club-hunts.html`, `hunts-course.html`, `competitions.html`, `join.html`, `contact.html`, `404.html`, `newsletters.html` *(or `newsletters/index.html` — verify which Next 15 emits for `/newsletters/page.tsx` and pin in test)*, `newsletters/2026-03.html`, `newsletters/2026-03-sample.html`.
2. For every URL in the production URL inventory (collected from `sitemap.xml` plus a `wget --spider --recursive` crawl of the live site, committed as `tests/url-inventory.txt`), `curl -I` against the Vercel preview returns `HTTP/2 200`. Zero 3xx, zero 4xx, zero 5xx.
3. For every route, both `/route` and `/route.html` return 200 with byte-identical bodies (`curl` + `sha256sum` comparison).
4. T28 Playwright suite passes: zero CSP console violations across all routes; hamburger interaction works; hero image fetch returns 200.
5. `data/timetable.json` validates against `TimetableSchema` (zod) via `npm run validate:timetable`, AND against `schemas/timetable.schema.json` via `python -m jsonschema`. Both must pass.
6. `python scripts/generate_timetable.py` against the committed snapshot CSV produces JSON byte-identical to the committed `data/timetable.json` (`diff` exit 0).
7. T19a malicious-newsletter fixture renders with zero `<script>`, zero `on*=` attributes, zero `javascript:` URLs, zero `<iframe>` in the rendered DOM (Vitest assertion).
8. `scripts/generate_newsletter.py` with sample input produces a `.md` file whose frontmatter parses via `gray-matter` and whose body passes the sanitizer.
9. Archive page lists every `.md` file under `content/newsletters/`, sorted by date desc.
10. T29 visual regression suite passes for all routes at both viewports under threshold `0.02`.
11. Lighthouse on production: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on `/` and `/range`.
12. `/robots.txt`, `/sitemap.xml`, `/favicon.svg` all return 200.
13. The two Google Maps URLs from CLAUDE.md "Links That Must NOT Be Changed" appear byte-for-byte in `out/contact.html` and `out/lodge.html` (`grep -F` exit 0).
14. `sync-timetable.yml` and `publish-newsletter.yml` both fail-without-commit when given known-bad input (verified by dry-run jobs in `tests/workflow-fixtures/`).
15. `git log --grep "Co-Authored-By"` on the migration branch returns nothing.

### Not Claimed / Deferred

- Round 0 deferral list stands.
- New deferral: switching to a Next.js runtime (non-static) for ISR of timetable. Static rebuild via workflow remains the chosen mechanism.
- New deferral: nonce-based CSP. We use hash-free `script-src 'self'` because static export emits same-origin scripts only; nonces require runtime middleware which `output: 'export'` does not support.