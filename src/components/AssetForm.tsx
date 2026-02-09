import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Asset, GoldKarat, Currency } from '../types';

const KARATS: GoldKarat[] = [24, 22, 21, 18];
const CURRENCIES: Currency[] = ['USD', 'EUR', 'SYP', 'TRY', 'AED', 'SAR'];

interface Props {
  onAddAsset: (asset: Asset) => void;
}

export default function AssetForm({ onAddAsset }: Props) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'gold' | 'currency'>('gold');

  // Gold form state
  const [karat, setKarat] = useState<GoldKarat>(21);
  const [weight, setWeight] = useState('');

  // Currency form state
  const [currency, setCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');

  const handleAddGold = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    onAddAsset({
      id: crypto.randomUUID(),
      type: 'gold',
      karat,
      weightGrams: w,
    });
    setWeight('');
  };

  const handleAddCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a || a <= 0) return;
    onAddAsset({
      id: crypto.randomUUID(),
      type: 'currency',
      currency,
      amount: a,
    });
    setAmount('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setTab('gold')}
          className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer ${
            tab === 'gold'
              ? 'text-amber-700 border-b-2 border-amber-500 bg-amber-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('asset.gold')}
        </button>
        <button
          type="button"
          onClick={() => setTab('currency')}
          className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer ${
            tab === 'currency'
              ? 'text-emerald-700 border-b-2 border-emerald-500 bg-emerald-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('asset.currency')}
        </button>
      </div>

      <div className="p-4">
        {tab === 'gold' ? (
          <form onSubmit={handleAddGold} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('asset.karat')}</label>
              <select
                value={karat}
                onChange={e => setKarat(Number(e.target.value) as GoldKarat)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {KARATS.map(k => (
                  <option key={k} value={k}>{t(`gold.${k}`)}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('asset.weight')}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
              >
                {t('asset.add_gold')}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAddCurrency} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('asset.currency')}</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CURRENCIES.map(c => (
                  <option key={c} value={c}>{t(`currency.${c}`)} ({c})</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('asset.amount')}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                {t('asset.add_currency')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
