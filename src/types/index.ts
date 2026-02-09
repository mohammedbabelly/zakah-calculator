export type GoldKarat = 18 | 21 | 22 | 24;

export type Currency = 'USD' | 'EUR' | 'SYP' | 'TRY' | 'AED' | 'SAR';

export interface GoldAsset {
  id: string;
  type: 'gold';
  karat: GoldKarat;
  weightGrams: number;
}

export interface CurrencyAsset {
  id: string;
  type: 'currency';
  currency: Currency;
  amount: number;
}

export type Asset = GoldAsset | CurrencyAsset;

export interface ExchangeRates {
  base: 'USD';
  rates: Record<string, number>;
  lastUpdated: string;
}

export interface GoldPrice {
  pricePerGramUSD: number;
  lastUpdated: string;
}

export interface ZakahResult {
  totalValueUSD: number;
  nisabValueUSD: number;
  isAboveNisab: boolean;
  zakahAmountUSD: number;
  zakahAmounts: Record<Currency, number>;
  breakdown: {
    goldValueUSD: number;
    currencyValueUSD: number;
  };
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';
