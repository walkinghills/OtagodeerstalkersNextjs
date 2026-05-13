---
role: builder
round: 0
status: REVISED_PLAN
proposed_resolutions: []
new_decisions:
  - id: D_TEMP_1
    decision: "Use Next.js App Router (app/) with TypeScript and `output: 'export'`."
    rationale: "App Router is the current default and recommended path for new Next.js projects. Static export is fully supported. Pages Router is in maintenance mode; choosing it now creates immediate technical debt."
  - id: D_TEMP_2
    decision: "Preserve existing URLs by using directory-based routing without `.html` extensions: `/range`, `/lodge`, `/newsletters/2026-03`, etc."
    rationale: "Current `vercel.json` already strips `.html` via `cleanUrls`. App Router naturally produces extensionless URLs that match. No redirects needed for the canonical form."
  - id: D_TEMP_3
    decision: "Add explicit redirects from `*.html` → clean URL in `next.config.ts` for backwards compatibility with any indexed/bookmarked `.html` links."
    rationale: "After dropping `vercel.json` cleanUrls, old `*.html` links that search engines or external sites have indexed must continue to resolve. Static export does not support `redirects()` natively, so we use `vercel.json` redirects (preserved) instead."
  - id: D_TEMP_4
    decision: "Keep timetable Python script; refactor it to write `data/timetable.json` instead of injecting HTML. Range page reads JSON at build time and renders a typed React table."
    rationale: "Decouples data from presentation. JSON is a clean contract. GitHub Actions cron continues to run; only the output target changes. Re-deploy is triggered by the JSON commit, which Vercel auto-builds."
  - id: D_TEMP_5
    decision: "Newsletters become MDX files under `content/newsletters/YYYY-MM.mdx` with frontmatter (title, date, issue). A dynamic route `app/newsletters/[slug]/page.tsx` with `generateStaticParams` renders each. Archive page lists from filesystem at build time."
    rationale: "MDX preserves rich HTML newsletter content without forcing every edition to be hand-converted to JSX. Archive auto-updates when a new MDX file is committed. Compatible with static export."
  - id: D_TEMP_6
    decision: "Refactor `scripts/generate_newsletter.py` to emit MDX (frontmatter + body) into `content/newsletters/`, replacing the current HTML emission and `<!-- ARCHIVE_START -->` index injection."
    rationale: "Archive listing is now derived from the filesystem at build time, eliminating the duplicate-guard/marker logic. Cloudflare Email Worker → GitHub repository_dispatch flow is unchanged; only the script output changes."
  - id: D_TEMP_7
    decision: "Use `next/font/google` to self-host Merriweather; remove `<link>` tags from page heads."
    rationale: "Avoids FOUT, eliminates third-party request, satisfies static export, and centralizes font loading in `app/layout.tsx`."
  - id: D_TEMP_8
    decision: "Copy `css/styles.css` verbatim into `app/globals.css`. Imported once in `app/layout.tsx`."
    rationale: "Zero design drift. CSS variables, breakpoints, `detail-list` rules all preserved. Migration risk is minimized; styling refactors are explicitly out of scope."
open_questions: []
---

### Scope

Convert the Otago Deerstalkers static site (10 HTML pages + newsletter subdirectory) to Next.js 15 with TypeScript, App Router, and `output: 'export'`. Deploy to Vercel from the existing `walkinghills/otago-deerstalkers` repo on `main`. Preserve every existing URL exactly. Preserve timetable cron and newsletter publish workflows. No CMS, no database. Constraints from the task are accepted as-is.

### Open Decisions

This is round 0; no auditor issues yet. Eight foundational decisions captured in the YAML block above. Each is defended by evidence below in **Build Plan** and **Pass Criteria**.

### Steelman Risks

1. **URL shape mismatch on Vercel static export.** Next.js `output: 'export'` emits `/range/index.html` by default. Combined with `vercel.json` `trailingSlash: false`, requests to `/range` must serve `/range/index.html` without redirecting to `/range/`. Mitigation: set `trailingSlash: false` in `next.config.ts` and verify with `vercel dev` against `out/`. Add explicit `vercel.json` `cleanUrls: true` to keep current behavior.

2. **Old `.html` deep links break.** Search engines, Facebook posts, and the rifle-range Facebook group may have linked to `range.html` directly. Mitigation: add `vercel.json` redirects from `/<page>.html` → `/<page>` (308) for every page. Tested via `curl -I`.

3. **Timetable cron writes to a file the app no longer reads.** If the script keeps writing into `range.html`, build cache will not invalidate and the page goes stale. Mitigation: refactor script to write `data/timetable.json` and update `range_timetable.csv` snapshot. Build reads JSON in a Server Component. CI workflow updated in same PR.

4. **Newsletter HTML is rich and varies per edition.** Forcing every edition into JSX risks subtle escaping bugs (apostrophes, ampersands, inline anchors). Mitigation: MDX preserves HTML semantics; `@next/mdx` compiles at build time. Add a snapshot test for `2026-03` rendering before cutover.

5. **Cloudflare Email Worker → GitHub dispatch payload assumes `/tmp/newsletter_content.txt` and HTML output paths.** Refactoring the Python script can break the worker contract. Mitigation: keep the workflow input contract identical (`ISSUE_NUMBER`, `TITLE`, `DATE`, body file). Only the script's output target changes. Worker code untouched.

6. **`js/main.js` mobile nav uses direct DOM mutation; React hydration may not own those nodes.** Mitigation: port toggle into a `'use client'` `<MobileNav>` component using `useState`. No raw DOM scripts in the new tree.

7. **Absolute path requirement for newsletter pages (per CLAUDE.md) was a workaround for `trailingSlash: false` + relative paths in static HTML.** Next.js `<Link>` always emits absolute paths from app root, so this constraint is satisfied automatically. Risk: any hardcoded relative anchors inside newsletter MDX bodies. Mitigation: MDX lint pass — grep `content/newsletters/*.mdx` for `href="(?!/|https?://|mailto:|tel:|#)"` and rewrite to absolute.

8. **Static export does not support `next/image` optimization.** `images/hero-bg.svg` and any future raster assets must be served as-is. Mitigation: use `<img>` for SVG hero (no optimization needed), or `next/image` with `unoptimized: true` set globally in `next.config.ts`. Document in README.

9. **`favicon.svg`, `robots.txt`, `sitemap.xml` are root-level files.** Mitigation: place in `public/` — Next.js serves them at root unchanged. Verify `out/robots.txt` exists post-build.

10. **Vercel build command and output directory change.** Current project is "Other" framework; switching to Next.js means Vercel auto-detects `next build`, output `out/`. Mitigation: explicitly set `outputDirectory: "out"` in Vercel project settings or in `vercel.json`. First deploy on a preview branch before merging.

### Build Plan

| task-id | file(s) | what changes | tests required |
|---|---|---|---|
| T01 | `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore` | `npx create-next-app@latest . --typescript --app --eslint --no-tailwind --src-dir=false --import-alias "@/*"` into a clean branch; set `output: 'export'`, `trailingSlash: false`, `images.unoptimized: true` | `npm run build` succeeds; `out/` produced |
| T02 | `app/globals.css` | Copy `css/styles.css` verbatim. Delete original `css/` after cutover | Visual diff of `/` vs production: identical |
| T03 | `app/layout.tsx` | Root layout: import `globals.css`, load Merriweather via `next/font/google`, render `<Header/>`, `{children}`, `<Footer/>` | Snapshot test renders nav + footer once |
| T04 | `components/Header.tsx`, `components/Footer.tsx`, `components/MobileNav.tsx` | Extract nav (with active-link highlighting via `usePathname`) and footer from existing HTML. `MobileNav` is `'use client'` and ports `js/main.js` toggle via `useState` | Click hamburger → menu opens; click link → menu closes (RTL test) |
| T05 | `app/page.tsx` | Convert `index.html` body to TSX. `class` → `className`, self-close void tags, escape `&` → `&amp;` where literal | Page renders; visual diff against prod home |
| T06 | `app/range/page.tsx`, `data/timetable.json`, `lib/timetable.ts` | Convert `range.html`. Read `data/timetable.json` in Server Component; render `<TimetableTable>` from typed data. Define `Timetable` type in `lib/timetable.ts` | Build with sample JSON renders correct rows; type errors caught |
| T07 | `app/lodge/page.tsx` | Convert `lodge.html` to TSX | Visual diff |
| T08 | `app/club-hunts/page.tsx` | Convert `club-hunts.html` to TSX | Visual diff |
| T09 | `app/hunts-course/page.tsx` | Convert `hunts-course.html` to TSX | Visual diff |
| T10 | `app/competitions/page.tsx` | Convert `competitions.html` to TSX | Visual diff |
| T11 | `app/join/page.tsx` | Convert `join.html` to TSX | Visual diff |
| T12 | `app/contact/page.tsx` | Convert `contact.html` to TSX. Verify Google Maps clubroom link unchanged (per CLAUDE.md) | Link presence test |
| T13 | `app/not-found.tsx` | Convert `404.html` body. Next.js routes 404s here automatically | Hit `/nonexistent` in `vercel dev` → 404 page renders |
| T14 | `app/newsletters/page.tsx`, `lib/newsletters.ts` | Archive listing. `lib/newsletters.ts` reads `content/newsletters/*.mdx` at build, parses frontmatter (gray-matter), sorts by date desc | Listing matches MDX directory contents |
| T15 | `app/newsletters/[slug]/page.tsx` | Dynamic route. `generateStaticParams` returns one entry per MDX file. Imports MDX content. `generateMetadata` reads frontmatter for `<title>` | `/newsletters/2026-03` renders March edition; visual diff |
| T16 | `content/newsletters/2026-03.mdx`, `content/newsletters/2026-03-sample.mdx` | Convert existing newsletter HTML to MDX with frontmatter `{title, date, issue}`. Strip site chrome (now provided by layout) | Snapshot of rendered HTML matches old page body |
| T17 | `next.config.ts`, `mdx-components.tsx` | Wire `@next/mdx` with `remark-gfm`. Configure `pageExtensions: ['ts','tsx','mdx']` | `next build` compiles MDX |
| T18 | `scripts/generate_timetable.py` | Refactor: write `data/timetable.json` (typed shape) instead of HTML injection into `range.html`. Keep CSV snapshot diff logic. Remove `<!-- TIMETABLE_START/END -->` markers | `python scripts/generate_timetable.py` produces valid JSON validated by `lib/timetable.ts` Zod schema |
| T19 | `scripts/generate_newsletter.py` | Refactor: emit `content/newsletters/YYYY-MM.mdx` with frontmatter + body. Drop archive index injection (now derived). Keep input contract (`ISSUE_NUMBER`, `TITLE`, `DATE`, `/tmp/newsletter_content.txt`) | Run with sample input → MDX file appears, archive page lists it on rebuild |
| T20 | `.github/workflows/sync-timetable.yml` | Update commit paths: `data/timetable.json` and `scripts/range_timetable.csv`. Trigger Vercel rebuild via commit | Manual workflow run on test branch updates JSON; Vercel preview rebuilds |
| T21 | `.github/workflows/publish-newsletter.yml` | Update commit path: `content/newsletters/*.mdx`. Drop `newsletters/index.html` write | `repository_dispatch` test produces MDX commit |
| T22 | `public/favicon.svg`, `public/robots.txt`, `public/sitemap.xml`, `public/images/hero-bg.svg` | Move static assets into `public/` | `out/robots.txt`, `out/sitemap.xml`, `out/favicon.svg` exist |
| T23 | `vercel.json` | Replace with: `{ "cleanUrls": true, "trailingSlash": false, "redirects": [{ "source": "/:path.html", "destination": "/:path", "permanent": true }, { "source": "/newsletters/:slug.html", "destination": "/newsletters/:slug", "permanent": true }], "headers": [...existing security headers...] } ` | `curl -I https://preview/range.html` → 308 to `/range`; security headers present on `/` |
| T24 | `cloudflare-worker/email-worker.js` | No code change. Verify still posts to same `repository_dispatch` event name | Send test email → workflow runs → MDX committed |
| T25 | Vercel project settings | Confirm framework preset auto-detects Next.js; build command `next build`; output directory `out` | Preview deploy succeeds; production cutover after sign-off |
| T26 | `README.md` | Document: dev (`npm run dev`), build (`npm run build`), local timetable test, local newsletter test, deploy flow | Stranger can clone and run |
| T27 | Cleanup | Delete original `*.html`, `css/`, `js/` directories from repo root after parity confirmed | `git ls-files` shows no `.html` outside `content/` snapshots |

### Pass Criteria

1. `npm run build` exits 0 and produces `out/` with `index.html`, `range/index.html`, `lodge/index.html`, `club-hunts/index.html`, `hunts-course/index.html`, `competitions/index.html`, `join/index.html`, `contact/index.html`, `404.html`, `newsletters/index.html`, `newsletters/2026-03/index.html`, `newsletters/2026-03-sample/index.html`.
2. Every URL in the original site resolves on the Vercel preview without redirect: `/`, `/range`, `/lodge`, `/club-hunts`, `/hunts-course`, `/competitions`, `/join`, `/contact`, `/newsletters`, `/newsletters/2026-03`.
3. Every legacy `*.html` URL returns HTTP 308 to its clean equivalent (verified by `curl -I` for all 10 pages).
4. `vercel.json` security headers (CSP, X-Frame-Options, etc.) present on `/` response (verified by `curl -I`).
5. `data/timetable.json` is valid against `lib/timetable.ts` Zod schema; range page renders the same rows as production.
6. `scripts/generate_timetable.py` run locally with the snapshot CSV produces identical `data/timetable.json` to the committed copy (no diff).
7. `scripts/generate_newsletter.py` run with `ISSUE_NUMBER=99`, `TITLE="Test"`, `DATE=2026-12-01`, `/tmp/newsletter_content.txt` containing one paragraph, produces `content/newsletters/2026-12.mdx` with valid frontmatter.
8. Archive page (`/newsletters`) lists every MDX file under `content/newsletters/` sorted by date descending.
9. Mobile nav: at viewport width 360px, hamburger toggles menu open/closed; menu closes when a nav link is clicked (Playwright test).
10. Lighthouse on production: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (Lighthouse audit on `/` and `/range`).
11. `robots.txt` and `sitemap.xml` accessible at `/robots.txt` and `/sitemap.xml`.
12. Both Google Maps links from CLAUDE.md "Links That Must NOT Be Changed" are present byte-for-byte in the rendered HTML of `contact` and `lodge` pages (grep test).
13. GitHub Actions: timetable workflow runs on schedule, commits JSON change only when CSV diff exists; newsletter workflow runs on `repository_dispatch`, commits MDX, does not modify any other file.
14. No `Co-Authored-By` lines in any migration commit (per CLAUDE.md commit convention).

### Not Claimed / Deferred

- Visual redesign or CSS refactor. Styles copied verbatim.
- Tailwind / CSS Modules adoption. Out of scope.
- CMS integration. Explicitly forbidden by constraints.
- Database / runtime fetching. Static export only.
- Image optimization pipeline. `unoptimized: true`; revisit if raster assets are added later.
- Internationalization, dark mode, search.
- Test framework selection beyond what each task specifies (Playwright for nav, Vitest for utils). A dedicated CI test job is deferred to a follow-up milestone.
- Migration of analytics, if any are added later.
- Backfilling historical newsletters older than what currently exists in the repo.