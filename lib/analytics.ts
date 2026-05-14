/**
 * Legacy untyped analytics wrapper used by TrackedLink / TrackedNextLink.
 * Forwards to GA4 (canonical, per plan rev 3 D-VA) and to Vercel Analytics
 * (kept for parity with the existing pageview transport during transition).
 *
 * Prefer the typed builders in lib/analytics/track.ts for new code.
 */
import { track } from '@vercel/analytics'

export type TrackedEvent =
  | 'newsletter_edition_open'
  | 'outbound_facebook_group_click'
  | 'outbound_facebook_range_click'
  | 'outbound_nzda_national_click'
  | 'lodge_info_click'
  | 'range_info_click'
  | 'hunts_course_click'
  | 'engaged_visitor'
  | 'scroll_75_pct_join_page'

function isDebugEnv(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'
}

export function trackEvent(
  name: TrackedEvent,
  props?: Record<string, string | number | boolean | null>,
) {
  // GA4 (canonical custom-event transport)
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const payload: Record<string, unknown> = {
        ...(props ?? {}),
        transport_type: 'beacon',
      }
      if (isDebugEnv()) payload.debug_mode = true
      window.gtag('event', name, payload)
    }
  } catch {
    // never throw
  }

  // Vercel Analytics (legacy parity; safe to drop once the funnel work is verified)
  try {
    track(name, props)
  } catch {
    // never throw
  }
}
