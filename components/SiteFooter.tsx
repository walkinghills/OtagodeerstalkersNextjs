import Link from 'next/link'
import FooterCredit from './FooterCredit'
import JoinButton from './JoinButton'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src="https://www.deerstalkers.org.nz/_resources/themes/NZDANational/images/logo-gold-white-text.svg"
              alt="NZDA Logo"
              className="footer-logo"
            />
            <p>The Otago Branch of the New Zealand Deerstalkers Association. Representing hunters across the Otago region.</p>
          </div>
          <div className="footer-col">
            <h4>Pages</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/range">Chaz Forsyth Rifle Range</Link></li>
              <li><Link href="/lodge">Blue Mountains Lodge</Link></li>
              <li><Link href="/club-hunts">Club Hunts</Link></li>
              <li><Link href="/hunts-course">HUNTS Course</Link></li>
              <li><Link href="/competitions">Competitions</Link></li>
              <li><JoinButton>Join</JoinButton></li>
              <li><Link href="/newsletters">Newsletter</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Links</h4>
            <ul>
              <li><a href="https://www.deerstalkers.org.nz/" target="_blank" rel="noopener">NZDA National</a></li>
              <li><a href="https://www.deerstalkers.org.nz/branches/south-island/otago/" target="_blank" rel="noopener">Otago Branch Page</a></li>
              <li><a href="https://www.facebook.com/share/g/1M5wZNSjde/" target="_blank" rel="noopener">Club Facebook Group</a></li>
              <li><a href="https://www.facebook.com/groups/1195200207197835/" target="_blank" rel="noopener">Range Facebook Group</a></li>
              <li><a href="https://www.fishandgame.org.nz/" target="_blank" rel="noopener">Fish &amp; Game NZ</a></li>
              <li><a href="https://www.doc.govt.nz/parks-and-recreation/things-to-do/hunting/" target="_blank" rel="noopener">DOC: Hunting Info</a></li>
              <li><a href="https://www.colfo.org.nz/" target="_blank" rel="noopener">COLFO</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 NZDA Otago Branch. All rights reserved.</span>
          <a href="https://www.deerstalkers.org.nz/" target="_blank" rel="noopener">deerstalkers.org.nz</a>
        </div>
        <p className="footer-privacy">We use anonymous traffic analytics (Vercel, Cloudflare) and a Meta pixel for future Facebook page promotion. No cross-site tracking. Data is not sold.</p>
        <FooterCredit />
      </div>
    </footer>
  )
}
