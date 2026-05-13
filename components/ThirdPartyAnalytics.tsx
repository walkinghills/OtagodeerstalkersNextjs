import Script from 'next/script'
import MetaPixelRifleRange from './MetaPixelRifleRange'

/**
 * Server-rendered third-party analytics. Each block activates only when its
 * env var is set, so we can ship the code today and flip individual trackers
 * on later by adding env vars in Vercel project settings.
 *
 * - NEXT_PUBLIC_GA4_ID          eg "G-XXXXXXX"          (Google Analytics 4)
 * - NEXT_PUBLIC_META_PIXEL_ID   eg 15 digits            (Club Meta Pixel, site-wide)
 * - NEXT_PUBLIC_META_PIXEL_RIFLE_ID  eg 15 digits       (Rifle range Meta Pixel, /range and /competitions only)
 * - NEXT_PUBLIC_CF_ANALYTICS_TOKEN   eg 32-char token   (Cloudflare Web Analytics)
 */
export default function ThirdPartyAnalytics() {
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID
  const metaPixelClub = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const cfToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN

  return (
    <>
      {ga4 && (
        <>
          <Script
            id="ga4-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4}', { anonymize_ip: true });
              `,
            }}
          />
        </>
      )}

      {metaPixelClub && (
        <Script
          id="meta-pixel-club"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelClub}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* Rifle range pixel fires only on /range and /competitions (client component handles route check) */}
      <MetaPixelRifleRange />

      {cfToken && (
        <Script
          id="cf-web-analytics"
          strategy="afterInteractive"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${cfToken}"}`}
        />
      )}
    </>
  )
}
