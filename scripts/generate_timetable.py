#!/usr/bin/env python3
"""
Chaz Forsyth Rifle Range – Timetable JSON Generator
====================================================
Reads scripts/range_timetable.csv (sourced from Google Sheets)
and writes data/timetable.json consumed by the Next.js site.

Usage:
  python3 scripts/generate_timetable.py [--csv path/to/timetable.csv]

Output:
  data/timetable.json  – machine-readable timetable (Next.js source)
  scripts/range_timetable.csv  – snapshot updated if --csv given
"""

import csv, json, sys
from datetime import datetime
from pathlib import Path
from collections import defaultdict

SNAPSHOT_CSV  = Path("scripts/range_timetable.csv")
OUTPUT_JSON   = Path("data/timetable.json")

MONTH_NAMES = ["January","February","March","April","May","June",
               "July","August","September","October","November","December"]

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
    if len(row) >= 3 and row[0].strip():
        entries.append((row[0].strip(), row[1].strip(), row[2].strip()))
    if len(row) >= 6 and row[3].strip():
        entries.append((row[3].strip(), row[4].strip(), row[5].strip()))

# Parse and sort entries
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
# 2. Detect whole-month closures
#    A month is "closed" if every entry in it has status=closed/close AND
#    they share the same reason (or the only entry has a reason).
# ---------------------------------------------------------------------------
def is_whole_month_closed(month_entries):
    return all(not is_open for _, is_open, _ in month_entries)

# ---------------------------------------------------------------------------
# 3. Build JSON structure
# ---------------------------------------------------------------------------
sorted_months = sorted(by_month.keys())
years_in_data = sorted({yr for yr, mo in by_month.keys()})
year_range    = f"{years_in_data[0]}–{years_in_data[-1]}" if len(years_in_data) > 1 else str(years_in_data[0])

months_out = []
for (yr, mo) in sorted_months:
    month_entries = by_month[(yr, mo)]
    month_label   = f"{MONTH_NAMES[mo-1]} {yr}"

    if is_whole_month_closed(month_entries):
        reasons = [r for _, _, r in month_entries if r]
        closed_reason = reasons[0] if reasons else "Closed"
        months_out.append({
            "month":        month_label,
            "closedMonth":  True,
            "closedReason": closed_reason,
        })
    else:
        entry_list = []
        for dt, is_open, reason in month_entries:
            entry = {
                "isoDate": dt.strftime("%Y-%m-%d"),
                "status":  "open" if is_open else "closed",
            }
            if reason:
                entry["reason"] = reason
            entry_list.append(entry)
        months_out.append({
            "month":   month_label,
            "entries": entry_list,
        })

timetable_json = {
    "generated": datetime.today().strftime("%Y-%m-%d"),
    "year":      year_range,
    "months":    months_out,
}

# ---------------------------------------------------------------------------
# 4. Write output
# ---------------------------------------------------------------------------
OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_JSON.write_text(json.dumps(timetable_json, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"[OK] {OUTPUT_JSON} updated ({len(parsed)} entries, {len(sorted_months)} months)")

# If using external CSV, update the snapshot
if csv_path != SNAPSHOT_CSV:
    import shutil
    shutil.copy(csv_path, SNAPSHOT_CSV)
    print(f"[OK] Snapshot updated: {SNAPSHOT_CSV}")
