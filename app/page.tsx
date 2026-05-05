import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Otago Deerstalkers Association',
  description: 'The Otago Branch of the New Zealand Deerstalkers Association – supporting hunters and shooters across the Otago region.',
  openGraph: {
    title: 'Otago Deerstalkers Association – NZDA Otago Branch',
    description: 'The Otago Branch of the New Zealand Deerstalkers Association – supporting hunters and shooters across the Otago region.',
  },
  alternates: { canonical: SITE_URL + '/' },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SportsOrganization',
      name: 'NZDA Otago Branch – Otago Deerstalkers',
      url: 'https://otagodeerstalkers.co.nz',
      description: 'The Otago Branch of the New Zealand Deerstalkers Association. Representing hunters and recreational shooters across the Otago region.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '53 Malvern Street',
        addressLocality: 'Woodhaugh, Dunedin',
        postalCode: '9010',
        addressCountry: 'NZ',
      },
      memberOf: {
        '@type': 'Organization',
        name: 'New Zealand Deerstalkers Association',
        url: 'https://www.deerstalkers.org.nz/',
      },
    }),
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SportsOrganization',
          name: 'NZDA Otago Branch – Otago Deerstalkers',
          url: 'https://otagodeerstalkers.co.nz',
          description: 'The Otago Branch of the New Zealand Deerstalkers Association. Representing hunters and recreational shooters across the Otago region.',
          address: { '@type': 'PostalAddress', streetAddress: '53 Malvern Street', addressLocality: 'Woodhaugh, Dunedin', postalCode: '9010', addressCountry: 'NZ' },
          memberOf: { '@type': 'Organization', name: 'New Zealand Deerstalkers Association', url: 'https://www.deerstalkers.org.nz/' },
        }) }}
      />

      <section className="hero">
        <div className="container">
          <div className="hero-content hero-content--centred">
            <h1>NZDA Otago Branch</h1>
            <p className="hero-sub">Club hunts, a lodge in the Blue Mountains, and a range in Leith Valley. Otago&apos;s hunting community.</p>
            <div className="hero-actions">
              <Link href="/join" className="btn btn-amber">Become a Member</Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 0 2.5rem' }}>
        <div className="container">
          <div className="quick-links">
            <Link href="/range" className="ql-card">
              <svg className="ql-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
                <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
              </svg>
              <h3>Chaz Forsyth Rifle Range</h3>
              <p>25, 50 &amp; 100m shooting. Open most Saturdays 1&#8211;4pm.</p>
            </Link>
            <Link href="/lodge" className="ql-card">
              <svg className="ql-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <h3>Blue Mountains Lodge</h3>
              <p>28 beds across bunkhouse and private huts near Beaumont.</p>
            </Link>
            <Link href="/club-hunts" className="ql-card">
              <svg className="ql-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
              <h3>Club Hunts</h3>
              <p>Annual goat and deer hunts, plus tahr and wallaby.</p>
            </Link>
            <Link href="/hunts-course" className="ql-card">
              <svg className="ql-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <h3>HUNTS Course</h3>
              <p>New to hunting? Our education programme has you covered.</p>
            </Link>
            <Link href="/competitions" className="ql-card">
              <svg className="ql-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 3h10v7a5 5 0 0 1-10 0z"/>
                <path d="M7 5H4.5a2.5 2.5 0 0 0 0 5H7"/>
                <path d="M17 5h2.5a2.5 2.5 0 0 1 0 5H17"/>
                <path d="M12 15v3"/><path d="M9 18h6"/><path d="M7 21h10"/>
              </svg>
              <h3>Competitions</h3>
              <p>Trophy, photography, and more &#8212; annual competitions for members.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="about">
        <div className="container">
          <div className="section-heading">
            <h2>About the Otago Branch</h2>
            <div className="divider"></div>
          </div>
          <div className="feature-row">
            <div className="feature-visual-wrap">
              <div className="feature-visual">
                <img src="/images/member-hunt-fallow.jpg" alt="Mark Hastie, Club President, with a fallow stag" className="feature-visual-photo" />
              </div>
              <p className="photo-caption">Mark Hastie, Club President, NZDA Otago Branch</p>
            </div>
            <div className="feature-content">
              <h2>Who We Are</h2>
              <p>A volunteer-run club for hunters and shooters across the Otago region, with real assets: a rifle range in Leith Valley, a fully equipped hunting lodge in the Blue Mountains near Beaumont, and organised hunts into the region&apos;s backcountry. If you hunt or shoot in Otago, this is your community.</p>
              <p>Beyond the facilities, we advocate for fair firearms legislation, support hunter education, and run annual competitions that celebrate the best trophies and photography from the season.</p>
              <h4 className="list-label">Our purpose</h4>
              <ul className="detail-list" style={{ marginBottom: '1.5rem' }}>
                <li><span className="di">✓</span><div>Advocacy for hunting access and firearms rights</div></li>
                <li><span className="di">✓</span><div>Promotion of safe, ethical, and skilled hunting</div></li>
                <li><span className="di">✓</span><div>Conservation projects and pest control</div></li>
                <li><span className="di">✓</span><div>Hunter education through the HUNTS programme</div></li>
                <li><span className="di">✓</span><div>Annual competitions recognising hunting achievement</div></li>
              </ul>
              <Link href="/join" className="btn btn-primary">Join the Branch</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Club Meetings</h2>
            <div className="divider"></div>
          </div>
          <div className="cards-grid">
            <div className="card">
              <div className="card-header">
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
                <h3>When</h3>
              </div>
              <div className="card-body">
                <p>Meetings are held on the <strong>2nd Monday of every month at 7:30pm</strong>, excluding January and April.</p>
                <ul className="detail-list">
                  <li><span className="di">✓</span><div>Doors open from 7:00pm</div></li>
                  <li><span className="di">✓</span><div>All members welcome, visitors encouraged</div></li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <h3>Where</h3>
              </div>
              <div className="card-body">
                <p>Meetings are held at our clubrooms at <strong><a href="https://maps.google.com/?q=53+Malvern+Street+Woodhaugh+Dunedin" target="_blank" rel="noopener">53 Malvern Street, Woodhaugh, Dunedin</a></strong>.</p>
                <ul className="detail-list">
                  <li><span className="di">✓</span><div>Free parking on street</div></li>
                  <li><span className="di">✓</span><div><a href="https://maps.google.com/?q=53+Malvern+Street+Woodhaugh+Dunedin" target="_blank" rel="noopener">Open in Google Maps &#8594;</a></div></li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <h3>What to Expect</h3>
              </div>
              <div className="card-body">
                <ul className="detail-list">
                  <li><span className="di">✓</span><div>Guest speakers on hunting and conservation</div></li>
                  <li><span className="di">✓</span><div>Trip reports and hunt planning</div></li>
                  <li><span className="di">✓</span><div>Club news and updates</div></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>Upcoming Events</h2>
            <div className="divider"></div>
          </div>
          <div className="events-list" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div className="event-item">
              <div className="event-date"><strong>May</strong><span>31</span></div>
              <div className="event-info">
                <h4>Photo &amp; Video Competition: Entry Year Closes</h4>
                <p>All photos and video entries must have been taken in the year ending 31 May.</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date"><strong>Jun</strong><span>27</span></div>
              <div className="event-info">
                <h4>Annual Deer Hunt</h4>
                <p>Limited spots &#8212; register your interest at any club meeting.</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date"><strong>June</strong></div>
              <div className="event-info">
                <h4>Annual General Meeting</h4>
                <p>Open to all financial members. Branch reports, election of officers, and general business.</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date"><strong>Mid</strong><span>year</span></div>
              <div className="event-info">
                <h4>Trophy Judging Evening</h4>
                <p>Annual trophy competition judging. Bring your best head from the season.</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date"><strong>End</strong><span>of Year</span></div>
              <div className="event-info">
                <h4>Annual Prize-Giving</h4>
                <p>End-of-year function with competition prize-giving across all categories. All members and partners welcome.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>From Our Members</h2>
            <div className="divider"></div>
          </div>
          <div className="cards-grid" style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div className="quote-card">
              <blockquote>&ldquo;I came to the HUNTS course knowing nothing. Within a few months I was out on the annual goat hunt with guys who&apos;d been doing this for decades. Best decision I made.&rdquo;</blockquote>
              <cite>Otago Branch Member</cite>
            </div>
            <div className="quote-card">
              <blockquote>&ldquo;The lodge at Beaumont is a genuine asset. $10 a night for your own base in the Blue Mountains &#8212; it&apos;s hard to beat. We use it two or three trips a year.&rdquo;</blockquote>
              <cite>Otago Branch Member</cite>
            </div>
            <div className="quote-card">
              <blockquote>&ldquo;Saturday afternoons at Leith Valley &#8212; there&apos;s always someone to help you sight in, and for $5 it&apos;s unbeatable. The range officers know their stuff.&rdquo;</blockquote>
              <cite>Otago Branch Member</cite>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <Link href="/join" className="btn btn-primary">View Benefits &amp; Join &#8594;</Link>
        </div>
      </section>

      <section className="contact-strip">
        <div className="container">
          <div className="contact-strip-inner">
            <div>
              <h2>Get in Touch</h2>
              <p>Questions about membership, the range, lodge, or upcoming events?</p>
            </div>
            <div className="contact-items">
              <div className="contact-item">
                <span className="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
                <div>
                  <strong>Clubrooms</strong>
                  <span><a href="https://maps.google.com/?q=53+Malvern+Street+Woodhaugh+Dunedin" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.88)' }}>53 Malvern St, Woodhaugh, Dunedin 9010</a></span>
                </div>
              </div>
              <div className="contact-item">
                <span className="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                <div>
                  <strong>Meetings</strong>
                  <span>2nd Monday, 7:30pm (excl. Jan &amp; Apr)</span>
                </div>
              </div>
              <div className="contact-item">
                <span className="ci-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
                <div>
                  <strong>Email</strong>
                  <span><a href="mailto:info@otagodeerstalkers.co.nz" style={{ color: 'rgba(255,255,255,0.88)' }}>info@otagodeerstalkers.co.nz</a></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
