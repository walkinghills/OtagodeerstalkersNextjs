---
role: auditor
round: 2
status: OPEN_ISSUES
issues:
  - ref: "A001"
    severity: major
    proposed_status: open
    claim: "Still ambiguous: Pass #1 says `newsletters.html` or `newsletters/index.html`. Next docs state `output: \"export\"` with default `trailingSlash: false` emits `/about.html`; the plan already depends on `/newsletters.html`. https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash"
    required_change: "Pin the export artifact shape now."
    concrete_alternative: "Require `out/newsletters.html` and `out/newsletters/2026-03.html`; add `npm run assert:export-shape` after `next build`."
  - ref: "A002"
    severity: major
    proposed_status: open
    claim: "Still incomplete: T23 tests `/newsletters/index.html`, but Next will emit `out/newsletters.html` and the proposed rewrites do not serve `/newsletters/index.html` with 200."
    required_change: "Preserve subdirectory index URLs explicitly."
    concrete_alternative: "Add an explicit rewrite `/newsletters/index.html` -> `/newsletters.html`, or a postbuild alias copy to `out/newsletters/index.html`; include it in the URL inventory test."
  - ref: "A003"
    severity: major
    proposed_status: resolved
    claim: "MDX was removed; automated newsletter content is no longer compiled as JavaScript."
    required_change: ""
    concrete_alternative: ""
  - ref: "A004"
    severity: major
    proposed_status: resolved
    claim: "`usePathname` moved into a Client Component."
    required_change: ""
    concrete_alternative: ""
  - ref: "A005"
    severity: major
    proposed_status: open
    claim: "Still wrong: T23/deferral claim hash-free `script-src 'self'` works because static export emits same-origin scripts only. Next CSP docs say Next generates inline scripts/styles and static pages cannot receive request nonces. https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy"
    required_change: "Choose a CSP compatible with static export before implementation."
    concrete_alternative: "For static export, set `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'`, keep `object-src 'none'; base-uri 'self'; frame-ancestors 'none'`, and retain T28 as the browser gate."
  - ref: "A006"
    severity: major
    proposed_status: resolved
    claim: "Zod plus generated JSON Schema gives TypeScript and Python a real shared validation contract."
    required_change: ""
    concrete_alternative: ""
  - ref: "A007"
    severity: major
    proposed_status: resolved
    claim: "Workflows now gate commits on validation and `npm run build`."
    required_change: ""
    concrete_alternative: ""
  - ref: "A008"
    severity: major
    proposed_status: resolved
    claim: "CSS asset URL rewriting and a grep check were added."
    required_change: ""
    concrete_alternative: ""
  - ref: "A009"
    severity: minor
    proposed_status: resolved
    claim: "Visual regression now has tool, viewport matrix, baseline source, threshold, and masked dynamic content."
    required_change: ""
    concrete_alternative: ""
  - ref: "A010 missing Python dependency contract"
    severity: major
    proposed_status: open
    claim: "T18/T19 use `jsonschema` and `bleach`, but no `requirements.txt`, lockfile, or workflow `pip install` step is specified. These are not Python stdlib modules."
    required_change: "Pin and install Python dependencies wherever scripts run."
    concrete_alternative: "Add `requirements.txt` with exact `jsonschema` and `bleach` versions; T20/T21 must run `python -m pip install -r requirements.txt` before generators."
  - ref: "A011 newsletter sanitization behavior is contradictory"
    severity: major
    proposed_status: open
    claim: "T15 says allowed raw HTML can render, but T01 does not add `rehype-raw`; react-markdown escapes/ignores HTML unless `rehype-raw` is used. T19 sanitizes malicious input, while T21 says malicious input must fail. https://github.com/remarkjs/react-markdown#appendix-a-html-in-markdown"
    required_change: "Define one newsletter policy: reject, sanitize-and-commit, or allow sanitized HTML."
    concrete_alternative: "Use strict CommonMark/GFM only: generator rejects raw HTML/JS tokens before commit, renderer uses `react-markdown` without `rehype-raw`, and T21 expects known-bad input to fail without committing."
  - ref: "A012 preview test execution is not wired"
    severity: major
    proposed_status: open
    claim: "T28/T29 and Lighthouse require a Vercel preview URL, but no task creates the preview deployment or passes its URL into Playwright/Lighthouse."
    required_change: "Make preview deployment and test target acquisition explicit."
    concrete_alternative: "Add T30: `vercel build && vercel deploy --prebuilt`, capture the returned URL into `PLAYWRIGHT_BASE_URL`, then run CSP, visual, and Lighthouse checks against that URL before production promotion."
---