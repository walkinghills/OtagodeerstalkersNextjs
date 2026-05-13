---
role: auditor
round: 1
status: OPEN_ISSUES
issues:
  - ref: "A001 static export artifact shape is wrong"
    severity: major
    proposed_status: open
    claim: "T01/T23/Pass #1 assume `output: 'export'` + `trailingSlash: false` emits `/range/index.html`. Next docs say `trailingSlash: true` emits `/me/index.html` instead of default `/me.html`: https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash"
    required_change: "Correct the output artifact and routing assumptions before implementation."
    concrete_alternative: "Keep `trailingSlash: false` and `cleanUrls: true`; expect `out/range.html`, `out/lodge.html`, `out/newsletters/2026-03.html`; update pass criteria and curl tests accordingly."

  - ref: "A002 exact URL preservation contradicted by redirects"
    severity: major
    proposed_status: open
    claim: "T23 and Pass #3 intentionally 308 `*.html` URLs to clean URLs. Vercel `cleanUrls: true` also redirects `.html` to extensionless paths: https://vercel.com/docs/project-configuration/vercel-json#cleanurls. That violates 'preserve every existing URL exactly' for any current `.html` URL."
    required_change: "Inventory actual production URLs and define exact 200-vs-redirect behavior per URL."
    concrete_alternative: "Serve existing URLs with 200 via static aliases or Vercel rewrites; only redirect URLs proven non-canonical. Add explicit cases for `/index.html` and `/newsletters/index.html` so wildcards do not send them to `/index` or `/newsletters/index`."

  - ref: "A003 newsletter MDX is an injection surface"
    severity: major
    proposed_status: open
    claim: "T19 compiles email-derived newsletter body as MDX while T24 leaves the worker contract unchanged. MDX supports JSX, JS expressions, and import/export, and compiles to JavaScript: https://mdxjs.com/docs/what-is-mdx/"
    required_change: "Do not treat automated newsletter content as trusted MDX."
    concrete_alternative: "Emit Markdown or HTML fragments with frontmatter, sanitize with an allowlist, reject `script`, event attributes, `javascript:` URLs, MDX ESM, and expressions; add a malicious newsletter fixture before commit."

  - ref: "A004 Header hook placement cannot build as written"
    severity: major
    proposed_status: open
    claim: "T04 puts active-link highlighting via `usePathname` in `Header`, but only `MobileNav` is marked `'use client'`. `usePathname` is client-only: https://nextjs.org/docs/app/api-reference/functions/use-pathname"
    required_change: "Make the component using `usePathname` a Client Component."
    concrete_alternative: "Create `components/NavLinks.tsx` with `'use client'` and `usePathname`; import it from a server `Header`, or mark `Header` client. `next build` must be the acceptance test."

  - ref: "A005 CSP check is insufficient"
    severity: major
    proposed_status: open
    claim: "T23 preserves existing security headers and Pass #4 only checks presence. Next App Router static pages include Next scripts; an old static-site CSP can block hydration and the mobile nav while still passing the header-presence test."
    required_change: "Validate CSP behavior, not just header existence."
    concrete_alternative: "Run Playwright against the Vercel preview with CSP enforced; fail on CSP console violations and assert hamburger behavior. If needed, add documented script hashes or a minimal compatible `script-src`."

  - ref: "A006 timetable validation is not implementable"
    severity: major
    proposed_status: open
    claim: "T18/Pass #5 require Zod validation, but T06 only defines a TypeScript type and T01 does not add `zod` or a validation command. Python cannot validate against a TS type."
    required_change: "Add a real shared validation path."
    concrete_alternative: "Add `zod`, export `TimetableSchema`, create `npm run validate:timetable`, and call it from local tests plus `sync-timetable.yml`; or use JSON Schema consumed by both Python and TypeScript."

  - ref: "A007 workflows can commit broken deploys"
    severity: major
    proposed_status: open
    claim: "T20/T21 commit generated JSON/MDX but do not gate commits on validation plus `npm run build`. Bad generated content can land on `main` and block every Vercel deploy."
    required_change: "Gate generated commits on a successful build."
    concrete_alternative: "In both workflows: generate, validate, run `npm ci && npm run build`, then commit only on success; on failure, upload artifacts and exit nonzero without committing."

  - ref: "A008 copied CSS can break moved asset URLs"
    severity: major
    proposed_status: open
    claim: "T02 copies `css/styles.css` verbatim into `app/globals.css` while T22 moves assets into `public/`. Relative CSS `url(...)` paths are now based from a different file location."
    required_change: "Audit and rewrite CSS asset references during migration."
    concrete_alternative: "Convert image/font URLs in global CSS to root-public paths like `url('/images/hero-bg.svg')`; add a build check and screenshot assertion that the hero image renders."

  - ref: "A009 visual diff criteria are hand-wavy"
    severity: minor
    proposed_status: open
    claim: "Most page tasks say only 'Visual diff' with no tool, viewport matrix, baseline source, or threshold. That is not executable without further research."
    required_change: "Define deterministic visual regression criteria."
    concrete_alternative: "Use Playwright screenshots for every migrated route at 360x800 and 1280x900 against current production, set an explicit diff threshold, and mask only documented dynamic timetable content."
---