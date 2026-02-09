import { useMemo } from 'react';
import type { Asset, ExchangeRates, GoldPrice, ZakahResult } from '../types';
import { calculateZakah } from '../utils/zakah';

export function useZakahCalculation(
  assets: Asset[],
  rates: ExchangeRates | null,
  goldPrice: GoldPrice | null,
): ZakahResult | null {
  return useMemo(() => {
    if (!rates || !goldPrice || assets.length === 0) return null;
    return calculateZakah(assets, rates, goldPrice);
  }, [assets, rates, goldPrice]);
}
