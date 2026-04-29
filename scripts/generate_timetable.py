#!/usr/bin/env python3
"""
Chaz Forsyth Rifle Range – Timetable HTML Generator
==============================================
Reads scripts/range_timetable.csv (sourced from Google Sheets)
and generates the HTML timetable section injected into range.html.

Usage:
  python3 scripts/generate_timetable.py [--csv path/to/timetable.csv]

Output:
  Injects updated HTML between <!-- TIMETABLE_START --> and <!-- TIMETABLE_END -->
  in range.html. Also writes scripts/range_timetable.csv if a new CSV is passed.
"""

import csv, re, sys
from datetime import datetime
from pathlib import Path
from collections import defaultdict

RANGE_HTML   = Path("range.html")
SNAPSHOT_CSV = Path("scripts/range_timetable.csv")
START_MARKER = "<!-- TIMETABLE_START -->"
END_MARKER   = "<!-- TIMETABLE_END -->"

# Accept optional --csv argument for updating the snapshot
csv_path = SNAPSHOT_CSV
for i, arg in enumerate(sys.argv[1:]):
    if arg == "--csv" and i + 1 < len(sys.argv[1:]):
        csv_path = Path(sys.argv[i + 2])

# ---------------------------------------------------------------------------
# 1. Parse CSV
#    Sheet has two side-by-side date blocks: columns 0-2 and columns 3-5
# ---------------------------------------------------------------------------
entries = []

with open(csv_path, newline="", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    rows   = list(reader)

for row in rows[2:]:  # skip header rows
    # Left block: cols 0-2
    if len(row) >= 3 and row[0].strip():
        entries.append((row[0].strip(), row[1].strip(), row[2].strip()))
    # Right block: cols 3-5
    if len(row) >= 6 and row[3].strip():
        entries.append((row[3].strip(), row[4].strip(), row[5].strip()))

# Parse and sort entries
MONTH_NAMES = ["January","February","March","April","May","June",
               "July","August","September","October","November","December"]

parsed = []
for date_str, status_raw, reason in entries:
    status = status_raw.strip().lower()
    if status not in ("open", "closed", "close"):
        continue
    is_open = status == "open"
    try:
        dt = datetime.strptime(date_str.strip(), "%d-%b-%Y")
    except ValueError:
        continue
    parsed.append((dt, is_open, reason.strip()))

parsed.sort(key=lambda x: x[0])

# Group by year-month
by_month = defaultdict(list)
for dt, is_open, reason in parsed:
    key = (dt.year, dt.month)
    by_month[key].append((dt, is_open, reason))

# ---------------------------------------------------------------------------
# 2. Identify next upcoming open date (for the "Next open date" callout)
# ---------------------------------------------------------------------------
today   = datetime.today()
upcoming = [(dt, reason) for dt, is_open, reason in parsed if is_open and dt >= today]
next_open = upcoming[0] if upcoming else None

# ---------------------------------------------------------------------------
# 3. Build HTML
# ---------------------------------------------------------------------------
def ordinal(n):
    if 11 <= n <= 13:
        return f"{n}th"
    return f"{n}{['th','st','nd','rd','th','th','th','th','th','th'][n % 10]}"

def fmt_day(dt):
    return f"{ordinal(dt.day)} {MONTH_NAMES[dt.month-1]}"

html_parts = [f"\n<!-- TIMETABLE_START -->\n<!-- updated: {today.strftime('%Y-%m-%d')} -->\n"]

# Next open callout
if next_open:
    ndt, nreason = next_open
    nday = ndt.strftime("%a") + " " + str(ndt.day) + " " + ndt.strftime("%B")
    html_parts.append(f"""<div class="timetable-next-open">
  <span class="tno-label">Next open date</span>
  <span class="tno-date">{nday}</span>
  <span class="tno-note">Always check the <a href="https://www.facebook.com/groups/1195200207197835/" target="_blank" rel="noopener">Facebook group</a> for weather closures</span>
</div>\n""")

# Determine range of years to label heading correctly
years_in_data = sorted(set(yr for yr, mo in by_month.keys()))
year_range    = f"{years_in_data[0]}–{years_in_data[-1]}" if len(years_in_data) > 1 else str(years_in_data[0])

html_parts.append(f'<div class="range-timetable" data-year="{year_range}">\n')

sorted_months  = sorted(by_month.keys())
current_month  = (today.year, today.month)

for (yr, mo) in sorted_months:
    month_entries = by_month[(yr, mo)]
    open_count    = sum(1 for _, is_open, _ in month_entries if is_open)
    month_label   = f"{MONTH_NAMES[mo-1]} {yr}"
    is_past       = (yr, mo) < current_month
    is_current    = (yr, mo) == current_month
    month_class   = "closed-month" if open_count == 0 else ""
    if is_past:    month_class += " past-month"
    if is_current: month_class += " current-month"

    html_parts.append(f'  <div class="timetable-month {month_class.strip()}">\n')
    html_parts.append(f'    <h4 class="timetable-month-heading">{month_label}</h4>\n')

    # Maintenance note for all-closed months
    reasons = [r for _, _, r in month_entries if r]
    if open_count == 0 and reasons:
        note = reasons[0]
        html_parts.append(f'    <p class="timetable-closed-note">{note}</p>\n')
    else:
        html_parts.append(f'    <div class="timetable-entries">\n')
        for dt, is_open, reason in month_entries:
            status_class = "open"  if is_open else "closed"
            status_label = "Open"  if is_open else "Closed"
            day_label    = dt.strftime("%a") + " " + str(dt.day) + " " + dt.strftime("%b")
            is_past_day  = dt.date() < today.date()
            past_class   = " past-entry" if is_past_day else ""
            reason_html  = f'<span class="te-reason">{reason}</span>' if reason else ""
            html_parts.append(
                f'      <div class="timetable-entry {status_class}{past_class}">'
                f'<span class="te-date">{day_label}</span>'
                f'<span class="te-status">{status_label}</span>'
                f'{reason_html}'
                f'</div>\n'
            )
        html_parts.append('    </div>\n')

    html_parts.append('  </div>\n')

html_parts.append("</div>\n<!-- TIMETABLE_END -->")

timetable_html = "".join(html_parts)

# ---------------------------------------------------------------------------
# 4. Inject into range.html
# ---------------------------------------------------------------------------
content = RANGE_HTML.read_text(encoding="utf-8")

if START_MARKER not in content:
    print("[ERROR] TIMETABLE_START marker not found in range.html")
    sys.exit(1)

# Replace everything between markers (inclusive)
new_content = re.sub(
    re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER),
    timetable_html,
    content,
    flags=re.DOTALL
)

RANGE_HTML.write_text(new_content, encoding="utf-8")
print(f"[OK] range.html updated with {len(parsed)} timetable entries across {len(sorted_months)} months")

# If using external CSV, also update the snapshot
if csv_path != SNAPSHOT_CSV:
    import shutil
    shutil.copy(csv_path, SNAPSHOT_CSV)
    print(f"[OK] Snapshot updated: {SNAPSHOT_CSV}")
