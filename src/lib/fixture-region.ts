import type { Insights } from './types';

/**
 * Reference result for data/demo.csv (region Jawa Tengah), written by scripts/reference_insights.py: an independent
 * Python implementation of docs/SPEC.md. Do not edit by hand. Ratios rounded: share and peerIndex to 4 decimals,
 * percentages to 1 decimal.
 */
export const FIXTURE: Insights = {
  "scope": {
    "region": "Jawa Tengah"
  },
  "period": {
    "from": "2026-09-01",
    "to": "2026-10-31",
    "months": [
      "2026-09",
      "2026-10"
    ]
  },
  "totals": {
    "netIdr": 110667600,
    "grossIdr": 111690000,
    "discountIdr": 1022400,
    "returnsIdr": 0,
    "invoices": 52,
    "outlets": 6,
    "cartons": 619,
    "byMonth": {
      "2026-09": 43016200,
      "2026-10": 67651400
    },
    "changePct": 57.3
  },
  "byRegion": [
    {
      "key": "Jawa Tengah",
      "netIdr": 110667600,
      "share": 1.0,
      "byMonth": {
        "2026-09": 43016200,
        "2026-10": 67651400
      },
      "changePct": 57.3,
      "driver": {
        "branch": "Semarang",
        "deltaIdr": 26836800,
        "changePct": 259.8
      }
    }
  ],
  "byBrand": [
    {
      "key": "Kacang Dua Kelinci",
      "netIdr": 46545900,
      "share": 0.4206,
      "byMonth": {
        "2026-09": 15165600,
        "2026-10": 31380300
      },
      "changePct": 106.9
    },
    {
      "key": "Sukro",
      "netIdr": 21881100,
      "share": 0.1977,
      "byMonth": {
        "2026-09": 9823800,
        "2026-10": 12057300
      },
      "changePct": 22.7
    },
    {
      "key": "Pilus",
      "netIdr": 15796500,
      "share": 0.1427,
      "byMonth": {
        "2026-09": 6150000,
        "2026-10": 9646500
      },
      "changePct": 56.9
    },
    {
      "key": "Usagi",
      "netIdr": 10169600,
      "share": 0.0919,
      "byMonth": {
        "2026-09": 3780000,
        "2026-10": 6389600
      },
      "changePct": 69.0
    },
    {
      "key": "Tic Tac",
      "netIdr": 9592000,
      "share": 0.0867,
      "byMonth": {
        "2026-09": 4596800,
        "2026-10": 4995200
      },
      "changePct": 8.7
    },
    {
      "key": "Tos Tos",
      "netIdr": 6682500,
      "share": 0.0604,
      "byMonth": {
        "2026-09": 3500000,
        "2026-10": 3182500
      },
      "changePct": -9.1
    }
  ],
  "byBranch": [
    {
      "key": "Purwokerto",
      "netIdr": 63169000,
      "share": 0.5708,
      "byMonth": {
        "2026-09": 32685300,
        "2026-10": 30483700
      },
      "changePct": -6.7
    },
    {
      "key": "Semarang",
      "netIdr": 47498600,
      "share": 0.4292,
      "byMonth": {
        "2026-09": 10330900,
        "2026-10": 37167700
      },
      "changePct": 259.8
    }
  ],
  "weakest": [
    {
      "outletId": "D2024",
      "outletName": "Warung Pelangi Harapan",
      "outletType": "Warung",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Clara",
      "netIdr": 360000,
      "invoices": 1,
      "firstMonthIdr": 0,
      "lastMonthIdr": 360000,
      "changePct": null,
      "lastOrder": "2026-10-14",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 0.0507
    },
    {
      "outletId": "D2027",
      "outletName": "Toko Bahagia Maju",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Purwokerto",
      "salesman": "Nur",
      "netIdr": 6190000,
      "invoices": 6,
      "firstMonthIdr": 1830000,
      "lastMonthIdr": 4360000,
      "changePct": 138.3,
      "lastOrder": "2026-10-22",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.6461
    },
    {
      "outletId": "D2021",
      "outletName": "Grosir Bahagia Pelangi",
      "outletType": "Grosir",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Clara",
      "netIdr": 37558600,
      "invoices": 11,
      "firstMonthIdr": 5855900,
      "lastMonthIdr": 31702700,
      "changePct": 441.4,
      "lastOrder": "2026-10-27",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.9898
    },
    {
      "outletId": "D2023",
      "outletName": "Toko Pelangi Mandala",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Clara",
      "netIdr": 9580000,
      "invoices": 12,
      "firstMonthIdr": 4475000,
      "lastMonthIdr": 5105000,
      "changePct": 14.1,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 9580000,
      "peerIndex": 1.0
    },
    {
      "outletId": "D2028",
      "outletName": "Warung Mitra Pelangi",
      "outletType": "Warung",
      "region": "Jawa Tengah",
      "branch": "Purwokerto",
      "salesman": "Nur",
      "netIdr": 8470000,
      "invoices": 10,
      "firstMonthIdr": 4210000,
      "lastMonthIdr": 4260000,
      "changePct": 1.2,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 1.1921
    }
  ],
  "biggestDrops": [
    {
      "outletId": "D2025",
      "outletName": "Grosir Bahagia Sentosa",
      "outletType": "Grosir",
      "region": "Jawa Tengah",
      "branch": "Purwokerto",
      "salesman": "Nur",
      "netIdr": 48509000,
      "invoices": 12,
      "firstMonthIdr": 26645300,
      "lastMonthIdr": 21863700,
      "changePct": -17.9,
      "lastOrder": "2026-10-24",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 1.2784
    },
    {
      "outletId": "D2028",
      "outletName": "Warung Mitra Pelangi",
      "outletType": "Warung",
      "region": "Jawa Tengah",
      "branch": "Purwokerto",
      "salesman": "Nur",
      "netIdr": 8470000,
      "invoices": 10,
      "firstMonthIdr": 4210000,
      "lastMonthIdr": 4260000,
      "changePct": 1.2,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 1.1921
    },
    {
      "outletId": "D2023",
      "outletName": "Toko Pelangi Mandala",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Clara",
      "netIdr": 9580000,
      "invoices": 12,
      "firstMonthIdr": 4475000,
      "lastMonthIdr": 5105000,
      "changePct": 14.1,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 9580000,
      "peerIndex": 1.0
    },
    {
      "outletId": "D2027",
      "outletName": "Toko Bahagia Maju",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Purwokerto",
      "salesman": "Nur",
      "netIdr": 6190000,
      "invoices": 6,
      "firstMonthIdr": 1830000,
      "lastMonthIdr": 4360000,
      "changePct": 138.3,
      "lastOrder": "2026-10-22",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.6461
    },
    {
      "outletId": "D2021",
      "outletName": "Grosir Bahagia Pelangi",
      "outletType": "Grosir",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Clara",
      "netIdr": 37558600,
      "invoices": 11,
      "firstMonthIdr": 5855900,
      "lastMonthIdr": 31702700,
      "changePct": 441.4,
      "lastOrder": "2026-10-27",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.9898
    }
  ],
  "outlets": [
    {
      "outletId": "D2024",
      "outletName": "Warung Pelangi Harapan",
      "outletType": "Warung",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Clara",
      "netIdr": 360000,
      "invoices": 1,
      "firstMonthIdr": 0,
      "lastMonthIdr": 360000,
      "changePct": null,
      "lastOrder": "2026-10-14",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 0.0507
    },
    {
      "outletId": "D2027",
      "outletName": "Toko Bahagia Maju",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Purwokerto",
      "salesman": "Nur",
      "netIdr": 6190000,
      "invoices": 6,
      "firstMonthIdr": 1830000,
      "lastMonthIdr": 4360000,
      "changePct": 138.3,
      "lastOrder": "2026-10-22",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.6461
    },
    {
      "outletId": "D2021",
      "outletName": "Grosir Bahagia Pelangi",
      "outletType": "Grosir",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Clara",
      "netIdr": 37558600,
      "invoices": 11,
      "firstMonthIdr": 5855900,
      "lastMonthIdr": 31702700,
      "changePct": 441.4,
      "lastOrder": "2026-10-27",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.9898
    },
    {
      "outletId": "D2023",
      "outletName": "Toko Pelangi Mandala",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Clara",
      "netIdr": 9580000,
      "invoices": 12,
      "firstMonthIdr": 4475000,
      "lastMonthIdr": 5105000,
      "changePct": 14.1,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 9580000,
      "peerIndex": 1.0
    },
    {
      "outletId": "D2028",
      "outletName": "Warung Mitra Pelangi",
      "outletType": "Warung",
      "region": "Jawa Tengah",
      "branch": "Purwokerto",
      "salesman": "Nur",
      "netIdr": 8470000,
      "invoices": 10,
      "firstMonthIdr": 4210000,
      "lastMonthIdr": 4260000,
      "changePct": 1.2,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 1.1921
    },
    {
      "outletId": "D2025",
      "outletName": "Grosir Bahagia Sentosa",
      "outletType": "Grosir",
      "region": "Jawa Tengah",
      "branch": "Purwokerto",
      "salesman": "Nur",
      "netIdr": 48509000,
      "invoices": 12,
      "firstMonthIdr": 26645300,
      "lastMonthIdr": 21863700,
      "changePct": -17.9,
      "lastOrder": "2026-10-24",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 1.2784
    }
  ],
  "cleaning": {
    "rowsRead": 972,
    "rowsKept": 971,
    "duplicates": [
      {
        "invoiceNo": "INV700152",
        "sku": "Tos Tos Jagung Bakar 140g"
      }
    ],
    "regionFixes": [
      {
        "from": "JAWA TIMUR",
        "to": "Jawa Timur",
        "rows": 1
      },
      {
        "from": "Jabar",
        "to": "Jawa Barat",
        "rows": 1
      }
    ],
    "nameFixes": [
      {
        "outletId": "D2033",
        "from": "Grosir Bintang Lestari ",
        "to": "Grosir Bintang Lestari",
        "rows": 1
      }
    ],
    "returns": [
      {
        "invoiceNo": "RTR900101",
        "outletId": "D2008",
        "outletName": "Warung Sejahtera Cahaya",
        "date": "2026-10-15",
        "netIdr": -170000
      }
    ],
    "sharedNames": [
      {
        "name": "Mini Harapan Sejahtera",
        "outletIds": [
          "D2006",
          "D2018"
        ]
      },
      {
        "name": "Toko Cahaya Bahagia",
        "outletIds": [
          "D2003",
          "D2043"
        ]
      },
      {
        "name": "Warung Pelangi Harapan",
        "outletIds": [
          "D2024",
          "D2048"
        ]
      }
    ],
    "invalid": [],
    "blankSalesman": [
      {
        "line": 503,
        "invoiceNo": "INV700247",
        "outletId": "D2009"
      },
      {
        "line": 804,
        "invoiceNo": "INV700397",
        "outletId": "D2025"
      }
    ]
  }
};
