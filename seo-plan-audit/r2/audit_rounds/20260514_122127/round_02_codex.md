---
role: auditor
round: 2
status: OPEN_ISSUES
issues:
  - ref: "A003"
    severity: major
    proposed_status: resolved
    claim: "Same-site /join arrivals are no longer classified as direct; referrer_fallback addresses the original direct-vs-internal issue."
    required_change: ""
    concrete_alternative: ""
  - ref: "A004"
    severity: major
    proposed_status: resolved
    claim: "Manual dynamic-route mapping and entropy fallback were removed in favor of generated route templates."
    required_change: ""
    concrete_alternative: ""
  - ref: "A006"
    severity: major
    proposed_status: resolved
    claim: "debug_mode is now checked at both the helper boundary and emitted build artifacts."
    required_change: ""
    concrete_alternative: ""
  - ref: "A008"
    severity: major
    proposed_status: open
    claim: "The T0 Playwright gate still proves request creation, not event delivery. page.on('request') fires before network completion, and the snippet never asserts response status or request failure state."
    required_change: "Gate on a completed GA4 collect response, not request presence."
    concrete_alternative: "Use Playwright to wait for the matching collect response, assert status 200/204, assert the request did not fail, and parse GET query or POST body for tid=G-B62VVGCGP1 and en=__analytics_probe."
  - ref: "A009"
    severity: major
    proposed_status: resolved
    claim: "The join-funnel event names and required parameters are now specified."
    required_change: ""
    concrete_alternative: ""
  - ref: "A010"
    severity: major
    proposed_status: resolved
    claim: "sessionStorage denied/full behavior now has explicit unit and Playwright coverage."
    required_change: ""
    concrete_alternative: ""
  - ref: "A011"
    severity: major
    proposed_status: open
    claim: "The schema is internally contradictory: D001 says direct omits join_source_page, while the Build Plan and pass criteria require join_source_page='(direct)'; D004 also lists join_source_page on internal clicks while the schema omits it."
    required_change: "Make the event schema single-source and consistent before implementation."
    concrete_alternative: "Use a TypeScript discriminated union: internal events have current_page only; external events always have join_source_page, using '(direct)' for direct. Update D001, D004, tests, and docs to match."
  - ref: "A012"
    severity: major
    proposed_status: open
    claim: "New-tab, middle-click, and modifier Join clicks are still excluded from cta_join_internal_click because T5 remains left-click-only. External events can then be attributed by referrer, so the numerator includes source-page traffic the denominator never counted."
    required_change: "Track every valid internal Join CTA activation used in the funnel denominator."
    concrete_alternative: "Use click for primary activations and auxclick for middle-click activations; count modifier-key primary clicks; exclude right-click/context-menu only. Tests: left, middle, and ctrl/cmd click each emit one internal event; right-click emits zero."
  - ref: "A013"
    severity: major
    proposed_status: open
    claim: "The route generator is underspecified for valid App Router cases: app/**/page.tsx misses page.ts/js/jsx/mdx, the generic dynamic regex also matches [[...slug]], and a segment-position matcher cannot normalize multi-segment catch-all paths unless catch-all consumption is explicitly implemented."
    required_change: "Specify and test the full route parser before relying on it for GA4 cardinality control."
    concrete_alternative: "Glob page.{js,jsx,ts,tsx,mdx}; parse optional catch-all before catch-all before single dynamic; compile templates to regex; add tests for /docs, /docs/a, /docs/a/b, and a page.ts dynamic fixture."
  - ref: "A014"
    severity: major
    proposed_status: open
    claim: "The PII allowlist test is fixture-based, so it can pass while real call sites emit location.href, query strings, or free text."
    required_change: "Tie PII enforcement to actual event construction, not a hand-maintained fixture."
    concrete_alternative: "Expose typed event-builder functions, make trackEvent accept only the closed event union, normalize route values before emission, and run the allowlist assertions against builder outputs plus all call-site event names."
---