/**
 * Join-funnel origin attribution.
 * Plan rev 3, D_TEMP_4 / A003 (referrer fallback):
 *   1. sessionStorage (set by JoinButton on internal click)
 *   2. same-origin referrer (catches middle-click / new-tab opens where
 *      sessionStorage from a different tab isn't visible)
 *   3. direct
 *
 * All sessionStorage access is wrapped (incognito mode, quota errors, etc.).
 */
import { normaliseRoute } from './routeTemplates.generated'

const STORAGE_KEY = 'joinFunnelOrigin'
const TTL_MS = 30 * 60 * 1000 // 30 minutes — aligns with GA4 default session timeout

type Stored = { origin: string; ts: number }

function safeSessionGet(): Stored | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as Stored).origin !== 'string' ||
      typeof (parsed as Stored).ts !== 'number'
    ) {
      return null
    }
    const s = parsed as Stored
    if (Date.now() - s.ts > TTL_MS) return null
    return s
  } catch {
    return null
  }
}

function safeSessionSet(value: Stored): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // SecurityError (incognito with cookies blocked) or QuotaExceededError — silently no-op
  }
}

export function setJoinOrigin(routeTemplate: string): void {
  safeSessionSet({ origin: routeTemplate, ts: Date.now() })
}

export type JoinOriginResolution = {
  source: string
  method: 'sessionStorage' | 'referrer_fallback' | 'direct'
}

const DIRECT: JoinOriginResolution = { source: '(direct)', method: 'direct' }

export function resolveJoinOrigin(): JoinOriginResolution {
  // Tier 1 — sessionStorage
  const stored = safeSessionGet()
  if (stored) {
    return { source: stored.origin, method: 'sessionStorage' }
  }

  // Tier 2 — same-origin referrer
  if (typeof document !== 'undefined' && typeof window !== 'undefined' && document.referrer) {
    try {
      const ref = new URL(document.referrer)
      if (ref.origin === window.location.origin && ref.pathname !== '/join') {
        return {
          source: normaliseRoute(ref.pathname),
          method: 'referrer_fallback',
        }
      }
    } catch {
      // Malformed referrer — fall through to direct
    }
  }

  // Tier 3 — direct
  return DIRECT
}
