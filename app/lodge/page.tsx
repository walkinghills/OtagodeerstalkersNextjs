import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, OG_DEFAULTS } from '@/lib/siteConfig'
import { lodgeSchema, jsonLdScript } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'Blue Mountains Lodge',
  description: 'Blue Mountains Lodge near Beaumont, 16-bed bunkhouse, 6 private huts, meat storage, and dog kennels. Otago Branch members $10 per night.',
  openGraph: { ...OG_DEFAULTS, title: 'Blue Mountains Lodge – NZDA Otago Branch', description: 'Blue Mountains Lodge near Beaumont, 16-bed bunkhouse, 6 private huts, meat storage, and dog kennels. Otago Branch members $10 per night.' },
  alternates: { canonical: SITE_URL + '/lodge' },
}

export default function LodgePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(lodgeSchema())} />
      <section className="page-hero page-hero--photo page-hero--lodge">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / Lodge</p>
          <h1>Blue Mountains Lodge</h1>
          <p>A well equipped base at the Blue Mountains for hunting trips, available to NZDA members.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="info-grid">
            <div>
              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Location &amp; Facilities</h3>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"/><circle cx="10" cy="7" r="2"/></svg></span><div><a href="https://maps.google.com/?q=65+Rongahere+Road+Beaumont+9591+New+Zealand" target="_blank" rel="noopener">65 Rongahere Road, Beaumont 9591</a></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M3 10L10 3l7 7"/><path d="M5 8v9h4v-4h2v4h4V8"/></svg></span><div><strong>Main Lodge</strong>: log burner, electric ranges, refrigeration, microwaves, shower and toilet, TV</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="2" y="8" width="16" height="8" rx="1"/><path d="M4 8V6a2 2 0 012-2h8a2 2 0 012 2v2"/><circle cx="6" cy="16" r="1"/><circle cx="14" cy="16" r="1"/></svg></span><div><strong>16-bed bunkroom</strong></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M2 10L10 2l8 8"/><path d="M4 8.5v9h5v-4h2v4h5v-9"/><line x1="8" y1="6" x2="8" y2="8"/></svg></span><div><strong>6 individual huts</strong>, 2 beds each</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="6" width="14" height="11" rx="1"/><path d="M7 6V5a3 3 0 016 0v1"/><line x1="10" y1="11" x2="10" y2="13"/></svg></span><div><strong>Meat storage</strong></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M3 12c0-3 2-5 4-4 0-2 2-3 4-2 1-2 3-2 4 0 2 0 3 2 2 4l-1 3H4l-1-3z"/><path d="M7 18h6M8 15v3M12 15v3"/></svg></span><div><strong>Dog kennels</strong></div></li>
                </ul>
              </div>

              <div className="info-box">
                <h3>Booking Rules &amp; Key Return</h3>
                <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M10 3L18 17H2L10 3z"/><line x1="10" y1="9" x2="10" y2="13"/><circle cx="10" cy="15.5" r="0.75" fill="currentColor" stroke="none"/></svg>
                  <span>Keys <strong>must be returned within 48 hours</strong> from the last day booked (24 hours during April). Late returns affect other members.</span>
                </div>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Show your current membership card when collecting a key</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Register all party members&rsquo; details at the time of booking</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><circle cx="10" cy="10" r="8"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none"/></svg></span><div>One key fits all locks <em>except</em> individual hut locks</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Leave the lodge clean and tidy for the next group</div></li>
                </ul>
              </div>
            </div>

            <div>
              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Pricing (Per Night)</h3>
                <table className="pricing-table">
                  <thead>
                    <tr><th>Category</th><th>Rate</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Otago Branch members</td><td><strong>$10</strong></td></tr>
                    <tr><td>Other NZDA members</td><td><strong>$15</strong></td></tr>
                    <tr><td>Non-members (NZDA member must be present)</td><td><strong>$20</strong></td></tr>
                    <tr><td>Family rate (1 Dec &#8211; 31 Jan)<br /><small>2 adults + 2 children</small></td><td><strong>$25</strong></td></tr>
                    <tr><td>Children under 16</td><td><strong>Free</strong></td></tr>
                    <tr><td>Other NZDA branch group booking</td><td><a href="mailto:info@otagodeerstalkers.co.nz" className="email-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><polyline points="3,4 10,11 17,4"/></svg> Email to arrange</a></td></tr>
                  </tbody>
                </table>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>Non-members must be accompanied by a current NZDA member.</p>
              </div>

              <div className="info-box">
                <h3>Key Pickup Locations</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', marginBottom: '1rem' }}>Keys are available from the following Dunedin locations.</p>
                <div className="key-locations">
                  <div className="key-location">
                    <strong>Elio&rsquo;s Gun Shop</strong>
                    <span>219 King Edward Street, South Dunedin</span>
                  </div>
                  <div className="key-location">
                    <strong>Hunting and Fishing</strong>
                    <span>18 Maclaggan Street, Dunedin</span>
                  </div>
                  <div className="key-location">
                    <strong>Gun City Dunedin</strong>
                    <span>96 Cumberland Street, Central Dunedin</span>
                  </div>
                  <div className="key-location">
                    <strong>Central Otago Contact</strong>
                    <span>Tony Alexander, 027 447 9398</span>
                  </div>
                </div>
              </div>
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
