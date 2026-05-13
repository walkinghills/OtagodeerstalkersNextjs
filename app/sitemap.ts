import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/siteConfig'
import { getAllNewsletters } from '@/lib/newsletters'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/range', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/lodge', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/club-hunts', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/hunts-course', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/competitions', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/join', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/newsletters', priority: 0.7, changeFrequency: 'monthly' },
  ]

  const newsletters = getAllNewsletters().map((nl) => ({
    url: `${SITE_URL}/newsletters/${nl.slug}`,
    lastModified: new Date(nl.date),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...newsletters,
  ]
}
