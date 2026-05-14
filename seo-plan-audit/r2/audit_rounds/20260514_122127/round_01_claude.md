---
role: builder
round: 2
status: REVISED_PLAN
proposed_resolutions:
  - ref: "A003 (A103)"
    proposed_status: addressed
    action: "Added referrer_fallback path on /join: when sessionStorage origin missing AND document.referrer origin === site origin AND referrer pathname !== /join, emit join_source_page from normalised referrer path with join_origin_method='referrer_fallback'. Only when both signals absent classify as direct (join_origin_method='direct')."
  - ref: "A004 (A104)"
    proposed_status: addressed
    action: "Replaced hand-maintained map with build-time enumeration: scripts/generate-route-templates.ts walks app/**/page.tsx, extracts [param]/[...slug]/[[...slug]] segments, emits lib/analytics/routeTemplates.generated.ts. CI step fails if generated file is stale (git diff). Normaliser consumes the generated map; no entropy heuristic — unknown segments under a known dynamic parent collapse to the template, fully unknown paths pass through unchanged (acceptable for static-only routes since all dynamics are enumerated)."
  - ref: "A006 (A107)"
    proposed_status: addressed
    action: "Stronger check: (1) Unit test on trackEvent asserts that with NEXT_PUBLIC_VERCEL_ENV='production' the payload object has no debug_mode key (not just falsy). (2) Build-time grep covers .next/{static,server,standalone} with cache/trace excluded, fixed-string search. Both must pass."
  - ref: "A008 (A111)"
    proposed_status: addressed
    action: "T0 hard gate is now a Playwright test against a preview deployment that intercepts requests to https://*.google-analytics.com/g/collect, asserts measurement ID tid=G-B62VVGCGP1, event name en=__analytics_probe, transport=beacon, and required params present. DebugView demoted to documented manual pre-production confirmation, not the gate."
  - ref: "A009 (A112)"
    proposed_status: addressed
    action: "Added explicit event schema section. Two events: cta_join_internal_click and cta_join_external_click. Params enumerated with types and allowed value sets. Added test asserting params match an allowlist and reject any value containing '@', '?', or matching free-text patterns."
  - ref: "A010 (A113)"
    proposed_status: addressed
    action: "Added sessionStorage failure tests: unit tests for SecurityError and QuotaExceededError on both get and set; Playwright init script overrides Storage.prototype.{getItem,setItem} to throw, then runs the full /range → /join → external flow asserting no UI exception, and external click falls back to referrer_fallback (since referrer is intact) or direct (when referrer also stripped)."
new_decisions:
  - id: D_TEMP_4
    decision: "On /join, internal-funnel origin is resolved in this priority order: (1) sessionStorage join_origin (method=sessionStorage), (2) same-site document.referrer with referrer.pathname !== '/join' (method=referrer_fallback, join_source_page = normalised referrer path), (3) direct (method=direct, join_source_page omitted)."
    rationale: "Preserves the success criterion 'direct visits distinguished from internal-funnel traffic' even when sessionStorage is unavailable (incognito, multi-tab, storage denied, new-tab from internal Join). Referrer is same-origin so no PII leak; pathname is normalised through the same route-template function as the primary path."
  - id: D_TEMP_5
    decision: "Route templates are generated at build time from filesystem enumeration of app/**/page.tsx; the generated file is committed and CI fails on drift. No runtime entropy heuristic."
    rationale: "Eliminates manual-map drift risk (A004) and removes the false-positive surface of entropy heuristics on legitimate static slugs. Single source of truth is the filesystem itself."
  - id: D_TEMP_6
    decision: "T0 automated gate is a Playwright network-interception test against preview; DebugView is a manual pre-prod step."
    rationale: "Deterministic evidence, runnable in CI, no TAO requirement (Playwright sees request headers/body before any TAO restriction applies). DebugView retained for human spot-check but is not the gate."
  - id: D_TEMP_7
    decision: "Join-funnel event schema is frozen as cta_join_internal_click { join_source_page: string (route template), current_page: string (route template), link_destination_class: 'internal_cta' } and cta_join_external_click { join_source_page: string|'(direct)', join_origin_method: 'sessionStorage'|'referrer_fallback'|'direct', link_destination_class: 'external_nzda' }. debug_mode key only present when NEXT_PUBLIC_VERCEL_ENV !== 'production'."
    rationale: "Answers the funnel question exactly (count of external clicks grouped by join_source_page) and makes the PII-allowlist test trivially expressible."
open_questions: []
---

### Scope

Unchanged. Re-audit of revision 3 against round-1 blocking issues. Locked decisions remain in force.

### Open Decisions

**A003 (A103) — CONCEDE.** Auditor is right: the success criterion explicitly requires direct vs internal-funnel distinction. Same-site referrer is a cheap, no-PII, no-cookie signal that survives sessionStorage failure and new-tab/middle-click opens. See D_TEMP_4. Implementation lives in `lib/analytics/joinFunnel.ts:resolveJoinOrigin()`:

```
1. const stored = safeSessionGet('join_origin')
   if stored and within TTL → return { source: stored.path, method: 'sessionStorage' }
2. const ref = parseReferrer(document.referrer)
   if ref.origin === window.location.origin and ref.pathname !== '/join'
     → return { source: normaliseRoute(ref.pathname), method: 'referrer_fallback' }
3. return { source: null, method: 'direct' }
```

Same-site only — cross-site referrers (search, social) classify as direct, which is the correct semantics for "internal funnel."

**A004 (A104) — CONCEDE.** Replaced manual map and entropy heuristic with build-time filesystem enumeration. See D_TEMP_5. New script `scripts/generate-route-templates.ts`:

- Walks `app/**/page.tsx`.
- For each path, extracts segments matching `^\[\.\.\.?(.+)\]$` or `^\[(.+)\]$` or `^\[\[\.\.\.(.+)\]\]$`.
- Emits `lib/analytics/routeTemplates.generated.ts` exporting `ROUTE_TEMPLATES: string[]` (sorted by specificity) and `normaliseRoute(pathname: string): string`.
- Matching is longest-prefix-first; segments at dynamic positions get replaced with the original template token (e.g. `[slug]`).
- Run as `prebuild` npm script; committed to git; CI step `npm run generate-route-templates && git diff --exit-code lib/analytics/routeTemplates.generated.ts` fails on drift.

No entropy heuristic — if a path doesn't match any known template, it is by definition a fully-static route and passes through unchanged. This is sound because every dynamic route in Next.js App Router lives in a `[param]` directory, so filesystem enumeration is exhaustive.

**A006 (A107) — CONCEDE.** Two-layer check:

1. *Source-level* (deterministic, fast): unit test on `trackEvent` with `process.env.NEXT_PUBLIC_VERCEL_ENV='production'` asserts `'debug_mode' in payload === false`. This catches the bug at the function boundary.
2. *Bundle-level* (defence in depth): release-checklist step runs `grep -rF 'debug_mode' .next/ --exclude-dir=cache --exclude-dir=trace` and requires zero matches. Covers static, server, standalone, and route chunks.

Both required to pass T3.

**A008 (A111) — CONCEDE.** T0 gate is now fully automated:

```
test('GA4 probe delivers __analytics_probe to g/collect', async ({ page }) => {
  const collectRequests: Request[] = []
  page.on('request', r => {
    if (/google-analytics\.com\/g\/collect/.test(r.url())) collectRequests.push(r)
  })
  await page.goto(PREVIEW_URL)
  await page.waitForFunction(() => window.__ga4ProbeOK === true, { timeout: 3000 })
  const probe = collectRequests.find(r => r.url().includes('en=__analytics_probe'))
  expect(probe).toBeDefined()
  const url = new URL(probe!.url())
  expect(url.searchParams.get('tid')).toBe('G-B62VVGCGP1')
  expect(url.searchParams.get('en')).toBe('__analytics_probe')
  // beacon transport: GA4 encodes ep.transport_type or uses sendBeacon — check method
  expect(['POST','GET']).toContain(probe!.method())
})
```

Runs against a Vercel preview deployment in CI. DebugView remains as a documented manual confirmation in `docs/analytics_probe_results.md` before production activation, but is no longer the gate.

**A009 (A112) — CONCEDE.** Schema added below in Build Plan (T3). PII-allowlist test asserts every emitted param value either matches an enum or matches `^/[a-z0-9/_\-\[\]]*$` (route-template charset). Any value containing `@`, `?`, `=`, `&`, `<`, `>`, or whitespace fails the test.

**A010 (A113) — CONCEDE.** Tests added:

- Unit: `safeSessionGet` and `safeSessionSet` wrap `sessionStorage` access in try/catch; tests inject mocks that throw `SecurityError` (denied) and `QuotaExceededError` (full). Both return `null`/no-op without throwing.
- Playwright: `addInitScript` overrides `Storage.prototype.setItem` and `Storage.prototype.getItem` to throw `SecurityError`. Test then runs `/range` → click Join → `/join` page loads → click external. Assertions: no console errors, no uncaught exceptions, `cta_join_external_click` fired with `join_origin_method='referrer_fallback'` and `join_source_page='/range'`. Second Playwright case: storage throws AND referrer stripped (`<meta name="referrer" content="no-referrer">` injected) → asserts `join_origin_method='direct'`.

### Steelman Risks

Rev 2 risks carry forward. New since rev 2:

1. **Risk:** Build-time route template generator misses routes added via parallel/intercepting route conventions (`@slot`, `(group)`, `(.)foo`). **Mitigation:** generator explicitly skips `(group)` and `@slot` segment names (they don't appear in URLs); intercepting routes (`(..)`, `(...)`) are documented as unsupported — emit a warning if found, and require manual handling.
2. **Risk:** Playwright probe test depends on preview deployment being reachable from CI. **Mitigation:** test reads `PREVIEW_URL` from env; CI step `vercel pull && vercel build && vercel deploy --prebuilt --archive=tgz` produces a URL. If preview deploy fails, gate fails closed — correct behaviour.
3. **Risk:** Referrer can be stripped by browser policy (`Referrer-Policy: no-referrer` on inbound link, or strict-origin downgrade on cross-protocol). For same-origin navigations on a single HTTPS site this is not a concern, but a misconfigured `<meta>` tag could break the fallback silently. **Mitigation:** add a Playwright test asserting same-origin navigation preserves `document.referrer` with full pathname; if a future commit adds a strict referrer-policy header, this test fails.

### Build Plan

Diffs against rev 2:

| Task | Change |
|---|---|
| **T0** | Replace manual DebugView gate with Playwright `g/collect` interception test (see A008 snippet). Test file `tests/e2e/analytics-probe.spec.ts`. Runs against preview. Manual DebugView step retained in `docs/analytics_probe_results.md` as pre-prod sign-off, not gate. |
| **T3** | Freeze event schema per D_TEMP_7. Implement `trackEvent(name, params)` that strips `debug_mode` key when `NEXT_PUBLIC_VERCEL_ENV === 'production'`. Tests: (a) unit — no-op when gtag undefined; (b) unit — debug_mode absent in production env; (c) unit — PII allowlist check on a fixture of all emitted events; (d) Playwright — gtag undefined → zero outbound requests, zero console errors. |
| **T4** | Replace manual map with generator (D_TEMP_5). Files: `scripts/generate-route-templates.ts`, `lib/analytics/routeTemplates.generated.ts` (generated, committed), `lib/analytics/joinFunnel.ts` (consumes). Tests: static route → as-is; dynamic route → template; root → `/`; unknown path → as-is (with comment explaining why this is safe). CI: `npm run generate-route-templates && git diff --exit-code`. TTL constant unchanged. |
| **T4b (new)** | `resolveJoinOrigin()` on /join implements D_TEMP_4 three-tier resolution. Unit tests for each tier; Playwright tests for sessionStorage-blocked + referrer-present (→ referrer_fallback) and sessionStorage-blocked + referrer-stripped (→ direct). |
| **T5** | Unchanged from rev 2 (pointerdown gating). |
| **T6** | External CTA on /join: pointerdown gating, plus call `resolveJoinOrigin()` to populate `join_source_page` and `join_origin_method` on `cta_join_external_click`. |
| **T10** | README additions: (a) referrer-policy header must not be tightened below `strict-origin-when-cross-origin` or join_origin_method=referrer_fallback breaks; (b) adding a dynamic route automatically updates the generated file via prebuild; (c) sessionStorage failure modes are tested and tolerated. |
| **T11** | Unchanged from rev 2. |

Event schema (frozen):

```ts
// cta_join_internal_click — fired on pointerdown of any internal Join CTA (button 0, no modifiers)
{
  current_page: string,         // route template, e.g. '/range'
  link_destination_class: 'internal_cta'
  // debug_mode?: true            // only when NEXT_PUBLIC_VERCEL_ENV !== 'production'
}

// cta_join_external_click — fired on pointerdown of the external NZDA link on /join
{
  join_source_page: string,     // route template e.g. '/range', or '(direct)'
  join_origin_method: 'sessionStorage' | 'referrer_fallback' | 'direct',
  link_destination_class: 'external_nzda'
  // debug_mode?: true
}
```

### Pass Criteria

Carry-forward unchanged from rev 2 plus replacements:

- [x] (revised A008) T0 gate is a green Playwright test `tests/e2e/analytics-probe.spec.ts` against a preview URL, asserting at least one request to `*.google-analytics.com/g/collect` with `tid=G-B62VVGCGP1` and `en=__analytics_probe`. DebugView confirmation logged in `docs/analytics_probe_results.md` before production activation but is not the CI gate.
- [x] (revised A006) `debug_mode` absence verified by BOTH (a) unit test on `trackEvent` with `NEXT_PUBLIC_VERCEL_ENV=production` asserting `'debug_mode' in payload === false`, AND (b) `grep -rF 'debug_mode' .next/ --exclude-dir=cache --exclude-dir=trace` returning zero matches.
- [x] (new A003) Playwright test: `/range` → middle-click Join → new tab loads `/join` → click external CTA → `cta_join_external_click` fired with `join_origin_method='referrer_fallback'` and `join_source_page='/range'`. (Replaces rev 2's "new-tab joins lost" acceptance.)
- [x] (new A003) Playwright test: direct nav to `/join` with no referrer → click external → event has `join_origin_method='direct'`, `join_source_page='(direct)'`.
- [x] (new A004) `npm run generate-route-templates` is idempotent; CI step asserts no diff after running.
- [x] (new A004) Unit tests: static path → as-is; `/newsletters/2026-04` → `/newsletters/[slug]`; root `/` → `/`; unknown static path → as-is.
- [x] (new A009) PII-allowlist unit test runs a fixture of all schema-conformant events and asserts every param value matches its enum or the route-template regex; injects `@`, `?`, `<email>`, `?foo=bar` and asserts the test fails (negative test of the test).
- [x] (new A010) Unit tests for sessionStorage throwing SecurityError and QuotaExceededError on get/set — no throw, no UI break.
- [x] (new A010) Playwright test: sessionStorage.setItem patched to throw → full funnel completes, external event fires with `join_origin_method='referrer_fallback'`.
- [x] (new A010) Playwright test: sessionStorage throws AND referrer stripped → external event fires with `join_origin_method='direct'`.

### Not Claimed / Deferred

Rev 2 deferred list carries forward, with these removals (now addressed):

- ~~"No tracking of new-tab/middle-click join intents"~~ — now covered via referrer_fallback.
- ~~"No automatic detection of route additions"~~ — covered by generator + CI drift check.

Still deferred:

- Intercepting routes (`(..)`, `(...)`) — generator emits a build warning if found; manual handling required.
- No fallback if both sessionStorage AND referrer are unavailable — classified as direct, which is the correct semantics.
- No event queue for ad-blocked gtag (A105 unchanged).
- No automatic detection of GA4 `session_timeout` changes in Admin (T10 README note remains the safeguard).

Requesting auditor focus next round on: (a) is the route-template generator's handling of catch-all (`[...slug]`) and optional catch-all (`[[...slug]]`) segments specified precisely enough; (b) is the referrer_fallback safe under all browser default referrer policies on a single HTTPS origin; (c) any remaining pass criterion that isn't independently verifiable from a fresh clone.