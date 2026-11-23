import type { Insights } from './types';

/**
 * Reference result for data/demo.csv, written by scripts/reference_insights.py: an independent
 * Python implementation of docs/SPEC.md. Do not edit by hand. Ratios rounded: share and peerIndex to 4 decimals,
 * percentages to 1 decimal.
 */
export const FIXTURE: Insights = {
  "period": {
    "from": "2026-09-01",
    "to": "2026-10-31",
    "months": [
      "2026-09",
      "2026-10"
    ]
  },
  "totals": {
    "netIdr": 812971800,
    "grossIdr": 818595000,
    "discountIdr": 5623200,
    "returnsIdr": -170000,
    "invoices": 480,
    "outlets": 46,
    "cartons": 4399,
    "byMonth": {
      "2026-09": 405832650,
      "2026-10": 407139150
    },
    "changePct": 0.3
  },
  "byRegion": [
    {
      "key": "Jabodetabek",
      "netIdr": 314806350,
      "share": 0.3872,
      "byMonth": {
        "2026-09": 166627750,
        "2026-10": 148178600
      },
      "changePct": -11.1,
      "driver": {
        "branch": "Jakarta Timur",
        "deltaIdr": -9622700,
        "changePct": -17.5
      }
    },
    {
      "key": "Jawa Barat",
      "netIdr": 115289450,
      "share": 0.1418,
      "byMonth": {
        "2026-09": 66014500,
        "2026-10": 49274950
      },
      "changePct": -25.4,
      "driver": {
        "branch": "Tasikmalaya",
        "deltaIdr": -12359600,
        "changePct": -27.9
      }
    },
    {
      "key": "Jawa Timur",
      "netIdr": 112981600,
      "share": 0.139,
      "byMonth": {
        "2026-09": 47368400,
        "2026-10": 65613200
      },
      "changePct": 38.5,
      "driver": {
        "branch": "Surabaya",
        "deltaIdr": 13889400,
        "changePct": 58.5
      }
    },
    {
      "key": "Jawa Tengah",
      "netIdr": 110667600,
      "share": 0.1361,
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
    },
    {
      "key": "Sumatera",
      "netIdr": 105016800,
      "share": 0.1292,
      "byMonth": {
        "2026-09": 52435800,
        "2026-10": 52581000
      },
      "changePct": 0.3,
      "driver": {
        "branch": "Pekanbaru",
        "deltaIdr": 7648800,
        "changePct": 44.2
      }
    },
    {
      "key": "Kalimantan",
      "netIdr": 54210000,
      "share": 0.0667,
      "byMonth": {
        "2026-09": 30370000,
        "2026-10": 23840000
      },
      "changePct": -21.5,
      "driver": {
        "branch": "Samarinda",
        "deltaIdr": -9330000,
        "changePct": -52.6
      }
    }
  ],
  "byBrand": [
    {
      "key": "Kacang Dua Kelinci",
      "netIdr": 339183900,
      "share": 0.4172,
      "byMonth": {
        "2026-09": 168843600,
        "2026-10": 170340300
      },
      "changePct": 0.9
    },
    {
      "key": "Sukro",
      "netIdr": 166613800,
      "share": 0.2049,
      "byMonth": {
        "2026-09": 82541750,
        "2026-10": 84072050
      },
      "changePct": 1.9
    },
    {
      "key": "Tos Tos",
      "netIdr": 91165000,
      "share": 0.1121,
      "byMonth": {
        "2026-09": 55352500,
        "2026-10": 35812500
      },
      "changePct": -35.3
    },
    {
      "key": "Pilus",
      "netIdr": 89128500,
      "share": 0.1096,
      "byMonth": {
        "2026-09": 44757000,
        "2026-10": 44371500
      },
      "changePct": -0.9
    },
    {
      "key": "Tic Tac",
      "netIdr": 83339200,
      "share": 0.1025,
      "byMonth": {
        "2026-09": 34940800,
        "2026-10": 48398400
      },
      "changePct": 38.5
    },
    {
      "key": "Usagi",
      "netIdr": 43541400,
      "share": 0.0536,
      "byMonth": {
        "2026-09": 19397000,
        "2026-10": 24144400
      },
      "changePct": 24.5
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
      "outletId": "D2031",
      "outletName": "Toko Cahaya Lestari",
      "outletType": "Toko Kelontong",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Eko",
      "netIdr": 1600000,
      "invoices": 1,
      "firstMonthIdr": 0,
      "lastMonthIdr": 1600000,
      "changePct": null,
      "lastOrder": "2026-10-21",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.167
    },
    {
      "outletId": "D2049",
      "outletName": "Grosir Pelangi Harapan",
      "outletType": "Grosir",
      "region": "Kalimantan",
      "branch": "Samarinda",
      "salesman": "Nur",
      "netIdr": 6740000,
      "invoices": 2,
      "firstMonthIdr": 6740000,
      "lastMonthIdr": 0,
      "changePct": -100.0,
      "lastOrder": "2026-09-08",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.1776
    },
    {
      "outletId": "D2014",
      "outletName": "Mini Cahaya Bintang",
      "outletType": "Minimarket",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Bayu",
      "netIdr": 3290000,
      "invoices": 3,
      "firstMonthIdr": 2250000,
      "lastMonthIdr": 1040000,
      "changePct": -53.8,
      "lastOrder": "2026-10-03",
      "peerMedianIdr": 12465000,
      "peerIndex": 0.2639
    },
    {
      "outletId": "D2015",
      "outletName": "Toko Bintang Harapan",
      "outletType": "Toko Kelontong",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Bayu",
      "netIdr": 2965000,
      "invoices": 4,
      "firstMonthIdr": 1845000,
      "lastMonthIdr": 1120000,
      "changePct": -39.3,
      "lastOrder": "2026-10-20",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.3095
    }
  ],
  "biggestDrops": [
    {
      "outletId": "D2049",
      "outletName": "Grosir Pelangi Harapan",
      "outletType": "Grosir",
      "region": "Kalimantan",
      "branch": "Samarinda",
      "salesman": "Nur",
      "netIdr": 6740000,
      "invoices": 2,
      "firstMonthIdr": 6740000,
      "lastMonthIdr": 0,
      "changePct": -100.0,
      "lastOrder": "2026-09-08",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.1776
    },
    {
      "outletId": "D2051",
      "outletName": "Toko Harapan Rejeki",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Samarinda",
      "salesman": "Nur",
      "netIdr": 4140000,
      "invoices": 3,
      "firstMonthIdr": 4140000,
      "lastMonthIdr": 0,
      "changePct": -100.0,
      "lastOrder": "2026-09-27",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.4322
    },
    {
      "outletId": "D2043",
      "outletName": "Toko Cahaya Bahagia",
      "outletType": "Toko Kelontong",
      "region": "Sumatera",
      "branch": "Lampung",
      "salesman": "Ahmad",
      "netIdr": 7670000,
      "invoices": 7,
      "firstMonthIdr": 6940000,
      "lastMonthIdr": 730000,
      "changePct": -89.5,
      "lastOrder": "2026-10-05",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.8006
    },
    {
      "outletId": "D2044",
      "outletName": "Warung Pelangi Bahagia",
      "outletType": "Warung",
      "region": "Sumatera",
      "branch": "Lampung",
      "salesman": "Ahmad",
      "netIdr": 4270000,
      "invoices": 5,
      "firstMonthIdr": 3790000,
      "lastMonthIdr": 480000,
      "changePct": -87.3,
      "lastOrder": "2026-10-18",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 0.601
    },
    {
      "outletId": "D2002",
      "outletName": "Mini Sentosa Maju",
      "outletType": "Minimarket",
      "region": "Jabodetabek",
      "branch": "Jakarta Timur",
      "salesman": "Hana",
      "netIdr": 14810000,
      "invoices": 13,
      "firstMonthIdr": 12640000,
      "lastMonthIdr": 2170000,
      "changePct": -82.8,
      "lastOrder": "2026-10-27",
      "peerMedianIdr": 12465000,
      "peerIndex": 1.1881
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
      "outletId": "D2031",
      "outletName": "Toko Cahaya Lestari",
      "outletType": "Toko Kelontong",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Eko",
      "netIdr": 1600000,
      "invoices": 1,
      "firstMonthIdr": 0,
      "lastMonthIdr": 1600000,
      "changePct": null,
      "lastOrder": "2026-10-21",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.167
    },
    {
      "outletId": "D2049",
      "outletName": "Grosir Pelangi Harapan",
      "outletType": "Grosir",
      "region": "Kalimantan",
      "branch": "Samarinda",
      "salesman": "Nur",
      "netIdr": 6740000,
      "invoices": 2,
      "firstMonthIdr": 6740000,
      "lastMonthIdr": 0,
      "changePct": -100.0,
      "lastOrder": "2026-09-08",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.1776
    },
    {
      "outletId": "D2014",
      "outletName": "Mini Cahaya Bintang",
      "outletType": "Minimarket",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Bayu",
      "netIdr": 3290000,
      "invoices": 3,
      "firstMonthIdr": 2250000,
      "lastMonthIdr": 1040000,
      "changePct": -53.8,
      "lastOrder": "2026-10-03",
      "peerMedianIdr": 12465000,
      "peerIndex": 0.2639
    },
    {
      "outletId": "D2015",
      "outletName": "Toko Bintang Harapan",
      "outletType": "Toko Kelontong",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Bayu",
      "netIdr": 2965000,
      "invoices": 4,
      "firstMonthIdr": 1845000,
      "lastMonthIdr": 1120000,
      "changePct": -39.3,
      "lastOrder": "2026-10-20",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.3095
    },
    {
      "outletId": "D2051",
      "outletName": "Toko Harapan Rejeki",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Samarinda",
      "salesman": "Nur",
      "netIdr": 4140000,
      "invoices": 3,
      "firstMonthIdr": 4140000,
      "lastMonthIdr": 0,
      "changePct": -100.0,
      "lastOrder": "2026-09-27",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.4322
    },
    {
      "outletId": "D2032",
      "outletName": "Warung Mitra Maju",
      "outletType": "Warung",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Eko",
      "netIdr": 3275000,
      "invoices": 7,
      "firstMonthIdr": 1875000,
      "lastMonthIdr": 1400000,
      "changePct": -25.3,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 0.4609
    },
    {
      "outletId": "D2048",
      "outletName": "Warung Pelangi Harapan",
      "outletType": "Warung",
      "region": "Kalimantan",
      "branch": "Pontianak",
      "salesman": "Clara",
      "netIdr": 3550000,
      "invoices": 6,
      "firstMonthIdr": 2060000,
      "lastMonthIdr": 1490000,
      "changePct": -27.7,
      "lastOrder": "2026-10-24",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 0.4996
    },
    {
      "outletId": "D2044",
      "outletName": "Warung Pelangi Bahagia",
      "outletType": "Warung",
      "region": "Sumatera",
      "branch": "Lampung",
      "salesman": "Ahmad",
      "netIdr": 4270000,
      "invoices": 5,
      "firstMonthIdr": 3790000,
      "lastMonthIdr": 480000,
      "changePct": -87.3,
      "lastOrder": "2026-10-18",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 0.601
    },
    {
      "outletId": "D2013",
      "outletName": "Grosir Pelangi Sentosa",
      "outletType": "Grosir",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Bayu",
      "netIdr": 23869850,
      "invoices": 6,
      "firstMonthIdr": 14107400,
      "lastMonthIdr": 9762450,
      "changePct": -30.8,
      "lastOrder": "2026-10-13",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.6291
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
      "outletId": "D2037",
      "outletName": "Grosir Bahagia Maju",
      "outletType": "Grosir",
      "region": "Sumatera",
      "branch": "Pekanbaru",
      "salesman": "Fitri",
      "netIdr": 25776200,
      "invoices": 9,
      "firstMonthIdr": 11106200,
      "lastMonthIdr": 14670000,
      "changePct": 32.1,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.6793
    },
    {
      "outletId": "D2038",
      "outletName": "Mini Rejeki Cahaya",
      "outletType": "Minimarket",
      "region": "Sumatera",
      "branch": "Pekanbaru",
      "salesman": "Fitri",
      "netIdr": 8635000,
      "invoices": 10,
      "firstMonthIdr": 4040000,
      "lastMonthIdr": 4595000,
      "changePct": 13.7,
      "lastOrder": "2026-10-25",
      "peerMedianIdr": 12465000,
      "peerIndex": 0.6927
    },
    {
      "outletId": "D2010",
      "outletName": "Mini Mitra Rejeki",
      "outletType": "Minimarket",
      "region": "Jabodetabek",
      "branch": "Bogor",
      "salesman": "Eko",
      "netIdr": 8810000,
      "invoices": 6,
      "firstMonthIdr": 4250000,
      "lastMonthIdr": 4560000,
      "changePct": 7.3,
      "lastOrder": "2026-10-23",
      "peerMedianIdr": 12465000,
      "peerIndex": 0.7068
    },
    {
      "outletId": "D2052",
      "outletName": "Warung Mandala Mitra",
      "outletType": "Warung",
      "region": "Kalimantan",
      "branch": "Samarinda",
      "salesman": "Nur",
      "netIdr": 5030000,
      "invoices": 6,
      "firstMonthIdr": 1800000,
      "lastMonthIdr": 3230000,
      "changePct": 79.4,
      "lastOrder": "2026-10-22",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 0.708
    },
    {
      "outletId": "D2043",
      "outletName": "Toko Cahaya Bahagia",
      "outletType": "Toko Kelontong",
      "region": "Sumatera",
      "branch": "Lampung",
      "salesman": "Ahmad",
      "netIdr": 7670000,
      "invoices": 7,
      "firstMonthIdr": 6940000,
      "lastMonthIdr": 730000,
      "changePct": -89.5,
      "lastOrder": "2026-10-05",
      "peerMedianIdr": 9580000,
      "peerIndex": 0.8006
    },
    {
      "outletId": "D2050",
      "outletName": "Mini Sentosa Lestari",
      "outletType": "Minimarket",
      "region": "Kalimantan",
      "branch": "Samarinda",
      "salesman": "Nur",
      "netIdr": 10220000,
      "invoices": 10,
      "firstMonthIdr": 5050000,
      "lastMonthIdr": 5170000,
      "changePct": 2.4,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 12465000,
      "peerIndex": 0.8199
    },
    {
      "outletId": "D2033",
      "outletName": "Grosir Bintang Lestari",
      "outletType": "Grosir",
      "region": "Jawa Timur",
      "branch": "Kediri",
      "salesman": "Galih",
      "netIdr": 33757400,
      "invoices": 11,
      "firstMonthIdr": 12791000,
      "lastMonthIdr": 20966400,
      "changePct": 63.9,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.8896
    },
    {
      "outletId": "D2036",
      "outletName": "Warung Mitra Bintang",
      "outletType": "Warung",
      "region": "Jawa Timur",
      "branch": "Kediri",
      "salesman": "Galih",
      "netIdr": 6340000,
      "invoices": 11,
      "firstMonthIdr": 2380000,
      "lastMonthIdr": 3960000,
      "changePct": 66.4,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 0.8923
    },
    {
      "outletId": "D2034",
      "outletName": "Mini Mitra Sentosa",
      "outletType": "Minimarket",
      "region": "Jawa Timur",
      "branch": "Kediri",
      "salesman": "Galih",
      "netIdr": 11540000,
      "invoices": 8,
      "firstMonthIdr": 8470000,
      "lastMonthIdr": 3070000,
      "changePct": -63.8,
      "lastOrder": "2026-10-10",
      "peerMedianIdr": 12465000,
      "peerIndex": 0.9258
    },
    {
      "outletId": "D2017",
      "outletName": "Grosir Sejahtera Cahaya",
      "outletType": "Grosir",
      "region": "Jawa Barat",
      "branch": "Tasikmalaya",
      "salesman": "Eko",
      "netIdr": 35869600,
      "invoices": 11,
      "firstMonthIdr": 19667100,
      "lastMonthIdr": 16202500,
      "changePct": -17.6,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 0.9453
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
      "outletId": "D2042",
      "outletName": "Mini Sejahtera Cahaya",
      "outletType": "Minimarket",
      "region": "Sumatera",
      "branch": "Lampung",
      "salesman": "Ahmad",
      "netIdr": 12465000,
      "invoices": 10,
      "firstMonthIdr": 4310000,
      "lastMonthIdr": 8155000,
      "changePct": 89.2,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 12465000,
      "peerIndex": 1.0
    },
    {
      "outletId": "D2041",
      "outletName": "Grosir Cahaya Maju",
      "outletType": "Grosir",
      "region": "Sumatera",
      "branch": "Lampung",
      "salesman": "Ahmad",
      "netIdr": 38330600,
      "invoices": 10,
      "firstMonthIdr": 20079600,
      "lastMonthIdr": 18251000,
      "changePct": -9.1,
      "lastOrder": "2026-10-24",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 1.0102
    },
    {
      "outletId": "D2005",
      "outletName": "Grosir Bintang Pelangi",
      "outletType": "Grosir",
      "region": "Jabodetabek",
      "branch": "Depok",
      "salesman": "Nur",
      "netIdr": 38964250,
      "invoices": 13,
      "firstMonthIdr": 25033350,
      "lastMonthIdr": 13930900,
      "changePct": -44.4,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 1.0269
    },
    {
      "outletId": "D2047",
      "outletName": "Toko Bintang Cahaya",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Pontianak",
      "salesman": "Clara",
      "netIdr": 9955000,
      "invoices": 8,
      "firstMonthIdr": 4390000,
      "lastMonthIdr": 5565000,
      "changePct": 26.8,
      "lastOrder": "2026-10-25",
      "peerMedianIdr": 9580000,
      "peerIndex": 1.0391
    },
    {
      "outletId": "D2030",
      "outletName": "Mini Rejeki Maju",
      "outletType": "Minimarket",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Eko",
      "netIdr": 13100000,
      "invoices": 9,
      "firstMonthIdr": 6870000,
      "lastMonthIdr": 6230000,
      "changePct": -9.3,
      "lastOrder": "2026-10-23",
      "peerMedianIdr": 12465000,
      "peerIndex": 1.0509
    },
    {
      "outletId": "D2040",
      "outletName": "Warung Bintang Sejahtera",
      "outletType": "Warung",
      "region": "Sumatera",
      "branch": "Pekanbaru",
      "salesman": "Fitri",
      "netIdr": 7870000,
      "invoices": 7,
      "firstMonthIdr": 2170000,
      "lastMonthIdr": 5700000,
      "changePct": 162.7,
      "lastOrder": "2026-10-24",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 1.1077
    },
    {
      "outletId": "D2029",
      "outletName": "Grosir Pelangi Lestari",
      "outletType": "Grosir",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Eko",
      "netIdr": 43369200,
      "invoices": 12,
      "firstMonthIdr": 14982400,
      "lastMonthIdr": 28386800,
      "changePct": 89.5,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 1.143
    },
    {
      "outletId": "D2046",
      "outletName": "Mini Sentosa Bahagia",
      "outletType": "Minimarket",
      "region": "Kalimantan",
      "branch": "Pontianak",
      "salesman": "Clara",
      "netIdr": 14575000,
      "invoices": 12,
      "firstMonthIdr": 6190000,
      "lastMonthIdr": 8385000,
      "changePct": 35.5,
      "lastOrder": "2026-10-20",
      "peerMedianIdr": 12465000,
      "peerIndex": 1.1693
    },
    {
      "outletId": "D2002",
      "outletName": "Mini Sentosa Maju",
      "outletType": "Minimarket",
      "region": "Jabodetabek",
      "branch": "Jakarta Timur",
      "salesman": "Hana",
      "netIdr": 14810000,
      "invoices": 13,
      "firstMonthIdr": 12640000,
      "lastMonthIdr": 2170000,
      "changePct": -82.8,
      "lastOrder": "2026-10-27",
      "peerMedianIdr": 12465000,
      "peerIndex": 1.1881
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
      "outletId": "D2019",
      "outletName": "Toko Mitra Harapan",
      "outletType": "Toko Kelontong",
      "region": "Jawa Barat",
      "branch": "Tasikmalaya",
      "salesman": "Eko",
      "netIdr": 11855000,
      "invoices": 15,
      "firstMonthIdr": 4765000,
      "lastMonthIdr": 7090000,
      "changePct": 48.8,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 9580000,
      "peerIndex": 1.2375
    },
    {
      "outletId": "D2016",
      "outletName": "Warung Mitra Mandala",
      "outletType": "Warung",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Bayu",
      "netIdr": 8840000,
      "invoices": 13,
      "firstMonthIdr": 3470000,
      "lastMonthIdr": 5370000,
      "changePct": 54.8,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 1.2442
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
    },
    {
      "outletId": "D2020",
      "outletName": "Warung Rejeki Cahaya",
      "outletType": "Warung",
      "region": "Jawa Barat",
      "branch": "Tasikmalaya",
      "salesman": "Eko",
      "netIdr": 10325000,
      "invoices": 12,
      "firstMonthIdr": 6985000,
      "lastMonthIdr": 3340000,
      "changePct": -52.2,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 1.4532
    },
    {
      "outletId": "D2018",
      "outletName": "Mini Harapan Sejahtera",
      "outletType": "Minimarket",
      "region": "Jawa Barat",
      "branch": "Tasikmalaya",
      "salesman": "Eko",
      "netIdr": 18275000,
      "invoices": 16,
      "firstMonthIdr": 12925000,
      "lastMonthIdr": 5350000,
      "changePct": -58.6,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 12465000,
      "peerIndex": 1.4661
    },
    {
      "outletId": "D2007",
      "outletName": "Toko Harapan Pelangi",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Depok",
      "salesman": "Nur",
      "netIdr": 14250000,
      "invoices": 15,
      "firstMonthIdr": 4530000,
      "lastMonthIdr": 9720000,
      "changePct": 114.6,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 9580000,
      "peerIndex": 1.4875
    },
    {
      "outletId": "D2001",
      "outletName": "Grosir Harapan Cahaya",
      "outletType": "Grosir",
      "region": "Jabodetabek",
      "branch": "Jakarta Timur",
      "salesman": "Hana",
      "netIdr": 58218700,
      "invoices": 17,
      "firstMonthIdr": 29650700,
      "lastMonthIdr": 28568000,
      "changePct": -3.7,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 1.5343
    },
    {
      "outletId": "D2004",
      "outletName": "Warung Bintang Cahaya",
      "outletType": "Warung",
      "region": "Jabodetabek",
      "branch": "Jakarta Timur",
      "salesman": "Hana",
      "netIdr": 11215000,
      "invoices": 18,
      "firstMonthIdr": 4955000,
      "lastMonthIdr": 6260000,
      "changePct": 26.3,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 1.5785
    },
    {
      "outletId": "D2003",
      "outletName": "Toko Cahaya Bahagia",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Jakarta Timur",
      "salesman": "Hana",
      "netIdr": 15815000,
      "invoices": 19,
      "firstMonthIdr": 7595000,
      "lastMonthIdr": 8220000,
      "changePct": 8.2,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 9580000,
      "peerIndex": 1.6508
    },
    {
      "outletId": "D2011",
      "outletName": "Toko Cahaya Mitra",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Bogor",
      "salesman": "Eko",
      "netIdr": 17080000,
      "invoices": 16,
      "firstMonthIdr": 11210000,
      "lastMonthIdr": 5870000,
      "changePct": -47.6,
      "lastOrder": "2026-10-25",
      "peerMedianIdr": 9580000,
      "peerIndex": 1.7829
    },
    {
      "outletId": "D2006",
      "outletName": "Mini Harapan Sejahtera",
      "outletType": "Minimarket",
      "region": "Jabodetabek",
      "branch": "Depok",
      "salesman": "Nur",
      "netIdr": 26135000,
      "invoices": 18,
      "firstMonthIdr": 11555000,
      "lastMonthIdr": 14580000,
      "changePct": 26.2,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 12465000,
      "peerIndex": 2.0967
    },
    {
      "outletId": "D2009",
      "outletName": "Grosir Sentosa Bintang",
      "outletType": "Grosir",
      "region": "Jabodetabek",
      "branch": "Bogor",
      "salesman": "Eko",
      "netIdr": 92078400,
      "invoices": 24,
      "firstMonthIdr": 46168700,
      "lastMonthIdr": 45909700,
      "changePct": -0.6,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 37944600.0,
      "peerIndex": 2.4267
    },
    {
      "outletId": "D2008",
      "outletName": "Warung Sejahtera Cahaya",
      "outletType": "Warung",
      "region": "Jabodetabek",
      "branch": "Depok",
      "salesman": "Nur",
      "netIdr": 17430000,
      "invoices": 25,
      "firstMonthIdr": 9040000,
      "lastMonthIdr": 8390000,
      "changePct": -7.2,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 7105000.0,
      "peerIndex": 2.4532
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
