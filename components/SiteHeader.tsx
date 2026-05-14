'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/lib/siteConfig'
import JoinButton from './JoinButton'

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => { close() }, [pathname, close])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <header className="site-header">
        <div className="container">
          <nav className="nav-inner">
            <Link href="/" className="nav-brand" onClick={close}>
              <img
                src="https://www.deerstalkers.org.nz/_resources/themes/NZDANational/images/logo-white-white-text.svg"
                alt="NZDA Logo"
                className="nav-logo"
              />
              <div className="nav-brand-text">
                Otago Branch
                <span>New Zealand Deerstalkers Association</span>
              </div>
            </Link>

            <button
              type="button"
              className="nav-toggle"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
            >
              <span style={{ transform: open ? 'translateY(7px) rotate(45deg)' : '' }} />
              <span style={{ transform: open ? 'scale(0)' : '' }} />
              <span style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : '' }} />
            </button>

            <ul className={`nav-links${open ? ' open' : ''}`}>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={isActive(href) ? 'active' : ''} onClick={close}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <JoinButton className={`btn-join${isActive('/join') ? ' active' : ''}`} onClick={close}>
                  Join
                </JoinButton>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {open && (
        <div
          className="nav-backdrop open"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  )
}
