import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllNewsletters, formatNewsletterDate } from '@/lib/newsletters'
import { SITE_URL } from '@/lib/siteConfig'
import TrackedNextLink from '@/components/TrackedNextLink'
import { collectionPageSchema, breadcrumbSchema, jsonLdScript } from '@/lib/structuredData'
import { buildCrumbs } from '@/lib/breadcrumbs'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Stay up to date with the Otago Branch. Read the latest news from the committee, range updates, and upcoming events.',
  openGraph: { title: 'Newsletter – NZDA Otago Branch', description: 'Latest news and updates from the Otago Deerstalkers.' },
  alternates: { canonical: SITE_URL + '/newsletters' },
}

export default function NewslettersPage() {
  const newsletters = getAllNewsletters()
  const crumbs = buildCrumbs('/newsletters')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(collectionPageSchema({
        title: 'Newsletter — NZDA Otago Branch',
        description: 'Monthly newsletter archive for the Otago Branch.',
        url: SITE_URL + '/newsletters',
      }))} />
      {crumbs && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(crumbs))} />}
      <section className="page-hero page-hero--photo page-hero--newsletter">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / Newsletter</p>
          <h1>Newsletter</h1>
          <p>Monthly updates from the Otago Branch: hunt reports, range news, competition results, and member stories.</p>
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
                    <h3><TrackedNextLink event="newsletter_edition_open" eventProps={{ slug: nl.slug, source: 'title' }} href={`/newsletters/${nl.slug}`}>{nl.title}</TrackedNextLink></h3>
                    <p>{nl.excerpt}</p>
                  </div>
                  <TrackedNextLink event="newsletter_edition_open" eventProps={{ slug: nl.slug, source: 'arrow' }} href={`/newsletters/${nl.slug}`} className="newsletter-card-arrow">Read edition &rarr;</TrackedNextLink>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="contact-strip">
        <div className="container">
          <div className="contact-strip-inner">
            <div>
              <h2>Questions?</h2>
              <p>Come along to any club meeting. Visitors are always welcome.</p>
            </div>
            <div className="contact-items">
              <div className="contact-item">
                <span className="ci-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"/><circle cx="10" cy="7" r="2"/></svg>
                </span>
                <div><strong>Clubrooms</strong><span>53 Malvern St, Woodhaugh, Dunedin 9010</span></div>
              </div>
              <div className="contact-item">
                <span className="ci-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="4" width="14" height="14" rx="2"/><line x1="3" y1="8" x2="17" y2="8"/><line x1="7" y1="2" x2="7" y2="6"/><line x1="13" y1="2" x2="13" y2="6"/></svg>
                </span>
                <div><strong>Meetings</strong><span>2nd Monday, 7:30pm (excl. Jan &amp; Apr)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
