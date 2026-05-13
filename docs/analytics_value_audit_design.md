# Analytics Value Audit — Design

## Purpose

Periodically (every 1–3 months) evaluate whether each tracked event is actually informing decisions, or just adding noise. Drop events that aren't earning their keep; add events for questions the data raised but couldn't answer.

The build now adds analytics broadly. This document defines the scripts that will tell us, at a later date, which parts of that build were worth it.

## What "value" means here

For each tracked event, three signals indicate value:

1. **Volume** — does it actually fire? Zero fires for 30 days = dead event. Either the trigger is broken (silent drift) or the action genuinely never happens.
2. **Distribution** — does it fire across many sessions / days / referrers, or is it concentrated in noise (one bot, one day, one IP)?
3. **Decision linkage** — has anyone (you, committee) looked at this metric and used it to inform a decision? (Subjective; tracked in a manual annotation file.)

A useful event scores well on all three. A noise event scores high on volume but low on decision linkage. A dead event scores zero on volume.

## Script architecture

Two scripts, plus a config file.

### `scripts/analytics_audit_config.yaml`

Single source of truth for what we're tracking. Each entry:

```yaml
events:
  - name: cta_join_click
    description: User clicked the Join CTA (outbound to NZDA membership form)
    expected_min_per_month: 5
    answers_question: "Of visitors landing on /join, how many take the conversion step?"
    decision_used_for: "Whether to invest more in driving Join page traffic"
    added_date: 2026-05-13
    last_reviewed_date: null
    notes: ""
  - name: contact_form_submit
    description: Contact form submitted
    expected_min_per_month: 1
    answers_question: "Direct lead measure"
    decision_used_for: "Whether contact form is working; lead volume"
    added_date: 2026-05-13
    last_reviewed_date: null
    notes: ""
  # ... etc for all 11 events
```

Keeping the **answers_question** and **decision_used_for** fields populated forces honest review: if the answer is "we never look at this", the event is a candidate for removal.

### `scripts/analytics_value_audit.ts`

Run command: `npm run audit:analytics -- --since 30d`

Behaviour:

1. Read `analytics_audit_config.yaml` for the canonical event list.
2. For each event, query the Vercel Analytics API for fire counts over the window.
   - Endpoint: `GET https://vercel.com/api/v1/analytics/events?projectId=<id>&since=<ts>&until=<ts>`
   - Auth: Vercel API token from `VERCEL_TOKEN` env var (read-only scope, project-restricted)
   - Per event: total count, unique session count, days active in window, top-3 referrers
3. Optionally cross-check against GA4 via the GA4 Data API (more reliable if both sources installed).
4. Optionally cross-check against Cloudflare Web Analytics GraphQL API.
5. Classify each event:
   - **Useful** — fires >= `expected_min_per_month`, distributed across multiple days and referrers, has a populated `decision_used_for`
   - **Low-signal** — fires but below expectation, OR concentrated in one day/referrer/IP
   - **Dead** — zero fires in the window (broken trigger? action genuinely doesn't happen?)
   - **Noisy** — fires far above expectation, suspect bot traffic or trigger over-broad
   - **Unreviewed** — fires but `decision_used_for` is "?" or `last_reviewed_date` is null — flag for human attention
6. Output a markdown report to `docs/analytics_value_audit_<date>.md`:
   ```
   # Analytics value audit — 2026-08-13
   
   ## Useful (keep)
   - cta_join_click — 47 fires / 38 sessions / 14 days active / top referrer: facebook.com
   
   ## Low-signal (consider removing or adjusting)
   - scroll_75_pct_join_page — 4 fires / 4 sessions — likely no one reading deeply
   
   ## Dead (investigate or remove)
   - newsletter_edition_open — 0 fires — TRIGGER BROKEN? or no newsletters published in window?
   
   ## Noisy (investigate)
   - none this window
   
   ## Unreviewed
   - hunts_course_click — 8 fires but decision_used_for not set
   ```
7. Update `analytics_audit_config.yaml` with `last_reviewed_date` for every event seen.

### `scripts/analytics_value_review.ts`

Run command: `npm run review:analytics`

Interactive CLI that walks through each event flagged in the most recent audit report and asks:

- "Should we keep this event?" [y/n]
- "Did you use this metric to make any decision in the last review window?" [y/n]
- "Notes:" (optional free text)

Writes answers back into the config file. The trail of `decision_used_for` answers becomes evidence of whether the tracking is actually being used.

If three consecutive reviews show `decision_used_for=no`, the event is a strong candidate for removal regardless of fire volume — answering a question nobody asks is waste.

## Implementation cost

- `analytics_audit_config.yaml` — written once with the 11 events, takes ~10 min
- `analytics_value_audit.ts` — ~2 hours to write and test once Vercel API token is available
- `analytics_value_review.ts` — ~1 hour, mostly CLI prompting boilerplate

Build later, after analytics have been running for a few weeks. No point auditing zero-data.

## What the scripts deliberately do not do

- Do not auto-delete events. Removal is always a human decision because deletion of tracking is also a loss of historical comparison.
- Do not score events on dashboard usage by you/committee. That's too noisy to measure automatically.
- Do not push to a dashboard or alerting system. The audit is a periodic written reflection, not a real-time monitor.

## Trigger schedule

- **First audit:** 30 days after analytics goes live
- **Cadence after that:** quarterly, calendar-blocked
- **Exception:** any time a tracked event reports zero fires across a 7-day window, run an ad-hoc audit to check for silent drift

## Drift-check shortcut

In addition to the full audit, a lightweight `scripts/analytics_drift_check.ts` cron job (GitHub Action, daily) compares the last 7 days of event counts to the trailing 30-day baseline. If any tracked event drops to zero or near-zero, opens a GitHub issue. This catches silent trigger breakage between full audits.

## Files this generates over time

- `scripts/analytics_audit_config.yaml` — single source of truth
- `docs/analytics_value_audit_<date>.md` — historical reports, one per quarter
- `docs/analytics_drift_alerts.log` — append-only log of drift alerts fired

---

**Status:** designed. Build deferred until analytics has 30+ days of data.
