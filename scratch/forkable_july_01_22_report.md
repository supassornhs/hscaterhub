# Forkable GraphQL test: July 1–22, 2026

Live test run on July 28, 2026 for venue `17201`.

## Range totals

| Metric | Result |
|---|---:|
| Pickups | 48 |
| Orders | 117 |
| Items / pieces | 1,566 |
| Gross subtotal (`totalSubTotalWithChangeRequest`) | $26,067.90 |
| Payable balance (`balanceWithChangeRequests`) | $21,237.15 |
| Difference | $4,830.75 |

## Daily results

| Date | Pickups | Orders | Items | Gross subtotal | Payable balance | Difference |
|---|---:|---:|---:|---:|---:|---:|
| Jul 1 | 2 | 4 | 105 | $1,577.65 | $1,285.29 | $292.36 |
| Jul 2 | 2 | 6 | 80 | $1,377.05 | $1,121.86 | $255.19 |
| Jul 3 | 0 | 0 | 0 | $0.00 | $0.00 | $0.00 |
| Jul 6 | 4 | 8 | 65 | $1,105.25 | $900.43 | $204.82 |
| Jul 7 | 4 | 14 | 143 | $2,460.75 | $2,004.72 | $456.03 |
| Jul 8 | 5 | 11 | 145 | $2,394.05 | $1,950.39 | $443.66 |
| Jul 9 | 5 | 15 | 203 | $3,472.25 | $2,828.80 | $643.45 |
| Jul 10 | 1 | 2 | 32 | $571.10 | $465.27 | $105.83 |
| Jul 13 | 2 | 2 | 100 | $1,661.10 | $1,353.28 | $307.82 |
| Jul 14 | 5 | 13 | 206 | $3,177.40 | $2,588.61 | $588.79 |
| Jul 15 | 3 | 7 | 93 | $1,570.55 | $1,279.51 | $291.04 |
| Jul 16 | 5 | 10 | 200 | $3,550.00 | $2,892.13 | $657.87 |
| Jul 17 | 0 | 0 | 0 | $0.00 | $0.00 | $0.00 |
| Jul 20 | 3 | 5 | 19 | $330.60 | $269.33 | $61.27 |
| Jul 21 | 5 | 14 | 110 | $1,801.30 | $1,467.49 | $333.81 |
| Jul 22 | 2 | 6 | 65 | $1,018.85 | $830.04 | $188.81 |
| **Total** | **48** | **117** | **1,566** | **$26,067.90** | **$21,237.15** | **$4,830.75** |

## Validation

- All four weekly GraphQL requests returned successfully.
- All 48 pickup IDs are unique.
- No pickups outside July 1–22 remain after filtering.
- The six June 29–30 pickups and six July 23–26 pickups returned by the boundary weeks were excluded.
- Item totals equal the number of returned pieces.
- No pickups were returned for the weekdays July 3 and July 17.

## Manual CSV reconciliation

The manual CSV reports Forkable gross revenue of **$29,405.85** and labels the
period “1-22 July.” That amount includes the following July 23 activity:

| Date | Pickups | Orders | Items | Gross subtotal |
|---|---:|---:|---:|---:|
| Jul 23 | 4 | 10 | 198 | $3,337.95 |

The figures reconcile exactly:

`$26,067.90 (Jul 1-22) + $3,337.95 (Jul 23) = $29,405.85`

The GraphQL request and July 1–22 date filter are therefore correct. The manual
sheet's Forkable amount is through July 23 even though its period label says
July 1–22.
