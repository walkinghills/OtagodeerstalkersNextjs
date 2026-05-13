---
role: builder
round: 0
status: REVISED_PLAN
proposed_resolutions:
  - ref: "Self-audit #1 — Gate codes as credentials"
    proposed_status: addressed
    action: "Codes stored as bcrypt hash + AES-GCM ciphertext (envelope-encrypted, KEK in Supabase Vault); reveal-on-click endpoint emits dedicated audit row; rate-limited to 3 reveals/hour per member; emergency-rotate runbook with forestry phone contact documented; member self-serve view kept (reduces email-based leakage which is worse than authenticated reveal)."
  - ref: "Self-audit #2 — DNSSEC"
    proposed_status: addressed
    action: "Pre-launch task: verify 1stDomains DS record support; if unsupported, transfer to a registrar that does (Internet NZ-accredited list). Treat DNSSEC as a launch-gate, not a nice-to-have."
  - ref: "Self-audit #3 — Personal liability"
    proposed_status: addressed
    action: "One-page volunteer agreement drafted (template in Build Plan T-LEGAL-01); chair signs before any production data is loaded; renewed annually."
  - ref: "Self-audit #4 — Bus factor"
    proposed_status: addressed
    action: "Two-admin minimum enforced on Cloudflare, Vercel, Supabase, 1Password, R2, registrar, and the GitHub org. Break-glass credentials in club-owned 1Password vault held by chair + secretary. Documented in T-OPS-02."
  - ref: "Self-audit #5 — Audit log immutability"
    proposed_status: addressed
    action: "Audit log enforced at three layers: (a) RLS INSERT-only for app role, (b) REVOKE UPDATE/DELETE/TRUNCATE from all roles incl. service_role, (c) BEFORE UPDATE/DELETE trigger raising exception, (d) daily SHA-256 hash-chain export to R2 for tamper-evidence."
  - ref: "Self-audit #6 — Staging"
    proposed_status: addressed
    action: "Separate Supabase project `nzda-otago-staging` with synthetic faker-generated data; Vercel preview deploys wired to `staging` branch; production DB never accessed from local dev."
  - ref: "Self-audit #7 — Vercel TOS"
    proposed_status: addressed
    action: "Vercel Pro at launch (USD 20/seat). Confirmed within budget at single seat. Hobby preview only used for Phase 1 brochure site (no auth, no PII)."
  - ref: "Self-audit #8 — Magic links"
    proposed_status: addressed
    action: "TOTP mandatory for admin + operator. Magic links disabled for those roles via Supabase Auth hook; password + TOTP only. Members may use magic links (lower blast radius — single code visible)."
  - ref: "Self-audit #9 — Backup encryption key"
    proposed_status: addressed
    action: "R2 backup encryption key in 1Password club vault, NOT in Vercel/Supabase env. Restore procedure requires chair + developer co-presence (split knowledge: chair holds vault password, developer holds R2 access key)."
  - ref: "Self-audit #10 — IR runbook"
    proposed_status: addressed
    action: "T-OPS-04 produces `RUNBOOK_INCIDENT.md` covering: code leak, PII leak, account compromise, Supabase outage, Vercel outage, accidental deletion, OPC notification path, hunter notification path."
  - ref: "Self-audit #11 — Operator docs"
    proposed_status: addressed
    action: "T-DOC-01 produces `RUNBOOK_OPERATOR.md` with screenshots; T-DOC-02 produces 10-min Loom walkthrough."
new_decisions:
  - id: D_TEMP_1
    decision: "Use Supabase Vault for the gate-code KEK; per-row DEKs envelope-encrypted; never store plaintext codes."
    rationale: "Hash-only loses reveal-to-member capability. Envelope encryption gives reveal + key-rotation + audit hooks without rolling our own crypto."
  - id: D_TEMP_2
    decision: "Spreadsheet ingestion runs in a sandboxed serverless function with hard 2 MB / 5000-row caps; cells parsed as strings; any cell starting with =, +, -, @, tab, or CR is prefixed with a single quote before storage and rejected from any future export."
    rationale: "Eliminates CSV formula injection both inbound and outbound; caps DoS surface."
  - id: D_TEMP_3
    decision: "RLS deny-by-default. Every table has explicit policies per role. Service role NEVER used from the Next.js runtime — only from a separate, auditable Supabase Edge Function for ingestion + admin tasks."
    rationale: "Service role bypasses RLS. Keeping it out of the web tier eliminates the largest audit-log evasion vector."
  - id: D_TEMP_4
    decision: "All operator/admin sessions require WebAuthn-or-TOTP; sessions max 8 hours; idle timeout 30 minutes; IP-pinned for admin role."
    rationale: "Cuts session fixation, stolen-cookie, and unattended-laptop risks for the highest-privilege accounts."
  - id: D_TEMP_5
    decision: "DOC spreadsheet schema validated against a Zod schema at upload; mismatch blocks ingest and emails developer + chair. No silent fallback."
    rationale: "DOC schema drift would otherwise corrupt the permits table or fail open."
  - id: D_TEMP_6
    decision: "Privacy Act compliance artifacts produced before launch: Privacy Statement, Privacy Impact Assessment (lightweight), Data Inventory, Retention Schedule, Breach Response Plan, Subject Access Request procedure."
    rationale: "OPC expects evidence the agency considered IPPs 1–13. Drafting after a complaint is too late."
  - id: D_TEMP_7
    decision: "Hard data retention: hunter PII purged 24 months after last permit valid_to; audit log retained 7 years (immutable) then archived to cold storage; gate_codes purged 90 days after valid_to."
    rationale: "IPP 9 (don't keep longer than necessary) vs. legitimate audit/legal retention need."
open_questions: []

---

### Scope

Build a launch-ready architecture and ops plan for Phase 2 of the NZDA Otago Branch system: authenticated, audit-logged, multi-operator gate-code allocation handling DOC permit data and member PII. Stack is fixed (Next.js 15 / Vercel Pro syd1 / Supabase ap-southeast-2 / Cloudflare DNS). Plan must survive external security review and a Privacy Act 2020 complaint without negligent-design findings, while remaining maintainable by one volunteer.

### Open Decisions

This is round 0 — no auditor issues yet. Self-audit findings are addressed in `proposed_resolutions` above and expanded in Build Plan tasks below.

### Steelman Risks

**R1 — Service role key exfiltration bypasses every RLS policy.** Vercel env-var leak, compromised dev laptop, or accidental commit puts the entire DB at root. *Mitigation:* service role used only from Supabase Edge Functions (never Next.js runtime); rotate quarterly; commit-scanning hook (gitleaks) on pre-commit and CI; Vercel env vars scoped per-environment; alert on any service-role auth event from an unexpected IP.

**R2 — Insider operator deliberately leaks codes.** Committee turnover, disgruntled volunteer, social engineering. Audit log shows it, but only after the fact. *Mitigation:* reveal-on-click rate-limited (3/hour, 20/day per operator); anomaly alerts on bulk reveals; quarterly access review by chair; off-boarding runbook with same-day deactivation; monthly digest emailed to chair listing top-10 reveal counts per operator.

**R3 — Audit log dependency on the same DB it audits.** If an attacker reaches the DB, they reach the log. *Mitigation:* daily SHA-256 hash-chain (each row hashes prev row's hash); chain head exported to R2 + emailed to chair; tamper detectable even if attacker has full DB write. Logical replication of audit_log to a read-only Supabase project as belt-and-braces.

**R4 — Vercel or Supabase outage during permit week.** Hunters can't see codes; president falls back to email; no audit trail of those emails. *Mitigation:* IR runbook includes "manual fallback" procedure that requires logging the manual disclosure into the system within 24h of restoration; status page subscriptions for both providers; pre-built CSV export of "current week allocations" cached daily so chair can email codes if app is down.

**R5 — Forestry company changes rotation schedule, goes bust, or sends codes through a new channel.** Whole product breaks. *Mitigation:* `gate_codes.valid_from`/`valid_to` schema-driven, not Monday-noon-hardcoded; admin UI to edit rotation cadence; contract/contact-of-record documented in T-OPS-05; quarterly contact-confirmation email to forestry liaison.

**R6 — Member account takeover via password reuse + no MFA on member tier.** Attacker logs in as member, sees one code. *Mitigation:* member tier sees own code only (blast radius = 1 hunter for 7 days max); password breach check via HIBP Pwned Passwords k-anon API at signup + reset; rate-limit failed logins; offer optional TOTP for members; suspicious-IP email alert.

**R7 — Spreadsheet ingestion as attack surface.** Malicious DOC mailbox compromise → poisoned spreadsheet → CSV formula injection in chair's local Excel; or oversized file DoS. *Mitigation:* D_TEMP_2 (cell sanitization, size caps, string-only parse); ingestion in isolated Edge Function; uploads go to a private R2 bucket first, scanned, then parsed; SHA-256 of raw upload stored in `permits.source_spreadsheet_id` for forensic chain.

**R8 — Privacy Act breach with no documented compliance posture.** Complaint to OPC → "did you do a PIA? retention schedule? breach plan?" → "no" → negligent-design finding sticks to the club AND personally to the developer if no volunteer agreement separates them. *Mitigation:* D_TEMP_6 artifacts produced and signed off by chair before launch; volunteer agreement (T-LEGAL-01) signed first.

**R9 — Single developer hit-by-bus.** Club loses code, deployment access, and tribal knowledge in one go. *Mitigation:* two-admin minimum (T-OPS-02); break-glass docs in club 1Password; quarterly "can the chair deploy a one-line fix with the runbook" drill; code in club-owned GitHub org, not personal account.

**R10 — DOC informal arrangement collapses.** DOC employee changes, new person asks "why are you holding our spreadsheet on Australian servers?" *Mitigation:* one-page Data Handling Note from chair to DOC describing what's stored, where (AU), retention, and that DOC retains the master record; sent unilaterally as "for your information," kept on file. Cheaper than an MoU, demonstrates good faith.

**R11 — DNSSEC unverified at registrar.** No DNSSEC = DNS hijack possible = phishing site at the same name. *Mitigation:* T-OPS-01 verifies 1stDomains DS support before launch; if unsupported, transfer registrar (Freeparking or GoDaddy NZ both confirmed to support DS records as of 2025) — treat as launch-blocker.

**R12 — Backup tested only on paper.** Restore-from-R2 has never actually been performed. *Mitigation:* T-OPS-03 includes a documented restore drill into staging with a written pass/fail; repeated quarterly.

**R13 — Phishing page at `app-otagodeerstalkers.org.nz` (hyphen, not dot) harvests operator creds.** *Mitigation:* DMARC p=reject + SPF + DKIM on the apex; member education one-pager; WebAuthn for admin role makes phishing keystroke-capture useless; CSP frame-ancestors none.

**R14 — Cloudflare/Vercel/Supabase account compromise via developer's personal email.** Whole stack falls. *Mitigation:* club-owned email aliases (`admin@otagodeerstalkers.org.nz`) used as the account email; hardware-key MFA on those aliases; developer's personal email never the primary.

### Build Plan

Tasks ordered by dependency. Format: `id | files | change | tests`.

**Legal + governance (must complete before any prod code):**

- T-LEGAL-01 | `docs/legal/VOLUNTEER_AGREEMENT.md` | One-page agreement: club owns system; developer is volunteer implementer; no warranty; club indemnifies developer for good-faith acts; either party may end with 30 days notice; IP assigned to club. | Chair signature on file before T-INFRA-01.
- T-LEGAL-02 | `docs/legal/DOC_DATA_HANDLING_NOTE.md` | Unilateral note to DOC liaison: what we store, where, retention, deletion on request. | Sent + acknowledgment logged.
- T-PRIV-01 | `docs/privacy/PRIVACY_STATEMENT.md`, `PIA.md`, `DATA_INVENTORY.md`, `RETENTION_SCHEDULE.md`, `BREACH_RESPONSE_PLAN.md`, `SAR_PROCEDURE.md` | Privacy Act 2020 IPP 1–13 walkthrough + the artifacts an OPC investigator asks for. | Chair sign-off; reviewed by one external (paid hour with a privacy-aware lawyer if budget permits, otherwise community-law clinic).

**Infrastructure (account level):**

- T-INFRA-01 | n/a | Provision club-owned domain email aliases on Google Workspace nonprofit or Fastmail; `admin@`, `secretary@`, `chair@` as account-of-record. | All three deliverable; MFA enforced.
- T-INFRA-02 | n/a | Create club-owned GitHub org; transfer repo; two owners (chair + dev). | Org exists; repo transferred; both have access.
- T-OPS-01 | `docs/ops/DNS.md` | Verify 1stDomains DS support; transfer if needed; enable DNSSEC; configure SPF/DKIM/DMARC p=reject; CAA records. | `dig +dnssec` shows AD flag; mxtoolbox green.
- T-OPS-02 | `docs/ops/ACCESS_MATRIX.md` | Two-admin minimum on Vercel, Supabase, Cloudflare, R2, 1Password, GitHub org, registrar. Break-glass creds in club 1Password vault. | Screenshot evidence per provider; quarterly review calendar entry.

**Database + RLS (Supabase):**

- T-DB-01 | `supabase/migrations/0001_schema.sql` | Schema per plan: `hunters`, `permits`, `blocks`, `gate_codes`, `allocations`, `audit_log`, `users` (linked to auth.users), `user_roles`. Generated columns + check constraints. | `pg_dump --schema-only` matches; constraint tests pass.
- T-DB-02 | `supabase/migrations/0002_rls.sql` | Deny-by-default RLS. Policies: members SELECT only their allocations for current week; operators SELECT/INSERT allocations + SELECT permits/hunters; admins SELECT all + manage user_roles. Service role used ONLY from Edge Functions. | pgTAP tests for each role: positive + negative; prove member cannot read another member's row.
- T-DB-03 | `supabase/migrations/0003_audit_immutability.sql` | `REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM PUBLIC, authenticated, service_role`. BEFORE UPDATE/DELETE trigger raises exception. INSERT-only RLS for app role. | Test: service role attempting UPDATE fails; INSERT succeeds; SELECT for admin only.
- T-DB-04 | `supabase/migrations/0004_audit_hashchain.sql` | `audit_log.row_hash` = sha256(prev_hash || row_payload), filled by trigger. | Tampering with any row breaks the chain; verifier script catches it.
- T-DB-05 | `supabase/migrations/0005_gate_code_crypto.sql` | `gate_codes.code_ciphertext bytea`, `code_hash bytea`, `dek_wrapped bytea`. Use `pgsodium` or Supabase Vault for KEK. | Reveal function logs to audit_log; rate-limit enforced; plaintext never stored.
- T-DB-06 | `supabase/migrations/0006_retention.sql` | Scheduled `pg_cron` job: purge hunters with no permit valid_to within 24 months; purge gate_codes 90 days after valid_to; archive audit_log >7y to cold table. | Dry-run output; first run logged.

**Application:**

- T-APP-01 | `apps/members/src/middleware.ts`, `lib/auth.ts` | Supabase SSR auth with role-aware middleware; magic link disabled for admin/operator; TOTP enforced via Supabase MFA; session 8h max + 30m idle; admin IP-pinned. | Playwright tests for each role's allowed/denied routes.
- T-APP-02 | `apps/members/src/app/(member)/code/page.tsx` | Member view: own current-week code, reveal-on-click, rate-limit 3/hr per member, every reveal logged with actor + IP + UA. | E2E test: reveal generates audit row; 4th reveal in hour blocked.
- T-APP-03 | `apps/members/src/app/(operator)/allocate/*` | Operator UI: view permits, allocate code to permit, view own audit trail. | Playwright happy-path + RLS-violation attempts.
- T-APP-04 | `supabase/functions/ingest-spreadsheet/index.ts` | Edge Function: accepts `.xlsx`/`.csv` ≤2MB ≤5000 rows; raw stored in private R2; SHA-256 recorded; cells parsed as strings; formula-prefix sanitized (D_TEMP_2); Zod schema validation; on schema drift, alert + reject. | Unit tests for: oversized, malformed, formula-injection, encoding (UTF-8 BOM, UTF-16), schema-drift cases.
- T-APP-05 | `apps/members/src/app/api/_audit.ts` | Centralized audit emitter — every mutating route + every reveal calls it. Lint rule (custom ESLint) blocks merging if a route handler doesn't call it. | CI fails if audit call missing.
- T-APP-06 | `apps/members/next.config.js`, `middleware.ts` | Strict CSP (no inline, nonce-based), HSTS preload, frame-ancestors none, Referrer-Policy strict-origin, Permissions-Policy minimal. | securityheaders.com A+ before launch.
- T-APP-07 | `apps/members/src/lib/ratelimit.ts` | Upstash Redis rate-limit (free tier <10k req/day fits): login 5/15min, password reset 3/hr, reveal 3/hr, ingest 10/day. | Integration tests; metrics surfaced in admin dashboard.

**Backups + DR:**

- T-OPS-03 | `docs/ops/BACKUP_RESTORE.md`, `scripts/backup.ts`, `scripts/restore_drill.ts` | Daily pg_dump → AES-GCM encrypted with R2 KEK from 1Password → R2 bucket (versioned, immutable retention 30d). Monthly long-term copy. Quarterly restore drill into staging with documented pass/fail. | First drill passes before launch; calendar entry repeats quarterly.
- T-OPS-04 | `docs/ops/RUNBOOK_INCIDENT.md` | IR playbook: gate-code leak, PII breach, account compromise, Supabase/Vercel outage, accidental deletion, ransomware. Includes OPC notification template (mandatory if "serious harm" likely under Privacy Act 2020 Pt 6). | Tabletop exercise with chair before launch.
- T-OPS-05 | `docs/ops/THIRD_PARTY_DEPENDENCIES.md` | Forestry liaison contact, DOC liaison contact, registrar account, all SaaS account-of-record. Reviewed quarterly. | First review complete.

**Documentation + handover:**

- T-DOC-01 | `docs/RUNBOOK_OPERATOR.md` | Step-by-step with screenshots: login, MFA setup, upload spreadsheet, allocate code, deactivate member, what-if-something-looks-wrong. | Reviewed by one non-technical committee member; corrections applied.
- T-DOC-02 | n/a | 10-minute Loom walkthrough hosted on club YouTube unlisted. | Link in operator runbook.
- T-DOC-03 | `docs/ARCHITECTURE.md` | Stranger-readable architecture doc: diagrams, data flow, threat model, RLS map, links to all runbooks. | Cold-read review by AI peer or external dev.
- T-DOC-04 | `docs/RUNBOOK_ADMIN.md` | How to: rotate keys, add/remove operator, run restore drill, respond to SAR, respond to deletion request, generate OPC report. | Chair walks through it once.

**Pre-launch verification:**

- T-VERIFY-01 | n/a | External-eye review: pay one hour of a security-aware contractor or run through `pentest-tools.com` web vulnerability scanner free tier on staging; address findings. | Findings doc in `docs/security/EXTERNAL_REVIEW.md`.
- T-VERIFY-02 | `docs/security/PRELAUNCH_CHECKLIST.md` | Single checklist that gates production go-live; chair signs. | All boxes ticked, dated, signed.

### Pass Criteria

Each item must be independently verifiable.

1. `dig otagodeerstalkers.org.nz +dnssec` returns AD flag set.
2. `mxtoolbox` shows SPF, DKIM, DMARC p=reject, CAA configured.
3. Vercel project on Pro tier; one Pro seat charged.
4. Two human accounts have admin on each of: Vercel, Supabase, Cloudflare, R2, 1Password, GitHub org, registrar (screenshots in `docs/ops/ACCESS_MATRIX.md`).
5. `supabase test db` (pgTAP) passes 100% including: member cannot SELECT another member's allocation; operator cannot SELECT user_roles; UPDATE on audit_log fails for service_role.
6. Audit hash-chain verifier script run on production exits 0; tampering test exits non-zero.
7. Gate-code reveal endpoint logs an audit row visible only to admin; rate-limit blocks 4th call within an hour with HTTP 429.
8. Spreadsheet ingestion rejects: 3 MB file (size), 6000-row file (rows), `=cmd|...` cell (formula), wrong schema (Zod), malformed CSV (parse error), UTF-16 bomb (encoding). All six produce alerts and zero DB writes.
9. Magic-link login disabled for admin/operator (verified by attempting via Supabase Auth → returns role-not-permitted).
10. TOTP setup forced on first admin/operator login (Playwright).
11. CSP nonce-based; `securityheaders.com` returns A+ on staging URL.
12. Restore drill: pg_dump from R2 restored into staging in <60 minutes with documented diff = 0 rows.
13. Volunteer agreement countersigned by chair; PDF in `docs/legal/`.
14. Privacy Statement, PIA, Data Inventory, Retention Schedule, Breach Plan, SAR Procedure all chair-signed.
15. DOC Data Handling Note sent to DOC liaison; receipt logged.
16. Operator runbook reviewed by one non-technical committee member; corrections applied.
17. Loom walkthrough recorded; link embedded.
18. External review evidence file present with at least one third-party set of eyes (paid hour or scanner output) and remediation log.
19. Pre-launch checklist (T-VERIFY-02) ticked + chair signature.
20. `audit_log` retention `pg_cron` job scheduled and dry-run logged.

### Not Claimed / Deferred

- DOC API integration (no API exists; manual upload only).
- Forestry company API integration (out of scope; manual code entry by admin).
- Member self-service signup (chair-approved invite-only at launch; reduces account-spam blast radius).
- Mobile app (web responsive only).
- SSO with NZDA national body (no infrastructure exists upstream).
- Hardware-key (WebAuthn) for member tier (optional TOTP only; revisit if member tier ever sees more than one code).
- Real-time alerting platform (Sentry free tier deferred until launch +30 days unless budget allows now).
- Formal MoU with DOC (explicitly out of scope per Constraints; replaced by unilateral Data Handling Note T-LEGAL-02).
- ISO 27001 / SOC 2 (disproportionate for a volunteer-run club).
- Multi-region failover (cost-prohibitive; single-region syd1 with R2 cross-region backup is acceptable).
- Penetration test by accredited firm at launch (deferred to post-launch year-1 if club budget grows; T-VERIFY-01 is the launch-tier substitute).