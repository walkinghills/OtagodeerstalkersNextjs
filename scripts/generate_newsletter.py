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

import os, re, html
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
ISSUE_NUMBER = os.environ.get("ISSUE_NUMBER", "1").strip()
TITLE        = os.environ.get("TITLE", "Newsletter").strip()
DATE_STR     = os.environ.get("DATE", datetime.today().strftime("%Y-%m-%d")).strip()

try:
    date_obj = datetime.strptime(DATE_STR, "%Y-%m-%d")
except ValueError:
    date_obj = datetime.today()

MONTH_YEAR    = date_obj.strftime("%B %Y")
FILE_SLUG     = date_obj.strftime("%Y-%m")
DATETIME_ATTR = date_obj.strftime("%Y-%m-%d")
OUTPUT_FILE   = Path(f"newsletters/{FILE_SLUG}.html")
INDEX_FILE    = Path("newsletters/index.html")

# ---------------------------------------------------------------------------
# Read content
# ---------------------------------------------------------------------------
content_path = Path("/tmp/newsletter_content.txt")
raw_content  = content_path.read_text(encoding="utf-8").strip() if content_path.exists() else ""

# ---------------------------------------------------------------------------
# Placeholder template — used when content is sparse or absent
# ---------------------------------------------------------------------------
PLACEHOLDER = f"""# From the Committee

This edition's notes will be added shortly. In the meantime, a summary of what was covered at the {MONTH_YEAR} club meeting is below.

---

# Range News

The Chaz Forsyth Range is open most Saturdays 1–4pm (weather permitting). Follow the [Chaz Forsyth Range Facebook Group](https://www.facebook.com/groups/1195200207197835/) for closure notices.

- Members: $5 per session (current card required)
- Non-members: $10
- Hearing and eye protection are mandatory

---

# Coming Up

- **Next club meeting** – 2nd Monday of the month, 7:30pm at 53 Malvern Street, Woodhaugh
- **Photo competition year closes** – 31 May
- **HUNTS Course** – contact Frans Laas on 027 230 7157 for next dates
- **Lodge bookings** – pick up keys from Elio's Gun Shop, Allan Millars, or Gun City Dunedin
"""

def is_sparse(text: str) -> bool:
    has_heading = bool(re.search(r"(^#{1,3}\s|\n#{1,3}\s|^[A-Z][A-Z\s]{4,}$)", text, re.M))
    return not has_heading or len(text.strip()) < 120

if not raw_content or is_sparse(raw_content):
    # Prepend any actual content as the first section, then add placeholders
    if raw_content and len(raw_content.strip()) > 10:
        raw_content = f"# From the Committee\n\n{raw_content}\n\n{PLACEHOLDER.split('---', 1)[1]}"
    else:
        raw_content = PLACEHOLDER

# ---------------------------------------------------------------------------
# Plain-text → HTML converter
# ---------------------------------------------------------------------------
def plain_text_to_html(text: str) -> str:
    lines  = text.splitlines()
    out    = []
    in_ul  = False
    para_buf = []

    def flush_para():
        if para_buf:
            joined = " ".join(para_buf).strip()
            if joined:
                # Convert inline markdown links [text](url)
                joined = re.sub(
                    r'\[([^\]]+)\]\((https?://[^\)]+)\)',
                    r'<a href="\2" target="_blank" rel="noopener">\1</a>',
                    joined
                )
                out.append(f"<p>{joined}</p>")
            para_buf.clear()

    for line in lines:
        stripped = line.strip()

        if stripped in ("---", "***", "___"):
            flush_para()
            if in_ul: out.append("</ul>"); in_ul = False
            out.append('<hr class="nl-divider" />')
            continue

        if not stripped:
            flush_para()
            if in_ul: out.append("</ul>"); in_ul = False
            continue

        # Heading: # syntax
        if stripped.startswith("#"):
            flush_para()
            if in_ul: out.append("</ul>"); in_ul = False
            level   = len(stripped) - len(stripped.lstrip("#"))
            heading = stripped.lstrip("#").strip()
            sid     = re.sub(r"[^a-z0-9]+", "-", heading.lower()).strip("-")
            tag     = f"h{min(level+1, 4)}"
            out.append(f'<{tag} id="{sid}">{html.escape(heading)}</{tag}>')
            continue

        # Heading: ALL CAPS line (5+ chars)
        if re.match(r"^[A-Z][A-Z\s]{4,}$", stripped):
            flush_para()
            if in_ul: out.append("</ul>"); in_ul = False
            sid = re.sub(r"[^a-z0-9]+", "-", stripped.lower()).strip("-")
            out.append(f'<h2 id="{sid}">{html.escape(stripped.title())}</h2>')
            continue

        # List item
        if stripped.startswith(("- ", "* ", "• ")):
            flush_para()
            if not in_ul: out.append('<ul class="nl-list">'); in_ul = True
            item = stripped[2:].strip()
            # Bold **text**
            item = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', item)
            # Inline link
            item = re.sub(
                r'\[([^\]]+)\]\((https?://[^\)]+)\)',
                r'<a href="\2" target="_blank" rel="noopener">\1</a>',
                item
            )
            out.append(f"  <li>{item}</li>")
            continue

        # Normal text — buffer into paragraph
        if in_ul: out.append("</ul>"); in_ul = False
        # Bold **text**
        stripped = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', stripped)
        para_buf.append(stripped)

    flush_para()
    if in_ul: out.append("</ul>")
    return "\n".join(out)


# If content already has HTML tags, use mostly as-is; otherwise convert
if re.search(r"<(p|h[2-4]|ul|li|div)\b", raw_content, re.I):
    body_html = raw_content
else:
    body_html = plain_text_to_html(raw_content)

# Short excerpt for archive card (plain text, max 200 chars)
excerpt_plain = re.sub(r"<[^>]+>", "", body_html)[:200].strip()
if len(re.sub(r"<[^>]+>", "", body_html)) > 200:
    excerpt_plain = excerpt_plain.rsplit(" ", 1)[0] + "…"

# Build table of contents from h2 tags
toc_items = re.findall(r'<h2[^>]*id="([^"]+)"[^>]*>([^<]+)</h2>', body_html)
toc_html  = ""
if toc_items:
    toc_html = '<aside class="newsletter-toc"><h3>In This Edition</h3><ol>'
    for anchor, label in toc_items:
        toc_html += f'<li><a href="#{anchor}">{label}</a></li>'
    toc_html += "</ol></aside>"

# ---------------------------------------------------------------------------
# Shared nav/footer fragments (absolute paths — work regardless of base URL)
# ---------------------------------------------------------------------------
NAV_LINKS = """
        <li><a href="/index.html">Home</a></li>
        <li><a href="/range.html">Range</a></li>
        <li><a href="/lodge.html">Lodge</a></li>
        <li><a href="/club-hunts.html">Club Hunts</a></li>
        <li><a href="/hunts-course.html">HUNTS Course</a></li>
        <li><a href="/competitions.html">Competitions</a></li>
        <li><a href="/newsletters" class="active">Newsletter</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/join.html" class="btn-join">Join</a></li>"""

FOOTER_PAGES = """
          <li><a href="/index.html">Home</a></li>
          <li><a href="/range.html">Chaz Forsyth Range</a></li>
          <li><a href="/lodge.html">Blue Mountains Lodge</a></li>
          <li><a href="/club-hunts.html">Club Hunts</a></li>
          <li><a href="/hunts-course.html">HUNTS Course</a></li>
          <li><a href="/competitions.html">Competitions</a></li>
          <li><a href="/newsletters">Newsletter</a></li>
          <li><a href="/join.html">Join</a></li>
          <li><a href="/contact.html">Contact</a></li>"""

# ---------------------------------------------------------------------------
# Newsletter page HTML
# ---------------------------------------------------------------------------
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
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/css/styles.css" />
</head>
<body>

<header class="site-header">
  <div class="container">
    <nav class="nav-inner">
      <a href="/index.html" class="nav-brand">
        <img src="https://www.deerstalkers.org.nz/_resources/themes/NZDANational/images/logo-white-white-text.svg" alt="NZDA Logo" class="nav-logo" />
        <div class="nav-brand-text">Otago Branch<span>New Zealand Deerstalkers Association</span></div>
      </a>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">{NAV_LINKS}
      </ul>
    </nav>
  </div>
</header>

<section class="newsletter-masthead">
  <div class="container">
    <div class="newsletter-meta-bar">
      <a href="/newsletters" class="newsletter-back">← All Editions</a>
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
    <a href="/newsletters" class="btn btn-outline">← Back to All Editions</a>
  </div>
</section>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="https://www.deerstalkers.org.nz/_resources/themes/NZDANational/images/logo-gold-white-text.svg" alt="NZDA Logo" class="footer-logo" />
        <p>The Otago Branch of the New Zealand Deerstalkers Association. Representing hunters and recreational shooters across the Otago region.</p>
      </div>
      <div class="footer-col"><h4>Pages</h4><ul>{FOOTER_PAGES}
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

<script src="/js/main.js"></script>
</body>
</html>
"""

# ---------------------------------------------------------------------------
# Write newsletter page
# ---------------------------------------------------------------------------
OUTPUT_FILE.write_text(page_html, encoding="utf-8")
print(f"[OK] Written: {OUTPUT_FILE}")

# ---------------------------------------------------------------------------
# Update newsletters/index.html — prepend new card, using absolute path
# ---------------------------------------------------------------------------
index_content = INDEX_FILE.read_text(encoding="utf-8")

new_card = f"""
      <article class="newsletter-card">
        <div class="newsletter-card-meta">
          <span class="newsletter-issue">Issue #{ISSUE_NUMBER}</span>
          <time class="newsletter-date" datetime="{DATETIME_ATTR}">{MONTH_YEAR}</time>
        </div>
        <div class="newsletter-card-body">
          <h3><a href="/newsletters/{FILE_SLUG}">{html.escape(TITLE)}</a></h3>
          <p>{html.escape(excerpt_plain)}</p>
        </div>
        <a href="/newsletters/{FILE_SLUG}" class="newsletter-card-link">Read edition →</a>
      </article>"""

marker = "<!-- ARCHIVE_START -->"
if marker in index_content:
    # Duplicate guard: skip if a card for this slug already exists in the index
    if f'/newsletters/{FILE_SLUG}"' in index_content:
        print(f"[SKIP] Card for {FILE_SLUG} already exists in index — not duplicating.")
    else:
        index_content = index_content.replace(marker, marker + new_card)
        INDEX_FILE.write_text(index_content, encoding="utf-8")
        print(f"[OK] Updated: {INDEX_FILE}")
else:
    print("[WARN] ARCHIVE_START marker not found in index.html")
