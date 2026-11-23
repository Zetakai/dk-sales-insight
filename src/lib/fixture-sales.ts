import type { Insights } from './types';

/**
 * Reference result for data/sales.csv, written by scripts/reference_insights.py: an independent
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
    "netIdr": 1725966000,
    "grossIdr": 1756320000,
    "discountIdr": 30354000,
    "returnsIdr": -528000,
    "invoices": 823,
    "outlets": 52,
    "cartons": 8745,
    "byMonth": {
      "2026-09": 847517400,
      "2026-10": 878448600
    },
    "changePct": 3.6
  },
  "byRegion": [
    {
      "key": "Jabodetabek",
      "netIdr": 495827800,
      "share": 0.2873,
      "byMonth": {
        "2026-09": 239006100,
        "2026-10": 256821700
      },
      "changePct": 7.5,
      "driver": {
        "branch": "Jakarta Barat",
        "deltaIdr": 15844700,
        "changePct": 20.7
      }
    },
    {
      "key": "Sumatera",
      "netIdr": 340690500,
      "share": 0.1974,
      "byMonth": {
        "2026-09": 178317300,
        "2026-10": 162373200
      },
      "changePct": -8.9,
      "driver": {
        "branch": "Palembang",
        "deltaIdr": -17271500,
        "changePct": -21.2
      }
    },
    {
      "key": "Jawa Barat",
      "netIdr": 310947300,
      "share": 0.1802,
      "byMonth": {
        "2026-09": 167064500,
        "2026-10": 143882800
      },
      "changePct": -13.9,
      "driver": {
        "branch": "Bandung",
        "deltaIdr": -31249100,
        "changePct": -24.9
      }
    },
    {
      "key": "Jawa Tengah",
      "netIdr": 222881500,
      "share": 0.1291,
      "byMonth": {
        "2026-09": 116947900,
        "2026-10": 105933600
      },
      "changePct": -9.4,
      "driver": {
        "branch": "Solo",
        "deltaIdr": -17671900,
        "changePct": -18.9
      }
    },
    {
      "key": "Jawa Timur",
      "netIdr": 211378500,
      "share": 0.1225,
      "byMonth": {
        "2026-09": 72301400,
        "2026-10": 139077100
      },
      "changePct": 92.4,
      "driver": {
        "branch": "Malang",
        "deltaIdr": 61982400,
        "changePct": 151.2
      }
    },
    {
      "key": "Kalimantan",
      "netIdr": 144240400,
      "share": 0.0836,
      "byMonth": {
        "2026-09": 73880200,
        "2026-10": 70360200
      },
      "changePct": -4.8,
      "driver": {
        "branch": "Balikpapan",
        "deltaIdr": -8715800,
        "changePct": -14.4
      }
    }
  ],
  "byBrand": [
    {
      "key": "Kacang Dua Kelinci",
      "netIdr": 739781900,
      "share": 0.4286,
      "byMonth": {
        "2026-09": 363559700,
        "2026-10": 376222200
      },
      "changePct": 3.5
    },
    {
      "key": "Tos Tos",
      "netIdr": 285909300,
      "share": 0.1657,
      "byMonth": {
        "2026-09": 141490900,
        "2026-10": 144418400
      },
      "changePct": 2.1
    },
    {
      "key": "Sukro",
      "netIdr": 271738100,
      "share": 0.1574,
      "byMonth": {
        "2026-09": 133867800,
        "2026-10": 137870300
      },
      "changePct": 3.0
    },
    {
      "key": "Tic Tac",
      "netIdr": 187336900,
      "share": 0.1085,
      "byMonth": {
        "2026-09": 94757100,
        "2026-10": 92579800
      },
      "changePct": -2.3
    },
    {
      "key": "Deka",
      "netIdr": 91197500,
      "share": 0.0528,
      "byMonth": {
        "2026-09": 38655500,
        "2026-10": 52542000
      },
      "changePct": 35.9
    },
    {
      "key": "Pilus",
      "netIdr": 71659900,
      "share": 0.0415,
      "byMonth": {
        "2026-09": 38159900,
        "2026-10": 33500000
      },
      "changePct": -12.2
    },
    {
      "key": "Usagi",
      "netIdr": 43943200,
      "share": 0.0255,
      "byMonth": {
        "2026-09": 20537300,
        "2026-10": 23405900
      },
      "changePct": 14.0
    },
    {
      "key": "Roni",
      "netIdr": 34399200,
      "share": 0.0199,
      "byMonth": {
        "2026-09": 16489200,
        "2026-10": 17910000
      },
      "changePct": 8.6
    }
  ],
  "weakest": [
    {
      "outletId": "OUT1003",
      "outletName": "Toko Sinar Abadi",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Jakarta Barat",
      "salesman": "Andi",
      "netIdr": 564000,
      "invoices": 3,
      "firstMonthIdr": 192000,
      "lastMonthIdr": 372000,
      "changePct": 93.8,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0382
    },
    {
      "outletId": "OUT1026",
      "outletName": "Toko Mulia",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Solo",
      "salesman": "Nanda",
      "netIdr": 834000,
      "invoices": 5,
      "firstMonthIdr": 330000,
      "lastMonthIdr": 504000,
      "changePct": 52.7,
      "lastOrder": "2026-10-21",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0565
    },
    {
      "outletId": "OUT1045",
      "outletName": "Toko Anugerah",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Banjarmasin",
      "salesman": "Bayu",
      "netIdr": 1158000,
      "invoices": 6,
      "firstMonthIdr": 798000,
      "lastMonthIdr": 360000,
      "changePct": -54.9,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0784
    },
    {
      "outletId": "OUT1042",
      "outletName": "Toko Mandiri",
      "outletType": "Toko Kelontong",
      "region": "Sumatera",
      "branch": "Palembang",
      "salesman": "Yudi",
      "netIdr": 1230000,
      "invoices": 6,
      "firstMonthIdr": 360000,
      "lastMonthIdr": 870000,
      "changePct": 141.7,
      "lastOrder": "2026-10-23",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0833
    },
    {
      "outletId": "OUT1035",
      "outletName": "Warung Maju Lancar",
      "outletType": "Warung",
      "region": "Jawa Timur",
      "branch": "Malang",
      "salesman": "Sari",
      "netIdr": 1122000,
      "invoices": 5,
      "firstMonthIdr": 378000,
      "lastMonthIdr": 744000,
      "changePct": 96.8,
      "lastOrder": "2026-10-23",
      "peerMedianIdr": 12407100,
      "peerIndex": 0.0904
    }
  ],
  "biggestDrops": [
    {
      "outletId": "OUT1043",
      "outletName": "Minimarket Sido Muncul",
      "outletType": "Minimarket",
      "region": "Sumatera",
      "branch": "Palembang",
      "salesman": "Zaki",
      "netIdr": 12055400,
      "invoices": 8,
      "firstMonthIdr": 9181700,
      "lastMonthIdr": 2873700,
      "changePct": -68.7,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 17896500.0,
      "peerIndex": 0.6736
    },
    {
      "outletId": "OUT1022",
      "outletName": "Toko Bintang",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Kurnia",
      "netIdr": 11987400,
      "invoices": 10,
      "firstMonthIdr": 8764300,
      "lastMonthIdr": 3223100,
      "changePct": -63.2,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.8116
    },
    {
      "outletId": "OUT1045",
      "outletName": "Toko Anugerah",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Banjarmasin",
      "salesman": "Bayu",
      "netIdr": 1158000,
      "invoices": 6,
      "firstMonthIdr": 798000,
      "lastMonthIdr": 360000,
      "changePct": -54.9,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0784
    },
    {
      "outletId": "OUT1041",
      "outletName": "Toko Anugerah",
      "outletType": "Toko Kelontong",
      "region": "Sumatera",
      "branch": "Palembang",
      "salesman": "Yudi",
      "netIdr": 18404500,
      "invoices": 18,
      "firstMonthIdr": 12494900,
      "lastMonthIdr": 5909600,
      "changePct": -52.7,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.246
    },
    {
      "outletId": "OUT1048",
      "outletName": "Toko Mekar",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Banjarmasin",
      "salesman": "Bayu",
      "netIdr": 7617600,
      "invoices": 8,
      "firstMonthIdr": 5143700,
      "lastMonthIdr": 2473900,
      "changePct": -51.9,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.5157
    }
  ],
  "outlets": [
    {
      "outletId": "OUT1003",
      "outletName": "Toko Sinar Abadi",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Jakarta Barat",
      "salesman": "Andi",
      "netIdr": 564000,
      "invoices": 3,
      "firstMonthIdr": 192000,
      "lastMonthIdr": 372000,
      "changePct": 93.8,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0382
    },
    {
      "outletId": "OUT1026",
      "outletName": "Toko Mulia",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Solo",
      "salesman": "Nanda",
      "netIdr": 834000,
      "invoices": 5,
      "firstMonthIdr": 330000,
      "lastMonthIdr": 504000,
      "changePct": 52.7,
      "lastOrder": "2026-10-21",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0565
    },
    {
      "outletId": "OUT1045",
      "outletName": "Toko Anugerah",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Banjarmasin",
      "salesman": "Bayu",
      "netIdr": 1158000,
      "invoices": 6,
      "firstMonthIdr": 798000,
      "lastMonthIdr": 360000,
      "changePct": -54.9,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0784
    },
    {
      "outletId": "OUT1042",
      "outletName": "Toko Mandiri",
      "outletType": "Toko Kelontong",
      "region": "Sumatera",
      "branch": "Palembang",
      "salesman": "Yudi",
      "netIdr": 1230000,
      "invoices": 6,
      "firstMonthIdr": 360000,
      "lastMonthIdr": 870000,
      "changePct": 141.7,
      "lastOrder": "2026-10-23",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.0833
    },
    {
      "outletId": "OUT1035",
      "outletName": "Warung Maju Lancar",
      "outletType": "Warung",
      "region": "Jawa Timur",
      "branch": "Malang",
      "salesman": "Sari",
      "netIdr": 1122000,
      "invoices": 5,
      "firstMonthIdr": 378000,
      "lastMonthIdr": 744000,
      "changePct": 96.8,
      "lastOrder": "2026-10-23",
      "peerMedianIdr": 12407100,
      "peerIndex": 0.0904
    },
    {
      "outletId": "OUT1040",
      "outletName": "Toko Sinar Abadi",
      "outletType": "Toko Kelontong",
      "region": "Sumatera",
      "branch": "Medan",
      "salesman": "Teguh",
      "netIdr": 5225200,
      "invoices": 5,
      "firstMonthIdr": 1718400,
      "lastMonthIdr": 3506800,
      "changePct": 104.1,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.3538
    },
    {
      "outletId": "OUT1016",
      "outletName": "Minimarket Berkah",
      "outletType": "Minimarket",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Hendra",
      "netIdr": 8955400,
      "invoices": 11,
      "firstMonthIdr": 4562800,
      "lastMonthIdr": 4392600,
      "changePct": -3.7,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 17896500.0,
      "peerIndex": 0.5004
    },
    {
      "outletId": "OUT1048",
      "outletName": "Toko Mekar",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Banjarmasin",
      "salesman": "Bayu",
      "netIdr": 7617600,
      "invoices": 8,
      "firstMonthIdr": 5143700,
      "lastMonthIdr": 2473900,
      "changePct": -51.9,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.5157
    },
    {
      "outletId": "OUT1047",
      "outletName": "Warung Sumber Makmur",
      "outletType": "Warung",
      "region": "Kalimantan",
      "branch": "Banjarmasin",
      "salesman": "Agus",
      "netIdr": 6974500,
      "invoices": 6,
      "firstMonthIdr": 0,
      "lastMonthIdr": 6974500,
      "changePct": null,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 12407100,
      "peerIndex": 0.5621
    },
    {
      "outletId": "OUT1050",
      "outletName": "Grosir Sinar Abadi",
      "outletType": "Grosir",
      "region": "Kalimantan",
      "branch": "Balikpapan",
      "salesman": "Dewi",
      "netIdr": 79791300,
      "invoices": 18,
      "firstMonthIdr": 45364000,
      "lastMonthIdr": 34427300,
      "changePct": -24.1,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 136807000.0,
      "peerIndex": 0.5832
    },
    {
      "outletId": "OUT1018",
      "outletName": "Warung Murah Meriah",
      "outletType": "Warung",
      "region": "Jawa Barat",
      "branch": "Cirebon",
      "salesman": "Joko",
      "netIdr": 8050600,
      "invoices": 8,
      "firstMonthIdr": 4220200,
      "lastMonthIdr": 3830400,
      "changePct": -9.2,
      "lastOrder": "2026-10-27",
      "peerMedianIdr": 12407100,
      "peerIndex": 0.6489
    },
    {
      "outletId": "OUT1043",
      "outletName": "Minimarket Sido Muncul",
      "outletType": "Minimarket",
      "region": "Sumatera",
      "branch": "Palembang",
      "salesman": "Zaki",
      "netIdr": 12055400,
      "invoices": 8,
      "firstMonthIdr": 9181700,
      "lastMonthIdr": 2873700,
      "changePct": -68.7,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 17896500.0,
      "peerIndex": 0.6736
    },
    {
      "outletId": "OUT1001",
      "outletName": "Toko Sinar Abadi",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Jakarta Barat",
      "salesman": "Andi",
      "netIdr": 10508900,
      "invoices": 9,
      "firstMonthIdr": 6929900,
      "lastMonthIdr": 3579000,
      "changePct": -48.4,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.7115
    },
    {
      "outletId": "OUT1051",
      "outletName": "Warung Sumber Alam",
      "outletType": "Warung",
      "region": "Kalimantan",
      "branch": "Balikpapan",
      "salesman": "Feri",
      "netIdr": 8995900,
      "invoices": 8,
      "firstMonthIdr": 3140400,
      "lastMonthIdr": 5855500,
      "changePct": 86.5,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 12407100,
      "peerIndex": 0.7251
    },
    {
      "outletId": "OUT1021",
      "outletName": "Toko Mandiri",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Kurnia",
      "netIdr": 10961500,
      "invoices": 13,
      "firstMonthIdr": 4927700,
      "lastMonthIdr": 6033800,
      "changePct": 22.4,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.7421
    },
    {
      "outletId": "OUT1036",
      "outletName": "Grosir Lancar Jaya",
      "outletType": "Grosir",
      "region": "Jawa Timur",
      "branch": "Malang",
      "salesman": "Rizal",
      "netIdr": 104259000,
      "invoices": 27,
      "firstMonthIdr": 28296400,
      "lastMonthIdr": 75962600,
      "changePct": 168.5,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 136807000.0,
      "peerIndex": 0.7621
    },
    {
      "outletId": "OUT1052",
      "outletName": "Toko Maju Lancar",
      "outletType": "Toko Kelontong",
      "region": "Kalimantan",
      "branch": "Balikpapan",
      "salesman": "Feri",
      "netIdr": 11586100,
      "invoices": 9,
      "firstMonthIdr": 5942300,
      "lastMonthIdr": 5643800,
      "changePct": -5.0,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.7844
    },
    {
      "outletId": "OUT1022",
      "outletName": "Toko Bintang",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Kurnia",
      "netIdr": 11987400,
      "invoices": 10,
      "firstMonthIdr": 8764300,
      "lastMonthIdr": 3223100,
      "changePct": -63.2,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.8116
    },
    {
      "outletId": "OUT1044",
      "outletName": "Grosir Sumber Rejeki",
      "outletType": "Grosir",
      "region": "Sumatera",
      "branch": "Palembang",
      "salesman": "Yudi",
      "netIdr": 114326600,
      "invoices": 27,
      "firstMonthIdr": 59607400,
      "lastMonthIdr": 54719200,
      "changePct": -8.2,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 136807000.0,
      "peerIndex": 0.8357
    },
    {
      "outletId": "OUT1032",
      "outletName": "Toko Murah Meriah",
      "outletType": "Toko Kelontong",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Putri",
      "netIdr": 12963300,
      "invoices": 14,
      "firstMonthIdr": 5815900,
      "lastMonthIdr": 7147400,
      "changePct": 22.9,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.8776
    },
    {
      "outletId": "OUT1011",
      "outletName": "Warung Sentosa",
      "outletType": "Warung",
      "region": "Jabodetabek",
      "branch": "Bekasi",
      "salesman": "Fajar",
      "netIdr": 11783100,
      "invoices": 12,
      "firstMonthIdr": 5211500,
      "lastMonthIdr": 6571600,
      "changePct": 26.1,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 12407100,
      "peerIndex": 0.9497
    },
    {
      "outletId": "OUT1034",
      "outletName": "Minimarket Sumber Alam",
      "outletType": "Minimarket",
      "region": "Jawa Timur",
      "branch": "Malang",
      "salesman": "Sari",
      "netIdr": 17113900,
      "invoices": 15,
      "firstMonthIdr": 4821100,
      "lastMonthIdr": 12292800,
      "changePct": 155.0,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 17896500.0,
      "peerIndex": 0.9563
    },
    {
      "outletId": "OUT1049",
      "outletName": "Warung Sido Muncul",
      "outletType": "Warung",
      "region": "Kalimantan",
      "branch": "Balikpapan",
      "salesman": "Dewi",
      "netIdr": 11898100,
      "invoices": 13,
      "firstMonthIdr": 6046900,
      "lastMonthIdr": 5851200,
      "changePct": -3.2,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 12407100,
      "peerIndex": 0.959
    },
    {
      "outletId": "OUT1025",
      "outletName": "Grosir Sumber Alam",
      "outletType": "Grosir",
      "region": "Jawa Tengah",
      "branch": "Solo",
      "salesman": "Nanda",
      "netIdr": 134818800,
      "invoices": 28,
      "firstMonthIdr": 79553600,
      "lastMonthIdr": 55265200,
      "changePct": -30.5,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 136807000.0,
      "peerIndex": 0.9855
    },
    {
      "outletId": "OUT1039",
      "outletName": "Toko Sido Muncul",
      "outletType": "Toko Kelontong",
      "region": "Sumatera",
      "branch": "Medan",
      "salesman": "Teguh",
      "netIdr": 14595100,
      "invoices": 15,
      "firstMonthIdr": 8491500,
      "lastMonthIdr": 6103600,
      "changePct": -28.1,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 14770600,
      "peerIndex": 0.9881
    },
    {
      "outletId": "OUT1031",
      "outletName": "Warung Mandiri",
      "outletType": "Warung",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Oki",
      "netIdr": 12407100,
      "invoices": 14,
      "firstMonthIdr": 7071400,
      "lastMonthIdr": 5335700,
      "changePct": -24.5,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 12407100,
      "peerIndex": 1.0
    },
    {
      "outletId": "OUT1010",
      "outletName": "Toko Sejahtera",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Bekasi",
      "salesman": "Eko",
      "netIdr": 14770600,
      "invoices": 13,
      "firstMonthIdr": 6590400,
      "lastMonthIdr": 8180200,
      "changePct": 24.1,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.0
    },
    {
      "outletId": "OUT1028",
      "outletName": "Toko Kencana",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Solo",
      "salesman": "Nanda",
      "netIdr": 14937100,
      "invoices": 14,
      "firstMonthIdr": 4594300,
      "lastMonthIdr": 10342800,
      "changePct": 125.1,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.0113
    },
    {
      "outletId": "OUT1004",
      "outletName": "Grosir Berkah",
      "outletType": "Grosir",
      "region": "Jabodetabek",
      "branch": "Jakarta Barat",
      "salesman": "Andi",
      "netIdr": 138795200,
      "invoices": 37,
      "firstMonthIdr": 58658800,
      "lastMonthIdr": 80136400,
      "changePct": 36.6,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 136807000.0,
      "peerIndex": 1.0145
    },
    {
      "outletId": "OUT1038",
      "outletName": "Minimarket Bintang",
      "outletType": "Minimarket",
      "region": "Sumatera",
      "branch": "Medan",
      "salesman": "Wahyu",
      "netIdr": 18679100,
      "invoices": 16,
      "firstMonthIdr": 10365000,
      "lastMonthIdr": 8314100,
      "changePct": -19.8,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 17896500.0,
      "peerIndex": 1.0437
    },
    {
      "outletId": "OUT1024",
      "outletName": "Toko Anugerah",
      "outletType": "Toko Kelontong",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Lestari",
      "netIdr": 15424400,
      "invoices": 14,
      "firstMonthIdr": 4426200,
      "lastMonthIdr": 10998200,
      "changePct": 148.5,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.0443
    },
    {
      "outletId": "OUT1008",
      "outletName": "Toko Lancar Jaya",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Tangerang",
      "salesman": "Citra",
      "netIdr": 15561400,
      "invoices": 16,
      "firstMonthIdr": 7256300,
      "lastMonthIdr": 8305100,
      "changePct": 14.5,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.0535
    },
    {
      "outletId": "OUT1027",
      "outletName": "Minimarket Sentosa",
      "outletType": "Minimarket",
      "region": "Jawa Tengah",
      "branch": "Solo",
      "salesman": "Nanda",
      "netIdr": 18966800,
      "invoices": 15,
      "firstMonthIdr": 9136400,
      "lastMonthIdr": 9830400,
      "changePct": 7.6,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 17896500.0,
      "peerIndex": 1.0598
    },
    {
      "outletId": "OUT1037",
      "outletName": "Grosir Sumber Makmur",
      "outletType": "Grosir",
      "region": "Sumatera",
      "branch": "Medan",
      "salesman": "Teguh",
      "netIdr": 156174600,
      "invoices": 30,
      "firstMonthIdr": 76098400,
      "lastMonthIdr": 80076200,
      "changePct": 5.2,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 136807000.0,
      "peerIndex": 1.1416
    },
    {
      "outletId": "OUT1014",
      "outletName": "Grosir Sentosa",
      "outletType": "Grosir",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Gita",
      "netIdr": 160490900,
      "invoices": 31,
      "firstMonthIdr": 96061900,
      "lastMonthIdr": 64429000,
      "changePct": -32.9,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 136807000.0,
      "peerIndex": 1.1731
    },
    {
      "outletId": "OUT1005",
      "outletName": "Toko Sumber Rejeki",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Tangerang",
      "salesman": "Citra",
      "netIdr": 17671400,
      "invoices": 14,
      "firstMonthIdr": 10087500,
      "lastMonthIdr": 7583900,
      "changePct": -24.8,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.1964
    },
    {
      "outletId": "OUT1023",
      "outletName": "Warung Harapan Baru",
      "outletType": "Warung",
      "region": "Jawa Tengah",
      "branch": "Semarang",
      "salesman": "Kurnia",
      "netIdr": 14951500,
      "invoices": 14,
      "firstMonthIdr": 5215400,
      "lastMonthIdr": 9736100,
      "changePct": 86.7,
      "lastOrder": "2026-10-28",
      "peerMedianIdr": 12407100,
      "peerIndex": 1.2051
    },
    {
      "outletId": "OUT1041",
      "outletName": "Toko Anugerah",
      "outletType": "Toko Kelontong",
      "region": "Sumatera",
      "branch": "Palembang",
      "salesman": "Yudi",
      "netIdr": 18404500,
      "invoices": 18,
      "firstMonthIdr": 12494900,
      "lastMonthIdr": 5909600,
      "changePct": -52.7,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.246
    },
    {
      "outletId": "OUT1046",
      "outletName": "Warung Sumber Alam",
      "outletType": "Warung",
      "region": "Kalimantan",
      "branch": "Banjarmasin",
      "salesman": "Agus",
      "netIdr": 16218900,
      "invoices": 11,
      "firstMonthIdr": 7444900,
      "lastMonthIdr": 8774000,
      "changePct": 17.9,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 12407100,
      "peerIndex": 1.3072
    },
    {
      "outletId": "OUT1029",
      "outletName": "Toko Cahaya",
      "outletType": "Toko Kelontong",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Oki",
      "netIdr": 19872900,
      "invoices": 15,
      "firstMonthIdr": 9655800,
      "lastMonthIdr": 10217100,
      "changePct": 5.8,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.3454
    },
    {
      "outletId": "OUT1007",
      "outletName": "Grosir Harapan Baru",
      "outletType": "Grosir",
      "region": "Jabodetabek",
      "branch": "Tangerang",
      "salesman": "Citra",
      "netIdr": 190526300,
      "invoices": 43,
      "firstMonthIdr": 93184900,
      "lastMonthIdr": 97341400,
      "changePct": 4.5,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 136807000.0,
      "peerIndex": 1.3927
    },
    {
      "outletId": "OUT1009",
      "outletName": "Minimarket Murah Meriah",
      "outletType": "Minimarket",
      "region": "Jabodetabek",
      "branch": "Bekasi",
      "salesman": "Eko",
      "netIdr": 25623500,
      "invoices": 18,
      "firstMonthIdr": 12590800,
      "lastMonthIdr": 13032700,
      "changePct": 3.5,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 17896500.0,
      "peerIndex": 1.4318
    },
    {
      "outletId": "OUT1030",
      "outletName": "Toko Mulia",
      "outletType": "Toko Kelontong",
      "region": "Jawa Timur",
      "branch": "Surabaya",
      "salesman": "Putri",
      "netIdr": 22153200,
      "invoices": 19,
      "firstMonthIdr": 8758500,
      "lastMonthIdr": 13394700,
      "changePct": 52.9,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.4998
    },
    {
      "outletId": "OUT1002",
      "outletName": "Warung Mulia",
      "outletType": "Warung",
      "region": "Jabodetabek",
      "branch": "Jakarta Barat",
      "salesman": "Andi",
      "netIdr": 18966600,
      "invoices": 17,
      "firstMonthIdr": 10714300,
      "lastMonthIdr": 8252300,
      "changePct": -23.0,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 12407100,
      "peerIndex": 1.5287
    },
    {
      "outletId": "OUT1013",
      "outletName": "Toko Bintang",
      "outletType": "Toko Kelontong",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Gita",
      "netIdr": 24018700,
      "invoices": 22,
      "firstMonthIdr": 13260500,
      "lastMonthIdr": 10758200,
      "changePct": -18.9,
      "lastOrder": "2026-10-26",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.6261
    },
    {
      "outletId": "OUT1006",
      "outletName": "Toko Sido Muncul",
      "outletType": "Toko Kelontong",
      "region": "Jabodetabek",
      "branch": "Tangerang",
      "salesman": "Dedi",
      "netIdr": 25260500,
      "invoices": 22,
      "firstMonthIdr": 14401900,
      "lastMonthIdr": 10858600,
      "changePct": -24.6,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.7102
    },
    {
      "outletId": "OUT1033",
      "outletName": "Warung Harapan Baru",
      "outletType": "Warung",
      "region": "Jawa Timur",
      "branch": "Malang",
      "salesman": "Sari",
      "netIdr": 21487100,
      "invoices": 17,
      "firstMonthIdr": 7504300,
      "lastMonthIdr": 13982800,
      "changePct": 86.3,
      "lastOrder": "2026-10-30",
      "peerMedianIdr": 12407100,
      "peerIndex": 1.7318
    },
    {
      "outletId": "OUT1015",
      "outletName": "Toko Jaya Abadi",
      "outletType": "Toko Kelontong",
      "region": "Jawa Barat",
      "branch": "Bandung",
      "salesman": "Gita",
      "netIdr": 26224300,
      "invoices": 20,
      "firstMonthIdr": 11584000,
      "lastMonthIdr": 14640300,
      "changePct": 26.4,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.7754
    },
    {
      "outletId": "OUT1017",
      "outletName": "Toko Pelangi",
      "outletType": "Toko Kelontong",
      "region": "Jawa Barat",
      "branch": "Cirebon",
      "salesman": "Joko",
      "netIdr": 29281400,
      "invoices": 24,
      "firstMonthIdr": 9953200,
      "lastMonthIdr": 19328200,
      "changePct": 94.2,
      "lastOrder": "2026-10-29",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.9824
    },
    {
      "outletId": "OUT1019",
      "outletName": "Toko Makmur Jaya",
      "outletType": "Toko Kelontong",
      "region": "Jawa Barat",
      "branch": "Cirebon",
      "salesman": "Joko",
      "netIdr": 29300800,
      "invoices": 23,
      "firstMonthIdr": 14763800,
      "lastMonthIdr": 14537000,
      "changePct": -1.5,
      "lastOrder": "2026-10-31",
      "peerMedianIdr": 14770600,
      "peerIndex": 1.9837
    },
    {
      "outletId": "OUT1020",
      "outletName": "Warung Berkah",
      "outletType": "Warung",
      "region": "Jawa Barat",
      "branch": "Cirebon",
      "salesman": "Joko",
      "netIdr": 24625200,
      "invoices": 20,
      "firstMonthIdr": 12658100,
      "lastMonthIdr": 11967100,
      "changePct": -5.5,
      "lastOrder": "2026-10-27",
      "peerMedianIdr": 12407100,
      "peerIndex": 1.9848
    },
    {
      "outletId": "OUT1012",
      "outletName": "Warung Sinar Abadi",
      "outletType": "Warung",
      "region": "Jabodetabek",
      "branch": "Bekasi",
      "salesman": "Fajar",
      "netIdr": 25796300,
      "invoices": 17,
      "firstMonthIdr": 13187800,
      "lastMonthIdr": 12608500,
      "changePct": -4.4,
      "lastOrder": "2026-10-22",
      "peerMedianIdr": 12407100,
      "peerIndex": 2.0792
    }
  ],
  "cleaning": {
    "rowsRead": 1891,
    "rowsKept": 1888,
    "duplicates": [
      {
        "invoiceNo": "INV500201",
        "sku": "Tos Tos Tortilla BBQ 140g"
      },
      {
        "invoiceNo": "INV500386",
        "sku": "Sukro Pedas 100g"
      },
      {
        "invoiceNo": "INV500791",
        "sku": "Kacang Kulit 250g"
      }
    ],
    "regionFixes": [
      {
        "from": "JABODETABEK",
        "to": "Jabodetabek",
        "rows": 1
      },
      {
        "from": "JAWA BARAT",
        "to": "Jawa Barat",
        "rows": 4
      },
      {
        "from": "JAWA TIMUR",
        "to": "Jawa Timur",
        "rows": 1
      },
      {
        "from": "Jabar",
        "to": "Jawa Barat",
        "rows": 4
      }
    ],
    "nameFixes": [
      {
        "outletId": "OUT1004",
        "from": "Grosir Berkah ",
        "to": "Grosir Berkah",
        "rows": 2
      },
      {
        "outletId": "OUT1005",
        "from": "Toko Sumber Rejeki ",
        "to": "Toko Sumber Rejeki",
        "rows": 1
      },
      {
        "outletId": "OUT1032",
        "from": "Toko Murah Meriah ",
        "to": "Toko Murah Meriah",
        "rows": 1
      }
    ],
    "returns": [
      {
        "invoiceNo": "RTR900001",
        "outletId": "OUT1049",
        "outletName": "Warung Sido Muncul",
        "date": "2026-10-10",
        "netIdr": -528000
      }
    ],
    "sharedNames": [
      {
        "name": "Toko Anugerah",
        "outletIds": [
          "OUT1024",
          "OUT1041",
          "OUT1045"
        ]
      },
      {
        "name": "Toko Bintang",
        "outletIds": [
          "OUT1013",
          "OUT1022"
        ]
      },
      {
        "name": "Toko Mandiri",
        "outletIds": [
          "OUT1021",
          "OUT1042"
        ]
      },
      {
        "name": "Toko Mulia",
        "outletIds": [
          "OUT1026",
          "OUT1030"
        ]
      },
      {
        "name": "Toko Sido Muncul",
        "outletIds": [
          "OUT1006",
          "OUT1039"
        ]
      },
      {
        "name": "Toko Sinar Abadi",
        "outletIds": [
          "OUT1001",
          "OUT1003",
          "OUT1040"
        ]
      },
      {
        "name": "Warung Harapan Baru",
        "outletIds": [
          "OUT1023",
          "OUT1033"
        ]
      },
      {
        "name": "Warung Sumber Alam",
        "outletIds": [
          "OUT1046",
          "OUT1051"
        ]
      }
    ],
    "invalid": [],
    "blankSalesman": [
      {
        "line": 604,
        "invoiceNo": "INV500251",
        "outletId": "OUT1020"
      },
      {
        "line": 999,
        "invoiceNo": "INV500423",
        "outletId": "OUT1038"
      },
      {
        "line": 1442,
        "invoiceNo": "INV500607",
        "outletId": "OUT1046"
      },
      {
        "line": 1464,
        "invoiceNo": "INV500617",
        "outletId": "OUT1021"
      },
      {
        "line": 1505,
        "invoiceNo": "INV500636",
        "outletId": "OUT1036"
      }
    ]
  }
};
