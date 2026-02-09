import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Asset } from './types';
import { useRates } from './hooks/useRates';
import { useZakahCalculation } from './hooks/useZakahCalculation';
import Header from './components/Header';
import AssetForm from './components/AssetForm';
import AssetList from './components/AssetList';
import ZakahResult from './components/ZakahResult';
import CurrentRates from './components/CurrentRates';
import ManualRatesModal from './components/ManualRatesModal';

const STORAGE_KEY = 'zakah-assets';

function loadAssets(): Asset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const { i18n } = useTranslation();
  const [assets, setAssets] = useState<Asset[]>(loadAssets);
  const [showManual, setShowManual] = useState(false);
  const { rates, goldPrice, status, refetch, setManualRates } = useRates();
  const result = useZakahCalculation(assets, rates, goldPrice);

  // Persist assets to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  }, [assets]);

  // Set document direction and language
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const addAsset = useCallback((asset: Asset) => {
    setAssets(prev => [...prev, asset]);
  }, []);

  const removeAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAssets([]);
  }, []);

  const handleManualSave = (goldPriceVal: number, ratesVal: Record<string, number>) => {
    setManualRates(goldPriceVal, ratesVal);
    setShowManual(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 pb-12 space-y-4">
        <AssetForm onAddAsset={addAsset} />
        <AssetList
          assets={assets}
          rates={rates}
          goldPrice={goldPrice}
          onRemoveAsset={removeAsset}
          onClearAll={clearAll}
        />
        <CurrentRates rates={rates} goldPrice={goldPrice} />
        <ZakahResult
          result={result}
          status={status}
          onRetry={refetch}
          onManualEntry={() => setShowManual(true)}
        />
      </main>

      {showManual && (
        <ManualRatesModal
          onSave={handleManualSave}
          onCancel={() => setShowManual(false)}
        />
      )}
    </div>
  );
}
