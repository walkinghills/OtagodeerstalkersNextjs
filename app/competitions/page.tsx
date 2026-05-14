import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, OG_DEFAULTS } from '@/lib/siteConfig'
import JoinButton from '@/components/JoinButton'
import { webPageSchema, breadcrumbSchema, jsonLdScript } from '@/lib/structuredData'
import { buildCrumbs } from '@/lib/breadcrumbs'

export const metadata: Metadata = {
  title: 'Competitions',
  description: 'Annual Otago Deerstalkers competitions – trophy judging, photography, and more. Open to branch members.',
  openGraph: { ...OG_DEFAULTS, title: 'Competitions – NZDA Otago Branch', description: 'Annual Otago Deerstalkers competitions: trophy judging, photography, and more. Open to branch members.' },
  alternates: { canonical: SITE_URL + '/competitions' },
}

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M7 17h6M10 14v3M7 3H4l1 5c0 2.76 2.24 5 5 5s5-2.24 5-5l1-5h-3"/><path d="M4 3c0 3 1 5 3 6M16 3c0 3-1 5-3 6"/></svg>
)

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polygon points="10,2 12.5,7.5 18,8 14,12 15.5,17.5 10,14.5 4.5,17.5 6,12 2,8 7.5,7.5"/></svg>
)

export default function CompetitionsPage() {
  const crumbs = buildCrumbs('/competitions')
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(webPageSchema({
        title: 'Competitions, NZDA Otago Branch',
        description: 'Annual trophy, photography, and video competitions open to members of the Otago Branch.',
        url: SITE_URL + '/competitions',
      }))} />
      {crumbs && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(crumbs))} />}
      <section className="page-hero page-hero--photo page-hero--competitions">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / Competitions</p>
          <h1>Annual Competitions</h1>
          <p>The Otago Branch runs annual competitions recognising excellence in hunting trophies, photography, and video &#8211; open to all financial members.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="alert alert-info" style={{ maxWidth: '760px', margin: '0 auto 2rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><circle cx="10" cy="10" r="8"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none"/></svg>
            <div>
              <strong>How trophies are judged:</strong> Antlered species (red deer, fallow, whitetail) are scored using SCI or Rowland Ward measurement standards &#8211; main beam length, spread, tine length, and mass. Horned species (tahr, chamois, goat, sheep) are judged on horn length and configuration. Boar categories use live weight and tusk measurement. Judging is conducted by experienced members on the judging evening. Bring your trophy clean and prepared.
            </div>
          </div>
          <div className="section-heading">
            <h2>Trophy Competition</h2>
            <div className="divider"></div>
            <p>Bring in your best trophy from the year and compete for one of the named cups across a wide range of game species and categories.</p>
          </div>

          <div className="trophy-category">
            <div className="trophy-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M12 5 C9 2 5 2 4 5 C3 8 5 11 8 12 L11 18 L10 22 L12 21 L14 22 L13 18 L16 12 C19 11 21 8 20 5 C19 2 15 2 12 5Z"/><path d="M8 12 C5 9 2 9 2 12 C2 14 5 14 6 13"/><path d="M16 12 C19 9 22 9 22 12 C22 14 19 14 18 13"/></svg>
              <h3>Deer &#8211; Antlered Species</h3>
            </div>
            <div className="trophy-list">
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>McCarthy Cup</strong>Red Deer antlers</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Garry Pullar Trophy</strong>Whitetail Deer antlers</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Otago Branch Trophy</strong>Other deer species</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Alexto Cup</strong>Fallow Deer antlers</div></div>
              <div className="trophy-item"><span className="ti-icon"><StarIcon /></span><div><strong>Best Antlered Head</strong>Overall best antlered entry</div></div>
            </div>
          </div>

          <div className="trophy-category">
            <div className="trophy-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polyline points="2,20 8,8 12,14 16,6 22,20"/><polyline points="6,20 8,12 12,16"/></svg>
              <h3>Alpine Species &#8211; Horned</h3>
            </div>
            <div className="trophy-list">
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Allan Miller Trophy</strong>Tahr horns</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>George Hewitt Cup</strong>Chamois horns</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Terry Arthur Cup</strong>Wild sheep horns</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Elio Chiminello Cup</strong>Goat horns</div></div>
              <div className="trophy-item"><span className="ti-icon"><StarIcon /></span><div><strong>Best Horned Head</strong>Overall best horned entry</div></div>
            </div>
          </div>

          <div className="trophy-category">
            <div className="trophy-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><ellipse cx="12" cy="10" rx="8" ry="6"/><path d="M4 10 Q2 14 4 17 Q8 20 12 20 Q16 20 20 17 Q22 14 20 10"/><path d="M8 7 Q8 4 6 3"/><path d="M16 7 Q16 4 18 3"/></svg>
              <h3>Boar Categories</h3>
            </div>
            <div className="trophy-list">
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Capri Motors Trophy</strong>Heaviest boar</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Liquorland Trophy</strong>Heaviest sow</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Best Boar Tusks</strong>Tusk length / quality</div></div>
            </div>
          </div>

          <div className="trophy-category">
            <div className="trophy-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polygon points="12,2 15.5,8.5 23,9.5 17.5,14.5 19,22 12,18 5,22 6.5,14.5 1,9.5 8.5,8.5"/></svg>
              <h3>Special Recognition</h3>
            </div>
            <div className="trophy-list">
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Granger Spiky Cup</strong>Best junior entry</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Ray Webb Cup</strong>Best trophy taken by a female hunter</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>Photo &amp; Video Competition</h2>
            <div className="divider"></div>
            <p>Photos and videos must be taken in the year ending 31 May. Enter across multiple divisions for your best chance of winning.</p>
          </div>

          <div className="trophy-category">
            <div className="trophy-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <h3>Photography &amp; Video Divisions</h3>
            </div>
            <div className="trophy-list">
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Bob Hogan Cup</strong>General hunting / scenic / wildlife photography</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Kevin Weir Cup</strong>Live game animal images</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Keith Knox Memorial Trophy</strong>Human interest scenes</div></div>
              <div className="trophy-item"><span className="ti-icon"><TrophyIcon /></span><div><strong>Judith Stanbridge Cup</strong>Video / DVD entries</div></div>
            </div>
          </div>

          <div className="alert alert-info" style={{ maxWidth: '640px', margin: '2rem auto 0' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18"><circle cx="10" cy="10" r="8"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none"/></svg>
            <span><strong>Photo eligibility:</strong> All photos and videos must have been taken in the competition year, ending 31 May. Check competition details at a club meeting for the current year&rsquo;s deadlines.</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>How to Enter</h2>
            <div className="divider"></div>
          </div>
          <div className="info-box" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
            <h3>Key Dates &#8211; Current Season</h3>
            <table className="pricing-table">
              <thead><tr><th>Event</th><th>Typical Timing</th></tr></thead>
              <tbody>
                <tr><td>Photo &amp; video competition year closes</td><td><strong>31 May</strong></td></tr>
                <tr><td>Photo &amp; video entry submission</td><td><strong>Confirmed at June meeting</strong></td></tr>
                <tr><td>Trophy judging evening</td><td><strong>Announced at club meetings</strong></td></tr>
                <tr><td>Annual prize-giving</td><td><strong>End of year function (Nov/Dec)</strong></td></tr>
              </tbody>
            </table>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>Exact dates confirmed at monthly meetings. Attend or contact the branch to confirm current year deadlines. Entry is free for current members.</p>
          </div>
          <div className="cards-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card">
              <div className="card-header"><span className="icon">1</span><h3>Be a Financial Member</h3></div>
              <div className="card-body">
                <p>Competitions are open to current Otago Branch members. Make sure your membership is up to date before submitting entries.</p>
                <JoinButton className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Join &rarr;</JoinButton>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="icon">2</span><h3>Prepare Your Entry</h3></div>
              <div className="card-body">
                <p>Trophy entries should be brought along to the judging event. Photo and video entries should be taken within the competition year (ending 31 May).</p>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="icon">3</span><h3>Submit at a Club Meeting</h3></div>
              <div className="card-body">
                <p>Trophy judging takes place at an evening event announced at monthly meetings &#8211; typically mid-year. Photo and video entries close on <strong>31 May</strong> each year. Entry is free for current members.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-strip">
        <div className="container">
          <div className="contact-strip-inner">
            <div>
              <h2>Questions About Competitions?</h2>
              <p>Ask at any club meeting for full entry rules and current year deadlines.</p>
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
