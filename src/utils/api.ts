import type { ExchangeRates, GoldPrice } from '../types';

const EXCHANGE_RATE_URL = 'https://open.er-api.com/v6/latest/USD';
const GOLD_PRICE_URL = '/api/gold-price';

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const res = await fetch(EXCHANGE_RATE_URL);
  if (!res.ok) throw new Error(`Exchange rate API error: ${res.status}`);
  const data = await res.json();
  return {
    base: 'USD',
    rates: data.rates,
    lastUpdated: data.time_last_update_utc ?? new Date().toISOString(),
  };
}

export async function fetchGoldPrice(): Promise<GoldPrice> {
  const res = await fetch(GOLD_PRICE_URL);
  if (!res.ok) throw new Error(`Gold price API error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return {
    pricePerGramUSD: data.pricePerGramUSD,
    lastUpdated: data.timestamp ?? new Date().toISOString(),
  };
}
