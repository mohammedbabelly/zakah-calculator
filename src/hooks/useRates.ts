import { useState, useEffect, useCallback } from 'react';
import type { ExchangeRates, GoldPrice, FetchStatus } from '../types';
import { fetchExchangeRates, fetchGoldPrice } from '../utils/api';

const CACHE_KEY_RATES = 'zakah-rates';
const CACHE_KEY_GOLD = 'zakah-gold-price';

function loadCached<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCache(key: string, data: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore quota errors */ }
}

export function useRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(loadCached(CACHE_KEY_RATES));
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(loadCached(CACHE_KEY_GOLD));
  const [status, setStatus] = useState<FetchStatus>('idle');

  const fetchAll = useCallback(async () => {
    setStatus('loading');
    try {
      const [ratesData, goldData] = await Promise.all([
        fetchExchangeRates(),
        fetchGoldPrice(),
      ]);
      setRates(ratesData);
      setGoldPrice(goldData);
      saveCache(CACHE_KEY_RATES, ratesData);
      saveCache(CACHE_KEY_GOLD, goldData);
      setStatus('success');
    } catch {
      // If we have cached data, still consider it a partial success
      if (rates && goldPrice) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }
  }, [rates, goldPrice]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setManualRates = (manualGoldPrice: number, manualRates: Record<string, number>) => {
    const newGold: GoldPrice = { pricePerGramUSD: manualGoldPrice, lastUpdated: 'manual' };
    const newRates: ExchangeRates = { base: 'USD', rates: manualRates, lastUpdated: 'manual' };
    setGoldPrice(newGold);
    setRates(newRates);
    saveCache(CACHE_KEY_GOLD, newGold);
    saveCache(CACHE_KEY_RATES, newRates);
    setStatus('success');
  };

  return { rates, goldPrice, status, refetch: fetchAll, setManualRates };
}
