---
role: builder
round: 2
status: REVISED_PLAN
proposed_resolutions:
  - ref: "A001"
    proposed_status: addressed
    action: "Collapsed `from_page`/`origin_page` into single `join_source_page` dimension on both funnel events."
  - ref: "A002"
    proposed_status: addressed
    action: "External CTA now fires on `onPointerDown` + keyboard `onKeyDown` (Enter/Space) with `transport_type:'beacon'`, dedupe-per-activation guard, no preventDefault."
  - ref: "A003"
    proposed_status: addressed
    action: "Removed ambiguous Event/SportsEvent work. T7 now uses only stable schema types. Event/SportsEvent explicitly deferred."
  - ref: "A004"
    proposed_status: addressed
    action: "Added `metadataBase`, absolute OG URL, width/height/alt, route-level metadata override audit, and per-route generated-HTML assertion."
  - ref: "A005"
    proposed_status: addressed
    action: "Added T0 CSP audit gate. If GA4 not already permitted, gtag forwarding is dropped and Vercel-only ships; no CSP broadening."
  - ref: "A006"
    proposed_status: addressed
    action: "Split validation: Schema.org validator for all JSON-LD; Google Rich Results Test only for BreadcrumbList and Article."
  - ref: "A007"
    proposed_status: addressed
    action: "Replaced FID with LCP, CLS, TBT for Lighthouse lab; noted INP as field-only follow-up."
  - ref: "A008"
    proposed_status: addressed
    action: "Added auditable taxonomy table in README (T10) with question, event, props, GA4 dims, Vercel event, pass report."
new_decisions:
  - id: D_TEMP_6
    decision: "Single funnel dimension `join_source_page` used on both internal and external Join events."
    rationale: "GA4 funnel breakdowns require one dimension across steps; split dims cannot be aggregated as one source-page report."
  - id: D_TEMP_7
    decision: "External Join CTA tracked on `pointerdown` + keyboard activation, with beacon transport and per-activation dedupe."
    rationale: "Async analytics on click is lost when navigation begins; pointerdown buys dispatch time, beacon survives unload."
  - id: D_TEMP_8
    decision: "JSON-LD scope limited to WebPage, CollectionPage, ContactPage, Article, BreadcrumbList, plus the existing home SportsOrganization @id reference. No Event/SportsEvent in this milestone."
    rationale: "Event schema requires a maintained data source; club event data is hand-edited HTML that changes weekly. Maintenance burden violates the volunteer-maintainer constraint."
  - id: D_TEMP_9
    decision: "T0 CSP audit is a hard gate. If GA4 endpoints not in current `connect-src`/`script-src`, drop gtag forwarding and ship Vercel-only."
    rationale: "Constraints forbid CSP broadening. The dual-write was a nice-to-have, not a requirement; Vercel Analytics alone answers the funnel question."
open_questions: []
---

### Scope

Unchanged. Goal, constraints, success criteria all hold. Auditor exposed no scope drift; the round-0 plan was internally inconsistent on funnel attribution (split dims) and over-claimed on schema validation (RRT for non-eligible types). Both are correctable inside the original scope without expanding it.

### Open Decisions

**A001 — CONCEDE.** The auditor is right. GA4 funnel exploration breaks down each step by one dimension; you cannot ask "external conversions by source page" if the source page lives on `from_page` for step 1 and `origin_page` for step 2. The split was a modelling error. Collapse to single `join_source_page` dimension, populated on both events. Internal click writes the current route template; external click reads sessionStorage and writes either the stored origin or `'direct'`. T9 now registers one custom dimension, not two.

**A002 — CONCEDE.** Risk 1 of round 0 named this exact failure mode and the plan only mitigated it on internal clicks. External CTA is the conversion event so reliability matters most there. Switch to `onPointerDown` (fires ~50-100ms before click on touch and mouse), add `onKeyDown` Enter/Space handler for keyboard activation, set `transport_type:'beacon'` on gtag and rely on Vercel `track()` using sendBeacon internally, add per-activation dedupe flag (`useRef` set on pointerdown, cleared on pointerup/blur) to avoid double-counting pointerdown + keydown on the same activation.

**A003 — CONCEDE.** "SportsEvent or skip" is not a plan, it is a TODO. Club event content is hand-maintained HTML on /competitions and /club-hunts and changes weekly. Generating `Event` JSON-LD requires startDate/location/organizer from a structured source; the project does not have one. Add Event schema would require either (a) a CMS migration or (b) hand-editing JSON-LD weekly. Both violate the volunteer-maintainer constraint. T7 revised to: /competitions=WebPage, /club-hunts=WebPage, /contact=ContactPage with `@id` ref to home SportsOrganization, /newsletters=CollectionPage, /newsletters/[slug]=Article. Event/SportsEvent moved to Not Claimed.

**A004 — CONCEDE.** `metadata.openGraph.images = ['/og.png']` only resolves to absolute when `metadataBase` is set; without it Next.js logs a warning and may emit a relative URL that some crawlers (LinkedIn historically) reject. Also, any page that exports its own `metadata` object without spreading parent OpenGraph fields wipes the inherited image. Fix: (1) set `metadataBase: new URL('https://otagodeerstalkers.co.nz')` (or the canonical production origin) in root layout, (2) use the object form `{url:'/og.png', width:1200, height:630, alt:'Otago Deerstalkers'}`, (3) grep `app/` for `export const metadata` and audit each for OG override (spread `...parentOG` or omit OG entirely to inherit), (4) Pass criterion now asserts `<meta property="og:image" content="https://...og.png">` on every route via post-build HTML check.

**A005 — CONCEDE.** T11 as written had no failure branch. Promoted to T0 and made it a gate. Read current CSP from `next.config.{ts,js}` / middleware / response headers. Confirm both `script-src` includes `https://www.googletagmanager.com` AND `connect-src` includes `https://*.google-analytics.com` and `https://*.analytics.google.com`. If yes → proceed with dual-write. If no → drop gtag entirely from T3 and ship Vercel Analytics only; document this in README; the funnel question still gets answered via Vercel custom events. No CSP broadening either way.

**A006 — CONCEDE.** Conflated "valid JSON-LD" with "rich result eligible". They are different. ContactPage and CollectionPage are valid Schema.org types but not on Google's rich-result list, so RRT will return "no items detected" even when the markup is correct. Split the validation: all JSON-LD goes through Schema.org validator (validator.schema.org) for structural correctness. Only BreadcrumbList and Article go through Google RRT for rich-result eligibility. Pass criteria updated.

**A007 — CONCEDE.** FID was deprecated in favour of INP and is not a Lighthouse lab metric anyway. Lab metrics: LCP, CLS, TBT. Field metric (INP) requires CrUX or RUM data, neither present at preview. Replace FID criterion with TBT in lab + INP as a 30-day post-ship follow-up only if Vercel Speed Insights surfaces it.

**A008 — CONCEDE.** "Document the funnel events" is not auditable. Replaced with a structured taxonomy table in README so a stranger can verify each event has a purpose and a destination report.

### Steelman Risks

Summary: round 0 risks 1-10 stand. New risk surfaced by audit:

11. **PointerDown firing without a corresponding navigation.** Touch users sometimes pointerdown then drag away to cancel. Without a guard, we record a join click that never happened. Mitigation: track on pointerdown but accept the small over-count. Brochure-site funnel does not need pixel accuracy; under-count from unload loss is the worse error. Document this trade-off.

12. **`metadataBase` env coupling.** Hardcoding the production URL in root layout breaks preview deploys' OG previews (they will all advertise the production URL). Mitigation: use `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://otagodeerstalkers.co.nz'` so Vercel preview deploys can override via env var if ever needed; otherwise production URL is the safe default.

### Build Plan

| task-id | file(s) | what changes | tests required |
|---|---|---|---|
| T0 | (read-only) `next.config.*`, `middleware.ts`, response headers via `curl -I` on prod | Audit CSP. Record whether GA4 script + connect endpoints are allowed. Set boolean `GA4_ALLOWED` for the rest of the plan. | Output documented in PR description; no code change in this task |
| T1 | `app/layout.tsx` | Set `metadataBase`, set `openGraph.images = [{url:'/og.png', width:1200, height:630, alt:'Otago Deerstalkers'}]`, set `twitter.card='summary_large_image'` and `twitter.images=['/og.png']` | Build, `curl https://preview-url/` and grep `og:image` value is absolute |
| T1b | `app/**/page.tsx`, `app/**/layout.tsx` | Audit every `export const metadata` and `generateMetadata`; ensure none override `openGraph` without spreading inherited image, or remove their OG override entirely | Post-build script: for each route, fetch HTML, assert `og:image` present and absolute |
| T2 | `public/og.png` | 1200x630 PNG, NZDA Otago wordmark + tagline, no em dashes, <200KB | File exists; dimensions verified; opengraph.xyz preview |
| T3 | `lib/analytics.ts` | Export `trackEvent(name, props)`. If `GA4_ALLOWED`: dual-write with `transport_type:'beacon'`, both wrapped in try/catch. If not: Vercel only. | Unit: gtag undefined no throw; Vercel throw no block gtag; both branches covered |
| T4 | `lib/joinFunnel.ts` | `setJoinOrigin(routeTemplate)` writes `{origin, ts}` to sessionStorage. `getJoinOrigin()` returns origin if within 30min TTL else `'direct'`. All try/catch → `'direct'` on failure. Route-template normalization helper. | Unit: incognito (storage throws), expired TTL, missing, malformed JSON, dynamic slug normalized |
| T5 | `components/JoinButton.tsx` (internal Join CTAs) | On `onClick` (sync): `setJoinOrigin(routeTemplate)` then `trackEvent('cta_join_internal_click', {join_source_page: routeTemplate})`. No preventDefault. | Manual: click, GA4 DebugView shows event with prop |
| T6 | external NZDA CTA component on `/join` | On `onPointerDown` and `onKeyDown` (Enter/Space): per-activation dedupe ref guard, read `getJoinOrigin()`, call `trackEvent('cta_join_external_click', {join_source_page: origin})`. No preventDefault. | Manual: /range → /join → click external; GA4 DebugView shows `join_source_page=/range`. Test direct entry → `'direct'`. Test stale (>30min) → `'direct'`. Keyboard activation fires once not twice. |
| T7 | `app/competitions/page.tsx`, `app/club-hunts/page.tsx`, `app/contact/page.tsx`, `app/newsletters/page.tsx`, `app/newsletters/[slug]/page.tsx` | Inject JSON-LD via `<script type="application/ld+json">`: competitions=WebPage, club-hunts=WebPage, contact=ContactPage with `mainEntity.@id` referencing home SportsOrganization `@id`, newsletters index=CollectionPage, newsletter slug=Article (headline, datePublished, author, image, mainEntityOfPage) | Schema.org validator: zero errors on every page. RRT: not run for ContactPage/CollectionPage/WebPage; run for Article and BreadcrumbList only |
| T8 | `components/Breadcrumbs.tsx`, `lib/breadcrumbs.ts` | Single pathname→label map; visible breadcrumb and BreadcrumbList JSON-LD both derive from it; only render for depth ≥ 2 | Snapshot test: visible labels array deep-equals JSON-LD `itemListElement[*].name`. RRT passes BreadcrumbList. |
| T9 | GA4 Admin (manual) | Register `join_source_page` as event-scoped custom dimension. (Conditional on T0 result; skip if GA4 forwarding dropped.) | Visible as breakdown in Funnel Exploration UI |
| T10 | `README.md` analytics section | Add taxonomy table: \| question \| event \| props \| GA4 dim \| Vercel event \| pass report \|. Document 30-min TTL, dedupe behaviour, T0 outcome (which path shipped), GA4 custom dim registration steps. | Stranger-readability check: can a reader identify the report that answers each question? |
| T11 | (verification, post-deploy) | Manual GA4 DebugView walkthrough of 3 entry paths (/, /range, direct /join) confirming `join_source_page` value | Documented in PR comment with screenshots |

### Pass Criteria

- [ ] T0 CSP audit recorded `GA4_ALLOWED=true|false` in PR description; analytics code path matches
- [ ] No new entry in CSP allowlist (diff `next.config.*` shows zero additions to `script-src` or `connect-src`)
- [ ] `og:image` is an absolute URL on every route (post-build HTML check passes for `/`, `/range`, `/join`, `/competitions`, `/club-hunts`, `/contact`, `/newsletters`, at least one `/newsletters/[slug]`)
- [ ] `metadataBase` set in root layout and resolves to production origin or `NEXT_PUBLIC_SITE_URL`
- [ ] OG PNG exists at `public/og.png`, 1200x630, < 200KB, contains no em dashes (grep image OCR not required; visual review)
- [ ] Internal Join click writes `joinFunnelOrigin` to sessionStorage with current timestamp and route-template path
- [ ] External Join CTA fires `cta_join_external_click` exactly once per activation across pointer and keyboard inputs (dedupe verified)
- [ ] External event includes `join_source_page` matching either the stored origin route template or literal `'direct'`
- [ ] Verified in GA4 DebugView for 3 entry paths: `/` → /join → external, `/range` → /join → external, direct /join → external
- [ ] Incognito mode: external click still fires with `join_source_page='direct'`; no thrown errors in console
- [ ] Stale origin (>30 min): treated as `'direct'`
- [ ] `gtag` undefined: no thrown errors; Vercel event still fires
- [ ] Schema.org validator: zero errors on competitions, club-hunts, contact, newsletters index, one newsletter slug, and BreadcrumbList output
- [ ] Google Rich Results Test: BreadcrumbList shows eligible; Article shows eligible. No RRT assertions for ContactPage/CollectionPage/WebPage.
- [ ] BreadcrumbList `itemListElement[*].name` deep-equals visible breadcrumb labels (snapshot test)
- [ ] No CSP violations in browser console on preview deploy (DevTools Console clear on all listed routes)
- [ ] No em dashes in diff: `git diff` piped to `grep -c '—'` returns 0
- [ ] Lighthouse preview lab metrics within ±5% on `/`, `/range`, `/join`: LCP, CLS, TBT
- [ ] If `GA4_ALLOWED`: `join_source_page` registered as event-scoped custom dimension in GA4 Admin and selectable in Funnel Exploration
- [ ] README taxonomy table present with all six columns populated for every event shipped

### Not Claimed / Deferred

- Event/SportsEvent JSON-LD on competitions and club-hunts (D_TEMP_8: requires structured event data source; not available; volunteer-maintenance violation)
- Event schema for home page upcoming events (D_TEMP_5, unchanged)
- Per-page OG images (single site-wide image only)
- UTM tracking integration with funnel events
- Server-side GA4 Measurement Protocol fallback for ad-blocker users
- A/B testing of Join CTA copy or placement
- Meta Pixel conversion tracking
- Analytics value audit script update (conditional on `docs/analytics_value_audit_design.md` existence)
- INP field-metric tracking (Vercel Speed Insights post-ship, out of milestone)
- Pixel-accurate Join click counting (pointerdown over-count accepted, documented in README)
- GA4 forwarding if T0 finds CSP does not already permit it (Vercel-only path ships instead; no CSP broadening)