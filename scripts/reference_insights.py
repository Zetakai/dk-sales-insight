#!/usr/bin/env python3
"""
An independent implementation of docs/SPEC.md sections 1-2, in Python with no dependencies, so the TypeScript data
layer is checked against something it does not share code with. It writes src/lib/fixture.ts (FIXTURE), which the
Vitest suite deep-compares with analyze(data/demo.csv).

    python3 scripts/reference_insights.py data/demo.csv src/lib/fixture.ts

Run it again after changing the demo data or a metric definition. Two implementations agreeing on every number is
the point; when they disagree, read the spec before changing either.
"""
import collections
import csv
import json
import statistics
import sys

src, out = sys.argv[1], sys.argv[2]
with open(src, newline='', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    head = next(reader)
    raw = [(n, dict(zip(head, r))) for n, r in enumerate(reader, start=2)]

# Region spellings: case-insensitive, to the most common spelling of that name; a few common abbreviations.
ALIAS = {'jabar': 'jawa barat', 'jatim': 'jawa timur', 'jateng': 'jawa tengah', 'dki': 'jabodetabek'}

seen, kept, dups = set(), [], []
for line, r in raw:
    key = tuple(r[c] for c in head)
    if key in seen:
        dups.append({'invoiceNo': r['invoice_no'], 'sku': r['sku']})
        continue
    seen.add(key)
    kept.append((line, r))

counts = collections.defaultdict(collections.Counter)
for _, r in kept:
    counts[r['region'].strip().lower()][r['region'].strip()] += 1


def canon(v):
    k = ALIAS.get(v.strip().lower(), v.strip().lower())
    c = counts.get(k)
    return c.most_common(1)[0][0] if c else v.strip().title()


lines, regionfix = [], collections.Counter()
namefix = collections.defaultdict(lambda: [None, None, 0])
blank = []
for line, r in kept:
    reg = canon(r['region'])
    if reg != r['region']:
        regionfix[(r['region'], reg)] += 1
    nm = r['outlet_name'].strip()
    if nm != r['outlet_name']:
        f = namefix[r['outlet_id']]
        f[0], f[1], f[2] = r['outlet_name'], nm, f[2] + 1
    if not r['salesman'].strip():
        blank.append({'line': line, 'invoiceNo': r['invoice_no'], 'outletId': r['outlet_id']})
    q = int(r['qty_carton'])
    lines.append(dict(
        date=r['date'], month=r['date'][:7], invoiceNo=r['invoice_no'],
        isReturn=r['invoice_no'].startswith('RTR') or q < 0,
        region=reg, branch=r['branch'], outletId=r['outlet_id'], outletName=nm, outletType=r['outlet_type'],
        salesman=r['salesman'].strip(), brand=r['brand'], sku=r['sku'], qtyCarton=q,
        grossIdr=int(r['gross_sales_idr']), discountIdr=int(r['discount_idr']), netIdr=int(r['net_sales_idr']),
    ))

months = sorted({l['month'] for l in lines})
M0, M1 = months[0], months[-1]


def pct(a, b):
    return None if a == 0 else round((b / a - 1) * 100, 1)


names = collections.defaultdict(set)
for l in lines:
    names[l['outletName']].add(l['outletId'])

cleaning = dict(
    rowsRead=len(raw), rowsKept=len(lines), duplicates=dups,
    regionFixes=[{'from': a, 'to': b, 'rows': n} for (a, b), n in sorted(regionfix.items())],
    nameFixes=[{'outletId': k, 'from': v[0], 'to': v[1], 'rows': v[2]} for k, v in sorted(namefix.items())],
    returns=[{'invoiceNo': l['invoiceNo'], 'outletId': l['outletId'], 'outletName': l['outletName'],
              'date': l['date'], 'netIdr': l['netIdr']} for l in lines if l['isReturn']],
    sharedNames=[{'name': k, 'outletIds': sorted(v)} for k, v in sorted(names.items()) if len(v) > 1],
    invalid=[], blankSalesman=blank,
)

tot = sum(l['netIdr'] for l in lines)
bm = collections.Counter()
for l in lines:
    bm[l['month']] += l['netIdr']
totals = dict(
    netIdr=tot, grossIdr=sum(l['grossIdr'] for l in lines), discountIdr=sum(l['discountIdr'] for l in lines),
    returnsIdr=sum(l['netIdr'] for l in lines if l['isReturn']),
    invoices=len({l['invoiceNo'] for l in lines if not l['isReturn']}),
    outlets=len({l['outletId'] for l in lines}), cartons=sum(l['qtyCarton'] for l in lines),
    byMonth={m: bm.get(m, 0) for m in months}, changePct=pct(bm[M0], bm[M1]),
)


def breakdown(dim, driver=False):
    d = collections.defaultdict(collections.Counter)
    for l in lines:
        d[l[dim]][l['month']] += l['netIdr']
    res = []
    for k, v in d.items():
        b = dict(key=k, netIdr=sum(v.values()), share=round(sum(v.values()) / tot, 4),
                 byMonth={m: v.get(m, 0) for m in months}, changePct=pct(v.get(M0, 0), v.get(M1, 0)))
        if driver:
            br = collections.defaultdict(collections.Counter)
            for l in lines:
                if l['region'] == k:
                    br[l['branch']][l['month']] += l['netIdr']
            bk = max(br, key=lambda x: abs(br[x].get(M1, 0) - br[x].get(M0, 0)))
            b['driver'] = dict(branch=bk, deltaIdr=br[bk].get(M1, 0) - br[bk].get(M0, 0),
                               changePct=pct(br[bk].get(M0, 0), br[bk].get(M1, 0)))
        res.append(b)
    return sorted(res, key=lambda x: -x['netIdr'])


by_outlet = collections.defaultdict(list)
for l in lines:
    by_outlet[l['outletId']].append(l)
outlets = []
for oid, ls in by_outlet.items():
    first = sum(l['netIdr'] for l in ls if l['month'] == M0)
    last = sum(l['netIdr'] for l in ls if l['month'] == M1)
    votes = collections.Counter(l['salesman'] for l in ls if l['salesman'])
    outlets.append(dict(
        outletId=oid, outletName=ls[0]['outletName'], outletType=ls[0]['outletType'], region=ls[0]['region'],
        branch=ls[0]['branch'], salesman=votes.most_common(1)[0][0] if votes else '',
        netIdr=sum(l['netIdr'] for l in ls), invoices=len({l['invoiceNo'] for l in ls if not l['isReturn']}),
        firstMonthIdr=first, lastMonthIdr=last, changePct=pct(first, last), lastOrder=max(l['date'] for l in ls),
    ))
median = {t: statistics.median([o['netIdr'] for o in outlets if o['outletType'] == t])
          for t in {o['outletType'] for o in outlets}}
for o in outlets:
    o['peerMedianIdr'] = median[o['outletType']]
    o['peerIndex'] = round(o['netIdr'] / median[o['outletType']], 4)
outlets.sort(key=lambda o: (o['peerIndex'], o['netIdr']))
drops = sorted([o for o in outlets if o['firstMonthIdr'] > 0], key=lambda o: o['lastMonthIdr'] / o['firstMonthIdr'])[:5]

insights = dict(
    period={'from': min(l['date'] for l in lines), 'to': max(l['date'] for l in lines), 'months': months},
    totals=totals, byRegion=breakdown('region', True), byBrand=breakdown('brand'),
    weakest=outlets[:5], biggestDrops=drops, outlets=outlets, cleaning=cleaning,
)

with open(out, 'w', encoding='utf-8') as f:
    f.write("import type { Insights } from './types';\n\n")
    f.write('/**\n * Reference result for data/demo.csv (synthetic), written by scripts/reference_insights.py: an independent\n')
    f.write(' * Python implementation of docs/SPEC.md. Do not edit by hand. Ratios rounded: share and peerIndex to 4 decimals,\n')
    f.write(' * percentages to 1 decimal.\n */\n')
    f.write('export const FIXTURE: Insights = ' + json.dumps(insights, ensure_ascii=False, indent=2) + ';\n')
print(f'{out}: {len(lines)} lines, {len(outlets)} outlets, weakest {[o["outletName"] for o in outlets[:5]]}')
