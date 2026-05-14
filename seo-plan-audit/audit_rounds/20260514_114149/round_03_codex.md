---
role: auditor
round: 3
status: OPEN_ISSUES
issues:
  - ref: "A009"
    severity: major
    proposed_status: resolved
    claim: "Vercel Custom Events are removed from the funnel path; GA4 is now the only custom-event transport."
    required_change: ""
    concrete_alternative: ""
  - ref: "A010"
    severity: major
    proposed_status: resolved
    claim: "GA4 eligibility now checks runtime `dataLayer` for measurement ID `G-B62VVGCGP1`, not just CSP."
    required_change: ""
    concrete_alternative: ""
  - ref: "A011"
    severity: minor
    proposed_status: resolved
    claim: "Anchor activation is now native `<a href>` with `pointerdown` plus deduped `click` fallback; Space handling removed."
    required_change: ""
    concrete_alternative: ""
  - ref: "A012"
    severity: minor
    proposed_status: resolved
    claim: "DebugView validation now has Tag Assistant documentation and preview-only `debug_mode`."
    required_change: ""
    concrete_alternative: ""
  - ref: "A013 stale D004 contradicts GA4 hard gate"
    severity: major
    proposed_status: open
    claim: "The current decision ledger still says: if GA4 CSP fails, 'drop gtag forwarding and ship Vercel-only.' That directly contradicts Round 3, D005, and D006, because Vercel custom events are out of scope and cannot answer the Join funnel."
    required_change: "Remove or supersede D004 so the executable plan has one failure path: GA4 unavailable means funnel work is blocked and user decision required."
    concrete_alternative: "Replace D004 with: 'If GA4 script/connect path or runtime probe fails, do not ship T3-T6/T9; mark NEEDS_USER. Vercel Analytics remains page-view-only and is not a funnel substitute.'"
  - ref: "A014 T0 probe cannot prove outbound event delivery"
    severity: major
    proposed_status: open
    claim: "T0 only checks that `dataLayer` contains `['config','G-B62VVGCGP1']`. That proves the tag was configured, not that `gtag('event')` produces a network request accepted by GA4. A broken wrapper, blocked collect request, consent/default settings, or runtime CSP issue can still pass T0 and make T3-T6 useless."
    required_change: "T0 must include an actual test event dispatch and observe the GA4 collect request or DebugView event before unlocking funnel implementation."
    concrete_alternative: "Add `trackEvent('__analytics_probe', {probe_page: routeTemplate})` in preview only, verify a `google-analytics.com/g/collect` request returns successfully or appears in DebugView, then document PASS/FAIL per `/`, `/range`, `/join`."
---