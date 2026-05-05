#!/usr/bin/env python3
"""
Otago Deerstalkers – Newsletter Generator (Next.js edition)
============================================================
Called by the GitHub Actions workflow (publish-newsletter.yml).

Reads from environment variables:
  ISSUE_NUMBER  – e.g. "3"
  TITLE         – e.g. "April 2026 – Hunt Results & Lodge Bookings"
  DATE          – e.g. "2026-04-14"  (YYYY-MM-DD)

Reads content from:
  /tmp/newsletter_content.txt  – plain text, Markdown, or HTML body

Outputs:
  content/newsletters/YYYY-MM.md  – Markdown file with YAML frontmatter
"""

import os, re
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

MONTH_YEAR  = date_obj.strftime("%B %Y")
FILE_SLUG   = date_obj.strftime("%Y-%m")
OUTPUT_FILE = Path(f"content/newsletters/{FILE_SLUG}.md")

# ---------------------------------------------------------------------------
# Read content
# ---------------------------------------------------------------------------
content_path = Path("/tmp/newsletter_content.txt")
raw_content  = content_path.read_text(encoding="utf-8").strip() if content_path.exists() else ""

# ---------------------------------------------------------------------------
# Convert HTML input to Markdown if the content looks like HTML (A015)
# The email worker sends HTML bodies; markdownify converts them cleanly.
# ---------------------------------------------------------------------------
if re.search(r"<(p|h[1-4]|ul|li|div|br)\b", raw_content, re.I):
    try:
        import markdownify
        raw_content = markdownify.markdownify(raw_content, heading_style="ATX").strip()
    except ImportError:
        # markdownify not installed — strip tags as fallback
        raw_content = re.sub(r"<br\s*/?>", "\n", raw_content, flags=re.I)
        raw_content = re.sub(r"<[^>]+>", "", raw_content).strip()

# ---------------------------------------------------------------------------
# Placeholder template — used when content is absent or too sparse
# ---------------------------------------------------------------------------
PLACEHOLDER = f"""## From the Committee

This edition's notes will be added shortly. In the meantime, a summary of what was covered at the {MONTH_YEAR} club meeting is below.

---

## Range News

The Chaz Forsyth Rifle Range is open most Saturdays 1–4pm (weather permitting). Follow the [Chaz Forsyth Rifle Range Facebook Group](https://www.facebook.com/groups/1195200207197835/) for closure notices.

- Members: $5 per session (current card required)
- Non-members: $10
- Hearing and eye protection are mandatory

---

## Coming Up

- **Next club meeting** – 2nd Monday of the month, 7:30pm at 53 Malvern Street, Woodhaugh
- **Photo competition year closes** – 31 May
- **HUNTS Course** – contact Frans Laas on 027 230 7157 for next dates
- **Lodge bookings** – pick up keys from Elio's Gun Shop, Hunting and Fishing, or Gun City Dunedin
"""

def is_sparse(text: str) -> bool:
    has_heading = bool(re.search(r"(?:^|\n)#{1,3}\s", text))
    return not has_heading or len(text.strip()) < 120

if not raw_content or is_sparse(raw_content):
    if raw_content and len(raw_content.strip()) > 10:
        raw_content = f"## From the Committee\n\n{raw_content}\n\n{PLACEHOLDER.split('---', 1)[1].strip()}"
    else:
        raw_content = PLACEHOLDER

# ---------------------------------------------------------------------------
# Build short excerpt (first non-heading paragraph, max 200 chars)
# ---------------------------------------------------------------------------
excerpt = ""
for line in raw_content.splitlines():
    stripped = line.strip()
    if stripped and not stripped.startswith("#") and not stripped.startswith("-") and not stripped.startswith("*"):
        excerpt = stripped[:200]
        if len(stripped) > 200:
            excerpt = excerpt.rsplit(" ", 1)[0] + "…"
        break

if not excerpt:
    excerpt = f"{TITLE} — NZDA Otago Branch newsletter."

# ---------------------------------------------------------------------------
# Write Markdown file with YAML frontmatter
# ---------------------------------------------------------------------------
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

# Duplicate guard
if OUTPUT_FILE.exists():
    print(f"[SKIP] {OUTPUT_FILE} already exists — not overwriting.")
else:
    # Escape any double-quotes in title/excerpt for YAML safety
    safe_title   = TITLE.replace('"', '\\"')
    safe_excerpt = excerpt.replace('"', '\\"')

    md_content = f"""---
slug: "{FILE_SLUG}"
issue: {ISSUE_NUMBER}
title: "{safe_title}"
date: "{DATE_STR}"
excerpt: "{safe_excerpt}"
---

{raw_content}
"""
    OUTPUT_FILE.write_text(md_content, encoding="utf-8")
    print(f"[OK] Written: {OUTPUT_FILE}")
