'use client'

import { useState } from 'react'

export default function FooterCredit() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Website enquiry from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:smartinbulfin@gmail.com?subject=${subject}&body=${body}`
    setOpen(false)
  }

  return (
    <>
      <div className="footer-credit">
        Designed, coded &amp; published by{' '}
        <button className="footer-credit-btn" onClick={() => setOpen(true)}>
          Sal Martin
        </button>
      </div>

      {open && (
        <div className="fc-overlay" onClick={() => setOpen(false)}>
          <div className="fc-modal" onClick={e => e.stopPropagation()}>
            <button className="fc-close" onClick={() => setOpen(false)} aria-label="Close">&times;</button>
            <h3>Get in touch</h3>
            <p>Send a message to Sal Martin, the designer and developer of this site.</p>
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
              </label>
              <label>
                Message
                <textarea value={message} onChange={e => setMessage(e.target.value)} required placeholder="What would you like to say?" rows={4} />
              </label>
              <button type="submit" className="fc-submit">Send Message</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
