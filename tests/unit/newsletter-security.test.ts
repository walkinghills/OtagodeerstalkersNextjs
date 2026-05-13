import { describe, it, expect } from 'vitest'
import { getAllNewsletters, getNewsletter, formatNewsletterDate } from '@/lib/newsletters'

describe('getAllNewsletters', () => {
  it('returns an array', () => {
    const newsletters = getAllNewsletters()
    expect(Array.isArray(newsletters)).toBe(true)
  })

  it('returns newsletters sorted newest first', () => {
    const newsletters = getAllNewsletters()
    for (let i = 1; i < newsletters.length; i++) {
      expect(newsletters[i - 1].date >= newsletters[i].date).toBe(true)
    }
  })

  it('each newsletter has required fields', () => {
    const newsletters = getAllNewsletters()
    for (const nl of newsletters) {
      expect(typeof nl.slug).toBe('string')
      expect(typeof nl.issue).toBe('number')
      expect(typeof nl.title).toBe('string')
      expect(nl.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof nl.excerpt).toBe('string')
    }
  })
})

describe('getNewsletter', () => {
  it('returns null for unknown slug', () => {
    expect(getNewsletter('does-not-exist')).toBeNull()
  })

  it('returns newsletter content for 2026-03', () => {
    const nl = getNewsletter('2026-03')
    expect(nl).not.toBeNull()
    expect(nl?.slug).toBe('2026-03')
    expect(nl?.issue).toBe(1)
    expect(typeof nl?.content).toBe('string')
    expect(nl?.content.length).toBeGreaterThan(0)
  })

  it('newsletter content does not contain raw script tags', () => {
    const nl = getNewsletter('2026-03')
    expect(nl?.content).not.toMatch(/<script\b/i)
  })
})

describe('formatNewsletterDate', () => {
  it('formats ISO date to Month YYYY', () => {
    expect(formatNewsletterDate('2026-03-13')).toBe('March 2026')
    expect(formatNewsletterDate('2026-12-01')).toBe('December 2026')
    expect(formatNewsletterDate('2025-01-15')).toBe('January 2025')
  })
})
