'use client'

/**
 * External Join CTA on /join. Fires cta_join_external_click with the resolved
 * funnel origin. Same activation semantics as JoinButton (left + middle +
 * modifier; right-click ignored).
 */

import { useRef, type ReactNode, type MouseEvent, type PointerEvent, type CSSProperties } from 'react'
import { trackExternalJoinClick } from '@/lib/analytics/track'
import { resolveJoinOrigin } from '@/lib/analytics/joinFunnel'

const DEDUPE_MS = 200
const DEFAULT_NZDA_URL = 'https://www.deerstalkers.org.nz/branches/south-island/otago/'

type Props = {
  href?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function ExternalJoinButton({ href = DEFAULT_NZDA_URL, className, style, children }: Props) {
  const trackedAt = useRef<number>(0)

  function fire() {
    const now = Date.now()
    if (now - trackedAt.current < DEDUPE_MS) return
    trackedAt.current = now
    const { source, method } = resolveJoinOrigin()
    trackExternalJoinClick(source, method)
  }

  function onPointerDown(e: PointerEvent<HTMLAnchorElement>) {
    if (e.button === 0 || e.button === 1) fire()
  }

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0) return
    fire()
  }

  function onAuxClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 1) return
    fire()
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      style={style}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onAuxClick={onAuxClick}
    >
      {children}
    </a>
  )
}
