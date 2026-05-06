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
          <div style={{ textAlign: 'center' }}>
            <a href="https://www.deerstalkers.org.nz/branches/south-island/otago/" target="_blank" rel="noopener" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>Join Now via NZDA &rarr;</a>
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
