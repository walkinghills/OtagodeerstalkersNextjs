/**
 * Analytics event API. GA4 only (per locked decision D-VA in plan rev 3).
 * Typed builders enforce a closed event schema (D-PII-BUILDERS / D-SCHEMA-UNION).
 *
 * Every emission goes through trackEvent which:
 *   - is a no-op if gtag is not yet on the window (ad blockers, T0 not loaded)
 *   - injects debug_mode only when NEXT_PUBLIC_VERCEL_ENV !== 'production'
 *   - uses transport_type: 'beacon' so events survive navigation unload
 *   - never throws
 */

type InternalJoinClick = {
  name: 'cta_join_internal_click'
  params: {
    current_page: string
    link_destination_class: 'internal_cta'
  }
}

type ExternalJoinClick = {
  name: 'cta_join_external_click'
  params: {
    join_source_page: string
    join_origin_method: 'sessionStorage' | 'referrer_fallback' | 'direct'
    link_destination_class: 'external_nzda'
  }
}

type NewsletterOpen = {
  name: 'newsletter_edition_open'
  params: {
    slug: string
    current_page: string
    source: 'title' | 'arrow'
  }
}

type OutboundNZDA = {
  name: 'outbound_nzda_national_click'
  params: {
    link: 'app_promo' | 'national_site' | 'membership_form'
    current_page: string
  }
}

type AnalyticsProbe = {
  name: '__analytics_probe'
  params: {
    probe_page: string
  }
}

export type AnalyticsEvent =
  | InternalJoinClick
  | ExternalJoinClick
  | NewsletterOpen
  | OutboundNZDA
  | AnalyticsProbe

type GtagCommand =
  | ['event', string, Record<string, unknown>]
  | ['config', string, Record<string, unknown>?]
  | ['set', Record<string, unknown>]
  | ['consent', string, Record<string, unknown>?]

type Gtag = (command: GtagCommand[0], ...args: GtagCommand extends [unknown, ...infer R] ? R : never) => void

declare global {
  interface Window {
    gtag?: Gtag
    dataLayer?: unknown[]
    __ga4ProbeOK?: boolean
  }
}

function isDebugEnv(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production'
}

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return

  const payload: Record<string, unknown> = {
    ...event.params,
    transport_type: 'beacon',
  }
  if (isDebugEnv()) {
    payload.debug_mode = true
  }

  try {
    window.gtag('event', event.name, payload)
  } catch {
    // never throw from analytics
  }
}

// Typed builders — enforced via discriminated union. Call sites can only emit
// events whose shape matches the schema above; invalid shapes fail at compile time.

export function trackInternalJoinClick(currentPage: string): void {
  trackEvent({
    name: 'cta_join_internal_click',
    params: {
      current_page: currentPage,
      link_destination_class: 'internal_cta',
    },
  })
}

export function trackExternalJoinClick(
  joinSourcePage: string,
  joinOriginMethod: ExternalJoinClick['params']['join_origin_method'],
): void {
  trackEvent({
    name: 'cta_join_external_click',
    params: {
      join_source_page: joinSourcePage,
      join_origin_method: joinOriginMethod,
      link_destination_class: 'external_nzda',
    },
  })
}

export function trackNewsletterOpen(slug: string, currentPage: string, source: 'title' | 'arrow'): void {
  trackEvent({
    name: 'newsletter_edition_open',
    params: { slug, current_page: currentPage, source },
  })
}

export function trackOutboundNZDA(
  link: OutboundNZDA['params']['link'],
  currentPage: string,
): void {
  trackEvent({
    name: 'outbound_nzda_national_click',
    params: { link, current_page: currentPage },
  })
}

export function trackAnalyticsProbe(probePage: string): void {
  trackEvent({
    name: '__analytics_probe',
    params: { probe_page: probePage },
  })
}
