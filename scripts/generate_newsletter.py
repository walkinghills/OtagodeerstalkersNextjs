#!/usr/bin/env python3
"""
Otago Deerstalkers – Newsletter Generator
==========================================
Called by the GitHub Actions workflow (publish-newsletter.yml).

Reads from environment variables:
  ISSUE_NUMBER  – e.g. "3"
  TITLE         – e.g. "April 2026 – Hunt Results & Lodge Bookings"
  DATE          – e.g. "2026-04-14"  (YYYY-MM-DD)

Reads content from:
  /tmp/newsletter_content.txt  – plain text or simple HTML body

Outputs:
  newsletters/YYYY-MM.html     – the new newsletter page
  newsletters/index.html       – updated archive listing (new card prepended)
"""

import os
import re
import html
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
ISSUE_NUMBER = os.environ.get("ISSUE_NUMBER", "1")
TITLE        = os.environ.get("TITLE", "Newsletter")
DATE_STR     = os.environ.get("DATE", datetime.today().strftime("%Y-%m-%d"))

try:
    date_obj = datetime.strptime(DATE_STR, "%Y-%m-%d")
except ValueError:
    date_obj = datetime.today()

MONTH_YEAR   = date_obj.strftime("%B %Y")          # e.g. "April 2026"
FILE_SLUG    = date_obj.strftime("%Y-%m")           # e.g. "2026-04"
DATETIME_ATTR = date_obj.strftime("%Y-%m-%d")       # for <time datetime="">
OUTPUT_FILE  = Path(f"newsletters/{FILE_SLUG}.html")
INDEX_FILE   = Path("newsletters/index.html")

# ---------------------------------------------------------------------------
# Read content
# ---------------------------------------------------------------------------
content_path = Path("/tmp/newsletter_content.txt")
if content_path.exists():
    raw_content = content_path.read_text(encoding="utf-8").strip()
else:
    raw_content = ""

def plain_text_to_html(text: str) -> str:
    """
    Convert plain-text email body to structured HTML sections.
    Rules:
      - Lines starting with # or ALL CAPS (5+ chars) become <h2> headings
      - Blank lines separate paragraphs
      - Lines starting with - or * become <ul> list items
      - Everything else is a <p>
    """
    lines = text.splitlines()
    out   = []
    in_ul = False

    for line in lines:
        stripped = line.strip()

        if not stripped:
            if in_ul:
                out.append("</ul>")
                in_ul = False
            out.append("")          # paragraph break
            continue

        # Heading detection: starts with # or is ALL CAPS word (5+ chars)
        if stripped.startswith("#"):
            if in_ul: out.append("</ul>"); in_ul = False
            heading = stripped.lstrip("#").strip()
            section_id = re.sub(r"[^a-z0-9]+", "-", heading.lower()).strip("-")
            out.append(f'<h2 id="{section_id}">{html.escape(heading)}</h2>')

        elif re.match(r"^[A-Z][A-Z\s]{4,}$", stripped):
            if in_ul: out.append("</ul>"); in_ul = False
            section_id = re.sub(r"[^a-z0-9]+", "-", stripped.lower()).strip("-")
            out.append(f'<h2 id="{section_id}">{html.escape(stripped.title())}</h2>')

        # List item
        elif stripped.startswith(("- ", "* ", "• ")):
            if not in_ul:
                out.append('<ul class="nl-list">')
                in_ul = True
            item = stripped[2:].strip()
            out.append(f"  <li>{html.escape(item)}</li>")

        # Normal paragraph line
        else:
            if in_ul: out.append("</ul>"); in_ul = False
            out.append(f"<p>{html.escape(stripped)}</p>")

    if in_ul:
        out.append("</ul>")

    # Merge consecutive <p> lines separated by empty string (blank line = new para already)
    return "\n".join(out)


# If content looks like it already contains HTML tags, use it mostly as-is
if re.search(r"<(p|h[2-4]|ul|li|div)\b", raw_content, re.I):
    body_html = raw_content
else:
    body_html = plain_text_to_html(raw_content)

# Extract a short excerpt for the archive card (first 200 chars of plain text)
excerpt_plain = re.sub(r"<[^>]+>", "", body_html)[:200].strip()
if len(excerpt_plain) == 200:
    excerpt_plain = excerpt_plain.rsplit(" ", 1)[0] + "…"

# Build table of contents from h2 headings in body
toc_items = re.findall(r'<h2[^>]*id="([^"]+)"[^>]*>([^<]+)</h2>', body_html)

toc_html = ""
if toc_items:
    toc_html = "<aside class=\"newsletter-toc\"><h3>In This Edition</h3><ol>"
    for anchor, label in toc_items:
        toc_html += f'<li><a href="#{anchor}">{label}</a></li>'
    toc_html += "</ol></aside>"

# ---------------------------------------------------------------------------
# Newsletter page template
# ---------------------------------------------------------------------------
nav_links = """
        <li><a href="../index.html">Home</a></li>
        <li><a href="../range.html">Range</a></li>
        <li><a href="../lodge.html">Lodge</a></li>
        <li><a href="../club-hunts.html">Club Hunts</a></li>
        <li><a href="../hunts-course.html">HUNTS Course</a></li>
        <li><a href="../competitions.html">Competitions</a></li>
        <li><a href="index.html" class="active">Newsletter</a></li>
        <li><a href="../contact.html">Contact</a></li>
        <li><a href="../join.html" class="btn-join">Join</a></li>"""

footer_pages = """
          <li><a href="../index.html">Home</a></li>
          <li><a href="../range.html">Leith Valley Range</a></li>
          <li><a href="../lodge.html">Blue Mountains Lodge</a></li>
          <li><a href="../club-hunts.html">Club Hunts</a></li>
          <li><a href="../hunts-course.html">HUNTS Course</a></li>
          <li><a href="../competitions.html">Competitions</a></li>
          <li><a href="index.html">Newsletter</a></li>
          <li><a href="../join.html">Join</a></li>
          <li><a href="../contact.html">Contact</a></li>"""

page_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Newsletter Issue #{ISSUE_NUMBER} – {MONTH_YEAR} | Otago Deerstalkers</title>
  <meta name="description" content="{html.escape(TITLE)} — NZDA Otago Branch newsletter." />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Otago Deerstalkers Newsletter – {MONTH_YEAR}" />
  <meta property="og:description" content="{html.escape(TITLE)}" />
  <meta property="og:site_name" content="Otago Deerstalkers – NZDA" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body>

<header class="site-header">
  <div class="container">
    <nav class="nav-inner">
      <a href="../index.html" class="nav-brand">
        <img src="https://www.deerstalkers.org.nz/_resources/themes/NZDANational/images/logo-white-white-text.svg" alt="NZDA Logo" class="nav-logo" />
        <div class="nav-brand-text">Otago Branch<span>New Zealand Deerstalkers Association</span></div>
      </a>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">{nav_links}
      </ul>
    </nav>
  </div>
</header>

<section class="newsletter-masthead">
  <div class="container">
    <div class="newsletter-meta-bar">
      <a href="index.html" class="newsletter-back">← All Editions</a>
      <span class="newsletter-issue-badge">Issue #{ISSUE_NUMBER}</span>
    </div>
    <h1>{html.escape(TITLE)}</h1>
    <div class="newsletter-dateline">
      <time datetime="{DATETIME_ATTR}">{MONTH_YEAR}</time>
      <span class="newsletter-branch">NZDA Otago Branch</span>
    </div>
  </div>
</section>

<main class="newsletter-body">
  <div class="container newsletter-container">
    {toc_html}
    <article class="newsletter-content">
{body_html}
    </article>
  </div>
</main>

<section class="newsletter-edition-nav">
  <div class="container">
    <a href="index.html" class="btn btn-outline">← Back to All Editions</a>
  </div>
</section>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="https://www.deerstalkers.org.nz/_resources/themes/NZDANational/images/logo-gold-white-text.svg" alt="NZDA Logo" class="footer-logo" />
        <p>The Otago Branch of the New Zealand Deerstalkers Association. Representing hunters and recreational shooters across the Otago region.</p>
      </div>
      <div class="footer-col"><h4>Pages</h4><ul>{footer_pages}
      </ul></div>
      <div class="footer-col"><h4>Links</h4><ul>
          <li><a href="https://www.deerstalkers.org.nz/" target="_blank" rel="noopener">NZDA National</a></li>
          <li><a href="https://www.deerstalkers.org.nz/branches/south-island/otago/" target="_blank" rel="noopener">Otago Branch Page</a></li>
          <li><a href="https://www.facebook.com/groups/1195200207197835/" target="_blank" rel="noopener">Range Facebook Group</a></li>
          <li><a href="https://www.fishandgame.org.nz/" target="_blank" rel="noopener">Fish &amp; Game NZ</a></li>
          <li><a href="https://www.doc.govt.nz/parks-and-recreation/things-to-do/hunting/" target="_blank" rel="noopener">DOC – Hunting Info</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; {date_obj.year} NZDA Otago Branch. All rights reserved.</span>
      <a href="https://www.deerstalkers.org.nz/" target="_blank" rel="noopener">deerstalkers.org.nz</a>
    </div>
  </div>
</footer>

<script src="../js/main.js"></script>
</body>
</html>
"""

# ---------------------------------------------------------------------------
# Write newsletter page
# ---------------------------------------------------------------------------
OUTPUT_FILE.write_text(page_html, encoding="utf-8")
print(f"✓ Written: {OUTPUT_FILE}")

# ---------------------------------------------------------------------------
# Update newsletters/index.html – prepend new card inside ARCHIVE markers
# ---------------------------------------------------------------------------
index_content = INDEX_FILE.read_text(encoding="utf-8")

new_card = f"""
      <article class="newsletter-card">
        <div class="newsletter-card-meta">
          <span class="newsletter-issue">Issue #{ISSUE_NUMBER}</span>
          <time class="newsletter-date" datetime="{DATETIME_ATTR}">{MONTH_YEAR}</time>
        </div>
        <div class="newsletter-card-body">
          <h3><a href="{FILE_SLUG}.html">{html.escape(TITLE)}</a></h3>
          <p>{html.escape(excerpt_plain)}</p>
        </div>
        <a href="{FILE_SLUG}.html" class="newsletter-card-link">Read edition →</a>
      </article>"""

# Insert after <!-- ARCHIVE_START --> marker
marker = "<!-- ARCHIVE_START -->"
if marker in index_content:
    index_content = index_content.replace(marker, marker + new_card)
    INDEX_FILE.write_text(index_content, encoding="utf-8")
    print(f"✓ Updated: {INDEX_FILE}")
else:
    print("⚠ Could not find ARCHIVE_START marker in index.html – index not updated")
