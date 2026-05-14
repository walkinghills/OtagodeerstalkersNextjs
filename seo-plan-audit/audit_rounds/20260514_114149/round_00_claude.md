---
role: builder
round: 1
status: REVISED_PLAN
proposed_resolutions: []
new_decisions:
  - id: D_TEMP_1
    decision: "Single OG image for the whole site (1200x630 static PNG in /public/og.png) instead of per-page OG images."
    rationale: "Per-page OG images at this site's scale (small brochure, ~10 pages) yield negligible CTR uplift vs maintenance cost. One branded image referenced via metadata.openGraph default covers all pages; future per-page override remains possible without refactor."
  - id: D_TEMP_2
    decision: "Fire join_external_click via beforeunload-safe pattern: dispatch event synchronously BEFORE navigation, with navigator.sendBeacon fallback for GA4 where available, and rely on link click behavior (event listener on click, not on navigation) so the event queues before the browser unloads."
    rationale: "External CTA causes page unload. Without sendBeacon or pre-navigation dispatch, both Vercel track() and gtag() calls can be killed mid-flight. GA4 gtag uses transport_type:'beacon' by default since 2020 but only when sendBeacon available; explicit configuration removes ambiguity."
  - id: D_TEMP_3
    decision: "sessionStorage write is wrapped in try/catch and gated on typeof window !== 'undefined'; read returns 'direct' on any failure (incognito with storage disabled, quota, SSR)."
    rationale: "Some Safari/Firefox private modes throw on sessionStorage access. Silent fallback to 'direct' preserves event reliability over attribution fidelity, which is the correct trade-off for a brochure site."
  - id: D_TEMP_4
    decision: "Event taxonomy uses snake_case names matching GA4 convention (cta_join_internal_click, cta_join_external_click). Props limited to from_page, origin_page, both string pathnames only. No referrer, no UTM, no user agent, no timestamps."
    rationale: "Pathnames are not PII. Excluding all other dimensions removes any possibility of inadvertent PII capture and keeps the GA4 custom-dimension registration to two fields."
  - id: D_TEMP_5
    decision: "Skip Event schema on home page upcoming events (item 5)."
    rationale: "Events change often, schema would need maintenance every event cycle, and SERP value for a small NZ branch is near zero (Google Events SERP feature heavily favors ticketing platforms with structured availability/price data this site won't provide). Maintenance burden exceeds gain."
  - id: D_TEMP_6
    decision: "BreadcrumbList only on pages with depth >= 2. Home page is excluded (single-item breadcrumb is invalid per Google's spec)."
    rationale: "Avoids invalid structured data warnings in Search Console. Site is shallow so list is small (e.g. Home > Range, Home > Newsletters > 2026-Q1)."
open_questions:
  - "Confirm scope of newsletter slugs: does each individual newsletter post need its own JSON-LD (Article schema) or only the index page needs CollectionPage?"
  - "Confirm: does the existing trackEvent helper already exist in the codebase (Phase 1 mentions Vercel events firing), or does it need to be created as part of item 2?"
---

### Scope

Goal restated: Ship the remaining 4 items (OG image, Join funnel with cross-page attribution, JSON-LD on remaining pages, BreadcrumbList) in a way that produces measurable conversion insight within 30 days and survives long-term with a volunteer maintainer. Item 5 (Event schema) is being recommended for deferral on cost/benefit grounds.

Constraints unchanged: zero recurring spend, no consent banner, locked CSP, no em dashes, single dev, no PII in props, sessionStorage must not throw, gtag must be optional.

### Open Decisions

No prior auditor issues yet (round 1). Pre-empting likely audit angles below in Steelman Risks.

### Steelman Risks

1. **External-link tracking event loss on unload.** `gtag('event', ...)` and Vercel `track()` are async. Click handler fires, browser begins navigation, in-flight requests can be killed. Mitigation: explicit `transport_type: 'beacon'` on gtag call; Vercel's `track()` uses sendBeacon under the hood already but verify; fire event on `mousedown` not `click` to gain ~100ms; do NOT preventDefault then setTimeout-navigate (that pattern breaks middle-click/cmd-click/screen readers).

2. **sessionStorage leaks across funnel sessions.** User clicks Join on /range, abandons, comes back two days later, lands on /join directly. sessionStorage persists for tab lifetime so origin_page would still report `/range` even though the journey is unrelated. Mitigation: store `{origin: pathname, ts: Date.now()}` and reject on read if older than 30 minutes. Falls back to `'direct'`.

3. **Multi-tab attribution corruption.** User opens /range in tab A, clicks Join (writes `joinFunnelOrigin=/range`), opens /lodge in tab B, clicks Join (overwrites to `/lodge`), returns to tab A's /join, clicks external. Reports origin=/lodge. sessionStorage is per-tab in modern browsers (verified spec) so this is actually fine, but worth noting that bfcache restoration could resurface a stale value. Mitigation: timestamp expiry from risk 2 covers most of this; document the residual edge case.

4. **GA4 funnel exploration requires custom dimensions registered for `from_page` and `origin_page`.** Without registration in GA4 Admin → Custom Definitions, the props are captured but not selectable as breakdown dimensions. The plan describes the funnel report as if it works out of the box — it does not. Mitigation: add explicit step to register both as event-scoped custom dimensions in GA4 Admin; document this in README.

5. **JSON-LD on /contact may misrepresent a SportsOrganization as a separate entity.** If /contact gets its own Organization schema, Google may treat it as a different entity from the home page's SportsOrganization, fragmenting Knowledge Graph signals. Mitigation: /contact uses `ContactPage` referencing the home page's SportsOrganization by `@id` (URL fragment).

6. **BreadcrumbList must mirror the visible HTML breadcrumb exactly.** Google penalizes mismatch (cleared rich-result eligibility). If the site's existing breadcrumb component uses different labels than the page titles, the JSON-LD will diverge. Mitigation: derive both visible breadcrumb and JSON-LD from a single source-of-truth pathname-to-label map.

7. **OG image at 1200x630 with text must be legible at LinkedIn/Slack/Discord thumbnail sizes.** Default opengraph-image generation in Next.js works but text smaller than ~48pt becomes unreadable in chat-app previews. Mitigation: brand mark + 2-line tagline only, no fine print; static PNG in /public, not dynamically generated (zero runtime cost).

8. **CSP regression risk from gtag dual-write.** Plan says CSP already whitelists GA4. Verify before shipping that `connect-src` includes `*.google-analytics.com` AND `*.analytics.google.com` AND that `script-src` allows `www.googletagmanager.com`. If gtag was loaded via Phase 1 then this is resolved; if it was Vercel-only previously, the dual-write introduces the gtag script. Mitigation: read existing `next.config` / middleware CSP before touching anything.

9. **`from_page` cardinality explosion.** If pathnames include dynamic segments (e.g. `/newsletters/2026-q1`), every newsletter generates a unique `from_page` value. GA4 caps custom dimension cardinality at 500 unique values before it stops collecting; for a brochure site this is fine but newsletter slugs accumulate forever. Mitigation: normalize `from_page` to route template (`/newsletters/[slug]`) not actual URL.

10. **Race: button click handler sets sessionStorage AND triggers Next.js client-side nav simultaneously.** If `<Link>` is used, the navigation happens via router.push synchronously after the click handler; sessionStorage write is sync so this is safe. If `<a href>` with default browser nav, also fine. Risk only exists if handler is async.

### Build Plan

| task-id | file(s) | what changes | tests required |
|---|---|---|---|
| T1 | `app/layout.tsx` (or root metadata) | Add `metadata.openGraph.images = ['/og.png']` and `metadata.twitter.card = 'summary_large_image'` | curl page, grep for `og:image`; validate via opengraph.xyz |
| T2 | `public/og.png` | Add 1200x630 branded PNG (NZDA Otago wordmark + tagline, no em dashes) | File exists, dimensions correct, < 200KB |
| T3 | `lib/analytics.ts` (new or existing) | Export `trackEvent(name, props)` that wraps Vercel `track()` and `window.gtag('event', name, {...props, transport_type:'beacon'})`, both in try/catch | Unit: gtag undefined doesn't throw; Vercel throw doesn't block gtag |
| T4 | `lib/joinFunnel.ts` (new) | Export `setJoinOrigin(pathname)` and `getJoinOrigin()`. Storage key `joinFunnelOrigin`, value `{origin, ts}`, 30min TTL, route-template normalization, all wrapped try/catch returning `'direct'` on failure | Unit: incognito sim (storage throws), expired TTL, missing key, malformed JSON |
| T5 | `components/JoinButton.tsx` (or wherever Join CTAs live) | onClick: call `setJoinOrigin(pathname)` then `trackEvent('cta_join_internal_click', {from_page: routeTemplate})`. No preventDefault. Fire on `onMouseDown` for outbound link reliability | Visual: click in dev, see Network call to GA4 collect endpoint and Vercel /_vercel/insights |
| T6 | `app/join/page.tsx` (or external CTA component) | onClick external CTA: read `getJoinOrigin()`, call `trackEvent('cta_join_external_click', {from_page:'/join', origin_page})` | Manual: navigate /range → click Join → on /join click external → confirm GA4 DebugView shows origin_page=/range |
| T7 | `app/competitions/page.tsx`, `app/club-hunts/page.tsx`, `app/contact/page.tsx`, `app/newsletters/page.tsx`, `app/newsletters/[slug]/page.tsx` | Add JSON-LD: Competitions=SportsEvent (or skip if events change weekly — see open question), club-hunts=Event or SportsActivityLocation, contact=ContactPage with @id ref to home Organization, newsletters index=CollectionPage, newsletter slug=Article | Validate each via search.google.com/test/rich-results |
| T8 | `components/Breadcrumbs.tsx` + `lib/breadcrumbs.ts` | Single source-of-truth pathname → label map; visible component AND BreadcrumbList JSON-LD render from same data; only renders for depth >= 2 | Snapshot test: visible labels === JSON-LD itemListElement names |
| T9 | GA4 Admin (manual, documented) | Register `from_page` and `origin_page` as event-scoped custom dimensions | Confirmed visible as breakdown options in Funnel Exploration UI |
| T10 | `README.md` analytics section | Document the funnel events, the GA4 custom dim registration step, and the 30-min TTL behaviour | n/a |
| T11 | (verification only) Existing CSP config | Confirm `connect-src` and `script-src` cover gtag dual-write; do not modify if already covered | Browser console shows no CSP violations after T5 ships to preview |

### Pass Criteria

- [ ] `og:image` meta tag present on every page; opengraph.xyz preview renders correctly
- [ ] Clicking any internal Join button writes `joinFunnelOrigin` to sessionStorage with current timestamp and route-template pathname
- [ ] Clicking external Join CTA on /join fires `cta_join_external_click` with correct `origin_page` (verified via GA4 DebugView for at least 3 entry pages: /, /range, /join direct)
- [ ] Incognito mode: sessionStorage disabled does not throw; external click still fires with `origin_page='direct'`
- [ ] Multi-tab: opening /lodge in second tab does not corrupt /range tab's stored origin (per-tab sessionStorage isolation)
- [ ] Stale origin (>30min) is treated as `'direct'`
- [ ] `gtag` undefined (e.g. blocked by uBlock) does not throw; Vercel event still fires
- [ ] All JSON-LD passes Google Rich Results Test with zero errors
- [ ] BreadcrumbList JSON-LD itemListElement names match visible breadcrumb text exactly (snapshot test)
- [ ] No CSP violations in browser console on any page
- [ ] No new em dashes introduced in any string literal (grep `—` in diff returns zero)
- [ ] Lighthouse: LCP, CLS, FID unchanged within ±5% on /, /range, /join (preview deploy)
- [ ] GA4 custom dimensions `from_page` and `origin_page` registered and selectable in Funnel Exploration

### Not Claimed / Deferred

- Event schema for home page upcoming events (D_TEMP_5: deferred indefinitely on maintenance grounds)
- Per-page OG images (D_TEMP_1: single site-wide image only)
- UTM tracking integration with funnel events (out of scope; can be added later via referrer instead of expanding props)
- Server-side GA4 Measurement Protocol fallback for ad-blocker users (out of scope; client-side dual-write is acceptable for a brochure site)
- A/B testing of Join CTA copy or placement (out of scope; this is instrumentation only)
- Conversion tracking on Meta Pixel (Pixel is whitelisted in CSP per Phase 1 but not part of this funnel design)
- Analytics value audit script update (referenced in plan; depends on whether `docs/analytics_value_audit_design.md` exists in repo — defer until confirmed)