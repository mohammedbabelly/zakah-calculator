import type { Asset, Currency, ExchangeRates, GoldAsset, GoldKarat, GoldPrice, ZakahResult } from '../types';

export const NISAB_GOLD_GRAMS = 85;
export const ZAKAH_RATE = 0.025;

export const GOLD_PURITY: Record<GoldKarat, number> = {
  24: 1.0,
  22: 22 / 24,
  21: 21 / 24,
  18: 18 / 24,
};

export function goldAssetToUSD(asset: GoldAsset, pricePerGram24k: number): number {
  return asset.weightGrams * GOLD_PURITY[asset.karat] * pricePerGram24k;
}

export function currencyToUSD(amount: number, currency: Currency, rates: Record<string, number>): number {
  if (currency === 'USD') return amount;
  const rate = rates[currency];
  if (!rate || rate === 0) return 0;
  return amount / rate;
}

export function calculateZakah(assets: Asset[], rates: ExchangeRates, goldPrice: GoldPrice): ZakahResult {
  const pricePerGram = goldPrice.pricePerGramUSD;

  let goldValueUSD = 0;
  let currencyValueUSD = 0;

  for (const asset of assets) {
    if (asset.type === 'gold') {
      goldValueUSD += goldAssetToUSD(asset, pricePerGram);
    } else {
      currencyValueUSD += currencyToUSD(asset.amount, asset.currency, rates.rates);
    }
  }

  const totalValueUSD = goldValueUSD + currencyValueUSD;
  const nisabValueUSD = NISAB_GOLD_GRAMS * pricePerGram;
  const isAboveNisab = totalValueUSD >= nisabValueUSD;
  const zakahAmountUSD = isAboveNisab ? totalValueUSD * ZAKAH_RATE : 0;

  const currencies: Currency[] = ['USD', 'EUR', 'SYP', 'TRY', 'AED', 'SAR'];
  const zakahAmounts = {} as Record<Currency, number>;
  for (const c of currencies) {
    if (c === 'USD') {
      zakahAmounts[c] = zakahAmountUSD;
    } else {
      zakahAmounts[c] = zakahAmountUSD * (rates.rates[c] || 0);
    }
  }

  return {
    totalValueUSD,
    nisabValueUSD,
    isAboveNisab,
    zakahAmountUSD,
    zakahAmounts,
    breakdown: { goldValueUSD, currencyValueUSD },
  };
}
