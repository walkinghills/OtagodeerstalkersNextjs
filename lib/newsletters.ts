import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const NEWSLETTERS_DIR = path.join(process.cwd(), 'content', 'newsletters')

const NewsletterFrontmatterSchema = z.object({
  slug:    z.string(),
  issue:   z.number().int().positive(),
  title:   z.string(),
  date:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  excerpt: z.string(),
})

export type NewsletterMeta = z.infer<typeof NewsletterFrontmatterSchema>

export interface Newsletter extends NewsletterMeta {
  content: string
}

export function getAllNewsletters(): NewsletterMeta[] {
  if (!fs.existsSync(NEWSLETTERS_DIR)) return []

  const files = fs.readdirSync(NEWSLETTERS_DIR).filter(f => f.endsWith('.md'))

  const newsletters = files.map(filename => {
    const raw = fs.readFileSync(path.join(NEWSLETTERS_DIR, filename), 'utf-8')
    const { data } = matter(raw)
    return NewsletterFrontmatterSchema.parse(data)
  })

  return newsletters.sort((a, b) => b.date.localeCompare(a.date))
}

export function getNewsletter(slug: string): Newsletter | null {
  const filepath = path.join(NEWSLETTERS_DIR, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null

  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  const meta = NewsletterFrontmatterSchema.parse(data)

  return { ...meta, content }
}

export function getAllNewsletterSlugs(): string[] {
  if (!fs.existsSync(NEWSLETTERS_DIR)) return []
  return fs
    .readdirSync(NEWSLETTERS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}

export function formatNewsletterDate(isoDate: string): string {
  const [year, month] = isoDate.split('-').map(Number)
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December']
  return `${MONTHS[month - 1]} ${year}`
}
