/**
 * Single source for breadcrumb labels — drives both the visible breadcrumb UI
 * and the BreadcrumbList JSON-LD so they cannot drift.
 */
import { SITE_URL } from './siteConfig'

const PATH_LABELS: Record<string, string> = {
  '/': 'Home',
  '/range': 'Range',
  '/lodge': 'Lodge',
  '/club-hunts': 'Club Hunts',
  '/hunts-course': 'HUNTS Course',
  '/competitions': 'Competitions',
  '/contact': 'Contact',
  '/join': 'Join',
  '/newsletters': 'Newsletter',
}

export type Crumb = { name: string; url: string }

/**
 * Build breadcrumb crumbs for a given pathname. Always starts with Home.
 * Returns null for depth < 2 (Home alone is not worth rendering).
 */
export function buildCrumbs(pathname: string, dynamicLabel?: string): Crumb[] | null {
  if (!pathname || pathname === '/') return null
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const crumbs: Crumb[] = [{ name: 'Home', url: SITE_URL + '/' }]

  let acc = ''
  for (let i = 0; i < segments.length; i++) {
    acc += '/' + segments[i]
    const isLast = i === segments.length - 1
    const label = PATH_LABELS[acc] ?? (isLast && dynamicLabel ? dynamicLabel : titleise(segments[i]))
    crumbs.push({ name: label, url: SITE_URL + acc })
  }

  return crumbs
}

function titleise(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function breadcrumbListSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}
