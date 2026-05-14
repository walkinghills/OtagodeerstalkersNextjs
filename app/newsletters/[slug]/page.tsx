import type { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getNewsletter, getAllNewsletterSlugs, formatNewsletterDate } from '@/lib/newsletters'
import { SITE_URL } from '@/lib/siteConfig'
import { notFound } from 'next/navigation'
import { articleSchema, breadcrumbSchema, jsonLdScript } from '@/lib/structuredData'
import { buildCrumbs } from '@/lib/breadcrumbs'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllNewsletterSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const nl = getNewsletter(slug)
  if (!nl) return { title: 'Not Found' }

  return {
    title: nl.title,
    description: nl.excerpt,
    openGraph: {
      title: `${nl.title} – NZDA Otago Branch`,
      description: nl.excerpt,
      type: 'article',
      publishedTime: nl.date,
    },
    alternates: { canonical: `${SITE_URL}/newsletters/${slug}` },
  }
}

export default async function NewsletterPage({ params }: Props) {
  const { slug } = await params
  const nl = getNewsletter(slug)
  if (!nl) notFound()

  const monthYear = formatNewsletterDate(nl.date)
  const crumbs = buildCrumbs(`/newsletters/${slug}`, nl.title)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleSchema({
        title: nl.title,
        description: nl.excerpt,
        url: `${SITE_URL}/newsletters/${slug}`,
        datePublished: nl.date,
      }))} />
      {crumbs && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(crumbs))} />}
      <section className="newsletter-masthead">
        <div className="container">
          <div className="newsletter-meta-bar">
            <Link href="/newsletters" className="newsletter-back">&#8592; All Editions</Link>
            <span className="newsletter-issue-badge">Issue #{nl.issue}</span>
          </div>
          <h1>{nl.title}</h1>
          <div className="newsletter-dateline">
            <time dateTime={nl.date}>{monthYear}</time>
            <span className="newsletter-branch">NZDA Otago Branch</span>
          </div>
        </div>
      </section>

      <main className="newsletter-body">
        <div className="container newsletter-container">
          <article className="newsletter-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {nl.content}
            </ReactMarkdown>
          </article>
        </div>
      </main>

      <section className="newsletter-edition-nav">
        <div className="container">
          <Link href="/newsletters" className="btn btn-outline">&#8592; Back to All Editions</Link>
        </div>
      </section>
    </>
  )
}
