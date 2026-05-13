import { SITE_URL } from './siteConfig'

const ORG_NAME = 'NZDA Otago Branch'
const ORG_LEGAL_NAME = 'New Zealand Deerstalkers Association — Otago Branch'
const NATIONAL_URL = 'https://www.deerstalkers.org.nz'
const CLUBROOMS_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '53 Malvern Street',
  addressLocality: 'Woodhaugh',
  addressRegion: 'Dunedin',
  postalCode: '9010',
  addressCountry: 'NZ',
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: ORG_NAME,
    legalName: ORG_LEGAL_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      'The Otago Branch of the New Zealand Deerstalkers Association. Recreational hunting club serving Otago, with a member rifle range, backcountry lodge, club hunts, and the HUNTS hunter education course.',
    address: CLUBROOMS_ADDRESS,
    sameAs: [
      NATIONAL_URL,
      'https://www.facebook.com/groups/1195200207197835/',
    ],
    parentOrganization: {
      '@type': 'SportsOrganization',
      name: 'New Zealand Deerstalkers Association',
      url: NATIONAL_URL,
    },
  }
}

export function rifleRangeSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'Chaz Forsyth Rifle Range',
    url: `${SITE_URL}/range`,
    description:
      'Member-operated rifle range on Leith Valley Road, Dunedin. Open most Saturdays 1pm to 4pm. Members $5 per visit, non-members $10.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Leith Valley Road',
      addressLocality: 'Dunedin',
      addressCountry: 'NZ',
    },
    parentOrganization: { '@type': 'SportsOrganization', name: ORG_NAME, url: SITE_URL },
    sport: 'Rifle shooting',
  }
}

export function lodgeSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Blue Mountains Lodge',
    url: `${SITE_URL}/lodge`,
    description:
      'NZDA Otago Branch backcountry lodge at Beaumont, ~1h20 from Dunedin. Otago Branch members $10 per night. Keys collected from authorised Dunedin retailers.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '65 Rongahere Road',
      addressLocality: 'Beaumont',
      postalCode: '9591',
      addressCountry: 'NZ',
    },
    parentOrganization: { '@type': 'SportsOrganization', name: ORG_NAME, url: SITE_URL },
  }
}

export function huntsCourseSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'HUNTS Course (Hunter education programme)',
    url: `${SITE_URL}/hunts-course`,
    description:
      'NZDA nationally recognised hunter training programme. Field skills, hunting and firearms, ethics, navigation. Local coordinator: Frans Laas.',
    provider: { '@type': 'SportsOrganization', name: ORG_NAME, url: SITE_URL },
    courseMode: 'blended',
    inLanguage: 'en-NZ',
  }
}

export function joinFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function articleSchema(opts: { title: string; description: string; url: string; datePublished: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    url: opts.url,
    publisher: { '@type': 'SportsOrganization', name: ORG_NAME, url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
  }
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}

export function jsonLdScript(schema: unknown) {
  return {
    __html: JSON.stringify(schema),
  }
}
