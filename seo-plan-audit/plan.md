# NZDA Otago Branch — SEO, AI Indexing, and Analytics Plan (Phase 1 wrap-up)

**Revision 3** — adds the round-2 audit findings (A008, A011, A012, A013, A014) as additional locked decisions. This version is the canonical build plan.

## Context

Otago Deerstalkers brochure site is live at `https://otagodeerstalkers.co.nz` on Vercel.
Next.js 15.3.9, App Router, TypeScript. One developer (Sal Martin, volunteer).
Small club brochure site for the NZDA Otago Branch.

Phase 1 of the SEO/analytics build is complete; this document covers the remaining build items.

## Already shipped (verify only, do not re-audit)

- Vercel Analytics + Speed Insights firing (pageviews only — see decision D-VA below)
- GA4 firing (`G-B62VVGCGP1`) with IP anonymization, confirmed via network capture
- JSON-LD on home (`SportsOrganization`), range (`SportsActivityLocation`), lodge (`LodgingBusiness`), hunts-course (`Course`), join (`FAQPage`)
- `public/llms.txt` for AI indexing
- `robots.txt` permissive (wildcard `User-agent: *`)
- Dynamic `app/sitemap.ts` including newsletter slugs
- Footer privacy line (low-key disclosure, no consent banner)
- Search Console verified via DNS TXT, sitemap submitted
- CSP whitelist: GA4 (`googletagmanager.com`, `google-analytics.com`, `*.analytics.google.com`), Meta Pixel (`connect.facebook.net`, `www.facebook.com`), Cloudflare Analytics, Vercel insights
- Legacy `/nzda-otago.github.io/*` redirects (Google indexed those before, was 404'ing)
- House-style enforcement: no em dashes in any content

## Locked-in design decisions

These are settled (post-audit) and not up for re-debate in the next audit pass.

**D-VA — Vercel Analytics stays pageview-only.** Custom events do NOT dual-write to Vercel. Reason: splitting funnel data across two transports complicates analysis even though Hobby tier technically supports custom events at low volume. GA4 is the sole custom-event transport.

**D-GA4-GATE — GA4 unavailability blocks the funnel work, not silently degrades.** If T0 probe fails, status flips to NEEDS_USER. No fallback transport. This supersedes any prior "fall back to Vercel" framing.

**D-PROBE — T0 must validate event delivery, not just config presence.** Probe dispatches a real test event (`__analytics_probe`) and observes a `200/204` response from `google-analytics.com/g/collect` (or DebugView entry) before unlocking T3–T6.

**D-ACTIVATION — Pointerdown + click-dedupe, not click-only.** Outbound link clicks tear down JS context on navigation; pointerdown fires before that boundary. Native `<a href>` semantics preserved. `gtag('event', ..., {transport_type: 'beacon'})` ensures the event survives unload.

**D-DEBUG — `debug_mode` injection gated on Vercel env var, not hostname.** Use `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'`. Hostname matching would break if a custom preview domain is ever introduced.

**D-DIM — Single GA4 custom dimension `join_source_page`.** Not several. One dim simpler to report on; the source page is the only attribute needed for the user's question.

**D-JSONLD — `WebPage`, `ContactPage`, `CollectionPage`, `Article` schemas only.** No `Event` or `SportsEvent` on the upcoming events. Reason: events change frequently; structured-data maintenance burden exceeds the SERP benefit at this scale.

**D-PROBE-RESPONSE (round 2, A008) — T0 gate waits for the GA4 collect RESPONSE, not just the request.** Asserts response status 200/204 and `tid=G-B62VVGCGP1` + `en=__analytics_probe` in the URL. Request creation alone doesn't prove delivery.

**D-SCHEMA-UNION (round 2, A011) — Event payload is a TypeScript discriminated union.** Internal events carry `current_page` only. External events carry `join_source_page` + `join_origin_method`; direct visits use `join_source_page = '(direct)'`. Single source of truth in `lib/analytics/track.ts`; no contradictory props elsewhere.

**D-ACTIVATIONS (round 2, A012) — Internal Join CTAs track left-click, middle-click, and modifier-key clicks.** All three are valid intent signals and end up at /join. Right-click / context-menu does NOT trigger tracking. Implementation: `onPointerDown` (button 0 or 1) + dedupe via timestamp on `onClick` and `onAuxClick`. Without this the funnel denominator misses cases the referrer_fallback fix catches in the numerator.

**D-ROUTE-GEN (round 2, A013) — Route template generator handles full Next.js App Router conventions.** Globs `page.{js,jsx,ts,tsx,mdx}`. Recognises required catch-all (`[...slug]`), optional catch-all (`[[...slug]]`), single dynamic (`[param]`). Skips route groups (`(group)`) and parallel slots (`@slot`). Tests cover `/docs`, `/docs/a`, `/docs/a/b`, optional catch-all with zero trailing segments, dynamic `page.ts` fixture.

**D-PII-BUILDERS (round 2, A014) — PII allowlist enforced via TypeScript discriminated union, not a fixture.** `trackEvent` accepts only the closed union type — call sites that try to emit an unknown event or pass an unlisted param fail compile-time. Param values are normalised through route-template helpers before emission; the test suite validates the builders, not a hand-maintained fixture.

## Build sequence (T0–T11)

T0 is a hard gate. T1–T2 are independent and can ship in parallel. T3–T6 depend on T0 PASS. T7–T8 are independent.

| Task | File(s) | What changes | Tests required |
|---|---|---|---|
| **T0** | `lib/analytics/probe.ts` (new), `docs/analytics_probe_results.md` (new) | Implement `isGA4Ready()` that (a) checks `dataLayer` for `['config','G-B62VVGCGP1']`, then (b) dispatches a one-shot `__analytics_probe` event with `transport_type:'beacon'` and observes either a `g/collect` `204` response in the browser's PerformanceObserver, or surfaces the event in GA4 DebugView. Retry budget 5×400ms inside a `useEffect`. Run on `/`, `/range`, `/join` in a Vercel preview deployment. Document PASS/FAIL per page. **Hard gate** — T3–T6 + T9 are blocked until all three pages PASS. | Manual preview verification across 3 pages + console screenshot in results doc. |
| **T1** | `app/layout.tsx` | Add `metadata.openGraph.images = [{url:'/og.png', width:1200, height:630}]` and `metadata.twitter = { card: 'summary_large_image' }`. | `curl` rendered HTML, grep `og:image`; opengraph.xyz preview shows correct image |
| **T2** | `public/og.png` | 1200×630 branded PNG, <200KB, no em dashes in any baked-in text | Dimension + filesize check; visual review |
| **T3** | `lib/analytics/track.ts` (new) | Export `trackEvent(name, props)`. GA4 only via `window.gtag?.('event', name, { ...props, transport_type:'beacon', ...(isDebug && {debug_mode:true}) })`. Wrap in try/catch. No-op if `gtag` undefined. `isDebug = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'`. **Gated on T0 PASS.** | Unit test: `gtag` undefined → no throw; `debug_mode` injected only when env var !== 'production' |
| **T4** | `lib/analytics/joinFunnel.ts` (new) | `setJoinOrigin(routeTemplate)` writes `{origin, ts}` to sessionStorage. `getJoinOrigin()` reads, returns `'direct'` on miss, expired (>30min), malformed JSON, or throw (incognito). Route template normalisation (e.g. `/newsletters/[slug]` not `/newsletters/2026-04`). | Unit tests: incognito throw → `'direct'`; expired TTL → `'direct'`; malformed JSON → `'direct'`; missing key → `'direct'`; valid origin within TTL → returns it |
| **T5** | `components/JoinButton.tsx` (new), uses across home, range, club-hunts, hunts-course, site header, footer | Wraps Next.js `<Link>` for internal navigation. `onPointerDown`: `setJoinOrigin(routeTemplate)` + `trackEvent('cta_join_internal_click', {join_source_page: routeTemplate})` + set local `__tracked = Date.now()`. `onClick`: dedupe if `Date.now() - __tracked < 200`. Native nav preserved. | Manual: click in dev preview, Tag Assistant Companion shows single event per click |
| **T6** | `app/join/page.tsx` external CTAs (both top + bottom) | Native `<a href="https://www.deerstalkers.org.nz/branches/south-island/otago/">`. `onPointerDown`: read `getJoinOrigin()`, `trackEvent('cta_join_external_click', {join_source_page: origin})` with beacon transport from T3. `onClick`: dedupe (200ms). | Manual: navigate `/range` → click Join → land on `/join` → click external; GA4 DebugView shows `cta_join_external_click` with `join_source_page=/range` |
| **T7** | `app/competitions/page.tsx`, `app/club-hunts/page.tsx`, `app/contact/page.tsx`, `app/newsletters/page.tsx`, `app/newsletters/[slug]/page.tsx` | JSON-LD per D-JSONLD: `WebPage` for competitions and club-hunts; `ContactPage` (with `@id` referring to the home Organization) for contact; `CollectionPage` for newsletters index; `Article` for newsletter slug pages. **No `Event` / `SportsEvent`.** | Google Rich Results Test passes with zero errors for each page |
| **T8** | `components/Breadcrumbs.tsx` (new), `lib/breadcrumbs.ts` (new) | Single pathname→label map sourcing both the visible breadcrumb UI and the `BreadcrumbList` JSON-LD. Only renders at path depth ≥ 2. | Snapshot test: visible label sequence === `itemListElement[].name` sequence |
| **T9** | GA4 Admin → Custom Definitions → Custom Dimensions (manual) | Register event-scoped custom dimension `join_source_page` (single dim per D-DIM). Document in `docs/ga4_setup.md`. **Gated on T0 PASS.** | Confirm dimension visible in Funnel Exploration UI when building reports |
| **T10** | `README.md` | Document the funnel events, GA4 custom dimension setup, 30-min sessionStorage TTL, Tag Assistant Companion QA path, T0 probe procedure, and the rollback procedure if any event regresses | n/a |
| **T11** | (verification, no code) | Confirm existing CSP covers all required endpoints. `connect-src` must include `*.google-analytics.com` AND `*.analytics.google.com`; `script-src` must include `www.googletagmanager.com`. Read-only check. | Zero console CSP violations after T3–T6 ship to preview |

## Reporting goal (the user's question)

> *Of visitors who clicked a Join button on any page, how many followed through to the external NZDA national signup, broken down by source page?*

After build complete and ~7 days of data, the report is:

GA4 → Explore → Funnel Exploration, with:
- Step 1: `page_view`
- Step 2: `cta_join_internal_click`
- Step 3: `cta_join_external_click`

Add `join_source_page` as a breakdown dimension on step 2 and step 3. Direct `/join` visits with no preceding internal click show as `join_source_page='direct'` on step 3 — distinguishing organic search/share traffic from internal-funnel traffic.

## Constraints (non-negotiable, do not violate)

- **Budget:** $0 NZD recurring beyond what's already in place
- **No consent banner.** Footer privacy line is the only disclosure
- **CSP locked.** No broadening beyond the current explicit whitelist
- **House style:** no em dashes anywhere in new content
- **Maintainability:** single volunteer dev; no infra requiring babysitting
- **Privacy:** NZ Privacy Act 2020 IPP 3 (openness) is satisfied by the footer line; no PII in tracking event props
- **Performance:** every added script uses `strategy="afterInteractive"` or equivalent. Lighthouse LCP/CLS/INP must not regress >5% on `/`, `/range`, `/join`
- **Analytics calls must never throw unhandled exceptions in the UI** — all wrapped in try/catch with no-op fallback
- **No `'unsafe-eval'` ever.** No wildcard hosts in CSP beyond `*.google-analytics.com`, `*.analytics.google.com`, `*.cloudflareinsights.com` (already permitted)

## Pass criteria (all must be true before close-out)

- [ ] T0 probe documented in `docs/analytics_probe_results.md` with PASS/FAIL per page (`/`, `/range`, `/join`)
- [ ] If T0 FAIL on any page: milestone status = NEEDS_USER, T3–T6 + T9 not shipped, decision documented
- [ ] If T0 PASS on all three: continue with criteria below
- [ ] `og:image` meta tag present on every page; opengraph.xyz preview renders the image
- [ ] Internal Join click writes `joinFunnelOrigin = {origin: routeTemplate, ts: now}` to sessionStorage (verified via DevTools Application tab)
- [ ] External Join click on `/join` fires `cta_join_external_click` with correct `join_source_page` value, verified in GA4 DebugView in preview deploy across 3 entry paths: `/`, `/range`, `/join` direct
- [ ] Incognito sessionStorage-disabled: external click fires with `join_source_page='direct'`, no thrown exceptions in console
- [ ] Stale origin (>30 minutes): external click fires with `join_source_page='direct'`
- [ ] `gtag` undefined (e.g. ad-block): no thrown exceptions, no event, no UI break — acceptable degradation, documented in README
- [ ] PointerDown + Click dedupe verified — single event per activation in DebugView (no doubles for either mouse, keyboard Enter, or assistive-tech activation)
- [ ] `debug_mode` absent from production events — verified by checking GA4 Realtime on production traffic shows zero `debug_mode=true`
- [ ] All JSON-LD passes Google Rich Results Test with zero errors (per-page check on competitions, club-hunts, contact, newsletters index, one newsletter slug)
- [ ] BreadcrumbList visible labels === JSON-LD `itemListElement` names (snapshot)
- [ ] Zero CSP violations in browser console after T3–T6 deploy to preview
- [ ] `git diff main..HEAD | grep '—'` returns nothing (no em dashes introduced)
- [ ] Lighthouse LCP/CLS/INP within ±5% of baseline on `/`, `/range`, `/join`
- [ ] GA4 `join_source_page` custom dimension registered, visible in Funnel Exploration, and report builder can select it

## What's NOT in this plan (deferred, do not implement)

- Per-page OpenGraph images (only the default `og.png` ships in this milestone)
- UTM parameter integration in funnel events
- Server-side Measurement Protocol fallback for ad-blocker users
- A/B testing on Join CTAs
- Meta Pixel conversion tracking on the funnel (Meta Pixel is page-view-only by current plan)
- Per-page custom dimensions beyond `join_source_page`
- Event / SportsEvent JSON-LD on home page upcoming events (D-JSONLD: maintenance burden exceeds value)
- Cloudflare Web Analytics (waiting on user-provided token)
- Rifle range Meta Pixel (waiting on user-provided pixel ID)
- The deferred analytics value-audit script build (defer until 30+ days of data; design at `docs/analytics_value_audit_design.md`)

## What this audit pass should focus on

This is a rewrite incorporating all rev-1 audit findings. New things to attack:

- Is the T0 probe's "dispatch + observe collect 204" actually implementable in a browser environment, or is there a subtle issue (e.g. PerformanceObserver doesn't surface fetch keepalive requests reliably)?
- Is the 30-min sessionStorage TTL the right number, or should it be tied to GA4's session timeout (default 30 min, so they align)?
- Is `routeTemplate` normalization at T4 robust against future dynamic routes I haven't built yet?
- Does the pointerdown+dedupe pattern handle middle-click (open in new tab) correctly? Pointerdown fires for middle-click too — do we want to count that as a Join click?
- Are there any remaining contradictions between the locked decisions and the task list?
- Any pass criteria that can't actually be verified by the means described?
- Anything else.
