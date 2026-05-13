import { track } from '@vercel/analytics'

export type TrackedEvent =
  | 'cta_join_click'
  | 'contact_form_submit'
  | 'newsletter_edition_open'
  | 'outbound_facebook_group_click'
  | 'outbound_facebook_range_click'
  | 'outbound_nzda_national_click'
  | 'lodge_info_click'
  | 'range_info_click'
  | 'hunts_course_click'
  | 'engaged_visitor'
  | 'scroll_75_pct_join_page'

export function trackEvent(name: TrackedEvent, props?: Record<string, string | number | boolean | null>) {
  try {
    track(name, props)
  } catch {
    // analytics errors must never break the UI
  }
}
