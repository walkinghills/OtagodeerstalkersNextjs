import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the NZDA Otago Branch — clubrooms address, meeting times, and how to get in touch.',
  openGraph: { title: 'Contact – NZDA Otago Branch', description: 'Contact the NZDA Otago Branch — clubrooms address, meeting times, and how to get in touch.' },
  alternates: { canonical: SITE_URL + '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero--photo page-hero--contact">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / Contact</p>
          <h1>Contact the Otago Branch</h1>
          <p>Find us at our clubrooms, come along to a meeting, or get in touch through the channels below.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="info-grid" style={{ maxWidth: '960px', margin: '0 auto' }}>

            <div>
              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Clubrooms</h3>
                <ul className="detail-list">
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"/><circle cx="10" cy="7" r="2"/></svg></span>
                    <div><strong><a href="https://maps.google.com/?q=53+Malvern+Street+Woodhaugh+Dunedin" target="_blank" rel="noopener">53 Malvern Street, Woodhaugh, Dunedin 9010</a></strong></div>
                  </li>
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M3 10l1.5-4h11l1.5 4"/><rect x="2" y="10" width="16" height="5" rx="1"/><circle cx="6" cy="15" r="1.5"/><circle cx="14" cy="15" r="1.5"/></svg></span>
                    <div>Free on-street parking available. Northern Dunedin.</div>
                  </li>
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polygon points="1,4 7,1 13,4 19,1 19,17 13,20 7,17 1,20"/><line x1="7" y1="1" x2="7" y2="17"/><line x1="13" y1="4" x2="13" y2="20"/></svg></span>
                    <div><a href="https://maps.google.com/?q=53+Malvern+Street+Woodhaugh+Dunedin" target="_blank" rel="noopener">Open in Google Maps &rarr;</a></div>
                  </li>
                </ul>
              </div>

              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Monthly Meetings</h3>
                <ul className="detail-list">
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="4" width="14" height="14" rx="2"/><line x1="3" y1="8" x2="17" y2="8"/><line x1="7" y1="2" x2="7" y2="6"/><line x1="13" y1="2" x2="13" y2="6"/></svg></span>
                    <div><strong>2nd Monday of every month &#8211; 7:30pm start, doors open 7:00pm</strong></div>
                  </li>
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg></span>
                    <div>No meeting in January or April</div>
                  </li>
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span>
                    <div>Visitors and non-members are always welcome</div>
                  </li>
                </ul>
                <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="10" cy="8" r="3"/><path d="M5 18c0-2.76 2.24-5 5-5s5 2.24 5 5"/></svg>
                  <span>The best way to get answers, meet members, and stay up to date is to come along to a meeting.</span>
                </div>
              </div>

              <div className="info-box">
                <h3>Specialist Contacts</h3>
                <ul className="detail-list">
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><polyline points="3,4 10,11 17,4"/></svg></span>
                    <div><strong>Committee</strong> &#8211; <a href="mailto:info@otagodeerstalkers.co.nz">info@otagodeerstalkers.co.nz</a></div>
                  </li>
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M5 2h4l1.5 4L8 8a11 11 0 004 4l2-2.5L18 11v4a1 1 0 01-1 1C7 16 4 7 4 6a1 1 0 011-1z"/></svg></span>
                    <div><strong>HUNTS Course &#8211; Frans Laas</strong><br /><a href="tel:0272307157">027 230 7157</a></div>
                  </li>
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M3 10L10 3l7 7"/><path d="M5 8v9h4v-4h2v4h4V8"/></svg></span>
                    <div><strong>Lodge bookings</strong> &#8211; via key pickup retailers (Dunedin) or at a club meeting</div>
                  </li>
                  <li>
                    <span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="10" y1="15" x2="10" y2="18"/><line x1="2" y1="10" x2="5" y2="10"/><line x1="15" y1="10" x2="18" y2="10"/></svg></span>
                    <div><strong>Range closure updates</strong> &#8211; <a href="https://www.facebook.com/groups/1195200207197835/" target="_blank" rel="noopener">Chaz Forsyth Rifle Range Facebook Group</a></div>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Useful Links</h3>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M9 14H6a4 4 0 010-8h3"/><path d="M11 6h3a4 4 0 010 8h-3"/><line x1="8" y1="10" x2="12" y2="10"/></svg></span><div><a href="https://www.deerstalkers.org.nz/branches/south-island/otago/" target="_blank" rel="noopener">NZDA Otago Branch &#8211; national page</a></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M9 14H6a4 4 0 010-8h3"/><path d="M11 6h3a4 4 0 010 8h-3"/><line x1="8" y1="10" x2="12" y2="10"/></svg></span><div><a href="https://www.facebook.com/share/g/1M5wZNSjde/" target="_blank" rel="noopener">Otago Deerstalkers &#8211; Club Facebook Group</a></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M9 14H6a4 4 0 010-8h3"/><path d="M11 6h3a4 4 0 010 8h-3"/><line x1="8" y1="10" x2="12" y2="10"/></svg></span><div><a href="https://www.facebook.com/groups/1195200207197835/" target="_blank" rel="noopener">Chaz Forsyth Rifle Range Facebook Group</a></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M9 14H6a4 4 0 010-8h3"/><path d="M11 6h3a4 4 0 010 8h-3"/><line x1="8" y1="10" x2="12" y2="10"/></svg></span><div><a href="https://www.doc.govt.nz/parks-and-recreation/things-to-do/hunting/" target="_blank" rel="noopener">DOC &#8211; Hunting in New Zealand</a></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M9 14H6a4 4 0 010-8h3"/><path d="M11 6h3a4 4 0 010 8h-3"/><line x1="8" y1="10" x2="12" y2="10"/></svg></span><div><a href="https://www.fishandgame.org.nz/" target="_blank" rel="noopener">Fish &amp; Game NZ</a></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M9 14H6a4 4 0 010-8h3"/><path d="M11 6h3a4 4 0 010 8h-3"/><line x1="8" y1="10" x2="12" y2="10"/></svg></span><div><a href="https://www.colfo.org.nz/" target="_blank" rel="noopener">COLFO</a></div></li>
                </ul>
              </div>

              <div className="info-box" style={{ marginBottom: '1.5rem' }}>
                <h3>Lodge Key Pickup</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', marginBottom: '0.75rem' }}>Keys are collected from authorised Dunedin retailers. Show your current membership card.</p>
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><circle cx="8" cy="9" r="4"/><line x1="11.5" y1="12.5" x2="18" y2="19"/><line x1="15" y1="16" x2="17" y2="14"/></svg></span><div><strong>Elio&rsquo;s Gun Shop</strong> &#8211; 219 King Edward Street, South Dunedin</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><circle cx="8" cy="9" r="4"/><line x1="11.5" y1="12.5" x2="18" y2="19"/><line x1="15" y1="16" x2="17" y2="14"/></svg></span><div><strong>Hunting and Fishing</strong> &#8211; 18 Maclaggan Street, Dunedin</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><circle cx="8" cy="9" r="4"/><line x1="11.5" y1="12.5" x2="18" y2="19"/><line x1="15" y1="16" x2="17" y2="14"/></svg></span><div><strong>Gun City Dunedin</strong> &#8211; 96 Cumberland Street, Central Dunedin</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><circle cx="8" cy="9" r="4"/><line x1="11.5" y1="12.5" x2="18" y2="19"/><line x1="15" y1="16" x2="17" y2="14"/></svg></span><div><strong>Central Otago</strong> &#8211; Tony Alexander, <a href="tel:0274479398">027 447 9398</a></div></li>
                </ul>
                <Link href="/lodge" className="btn btn-outline" style={{ marginTop: '1rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Lodge details &rarr;</Link>
              </div>

              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18"><circle cx="10" cy="10" r="8"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none"/></svg>
                <span><strong>Membership enquiries:</strong> Membership is managed nationally. Visit <a href="https://www.deerstalkers.org.nz/" target="_blank" rel="noopener">the NZDA national website</a> or see our <Link href="/join">Join page</Link> for details.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="contact-strip">
        <div className="container">
          <div className="contact-strip-inner">
            <div>
              <h2>Come to a Meeting</h2>
              <p>The quickest way to get involved &#8211; visitors are always welcome.</p>
            </div>
            <div className="contact-items">
              <div className="contact-item">
                <span className="ci-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z"/><circle cx="10" cy="7" r="2"/></svg>
                </span>
                <div><strong>Clubrooms</strong><span><a href="https://maps.google.com/?q=53+Malvern+Street+Woodhaugh+Dunedin" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.9)' }}>53 Malvern St, Woodhaugh, Dunedin 9010</a></span></div>
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
