import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'HUNTS Course',
  description: 'HUNTS – Hunter National Training Scheme. New to hunting? Learn safe and responsible hunting from experienced NZDA instructors.',
  openGraph: { title: 'HUNTS Hunter Education Course – NZDA Otago Branch', description: 'HUNTS – Hunter National Training Scheme. New to hunting? Learn safe and responsible hunting from experienced NZDA instructors.' },
  alternates: { canonical: SITE_URL + '/hunts-course' },
}

export default function HuntsCoursePage() {
  return (
    <>
      <section className="page-hero page-hero--photo page-hero--hunts">
        <div className="container">
          <p className="breadcrumb"><Link href="/">Home</Link> / HUNTS Course</p>
          <h1>HUNTS Course</h1>
          <p>Hunter National Training Scheme &#8211; New Zealand&rsquo;s nationally recognised programme for safe and responsible hunting, run by NZDA in partnership with Fish &amp; Game NZ.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-row">
            <div className="feature-content">
              <h2>What is the HUNTS Course?</h2>
              <p><strong>HUNTS (Hunter National Training Scheme)</strong> was established in 1987 and has since trained thousands of New Zealand hunters in safe, ethical, and competent hunting practice. It is administered by the NZDA in partnership with Fish &amp; Game NZ.</p>
              <p>The programme is designed primarily for new hunters aged 18 and over, covering everything from gear selection and bush navigation to game identification, firearms safety, and emergency preparedness &#8211; both in the classroom and out in the field. Younger participants are welcome with guardian approval. A firearms licence is preferred but not required to enrol.</p>
              <h2 style={{ marginTop: '1.5rem' }}>Course Schedule</h2>
              <div className="alert alert-warning" style={{ margin: '1rem 0' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="4" width="14" height="14" rx="2"/><line x1="3" y1="8" x2="17" y2="8"/><line x1="7" y1="2" x2="7" y2="6"/><line x1="13" y1="2" x2="13" y2="6"/></svg>
                <span>Courses run <strong>approximately once per year</strong>, subject to demand. The next course date will be confirmed at club meetings or directly by the coordinator.</span>
              </div>
              <ul className="detail-list" style={{ marginBottom: '1.5rem' }}>
                <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>16 hours of theory &#8211; split across evening sessions</div></li>
                <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>4 field days &#8211; weekends, including at least one overnight</div></li>
                <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Typical duration: 4&#8211;6 weeks from first session to completion</div></li>
                <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Places are limited &#8211; register early to secure a spot</div></li>
              </ul>
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M6.5 2h7C14.3 2 15 2.7 15 3.5v13c0 .8-.7 1.5-1.5 1.5h-7C5.7 18 5 17.3 5 16.5v-13C5 2.7 5.7 2 6.5 2z"/><line x1="8" y1="6" x2="12" y2="6"/><line x1="8" y1="9" x2="12" y2="9"/><line x1="8" y1="12" x2="10" y2="12"/></svg>
                <span><strong>To register:</strong> Contact Frans Laas on <a href="tel:0272307157" style={{ fontWeight: 600 }}>027 230 7157</a></span>
              </div>
            </div>
            <div className="feature-visual feature-visual--collage">
              <div className="collage-img">
                <img src="/images/hunts-course-field.jpeg" alt="HUNTS course participants at a river crossing field session" />
              </div>
              <div className="collage-img">
                <img src="/images/hunts-course-tracking.jpeg" alt="HUNTS course indoor session — plant and habitat identification" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <h2>What You&rsquo;ll Learn</h2>
            <div className="divider"></div>
          </div>
          <div className="cards-grid">
            <div className="card">
              <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polygon points="1,4 7,1 13,4 19,1 19,17 13,20 7,17 1,20"/><line x1="7" y1="1" x2="7" y2="17"/><line x1="13" y1="4" x2="13" y2="20"/></svg>
                <h3>Field Skills</h3>
              </div>
              <div className="card-body">
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Clothing and gear selection for backcountry conditions</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Bush travel, navigation, and river crossings</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Weather awareness and decision-making</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Emergency preparedness and first aid</div></li>
                </ul>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M10 4 C8 2 5 2 4 4 C3 6 4 8 6 9 L9 14 L8 18 L10 17 L12 18 L11 14 L14 9 C16 8 17 6 16 4 C15 2 12 2 10 4Z"/><path d="M6 9 C4 7 2 7 2 9"/><path d="M14 9 C16 7 18 7 18 9"/></svg>
                <h3>Hunting &amp; Firearms</h3>
              </div>
              <div className="card-body">
                <ul className="detail-list">
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Game species identification</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Hunting methods and ethics</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Meat and trophy preservation</div></li>
                  <li><span className="di"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="4,10 8,15 16,6"/></svg></span><div>Firearms safety, shooting technique, and sighting</div></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-heading">
            <h2>Register Your Interest</h2>
            <div className="divider"></div>
          </div>
<div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div className="info-box">
              <h3>Contact to Enrol</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-mid)', marginBottom: '1.25rem' }}>To register for the next HUNTS course, get in touch with our course coordinator directly:</p>
              <div className="contact-item" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                <span className="ci-icon" style={{ color: 'var(--amber-600)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><circle cx="10" cy="7" r="4"/><path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7"/></svg>
                </span>
                <div>
                  <strong>Frans Laas</strong>
                  <span style={{ display: 'block', color: 'var(--text-mid)' }}>HUNTS Course Coordinator</span>
                </div>
              </div>
              <a href="tel:0272307157" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ verticalAlign: 'middle', marginRight: '0.4rem' }}><path d="M5 2h4l1.5 4L8 8a11 11 0 004 4l2-2.5L18 11v4a1 1 0 01-1 1C7 16 4 7 4 6a1 1 0 011-1z"/></svg>
                027 230 7157
              </a>
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
