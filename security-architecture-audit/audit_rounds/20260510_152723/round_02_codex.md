---
role: auditor
round: 2
status: OPEN_ISSUES
issues:
  - ref: "A001"
    severity: major
    proposed_status: resolved
    claim: "Audit coverage expanded beyond mutating routes to authenticated requests, sensitive-read RPCs, auth/MFA/security events, and role changes."
    required_change: ""
    concrete_alternative: ""
  - ref: "A002"
    severity: major
    proposed_status: resolved
    claim: "Reveal boundary, no-cache/no-log controls, redaction, and log-grep verification are now specified."
    required_change: ""
    concrete_alternative: ""
  - ref: "A003"
    severity: major
    proposed_status: resolved
    claim: "Plan now states the real boundary: DB controls are not superuser-proof; external signed R2 checkpoints provide tamper evidence."
    required_change: ""
    concrete_alternative: ""
  - ref: "A004"
    severity: major
    proposed_status: resolved
    claim: "R2 buckets, lifecycle, Object Lock, token scope, access review, and verification criteria are now specified."
    required_change: ""
    concrete_alternative: ""
  - ref: "A005"
    severity: major
    proposed_status: resolved
    claim: "Plaintext fallback CSV was removed and replaced with encrypted break-glass export plus paper log and audit backfill."
    required_change: ""
    concrete_alternative: ""
  - ref: "A006"
    severity: minor
    proposed_status: resolved
    claim: "Cost model and explicit committee exception gate now address the NZD 20/month conflict."
    required_change: ""
    concrete_alternative: ""
  - ref: "A007-auth-event-source"
    severity: major
    proposed_status: open
    claim: "Plan claims login, MFA enrollment/challenge, and password reset events are audited, but Supabase Auth events do not automatically pass through Next.js middleware or DB RPCs. Without an explicit event source, pass criteria #21 and #23 are not implementable."
    required_change: "Specify the authoritative mechanism that captures Supabase Auth lifecycle events with actor, timestamp, IP, resource/action, and outcome."
    concrete_alternative: "Add T-AUTH-01: configure Supabase Auth hooks/webhooks or a dedicated auth callback Edge Function for login, logout, MFA enroll/challenge pass/fail, password reset requested/completed; insert audit rows server-side; add tests that trigger real Supabase Auth flows and assert audit_log rows."
  - ref: "A008-rls-denial-logging"
    severity: major
    proposed_status: open
    claim: "RLS denials surfaced via `pg_stat_statements` is not a valid audit design. `pg_stat_statements` aggregates query fingerprints and does not preserve actor, IP, resource instance, or per-event denial outcome."
    required_change: "Remove `pg_stat_statements` as an audit source for failed authorization and define an auditable denial path."
    concrete_alternative: "Force all app data access through RPCs that explicitly check authorization, write an audit row with `outcome=denied`, then raise; for route-level denial, middleware writes 401/403 rows. Add pgTAP tests for unauthorized RPC calls producing denial audit rows."
  - ref: "A009-edge-function-plaintext"
    severity: major
    proposed_status: open
    claim: "T-APP-08 says decryption happens in Supabase Edge Function, but A002 says plaintext must be absent from Supabase logs. Edge Function exceptions, console logging, and platform request logging can still expose returned plaintext unless logging is explicitly constrained at that boundary."
    required_change: "Define no-body logging and error discipline inside the Edge Function, not only in the Next.js proxy."
    concrete_alternative: "Move decrypt into a SECURITY DEFINER Postgres function returning only the code, or keep Edge Function but ban `console.*` in reveal code via lint/test, wrap errors before plaintext variables enter messages, and include Supabase Edge Function logs in T-VERIFY-03 grep."
  - ref: "A010-email-checkpoint-leakage"
    severity: minor
    proposed_status: open
    claim: "Daily checkpoint hash emailed to chair and secretary is useful evidence, but email delivery/account compromise is not covered. If the same compromised club email controls R2 and receives checkpoints, rollback detection evidence is weaker."
    required_change: "Separate checkpoint notification evidence from the infrastructure account recovery channel."
    concrete_alternative: "Send checkpoint digest to chair and secretary personal/club-independent addresses or print/store monthly digests in 1Password as signed PDFs; document this in T-OPS-07 and ACCESS_MATRIX."
---