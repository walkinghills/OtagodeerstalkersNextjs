import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllNewsletters, formatNewsletterDate } from '@/lib/newsletters'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Stay up to date with the Otago Branch. Read the latest news from the committee, range updates, and upcoming events.',
  openGraph: { title: 'Newsletter – NZDA Otago Branch', description: 'Latest news and updates from the Otago Deerstalkers.' },
  alternates: { canonical: SITE_URL + '/newsletters' },
}

export default function NewslettersPage() {
  const newsletters = getAllNewsletters()

  return (
    <>
      <section className="page-hero page-hero--photo page-hero--newsletter">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / Newsletter</p>
          <h1>Newsletter</h1>
          <p>Monthly updates from the Otago Branch &#8211; hunt reports, range news, competition results, and member stories.</p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <p className="section-intro">The newsletter is sent to members by email after each monthly club meeting. To receive it or request a back issue, contact the committee.</p>
          <Link href="/contact" className="btn btn-primary">Contact the Committee &rarr;</Link>

          {newsletters.length > 0 && (
            <div className="newsletter-archive">
              {newsletters.map(nl => (
                <article key={nl.slug} className="newsletter-card">
                  <div className="newsletter-card-meta">
                    <span className="newsletter-card-issue">Issue #{nl.issue}</span>
                    <time className="newsletter-card-date" dateTime={nl.date}>{formatNewsletterDate(nl.date)}</time>
                  </div>
                  <div className="newsletter-card-body">
                    <h3><Link href={`/newsletters/${nl.slug}`}>{nl.title}</Link></h3>
                    <p>{nl.excerpt}</p>
                  </div>
                  <Link href={`/newsletters/${nl.slug}`} className="newsletter-card-arrow">Read edition &rarr;</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
