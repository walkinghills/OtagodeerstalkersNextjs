---
role: auditor
round: 2
status: OPEN_ISSUES
issues:
  - ref: "A001"
    severity: major
    proposed_status: resolved
    claim: "Resolved: both funnel events now use `join_source_page`."
    required_change: ""
    concrete_alternative: ""
  - ref: "A002"
    severity: major
    proposed_status: resolved
    claim: "Resolved: external CTA tracking moved earlier than navigation with beacon transport and dedupe."
    required_change: ""
    concrete_alternative: ""
  - ref: "A003"
    severity: major
    proposed_status: resolved
    claim: "Resolved: Event/SportsEvent schema removed from this milestone."
    required_change: ""
    concrete_alternative: ""
  - ref: "A004"
    severity: major
    proposed_status: resolved
    claim: "Resolved: OG image now requires `metadataBase`, dimensions, alt text, route metadata audit, and absolute URL checks."
    required_change: ""
    concrete_alternative: ""
  - ref: "A005"
    severity: major
    proposed_status: resolved
    claim: "Resolved: CSP audit is now a hard gate with a no-GA4 branch."
    required_change: ""
    concrete_alternative: ""
  - ref: "A006"
    severity: minor
    proposed_status: resolved
    claim: "Resolved: schema validity and rich-result eligibility are now separate checks."
    required_change: ""
    concrete_alternative: ""
  - ref: "A007"
    severity: minor
    proposed_status: resolved
    claim: "Resolved: FID replaced with preview-measurable lab metrics."
    required_change: ""
    concrete_alternative: ""
  - ref: "A008"
    severity: minor
    proposed_status: resolved
    claim: "Resolved: README taxonomy table now has auditable columns."
    required_change: ""
    concrete_alternative: ""
  - ref: "A009"
    severity: major
    proposed_status: open
    claim: "The Vercel-only fallback violates the zero-recurring-budget assumption. Vercel docs say Custom Events are Pro/Enterprise, and Hobby pricing shows no Custom Events."
    required_change: "Do not claim Vercel custom events as the fallback unless the actual project plan includes them at zero added cost."
    concrete_alternative: "Add a `VERCEL_CUSTOM_EVENTS_ALLOWED` gate. If GA4 is blocked and Vercel custom events are unavailable, mark the funnel analytics item blocked and request a scope decision."
  - ref: "A010"
    severity: major
    proposed_status: open
    claim: "`GA4_ALLOWED` only checks CSP. That can pass while `gtag` is absent or using the wrong measurement ID, making GA4 DebugView and custom dimensions silently useless."
    required_change: "GA4 eligibility must verify the active tag, not just the CSP allowlist."
    concrete_alternative: "T0 should set `GA4_CLIENT_AVAILABLE=true` only if rendered HTML or runtime inspection confirms `G-B62VVGCGP1` is already loaded without adding a new script."
  - ref: "A011"
    severity: minor
    proposed_status: open
    claim: "External CTA activation handling is inaccurate for a real link: Space does not natively activate `<a>`, while assistive-tech or programmatic clicks may fire `click` without pointer/key events."
    required_change: "Use native activation semantics for the external signup link."
    concrete_alternative: "Keep the CTA as `<a href>`. Track on `pointerdown` for pointer users and on `click` as a deduped fallback. Do not track Space on anchors."
  - ref: "A012"
    severity: minor
    proposed_status: open
    claim: "GA4 DebugView validation is underspecified. Google requires debug mode for DebugView, but the plan never enables Tag Assistant or `debug_mode`."
    required_change: "Make GA4 validation reproducible."
    concrete_alternative: "Use Tag Assistant for manual tests, or add `debug_mode:true` only in localhost/preview analytics events and explicitly exclude it from production."
---

Sources: Vercel Custom Events and pricing docs: https://vercel.com/docs/analytics/custom-events, https://vercel.com/docs/analytics/limits-and-pricing. GA4 DebugView requirement: https://support.google.com/analytics/answer/7201382.