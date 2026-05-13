---
role: auditor
round: 1
status: OPEN_ISSUES
issues:
  - ref: "A001"
    severity: major
    proposed_status: open
    claim: "Non-negotiable says all user actions logged, but T-APP-05 only enforces audit calls for mutating routes and reveals. Operator reads of permits, hunter PII, allocation views, exports, login/MFA events, role changes, and failed authorization attempts are not covered."
    required_change: "Expand audit scope and pass criteria to cover read/access events and security events with actor, timestamp, IP, resource, action, and outcome."
    concrete_alternative: "Replace T-APP-05 with an audit middleware/server wrapper for all authenticated handlers plus explicit DB audit triggers for sensitive table SELECT-equivalent RPCs; add tests for permit view, hunter view, export, login, failed authz, role grant/revoke, and reveal."
  - ref: "A002"
    severity: major
    proposed_status: open
    claim: "Gate-code plaintext handling is underspecified. T-DB-05 says plaintext never stored, but does not say where decryption happens, how plaintext is prevented from appearing in Vercel logs, Edge Function logs, browser telemetry, error traces, or cache."
    required_change: "Define a reveal-only decryption boundary and explicit no-log/no-cache controls for plaintext gate codes."
    concrete_alternative: "Implement reveal as a Supabase Edge Function/RPC that decrypts only for the authorized allocation, returns `Cache-Control: no-store`, disables request/response logging for the code field, redacts errors, and has tests that grep Vercel/Supabase logs for revealed test codes after E2E runs."
  - ref: "A003"
    severity: major
    proposed_status: open
    claim: "Audit immutability claim is stronger than the design. Revoking UPDATE/DELETE from PUBLIC/authenticated/service_role and a trigger does not stop table owner, postgres/supabase_admin, migration role, or compromised dashboard access from modifying audit rows."
    required_change: "State the actual immutability boundary and add external append-only evidence before launch."
    concrete_alternative: "Keep DB insert-only controls, but require per-row hash chain plus daily signed checkpoint exported to an immutable/versioned R2 object with retention lock and emailed to chair; pass criteria must include tamper by privileged DB role is detected by external checkpoint mismatch."
  - ref: "A004"
    severity: major
    proposed_status: open
    claim: "R2 backups, raw spreadsheet storage, hash-chain exports, and fallback CSVs introduce additional PII/code stores, but the plan does not specify R2 access policy, encryption ownership, lifecycle deletion, access logging, or two-admin controls per bucket."
    required_change: "Add R2 bucket security and retention controls to the build plan and checklist."
    concrete_alternative: "Create T-OPS-06 for R2: separate private buckets for raw uploads/backups/exports, public access disabled, object lifecycle matching retention schedule, bucket access logs reviewed monthly, scoped API tokens, retention lock for audit checkpoints, and restore/export deletion tests."
  - ref: "A005"
    severity: major
    proposed_status: open
    claim: "Manual outage fallback allows chair to email current gate codes from cached CSV. That directly conflicts with 'gate codes never logged in plaintext outside the audit trail' unless the CSV is encrypted, access-controlled, and later audited."
    required_change: "Redesign fallback so it preserves auditability and plaintext controls."
    concrete_alternative: "Replace daily plaintext CSV with encrypted break-glass export stored in R2, decryptable only by chair plus one admin, with every manual disclosure recorded on a signed paper/offline log and backfilled into audit_log within 24h; add pass criteria for fallback drill."
  - ref: "A006"
    severity: minor
    proposed_status: open
    claim: "Budget constraint is zero to twenty NZD/month, but the plan depends on Vercel Pro, possible Fastmail/Google Workspace, 1Password, Upstash, R2, and optional scanner/tools without a cost gate. Vercel Pro alone can exceed the stated recurring budget."
    required_change: "Add a costed launch bill of materials and mark any over-budget service as donated, existing, or explicitly approved."
    concrete_alternative: "Add T-GOV-01 `docs/ops/COST_MODEL.md` with monthly NZD costs, owner, free-tier limits, overage alerts, and a launch blocker that recurring paid services are <= NZD 20 unless the committee signs an exception."
---

No drift: Round 1 is materially identical to Round 0.

The plan is strong, but not executable as written against its own non-negotiables. The biggest failures are audit coverage, plaintext gate-code handling, and pretending DB-local audit controls equal immutability.