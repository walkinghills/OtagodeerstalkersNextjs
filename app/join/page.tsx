import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Join',
  description: 'Join the NZDA Otago Branch and gain access to the Chaz Forsyth Rifle Range, Blue Mountains Lodge, club hunts, and more.',
  openGraph: { title: 'Join the Otago Deerstalkers – NZDA', description: 'Join the NZDA Otago Branch and gain access to the Chaz Forsyth Rifle Range, Blue Mountains Lodge, club hunts, and more.' },
  alternates: { canonical: SITE_URL + '/join' },
}

export default function JoinPage() {
  return (
    <>
      <section className="page-hero page-hero--photo page-hero--join">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / Join</p>
          <h1>Join the Otago Branch</h1>
          <p>Become a member of the NZDA Otago Branch and connect with a community of hunters across the region.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-row feature-row--benefits">
            <div className="feature-content">
              <h2>More than a membership card</h2>
              <p>NZDA Otago membership is your way into a wider community of New Zealand hunters, with practical perks that more than cover the annual fee.</p>
              <div className="benefits-grid">
                <div className="benefit">
                  <h4>Chaz Forsyth Rifle Range</h4>
                  <p>$5/session for members, $10 non-members.</p>
                </div>
                <div className="benefit">
                  <h4>Blue Mountains Lodge</h4>
                  <p>$10/night for Otago Branch members.</p>
                </div>
                <div className="benefit">
                  <h4>Club Hunts</h4>
                  <p>Organised hunts for deer, goat, and tahr.</p>
                </div>
                <div className="benefit">
                  <h4>HUNTS Course</h4>
                  <p>Nationally recognised hunter education.</p>
                </div>
                <div className="benefit">
                  <h4>NZ Hunting &amp; Wildlife</h4>
                  <p>Quarterly NZDA magazine to your door.</p>
                </div>
                <div className="benefit">
                  <h4>Public Liability Insurance</h4>
                  <p>Cover for hunting and NZDA activities.</p>
                </div>
                <div className="benefit">
                  <h4>Advocacy</h4>
                  <p>A voice for hunters on legislation and land access.</p>
                </div>
                <div className="benefit">
                  <h4>Branch Meetings</h4>
                  <p>Guest speakers second Monday of every month.</p>
                </div>
              </div>
            </div>
            <aside className="feature-visual feature-visual--app">
              <a href="https://www.deerstalkers.org.nz/membership/members/app" target="_blank" rel="noopener" className="app-promo">
                <img src="/images/nzda/Copy-of-APP-Homepage-Ads.png" alt="Download the official NZDA app" />
              </a>
              <p className="feature-visual-caption">Members get free access to the NZDA app and 50+ partner discounts &mdash; see below.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>Discounts at 50+ retail and service partners</h2>
            <div className="divider"></div>
            <p>Your NZDA membership unlocks ongoing discounts through the Deerstalkers App &mdash; from your weekly fuel to a backcountry helicopter flight.</p>
          </div>

          <div className="partner-grid">
            <figure className="partner-tile"><img src="/images/nzda/Heli-Sika.jpg" alt="Helisika" /><figcaption><strong>Helisika</strong>10% off helicopter flights</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/Murchison-Heli-Tours.jpg" alt="Murchison Heli Tours" /><figcaption><strong>Murchison Heli Tours</strong>10% off flights</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/DOC-Back-Country-Hut-Pass.jpg" alt="Department of Conservation" /><figcaption><strong>Department of Conservation</strong>20% off Backcountry Hut Pass</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/Interislander.jpg" alt="Interislander Ferry" /><figcaption><strong>Interislander Ferry</strong>Group booking discount</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/Swazi-Pro-Deal.jpg" alt="Swazi" /><figcaption><strong>Swazi</strong>Pro Deal trade pricing</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/Kilwell.jpg" alt="Kilwell Sports" /><figcaption><strong>Kilwell Sports</strong>15% off web orders</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/Bush-Life-NZ.jpg" alt="Bush Life NZ" /><figcaption><strong>Bush Life NZ</strong>20% off web orders</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/AJ-Productions.jpg" alt="AJ Productions" /><figcaption><strong>AJ Productions</strong>10% off game callers and trail cameras</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/Twin-Needle.jpg" alt="TwinNeedle" /><figcaption><strong>TwinNeedle</strong>10% off gear repairs</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/Parachute-First-Aid-v2.jpg" alt="Parachute First Aid" /><figcaption><strong>Parachute First Aid</strong>15% off Wilderness First Aid Kit</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/Go-Native.jpg" alt="Go Native" /><figcaption><strong>Go Native</strong>20% off outdoor meals and snacks</figcaption></figure>
            <figure className="partner-tile"><img src="/images/nzda/NZ-Taxidermy-Ltd.jpg" alt="NZ Taxidermy" /><figcaption><strong>NZ Taxidermy</strong>10% off mounts</figcaption></figure>
          </div>

          <p className="partner-note">Plus Go Fuel, and dozens more across insurance, retail, freight, and outdoor brands. Full list visible inside the NZDA app.</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>How to Join</h2>
            <div className="divider"></div>
            <p>Membership is managed through the NZDA national website. It takes just a few minutes to sign up online.</p>
          </div>

          <div className="cards-grid" style={{ maxWidth: '900px', margin: '0 auto 2.5rem' }}>
            <div className="card">
              <div className="card-header">
                <span className="icon">1</span>
                <h3>Visit the National Site</h3>
              </div>
              <div className="card-body">
                <p>Head to the NZDA Otago Branch page on the national website to access the membership form.</p>
                <a href="https://www.deerstalkers.org.nz/branches/south-island/otago/" target="_blank" rel="noopener" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Go to Membership Form &rarr;</a>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="icon">2</span>
                <h3>Complete the Form</h3>
              </div>
              <div className="card-body">
                <p>Fill in your details and select the <strong>Otago Branch</strong> as your local branch. Membership fees are collected at this step.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <span className="icon">3</span>
                <h3>What Happens Next</h3>
              </div>
              <div className="card-body">
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>You&rsquo;ll receive a <strong>membership card</strong> by post. Allow 1 to 2 weeks.</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Bring your card to the <strong>range</strong> for the $5 member rate</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Show your card at any key pickup location to <strong>access the lodge</strong></div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Come along to the next <strong>club meeting</strong>: 2nd Monday, 7:30pm, 53 Malvern St</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>You&rsquo;ll also receive the <strong>NZ Hunting &amp; Wildlife</strong> magazine quarterly</div></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="alert alert-success" style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="10" cy="8" r="3"/><path d="M5 18c0-2.76 2.24-5 5-5s5 2.24 5 5"/></svg>
            <span><strong>New to the branch?</strong> Introduce yourself at the next club meeting. The committee and members are happy to help you get oriented, whether you&rsquo;re new to hunting or an experienced hunter looking for a community.</span>
          </div>

          <div className="alert alert-info" style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18"><circle cx="10" cy="10" r="8"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none"/></svg>
            <span>Membership is administered nationally by NZDA. If you have questions specific to the Otago Branch, attend any club meeting on the <strong>2nd Monday of the month at 7:30pm</strong> at 53 Malvern Street, Woodhaugh, Dunedin.</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="https://www.deerstalkers.org.nz/branches/south-island/otago/" target="_blank" rel="noopener" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>Join Now via NZDA &rarr;</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>What Members Get</h2>
            <div className="divider"></div>
          </div>
          <div className="cards-grid">
            <div className="card">
              <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="10" y1="15" x2="10" y2="18"/><line x1="2" y1="10" x2="5" y2="10"/><line x1="15" y1="10" x2="18" y2="10"/></svg>
                <h3>Range Access</h3>
              </div>
              <div className="card-body">
                <p>Use the Chaz Forsyth Rifle Range at the members rate of <strong>$5 per session</strong>. Non-members pay $10. Your membership card is required at the gate.</p>
                <Link href="/range" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Range Info &rarr;</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M3 10L10 3l7 7"/><path d="M5 8v9h4v-4h2v4h4V8"/></svg>
                <h3>Lodge Access</h3>
              </div>
              <div className="card-body">
                <p>Book the Blue Mountains Lodge at <strong>$10/night</strong> (Otago members), including bunkhouse and private huts. Keys collected from authorised Dunedin retailers.</p>
                <Link href="/lodge" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Lodge Info &rarr;</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20"><path d="M17 3C17 3 8 3 4 8c-2 2.5-2 6 0 8.5 0 0 4-1.5 7-5"/><path d="M4 16.5L10 10"/></svg>
                <h3>Club Hunts</h3>
              </div>
              <div className="card-body">
                <p>Join organised hunts for deer, goat, tahr, and wallaby. At least two main hunts per year, plus inter-branch events.</p>
                <Link href="/club-hunts" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>Hunt Info &rarr;</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="5" y="2" width="10" height="16" rx="2"/><line x1="8" y1="6" x2="12" y2="6"/><line x1="8" y1="9" x2="12" y2="9"/><circle cx="10" cy="13" r="1"/></svg>
                <h3>Deerstalkers App</h3>
              </div>
              <div className="card-body">
                <p>NZDA membership includes access to the Deerstalkers App: <strong>50+ member discount partners</strong> across New Zealand, from ammo to taxidermy.</p>
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
