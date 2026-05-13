import type { Metadata } from 'next'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { SITE_URL } from '@/lib/siteConfig'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ThirdPartyAnalytics from '@/components/ThirdPartyAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Otago Deerstalkers Association',
    template: '%s | Otago Deerstalkers',
  },
  description: 'The Otago Branch of the New Zealand Deerstalkers Association, supporting hunters across the Otago region.',
  openGraph: {
    type: 'website',
    siteName: 'Otago Deerstalkers – NZDA',
  },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
        <ThirdPartyAnalytics />
      </body>
    </html>
  )
}
