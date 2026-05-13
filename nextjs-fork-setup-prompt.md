# Prompt: Fork Setup for Next.js Otago Deerstalkers Site

## What this session does

Sets up a GitHub fork of `walkinghills/otago-deerstalkers` to host the Next.js version of the Otago Deerstalkers website as a permanently separate, independently maintained site with its own domain.

## Context

- The original repo (`walkinghills/otago-deerstalkers`) hosts the static HTML site deployed to otagodeerstalkers.co.nz via Vercel. It must remain untouched.
- The fork becomes the Next.js site. The `nextjs-migration` branch on the fork is where Next.js development has happened.
- Both sites are independently maintained going forward — they are not expected to merge back.
- GitHub PAT is at `c:\Users\User\Projects AI\Github key.txt`

## Tasks

1. Fork `walkinghills/otago-deerstalkers` on GitHub (suggest name: `otago-deerstalkers-next`)
2. Confirm the fork has the `nextjs-migration` branch
3. Create a new Vercel project pointing at the fork, pinned to the `nextjs-migration` branch (until it is promoted to main on the fork)
4. Assign the new domain to the fork's Vercel project
5. Confirm the original Vercel project is still pointing at the original repo on `main`

## Read first

- `CLAUDE.md` in the repo root — project facts, house rules, key content
- `nextjs-migration-audit/audit_rounds/20260429_214532/best_so_far_20260429_214532.md` — current migration plan (3 audit rounds, 6 blocking issues unresolved)
- `nextjs-migration-audit/audit_rounds/20260429_214532/round_03_codex.md` — auditor's last round listing all open issues

## House rules

- No em dashes anywhere on the site
- No Co-Authored-By in commits
- Push directly to branch; Vercel deploys automatically
