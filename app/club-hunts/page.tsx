import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'
import JoinButton from '@/components/JoinButton'
import { webPageSchema, breadcrumbSchema, jsonLdScript } from '@/lib/structuredData'
import { buildCrumbs } from '@/lib/breadcrumbs'

export const metadata: Metadata = {
  title: 'Club Hunts',
  description: 'Otago Deerstalkers club hunts – annual organised hunting trips for members including deer, goat, tahr, and wallaby.',
  openGraph: { title: 'Club Hunts – NZDA Otago Branch', description: 'Otago Deerstalkers club hunts – annual organised hunting trips for members including deer, goat, tahr, and wallaby.' },
  alternates: { canonical: SITE_URL + '/club-hunts' },
}

export default function ClubHuntsPage() {
  const crumbs = buildCrumbs('/club-hunts')
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(webPageSchema({
        title: 'Club Hunts — NZDA Otago Branch',
        description: 'Otago Deerstalkers organised club hunts for deer, goat, tahr, and wallaby.',
        url: SITE_URL + '/club-hunts',
      }))} />
      {crumbs && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(crumbs))} />}
      <section className="page-hero page-hero--photo page-hero--club-hunts">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / Club Hunts</p>
          <h1>Club Hunts</h1>
          <p>Organised hunting trips for Otago Branch members &#8211; a great way to get into the field with experienced hunters.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Annual Hunts</h2>
            <div className="divider"></div>
          </div>

          <div className="cards-grid">
            <div className="card">
              <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M10 4 C8 2 5 2 4 4 C3 6 4 8 6 9 L9 14 L8 18 L10 17 L12 18 L11 14 L14 9 C16 8 17 6 16 4 C15 2 12 2 10 4Z"/><path d="M6 9 C4 7 2 7 2 9 C2 11 4 11 5 10"/><path d="M14 9 C16 7 18 7 18 9 C18 11 16 11 15 10"/></svg>
                <h3>Deer Hunt</h3>
              </div>
              <div className="card-body">
                <p>The main annual club hunt &#8211; typically targeting fallow deer in the Blue Mountains.</p>
                <ul className="detail-list" style={{ marginTop: '0.75rem' }}>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Annual event for branch members</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Experienced members available to guide newer hunters</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Trophy entries welcomed for the annual competition</div></li>
                </ul>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>Dates and details are announced at club meetings and included in the newsletter.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="2,17 7,8 10,13 13,6 18,17"/><polyline points="6,17 7,12 10,15"/></svg>
                <h3>Additional Hunts</h3>
              </div>
              <div className="card-body">
                <p>Goat, tahr, chamois, and wallaby hunts are held from time to time, subject to access availability and member interest.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>Express your interest at a club meeting &#8211; additional hunts are planned around member demand.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>Inter-Branch Events</h2>
            <div className="divider"></div>
          </div>
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-mid)', fontSize: '0.96rem' }}>The branch hosts visiting groups from other NZDA branches and attends hunts run by others around the country &#8211; a good way to hunt new country and meet hunters from outside Otago. Details are announced at club meetings.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>How to Get Involved</h2>
            <div className="divider"></div>
          </div>
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div className="card-body">
              <p>Club hunts are open to financial members. Come along to a monthly meeting to hear what&rsquo;s planned and put your name forward &#8211; numbers are sometimes limited so early interest is worthwhile.</p>
              <JoinButton className="btn btn-primary" style={{ marginTop: '1rem' }}>Join Now &rarr;</JoinButton>
            </div>
          </div>
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
