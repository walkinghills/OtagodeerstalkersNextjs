# NZDA Otago Branch — Members Area & DOC Permit System

## Context for the audit

This is **Phase 2** of a two-phase build. Phase 1 (brochure site live at otagodeerstalkers.org.nz on Cloudflare DNS + Vercel hosting) is being shipped today and is **out of scope for this audit** except where it constrains Phase 2.

The audit's job is to find holes in the proposed Phase 2 architecture, threat model, and operational plan before a single line of code is written.

## Operational reality being modeled

### Existing manual workflow

1. NZ Department of Conservation (DOC) emails the club president a spreadsheet weekly, containing approved hunters: name, permit number, hunting block, start/end dates of permit
2. President compares the spreadsheet to the current week's gate codes (controlled by a forestry company that maintains the access roads)
3. President emails approved hunters their gate code for the week
4. The forestry company **rotates gate codes every Monday at 12:00 noon NZT** — codes have a maximum 7-day useful life by design, with a hard reset every Monday
5. Weekend public access uses a different mechanism (forestry inactive on weekends; codes for general public)

### Pain points the system must solve

- Club president is the single human bottleneck
- No record of who issued which code to whom
- No record of which committee member did each allocation
- No way for an approved hunter to self-serve view their own code
- Manual spreadsheet matching is error-prone

### What the system does

- Ingests DOC spreadsheet (manual upload by an operator initially; potentially API later if DOC ever exposes one)
- Stores hunter / permit / block / date data
- Allows committee operators to allocate the current week's gate code to approved hunters for the relevant block(s)
- Provides a member-facing read-only view: "my approved code for this week"
- **Logs every action** by every user: read, write, code disclosure, login, failed login — with actor, target, timestamp, IP, user agent
- Aligns code records with forestry rotation: codes auto-expire at 12:00 noon Monday and are replaced from forestry company input

### Compliance posture

- NZ **Privacy Act 2020** applies. Club is the agency / data controller. Full IPP responsibility.
- DOC arrangement: **informal**, email-based. **Not formalizing with DOC.** Spreadsheet handoff is treated as the boundary; DOC's interest ends at that point. No MoU planned.
- Club is an incorporated society (NZDA Otago Branch). Data controller = the club, legally.
- Developer (Sal) is currently a volunteer with no formal scope of work. Personal liability separation needs to be formalized via a one-page volunteer agreement signed by the club chair before launch.

## Proposed stack

- **Hosting:** Vercel (syd1 region; Pro tier when Phase 2 launches due to commercial-use TOS for non-profits)
- **DNS:** Cloudflare (with DNSSEC if .org.nz registrar supports DS records — to be verified)
- **Auth:** Supabase Auth (email + password, magic links optional, **TOTP required for operator and admin roles**)
- **DB:** Supabase Postgres (ap-southeast-2 / Sydney)
- **Audit logging:** append-only Postgres table, RLS-enforced INSERT-only for the application role; reads restricted to admin role
- **App URL:** `app.otagodeerstalkers.org.nz` — separate Next.js app under same monorepo, isolated from marketing site
- **Backups:** Supabase automatic daily + monthly export to encrypted Cloudflare R2 bucket; encryption key stored in 1Password (NOT in deployment env vars)
- **Dev/staging:** separate Supabase project with synthetic data; Vercel preview deployments wired to a `staging` branch

## Roles

- `admin` — manage operators, view full audit log, view all data. **1–2 people maximum.**
- `operator` — issue codes, view permit data, view own audit log entries. Committee members, ~5–10 people.
- `member` — view own approved code for current week only. General membership, low hundreds of users.

## Data model (sketch)

- `hunters`: id, name, contact_email, contact_phone, member_status, created_at, updated_at
- `permits`: id, hunter_id, doc_permit_number, block_id, valid_from, valid_to, source_spreadsheet_id, ingested_at
- `blocks`: id, name, description, forestry_company
- `gate_codes`: id, block_id, code (HASHED), valid_from (Mon noon), valid_to (next Mon noon), notes
- `allocations`: id, permit_id, gate_code_id, allocated_by_user_id, allocated_at, disclosed_at_first, disclosure_method
- `audit_log`: id, actor_user_id, actor_ip, actor_user_agent, action, resource_type, resource_id, payload_summary, occurred_at

## Self-audit findings (already identified)

The following risks have been identified but the audit should test whether the proposed mitigations are sufficient and find additional risks I haven't seen.

### 1. Gate codes are access credentials, not just PII

They grant physical access to forestry land. A leaked code allows trespass. Weekly rotation at noon Monday caps a leak's useful life at <7 days, with a hard reset every Monday — meaningful but not zero. Consider:
- Should codes be hashed at rest with reveal-on-click + audit log entry?
- Can the forestry company emergency-rotate mid-week if a leak is detected?
- Member-facing view of "my code" — does this expand the attack surface vs. operators emailing codes manually?

### 2. DNSSEC end-to-end

Depends on the .nz registrar supporting DS record entry for delegated DNSSEC. 1stDomains support unverified.

### 3. Personal liability of the developer

Volunteer status is informal. A signed one-page volunteer agreement (club owns the system; developer is implementer under direction; no warranty of fitness; etc.) needed before launch.

### 4. Bus factor

Single admin on Cloudflare + Vercel + Supabase = club loses access if developer leaves. Two-admin minimum on each before launch.

### 5. Audit log immutability

"Append-only" needs explicit RLS policies (INSERT only, no UPDATE / DELETE even for service role) or DB triggers blocking modification. Postgres doesn't enforce append-only natively.

### 6. No staging environment in current plan

Building changes against the production database with real PII is bad practice. Add a staging Supabase project with synthetic data.

### 7. Vercel hobby tier TOS

Non-commercial-use clause vs. incorporated society with member fees. Likely needs Vercel Pro at ~$20/user/month for Phase 2.

### 8. Magic-link / email-based auth

Inherits security of recipient's email account. TOTP second factor mandatory for operators and admins.

### 9. Backup encryption key location

If keys live in same env that holds DB credentials, single account compromise loses both. Separate vault required.

### 10. Incident response runbook

Not yet drafted. Needs to cover: code leak, PII leak, account compromise, Supabase outage, Vercel outage, accidental data deletion.

### 11. Documentation for operators

Non-technical committee members need a written runbook: how to log in, how to upload a spreadsheet, how to allocate a code, how to deactivate a member, what to do if something looks wrong.

## What to specifically look for

- Holes in the gate-code threat model given weekly rotation — does it actually mitigate the credential-leak risk to acceptable levels?
- Privacy Act 2020 compliance gaps under Option 1 (no DOC MoU) posture
- Row-Level Security policy weaknesses for the role model — can a member ever see another member's code? Can an operator escalate to admin? Can the service role be misused?
- Audit log evasion vectors — service-role key abuse, direct DB access, log tampering
- Spreadsheet ingestion risks — XSS via cell content, CSV formula injection (=cmd|...), file size DoS, encoding attacks
- Authentication weaknesses — credential stuffing, session fixation, magic link interception, TOTP bypass
- Operational risks of single-developer maintenance — unavailable, sick, leaves the project, dies
- Backup + restore failure modes — has the restore actually been tested? Can it be restored to a different region?
- Incident response gaps — who pays whom, who notifies the Privacy Commissioner, who tells affected hunters
- DOC-specific: what happens if DOC changes the spreadsheet schema? What if they stop sending it? What if they send a malformed one?
- Forestry company dependency — what if their gate code rotation system fails? What if they change the rotation schedule? What if the company goes bust?
- Member-side risks — phishing for member logins to leak codes, social engineering against committee operators
- Anything I haven't thought of
