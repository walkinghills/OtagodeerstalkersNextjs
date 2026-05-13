'use client'

import { trackEvent, type TrackedEvent } from '@/lib/analytics'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: TrackedEvent
  eventProps?: Record<string, string | number | boolean | null>
  children: ReactNode
}

export default function TrackedLink({ event, eventProps, children, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event, eventProps)
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
