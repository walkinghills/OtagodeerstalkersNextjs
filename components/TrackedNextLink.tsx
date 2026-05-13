'use client'

import Link, { type LinkProps } from 'next/link'
import { trackEvent, type TrackedEvent } from '@/lib/analytics'
import type { ReactNode, MouseEvent } from 'react'

type Props = LinkProps & {
  event: TrackedEvent
  eventProps?: Record<string, string | number | boolean | null>
  className?: string
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function TrackedNextLink({ event, eventProps, onClick, children, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        trackEvent(event, eventProps)
        onClick?.(e)
      }}
    >
      {children}
    </Link>
  )
}
