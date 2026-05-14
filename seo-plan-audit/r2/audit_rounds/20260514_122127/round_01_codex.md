---
role: auditor
round: 1
status: OPEN_ISSUES
issues:
  - ref: "A101"
    severity: major
    proposed_status: resolved
    claim: "204-response probing was replaced with event_callback plus DebugView."
    required_change: ""
    concrete_alternative: ""
  - ref: "A102"
    severity: minor
    proposed_status: resolved
    claim: "TTL is now explicitly tied to GA4 session_timeout."
    required_change: ""
    concrete_alternative: ""
  - ref: "A103"
    severity: major
    proposed_status: open
    claim: "Plan intentionally classifies modifier/new-tab internal Join traffic as direct, violating the requirement to distinguish direct visits from internal-funnel traffic."
    required_change: "Do not label known same-site Join arrivals as direct."
    concrete_alternative: "On /join, derive internal-funnel fallback from document.referrer when referrer origin is the site and pathname is not /join; emit join_source_page from normalized referrer path with join_origin_method='referrer_fallback'."
  - ref: "A104"
    severity: major
    proposed_status: open
    claim: "Manual KNOWN_DYNAMIC_SEGMENTS plus entropy fallback is not maintainable indefinitely and can still leak high-cardinality path values for ordinary slug formats."
    required_change: "Remove hand-maintained dynamic-route mapping as the source of truth."
    concrete_alternative: "Generate route templates at build/test time from app/**/[param]/page.tsx and fail CI if a dynamic route lacks a normalizer fixture."
  - ref: "A106"
    severity: minor
    proposed_status: resolved
    claim: "Undefined gtag behavior now has explicit no-request and no-console-error verification."
    required_change: ""
    concrete_alternative: ""
  - ref: "A107"
    severity: major
    proposed_status: open
    claim: "Grepping .next/static for debug_mode is incomplete because Next.js may place client code in .next/server/app or route chunks outside .next/static."
    required_change: "Make the production debug_mode check cover every emitted JS artifact."
    concrete_alternative: "After next build, run a recursive fixed-string search for debug_mode across .next excluding cache and trace artifacts, or better assert the built analytics helper never serializes debug_mode when NEXT_PUBLIC_VERCEL_ENV=production."
  - ref: "A109"
    severity: minor
    proposed_status: resolved
    claim: "Probe now explicitly uses transport_type:'beacon'."
    required_change: ""
    concrete_alternative: ""
  - ref: "A111"
    severity: major
    proposed_status: open
    claim: "T0 still does not actually prove event delivery in an automated gate because GA4 DebugView is manual, laggy, and unavailable to CI/preview automation."
    required_change: "Make the hard gate produce reproducible evidence, not only a human observation."
    concrete_alternative: "Use Playwright to intercept the outgoing GA4 collect request and assert required event name, measurement ID, and params, then keep DebugView as a documented manual confirmation before production activation."
  - ref: "A112"
    severity: major
    proposed_status: open
    claim: "The plan does not specify the join-funnel event schema needed to answer the stated question broken down by source page."
    required_change: "Define exact GA4 event names and non-PII parameters before implementation."
    concrete_alternative: "Specify cta_join_internal_click and cta_join_external_click params: join_source_page, current_page, link_destination_class, join_origin_method, and debug_mode only outside production; add tests asserting no URL query, email, name, or free-text values are emitted."
  - ref: "A113"
    severity: major
    proposed_status: open
    claim: "sessionStorage failure handling is named as a non-negotiable but not tested."
    required_change: "Add explicit storage-denied tests."
    concrete_alternative: "Unit test get/set origin with sessionStorage throwing SecurityError and QuotaExceededError; Playwright init script overrides Storage.prototype.setItem/getItem to throw, then clicks Join and asserts no UI exception and external click falls back to direct or referrer_fallback."
---

Blocking issues remain.

A103 is the main contradiction: the plan says new-tab internal joins become direct, but the task explicitly requires direct visits distinguished from internal-funnel traffic. Same-site `document.referrer` is enough to avoid poisoning direct.

A111 also blocks the “hard gate” wording. DebugView can stay, but the automated gate needs deterministic evidence from browser/network instrumentation. DebugView alone is not a gate.