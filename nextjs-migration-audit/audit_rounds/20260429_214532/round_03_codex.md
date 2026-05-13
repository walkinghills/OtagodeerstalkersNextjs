---
role: auditor
round: 3
status: OPEN_ISSUES
issues:
  - ref: "A001"
    severity: major
    proposed_status: resolved
    claim: "Export artifact shape is now pinned to `trailingSlash: false` `.html` outputs."
    required_change: ""
    concrete_alternative: ""
  - ref: "A002"
    severity: major
    proposed_status: open
    claim: >-
      Still wrong. Round 3 relies on `cleanUrls: true` making `/range.html` return 200, but Vercel documents that `cleanUrls: true` redirects extension paths with 308. `/newsletters/index.html` is also still missing from T29 and pass criteria. Source: https://vercel.com/docs/project-configuration/vercel-json#cleanurls
    required_change: "Preserve existing `.html` and subdirectory index URLs with HTTP 200."
    concrete_alternative: >-
      Set `cleanUrls: false`; add explicit rewrites for clean URLs to emitted files, e.g. `/range` -> `/range.html`, `/newsletters` -> `/newsletters.html`, `/newsletters/:slug` -> `/newsletters/:slug.html`, and `/newsletters/index.html` -> `/newsletters.html`; update T29 to assert `/newsletters/index.html` returns 200.
  - ref: "A005"
    severity: major
    proposed_status: resolved
    claim: "CSP is now explicitly compatible with static export and tested against preview; `unsafe-inline` is documented as residual risk."
    required_change: ""
    concrete_alternative: ""
  - ref: "A006"
    severity: major
    proposed_status: open
    claim: >-
      Reopened. D003/pass #5 say Python validates against JSON Schema generated from Zod, but no task creates, commits, regenerates, or checks that schema artifact. T18 still implies Python validation against `lib/timetable.ts`, which Python cannot import.
    required_change: "Specify the schema artifact and generation/check workflow."
    concrete_alternative: >-
      Add `schemas/timetable.schema.json`; generate it from `lib/timetable.ts` using `zod-to-json-schema`; make Python load that JSON file; add CI step that regenerates the schema and fails on diff before running `jsonschema`.
  - ref: "A008"
    severity: major
    proposed_status: open
    claim: >-
      Reopened. T02 still says copy `css/styles.css` verbatim while T22 moves assets to `public/images`. If the copied CSS contains relative `url('../images/...')`, Next will resolve it from `app/globals.css` and either fail build or emit broken asset URLs.
    required_change: "Make CSS asset URL migration explicit."
    concrete_alternative: "Rewrite CSS asset URLs to root-absolute `/images/...`; add a build check and Playwright/network assertion that referenced CSS images return 200."
  - ref: "A009"
    severity: major
    proposed_status: open
    claim: "Reopened. Carried-forward tasks still say only `Visual diff`; the full pass criteria do not define tool, baseline URL, viewport set, masks, or failure threshold."
    required_change: "Make visual parity objectively testable."
    concrete_alternative: "Add Playwright screenshot comparisons against current production for every route at mobile and desktop widths, with fixed threshold and documented masks only for known dynamic timetable rows."
  - ref: "A010"
    severity: major
    proposed_status: resolved
    claim: "Workflow Python dependencies are now pinned and installed via `scripts/requirements.txt`."
    required_change: ""
    concrete_alternative: ""
  - ref: "A011"
    severity: major
    proposed_status: resolved
    claim: "Newsletter content policy is now internally consistent: `.md`, no MDX, no raw HTML, renderer without `rehype-raw`."
    required_change: ""
    concrete_alternative: ""
  - ref: "A012"
    severity: major
    proposed_status: open
    claim: >-
      Still incomplete. T30's shown command captures `PREVIEW_URL` but does not write `.preview-url` or export it to T28/T29/T31. `vercel pull` and `vercel build` also omit the token used by deploy.
    required_change: "Make preview URL acquisition and env propagation executable."
    concrete_alternative: >-
      Implement `scripts/deploy-preview.sh` to run all Vercel CLI calls with `--token "$VERCEL_TOKEN"`, capture the deploy URL, `curl -fsS "$PREVIEW_URL/"`, write `.preview-url`, then invoke T28/T29/T31 with `PLAYWRIGHT_BASE_URL` and `LIGHTHOUSE_URL` set.
  - ref: "A013"
    severity: major
    proposed_status: open
    claim: >-
      New. Pass #1 says `out/` produces exactly the listed HTML/public files. Next static export produces HTML/CSS/JS assets, including `_next/static/**`, so the criterion is impossible for a functional build. Source: https://nextjs.org/docs/app/guides/static-exports
    required_change: "Stop asserting an impossible exact output tree."
    concrete_alternative: "Assert required route/public artifacts exist and no unexpected routable `.html` pages exist, while explicitly allowing `_next/static/**` and other Next build assets."
  - ref: "A014"
    severity: major
    proposed_status: open
    claim: >-
      New. T14/T15/pass #5 require `gray-matter`, `react-markdown`, `remark-gfm`, `zod`, schema generation tooling, Playwright, Vitest, and LHCI, but no task installs or pins npm dependencies. `next build`/tests will fail with missing modules.
    required_change: "Add the npm dependency contract."
    concrete_alternative: "Add T01a to install runtime/dev packages, commit `package-lock.json`, and verify with `npm ci && npm run build && npm test`."
  - ref: "A015"
    severity: major
    proposed_status: open
    claim: >-
      New. T19 rejects raw HTML, T24 leaves the Cloudflare worker unchanged, and R11 admits existing newsletter content contains `<a>`, `<strong>`, and `<em>`. If the worker forwards HTML email bodies, the publish workflow now fails by design.
    required_change: "Define the end-to-end newsletter input contract."
    concrete_alternative: "Either update the worker to dispatch Markdown only and test that contract, or move HTML-to-Markdown conversion into `generate_newsletter.py` with pinned `markdownify`, then reject only after conversion and validation."
  - ref: "A016"
    severity: major
    proposed_status: open
    claim: >-
      New. Pass #13 says the timetable workflow commits `data/timetable.json` only and no other tracked file, but T18/T20 still carry forward updating `scripts/range_timetable.csv`. That contradicts the snapshot diff workflow.
    required_change: "Make timetable snapshot ownership consistent."
    concrete_alternative: "Either commit both `data/timetable.json` and `scripts/range_timetable.csv` when upstream CSV changes, or delete the CSV snapshot mechanism and compare against committed JSON only."
---