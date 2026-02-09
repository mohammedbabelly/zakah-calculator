# Zakah Calculator | حاسبة الزكاة

A bilingual (Arabic/English) web app to calculate Islamic Zakah on gold and currency assets using live exchange rates.

## Features

- **Gold assets** — Add gold in 18K, 21K, 22K, or 24K by weight (grams)
- **Currency assets** — USD, EUR, SYP, TRY, AED, SAR
- **Live rates** — Fetches real-time gold prices and currency exchange rates
- **Nisab calculation** — Automatically computes the nisab threshold (85g of 24K gold)
- **Zakah** — Calculates 2.5% of total wealth if above nisab
- **Bilingual** — Arabic (RTL) and English (LTR) with one-click toggle
- **Offline fallback** — Manual rate entry when APIs are unavailable
- **Persistent** — Assets saved to localStorage across sessions

## Rate Sources

| Data | Source | Update Frequency |
|------|--------|-----------------|
| Currency exchange rates | [ExchangeRate-API](https://open.er-api.com) (free, no key) | Daily |
| Gold price (primary) | [goldprice.org](https://www.goldprice.org) | Near real-time |
| Gold price (fallback) | [National Bank of Poland (NBP)](https://api.nbp.pl) | Daily |

Gold prices are fetched server-side via a Cloudflare Worker to avoid CORS issues. The worker tries goldprice.org first, then falls back to NBP (which returns the price in PLN and converts to USD using the exchange rate).

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- react-i18next
- Cloudflare Workers (for gold price API proxy)

## Development

```bash
npm install
npm run dev
```

For local testing with the gold price API:

```bash
npx wrangler dev
```

## Deployment

Deployed to Cloudflare via `wrangler deploy`. The build and deploy commands:

```bash
npm run build
npx wrangler deploy
```

## Zakah Calculation Logic

- **Nisab** = 85 grams of 24K gold (or equivalent in currency)
- **Gold purity**: 24K = 100%, 22K = 91.67%, 21K = 87.5%, 18K = 75%
- All assets are converted to USD using live rates
- If total value ≥ nisab → **Zakah = total × 2.5%**
