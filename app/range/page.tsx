import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'
import { TimetableSchema } from '@/lib/timetable'
import RangeTimetable from '@/components/RangeTimetable'
import timetableData from '@/data/timetable.json'
import { rifleRangeSchema, jsonLdScript } from '@/lib/structuredData'
import JoinButton from '@/components/JoinButton'

export const metadata: Metadata = {
  title: 'Chaz Forsyth Rifle Range',
  description: 'Chaz Forsyth Rifle Range, 25, 50 and 100 metre outdoor shooting range. Open most Saturdays 1pm to 4pm.',
  openGraph: { title: 'Chaz Forsyth Rifle Range – NZDA Otago Branch', description: 'Chaz Forsyth Rifle Range, 25, 50 and 100 metre outdoor shooting range. Open most Saturdays 1pm to 4pm.' },
  alternates: { canonical: SITE_URL + '/range' },
}

export default function RangePage() {
  const timetable = TimetableSchema.parse(timetableData)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(rifleRangeSchema())} />
      <section className="page-hero page-hero--photo page-hero--range">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / Range</p>
          <h1>Chaz Forsyth Rifle Range</h1>
          <p>An outdoor range offering 25, 50, and 100 metre shooting distances, open to members and visitors most Saturdays.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="info-grid info-grid--wide">
            <div>
              <a href="#calendar" className="btn btn-outline" style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><rect x="3" y="4" width="14" height="14" rx="2"/><line x1="3" y1="8" x2="17" y2="8"/><line x1="7" y1="2" x2="7" y2="6"/><line x1="13" y1="2" x2="13" y2="6"/></svg>
                View Range Calendar
              </a>
              <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M10 3L18 17H2L10 3z"/><line x1="10" y1="9" x2="10" y2="13"/><circle cx="10" cy="15.5" r="0.75" fill="currentColor" stroke="none"/></svg>
                <span><strong>Weather dependent.</strong> Closures are announced on the <a href="https://www.facebook.com/groups/1195200207197835/" target="_blank" rel="noopener">Chaz Forsyth Rifle Range Facebook Group</a>. Check before heading out.</span>
              </div>

              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Opening Hours</h3>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Most Saturdays, 1:00pm to 4:00pm</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg></span><div>Closed June and July for maintenance, over the Christmas period, and on public holidays</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M10 3L18 17H2L10 3z"/><line x1="10" y1="9" x2="10" y2="13"/><circle cx="10" cy="15.5" r="0.75" fill="currentColor" stroke="none"/></svg></span><div>Sessions end promptly at 4:00pm. The range is a 10-minute walk from the road, so plan your arrival to allow time to shoot and pack up before close.</div></li>
                </ul>
              </div>

              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Facilities</h3>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>11 shooting benches</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Distances of 25m, 50m, and 100m</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Targets provided on the day</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Range Officers on duty and available to assist with sighting and technique</div></li>
                </ul>
              </div>

              <div className="info-box">
                <h3>Mandatory Safety Requirements</h3>
                <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M10 3L18 17H2L10 3z"/><line x1="10" y1="9" x2="10" y2="13"/><circle cx="10" cy="15.5" r="0.75" fill="currentColor" stroke="none"/></svg>
                  <span><strong>Range Officer instructions must be followed at all times, without exception.</strong> If instructed to cease fire, make your firearm safe immediately.</span>
                </div>
                <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"/><circle cx="10" cy="7" r="2"/></svg>
                  <span><strong>A current firearms licence is required to shoot.</strong> A Range Officer may request to see it before you are permitted on the range. This requirement may be met by the shooter or their accompanying supervisor.</span>
                </div>
                <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="5" y="9" width="10" height="9" rx="2"/><path d="M7 9V7a3 3 0 016 0v2"/></svg>
                  <span><strong>Hearing and eye protection are mandatory for all persons on the range,</strong> including spectators. Bring your own earmuffs and eye protection.</span>
                </div>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Remove your bolt when not actively shooting</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Display chamber safety flags when your bench is unoccupied</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg></span><div>No dogs on the range</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg></span><div>No smoking on the range</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg></span><div>Youths and older children must be under direct adult supervision at all times. Young children are not permitted on the range.</div></li>
                </ul>
              </div>
            </div>

            <div>
              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Fees</h3>
                <table className="pricing-table">
                  <thead>
                    <tr><th>Category</th><th>Fee</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>NZDA Members</td><td><strong>$5.00</strong></td></tr>
                    <tr><td>Non-members</td><td><strong>$10.00</strong></td></tr>
                  </tbody>
                </table>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>Current membership card required for member rate.</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.5rem' }}><strong>Bring cash.</strong> Card payments are not available. Bank transfers may be possible if you have mobile coverage, but not guaranteed.</p>
              </div>

              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Location &amp; Access</h3>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"/><circle cx="10" cy="7" r="2"/></svg></span><div><a href="https://maps.app.goo.gl/N8Eh2acjfGkaandNA" target="_blank" rel="noopener">Leith Valley Road, Dunedin</a></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M3 10l1.5-4h11l1.5 4"/><rect x="2" y="10" width="16" height="5" rx="1"/><circle cx="6" cy="15" r="1.5"/><circle cx="14" cy="15" r="1.5"/></svg></span><div>Access via Leith Valley Road, or from SH1 at Leith Saddle heading south.</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="10" cy="6" r="3"/><path d="M4 18c0-3.31 2.69-6 6-6s6 2.69 6 6"/></svg></span><div>10-minute walk from the road to the range</div></li>
                </ul>
              </div>

              <div className="info-box">
                <h3>What to Bring</h3>
                <h4 className="list-label">Mandatory</h4>
                <ul className="detail-list" style={{ marginBottom: '1rem' }}>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Ear protection</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Eye protection</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Firearms licence</div></li>
                </ul>
                <h4 className="list-label">Suggested</h4>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Warm clothing and sturdy footwear</div></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="feature-row">
            <div className="feature-content">
              <p style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber-600)', marginBottom: '0.6rem' }}>1948 &#8211; 2025</p>
              <h2>Dr Chaz Forsyth</h2>
              <p>Chaz Forsyth was an NZDA Life Member, COLFO executive member, teacher, researcher, hunter, and tireless advocate for the responsible ownership of firearms in New Zealand. He passed away on 20 January 2025, aged 76. He had been managing illness through the preceding year with the same quiet resolve he brought to everything: business as usual, still attending meetings, still showing up.</p>
              <p>Born in North Otago in 1948, Chaz began his career as a civil engineer before retraining as a workshop teacher at Balmacewen Intermediate, a role he held for twenty years. In retirement he returned to the University of Otago full-time, completing qualifications in economics, physical geography, firearms, and range consultancy, before earning a PhD in human geography in 2023 with a thesis on firearms in the New Zealand community. He accepted the achievement with a humble grin: he was now, he told anyone who&rsquo;d listen, a <em>&ldquo;Doctor Bastard.&rdquo;</em></p>
              <p>A prolific writer of well-balanced submissions and a source of what those around him called infinite knowledge, Chaz gave decades to the NZDA and COLFO as a researcher, range consultant, and firearms safety instructor who trained hundreds of new licence applicants at the Dunedin police station across many years of voluntary evenings. Former NZDA president Bill O&rsquo;Leary, who knew him for more than forty years, remembered a man with a <em>&ldquo;brilliant mind&rdquo;</em> whose analysis of firearm incidents was widely relied upon, and whose interest in range design, rooted in his original drafting trade, shaped clubs like ours in lasting ways.</p>
              <p>His guidance and advice were invaluable, and his stories, laced with hard-won wisdom on hunting and politics, were shared generously with members of all ages. His final message, delivered through his daughter Bridget in his last days, was two words: <em>&ldquo;Keep smiling.&rdquo;</em> A keen mountaineer, avid hunter, and devoted friend of this club, the range that carries his name is a fitting tribute to a man who gave so much to it.</p>
            </div>
            <div className="feature-visual feature-visual--collage">
              <div className="collage-img" style={{ flex: 1.3 }}>
                <img src="/images/chaz-forsyth-young.jpeg" alt="Chaz Forsyth in the New Zealand backcountry as a young hunter" style={{ objectPosition: 'center 30%' }} />
              </div>
              <div className="collage-img" style={{ flex: 1 }}>
                <img src="/images/chaz-forsyth-museum.jpg" alt="Dr Chaz Forsyth at the NZDA Hunting and Shooting Museum, donating firearms to the collection" style={{ objectPosition: 'center 20%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" style={{ paddingTop: 0 }} id="calendar">
        <div className="container">
          <div className="section-heading">
            <h2>Chaz Forsyth Rifle Range Calendar</h2>
            <div className="divider"></div>
          </div>
          <RangeTimetable timetable={timetable} />
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Not yet a member?</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Members pay half the range fee.</p>
          <JoinButton className="btn btn-primary">Join the Otago Branch &rarr;</JoinButton>
        </div>
      </section>
    </>
  )
}
