# Codex Audit Result

Audit target: `http://localhost:3000`  
Browser automation: installed Chrome via Playwright. Chrome addon bridge was not exposed in this session, so the browser was still Chrome but not driven through the addon.

## Per-test Results

| # | Test | Result | Evidence |
|---|---|---|---|
| 1 | GA4 loaded | PASS | `window.gtag` was `function`; dataLayer had `["config","G-B62VVGCGP1",{"anonymize_ip":true}]`; GA4 `page_view` POST returned `204`; no console errors or CSP violations. |
| 2 | Internal click attribution | PASS | Header `a.btn-join` left-click sent `cta_join_internal_click` POST `204`, then navigated to `/join`; sessionStorage contained `{"origin":"/range","ts":1778724419466}`. |
| 3 | External click, sessionStorage path | PASS | `/join` external NZDA CTA sent `cta_join_external_click` POST `204` with `join_source_page=/range` and `join_origin_method=sessionStorage`. |
| 4 | External click, direct path | PASS | Fresh `/join` context had `sessionStorage.getItem("joinFunnelOrigin") === null`; external CTA sent direct event POST `204`. |
| 5 | Middle-click test | PASS | Chrome middle-click opened `/join` in a new tab and emitted exactly one `cta_join_internal_click` POST `204` after ~5.2s. |
| 6 | Right-click test | PASS | Right-click generated DOM `button=2` pointer/mouse/contextmenu events and zero `cta_join_internal_click` requests after 8s. |
| 7 | JSON-LD schema correctness | PASS | All listed pages parsed without JSON errors and exposed expected `@type`; BreadcrumbList entries had ordered `name` and absolute `item` URLs. Rich Results Test not run because Google cannot fetch localhost. |
| 8 | OG metadata | FAIL | Home page rendered `twitter:card`, but no rendered `og:image` or `og:type`. |
| 9 | No em dashes | FAIL | Rendered HTML contains U+2014 on `/`, `/range`, `/join`, `/club-hunts`, and `/competitions`; `/lodge` was clean. |
| 10 | `lib/analytics/track.ts` | PASS | `trackEvent` guards missing `window.gtag`, injects `debug_mode` only for non-production env, wraps `window.gtag(...)` in try/catch, and uses a discriminated `AnalyticsEvent` union. |
| 11 | `lib/analytics/joinFunnel.ts` | PASS | sessionStorage get/set are in try/catch; TTL is `30 * 60 * 1000`; fallback is `(direct)`; referrer requires same origin before use. |

## Network Evidence

```text
POST 204 https://www.google-analytics.com/g/collect?v=2&tid=G-B62VVGCGP1&en=page_view

POST 204 https://www.google-analytics.com/g/collect?v=2&tid=G-B62VVGCGP1&en=cta_join_internal_click&ep.current_page=%2Frange&ep.link_destination_class=internal_cta&ep.transport_type=beacon&ep.debug_mode=true

POST 204 https://www.google-analytics.com/g/collect?v=2&tid=G-B62VVGCGP1&en=cta_join_external_click&ep.join_source_page=%2Frange&ep.join_origin_method=sessionStorage&ep.link_destination_class=external_nzda&ep.transport_type=beacon&ep.debug_mode=true

POST 204 https://www.google-analytics.com/g/collect?v=2&tid=G-B62VVGCGP1&en=cta_join_external_click&ep.join_source_page=(direct)&ep.join_origin_method=direct&ep.link_destination_class=external_nzda&ep.transport_type=beacon&ep.debug_mode=true
```

## DataLayer / Storage Evidence

```text
typeof window.gtag = "function"
dataLayer config entry = ["config","G-B62VVGCGP1",{"anonymize_ip":true}]
joinFunnelOrigin after /range header Join = {"origin":"/range","ts":1778724419466}
```

## JSON-LD Evidence

```text
/              SportsOrganization
/range         SportsActivityLocation
/lodge         LodgingBusiness
/hunts-course  Course
/join          FAQPage
/competitions  WebPage, BreadcrumbList: Home -> Competitions
/club-hunts    WebPage, BreadcrumbList: Home -> Club Hunts
/contact       ContactPage, BreadcrumbList: Home -> Contact
/newsletters   CollectionPage, BreadcrumbList: Home -> Newsletter
```

## OG Evidence

```text
Rendered home head matches for requested tags:
[
  "<meta name=\"twitter:card\" content=\"summary_large_image\"/>"
]

og:image = null
og:type = null
twitter:card = summary_large_image
```

Likely cause: `app/layout.tsx` defines root `openGraph.type` and `openGraph.images`, but `app/page.tsx` defines page-level `openGraph` with only `title` and `description`, and the rendered metadata does not inherit the root image/type.

## Em Dash Hits

```text
/:
"legalName":"New Zealand Deerstalkers Association [U+2014] Otago Branch"

/range:
<span class="tno-date">[U+2014]</span>

/join:
Deerstalkers App [U+2014] from your weekly fuel to a backcountry helicopter flight

/club-hunts:
"name":"Club Hunts [U+2014] NZDA Otago Branch"

/competitions:
"name":"Competitions [U+2014] NZDA Otago Branch"
```

## Console Errors Observed

None. Only dev/info logs were observed: React DevTools prompt, Vercel Analytics development debug logs, and Next Fast Refresh logs.

## CSP Violations Observed

None. Note: the local Next dev server did not emit the `Content-Security-Policy` header from `vercel.json`, so this confirms no runtime console violations locally but does not fully exercise the deployed Vercel CSP header.

## Deviations From Plan

- Home page OG output is missing `og:image` and `og:type`, despite root metadata wiring.
- House-style no-em-dash criterion is violated in rendered HTML.
- The dynamic sitemap route returned `200`, but contained no newsletter slug URLs. `app/sitemap.ts` maps `getAllNewsletters()`, while `content/newsletters` is currently empty.

## Latent Bugs Not Covered By The Test List

- `/og.jpg` is served as `image/jpeg` with `Content-Length: 533028`; the reference plan's OG asset budget says `<200KB`.
- Newsletter archive data appears absent from `content/newsletters`, so `/newsletters` renders no editions and sitemap slug inclusion cannot work until markdown content exists or the data source is changed.

## Overall

OPEN_ISSUES (3)

1. Missing rendered `og:image` and `og:type`.
2. Rendered em dash violations.
3. Sitemap has no newsletter slug URLs because the newsletter content source is empty.
