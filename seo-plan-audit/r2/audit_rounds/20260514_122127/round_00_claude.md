---
role: builder
round: 0
status: REVISED_PLAN
proposed_resolutions: []
new_decisions:
  - id: D_TEMP_0
    decision: "T0 probe abandons PerformanceObserver-of-collect approach. Use gtag event_callback (fires on transport completion) plus a 2-second timeout fallback. event_callback is the documented GA4 mechanism for confirming dispatch."
    rationale: "PerformanceObserver with type:'resource' does surface fetch/keepalive requests in modern browsers, but response status codes are not exposed on PerformanceResourceTiming for cross-origin requests without Timing-Allow-Origin (Google does not send TAO). So 'observe a 204' is not verifiable from JS. event_callback is the supported signal."
  - id: D_TEMP_1
    decision: "sessionStorage TTL set to 30 minutes explicitly to mirror GA4 default session_timeout. README documents that if GA4 session_timeout is ever changed in Admin, this constant must be updated in lockstep."
    rationale: "Auditor flagged misalignment risk. Aligning eliminates a class of 'origin lost mid-session' or 'origin stale across session boundary' confusion in funnel reports."
  - id: D_TEMP_2
    decision: "PointerDown handler ignores activations where pointerEvent.button !== 0 OR any of ctrlKey/metaKey/shiftKey is true. Middle-click and modifier-click open-in-new-tab still navigates natively (we never preventDefault) but does NOT fire trackEvent or setJoinOrigin."
    rationale: "Counting middle-click as a Join intent inflates the funnel and pollutes join_source_page. The user's question is 'who reached external signup' — a new-tab open is still a Join intent, BUT the dedupe-by-timestamp pattern breaks across tabs (sessionStorage is per-tab-group; the new tab inherits but the origin write race is undefined). Cleanest behaviour: count only primary-button, unmodified activations. Document the loss in README."
  - id: D_TEMP_3
    decision: "Route-template normalisation uses Next.js App Router's usePathname() combined with a small manual segment-replacement map seeded from the known dynamic routes (/newsletters/[slug]). Unknown segments matching /^[0-9]/, /^\\d{4}-/, or longer-than-30-chars are coerced to '[dynamic]'."
    rationale: "Future-proofing: any new dynamic route the developer adds without updating the map degrades to '[dynamic]' rather than leaking a slug like '/news/2027-summer-cull' into GA4 as a high-cardinality value. Cardinality protection > perfect accuracy for unmapped routes."
open_questions:
  - "Q1: GA4 free-tier custom dimension cap is 50 event-scoped dims per property. We're using one. Confirm no other property workload competes. Likely fine but worth a 30-second check in Admin."
  - "Q2: Does the existing CSP have script-src nonce/hash discipline that the gtag event_callback (which is just a JS function passed to gtag) won't violate? Event_callback is in-page JS so it should be fine, but worth grep-confirming in T11."
---

### Scope

Unchanged. Re-auditing rev 2 against the focus areas the auditor specified: T0 probe browser feasibility, 30-min TTL alignment, route-template normalisation, pointerdown semantics for middle-click/modifiers, decision/task-list contradictions, unverifiable pass criteria.

### Drift Detection

No drift. This is a re-audit of revision 2 against the original goal (measurable join-funnel + SEO/AI-indexing within 30 days, single-dev maintainable, $0 budget). Locked decisions D-VA, D-GA4-GATE, D-PROBE, D-ACTIVATION, D-DEBUG, D-DIM, D-JSONLD all remain in force. The revisions in this round are corrections to *implementation specifics* under those decisions, not re-litigation of the decisions themselves.

### Open Decisions (audit findings against rev 2)

**A101 — CONCEDE — T0 probe's "observe `g/collect` 204 response" is not implementable as written.**
Evidence: `PerformanceResourceTiming` does surface keepalive/beacon fetches, but `responseStatus` is only populated when the response carries `Timing-Allow-Origin: *` (or matches the origin). `google-analytics.com/g/collect` does **not** send TAO. So from page JS you can see *that* a request to `g/collect` happened, but not whether it returned 200/204 vs failed. Resolution: replace the "observe 204" mechanism with GA4's documented `event_callback` option, which fires synchronously after the transport completes (success or beacon-queued). Probe logic becomes:
1. Check `window.dataLayer` contains the `['config', 'G-B62VVGCGP1', ...]` entry.
2. `gtag('event', '__analytics_probe', { transport_type: 'beacon', event_callback: () => { window.__ga4ProbeOK = true } })`.
3. Poll `window.__ga4ProbeOK` over 5×400ms (existing retry budget).
4. Cross-check by opening GA4 DebugView (manual step in probe doc) — `__analytics_probe` events appear within ~10s if dispatch succeeded.
PASS requires both (3) and (4). FAIL on either → NEEDS_USER per D-GA4-GATE. See D_TEMP_0.

**A102 — CONCEDE — 30-min TTL must explicitly mirror GA4 `session_timeout`.**
Evidence: GA4 default session_timeout is 30 min of inactivity. Rev 2 happened to pick 30 min but didn't tie the rationale to GA4's session model. If session_timeout is ever changed in Admin (currently visible at Admin → Data Streams → Configure tag settings → Adjust session timeout) the funnel will start splitting sessions mid-funnel without anyone updating sessionStorage. Resolution: constant lives at `lib/analytics/joinFunnel.ts:JOIN_ORIGIN_TTL_MS = 30 * 60 * 1000` with a comment block stating it must equal GA4 session_timeout. README ops note added. See D_TEMP_1.

**A103 — CONCEDE — Pointerdown semantics for middle-click and modifier-click are under-specified.**
Evidence: `pointerdown` fires for button 0 (left), 1 (middle), 2 (right), and for ctrl/meta/shift+click. Rev 2 treats them all the same. Consequences:
- Middle-click (button 1) → opens external URL in new tab. Current code would set origin AND fire the internal event AND, when the new tab loads `/join`, the external click handler in that new tab would fire too — but `sessionStorage` is per-browsing-context: a middle-click new tab inherits sessionStorage at open time, so origin *is* visible. Net result: a single middle-click on `/range`'s Join button generates `cta_join_internal_click` on `/range` (no navigation) plus, when user later clicks External in the new tab, `cta_join_external_click` with `join_source_page=/range`. That's actually... correct? But the internal_click without a corresponding navigation is misleading.
- Modifier+click (ctrl/cmd+click) → same as middle-click for the user's intent.
- Right-click (button 2) → context menu only, no navigation, would falsely fire internal_click.
Resolution: gate the handler on `e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey`. Internal Join via new-tab-open is counted as "not tracked, navigates natively, fall-through to direct on external" — documented in README. Trade: lose ~5% of join intents (new-tab users) for clean funnel data. See D_TEMP_2.

**A104 — CONCEDE — Route-template normalisation needs a default for unknown dynamic routes.**
Evidence: T4 spec says "Route template normalisation (e.g. `/newsletters/[slug]` not `/newsletters/2026-04`)." But the implementation must explicitly know which routes are dynamic. If a future developer adds `app/events/[id]/page.tsx`, the normaliser as-described would write `/events/abc-123` to `join_source_page`, blowing out GA4 dimension cardinality (which has a 500-value warning threshold and a hard performance cliff at high cardinality). Resolution: use Next.js `usePathname()` + a known-dynamic-segments map sourced from `lib/breadcrumbs.ts` (reused, single source of truth with T8), plus a fallthrough heuristic that coerces high-entropy segments to `[dynamic]`. See D_TEMP_3.

**A105 — DEFEND — `gtag` undefined branch in T3 is sufficient; no need for retry/deferred queue.**
Auditor might argue trackEvent should buffer events until gtag loads. Counter: gtag is loaded via Next.js `<Script strategy="afterInteractive">` in `app/layout.tsx`. By the time any user can `pointerdown` a Join button, afterInteractive has run unless gtag is blocked entirely (ad-block). In the ad-block case, buffering is pointless — the script never loads. Cost of building a queue (~30 LOC, lifecycle bugs, memory) > value (zero recovered events). Keep as no-op.

**A106 — CONCEDE — Pass criterion "`gtag` undefined → no thrown exceptions" cannot be verified without an explicit test.**
Rev 2 lists this in pass criteria but T3's test row only says "Unit test: gtag undefined → no throw". Good, that *is* a verifying test. However the pass criterion also says "no event, no UI break" — "no event" is verifiable by absence-of-network-request but only if we explicitly run that check. Resolution: add to T3 test row: "Playwright preview check: with `window.gtag = undefined` injected, click Join, assert zero outbound `google-analytics.com` requests and zero console errors." Strengthens existing criterion without expanding scope.

**A107 — CONCEDE — Pass criterion "debug_mode absent from production events" is awkwardly verified.**
Rev 2 says "verified by checking GA4 Realtime on production traffic shows zero `debug_mode=true`." Realtime doesn't show event parameter values directly; you'd need to spin up an Exploration. Resolution: change verification to "build-time check: grep production bundle (`.next/static/**/*.js`) for the literal string `debug_mode` — must not appear, because `process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'` is statically false in prod builds and the property is tree-shaken." This is a stronger, deterministic check.

**A108 — DEFEND — No contradiction between D-JSONLD and T7.**
D-JSONLD enumerates `WebPage`, `ContactPage`, `CollectionPage`, `Article`. T7 implements exactly that mapping. The home page upcoming-events `Event` schema is explicitly NOT in T7 (it's in Deferred). Consistent.

**A109 — CONCEDE — `event_callback` requires `transport_type:'beacon'` to play well in some browsers.**
Rev 2's T3 already sets `transport_type:'beacon'` for all events. Confirm the probe also does. Add explicit note in T0 task.

**A110 — DEFEND — D-VA (no dual-write to Vercel) and the T0-blocks-T3 chain do not strand the project.**
Auditor might claim: "if T0 fails, you have no funnel and no fallback — single point of failure." Counter: D-GA4-GATE makes this an explicit, user-visible blocker, not a silent degradation. The cost of a fallback transport (Vercel custom events) is splitting funnel data, which makes the user's actual question — "how many made it across" — harder, not easier, to answer. Single-transport is the right architecture for a 1-dev, $0-budget, single-question site. If T0 fails, the *next* action is "diagnose why GA4 isn't accepting events," not "spread the failure across two systems."

### Steelman Risks (new since rev 1)

Rev 1 risks remain. Adding risks the rev 2 focus exposed:

1. **Risk:** `event_callback` doesn't fire if the gtag script itself failed to parse (vs blocked outright). **Mitigation:** the dataLayer config check in step 1 of the probe catches a parsed-but-misconfigured state; an outright-blocked state means step 1 also fails. Both routes lead to FAIL → NEEDS_USER. Covered.
2. **Risk:** Browser's beacon queue can silently drop events if size exceeds 64KB or if there are too many in-flight. Probe payload is tiny so this is theoretical, but a real concern at scale. **Mitigation:** N/A for this scale; document in README as a known ceiling.
3. **Risk:** Middle-click decision (D_TEMP_2) undercounts genuine join intents from power users. **Mitigation:** accept the loss; document; if data shows >10% of `/join` direct hits arriving with referrer = otagodeerstalkers.co.nz (suggesting same-site new-tab opens), revisit. This is a 60-day issue, not a build-time issue.
4. **Risk:** `usePathname()` returns the *literal* path, not the route template. Reconstructing the template requires either matching against the file-system routes (build-time) or the manual map proposed in D_TEMP_3. The map is hand-maintained, so it can drift. **Mitigation:** map lives next to the breadcrumb map (T8), single file to update; add a comment at the top of `lib/breadcrumbs.ts` reminding the next dev that adding a dynamic route requires updating this map.
5. **Risk:** GA4 DebugView lags 5-15s; T0 manual verification step adds wall-clock time. **Mitigation:** acceptable; T0 is a one-time gate, not a CI loop.
6. **Risk:** Tree-shaking of the `debug_mode` branch (A107) depends on Next.js's production minifier seeing the `process.env.NEXT_PUBLIC_*` substitution as a compile-time constant. This is documented Next.js behaviour but worth verifying in the grep test. **Mitigation:** the grep IS the verification.
7. **Risk:** Locked CSP includes `*.google-analytics.com` and `*.analytics.google.com` per T11, but `gtag.js` itself is served from `www.googletagmanager.com`. Confirm `script-src` covers it. **Mitigation:** explicit T11 check item below.

### Build Plan (revisions to rev 2)

Tasks unchanged except where noted. Diffs only:

| Task | Change |
|---|---|
| **T0** | Replace "observe 204 via PerformanceObserver" with `gtag event_callback` + DebugView cross-check. Payload includes `transport_type:'beacon'`. Document both signals in `docs/analytics_probe_results.md`. Retry budget unchanged (5×400ms for `__ga4ProbeOK` flag). |
| **T3** | Add Playwright preview check: with `window.gtag = undefined` patched in via `addInitScript`, click Join, assert zero outbound `google-analytics.com/g/collect` requests and zero console errors. |
| **T4** | Implement route-template normaliser per D_TEMP_3: `lib/breadcrumbs.ts` exports `KNOWN_DYNAMIC_SEGMENTS: Record<string,string>` (e.g. `'newsletters': '[slug]'`); `joinFunnel.ts` consumes it. Unknown segments matching high-entropy heuristics coerce to `[dynamic]`. Add unit tests: known dynamic → template, unknown high-entropy → `[dynamic]`, fully static → as-is. TTL constant `JOIN_ORIGIN_TTL_MS = 30 * 60 * 1000` with comment tying it to GA4 session_timeout. |
| **T5** | PointerDown handler gates on `e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey`. Add Playwright tests: left-click → event fires once; middle-click → no event, new tab opens; ctrl+click → no event, new tab opens; right-click → no event. |
| **T6** | Same pointerdown gating as T5 (the external CTA inherits the same semantics). |
| **T10** | README additionally documents: (a) the 30-min TTL must equal GA4 session_timeout; (b) middle-click/modifier-click joins are not tracked (intentional); (c) adding a new dynamic route requires updating `KNOWN_DYNAMIC_SEGMENTS`. |
| **T11** | Explicit check items: `script-src` includes `www.googletagmanager.com`; `connect-src` includes `*.google-analytics.com` AND `*.analytics.google.com`; no nonce/hash policy that would block `event_callback` inline function refs (it's an in-page JS reference, not inline `<script>`, so should be fine, but verify by running the probe with CSP enforced in preview). |

All other tasks (T1, T2, T7, T8, T9) unchanged.

### Pass Criteria (revisions)

Replace and add:

- [x] (revised) T0 PASS requires BOTH `event_callback`-fired flag observed in browser AND `__analytics_probe` visible in GA4 DebugView. Documented in `docs/analytics_probe_results.md` per page (`/`, `/range`, `/join`).
- [x] (revised) `debug_mode` absent from production verified by `grep -r 'debug_mode' .next/static/ | wc -l` returning 0 after a production build. Run as part of release checklist.
- [x] (new) PointerDown gating verified by Playwright: 4 test cases (left, middle, ctrl, right) on a Join button, expected event counts (1, 0, 0, 0).
- [x] (new) Route-template normaliser unit-tested: static route returns as-is; known dynamic route returns template; unknown high-entropy segment coerces to `[dynamic]`; root `/` returns `/`.
- [x] (new) `JOIN_ORIGIN_TTL_MS` value matches GA4 Admin → Data Streams → session_timeout. Manual confirmation logged in `docs/ga4_setup.md`.
- [x] (new) CSP audit (T11) confirms `script-src` covers `www.googletagmanager.com`, `connect-src` covers both `*.google-analytics.com` and `*.analytics.google.com`, and the probe runs cleanly under enforced CSP in preview.

All other rev-2 pass criteria carry forward unchanged.

### Not Claimed / Deferred

Rev 2 deferred list carries forward unchanged. Additionally:

- No recovery/queue for events when `gtag` is unavailable (A105 — accepted loss).
- No tracking of new-tab/middle-click join intents (D_TEMP_2 — accepted loss, documented).
- No automatic detection if GA4 `session_timeout` is changed in Admin (T10 README note is the safeguard).
- No build-time route enumeration to auto-generate `KNOWN_DYNAMIC_SEGMENTS` from filesystem (manual map is sufficient for current ~7 routes; revisit if route count grows past ~20).

Requesting auditor focus next round on: (a) is `event_callback` reliable enough to gate T3–T6 on, or do we need a third signal? (b) is the high-entropy heuristic in D_TEMP_3 too aggressive — could it false-positive on a legitimate static slug? (c) any pass criterion still not independently verifiable.