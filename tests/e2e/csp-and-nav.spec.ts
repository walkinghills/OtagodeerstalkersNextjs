import { test, expect } from '@playwright/test'

const PAGES = ['/', '/range', '/lodge', '/club-hunts', '/hunts-course', '/competitions', '/join', '/contact', '/newsletters']

test.describe('Security headers', () => {
  test('CSP header is present on home page', async ({ request }) => {
    const response = await request.get('/')
    const csp = response.headers()['content-security-policy']
    expect(csp).toBeTruthy()
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
  })

  test('X-Frame-Options header is set', async ({ request }) => {
    const response = await request.get('/')
    expect(response.headers()['x-frame-options']).toBe('SAMEORIGIN')
  })

  test('X-Content-Type-Options header is set', async ({ request }) => {
    const response = await request.get('/')
    expect(response.headers()['x-content-type-options']).toBe('nosniff')
  })
})

test.describe('Navigation', () => {
  for (const path of PAGES) {
    test(`${path} loads and has site header`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('header.site-header')).toBeVisible()
      await expect(page.locator('footer.site-footer')).toBeVisible()
    })
  }

  test('nav links are all present on home page', async ({ page }) => {
    await page.goto('/')
    const navLinks = page.locator('nav .nav-links a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThanOrEqual(8)
  })

  test('404 page renders not-found content', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.locator('h1')).toContainText('Page Not Found')
  })
})

test.describe('Old .html URL redirects', () => {
  const redirects: [string, string][] = [
    ['/range.html', '/range'],
    ['/lodge.html', '/lodge'],
    ['/join.html', '/join'],
    ['/contact.html', '/contact'],
  ]

  for (const [from, to] of redirects) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      const response = await page.goto(from)
      expect(page.url()).toContain(to)
      expect(response?.status()).toBe(200)
    })
  }
})
