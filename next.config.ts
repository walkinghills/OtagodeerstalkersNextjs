import type { NextConfig } from 'next'

const config: NextConfig = {
  trailingSlash: false,
  images: { unoptimized: true },

  async redirects() {
    // Legacy URLs from the previous GitHub Pages deployment.
    // Google indexed these; map them to the new Next.js routes so we
    // don't lose link equity and stop returning 404s to search clicks.
    const pageMap: Array<[string, string]> = [
      ['/nzda-otago.github.io', '/'],
      ['/nzda-otago.github.io/index.html', '/'],
      ['/nzda-otago.github.io/range.html', '/range'],
      ['/nzda-otago.github.io/lodge.html', '/lodge'],
      ['/nzda-otago.github.io/club-hunts.html', '/club-hunts'],
      ['/nzda-otago.github.io/hunts-course.html', '/hunts-course'],
      ['/nzda-otago.github.io/competitions.html', '/competitions'],
      ['/nzda-otago.github.io/contact.html', '/contact'],
      ['/nzda-otago.github.io/join.html', '/join'],
      ['/nzda-otago.github.io/newsletters', '/newsletters'],
      ['/nzda-otago.github.io/newsletters/index.html', '/newsletters'],
      ['/nzda-otago.github.io/range', '/range'],
      ['/nzda-otago.github.io/lodge', '/lodge'],
      ['/nzda-otago.github.io/club-hunts', '/club-hunts'],
      ['/nzda-otago.github.io/hunts-course', '/hunts-course'],
      ['/nzda-otago.github.io/competitions', '/competitions'],
      ['/nzda-otago.github.io/contact', '/contact'],
      ['/nzda-otago.github.io/join', '/join'],
    ]

    const explicit = pageMap.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }))

    return [
      ...explicit,
      // Newsletter slug pages from old structure
      {
        source: '/nzda-otago.github.io/newsletters/:slug.html',
        destination: '/newsletters/:slug',
        permanent: true,
      },
      {
        source: '/nzda-otago.github.io/newsletters/:slug',
        destination: '/newsletters/:slug',
        permanent: true,
      },
      // Catch-all fallback: anything else under the old prefix lands on home
      {
        source: '/nzda-otago.github.io/:path*',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default config
