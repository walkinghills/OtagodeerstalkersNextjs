'use client'

/**
 * Internal Join CTA. Wraps Next.js <Link> with funnel-origin tracking.
 * Plan rev 3, D-ACTIVATIONS (round-2 A012):
 *   - Track left-click (button 0), middle-click (button 1), and modifier-key
 *     clicks. All three are valid intent signals.
 *   - Right-click / context-menu does NOT track.
 *   - Fire on pointerdown for low-latency; dedupe via timestamp on click/auxclick
 *     so a single activation produces exactly one event.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, type ReactNode, type MouseEvent, type PointerEvent, type CSSProperties } from 'react'
import { trackInternalJoinClick } from '@/lib/analytics/track'
import { setJoinOrigin } from '@/lib/analytics/joinFunnel'
import { normaliseRoute } from '@/lib/analytics/routeTemplates.generated'

const DEDUPE_MS = 200

type Props = {
  className?: string
  style?: CSSProperties
  children: ReactNode
  href?: string
  /** Additional click handler chained after tracking (e.g. mobile nav close) */
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function JoinButton({ className, style, children, href = '/join', onClick: onClickProp }: Props) {
  const pathname = usePathname() || '/'
  const routeTemplate = normaliseRoute(pathname)
  const trackedAt = useRef<number>(0)

  function fire() {
    const now = Date.now()
    if (now - trackedAt.current < DEDUPE_MS) return
    trackedAt.current = now
    setJoinOrigin(routeTemplate)
    trackInternalJoinClick(routeTemplate)
  }

  function onPointerDown(e: PointerEvent<HTMLAnchorElement>) {
    if (e.button === 0 || e.button === 1) fire()
  }

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button === 0) fire()
    onClickProp?.(e)
  }

  function onAuxClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 1) return
    fire()
  }

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onAuxClick={onAuxClick}
    >
      {children}
    </Link>
  )
}
