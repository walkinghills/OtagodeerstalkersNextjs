---
role: auditor
round: 1
status: OPEN_ISSUES
issues:
  - ref: "A001"
    severity: major
    proposed_status: open
    claim: "No drift from round 0, but the funnel data model splits the source page across `from_page` on the start event and `origin_page` on the completion event. That weakens the required report: conversion from Join clicks to external NZDA signup broken down by source page."
    required_change: "Use one source-page dimension across both funnel events."
    concrete_alternative: "Send `join_source_page` on both `cta_join_internal_click` and `cta_join_external_click`; internal value is the current route template, external value is the stored origin or `direct`. Register `join_source_page` as the GA4 custom dimension."

  - ref: "A002"
    severity: major
    proposed_status: open
    claim: "T6 tracks the external NZDA signup click only on `onClick`, despite the plan itself identifying unload loss as a risk. External navigation can kill async analytics before dispatch."
    required_change: "Move reliability handling onto the external CTA, not just internal Join buttons."
    concrete_alternative: "Record the external click on `onPointerDown` with a keyboard `onKeyDown` fallback for Enter/Space, use `transport_type: 'beacon'`, do not prevent default navigation, and dedupe per activation."

  - ref: "A003"
    severity: major
    proposed_status: open
    claim: "T7 is not executable as written: `SportsEvent (or skip...)` and `Event or SportsActivityLocation` leave schema type and maintenance policy undecided. Event schema is high-maintenance if dates change weekly."
    required_change: "Remove ambiguous Event/SportsEvent work unless stable structured event data already exists."
    concrete_alternative: "Use stable `WebPage`, `CollectionPage`, `ContactPage`, `Article`, and shared `SportsOrganization @id`. Only add `Event`/`SportsEvent` if generated from the same maintained data source as visible event content, including `startDate`, `location`, and `organizer`."

  - ref: "A004"
    severity: major
    proposed_status: open
    claim: "The OG task may fail in production because `metadata.openGraph.images = ['/og.png']` does not guarantee an absolute crawlable URL, and child page metadata can override root OpenGraph fields."
    required_change: "Make OG image generation deterministic across all routes."
    concrete_alternative: "Set `metadataBase` to the canonical production URL, define width/height/alt for `/og.png`, audit route-level metadata overrides, and test generated HTML for every route that has custom metadata."

  - ref: "A005"
    severity: major
    proposed_status: open
    claim: "T11 only says to confirm CSP coverage. It has no required branch if GA4 connect/script sources are not already allowed, while the constraints forbid broadening CSP."
    required_change: "Add a CSP failure path before implementation."
    concrete_alternative: "Add T0: inspect existing CSP. If GA4 is not already allowed, do not add or load gtag; keep Vercel Analytics only and mark GA4 forwarding blocked by the locked CSP constraint, or get an explicit scope change."

  - ref: "A006"
    severity: minor
    proposed_status: open
    claim: "The JSON-LD pass criterion uses Google Rich Results Test for all schema types, but `ContactPage` and `CollectionPage` are not guaranteed rich-result eligible. A valid schema can still produce no rich result."
    required_change: "Separate schema validity from rich-result eligibility."
    concrete_alternative: "Validate all JSON-LD with Schema.org validator or equivalent structured-data parsing tests. Use Google Rich Results Test only for eligible types such as `BreadcrumbList` and supported `Article` markup."

  - ref: "A007"
    severity: minor
    proposed_status: open
    claim: "The Lighthouse criterion includes FID on a preview deploy. FID is not a Lighthouse lab metric and is not a usable preview-deploy pass condition."
    required_change: "Replace FID with measurable preview metrics."
    concrete_alternative: "Use Lighthouse LCP, CLS, and TBT for preview verification. If field data is later available, track INP after the 30-day window."

  - ref: "A008"
    severity: minor
    proposed_status: open
    claim: "The event taxonomy requirement is under-specified. T10 says to document events, but not the question each event answers, the report used, or the exact dimensions required."
    required_change: "Make the taxonomy auditable."
    concrete_alternative: "Add a README table with columns: question, event name, required props, GA4 custom dimensions, Vercel event, and pass/fail report location."
---