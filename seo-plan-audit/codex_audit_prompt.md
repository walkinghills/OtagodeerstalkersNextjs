# Codex audit — Otago Deerstalkers Join funnel + SEO build

## Context

A Next.js 15 dev server is running locally at **`http://localhost:3000`**. This is a fresh implementation of Phase 2 SEO/analytics work for the NZDA Otago Branch site. Your job is to independently verify the implementation behaves as designed.

Working tree: `c:\Users\User\Projects AI\otago-deerstalkers` (branch: `seo-analytics-funnel`). Reference plan: `seo-plan-audit/plan.md` (revision 3). Use your Chrome addon to drive the browser.

## What was implemented

1. **Join funnel** with two events to GA4 (`G-B62VVGCGP1`):
   - `cta_join_internal_click` fires when any internal Join button is clicked (nav header, hero CTAs, footer link, page-bottom CTAs). Carries `current_page`.
   - `cta_join_external_click` fires on the outbound NZDA link on `/join`. Carries `join_source_page` and `join_origin_method`.
   - Origin attribution is three-tier: `sessionStorage` → same-origin `referrer_fallback` → `(direct)`.
   - Activation pattern: `pointerdown` + dedupe via timestamp on `click`/`auxclick`. Tracks left-click (button 0) AND middle-click (button 1). Right-click does NOT track.
   - `transport_type: 'beacon'` on every event so it survives navigation unload.
   - `debug_mode: true` injected only when `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'`.
2. **JSON-LD structured data**:
   - `SportsOrganization` on `/`
   - `SportsActivityLocation` on `/range`
   - `LodgingBusiness` on `/lodge`
   - `Course` on `/hunts-course`
   - `FAQPage` on `/join`
   - `WebPage` + `BreadcrumbList` on `/competitions` and `/club-hunts`
   - `ContactPage` + `BreadcrumbList` on `/contact`
   - `CollectionPage` + `BreadcrumbList` on `/newsletters`
   - `Article` + `BreadcrumbList` on `/newsletters/[slug]`
3. **OG image** at `/og.jpg` (1200×630 stopgap, club photo) wired into root metadata.
4. **`llms.txt`** at the public root.
5. **Dynamic `sitemap.ts`** including newsletter slugs.
6. **No CSP changes** in this branch — existing CSP already whitelists `googletagmanager.com`, `google-analytics.com`, `*.analytics.google.com`.

## Test plan

Run each of these via your Chrome addon. Report PASS/FAIL with the supporting evidence (network request URL/status, console messages, dataLayer state). Don't skip — independent verification matters even where I told you it worked.

### Funnel tests

1. **GA4 loaded.** Navigate to `http://localhost:3000/range`. Verify:
   - `window.gtag` is a function
   - `window.dataLayer` contains a `config` entry for `G-B62VVGCGP1`
   - At least one POST to `https://www.google-analytics.com/g/collect` with `tid=G-B62VVGCGP1` and `en=page_view`, status 200 or 204
   - No CSP violations in console
   - No JS errors

2. **Internal click attribution.** On the loaded `/range` page, click the JOIN button in the header nav (selector `a.btn-join`). Verify:
   - A GA4 collect request fires with `en=cta_join_internal_click`
   - Query params include `ep.current_page=%2Frange` (URL-encoded `/range`)
   - `ep.link_destination_class=internal_cta`
   - `ep.transport_type=beacon`
   - `ep.debug_mode=true` (because this is dev)
   - HTTP status 200 or 204
   - sessionStorage now contains key `joinFunnelOrigin` with value matching `{"origin":"/range","ts":<recent number>}`
   - The browser then navigates to `/join`

3. **External click — sessionStorage path.** On `/join`, click the prominent external Join CTA (the `<a>` whose href starts with `https://www.deerstalkers.org.nz/branches/`). Intercept the click before actual navigation if needed. Verify:
   - GA4 collect fires with `en=cta_join_external_click`
   - `ep.join_source_page=%2Frange`
   - `ep.join_origin_method=sessionStorage`
   - `ep.link_destination_class=external_nzda`
   - Status 200 or 204

4. **External click — direct path.** Hard-reload `/join` directly without going through any internal Join click. Verify:
   - `window.sessionStorage.getItem('joinFunnelOrigin')` is null
   - Click external Join CTA
   - Event fires with `ep.join_source_page=(direct)` and `ep.join_origin_method=direct`

5. **Middle-click test.** On `/range`, middle-click (button 1) the header JOIN. Verify:
   - `cta_join_internal_click` event fires (the funnel denominator includes middle-clicks per the rev-3 plan)
   - Single event, not duplicates

6. **Right-click test.** Right-click the header JOIN button. Verify:
   - No `cta_join_internal_click` event fires (context menu is not a real activation)

### JSON-LD tests

7. **Schema correctness.** For each of `/`, `/range`, `/lodge`, `/hunts-course`, `/join`, `/competitions`, `/club-hunts`, `/contact`, `/newsletters`:
   - Extract all `<script type="application/ld+json">` blocks
   - Parse each as JSON (must not throw)
   - Confirm `@type` matches the expected schema for that page
   - Confirm BreadcrumbList where applicable has `itemListElement` entries with `name` + `item` (URL) shape, in correct order
   - Run each schema through https://search.google.com/test/rich-results (if your Chrome addon supports it; otherwise just verify shape)

### OpenGraph + Twitter Card tests

8. **OG metadata.** On the home page, check `<head>`:
   - `<meta property="og:image" content="...og.jpg">` is present
   - `<meta property="og:type" content="website">`
   - `<meta name="twitter:card" content="summary_large_image">`

### House-style tests

9. **No em dashes.** `grep` the rendered HTML of `/`, `/range`, `/lodge`, `/join`, `/club-hunts`, `/competitions` for em-dash characters (`—`, `&#8212;`, `&mdash;`). Report any hits with the surrounding text.

### Code-level tests

10. Read `lib/analytics/track.ts`. Confirm:
    - `trackEvent` is wrapped in try/catch
    - `debug_mode` is only injected when `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'`
    - No-op when `window.gtag` is undefined
    - Type system uses a discriminated union (no untyped event names)

11. Read `lib/analytics/joinFunnel.ts`. Confirm:
    - All sessionStorage access wrapped in try/catch
    - TTL constant is 30 minutes
    - `(direct)` is the fallback value
    - Same-origin check on referrer before using it

## Output format

Produce a markdown report at `seo-plan-audit/codex_audit_result.md` with:

- Per-test result table (PASS/FAIL + 1-line evidence)
- Any console errors observed
- Any CSP violations observed
- Any deviations from the plan
- Any latent bugs not covered by my test list that you noticed
- Overall: PASS / OPEN_ISSUES (and how many)

Be concise. Use code blocks for evidence (network URLs, console snippets). No filler prose.
