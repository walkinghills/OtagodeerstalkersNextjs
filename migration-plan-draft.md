# Next.js Migration Plan — Draft

## Current Stack
- Plain static HTML/CSS/JS, 10 pages
- Single stylesheet: css/styles.css
- js/main.js: mobile nav toggle only
- Nav and footer duplicated across every HTML file
- Timetable: Python script injects HTML into range.html via GitHub Actions cron (monthly)
- Newsletter: Python script generates HTML, triggered via GitHub Actions dispatch + Cloudflare Email Worker
- Hosted on Vercel, auto-deploy from walkinghills/otago-deerstalkers main branch
- vercel.json: cleanUrls, trailingSlash: false, security headers

## Pages
- index.html (home)
- range.html (Chaz Forsyth Rifle Range — includes timetable injection markers)
- lodge.html
- club-hunts.html
- hunts-course.html
- competitions.html
- join.html
- contact.html
- 404.html
- newsletters/index.html (archive listing)
- newsletters/2026-03.html (individual edition)

## Proposed Migration Steps
1. npx create-next-app with TypeScript, output: 'export' in next.config.ts
2. Copy css/styles.css into styles/globals.css unchanged
3. Create components/Layout.tsx — nav + footer extracted once
4. Convert each HTML page to .tsx (class= → className=, etc.)
5. Port js/main.js nav toggle into Layout component
6. Timetable: keep Python script writing JSON, getStaticProps reads it at build time
7. Newsletter: each edition becomes a page under pages/newsletters/[slug].tsx
8. Update vercel.json — cleanUrls/trailingSlash handled by Next.js config
9. Redirect handling for /newsletters/ subdirectory

## Open Questions
- App Router vs Pages Router?
- How to handle timetable injection without breaking the monthly cron workflow?
- Newsletter archive: dynamic route or static pages?
- Font loading: currently Google Fonts via link tag in each HTML head
