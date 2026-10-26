"""Validate runtime static events without modifying the source workbook.

This intentionally validates `miniprogram/data/events.js` directly so it checks
what the mini-program will actually consume. nonBlocking Tutorial candidate
windows are informational only and are excluded from hard-overlap checks.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
EVENTS = ROOT / 'miniprogram' / 'data' / 'events.js'

raw = EVENTS.read_text(encoding='utf-8').strip()
if raw.startswith('module.exports = '):
    raw = raw[len('module.exports = '):]
if raw.endswith(';'):
    raw = raw[:-1]
events = json.loads(raw)


def mins(x):
    h, m = map(int, x.split(':'))
    return h * 60 + m


hard_types = {'lecture', 'tutorial', 'exam', 'bootcamp', 'presentation', 'orientation', 'tbc'}
rows = []
for e in events:
    if e.get('nonBlocking'):
        continue
    if e.get('type') not in hard_types:
        continue
    if not e.get('date') or not e.get('startTime') or not e.get('endTime'):
        continue
    rows.append((
        e['date'], mins(e['startTime']), mins(e['endTime']),
        e.get('courseCode') or e.get('code') or '', e.get('type') or '',
        e.get('title') or '', e.get('tutorialGroup') or '', e.get('id') or ''
    ))

unexpected = []
for i, a in enumerate(rows):
    for b in rows[i + 1:]:
        if a[0] != b[0]:
            continue
        # Different Tutorial groups for the same course are alternative choices,
        # not simultaneous obligations.
        if a[4] == 'tutorial' and b[4] == 'tutorial' and a[3] == b[3]:
            continue
        if max(a[1], b[1]) >= min(a[2], b[2]):
            continue
        unexpected.append((a, b))

ids = [e.get('id') for e in events]
duplicate_ids = sorted({x for x in ids if x and ids.count(x) > 1})
nonblocking = [e for e in events if e.get('nonBlocking')]

print('Static event objects:', len(events))
print('Timed hard rows:', len(rows))
print('Non-blocking tutorial windows:', len(nonblocking))
print('Duplicate event IDs:', len(duplicate_ids))
print('Unexpected hard overlaps:', len(unexpected))
for x in duplicate_ids[:20]:
    print('DUPLICATE_ID', x)
for a, b in unexpected[:20]:
    print('CONFLICT', a, b)

if duplicate_ids or unexpected:
    raise SystemExit(1)
