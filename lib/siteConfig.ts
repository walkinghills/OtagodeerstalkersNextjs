export const SITE_URL = 'https://otagodeerstalkers.co.nz'

/**
 * Spread into a page's `metadata.openGraph` so it keeps the site-wide image
 * and `type: 'website'` while letting the page override title/description.
 * Workaround for Next.js's page-level openGraph fully replacing root openGraph.
 */
export const OG_DEFAULTS = {
  type: 'website' as const,
  siteName: 'Otago Deerstalkers – NZDA',
  images: [
    {
      url: '/og.jpg',
      width: 1200,
      height: 630,
      alt: 'NZDA Otago Branch, Otago Deerstalkers',
    },
  ],
}

export const NAV_LINKS = [
  { href: '/range',        label: 'Range' },
  { href: '/lodge',        label: 'Lodge' },
  { href: '/club-hunts',   label: 'Club Hunts' },
  { href: '/hunts-course', label: 'HUNTS Course' },
  { href: '/competitions', label: 'Competitions' },
  { href: '/newsletters',  label: 'Newsletter' },
  { href: '/contact',      label: 'Contact' },
]
