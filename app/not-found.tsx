import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist. Find your way back to the Otago Deerstalkers website.",
}

export default function NotFound() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Page Not Found</h1>
          <p>That page doesn&rsquo;t exist or may have moved. Try one of the pages below to find what you&rsquo;re looking for.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-mid)', marginBottom: '2.5rem' }}>Try one of these pages instead:</p>
          <div className="quick-links" style={{ marginTop: 0 }}>
            <Link href="/" className="ql-card">
              <div className="ql-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M3 10L10 3l7 7"/><path d="M5 8v9h4v-4h2v4h4V8"/></svg>
              </div>
              <h3>Home</h3>
              <p>Start from the beginning.</p>
            </Link>
            <Link href="/range" className="ql-card">
              <div className="ql-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="28" height="28"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="10" y1="15" x2="10" y2="18"/><line x1="2" y1="10" x2="5" y2="10"/><line x1="15" y1="10" x2="18" y2="10"/></svg>
              </div>
              <h3>Range</h3>
              <p>Chaz Forsyth Rifle Range.</p>
            </Link>
            <Link href="/lodge" className="ql-card">
              <div className="ql-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M2 10L10 2l8 8"/><path d="M4 8.5v9h5v-4h2v4h5v-9"/><line x1="8" y1="6" x2="8" y2="8"/></svg>
              </div>
              <h3>Lodge</h3>
              <p>Blue Mountains Lodge.</p>
            </Link>
            <Link href="/hunts-course" className="ql-card">
              <div className="ql-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M4 2h9a2 2 0 012 2v14l-5-3-5 3V4a2 2 0 012-2z"/></svg>
              </div>
              <h3>HUNTS Course</h3>
              <p>Hunter education.</p>
            </Link>
            <Link href="/join" className="ql-card">
              <div className="ql-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><polyline points="4,10 8,15 16,6"/></svg>
              </div>
              <h3>Join</h3>
              <p>Become a member.</p>
            </Link>
            <Link href="/contact" className="ql-card">
              <div className="ql-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><rect x="2" y="4" width="16" height="12" rx="2"/><polyline points="2,4 10,11 18,4"/></svg>
              </div>
              <h3>Contact</h3>
              <p>Get in touch.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
